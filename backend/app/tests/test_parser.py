import pytest
from app.engine_a_parser.resume_parser import ResumeParser
from app.engine_a_parser.job_parser import JobDescriptionParser

def test_resume_parser_with_aliases_and_evidence():
    parser = ResumeParser()
    sample_text = """
    Jane Doe
    jane@example.com
    
    SKILLS
    Python, ML, Postgres, React
    
    PROJECTS
    Predictive Sales Modeler
    • Built supervised ML algorithms using scikit-learn in Python to forecast monthly retail revenue.
    • Stored clean transactional datasets in Postgres database.
    """
    profile = parser.parse(sample_text)
    assert profile.name == "Jane Doe"
    assert profile.email == "jane@example.com"
    
    skill_names = {s.normalized_name for s in profile.skills}
    assert "Machine Learning" in skill_names
    assert "Python" in skill_names
    assert "PostgreSQL" in skill_names

    # Check evidence extraction
    ml_skill = next(s for s in profile.skills if s.normalized_name == "Machine Learning")
    assert "scikit-learn" in ml_skill.evidence or "ML" in ml_skill.evidence
    assert ml_skill.proficiency >= 2

def test_resume_parser_no_relevant_evidence():
    parser = ResumeParser()
    empty_text = """
    John Smith
    Experienced professional in culinary hospitality and restaurant management.
    Managed kitchen inventory and customer service.
    """
    profile = parser.parse(empty_text)
    assert profile.name == "John Smith"
    # Tech skills should be empty or zero
    assert len(profile.skills) == 0

def test_job_parser_distinguishes_must_have_and_preferred():
    job_parser = JobDescriptionParser()
    job_text = """
    Software Engineer (AI Platforms)
    
    Requirements:
    • Must have strong proficiency in Python and REST APIs.
    • Required: Solid understanding of Machine Learning and Docker containerization.
    
    Preferred Qualifications:
    • Experience with PyTorch or Deep Learning is a plus.
    • Familiarity with PostgreSQL is preferred.
    """
    job = job_parser.parse(job_text, title="AI Platforms Engineer")
    req_names = {r.normalized_name for r in job.required_skills}
    pref_names = {r.normalized_name for r in job.preferred_skills}

    assert "Python" in req_names
    assert "Machine Learning" in req_names
    assert "PyTorch" in pref_names or "PostgreSQL" in pref_names
