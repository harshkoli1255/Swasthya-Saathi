from pydantic import BaseModel
from typing import Optional, Any
from uuid import UUID

class SessionStatus(BaseModel):
    public_token: str
    state: str
    patient_name: str
    patient_age: Optional[int] = None
    patient_sex: Optional[str] = None
    language: str

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
