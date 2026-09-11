import uuid
from typing import Optional
from sqlalchemy import String, Integer, ForeignKey, JSON, Text, Boolean, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from app.models.base import Base, UUIDMixin, TimestampMixin

class ClinicalSummary(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "clinical_summaries"
    encounter_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("encounters.id"))
    extracted_facts: Mapped[dict] = mapped_column(JSON)
    triggered_slots: Mapped[dict] = mapped_column(JSON)
    content: Mapped[dict] = mapped_column(JSON)
    edits: Mapped[dict] = mapped_column(JSON)
    before_state: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    after_state: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
