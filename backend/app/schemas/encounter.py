from pydantic import BaseModel
from typing import Optional, Any
from uuid import UUID
from datetime import datetime

class ClinicalFactResponse(BaseModel):
    id: UUID
    slot: str
    value: dict[str, Any]
    status: str
    confidence: Optional[float] = None
    updated_at: datetime

class PatientDemographics(BaseModel):
    id: UUID
    full_name: str
    age: Optional[int]
    sex: Optional[str]
    phone: Optional[str]

from app.schemas.clinical import StructuredSummaryResult

class TimelineEventResponse(BaseModel):
    fact_id: str
    slot: str
    value: dict[str, Any]
    status: str
    event_date: str
    is_approximate: bool
    source_type: str
    evidence_id: Optional[str] = None

class ConflictResponse(BaseModel):
    id: UUID
    slot: str
    fact_id_1: str
    fact_id_2: Optional[str] = None
    relationship_status: str
    resolution_notes: Optional[str] = None
    fact_1_value: Optional[dict[str, Any]] = None
    fact_2_value: Optional[dict[str, Any]] = None
    fact_1_source: Optional[str] = None
    fact_2_source: Optional[str] = None

class SafetyAlertResponse(BaseModel):
    id: UUID
    rule_id: str
    alert_category: str
    deterministic_explanation: str
    status: str
    matched_fact_ids: list[str]
    evidence_ids: list[str]

class EncounterOverviewResponse(BaseModel):
    id: UUID
    opd_id: str
    status: str
    triage_level: str
    specialty: str
    created_at: datetime
    patient: PatientDemographics
    clinical_facts: list[ClinicalFactResponse]
    timeline: list[TimelineEventResponse] = []
    conflicts: list[ConflictResponse] = []
    safety_alerts: list[SafetyAlertResponse] = []
    summary: Optional[StructuredSummaryResult] = None

class FactEditPayload(BaseModel):
    value: dict[str, Any]

class FactCreatePayload(BaseModel):
    slot: str
    value: dict[str, Any]
