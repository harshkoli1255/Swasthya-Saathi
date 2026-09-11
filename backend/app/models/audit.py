import uuid
from typing import Optional
from sqlalchemy import String, Integer, ForeignKey, JSON, Text, Boolean, Float, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from app.models.base import Base, UUIDMixin, TimestampMixin
from app.models.user import User

class AuditLog(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "audit_logs"
    actor_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("users.id"), nullable=True)
    entity_id: Mapped[uuid.UUID] = mapped_column(Uuid)
    entity_type: Mapped[str] = mapped_column(String)
    edit_type: Mapped[str] = mapped_column(String)
    before_state: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    after_state: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    actor = relationship("User")
