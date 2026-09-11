import logging
import re

class PIIRedactingFormatter(logging.Formatter):
    """
    Redacts potential PII/PHI from log messages before output.
    Targets ABHA numbers, common PHI fields, and credentials.
    """
    # ABHA pattern: 14 digits with optional hyphens e.g., 12-3456-7890-1234
    ABHA_PATTERN = re.compile(r'\b\d{2}-?\d{4}-?\d{4}-?\d{4}\b')
    # Simple email pattern
    EMAIL_PATTERN = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b')
    # Phone number pattern (India)
    PHONE_PATTERN = re.compile(r'\b(?:\+91|91)?[6-9]\d{9}\b')
    
    # Keyword blocklist (simple string replacements for keys in dict logs)
    SENSITIVE_KEYS = ["password", "token", "secret", "abha", "patient_name", "transcript", "ocr_text"]

    def format(self, record):
        message = super().format(record)
        
        # Redact Regex patterns
        message = self.ABHA_PATTERN.sub("[REDACTED_ABHA]", message)
        message = self.EMAIL_PATTERN.sub("[REDACTED_EMAIL]", message)
        message = self.PHONE_PATTERN.sub("[REDACTED_PHONE]", message)
        
        # We don't log full bodies normally, but if a dictionary stringizes here, we redact sensitive values
        for key in self.SENSITIVE_KEYS:
            # Matches 'password': '...' or "token": "..."
            pattern = re.compile(rf'([\'"]{key}[\'"]\s*:\s*[\'"])(?:.*?)([\'"])', re.IGNORECASE)
            message = pattern.sub(r'\1[REDACTED]\2', message)
            
        return message

def setup_logging():
    logger = logging.getLogger()
    # Remove existing handlers
    for handler in logger.handlers[:]:
        logger.removeHandler(handler)
        
    handler = logging.StreamHandler()
    formatter = PIIRedactingFormatter('[%(asctime)s] %(levelname)s in %(module)s: %(message)s')
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)
