from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1.router import api_router

from app.core.logging_setup import setup_logging
from app.core.middleware import SecurityHeadersMiddleware

# Initialize secure logging
setup_logging()

app = FastAPI(
    title="SwasthyaSaathi API",
    description="Pre-consultation clinical intake platform for AYUSH outpatient departments.",
    version="1.0.0",
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
)

# Security Headers
app.add_middleware(SecurityHeadersMiddleware)

# CORS — allows the web apps to call the API
cors_kwargs = {
    "allow_origins": settings.cors_origins,
    "allow_credentials": True,
    "allow_methods": ["*"],
    "allow_headers": ["*"],
}
if settings.environment != "production":
    cors_kwargs["allow_origin_regex"] = ".*"

app.add_middleware(CORSMiddleware, **cors_kwargs)

app.include_router(api_router)


@app.get("/", include_in_schema=False)
def root():
    return {"message": "SwasthyaSaathi API", "docs": "/docs"}
