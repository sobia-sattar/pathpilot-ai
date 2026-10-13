"""
PathPilot AI - Dynamic Career Roadmap Generator
Synthesizes skill gap results, prerequisite dependencies, and project mappings
into a sequenced, phased career progression roadmap.
"""

from typing import List, Dict, Optional
import math
from app.models.schemas import (
    SkillMatchResult,
    RoadmapMilestone,
    CareerRoadmap,
    LearningResource,
    PortfolioProject
)
from app.engine_b_skill_gap.taxonomy import get_prerequisites_for_skill
from app.engine_c_recommendation.ranking import RecommendationRanker

class RoadmapGenerator:
    def __init__(self):
        self.ranker = RecommendationRanker()

    def generate_roadmap(
        self,
        target_role_title: str,
        target_job_id: str,
        skill_analysis: List[SkillMatchResult],
        weekly_hours: int = 12
    ) -> CareerRoadmap:
        """
        Builds a phased, sequenced milestone roadmap tailored to the candidate's gaps.
        """
        weekly_hours = max(4, min(40, weekly_hours))
        
        ranked_resources = self.ranker.rank_resources(skill_analysis, user_weekly_hours=weekly_hours)
        ranked_projects = self.ranker.rank_projects(skill_analysis)
        
        resource_map: Dict[str, LearningResource] = {
            r.canonical_skill.lower(): r for r in ranked_resources
        }

        # Filter gap items
        gap_items = [r for r in skill_analysis if r.gap > 0]
        # Sort by prerequisite order and priority score
        foundational_gaps = [r for r in gap_items if r.current_level == 0]
        refinement_gaps = [r for r in gap_items if r.current_level > 0]

        milestones: List[RoadmapMilestone] = []
        milestone_counter = 1

        # ==========================================
        # PHASE 1: LEARNING FOUNDATIONS
        # ==========================================
        for item in foundational_gaps[:3]:
            res = resource_map.get(item.normalized_name.lower())
            hours = res.estimated_hours if res else 10
            prereqs = get_prerequisites_for_skill(item.normalized_name)

            m = RoadmapMilestone(
                id=f"m_{milestone_counter}",
                phase="Foundations",
                phase_number=1,
                title=f"Establish Foundations in {item.skill}",
                target_skill=item.skill,
                why_it_matters=f"Unlocks a currently missing {item.priority} requirement needed at Level {item.required_level}/4.",
                recommended_resource=res,
                practical_deliverable=f"Complete foundational exercises and build a minimal verification script demonstrating {item.skill}.",
                prerequisites=prereqs,
                estimated_hours=hours,
                completion_criteria=f"Explain core concepts of {item.skill} and commit a functional syntax/concept test to GitHub.",
                completed=False
            )
            milestones.append(m)
            milestone_counter += 1

        # ==========================================
        # PHASE 2: CORE SKILLS & DEEP DIVES
        # ==========================================
        for item in refinement_gaps[:3]:
            res = resource_map.get(item.normalized_name.lower())
            hours = res.estimated_hours if res else 12

            m = RoadmapMilestone(
                id=f"m_{milestone_counter}",
                phase="Core Skills",
                phase_number=2,
                title=f"Elevate {item.skill} to Production Standard",
                target_skill=item.skill,
                why_it_matters=f"Closes proficiency deficit from Level {item.current_level} to required Level {item.required_level} for {target_role_title}.",
                recommended_resource=res,
                practical_deliverable=f"Implement intermediate patterns, modular abstractions, and benchmarks for {item.skill}.",
                prerequisites=[item.skill],
                estimated_hours=hours,
                completion_criteria=f"Successfully pass comprehensive tests and demonstrate idiomatic best practices in {item.skill}.",
                completed=False
            )
            milestones.append(m)
            milestone_counter += 1

        # ==========================================
        # PHASE 3: PRACTICAL PORTFOLIO PROJECTS
        # ==========================================
        top_project = ranked_projects[0] if ranked_projects else None
        if top_project:
            m = RoadmapMilestone(
                id=f"m_{milestone_counter}",
                phase="Practical Projects",
                phase_number=3,
                title=f"Build Portfolio Project: {top_project.title}",
                target_skill=", ".join(top_project.relevant_skills[:2]),
                why_it_matters=f"Integrates multiple target requirements ({', '.join(top_project.skills_addressed[:3])}) into demonstrable proof of capability.",
                recommended_resource=None,
                practical_deliverable=f"Production-ready repository implementing: {top_project.deliverables[0]} and {top_project.deliverables[1] if len(top_project.deliverables) > 1 else 'interactive demo'}.",
                prerequisites=top_project.relevant_skills[:2],
                estimated_hours=top_project.estimated_hours,
                completion_criteria="Full code repository published with comprehensive README, setup instructions, architecture diagram, and demo link.",
                completed=False
            )
            milestones.append(m)
            milestone_counter += 1

        # ==========================================
        # PHASE 4: CAREER PREPARATION & PRODUCTIONIZATION
        # ==========================================
        m_prep = RoadmapMilestone(
            id=f"m_{milestone_counter}",
            phase="Career Preparation",
            phase_number=4,
            title="Production Readiness, Code Review & Technical Defense",
            target_skill="Testing & Quality Assurance",
            why_it_matters="Validates that implementations adhere to engineering rigor, automated testing, and articulate technical storytelling in interviews.",
            recommended_resource=None,
            practical_deliverable="Add unit testing suite, CI workflow badge, and record a 3-minute technical walkthrough video of the portfolio project.",
            prerequisites=[],
            estimated_hours=8,
            completion_criteria="90%+ test coverage on core algorithms/endpoints and polished GitHub profile showcase.",
            completed=False
        )
        milestones.append(m_prep)

        # Totals
        total_hours = sum(m.estimated_hours for m in milestones)
        estimated_weeks = max(1, math.ceil(total_hours / float(weekly_hours)))

        summary_notes = [
            f"Personalized roadmap generated for '{target_role_title}'.",
            f"Total estimated effort: {total_hours} hours across {len(milestones)} sequenced milestones.",
            f"Estimated timeline: ~{estimated_weeks} weeks at {weekly_hours} hours/week of dedicated study.",
            "Milestone completion and proficiency updates update progress tracking dynamically in the application."
        ]

        return CareerRoadmap(
            target_role=target_role_title,
            target_job_id=target_job_id,
            estimated_total_hours=total_hours,
            weekly_hours=weekly_hours,
            estimated_weeks=estimated_weeks,
            milestones=milestones,
            summary_notes=summary_notes
        )
