"""
PathPilot AI - Parse Routes
Handles PDF upload, pasted resume parsing, job description extraction,
and candidate profile confirmation/updates. Isolated by user.
"""

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Header
from typing import Optional
from app.engine_a_parser.pdf_extractor import extract_text_from_pdf_bytes
from app.engine_a_parser.resume_parser import ResumeParser
from app.engine_a_parser.job_parser import JobDescriptionParser
from app.models.schemas import (
    CandidateProfile,
    ParseResumeTextRequest,
    JobDescriptionParseRequest,
    TargetJob
)
from app.database import (
    get_candidate_profile,
    save_candidate_profile,
    save_custom_target_job,
    log_progress_event
)

router = APIRouter(prefix="/api/parse", tags=["Parsing & Feature Extraction"])

resume_parser = ResumeParser()
job_parser = JobDescriptionParser()

@router.post("/pdf", response_model=CandidateProfile)
async def parse_pdf_resume(
    file: UploadFile = File(...),
    x_user_email: Optional[str] = Header(None)
):
    """
    Accepts an uploaded PDF resume, extracts sanitized text, and structures candidate features.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    pdf_bytes = await file.read()
    success, extracted_text, error_msg = extract_text_from_pdf_bytes(pdf_bytes, file.filename)
    
    if not success:
        raise HTTPException(status_code=422, detail=error_msg or "Failed to extract text from PDF.")

    profile = resume_parser.parse(extracted_text)
    if x_user_email:
        profile.email = x_user_email
    save_candidate_profile(profile, user_id=x_user_email)
    log_progress_event("RESUME_UPLOADED", profile.id, {"filename": file.filename, "extracted_skills_count": len(profile.skills)}, user_id=x_user_email)
    return profile

@router.post("/text", response_model=CandidateProfile)
async def parse_text_resume(
    payload: ParseResumeTextRequest,
    x_user_email: Optional[str] = Header(None)
):
    """
    Accepts pasted resume text, runs structured extraction, and saves candidate profile.
    """
    if not payload.text or len(payload.text.strip()) < 20:
        raise HTTPException(status_code=400, detail="Please provide a valid resume text (at least 20 characters).")

    profile = resume_parser.parse(payload.text)
    if x_user_email:
        profile.email = x_user_email
    save_candidate_profile(profile, user_id=x_user_email)
    log_progress_event("RESUME_PASTED", profile.id, {"skills_detected": len(profile.skills)}, user_id=x_user_email)
    return profile

@router.post("/job", response_model=TargetJob)
async def parse_target_job_description(
    payload: JobDescriptionParseRequest,
    x_user_email: Optional[str] = Header(None)
):
    """
    Parses a pasted target job description, categorizing must-have vs preferred requirements.
    """
    if not payload.text or len(payload.text.strip()) < 20:
        raise HTTPException(status_code=400, detail="Please provide a valid job description.")

    target_job = job_parser.parse(payload.text, title=payload.title or "Target Job Opportunity")
    save_custom_target_job(target_job, user_id=x_user_email)
    log_progress_event("CUSTOM_JOB_PARSED", target_job.id, {
        "title": target_job.title,
        "required_skills": len(target_job.required_skills),
        "preferred_skills": len(target_job.preferred_skills)
    }, user_id=x_user_email)
    return target_job

@router.post("/profile/save", response_model=CandidateProfile)
async def save_reviewed_profile(
    profile: CandidateProfile,
    x_user_email: Optional[str] = Header(None)
):
    """
    User review layer: saves user-edited skills, corrected proficiency ratings, and adjustments.
    """
    if x_user_email:
        profile.email = x_user_email
    save_candidate_profile(profile, user_id=x_user_email)
    log_progress_event("PROFILE_MANUAL_REVIEW", profile.id, {"confirmed_skills_count": len(profile.skills)}, user_id=x_user_email)
    return profile
