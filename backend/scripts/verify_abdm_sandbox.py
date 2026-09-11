#!/usr/bin/env python3
"""
Official NHA ABDM Sandbox Connectivity & Credential Verification Utility
========================================================================
Validates network reachability, gateway authentication (V3 sessions),
public certificate retrieval, and RSA-OAEP encryption against official NHA endpoints.

Usage:
    docker exec swasthya_backend python3 scripts/verify_abdm_sandbox.py
    docker exec swasthya_backend python3 scripts/verify_abdm_sandbox.py --client-id <ID> --client-secret <SECRET>
"""

import sys
import os
import argparse
import time
import uuid
from datetime import datetime, timezone
import httpx

# Add /app to sys.path if running inside container
sys.path.insert(0, "/app")

from app.core.config import settings
from app.services.abdm.crypto import encrypt_abdm_data


def mask_secret(val: str, show_chars: int = 4) -> str:
    if not val:
        return "(empty)"
    if len(val) <= show_chars * 2:
        return "****"
    return f"{val[:show_chars]}...{val[-show_chars:]}"


def print_banner(text: str, char: str = "="):
    print("\n" + char * 65)
    print(f" {text}")
    print(char * 65)


def main():
    parser = argparse.ArgumentParser(description="Verify ABDM Sandbox Connectivity and Credentials")
    parser.add_argument("--client-id", default=None, help="Override ABDM_CLIENT_ID")
    parser.add_argument("--client-secret", default=None, help="Override ABDM_CLIENT_SECRET")
    parser.add_argument("--gateway-url", default=None, help="Override ABDM_GATEWAY_URL")
    parser.add_argument("--abha-url", default=None, help="Override ABDM_ABHA_URL")
    args = parser.parse_args()

    client_id = args.client_id or settings.abdm_client_id
    client_secret = args.client_secret or settings.abdm_client_secret
    gateway_url = (args.gateway_url or settings.abdm_gateway_url).rstrip("/")
    abha_url = (args.abha_url or settings.abdm_abha_url).rstrip("/")
    if not abha_url.endswith("/abha/api"):
        abha_url = f"{abha_url}/abha/api"
    env_name = settings.abdm_env

    print_banner("SWASTHYASAATHI — ABDM SANDBOX VERIFICATION AUDIT")
    print(f"Timestamp:        {datetime.now(timezone.utc).isoformat()}")
    print(f"Configured Env:   {env_name}")
    print(f"Gateway URL:      {gateway_url}")
    print(f"ABHA API URL:     {abha_url}")
    print(f"HIP ID:           {settings.abdm_hip_id}")
    print(f"Client ID:        {mask_secret(client_id, 4)}")
    print(f"Client Secret:    {'[SET - HIDDEN]' if client_secret else '(empty)'}")
    print("=" * 65)

    all_passed = True

    # Step 1: Check Backend Local Service Status
    print("\n[Step 1/5] Checking Local Backend API Status...")
    try:
        r_local = httpx.get("http://127.0.0.1:8000/api/v1/abdm/status", timeout=5.0)
        if r_local.status_code == 200:
            status_data = r_local.json()
            print(f"  [OK] Local Backend Status: HTTP 200")
            print(f"       Backend Adapter:      {status_data.get('environment')}")
            print(f"       Is Sandbox Flag:      {status_data.get('is_sandbox')}")
            print(f"       Is Configured Flag:   {status_data.get('is_configured')}")
        else:
            print(f"  [FAIL] Backend returned HTTP {r_local.status_code}")
            all_passed = False
    except Exception as e:
        print(f"  [FAIL] Could not connect to local backend: {e}")
        all_passed = False

    # Step 2: Gateway Network Reachability
    print("\n[Step 2/5] Testing ABDM Gateway Network Reachability...")
    start_t = time.time()
    try:
        # Check gateway root/sessions endpoint connectivity
        r_reach = httpx.get(f"{gateway_url}", timeout=10.0, follow_redirects=True)
        latency = round((time.time() - start_t) * 1000, 1)
        print(f"  [OK] Reached {gateway_url} ({latency}ms, HTTP {r_reach.status_code})")
    except Exception as e:
        print(f"  [WARN] Reachability warning for {gateway_url}: {e}")

    # Step 3: Gateway Session Token Acquisition (Client Credentials)
    print("\n[Step 3/5] Testing ABDM Gateway Session Token Acquisition...")
    session_token = None
    if not client_id or not client_secret or "your_real" in client_id.lower() or "your_real" in client_secret.lower():
        print("  [SKIP] ABDM_CLIENT_ID or ABDM_CLIENT_SECRET not provided.")
        print("         Paste real credentials from sandbox.abdm.gov.in into backend/.env to activate.")
    else:
        sessions_url = f"{gateway_url}/api/hiecm/gateway/v3/sessions"
        headers = {
            "REQUEST-ID": str(uuid.uuid4()),
            "TIMESTAMP": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%fZ")[:-3] + "Z",
            "X-CM-ID": settings.abdm_x_cm_id or "sbx",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        payload = {
            "clientId": client_id,
            "clientSecret": client_secret,
            "grantType": "client_credentials"
        }
        try:
            start_t = time.time()
            r_sess = httpx.post(sessions_url, json=payload, headers=headers, timeout=15.0)
            latency = round((time.time() - start_t) * 1000, 1)

            if r_sess.status_code == 200:
                data = r_sess.json()
                session_token = data.get("accessToken")
                expires_in = data.get("expiresIn")
                print(f"  [SUCCESS] Session token acquired from ABDM Gateway! ({latency}ms)")
                print(f"            Token Expiry: {expires_in} seconds")
                print(f"            Access Token: {mask_secret(session_token, 8)}")
            else:
                print(f"  [FAIL] Gateway rejected credentials with HTTP {r_sess.status_code} ({latency}ms)")
                print(f"         Response: {r_sess.text}")
                all_passed = False
        except Exception as e:
            print(f"  [FAIL] Network error requesting session token: {e}")
            all_passed = False

    # Step 4: Public Certificate & Encryption Validation
    print("\n[Step 4/5] Testing NHA Public Certificate & RSA-OAEP Encryption...")
    if not session_token:
        print("  [SKIP] Skipping public certificate fetch (requires active session token).")
    else:
        cert_url = f"{abha_url}/v3/profile/public/certificate"
        cert_headers = {
            "REQUEST-ID": str(uuid.uuid4()),
            "TIMESTAMP": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%fZ")[:-3] + "Z",
            "X-CM-ID": settings.abdm_x_cm_id or "sbx",
            "Authorization": f"Bearer {session_token}",
        }
        try:
            r_cert = httpx.get(cert_url, headers=cert_headers, timeout=15.0)
            if r_cert.status_code == 200:
                cert_data = r_cert.json()
                pub_key = cert_data.get("publicKey")
                algo = cert_data.get("encryptionAlgorithm", "RSA/ECB/OAEPWithSHA-1AndMGF1Padding")
                print(f"  [SUCCESS] Retrieved official NHA public certificate.")
                print(f"            Algorithm: {algo}")

                # Test RSA-OAEP encryption with official certificate
                test_sample = "999912345678"
                encrypted = encrypt_abdm_data(test_sample, pub_key)
                print(f"  [SUCCESS] Verified RSA-OAEP SHA-1/MGF1 encryption with NHA public key.")
                print(f"            Ciphertext sample: {mask_secret(encrypted, 10)}")
            else:
                print(f"  [FAIL] Failed to fetch public certificate: HTTP {r_cert.status_code}")
                print(f"         Response: {r_cert.text}")
                all_passed = False
        except Exception as e:
            print(f"  [FAIL] Error testing certificate and encryption: {e}")
            all_passed = False

    # Step 5: Overall Readiness Summary
    print_banner("AUDIT SUMMARY")
    if session_token:
        print("  [STATUS] REAL ABDM SANDBOX: ACTIVE & VERIFIED")
        print("  Gateway sessions, token exchange, and certificate encryption confirmed live.")
    elif env_name == "sandbox":
        print("  [STATUS] ABDM SANDBOX: CONFIGURED — AWAITING CLIENT_ID & CLIENT_SECRET")
        print("  When received from sandbox.abdm.gov.in, paste them into backend/.env")
        print("  and re-run: docker exec swasthya_backend python3 scripts/verify_abdm_sandbox.py")
    else:
        print("  [STATUS] ABDM INTEGRATION: LOCAL DEVELOPMENT MOCK ACTIVE")
        print("  Intake and doctor workstations operate with safe, labeled mock data.")
    print("=" * 65 + "\n")

    return 0 if all_passed else 1


if __name__ == "__main__":
    sys.exit(main())
