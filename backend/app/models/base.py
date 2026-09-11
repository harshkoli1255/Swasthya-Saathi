from datetime import datetime
import uuid
from sqlalchemy import MetaData, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy.sql import func
from sqlalchemy.types import TypeDecorator


class StringUUID(TypeDecorator):
    """Stores UUIDs as 32-char hex strings (no hyphens) in SQLite.

    SQLAlchemy's built-in UUID type uses binary (BLOB) in SQLite which is
    incompatible with text UUID strings from raw SQL inserts. This type:
    - Stores as 32-char hex string (matching existing DB rows seeded by ORM or raw INSERT)
    - Retrieves as proper uuid.UUID Python objects for FK relationship joins
    - Converts bind params to 32-char hex to match stored format for correct WHERE clauses
    """
    impl = String(32)
    cache_ok = True

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        # Normalize to 32-char hex (no hyphens) to match SQLite storage format
        if isinstance(value, uuid.UUID):
            return value.hex  # 32-char no-hyphen hex
        # Handle string input — strip hyphens in case it's already formatted
        s = str(value).replace("-", "")
        if len(s) == 32:
            return s
        # Try parsing as UUID to validate and normalize
        return uuid.UUID(str(value)).hex

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        if isinstance(value, uuid.UUID):
            return value
        return uuid.UUID(str(value))  # accepts both 32-hex and hyphenated forms


class Base(DeclarativeBase):
    pass


class UUIDMixin:
    id: Mapped[uuid.UUID] = mapped_column(
        StringUUID,
        primary_key=True,
        default=uuid.uuid4
    )


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(server_default=func.now(), onupdate=func.now())
