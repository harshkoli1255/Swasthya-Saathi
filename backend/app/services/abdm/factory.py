import logging
from app.core.config import settings
from app.services.abdm.base import AbstractABDMAdapter
from app.services.abdm.sandbox_adapter import ABDMSandboxAdapter
from app.services.abdm.mock_adapter import LocalDevelopmentMockAdapter

logger = logging.getLogger(__name__)


def get_abdm_adapter() -> AbstractABDMAdapter:
    """
    Dependency injection factory for ABDM interoperability.
    Strict Rule: If settings.abdm_env is 'sandbox', NEVER silently fall back to mock.
    Mocks are only allowed when explicitly configured for local development.
    """
    env = (settings.abdm_env or "sandbox").strip().lower()

    if env == "development":
        logger.warning(
            "ABDM Adapter: Running in LOCAL DEVELOPMENT MOCK mode. "
            "All responses are simulated and labeled 'LOCAL_DEV_MOCK'."
        )
        return LocalDevelopmentMockAdapter()

    # Default is sandbox
    logger.info("ABDM Adapter: Instantiating official NHA ABDM Sandbox Adapter (%s)", settings.abdm_gateway_url)
    return ABDMSandboxAdapter()
