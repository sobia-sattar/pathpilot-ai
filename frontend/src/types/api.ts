export interface CandidateSkill {
  name: string;
  normalized_name: string;
  category: string;
  proficiency: number; // 0 to 4
  evidence: string;
  confidence: number;
  is_inferred: boolean;
  user_confirmed: boolean;
}

export interface EducationItem {
  degree: string;
  institution: string;
  year?: string;
  coursework: string[];
}

export interface ProjectItem {
  title: string;
  description: string;
  technologies: string[];
}

export interface ExperienceItem {
  role: string;
  company: string;
  duration?: string;
  description: string;
}

export interface CandidateProfile {
  id: string;
  name: string;
  email?: string;
  headline: string;
  skills: CandidateSkill[];
  education: EducationItem[];
  projects: ProjectItem[];
  experience: ExperienceItem[];
  raw_text?: string;
}

export interface JobSkillRequirement {
  name: string;
  normalized_name: string;
  required_level: number;
  priority: 'must-have' | 'preferred' | 'optional';
  category: string;
  weight: number;
}

export interface TargetJob {
  id: string;
  title: string;
  company?: string;
  description: string;
  experience_level?: string;
  education_required?: string;
  required_skills: JobSkillRequirement[];
  preferred_skills: JobSkillRequirement[];
}

export interface SkillMatchResult {
  skill: string;
  normalized_name: string;
  category: string;
  required_level: number;
  current_level: number;
  gap: number;
  priority: 'must-have' | 'preferred' | 'optional';
  status: 'demonstrated' | 'needs_improvement' | 'missing';
  match_method: 'exact' | 'alias' | 'semantic_similarity' | 'user_confirmed' | 'unmatched';
  confidence: number;
  match_explanation: string;
  candidate_evidence: string;
  priority_score: number;
  reason: string;
}

export interface CategoryBreakdown {
  total_skills: number;
  demonstrated: number;
  needs_improvement: number;
  missing: number;
  avg_gap: number;
}

export interface SkillGapAnalysisResponse {
  target_job_id: string;
  target_job_title: string;
  readiness_score: number;
  weighted_gap: number;
  total_skills_analyzed: number;
  demonstrated_count: number;
  needs_improvement_count: number;
  missing_count: number;
  skill_analysis: SkillMatchResult[];
  category_breakdown: Record<string, CategoryBreakdown>;
  analysis_notes: string[];
  calculation_formula_explanation: string;
}

export interface LearningResource {
  id: string;
  title: string;
  provider: string;
  canonical_skill: string;
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  resource_type: 'Documentation' | 'Tutorial' | 'Course' | 'Practice';
  estimated_hours: number;
  url: string;
  prerequisites: string[];
  is_free: boolean;
  is_verified: boolean;
  relevance_score: number;
  why_recommended: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  relevant_skills: string[];
  tech_stack: string[];
  deliverables: string[];
  estimated_hours: number;
  milestones: string[];
  skills_addressed: string[];
  relevance_score: number;
  why_recommended: string;
}

export interface RoadmapMilestone {
  id: string;
  phase: string;
  phase_number: number;
  title: string;
  target_skill: string;
  why_it_matters: string;
  recommended_resource?: LearningResource | null;
  practical_deliverable: string;
  prerequisites: string[];
  estimated_hours: number;
  completion_criteria: string;
  completed: boolean;
  completed_at?: string | null;
}

export interface CareerRoadmap {
  target_role: string;
  target_job_id: string;
  estimated_total_hours: number;
  weekly_hours: number;
  estimated_weeks: number;
  milestones: RoadmapMilestone[];
  summary_notes: string[];
}

export interface CareerComparisonResponse {
  role_1_title: string;
  role_2_title: string;
  overlapping_skills: Array<{
    skill: string;
    role_1_level: number;
    role_2_level: number;
    role_1_priority: string;
    role_2_priority: string;
  }>;
  unique_to_role_1: Array<{
    skill: string;
    required_level: number;
    priority: string;
  }>;
  unique_to_role_2: Array<{
    skill: string;
    required_level: number;
    priority: string;
  }>;
  transition_readiness: number;
  transition_advice: string;
}

export interface ProgressSummary {
  candidate_name: string;
  target_role: string;
  readiness_score: number;
  total_skills_profile: number;
  total_gaps: number;
  must_have_gaps: number;
  total_milestones: number;
  completed_milestones: number;
  milestone_completion_rate: number;
  completed_hours: number;
  remaining_hours: number;
  recent_history: Array<{
    id: number;
    event_type: string;
    entity_id: string;
    details: Record<string, any>;
    created_at: string;
  }>;
}
