from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import model_validator
from functools import lru_cache


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application
    app_name: str = "SwasthyaSaathi"
    environment: str = "development"
    debug: bool = False

    # Database
    database_url: str = "sqlite:///./swasthyasaathi.db"

    # Security
    secret_key: str = "CHANGE_ME_in_production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 480

    # CORS
    cors_origins: list[str] = ["*"]

    # MinIO
    minio_endpoint: str = "localhost:9000"
    minio_access_key: str = "swasthya_minio"
    minio_secret_key: str = "swasthya_minio_secret"
    minio_bucket_documents: str = "documents"
    minio_secure: bool = False

    # Data Retention (days) — placeholder defaults; update per institutional policy
    retention_days_patient: int = 365
    retention_days_audio: int = 90
    retention_days_documents: int = 365
    retention_days_audit_log: int = 2555  # ~7 years

    # AI Providers
    ai_primary_provider: str = "gemini"
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama3.1:8b"
    groq_api_key: str = ""
    groq_model: str = "openai/gpt-oss-20b"
    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.5-flash"

    # Feature Flags
    feature_cloud_ai_fallback: bool = True
    feature_abdm_sandbox: bool = True

    # ABDM (Ayushman Bharat Digital Mission) Official Sandbox Configuration
    abdm_env: str = "sandbox"  # "development" | "sandbox" | "production"
    abdm_gateway_url: str = "https://dev.abdm.gov.in"
    abdm_abha_url: str = "https://abhasbx.abdm.gov.in/abha/api"
    abdm_x_cm_id: str = "sbx"
    abdm_client_id: str = ""
    abdm_client_secret: str = ""
    abdm_hip_id: str = "SWASTHYA_OPD_01"
    abdm_facility_id: str = ""

    @model_validator(mode='after')
    def validate_production_settings(self) -> 'Settings':
        if self.environment == "production":
            if self.debug:
                raise ValueError("DEBUG must be False in production.")
            if self.secret_key == "CHANGE_ME_in_production" or len(self.secret_key) < 32:
                raise ValueError("A strong, unique SECRET_KEY is required in production.")
            if not self.database_url.startswith("postgresql"):
                raise ValueError("PostgreSQL is required in production.")
        return self

@lru_cache
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
