"""
PathPilot AI - Sample Benchmark Routes
Provides single-click loading and sample benchmark reset capability.
"""

from fastapi import APIRouter
from typing import Dict, Any
from app.database import (
    reset_to_demo_state,
    get_candidate_profile,
    get_active_target_job,
    get_saved_roadmap,
    save_roadmap
)
from app.engine_b_skill_gap.gap_calculator import SkillGapCalculator
from app.engine_c_recommendation.roadmap_generator import RoadmapGenerator

router = APIRouter(prefix="/api/demo", tags=["Sample Benchmarks"])

gap_calculator = SkillGapCalculator()
roadmap_generator = RoadmapGenerator()

@router.post("/reset")
async def reset_demo():
    """
    Resets the database state to the pristine Alex Morgan benchmark candidate
    and Junior AI/ML Engineer target role.
    """
    reset_to_demo_state()
    
    # Pre-generate roadmap for instant demo readiness
    profile = get_candidate_profile()
    target_job = get_active_target_job()
    if target_job:
        all_reqs = target_job.required_skills + target_job.preferred_skills
        analysis = gap_calculator.analyze_skill_gap(
            candidate_skills=profile.skills,
            target_job_id=target_job.id,
            target_job_title=target_job.title,
            requirements=all_reqs
        )
        roadmap = roadmap_generator.generate_roadmap(
            target_role_title=target_job.title,
            target_job_id=target_job.id,
            skill_analysis=analysis.skill_analysis,
            weekly_hours=12
        )
        save_roadmap(roadmap)

    return {
        "status": "success",
        "message": "Demo environment reset to standard Alex Morgan (Junior AI/ML Engineer) scenario.",
        "candidate": profile.name,
        "target_role": target_job.title if target_job else None
    }

@router.get("/info")
async def get_demo_info() -> Dict[str, Any]:
    """
    Returns structured demonstration sequence and context.
    """
    return {
        "scenario": {
            "candidate_name": "Alex Morgan",
            "education": "Junior in Computer Science, State University",
            "target_role": "Junior AI/ML Engineer",
            "demonstrated_skills": ["Python (Level 2)", "SQL (Level 2)", "Statistics (Level 2)", "Machine Learning (Level 1)", "Data Visualization (Level 2)", "Git (Level 2)"],
            "critical_gaps": ["Model Evaluation & Validation (Missing)", "Feature Engineering (Missing)", "PyTorch (Missing)", "FastAPI (Missing)", "Docker (Missing)"],
            "recommended_project": "Production-Grade Predictive ML Pipeline & Serving API"
        },
        "evaluation_steps": [
            "1. Click 'Demo Mode' or 'Reset Benchmark' to load Alex Morgan profile.",
            "2. Review extracted skills and evidence in the Resume & Job Analysis workspace.",
            "3. Inspect the Skill Gap Analysis: observe transparent 0-4 proficiency levels, must-have priority weights, and readiness score.",
            "4. Inspect explainability: click on 'Model Evaluation & Validation' to view why it is high-priority.",
            "5. Open 'My Roadmap' to see the 4-phase structured timeline generated dynamically.",
            "6. Mark Milestone 1 complete: observe progress logging and real-time updates.",
            "7. Update skill proficiency: elevate 'Machine Learning' from 1 to 2 with evidence and watch readiness score update.",
            "8. Open Career Explorer: compare 'Junior AI/ML Engineer' with 'Data Analyst' to inspect skill overlap and transition advice."
        ]
    }
