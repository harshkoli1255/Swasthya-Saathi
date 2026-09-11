from abc import ABC, abstractmethod
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field
from datetime import datetime


class ABDMProfile(BaseModel):
    name: str
    gender: Optional[str] = None
    year_of_birth: Optional[int] = None
    month_of_birth: Optional[int] = None
    day_of_birth: Optional[int] = None
    age: Optional[int] = None
    abha_number: str
    abha_address: str
    mobile: Optional[str] = None
    address_line: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    photo_base64: Optional[str] = None
    raw_response: Dict[str, Any] = Field(default_factory=dict)


class ABDMAuthResult(BaseModel):
    success: bool
    txn_id: Optional[str] = None
    auth_result: Optional[str] = None
    message: Optional[str] = None
    error_code: Optional[str] = None
    error_detail: Optional[str] = None
    token: Optional[str] = None
    accounts: List[Dict[str, Any]] = Field(default_factory=list)


class AbstractABDMAdapter(ABC):
    """
    Abstract contract for ABDM interoperability.
    Separates external HTTP/WSO2 transport from SwasthyaSaathi domain logic.
    """

    @property
    @abstractmethod
    def environment_name(self) -> str:
        """Returns the canonical environment: 'OFFICIAL_ABDM_SANDBOX' or 'LOCAL_DEV_MOCK'"""
        pass

    @abstractmethod
    async def get_session_token(self) -> str:
        """Acquires a valid gateway access token via client_credentials grant."""
        pass

    @abstractmethod
    async def get_public_certificate(self) -> Dict[str, str]:
        """Fetches the active RSA public key certificate from ABDM for payload encryption."""
        pass

    @abstractmethod
    async def request_otp(
        self,
        login_hint: str,
        login_id: str,
        otp_system: str,
        scope: List[str]
    ) -> Dict[str, Any]:
        """
        Dispatches an OTP request to NHA gateway.
        Handles RSA-OAEP encryption of login_id.
        Returns dict with txnId, message, etc.
        """
        pass

    @abstractmethod
    async def verify_otp(
        self,
        txn_id: str,
        otp_value: str,
        scope: List[str]
    ) -> ABDMAuthResult:
        """
        Submits encrypted OTP to NHA gateway.
        Returns ABDMAuthResult with user token and account metadata.
        """
        pass

    @abstractmethod
    async def get_account_profile(self, user_token: str) -> ABDMProfile:
        """
        Retrieves full KYC profile from ABDM /v3/profile/account.
        """
        pass

    @abstractmethod
    async def process_scan_and_share(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Handles OPD Scan & Share demographic packet.
        """
        pass
