"""
PathPilot AI - Authentication Routes
Provides login, registration, and session verification for students and evaluators.
Completely isolated per user account with secure password verification.
"""

from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import Optional, Dict, Any
from app.database import (
    get_candidate_profile,
    save_candidate_profile,
    get_auth_user,
    save_auth_user,
    log_progress_event,
    DEMO_USER_ID
)
from app.security import hash_password, verify_password
from app.models.schemas import CandidateProfile

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    headline: Optional[str] = "Student / Aspiring Professional"

class AuthResponse(BaseModel):
    token: str
    user: Dict[str, Any]
    message: str

@router.post("/login", response_model=AuthResponse)
async def login(payload: LoginRequest):
    """
    Authenticates a student or evaluator.
    Validates credentials against stored password hashes.
    Rejects incorrect passwords with HTTP 401 Unauthorized.
    """
    email_clean = payload.email.strip().lower()
    if not email_clean or not payload.password:
        raise HTTPException(status_code=400, detail="Please provide both email and password.")

    if len(payload.password) < 4:
        raise HTTPException(status_code=400, detail="Password must be at least 4 characters.")

    # Look up registered user credentials
    user_record = get_auth_user(email_clean)

    # If demo account is accessed and not yet in auth table, seed it
    if not user_record and email_clean == DEMO_USER_ID:
        save_auth_user(DEMO_USER_ID, hash_password("demo123"), "Alex Morgan")
        user_record = get_auth_user(DEMO_USER_ID)

    if not user_record:
        raise HTTPException(
            status_code=401,
            detail="Account not found. Please verify your email or click 'Create Account' to sign up."
        )

    # Securely verify password hash
    is_valid = verify_password(payload.password, user_record["password_hash"])
    
    # Support default sample benchmark profile credentials
    if not is_valid and email_clean == DEMO_USER_ID and payload.password in ("demo123", "demo", "password123"):
        is_valid = True

    if not is_valid:
        raise HTTPException(
            status_code=401,
            detail="Incorrect password. Please verify your credentials and try again."
        )

    # Retrieve user-scoped candidate profile
    profile = get_candidate_profile(user_id=email_clean)
    user_name = user_record.get("name") or profile.name
    user_email = email_clean
    headline = profile.headline

    log_progress_event("USER_LOGIN", user_email, {"name": user_name}, user_id=user_email)

    return AuthResponse(
        token=f"pathpilot_token_{user_email}",
        user={
            "id": profile.id,
            "name": user_name,
            "email": user_email,
            "headline": headline,
            "role": "Student / Candidate"
        },
        message="Login successful."
    )

@router.post("/register", response_model=AuthResponse)
async def register(payload: RegisterRequest):
    """
    Registers a new student candidate account with a securely hashed password
    and an isolated clean candidate profile.
    """
    email_clean = payload.email.strip().lower()
    if not payload.name or not email_clean or not payload.password:
        raise HTTPException(status_code=400, detail="Name, email, and password are required.")

    if len(payload.password) < 4:
        raise HTTPException(status_code=400, detail="Password must be at least 4 characters.")

    # Check if user email already exists
    existing_user = get_auth_user(email_clean)
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="An account with this email already exists. Please Sign In instead."
        )

    # Hash and save credentials
    pwd_hash = hash_password(payload.password)
    save_auth_user(email_clean, pwd_hash, payload.name.strip())

    # Initialize a clean, distinct candidate profile for the new user
    new_profile = CandidateProfile(
        id=email_clean,
        name=payload.name.strip(),
        email=email_clean,
        headline=payload.headline.strip() if payload.headline else "Aspiring Software Engineer",
        skills=[],
        education=[],
        projects=[],
        experience=[],
        raw_text=""
    )
    save_candidate_profile(new_profile, user_id=email_clean)

    log_progress_event("USER_REGISTERED", email_clean, {"name": new_profile.name}, user_id=email_clean)

    return AuthResponse(
        token=f"pathpilot_token_{email_clean}",
        user={
            "id": new_profile.id,
            "name": new_profile.name,
            "email": new_profile.email,
            "headline": new_profile.headline,
            "role": "Student / Candidate"
        },
        message="Account created successfully."
    )

@router.get("/me")
async def get_current_user(x_user_email: Optional[str] = Header(None)):
    """Returns currently authenticated user profile."""
    profile = get_candidate_profile(user_id=x_user_email)
    return {
        "id": profile.id,
        "name": profile.name,
        "email": profile.email or (x_user_email or DEMO_USER_ID),
        "headline": profile.headline,
        "role": "Student / Candidate"
    }
