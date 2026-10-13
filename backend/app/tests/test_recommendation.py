import pytest
from app.models.schemas import CandidateSkill, JobSkillRequirement
from app.engine_b_skill_gap.gap_calculator import SkillGapCalculator
from app.engine_c_recommendation.ranking import RecommendationRanker
from app.engine_c_recommendation.roadmap_generator import RoadmapGenerator

def test_recommendation_and_roadmap_generation():
    calc = SkillGapCalculator()
    ranker = RecommendationRanker()
    gen = RoadmapGenerator()

    # Candidate has Python, lacks Machine Learning and Model Evaluation
    candidate_skills = [
        CandidateSkill(name="Python", normalized_name="Python", proficiency=2, evidence="Coursework")
    ]
    job_reqs = [
        JobSkillRequirement(name="Python", normalized_name="Python", required_level=3, priority="must-have", weight=3),
        JobSkillRequirement(name="Machine Learning", normalized_name="Machine Learning", required_level=3, priority="must-have", weight=3),
        JobSkillRequirement(name="Model Evaluation & Validation", normalized_name="Model Evaluation & Validation", required_level=3, priority="must-have", weight=3)
    ]

    analysis = calc.analyze_skill_gap(candidate_skills, "job_test", "Junior ML Engineer", job_reqs)
    
    # Check ranked resources
    resources = ranker.rank_resources(analysis.skill_analysis)
    assert len(resources) > 0
    # Top resource should target Machine Learning or Model Evaluation
    assert any(r.canonical_skill in ["Machine Learning", "Model Evaluation & Validation"] for r in resources[:3])

    # Check generated roadmap
    roadmap = gen.generate_roadmap("Junior ML Engineer", "job_test", analysis.skill_analysis, weekly_hours=12)
    assert len(roadmap.milestones) >= 3
    assert roadmap.estimated_weeks > 0
    assert roadmap.estimated_total_hours > 0

    # Ensure phases exist
    phases = {m.phase for m in roadmap.milestones}
    assert "Foundations" in phases or "Core Skills" in phases
