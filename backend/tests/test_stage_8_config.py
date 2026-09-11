import pytest
from app.core.config import Settings
from pydantic import ValidationError

def test_production_config_rejects_debug_true():
    with pytest.raises(ValueError) as exc:
        Settings(environment="production", debug=True, secret_key="super_strong_production_key_1234567", database_url="postgresql://db")
    assert "DEBUG must be False" in str(exc.value)

def test_production_config_rejects_weak_secret():
    with pytest.raises(ValueError) as exc:
        Settings(environment="production", debug=False, secret_key="CHANGE_ME_in_production", database_url="postgresql://db")
    assert "SECRET_KEY is required" in str(exc.value)

    with pytest.raises(ValueError) as exc:
        Settings(environment="production", debug=False, secret_key="weak", database_url="postgresql://db")
    assert "SECRET_KEY is required" in str(exc.value)

def test_production_config_rejects_sqlite():
    with pytest.raises(ValueError) as exc:
        Settings(environment="production", debug=False, secret_key="super_strong_production_key_1234567", database_url="sqlite:///db")
    assert "PostgreSQL is required" in str(exc.value)

def test_production_config_accepts_valid():
    s = Settings(environment="production", debug=False, secret_key="super_strong_production_key_1234567", database_url="postgresql://db")
    assert s.environment == "production"
