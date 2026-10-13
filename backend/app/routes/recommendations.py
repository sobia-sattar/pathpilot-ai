"""
PathPilot AI - Recommendation Routes
Serves ranked learning resources, portfolio projects, roadmap generation,
and milestone completion tracking. Scoped per user.
"""

from fastapi import APIRouter, HTTPException, Query, Header
from typing import List, Optional
from datetime import datetime
from app.engine_b_skill_gap.gap_calculator import SkillGapCalculator
from app.engine_c_recommendation.ranking import RecommendationRanker
from app.engine_c_recommendation.roadmap_generator import RoadmapGenerator
from app.models.schemas import (
    LearningResource,
    PortfolioProject,
    CareerRoadmap,
    UpdateMilestoneRequest
)
from app.database import (
    get_candidate_profile,
    get_active_target_job,
    get_saved_roadmap,
    save_roadmap,
    log_progress_event
)

router = APIRouter(prefix="/api/recommendations", tags=["Recommendation Engine"])

gap_calculator = SkillGapCalculator()
ranker = RecommendationRanker()
roadmap_generator = RoadmapGenerator()

def _get_current_analysis(user_id: Optional[str] = None):
    profile = get_candidate_profile(user_id=user_id)
    target_job = get_active_target_job(user_id=user_id)
    if not target_job:
        return None, None
    all_reqs = target_job.required_skills + target_job.preferred_skills
    analysis = gap_calculator.analyze_skill_gap(
        candidate_skills=profile.skills,
        target_job_id=target_job.id,
        target_job_title=target_job.title,
        requirements=all_reqs
    )
    return target_job, analysis

@router.get("/resources", response_model=List[LearningResource])
async def get_ranked_resources(x_user_email: Optional[str] = Header(None)):
    """
    Returns prioritized learning resources specifically matched to candidate's skill gaps.
    """
    target_job, analysis = _get_current_analysis(user_id=x_user_email)
    if not analysis:
        return ranker.all_resources
    return ranker.rank_resources(analysis.skill_analysis)

@router.get("/projects", response_model=List[PortfolioProject])
async def get_ranked_projects(x_user_email: Optional[str] = Header(None)):
    """
    Returns prioritized portfolio projects mapped to address candidate skill gaps.
    """
    target_job, analysis = _get_current_analysis(user_id=x_user_email)
    if not analysis:
        return ranker.all_projects
    return ranker.rank_projects(analysis.skill_analysis)

@router.get("/roadmap", response_model=CareerRoadmap)
async def get_or_generate_roadmap(
    weekly_hours: int = Query(default=12, ge=4, le=40),
    x_user_email: Optional[str] = Header(None)
):
    """
    Retrieves the saved roadmap, or generates a new sequenced roadmap if none exists.
    """
    saved = get_saved_roadmap(user_id=x_user_email)
    if saved:
        return saved

    target_job, analysis = _get_current_analysis(user_id=x_user_email)
    if not target_job or not analysis:
        raise HTTPException(status_code=400, detail="Cannot generate roadmap: no active target job found.")

    roadmap = roadmap_generator.generate_roadmap(
        target_role_title=target_job.title,
        target_job_id=target_job.id,
        skill_analysis=analysis.skill_analysis,
        weekly_hours=weekly_hours
    )
    save_roadmap(roadmap, user_id=x_user_email)
    return roadmap

@router.post("/roadmap/generate", response_model=CareerRoadmap)
async def regenerate_roadmap(
    weekly_hours: int = Query(default=12, ge=4, le=40),
    x_user_email: Optional[str] = Header(None)
):
    """
    Forces fresh generation of personalized roadmap adapted to weekly study hours.
    """
    target_job, analysis = _get_current_analysis(user_id=x_user_email)
    if not target_job or not analysis:
        raise HTTPException(status_code=400, detail="Cannot generate roadmap: no active target job found.")

    roadmap = roadmap_generator.generate_roadmap(
        target_role_title=target_job.title,
        target_job_id=target_job.id,
        skill_analysis=analysis.skill_analysis,
        weekly_hours=weekly_hours
    )
    save_roadmap(roadmap, user_id=x_user_email)
    log_progress_event("ROADMAP_REGENERATED", target_job.id, {
        "milestones_count": len(roadmap.milestones),
        "weekly_hours": weekly_hours,
        "estimated_weeks": roadmap.estimated_weeks
    }, user_id=x_user_email)
    return roadmap

@router.post("/roadmap/milestone", response_model=CareerRoadmap)
async def toggle_milestone_completion(
    payload: UpdateMilestoneRequest,
    x_user_email: Optional[str] = Header(None)
):
    """
    Updates completion status of a specific roadmap milestone, persists state,
    and logs progress event.
    """
    roadmap = get_saved_roadmap(user_id=x_user_email)
    if not roadmap:
        target_job, analysis = _get_current_analysis(user_id=x_user_email)
        if not target_job or not analysis:
            raise HTTPException(status_code=404, detail="No active roadmap found.")
        roadmap = roadmap_generator.generate_roadmap(
            target_role_title=target_job.title,
            target_job_id=target_job.id,
            skill_analysis=analysis.skill_analysis
        )

    updated = False
    milestone_name = payload.milestone_id
    for m in roadmap.milestones:
        if m.id == payload.milestone_id:
            m.completed = payload.completed
            m.completed_at = datetime.utcnow().isoformat() if payload.completed else None
            milestone_name = m.title
            updated = True
            break

    if not updated:
        raise HTTPException(status_code=404, detail=f"Milestone '{payload.milestone_id}' not found in roadmap.")

    save_roadmap(roadmap, user_id=x_user_email)
    log_progress_event("MILESTONE_STATUS_CHANGED", payload.milestone_id, {
        "title": milestone_name,
        "completed": payload.completed
    }, user_id=x_user_email)
    return roadmap
