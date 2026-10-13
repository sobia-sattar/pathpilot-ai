import pytest
from app.models.schemas import CandidateSkill, JobSkillRequirement
from app.engine_b_skill_gap.gap_calculator import SkillGapCalculator

def test_beginner_candidate_with_several_gaps():
    calc = SkillGapCalculator()
    candidate_skills = [
        CandidateSkill(name="Python", normalized_name="Python", proficiency=1, evidence="Intro course", confidence=0.7)
    ]
    job_reqs = [
        JobSkillRequirement(name="Python", normalized_name="Python", required_level=3, priority="must-have", weight=3),
        JobSkillRequirement(name="Machine Learning", normalized_name="Machine Learning", required_level=3, priority="must-have", weight=3),
        JobSkillRequirement(name="SQL", normalized_name="SQL", required_level=2, priority="must-have", weight=3),
        JobSkillRequirement(name="Docker", normalized_name="Docker", required_level=2, priority="preferred", weight=2)
    ]

    analysis = calc.analyze_skill_gap(candidate_skills, "job_test", "Junior ML Engineer", job_reqs)
    
    assert analysis.readiness_score < 40
    assert analysis.missing_count >= 2
    assert analysis.needs_improvement_count >= 1
    # Check prioritization: Machine Learning or Python top-ranked
    top_gap = analysis.skill_analysis[0]
    assert top_gap.gap > 0

def test_strong_candidate_with_few_gaps():
    calc = SkillGapCalculator()
    candidate_skills = [
        CandidateSkill(name="Python", normalized_name="Python", proficiency=4, evidence="Production dev", confidence=0.95),
        CandidateSkill(name="Machine Learning", normalized_name="Machine Learning", proficiency=3, evidence="Shipped ML models", confidence=0.9),
        CandidateSkill(name="SQL", normalized_name="SQL", proficiency=3, evidence="Analytics queries", confidence=0.9),
        CandidateSkill(name="Docker", normalized_name="Docker", proficiency=1, evidence="Basic tutorial", confidence=0.8)
    ]
    job_reqs = [
        JobSkillRequirement(name="Python", normalized_name="Python", required_level=3, priority="must-have", weight=3),
        JobSkillRequirement(name="Machine Learning", normalized_name="Machine Learning", required_level=3, priority="must-have", weight=3),
        JobSkillRequirement(name="SQL", normalized_name="SQL", required_level=2, priority="must-have", weight=3),
        JobSkillRequirement(name="Docker", normalized_name="Docker", required_level=2, priority="preferred", weight=2)
    ]

    analysis = calc.analyze_skill_gap(candidate_skills, "job_test", "Senior ML Engineer", job_reqs)
    assert analysis.readiness_score >= 85
    assert analysis.demonstrated_count == 3
    assert analysis.needs_improvement_count == 1
    assert analysis.missing_count == 0

def test_user_corrects_skill_match():
    calc = SkillGapCalculator()
    # Initially low proficiency
    skills = [
        CandidateSkill(name="Machine Learning", normalized_name="Machine Learning", proficiency=1, evidence="Lab")
    ]
    reqs = [
        JobSkillRequirement(name="Machine Learning", normalized_name="Machine Learning", required_level=3, priority="must-have", weight=3)
    ]
    initial = calc.analyze_skill_gap(skills, "j1", "ML Eng", reqs)
    initial_gap = initial.skill_analysis[0].gap
    assert initial_gap == 2

    # User reviews and corrects proficiency to 3
    skills[0].proficiency = 3
    skills[0].user_confirmed = True
    updated = calc.analyze_skill_gap(skills, "j1", "ML Eng", reqs)
    assert updated.skill_analysis[0].gap == 0
    assert updated.readiness_score == 100
