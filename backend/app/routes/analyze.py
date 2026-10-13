"""
PathPilot AI - Analyze Routes
Executes skill gap calculations, proficiency adjustments, and explainability notes.
Isolated by user session.
"""

from fastapi import APIRouter, HTTPException, Header
from typing import Dict, Any, Optional
from app.engine_b_skill_gap.gap_calculator import SkillGapCalculator
from app.models.schemas import (
    SkillGapAnalysisResponse,
    UpdateSkillRequest,
    CandidateProfile
)
from app.database import (
    get_candidate_profile,
    save_candidate_profile,
    get_active_target_job,
    log_progress_event
)

router = APIRouter(prefix="/api/analyze", tags=["Skill Gap Engine"])

gap_calculator = SkillGapCalculator()

@router.get("/current", response_model=SkillGapAnalysisResponse)
async def get_current_skill_gap_analysis(x_user_email: Optional[str] = Header(None)):
    """
    Computes real-time skill gap analysis between active candidate profile and active target job.
    Scoped to authenticated user.
    """
    profile = get_candidate_profile(user_id=x_user_email)
    target_job = get_active_target_job(user_id=x_user_email)

    if not target_job:
        raise HTTPException(status_code=404, detail="No active target job found. Please select or enter a target job.")

    all_requirements = target_job.required_skills + target_job.preferred_skills
    analysis = gap_calculator.analyze_skill_gap(
        candidate_skills=profile.skills,
        target_job_id=target_job.id,
        target_job_title=target_job.title,
        requirements=all_requirements
    )
    return analysis

@router.get("/profile", response_model=CandidateProfile)
async def get_active_profile(x_user_email: Optional[str] = Header(None)):
    """Returns currently loaded candidate profile for authenticated user."""
    return get_candidate_profile(user_id=x_user_email)

@router.post("/update-skill", response_model=SkillGapAnalysisResponse)
async def update_candidate_skill(payload: UpdateSkillRequest, x_user_email: Optional[str] = Header(None)):
    """
    Updates or confirms candidate skill proficiency.
    Recalculates skill gap analysis and records progress event.
    """
    profile = get_candidate_profile(user_id=x_user_email)
    target_job = get_active_target_job(user_id=x_user_email)
    if not target_job:
        target_job = get_active_target_job(user_id="demo_candidate")

    found = False
    old_proficiency = 0
    for cs in profile.skills:
        if cs.name.lower() == payload.skill_name.lower() or cs.normalized_name.lower() == payload.skill_name.lower():
            old_proficiency = cs.proficiency
            cs.proficiency = payload.new_proficiency
            cs.user_confirmed = True
            if payload.evidence:
                cs.evidence = payload.evidence
            found = True
            break

    if not found:
        from app.engine_b_skill_gap.taxonomy import normalize_skill_name, get_category_for_skill
        canonical = normalize_skill_name(payload.skill_name) or payload.skill_name
        category = get_category_for_skill(canonical)
        from app.models.schemas import CandidateSkill
        profile.skills.append(CandidateSkill(
            name=payload.skill_name,
            normalized_name=canonical,
            category=category,
            proficiency=payload.new_proficiency,
            evidence=payload.evidence or "Updated during development",
            confidence=1.0,
            is_inferred=False,
            user_confirmed=True
        ))

    save_candidate_profile(profile, user_id=x_user_email)
    log_progress_event("SKILL_PROFICIENCY_UPDATED", payload.skill_name, {
        "previous_level": old_proficiency,
        "new_level": payload.new_proficiency
    }, user_id=x_user_email)

    if not target_job:
        raise HTTPException(status_code=404, detail="No active target job found.")

    all_requirements = target_job.required_skills + target_job.preferred_skills
    return gap_calculator.analyze_skill_gap(
        candidate_skills=profile.skills,
        target_job_id=target_job.id,
        target_job_title=target_job.title,
        requirements=all_requirements
    )
