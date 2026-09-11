import uuid
from typing import Optional
from sqlalchemy import String, Integer, ForeignKey, JSON, Text, Boolean, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from app.models.base import Base, UUIDMixin, TimestampMixin

class IntakeSession(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "intake_sessions"
    encounter_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("encounters.id"), index=True)
    public_token: Mapped[str] = mapped_column(String, index=True, unique=True)
    state: Mapped[str] = mapped_column(String)
    language: Mapped[str] = mapped_column(String)
    encounter = relationship("Encounter", back_populates="intake_session")
    turns = relationship("ConversationTurn", back_populates="session")

class ClinicalQuestion(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "clinical_questions"
    code: Mapped[str] = mapped_column(String)
    targets_slot: Mapped[str] = mapped_column(String)
    priority: Mapped[int] = mapped_column(Integer)
    phase: Mapped[str] = mapped_column(String)
    required_slots: Mapped[list] = mapped_column(JSON)
    language_variants: Mapped[dict] = mapped_column(JSON)

class ConversationTurn(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "conversation_turns"
    session_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("intake_sessions.id"), index=True)
    question_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("clinical_questions.id"), nullable=True)
    turn_number: Mapped[int] = mapped_column(Integer)
    raw_text: Mapped[str] = mapped_column(String)
    language: Mapped[str] = mapped_column(String)
    audio_storage_key: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    session = relationship("IntakeSession", back_populates="turns")
    answers = relationship("ClinicalAnswer", back_populates="turn")

class ClinicalAnswer(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "clinical_answers"
    turn_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("conversation_turns.id"), index=True)
    question_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("clinical_questions.id"), nullable=True)
    slot: Mapped[str] = mapped_column(String)
    value: Mapped[dict] = mapped_column(JSON)
    status: Mapped[str] = mapped_column(String)
    confidence: Mapped[float] = mapped_column(Float)
    evidence_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("media_evidence.id"), nullable=True)
    
    # Temporal Model fields
    patient_reported_date: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    relative_duration: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    is_approximate: Mapped[bool] = mapped_column(Boolean, default=False)
    
    turn = relationship("ConversationTurn", back_populates="answers")
    evidence = relationship("MediaEvidence")

class SafetyAlert(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "safety_alerts"
    session_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("intake_sessions.id"))
    rule_id: Mapped[str] = mapped_column(String)
    alert_category: Mapped[str] = mapped_column(String)
    deterministic_explanation: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String, default="DEMO_PENDING_CLINICAL_REVIEW")
    matched_fact_ids: Mapped[list] = mapped_column(JSON)
    evidence_ids: Mapped[list] = mapped_column(JSON)
    session = relationship("IntakeSession")

class ClinicalConflict(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "clinical_conflicts"
    session_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("intake_sessions.id"))
    slot: Mapped[str] = mapped_column(String)
    fact_id_1: Mapped[uuid.UUID] = mapped_column(ForeignKey("clinical_answers.id"))
    fact_id_2: Mapped[uuid.UUID] = mapped_column(ForeignKey("clinical_answers.id"))
    relationship_status: Mapped[str] = mapped_column(String, default="UNRESOLVED")
    resolution_notes: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    session = relationship("IntakeSession")
