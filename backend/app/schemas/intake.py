from pydantic import BaseModel
from typing import Optional, Any
from uuid import UUID
from datetime import datetime

class SessionStatus(BaseModel):
    public_token: str
    state: str
    patient_name: str
    patient_age: Optional[int] = None
    patient_sex: Optional[str] = None
    verification_status: Optional[str] = "UNVERIFIED"
    verification_method: Optional[str] = None
    verification_source: Optional[str] = None
    verified_at: Optional[datetime] = None
    verification_reference: Optional[str] = None
    abha_number: Optional[str] = None
    abha_address: Optional[str] = None
    language: str


class ABDMStatusResponse(BaseModel):
    environment: str
    is_sandbox: bool
    is_configured: bool
    gateway_url: str
    supported_methods: list[str]


class ABDMRequestOTPPayload(BaseModel):
    auth_mode: str  # "AADHAAR_OTP" | "ABHA_OTP" | "MOBILE_OTP"
    identifier: str


class ABDMRequestOTPResponse(BaseModel):
    success: bool
    txn_id: Optional[str] = None
    message: str
    error_code: Optional[str] = None


class ABDMVerifyOTPPayload(BaseModel):
    auth_mode: str
    txn_id: str
    otp: str


class ABDMVerifyOTPResponse(BaseModel):
    success: bool
    verification_status: str
    verification_source: str
    verification_method: str
    patient_name: str
    abha_number: str
    abha_address: str
    age: Optional[int] = None
    gender: Optional[str] = None
    message: str
    has_conflict: bool = False
    error_code: Optional[str] = None

class ConsentPayload(BaseModel):
    agreed: bool
    scope: list[str]

class NextQuestionResponse(BaseModel):
    is_complete: bool
    question_id: Optional[UUID] = None
    text: Optional[str] = None
    target_slot: Optional[str] = None
    phase: Optional[str] = None

class AnswerPayload(BaseModel):
    question_id: UUID
    target_slot: str
    raw_text: str
    evidence_id: Optional[UUID] = None

class ExtractedFact(BaseModel):
    slot: str
    value: dict[str, Any]
    status: str

class ReviewSummary(BaseModel):
    facts: list[ExtractedFact]
