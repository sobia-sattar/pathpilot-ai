from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class CandidateSkill(BaseModel):
    name: str
    normalized_name: str
    category: str = "General"
    proficiency: int = Field(default=1, ge=0, le=4, description="0: Not demonstrated, 1: Beginner, 2: Basic working knowledge, 3: Intermediate, 4: Advanced")
    evidence: str = ""
    confidence: float = Field(default=0.8, ge=0.0, le=1.0)
    is_inferred: bool = False
    user_confirmed: bool = False

class EducationItem(BaseModel):
    degree: str
    institution: str
    year: str = ""
    coursework: List[str] = []

class ProjectItem(BaseModel):
    title: str
    description: str
    technologies: List[str] = []

class ExperienceItem(BaseModel):
    role: str
    company: str
    duration: str = ""
    description: str = ""

class CandidateProfile(BaseModel):
    id: str = "default_candidate"
    name: str = "Student Candidate"
    email: Optional[str] = None
    headline: str = "Aspiring Tech Professional"
    skills: List[CandidateSkill] = []
    education: List[EducationItem] = []
    projects: List[ProjectItem] = []
    experience: List[ExperienceItem] = []
    raw_text: Optional[str] = None

class JobSkillRequirement(BaseModel):
    name: str
    normalized_name: str
    required_level: int = Field(default=2, ge=1, le=4)
    priority: str = Field(default="must-have", description="'must-have' | 'preferred' | 'optional'")
    category: str = "General"
    weight: int = 3  # 3 for must-have, 2 for preferred, 1 for optional

class TargetJob(BaseModel):
    id: str
    title: str
    company: Optional[str] = "Industry Standard"
    description: str
    required_skills: List[JobSkillRequirement] = []
    preferred_skills: List[JobSkillRequirement] = []
    experience_level: str = "Entry-Level / Junior"
    education_required: str = "Bachelor's in CS, Data Science, STEM, or equivalent practical experience"

class SkillMatchResult(BaseModel):
    skill: str
    normalized_name: str
    category: str
    required_level: int
    current_level: int
    gap: int
    priority: str  # must-have, preferred, optional
    status: str    # demonstrated, needs_improvement, missing
    match_method: str  # exact, alias, semantic_similarity, user_confirmed
    confidence: float
    match_explanation: str
    candidate_evidence: str
    priority_score: float
    reason: str

class SkillGapAnalysisResponse(BaseModel):
    target_job_id: str
    target_job_title: str
    readiness_score: int  # 0 to 100
    weighted_gap: float
    total_skills_analyzed: int
    demonstrated_count: int
    needs_improvement_count: int
    missing_count: int
    skill_analysis: List[SkillMatchResult]
    category_breakdown: Dict[str, Dict[str, Any]]
    analysis_notes: List[str]
    calculation_formula_explanation: str

class LearningResource(BaseModel):
    id: str
    title: str
    provider: str
    canonical_skill: str
    topic: str
    difficulty: str  # Beginner, Intermediate, Advanced
    resource_type: str  # Documentation, Tutorial, Course, Practice
    estimated_hours: int
    url: str
    prerequisites: List[str] = []
    is_free: bool = True
    is_verified: bool = True
    relevance_score: float = 0.0
    why_recommended: str = ""

class PortfolioProject(BaseModel):
    id: str
    title: str
    description: str
    difficulty: str
    relevant_skills: List[str]
    tech_stack: List[str]
    deliverables: List[str]
    estimated_hours: int
    milestones: List[str]
    skills_addressed: List[str]
    relevance_score: float = 0.0
    why_recommended: str = ""

class RoadmapMilestone(BaseModel):
    id: str
    phase: str  # Foundations, Core Skills, Practical Projects, Career Preparation
    phase_number: int
    title: str
    target_skill: str
    why_it_matters: str
    recommended_resource: Optional[LearningResource] = None
    practical_deliverable: str
    prerequisites: List[str] = []
    estimated_hours: int
    completion_criteria: str
    completed: bool = False
    completed_at: Optional[str] = None

class CareerRoadmap(BaseModel):
    target_role: str
    target_job_id: str
    estimated_total_hours: int
    weekly_hours: int
    estimated_weeks: int
    milestones: List[RoadmapMilestone]
    summary_notes: List[str]

class ParseResumeTextRequest(BaseModel):
    text: str

class JobDescriptionParseRequest(BaseModel):
    text: str
    title: Optional[str] = "Custom Target Role"

class UpdateSkillRequest(BaseModel):
    skill_name: str
    new_proficiency: int = Field(ge=0, le=4)
    evidence: Optional[str] = None

class UpdateMilestoneRequest(BaseModel):
    milestone_id: str
    completed: bool

class CareerComparisonResponse(BaseModel):
    role_1_title: str
    role_2_title: str
    overlapping_skills: List[Dict[str, Any]]
    unique_to_role_1: List[Dict[str, Any]]
    unique_to_role_2: List[Dict[str, Any]]
    transition_readiness: int
    transition_advice: str
