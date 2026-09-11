from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import uuid as _uuid

from app.core.database import get_db
from app.core.security import verify_password, create_access_token, decode_access_token
from app.core.exceptions import UnauthorizedError
from app.core.config import settings
from app.models.user import User
from app.schemas.common import LoginRequest, TokenResponse, UserPublic
from app.core.rate_limit import login_limiter

router = APIRouter(prefix="/auth", tags=["auth"])
bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    """FastAPI dependency: validates JWT and returns the current user."""
    if not credentials:
        raise UnauthorizedError()
    try:
        payload = decode_access_token(credentials.credentials)
        user_id: str = payload.get("sub")
        if not user_id:
            raise UnauthorizedError()
    except ValueError:
        raise UnauthorizedError("Invalid or expired token")

    try:
        user_uuid = _uuid.UUID(user_id)  # Validates the string is a well-formed UUID
    except (ValueError, AttributeError):
        raise UnauthorizedError("Invalid token subject")

    user = db.query(User).filter(User.id == user_uuid, User.is_active == True).first()
    if not user:
        raise UnauthorizedError("User not found or inactive")
    return user


def require_doctor(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role not in ("DOCTOR", "ADMIN"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Doctor access required")
    return current_user


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "ADMIN":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return current_user


@router.post("/login", response_model=TokenResponse, summary="Doctor / Admin login", dependencies=[Depends(login_limiter)])
def login(request: Request, payload: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    """
    Authenticates a doctor or admin and returns a JWT access token.
    Patient devices use scoped session tokens (not this endpoint).
    """
    user = db.query(User).filter(
        User.username == payload.username, User.is_active == True
    ).first()

    if not user or not verify_password(payload.password, user.password_hash):
        raise UnauthorizedError("Invalid username or password")

    token = create_access_token(subject=str(user.id))
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        expires_in_minutes=settings.access_token_expire_minutes,
        user_id=str(user.id),
        full_name=user.full_name,
        role=user.role,
    )


@router.get("/me", response_model=UserPublic, summary="Get current authenticated user")
def get_me(current_user: User = Depends(get_current_user)) -> UserPublic:
    return UserPublic.model_validate(current_user)
