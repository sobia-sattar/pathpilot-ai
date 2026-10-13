"""
PathPilot AI - Career Explorer Routes
Enables exploring predefined industry roles, comparing skill requirement overlaps
between different careers, and switching target roles per user.
"""

from fastapi import APIRouter, HTTPException, Query, Header
from typing import List, Dict, Any, Optional
from app.models.schemas import (
    TargetJob,
    CareerComparisonResponse
)
from app.database import (
    get_all_target_jobs,
    set_active_target_job,
    get_active_target_job,
    get_candidate_profile,
    log_progress_event
)

router = APIRouter(prefix="/api/careers", tags=["Career Explorer"])

@router.get("", response_model=List[TargetJob])
async def list_available_careers():
    """Returns all available predefined career benchmarks."""
    return get_all_target_jobs()

@router.get("/active", response_model=TargetJob)
async def get_active_career(x_user_email: Optional[str] = Header(None)):
    """Returns currently selected active target job for user."""
    active = get_active_target_job(user_id=x_user_email)
    if not active:
        raise HTTPException(status_code=404, detail="No active career selected.")
    return active

@router.post("/select/{job_id}", response_model=TargetJob)
async def select_career_role(job_id: str, x_user_email: Optional[str] = Header(None)):
    """
    Sets the specified career benchmark as active for user and triggers recalculation context.
    """
    jobs = get_all_target_jobs()
    match = next((j for j in jobs if j.id == job_id), None)
    if not match:
        raise HTTPException(status_code=404, detail=f"Career role with id '{job_id}' not found.")

    set_active_target_job(job_id, user_id=x_user_email)
    log_progress_event("CAREER_SELECTED", job_id, {"title": match.title}, user_id=x_user_email)
    return match

@router.get("/compare", response_model=CareerComparisonResponse)
async def compare_two_careers(
    role_1_id: str = Query(..., description="First role ID to compare"),
    role_2_id: str = Query(..., description="Second role ID to compare")
):
    """
    Compares requirements between two career paths:
    identifies overlapping competencies, unique demands, transition readiness, and advice.
    """
    jobs = get_all_target_jobs()
    job1 = next((j for j in jobs if j.id == role_1_id), None)
    job2 = next((j for j in jobs if j.id == role_2_id), None)

    if not job1 or not job2:
        raise HTTPException(status_code=404, detail="One or both selected roles could not be found.")

    reqs1 = {r.normalized_name.lower(): r for r in (job1.required_skills + job1.preferred_skills)}
    reqs2 = {r.normalized_name.lower(): r for r in (job2.required_skills + job2.preferred_skills)}

    all_keys = set(reqs1.keys()) | set(reqs2.keys())
    overlap = []
    unique_1 = []
    unique_2 = []

    for k in all_keys:
        if k in reqs1 and k in reqs2:
            r1 = reqs1[k]
            r2 = reqs2[k]
            overlap.append({
                "skill": r1.name,
                "role_1_level": r1.required_level,
                "role_2_level": r2.required_level,
                "role_1_priority": r1.priority,
                "role_2_priority": r2.priority
            })
        elif k in reqs1:
            r1 = reqs1[k]
            unique_1.append({
                "skill": r1.name,
                "required_level": r1.required_level,
                "priority": r1.priority
            })
        else:
            r2 = reqs2[k]
            unique_2.append({
                "skill": r2.name,
                "required_level": r2.required_level,
                "priority": r2.priority
            })

    total_r2 = len(reqs2)
    overlap_count = len(overlap)
    readiness = round((overlap_count / float(total_r2)) * 100) if total_r2 > 0 else 50

    advice = (
        f"Switching from {job1.title} to {job2.title} shares {overlap_count} core competencies "
        f"({', '.join([o['skill'] for o in overlap[:3]])}). "
        f"To successfully transition, focus primarily on developing the {len(unique_2)} unique requirements: "
        f"{', '.join([u['skill'] for u in unique_2[:3]])}."
    )

    return CareerComparisonResponse(
        role_1_title=job1.title,
        role_2_title=job2.title,
        overlapping_skills=overlap,
        unique_to_role_1=unique_1,
        unique_to_role_2=unique_2,
        transition_readiness=readiness,
        transition_advice=advice
    )
