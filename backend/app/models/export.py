import uuid
from typing import Optional
from sqlalchemy import String, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

from app.models.base import Base, UUIDMixin, TimestampMixin
from app.models.patient import Encounter
from app.models.user import User

class FHIRExportRecord(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "fhir_export_records"
    
    encounter_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("encounters.id"))
    export_id: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String, default="PENDING")
    exported_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    
    bundle_identifier: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    bundle_version: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    
    validation_status: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    failure_code: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    failure_reason: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    
    destination_type: Mapped[str] = mapped_column(String, default="MOCK_ABDM")
    
    actor_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("users.id"), nullable=True)
    
    encounter = relationship("Encounter")
    actor = relationship("User")
