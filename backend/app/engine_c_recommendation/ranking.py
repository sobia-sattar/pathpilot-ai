"""
PathPilot AI - Recommendation Ranking & Personalization Engine
Scores and ranks learning resources and portfolio projects against candidate skill deficits,
difficulty alignment, prerequisite constraints, and priority weights.
"""

from typing import List, Dict, Tuple
from app.models.schemas import (
    SkillMatchResult,
    LearningResource,
    PortfolioProject
)
from app.engine_c_recommendation.resource_catalog import get_all_resources
from app.engine_c_recommendation.project_catalog import get_all_projects

DIFFICULTY_NUMERIC = {
    "Beginner": 1,
    "Intermediate": 2,
    "Advanced": 3
}

class RecommendationRanker:
    def __init__(self):
        self.all_resources = get_all_resources()
        self.all_projects = get_all_projects()

    def rank_resources(
        self,
        skill_analysis: List[SkillMatchResult],
        user_weekly_hours: int = 12
    ) -> List[LearningResource]:
        """
        Ranks learning resources specifically to address identified skill gaps.
        Enforces prerequisite awareness and difficulty suitability.
        """
        gap_map: Dict[str, SkillMatchResult] = {
            r.normalized_name.lower(): r for r in skill_analysis if r.gap > 0
        }
        
        ranked_resources: List[LearningResource] = []

        for res in self.all_resources:
            canon_key = res.canonical_skill.lower()
            if canon_key not in gap_map:
                continue

            gap_item = gap_map[canon_key]
            current_lvl = gap_item.current_level
            gap_size = gap_item.gap
            priority = gap_item.priority

            # 1. Base Priority Weight
            weight = 3.0 if priority == "must-have" else (2.0 if priority == "preferred" else 1.0)
            score = (gap_size * 2.5) * weight

            # 2. Difficulty Fit
            res_diff = DIFFICULTY_NUMERIC.get(res.difficulty, 2)
            # Ideal difficulty is roughly current_level + 1
            target_diff = 1 if current_lvl <= 1 else (2 if current_lvl == 2 else 3)
            diff_penalty = abs(res_diff - target_diff) * 1.5
            score = max(1.0, score - diff_penalty)

            # 3. Prerequisite check
            missing_prereqs = []
            for p in res.prerequisites:
                p_key = p.lower()
                if p_key in gap_map and gap_map[p_key].current_level == 0:
                    missing_prereqs.append(p)

            if missing_prereqs:
                score *= 0.6  # Downweight until prerequisite is started
                why = (
                    f"Directly targets {gap_item.priority} skill '{res.canonical_skill}' (Gap: {gap_size}). "
                    f"Recommended after foundational prerequisite '{missing_prereqs[0]}' is reviewed."
                )
            else:
                why = (
                    f"High-impact {res.difficulty.lower()} resource for {gap_item.priority} requirement "
                    f"'{res.canonical_skill}'. Matches current candidate level ({current_lvl}/4)."
                )

            res_copy = res.model_copy()
            res_copy.relevance_score = round(score, 2)
            res_copy.why_recommended = why
            ranked_resources.append(res_copy)

        # Sort descending by relevance score
        ranked_resources.sort(key=lambda x: x.relevance_score, reverse=True)
        return ranked_resources

    def rank_projects(
        self,
        skill_analysis: List[SkillMatchResult]
    ) -> List[PortfolioProject]:
        """
        Ranks portfolio projects by how many high-priority gaps they synthesize and solve.
        """
        gap_map: Dict[str, SkillMatchResult] = {
            r.normalized_name.lower(): r for r in skill_analysis if r.gap > 0
        }

        ranked_projects: List[PortfolioProject] = []

        for proj in self.all_projects:
            covered_gaps = []
            total_score = 0.0

            for skill in proj.skills_addressed:
                s_key = skill.lower()
                if s_key in gap_map:
                    item = gap_map[s_key]
                    w = 3.0 if item.priority == "must-have" else 2.0
                    total_score += (item.gap * 2.0 * w)
                    covered_gaps.append(item.skill)

            if total_score > 0:
                why = (
                    f"Synthesizes {len(covered_gaps)} critical gap skill(s) into one demonstrable portfolio deliverable: "
                    f"{', '.join(covered_gaps[:3])}."
                )
                proj_copy = proj.model_copy()
                proj_copy.relevance_score = round(total_score, 2)
                proj_copy.why_recommended = why
                ranked_projects.append(proj_copy)

        ranked_projects.sort(key=lambda x: x.relevance_score, reverse=True)
        return ranked_projects
