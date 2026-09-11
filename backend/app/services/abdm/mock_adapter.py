import uuid
from typing import Dict, Any, List, Optional
from app.services.abdm.base import AbstractABDMAdapter, ABDMAuthResult, ABDMProfile


class LocalDevelopmentMockAdapter(AbstractABDMAdapter):
    """
    Explicit, controlled mock adapter reserved STRICTLY for offline local development and unit tests.
    Every output explicitly identifies its source as 'LOCAL_DEV_MOCK' to ensure it can NEVER
    be mistaken for real NHA ABDM Sandbox verification.
    """

    @property
    def environment_name(self) -> str:
        return "LOCAL_DEV_MOCK"

    async def get_session_token(self) -> str:
        return f"local-mock-token-{uuid.uuid4().hex[:8]}"

    async def get_public_certificate(self) -> Dict[str, str]:
        return {
            "publicKey": "LOCAL_MOCK_PUBLIC_KEY",
            "encryptionAlgorithm": "RSA/ECB/OAEPWithSHA-1AndMGF1Padding"
        }

    async def request_otp(
        self,
        login_hint: str,
        login_id: str,
        otp_system: str,
        scope: List[str]
    ) -> Dict[str, Any]:
        # Clearly marked local mock response
        txn_id = f"local-mock-txn-{uuid.uuid4().hex[:8]}"
        return {
            "success": True,
            "txn_id": txn_id,
            "message": f"[LOCAL DEV MOCK] Test OTP sent for identifier {login_id[-4:] if len(login_id) >= 4 else login_id} (Use test code: 123456)",
            "is_local_mock": True
        }

    async def verify_otp(
        self,
        txn_id: str,
        otp_value: str,
        scope: List[str]
    ) -> ABDMAuthResult:
        if otp_value != "123456":
            return ABDMAuthResult(
                success=False,
                txn_id=txn_id,
                error_code="INVALID_OTP",
                message="[LOCAL DEV MOCK] Invalid OTP. Use 123456 in local development mode."
            )

        return ABDMAuthResult(
            success=True,
            txn_id=txn_id,
            auth_result="success",
            message="[LOCAL DEV MOCK] Verification succeeded",
            token=f"local-user-token-{uuid.uuid4().hex[:12]}",
            accounts=[
                {
                    "ABHANumber": "91-0000-0000-0001",
                    "preferredAbhaAddress": "dev.patient@sbx",
                    "name": "Dev Test Patient",
                    "status": "ACTIVE"
                }
            ]
        )

    async def get_account_profile(self, user_token: str) -> ABDMProfile:
        return ABDMProfile(
            name="Dev Test Patient (Local Mock)",
            gender="M",
            year_of_birth=1990,
            age=36,
            abha_number="91-0000-0000-0001",
            abha_address="dev.patient@sbx",
            mobile="9800000000",
            address_line="Local Development Environment",
            district="Test District",
            state="Test State",
            pincode="110001",
            raw_response={"is_local_mock": True}
        )

    async def process_scan_and_share(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "success": True,
            "intent": "PROFILE_SHARE",
            "token_number": f"DEV-TKN-{uuid.uuid4().hex[:4].upper()}",
            "profile": ABDMProfile(
                name="Dev Scan Patient",
                gender="F",
                year_of_birth=1995,
                age=31,
                abha_number="91-0000-0000-0002",
                abha_address="dev.scan@sbx",
                mobile="9800000001",
                raw_response={"is_local_mock": True}
            )
        }
