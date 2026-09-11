from fastapi import APIRouter
from app.schemas.common import HealthResponse
from app.core.config import settings

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse, summary="Service health check")
def health_check() -> HealthResponse:
    """Returns service status. Used by Docker health checks and monitoring."""
    return HealthResponse(
        status="ok",
        version="1.0.0",
        environment=settings.environment,
    )
