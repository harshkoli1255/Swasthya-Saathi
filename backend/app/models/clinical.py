import uuid
from typing import Optional
from sqlalchemy import String, Integer, ForeignKey, JSON, Text, Boolean, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from app.models.base import Base, UUIDMixin, TimestampMixin

class AyushAssessment(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "ayush_assessments"
    encounter_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("encounters.id"))
    specialty: Mapped[str] = mapped_column(String)
    prakriti: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    vikriti: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    agni: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    koshtha: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    sara: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    samhanana: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    pramana: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    satmya: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    sattva: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    vyayama_shakti: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    ahara: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    vihara: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    is_superseded: Mapped[bool] = mapped_column(Boolean, default=False)

class ProvenanceRecord(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "provenance_records"
    fact_table: Mapped[str] = mapped_column(String)
    fact_id: Mapped[uuid.UUID] = mapped_column(String) # For MVP use string
    source: Mapped[str] = mapped_column(String)
    session_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("intake_sessions.id"), nullable=True)
    document_id: Mapped[Optional[uuid.UUID]] = mapped_column(String, nullable=True) # Ignore FK for now
    recorded_at: Mapped[datetime] = mapped_column()
    confidence: Mapped[Optional[float]] = mapped_column(Float, nullable=True)

class Conflict(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "conflicts"
    encounter_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("encounters.id"))
    field: Mapped[str] = mapped_column(String)
    value_a_ref: Mapped[dict] = mapped_column(JSON)
    value_b_ref: Mapped[dict] = mapped_column(JSON)
    classification: Mapped[str] = mapped_column(String)
    is_resolved: Mapped[bool] = mapped_column(Boolean, default=False)
    resolved_by: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("users.id"), nullable=True)

class TimelineEvent(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "timeline_events"
    encounter_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("encounters.id"))
    event_type: Mapped[str] = mapped_column(String)
    event_date: Mapped[datetime] = mapped_column()
    description: Mapped[str] = mapped_column(String)
    source_ref: Mapped[dict] = mapped_column(JSON)
    
# Fake ClinicalFact model just so imports in other places don't crash, 
# although MVP used `ClinicalAnswer` instead or a different table?
# In `__init__.py` we imported ClinicalFact from clinical.py
class ClinicalFact(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "clinical_facts"
    encounter_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("encounters.id"))
    slot: Mapped[str] = mapped_column(String)
    value: Mapped[dict] = mapped_column(JSON)
    status: Mapped[str] = mapped_column(String)
    confidence: Mapped[float] = mapped_column(Float)
