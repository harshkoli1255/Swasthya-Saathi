# Auth service for orchestration logic. Currently mostly handled in router for Milestone 1.

from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import hash_password

class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def create_doctor(self, username: str, password: str, full_name: str, facility: str = None) -> User:
        user = User(
            username=username,
            password_hash=hash_password(password),
            full_name=full_name,
            role="DOCTOR",
            facility=facility
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
