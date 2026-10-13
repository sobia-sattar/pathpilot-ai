"""
PathPilot AI - Job Description Parser
Extracts required (must-have) vs preferred skills, priority classifications,
and target proficiency expectations from job postings.
"""

import re
from typing import List, Dict, Tuple
from app.models.schemas import TargetJob, JobSkillRequirement
from app.engine_b_skill_gap.taxonomy import (
    CANONICAL_TAXONOMY,
    ALIAS_TO_CANONICAL,
    normalize_skill_name,
    get_category_for_skill
)

class JobDescriptionParser:
    def __init__(self):
        self.skill_patterns = []
        for alias, canonical in ALIAS_TO_CANONICAL.items():
            if len(alias) <= 1:
                pattern = re.compile(r'(?<![a-zA-Z0-9])' + re.escape(alias) + r'(?![a-zA-Z0-9])', re.IGNORECASE)
            else:
                pattern = re.compile(r'\b' + re.escape(alias) + r'\b', re.IGNORECASE)
            self.skill_patterns.append((alias, canonical, pattern))

    def parse(self, text: str, title: str = "Custom Target Job") -> TargetJob:
        """
        Parses raw job description text into structured TargetJob with classified requirements.
        """
        if not text or not text.strip():
            return TargetJob(
                id="custom_target_job",
                title=title,
                description="Empty job description provided.",
                required_skills=[],
                preferred_skills=[]
            )

        # 1. Identify Sections: Must-have vs Preferred vs Responsibilities
        must_have_sections, preferred_sections = self._split_job_sections(text)

        required_skills: List[JobSkillRequirement] = []
        preferred_skills: List[JobSkillRequirement] = []
        already_added: Dict[str, str] = {}  # canonical -> priority

        # 2. Extract Skills in Preferred / Nice-To-Have Contexts First
        for alias, canonical, pattern in self.skill_patterns:
            if pattern.search(preferred_sections):
                category = get_category_for_skill(canonical)
                target_lvl = self._estimate_target_proficiency(preferred_sections, pattern)
                preferred_skills.append(JobSkillRequirement(
                    name=canonical,
                    normalized_name=canonical,
                    required_level=target_lvl,
                    priority="preferred",
                    category=category,
                    weight=2
                ))
                already_added[canonical] = "preferred"

        # 3. Extract Skills in Must-Have / Core / Full Text
        for alias, canonical, pattern in self.skill_patterns:
            if canonical in already_added:
                continue

            if pattern.search(must_have_sections) or pattern.search(text):
                category = get_category_for_skill(canonical)
                # Check if context wording indicates preferred
                context_match = self._is_preferred_context(text, pattern)
                priority = "preferred" if context_match else "must-have"
                target_lvl = self._estimate_target_proficiency(text, pattern)

                req = JobSkillRequirement(
                    name=canonical,
                    normalized_name=canonical,
                    required_level=target_lvl,
                    priority=priority,
                    category=category,
                    weight=3 if priority == "must-have" else 2
                )
                if priority == "must-have":
                    required_skills.append(req)
                else:
                    preferred_skills.append(req)
                already_added[canonical] = priority

        return TargetJob(
            id="custom_target_job",
            title=title,
            company="Custom Position",
            description=text[:250] + ("..." if len(text) > 250 else ""),
            required_skills=required_skills,
            preferred_skills=preferred_skills,
            experience_level="Entry-Level / Junior",
            education_required="Bachelor's in relevant discipline or demonstrated equivalent project mastery"
        )

    def _split_job_sections(self, text: str) -> Tuple[str, str]:
        lines = text.splitlines()
        must_have_lines = []
        preferred_lines = []
        current_bucket = "must_have"

        for line in lines:
            lower = line.lower()
            if any(k in lower for k in ["preferred", "nice to have", "plus", "bonus", "desired", "beneficial", "good to have"]):
                current_bucket = "preferred"
            elif any(k in lower for k in ["required", "must have", "minimum qualifications", "basic qualifications", "requirements", "what you need"]):
                current_bucket = "must_have"

            if current_bucket == "preferred":
                preferred_lines.append(line)
            else:
                must_have_lines.append(line)

        return "\n".join(must_have_lines), "\n".join(preferred_lines)

    def _is_preferred_context(self, text: str, pattern: re.Pattern) -> bool:
        sentences = re.split(r'[\n\r]+', text)
        for s in sentences:
            if pattern.search(s):
                lower = s.lower()
                if any(k in lower for k in ["preferred", "nice to have", "plus", "bonus", "helpful", "optional"]):
                    return True
        return False

    def _estimate_target_proficiency(self, text: str, pattern: re.Pattern) -> int:
        sentences = re.split(r'[\n\r]+', text)
        target_lvl = 2  # default: basic working knowledge (level 2)

        for s in sentences:
            if pattern.search(s):
                lower = s.lower()
                if any(w in lower for w in ["expert", "mastery", "deep knowledge", "extensive experience", "senior", "advanced"]):
                    return 4
                elif any(w in lower for w in ["proficient", "solid understanding", "strong experience", "intermediate"]):
                    return 3
                elif any(w in lower for w in ["working knowledge", "hands-on", "familiarity", "basic"]):
                    return 2
                elif any(w in lower for w in ["exposure", "awareness", "fundamental"]):
                    return 1

        return target_lvl
