import uuid
from typing import Optional
from sqlalchemy import String, Integer, ForeignKey, JSON, Text, Boolean, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from app.models.base import Base, UUIDMixin, TimestampMixin

class MediaAsset(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "media_assets"
    session_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("intake_sessions.id"))
    media_type: Mapped[str] = mapped_column(String)
    mime_type: Mapped[str] = mapped_column(String)
    immutable_storage_ref: Mapped[str] = mapped_column(String)
    sha256_hash: Mapped[str] = mapped_column(String)
    processing_status: Mapped[str] = mapped_column(String)
    session = relationship("IntakeSession")

class MediaEvidence(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "media_evidence"
    media_asset_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("media_assets.id"))
    source_type: Mapped[str] = mapped_column(String)
    extracted_text: Mapped[str] = mapped_column(String)
    page_number: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    start_time: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    end_time: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    location_metadata: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    asset = relationship("MediaAsset")
