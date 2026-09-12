import pytest
from app.main import app


@pytest.fixture(autouse=True)
def reset_fastapi_dependency_overrides():
    """Guarantee that no FastAPI dependency overrides leak between tests."""
    yield
    app.dependency_overrides.clear()
