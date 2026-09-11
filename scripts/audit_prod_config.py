import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), '../backend'))
from app.core.config import settings

def audit_config():
    errors = []
    
    # Check DEBUG
    if settings.debug:
        errors.append("FAIL: DEBUG mode is True")
    else:
        print("PASS: DEBUG is False")
        
    # Check CORS
    if "*" in settings.cors_origins or len(settings.cors_origins) == 0:
        errors.append("FAIL: CORS origins are overly permissive or empty")
    else:
        print(f"PASS: CORS origins restricted to {settings.cors_origins}")
        
    # Check Secret Strength
    if settings.secret_key == "CHANGE_ME_in_production" or len(settings.secret_key) < 32:
        errors.append("FAIL: Default or weak SECRET_KEY detected")
    else:
        print("PASS: SECRET_KEY is not default and has sufficient length")
        
    # Check ABDM Sandbox
    if settings.feature_abdm_sandbox:
        errors.append("FAIL: ABDM Sandbox feature flag is True in production config")
    else:
        print("PASS: ABDM Sandbox flag is False")
        
    if "sqlite" in settings.database_url:
        errors.append("FAIL: SQLite detected in production DATABASE_URL")
    else:
        print("PASS: PostgreSQL configured")
        
    if errors:
        print("\nProduction Configuration Audit: FAIL")
        for e in errors:
            print("- " + e)
        sys.exit(1)
    else:
        print("\nProduction Configuration Audit: PASS")
        sys.exit(0)

if __name__ == "__main__":
    audit_config()
