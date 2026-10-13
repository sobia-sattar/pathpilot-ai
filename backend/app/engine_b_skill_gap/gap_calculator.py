"""
PathPilot AI - Skill Gap Calculator
Calculates proficiency deficits, weighted readiness scores, prerequisite dependencies,
and explainable ranked gap lists.
"""

from typing import Dict, List, Any
from app.models.schemas import (
    CandidateSkill,
    JobSkillRequirement,
    SkillMatchResult,
    SkillGapAnalysisResponse
)
from app.engine_b_skill_gap.taxonomy import (
    CANONICAL_TAXONOMY,
    get_prerequisites_for_skill,
    get_category_for_skill
)
from app.engine_b_skill_gap.matcher import SkillMatcher

PRIORITY_WEIGHTS = {
    "must-have": 3,
    "preferred": 2,
    "optional": 1
}

class SkillGapCalculator:
    def __init__(self):
        self.matcher = SkillMatcher()

    def analyze_skill_gap(
        self,
        candidate_skills: List[CandidateSkill],
        target_job_id: str,
        target_job_title: str,
        requirements: List[JobSkillRequirement]
    ) -> SkillGapAnalysisResponse:
        """
        Runs comprehensive skill gap analysis comparing candidate profile against job requirements.
        """
        results: List[SkillMatchResult] = []
        
        # 1. Match each requirement against candidate skills
        for req in requirements:
            match_res = self.matcher.match_candidate_to_requirement(candidate_skills, req)
            results.append(match_res)

        # 2. Check prerequisite DAG dependencies among missing/gap skills
        # If skill A is a prerequisite for skill B (and B has a gap), skill A gets boosted priority!
        gap_skill_names = {r.normalized_name for r in results if r.gap > 0}
        
        prereq_dependency_count: Dict[str, int] = {}
        for skill_name in gap_skill_names:
            prereqs = get_prerequisites_for_skill(skill_name)
            for p in prereqs:
                if p in gap_skill_names:
                    prereq_dependency_count[p] = prereq_dependency_count.get(p, 0) + 1

        # 3. Refine priority score and explainability with prerequisite factor
        for r in results:
            if r.gap > 0:
                dep_boost = prereq_dependency_count.get(r.normalized_name, 0)
                if dep_boost > 0:
                    r.priority_score += (dep_boost * 2.5)
                    r.reason += f" Unlocks {dep_boost} upcoming learning milestone(s)!"

        # Sort results: largest priority score first, then largest gap
        results.sort(key=lambda x: (x.priority_score, x.gap), reverse=True)

        # 4. Compute Weighted Deficit & Readiness Score
        total_weighted_target = 0
        total_weighted_gap = 0
        demonstrated_count = 0
        needs_improvement_count = 0
        missing_count = 0

        for r in results:
            weight = PRIORITY_WEIGHTS.get(r.priority.lower(), 2)
            total_weighted_target += (r.required_level * weight)
            total_weighted_gap += (r.gap * weight)

            if r.status == "demonstrated":
                demonstrated_count += 1
            elif r.status == "needs_improvement":
                needs_improvement_count += 1
            elif r.status == "missing":
                missing_count += 1

        if total_weighted_target > 0:
            deficit_ratio = total_weighted_gap / float(total_weighted_target)
            readiness_score = max(0, min(100, round(100.0 * (1.0 - deficit_ratio))))
        else:
            readiness_score = 100

        # 5. Category Breakdown
        category_breakdown: Dict[str, Dict[str, Any]] = {}
        for r in results:
            cat = r.category or "General"
            if cat not in category_breakdown:
                category_breakdown[cat] = {
                    "total_skills": 0,
                    "demonstrated": 0,
                    "needs_improvement": 0,
                    "missing": 0,
                    "avg_gap": 0.0,
                    "gaps_sum": 0
                }
            category_breakdown[cat]["total_skills"] += 1
            category_breakdown[cat]["gaps_sum"] += r.gap
            if r.status == "demonstrated":
                category_breakdown[cat]["demonstrated"] += 1
            elif r.status == "needs_improvement":
                category_breakdown[cat]["needs_improvement"] += 1
            else:
                category_breakdown[cat]["missing"] += 1

        for cat, stats in category_breakdown.items():
            if stats["total_skills"] > 0:
                stats["avg_gap"] = round(stats["gaps_sum"] / float(stats["total_skills"]), 2)
            del stats["gaps_sum"]

        # 6. Analysis Notes & Disclaimer
        analysis_notes = [
            f"Evaluated {len(results)} requirements for target role '{target_job_title}'.",
            f"Identified {demonstrated_count} fully demonstrated skill(s), {needs_improvement_count} skill(s) requiring improvement, and {missing_count} unverified skill(s).",
            "Proficiency ratings derived from resume evidence and self-assessments.",
            "IMPORTANT: Readiness score reflects curriculum and requirements coverage. It does not represent an employment guarantee or offer probability."
        ]

        formula_explanation = (
            "Readiness Score Formula: Readiness = round(100 * (1 - (sum(gap * priority_weight) / sum(target_level * priority_weight)))). "
            "Weights: Must-have = 3, Preferred = 2, Optional = 1. "
            "Proficiency Scale: 0 (Not demonstrated), 1 (Beginner), 2 (Basic working knowledge), 3 (Intermediate), 4 (Advanced)."
        )

        return SkillGapAnalysisResponse(
            target_job_id=target_job_id,
            target_job_title=target_job_title,
            readiness_score=readiness_score,
            weighted_gap=round(total_weighted_gap, 2),
            total_skills_analyzed=len(results),
            demonstrated_count=demonstrated_count,
            needs_improvement_count=needs_improvement_count,
            missing_count=missing_count,
            skill_analysis=results,
            category_breakdown=category_breakdown,
            analysis_notes=analysis_notes,
            calculation_formula_explanation=formula_explanation
        )
