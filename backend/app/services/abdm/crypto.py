import base64
import logging
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.serialization import load_der_public_key, load_pem_public_key

logger = logging.getLogger(__name__)


def encrypt_abdm_data(plain_text: str, public_key_str: str) -> str:
    """
    Encrypts sensitive data (Aadhaar number, mobile number, OTP)
    using the official NHA ABDM specification:
    Algorithm: RSA/ECB/OAEPWithSHA-1AndMGF1Padding
    """
    if not plain_text or not public_key_str:
        raise ValueError("Both plain text and public key are required for ABDM encryption")

    clean_key = public_key_str.strip()
    
    # Check if PEM formatted or raw base64 DER
    if "-----BEGIN PUBLIC KEY-----" in clean_key:
        pub_key = load_pem_public_key(clean_key.encode("utf-8"))
    else:
        # ABDM /v3/profile/public/certificate returns base64 DER
        try:
            der_data = base64.b64decode(clean_key)
            pub_key = load_der_public_key(der_data)
        except Exception:
            pem_wrapped = f"-----BEGIN PUBLIC KEY-----\n{clean_key}\n-----END PUBLIC KEY-----"
            pub_key = load_pem_public_key(pem_wrapped.encode("utf-8"))

    encrypted_bytes = pub_key.encrypt(
        plain_text.encode("utf-8"),
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA1()),
            algorithm=hashes.SHA1(),
            label=None
        )
    )

    return base64.b64encode(encrypted_bytes).decode("utf-8")
