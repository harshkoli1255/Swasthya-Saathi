from pydantic import BaseModel, ConfigDict
from datetime import datetime
import uuid


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in_minutes: int
    user_id: str
    full_name: str
    role: str


class LoginRequest(BaseModel):
    username: str
    password: str


class UserPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    username: str
    full_name: str
    role: str
    facility: str | None = None
    is_active: bool


class PatientCreate(BaseModel):
    full_name: str
    age: int | None = None
    sex: str | None = None
    phone: str | None = None
    abha_id: str | None = None  # Optional; not mandatory for MVP


class PatientPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    full_name: str
    age: int | None = None
    sex: str | None = None
    phone: str | None = None
    abha_id: str | None = None
    created_at: datetime


class EncounterCreate(BaseModel):
    patient_id: uuid.UUID
    opd_id: str  # Required OPD/visit identifier
    specialty: str = "AYURVEDA"
    facility: str | None = None


class EncounterPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    opd_id: str
    patient_id: uuid.UUID
    specialty: str
    status: str
    triage_level: str
    created_at: datetime


class QueuePatientCard(BaseModel):
    """Compact patient card displayed in the doctor queue."""
    encounter_id: uuid.UUID
    opd_id: str
    patient_name: str
    patient_age: int | None = None
    patient_sex: str | None = None
    chief_complaint: str | None = None
    triage_level: str  # ROUTINE | URGENT | EMERGENCY
    status: str
    wait_minutes: int
    unresolved_conflicts: int = 0
    red_flag_count: int = 0
    created_at: datetime


class HealthResponse(BaseModel):
    status: str
    version: str
    environment: str
