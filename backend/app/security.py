"""
PathPilot AI - Security & Password Hashing Utilities
Provides cryptographic hashing with salt and constant-time verification.
"""

import hashlib
import secrets
from typing import Optional

def hash_password(password: str, salt: Optional[str] = None) -> str:
    """
    Hashes a plaintext password using SHA-256 with a unique random hex salt.
    Format returned: salt$digest
    """
    if not salt:
        salt = secrets.token_hex(16)
    hashed = hashlib.sha256((salt + password).encode("utf-8")).hexdigest()
    return f"{salt}${hashed}"

def verify_password(password: str, stored_hash: str) -> bool:
    """
    Verifies a plaintext password against a stored salt$digest string.
    Uses constant-time comparison to prevent timing attacks.
    """
    try:
        if not stored_hash or "$" not in stored_hash:
            return False
        salt, expected_digest = stored_hash.split("$", 1)
        actual_digest = hashlib.sha256((salt + password).encode("utf-8")).hexdigest()
        return secrets.compare_digest(actual_digest, expected_digest)
    except Exception:
        return False
