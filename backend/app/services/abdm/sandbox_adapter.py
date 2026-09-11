import uuid
import logging
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List, Optional
import httpx

from app.core.config import settings
from app.services.abdm.base import AbstractABDMAdapter, ABDMAuthResult, ABDMProfile
from app.services.abdm.crypto import encrypt_abdm_data

logger = logging.getLogger(__name__)


class ABDMSandboxAdapter(AbstractABDMAdapter):
    """
    Production-grade official NHA ABDM V3 Sandbox Adapter.
    Communicates with https://dev.abdm.gov.in and https://abhasbx.abdm.gov.in/abha/api.
    Implements token caching, RSA-OAEP payload encryption, and strict error classification.
    """

    def __init__(self):
        self._gateway_url = settings.abdm_gateway_url.rstrip("/")
        abha_base = settings.abdm_abha_url.rstrip("/")
        if not abha_base.endswith("/abha/api"):
            abha_base = f"{abha_base}/abha/api"
        self._abha_url = abha_base
        self._client_id = settings.abdm_client_id
        self._client_secret = settings.abdm_client_secret
        self._x_cm_id = settings.abdm_x_cm_id or "sbx"

        # Token caching
        self._session_token: Optional[str] = None
        self._token_expires_at: Optional[datetime] = None

        # Certificate caching
        self._cached_cert: Optional[str] = None
        self._cert_expires_at: Optional[datetime] = None

    @property
    def environment_name(self) -> str:
        return "OFFICIAL_ABDM_SANDBOX"

    def _get_common_headers(self, with_auth: bool = True) -> Dict[str, str]:
        headers = {
            "REQUEST-ID": str(uuid.uuid4()),
            "TIMESTAMP": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%fZ")[:-3] + "Z",
            "X-CM-ID": self._x_cm_id,
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        return headers

    async def get_session_token(self) -> str:
        """
        Acquires or reuses cached session token from:
        POST /api/hiecm/gateway/v3/sessions
        """
        now = datetime.now(timezone.utc)
        if self._session_token and self._token_expires_at and now < self._token_expires_at:
            return self._session_token

        if not self._client_id or not self._client_secret:
            raise ValueError(
                "ABDM Sandbox credentials (CLIENT_ID, CLIENT_SECRET) are not configured. "
                "Please configure them in your server environment."
            )

        url = f"{self._gateway_url}/api/hiecm/gateway/v3/sessions"
        headers = self._get_common_headers(with_auth=False)
        payload = {
            "clientId": self._client_id,
            "clientSecret": self._client_secret,
            "grantType": "client_credentials"
        }

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(url, json=payload, headers=headers)
                if response.status_code != 200:
                    logger.error("ABDM Session Token Acquisition failed: HTTP %s", response.status_code)
                    err_json = response.json() if "application/json" in response.headers.get("content-type", "") else {}
                    err_msg = err_json.get("message") or err_json.get("error_description") or response.text
                    raise RuntimeError(f"ABDM Gateway Authentication Failed ({response.status_code}): {err_msg}")

                data = response.json()
                self._session_token = data.get("accessToken")
                expires_in = int(data.get("expiresIn", 1200))
                # Expire 60 seconds before official expiry for safe buffer
                self._token_expires_at = now + timedelta(seconds=max(60, expires_in - 60))
                return self._session_token

        except httpx.RequestError as e:
            logger.error("Network error reaching ABDM Gateway sessions endpoint: %s", str(e))
            raise RuntimeError(f"Unable to reach ABDM Gateway at {self._gateway_url}: {str(e)}")

    async def get_public_certificate(self) -> Dict[str, str]:
        """
        Retrieves the public encryption certificate from:
        GET /v3/profile/public/certificate
        """
        now = datetime.now(timezone.utc)
        if self._cached_cert and self._cert_expires_at and now < self._cert_expires_at:
            return {"publicKey": self._cached_cert, "encryptionAlgorithm": "RSA/ECB/OAEPWithSHA-1AndMGF1Padding"}

        token = await self.get_session_token()
        url = f"{self._abha_url}/v3/profile/public/certificate"
        headers = self._get_common_headers()
        headers["Authorization"] = f"Bearer {token}"

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.get(url, headers=headers)
                if response.status_code != 200:
                    raise RuntimeError(f"Failed to fetch ABDM Public Certificate: HTTP {response.status_code}")

                data = response.json()
                self._cached_cert = data.get("publicKey")
                self._cert_expires_at = now + timedelta(hours=6)
                return data
        except httpx.RequestError as e:
            raise RuntimeError(f"Network error fetching ABDM public certificate: {str(e)}")

    async def request_otp(
        self,
        login_hint: str,
        login_id: str,
        otp_system: str,
        scope: List[str]
    ) -> Dict[str, Any]:
        """
        Official NHA V3: POST /v3/profile/login/request/otp
        Encrypts login_id with ABDM public key before sending.
        """
        token = await self.get_session_token()
        cert_data = await self.get_public_certificate()
        public_key = cert_data.get("publicKey")

        # Official encryption rule
        encrypted_login_id = encrypt_abdm_data(login_id, public_key)

        url = f"{self._abha_url}/v3/profile/login/request/otp"
        headers = self._get_common_headers()
        headers["Authorization"] = f"Bearer {token}"

        payload = {
            "scope": scope,
            "loginHint": login_hint,
            "loginId": encrypted_login_id,
            "otpSystem": otp_system
        }

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(url, json=payload, headers=headers)
                data = response.json() if "application/json" in response.headers.get("content-type", "") else {}

                if response.status_code != 200:
                    error_msg = data.get("message") or data.get("details", [{}])[0].get("message") or response.text
                    logger.warning("ABDM Request OTP rejected: HTTP %s - %s", response.status_code, error_msg)
                    return {
                        "success": False,
                        "error_code": str(data.get("code") or response.status_code),
                        "error_message": error_msg
                    }

                return {
                    "success": True,
                    "txn_id": data.get("txnId"),
                    "message": data.get("message", "OTP sent successfully")
                }
        except httpx.RequestError as e:
            logger.error("Network failure during ABDM OTP request: %s", str(e))
            return {
                "success": False,
                "error_code": "NETWORK_TIMEOUT",
                "error_message": f"Could not connect to ABDM sandbox: {str(e)}"
            }

    async def verify_otp(
        self,
        txn_id: str,
        otp_value: str,
        scope: List[str]
    ) -> ABDMAuthResult:
        """
        Official NHA V3: POST /v3/profile/login/verify
        Encrypts otp_value with ABDM public key.
        """
        token = await self.get_session_token()
        cert_data = await self.get_public_certificate()
        public_key = cert_data.get("publicKey")

        encrypted_otp = encrypt_abdm_data(otp_value, public_key)

        url = f"{self._abha_url}/v3/profile/login/verify"
        headers = self._get_common_headers()
        headers["Authorization"] = f"Bearer {token}"

        payload = {
            "scope": scope,
            "authData": {
                "authMethods": ["otp"],
                "otp": {
                    "txnId": txn_id,
                    "otpValue": encrypted_otp
                }
            }
        }

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(url, json=payload, headers=headers)
                data = response.json() if "application/json" in response.headers.get("content-type", "") else {}

                if response.status_code != 200:
                    error_msg = data.get("message") or data.get("details", [{}])[0].get("message") or response.text
                    logger.warning("ABDM Verify OTP failed: HTTP %s - %s", response.status_code, error_msg)
                    return ABDMAuthResult(
                        success=False,
                        txn_id=txn_id,
                        error_code=str(data.get("code") or response.status_code),
                        error_detail=error_msg,
                        message=error_msg
                    )

                return ABDMAuthResult(
                    success=True,
                    txn_id=data.get("txnId"),
                    auth_result=data.get("authResult", "success"),
                    message=data.get("message", "OTP verified successfully"),
                    token=data.get("token"),
                    accounts=data.get("accounts", [])
                )
        except httpx.RequestError as e:
            logger.error("Network failure during ABDM OTP verification: %s", str(e))
            return ABDMAuthResult(
                success=False,
                txn_id=txn_id,
                error_code="NETWORK_TIMEOUT",
                error_detail=str(e),
                message="ABDM Gateway unreachable during OTP verification"
            )

    async def get_account_profile(self, user_token: str) -> ABDMProfile:
        """
        Official NHA V3: GET /v3/profile/account
        Retrieves verified demographic attributes.
        """
        gateway_token = await self.get_session_token()
        url = f"{self._abha_url}/v3/profile/account"
        headers = self._get_common_headers()
        headers["Authorization"] = f"Bearer {gateway_token}"
        headers["X-Token"] = f"Bearer {user_token}"

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.get(url, headers=headers)
                if response.status_code != 200:
                    raise RuntimeError(f"ABDM Profile retrieval failed: HTTP {response.status_code} - {response.text}")

                data = response.json()
                
                # Parse birth details
                yob = data.get("yearOfBirth")
                mob = data.get("monthOfBirth")
                dob = data.get("dayOfBirth")
                
                # Calculate age if yob present
                age = None
                if yob:
                    try:
                        current_year = datetime.now().year
                        age = current_year - int(yob)
                    except (ValueError, TypeError):
                        pass

                return ABDMProfile(
                    name=data.get("name") or f"{data.get('firstName', '')} {data.get('lastName', '')}".strip(),
                    gender=data.get("gender"),
                    year_of_birth=int(yob) if yob else None,
                    month_of_birth=int(mob) if mob else None,
                    day_of_birth=int(dob) if dob else None,
                    age=age,
                    abha_number=str(data.get("ABHANumber") or data.get("abhaNumber") or ""),
                    abha_address=str(data.get("preferredAbhaAddress") or data.get("abhaAddress") or ""),
                    mobile=data.get("mobile") or data.get("phoneNumber"),
                    address_line=data.get("address") or data.get("addressLine"),
                    district=data.get("districtName") or data.get("district"),
                    state=data.get("stateName") or data.get("state"),
                    pincode=data.get("pinCode") or data.get("pincode"),
                    photo_base64=data.get("profilePhoto"),
                    raw_response=data
                )
        except httpx.RequestError as e:
            raise RuntimeError(f"Network error while retrieving ABDM profile: {str(e)}")

    async def process_scan_and_share(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Processes Scan & Share OPD Token check-in packet:
        POST /api/hiecm/patient-share/v3/share
        """
        profile = payload.get("profile", {}).get("patient", {})
        if not profile:
            raise ValueError("Invalid Scan & Share packet: missing patient profile")

        yob = profile.get("yearOfBirth")
        age = None
        if yob:
            try:
                age = datetime.now().year - int(yob)
            except (ValueError, TypeError):
                pass

        addr = profile.get("address", {})
        address_line = addr.get("line") if isinstance(addr, dict) else str(addr)

        return {
            "success": True,
            "intent": payload.get("intent", "PROFILE_SHARE"),
            "token_number": f"OPD-TKN-{uuid.uuid4().hex[:6].upper()}",
            "profile": ABDMProfile(
                name=profile.get("name", "Unknown"),
                gender=profile.get("gender"),
                year_of_birth=int(yob) if yob else None,
                age=age,
                abha_number=str(profile.get("abhaNumber", "")),
                abha_address=str(profile.get("abhaAddress", "")),
                mobile=profile.get("phoneNumber"),
                address_line=address_line,
                district=addr.get("district") if isinstance(addr, dict) else None,
                state=addr.get("state") if isinstance(addr, dict) else None,
                pincode=addr.get("pincode") if isinstance(addr, dict) else None,
                raw_response=payload
            )
        }
