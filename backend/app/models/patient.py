import uuid
from typing import Optional
from sqlalchemy import String, Integer, ForeignKey, JSON, Text, Boolean, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from app.models.base import Base, UUIDMixin, TimestampMixin

class Patient(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "patients"
    full_name: Mapped[str] = mapped_column(String)
    age: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    sex: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    abha_number: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    abha_address: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    verification_status: Mapped[str] = mapped_column(String, default="UNVERIFIED")
    verification_method: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    verification_source: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    verified_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    verification_reference: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False)
    encounters = relationship("Encounter", back_populates="patient")
    consents = relationship("Consent", back_populates="patient")

class Consent(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "consents"
    patient_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("patients.id"))
    consent_version: Mapped[str] = mapped_column(String)
    scope: Mapped[list] = mapped_column(JSON)
    granted_at: Mapped[datetime] = mapped_column()
    patient = relationship("Patient", back_populates="consents")

class Encounter(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "encounters"
    patient_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("patients.id"), index=True)
    opd_id: Mapped[str] = mapped_column(String, index=True)
    doctor_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("users.id"), nullable=True, index=True)
    specialty: Mapped[str] = mapped_column(String, default="AYURVEDA")
    facility: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    status: Mapped[str] = mapped_column(String, default="REGISTERED")
    triage_level: Mapped[str] = mapped_column(String, default="ROUTINE")
    patient = relationship("Patient", back_populates="encounters")
    intake_session = relationship("IntakeSession", uselist=False, back_populates="encounter")
