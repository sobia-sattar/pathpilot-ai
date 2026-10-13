"""
PathPilot AI - Progress Analytics Routes
Aggregates milestone completions, study time estimation, skill level transitions,
and real audit logs for progress monitoring per user.
"""

from fastapi import APIRouter, Header
from typing import Dict, Any, List, Optional
from app.database import (
    get_candidate_profile,
    get_active_target_job,
    get_saved_roadmap,
    get_progress_history
)
from app.engine_b_skill_gap.gap_calculator import SkillGapCalculator

router = APIRouter(prefix="/api/progress", tags=["Progress Analytics"])
gap_calculator = SkillGapCalculator()

@router.get("/summary")
async def get_progress_summary(x_user_email: Optional[str] = Header(None)) -> Dict[str, Any]:
    """
    Returns aggregated metrics, milestone completion stats, and audit history scoped to user.
    """
    profile = get_candidate_profile(user_id=x_user_email)
    target_job = get_active_target_job(user_id=x_user_email)
    roadmap = get_saved_roadmap(user_id=x_user_email)
    history = get_progress_history(user_id=x_user_email)

    readiness_score = 0
    total_gaps = 0
    must_have_gaps = 0

    if target_job:
        all_reqs = target_job.required_skills + target_job.preferred_skills
        analysis = gap_calculator.analyze_skill_gap(
            candidate_skills=profile.skills,
            target_job_id=target_job.id,
            target_job_title=target_job.title,
            requirements=all_reqs
        )
        readiness_score = analysis.readiness_score
        total_gaps = analysis.needs_improvement_count + analysis.missing_count
        must_have_gaps = sum(1 for r in analysis.skill_analysis if r.priority == "must-have" and r.gap > 0)

    total_milestones = 0
    completed_milestones = 0
    completed_hours = 0
    remaining_hours = 0

    if roadmap:
        total_milestones = len(roadmap.milestones)
        completed_milestones = sum(1 for m in roadmap.milestones if m.completed)
        completed_hours = sum(m.estimated_hours for m in roadmap.milestones if m.completed)
        remaining_hours = sum(m.estimated_hours for m in roadmap.milestones if not m.completed)

    milestone_completion_rate = (
        round((completed_milestones / float(total_milestones)) * 100) if total_milestones > 0 else 0
    )

    return {
        "candidate_name": profile.name,
        "target_role": target_job.title if target_job else "None Selected",
        "readiness_score": readiness_score,
        "total_skills_profile": len(profile.skills),
        "total_gaps": total_gaps,
        "must_have_gaps": must_have_gaps,
        "total_milestones": total_milestones,
        "completed_milestones": completed_milestones,
        "milestone_completion_rate": milestone_completion_rate,
        "completed_hours": completed_hours,
        "remaining_hours": remaining_hours,
        "recent_history": history
    }
