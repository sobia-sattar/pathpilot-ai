"""
PathPilot AI - Skill Matcher
Computes exact matches, alias normalization matches, and controlled semantic similarity.
Handles explainability, confidence scoring, and uncertainty flagging.
"""

from typing import Dict, List, Optional, Tuple, Any
import re
from rapidfuzz import fuzz
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from app.engine_b_skill_gap.taxonomy import (
    CANONICAL_TAXONOMY,
    ALIAS_TO_CANONICAL,
    normalize_skill_name,
    get_skill_metadata
)
from app.models.schemas import CandidateSkill, JobSkillRequirement, SkillMatchResult

class SkillMatcher:
    def __init__(self):
        # Build canonical skill descriptions for semantic similarity support
        self.canonical_names = list(CANONICAL_TAXONOMY.keys())
        self.corpus = []
        for name in self.canonical_names:
            meta = CANONICAL_TAXONOMY[name]
            text = f"{name} {meta['description']} {' '.join(meta['aliases'])}"
            self.corpus.append(text)
        
        self.vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
        self.tfidf_matrix = self.vectorizer.fit_transform(self.corpus)

    def match_candidate_to_requirement(
        self,
        candidate_skills: List[CandidateSkill],
        requirement: JobSkillRequirement
    ) -> SkillMatchResult:
        """
        Finds the best candidate match for a specific job skill requirement.
        Evaluates exact matches, alias matches, and controlled semantic similarity.
        """
        req_norm = requirement.normalized_name or normalize_skill_name(requirement.name) or requirement.name
        req_level = requirement.required_level
        req_priority = requirement.priority
        category = requirement.category

        # 1. Look for Exact Canonical or Alias Match
        for cs in candidate_skills:
            cs_norm = cs.normalized_name or normalize_skill_name(cs.name) or cs.name
            if cs_norm.lower() == req_norm.lower() or cs.name.lower() == requirement.name.lower():
                current_level = cs.proficiency
                gap = max(0, req_level - current_level)
                status = "demonstrated" if gap == 0 else "needs_improvement"
                
                method = "user_confirmed" if cs.user_confirmed else ("alias" if cs.name.lower() != req_norm.lower() else "exact")
                confidence = 1.0 if method == "exact" else 0.95

                explanation = f"Exact match found between candidate skill '{cs.name}' and job requirement '{requirement.name}'."
                if method == "alias":
                    explanation = f"Matched via taxonomy alias: '{cs.name}' resolves to canonical '{req_norm}'."

                reason = self._build_reason(gap, req_priority, cs.proficiency, req_level, req_norm)
                priority_score = self._compute_priority_score(gap, req_priority)

                return SkillMatchResult(
                    skill=requirement.name,
                    normalized_name=req_norm,
                    category=category,
                    required_level=req_level,
                    current_level=current_level,
                    gap=gap,
                    priority=req_priority,
                    status=status,
                    match_method=method,
                    confidence=confidence,
                    match_explanation=explanation,
                    candidate_evidence=cs.evidence or "Demonstrated in profile",
                    priority_score=priority_score,
                    reason=reason
                )

        # 2. Look for Controlled Fuzzy Match using RapidFuzz
        best_fuzzy_match = None
        best_fuzzy_score = 0.0
        for cs in candidate_skills:
            ratio = fuzz.token_sort_ratio(cs.name.lower(), requirement.name.lower())
            if ratio > best_fuzzy_score and ratio >= 80:
                best_fuzzy_score = ratio
                best_fuzzy_match = cs

        if best_fuzzy_match:
            current_level = best_fuzzy_match.proficiency
            gap = max(0, req_level - current_level)
            status = "demonstrated" if gap == 0 else "needs_improvement"
            conf = round(best_fuzzy_score / 100.0, 2)
            
            explanation = (
                f"Fuzzy lexical match ({best_fuzzy_score:.0f}% similarity) between "
                f"'{best_fuzzy_match.name}' and required '{requirement.name}'."
            )
            reason = self._build_reason(gap, req_priority, current_level, req_level, req_norm)
            priority_score = self._compute_priority_score(gap, req_priority)

            return SkillMatchResult(
                skill=requirement.name,
                normalized_name=req_norm,
                category=category,
                required_level=req_level,
                current_level=current_level,
                gap=gap,
                priority=req_priority,
                status=status,
                match_method="semantic_similarity",
                confidence=conf,
                match_explanation=explanation,
                candidate_evidence=best_fuzzy_match.evidence or "Partial match requiring confirmation",
                priority_score=priority_score,
                reason=reason
            )

        # 3. Look for TF-IDF Semantic Similarity as Supporting Evidence (Uncertain Match)
        best_semantic_candidate = None
        best_semantic_score = 0.0
        for cs in candidate_skills:
            cand_text = f"{cs.name} {cs.evidence}"
            cand_vec = self.vectorizer.transform([cand_text])
            
            req_text = f"{requirement.name} {category}"
            req_vec = self.vectorizer.transform([req_text])
            
            sim = float(cosine_similarity(cand_vec, req_vec)[0][0])
            if sim > best_semantic_score and sim >= 0.50:
                best_semantic_score = sim
                best_semantic_candidate = cs

        if best_semantic_candidate and best_semantic_score >= 0.60:
            # Semantic match detected but flagged for user confirmation
            # We treat proficiency as conservative (Level 1 or candidate's level - 1)
            estimated_level = max(1, best_semantic_candidate.proficiency - 1)
            gap = max(0, req_level - estimated_level)
            conf = round(best_semantic_score, 2)
            
            explanation = (
                f"Semantic relationship detected (similarity {conf}): Candidate demonstrates related skill "
                f"'{best_semantic_candidate.name}', but direct mastery of '{requirement.name}' is unverified."
            )
            reason = (
                f"Related background identified in '{best_semantic_candidate.name}'. "
                f"Requires confirmation for {requirement.name} (Priority: {req_priority})."
            )
            priority_score = self._compute_priority_score(gap, req_priority)

            return SkillMatchResult(
                skill=requirement.name,
                normalized_name=req_norm,
                category=category,
                required_level=req_level,
                current_level=estimated_level,
                gap=gap,
                priority=req_priority,
                status="needs_improvement",
                match_method="semantic_similarity",
                confidence=conf,
                match_explanation=explanation,
                candidate_evidence=f"Inferred from related skill: {best_semantic_candidate.name} ({best_semantic_candidate.evidence})",
                priority_score=priority_score,
                reason=reason
            )

        # 4. No Match - Missing / Unverified Skill
        gap = req_level
        reason = (
            f"Key skill to learn (Target: Level {req_level}/4). "
            f"Recommended foundation for this career track."
        )
        priority_score = self._compute_priority_score(gap, req_priority)

        return SkillMatchResult(
            skill=requirement.name,
            normalized_name=req_norm,
            category=category,
            required_level=req_level,
            current_level=0,
            gap=gap,
            priority=req_priority,
            status="missing",
            match_method="unmatched",
            confidence=0.0,
            match_explanation=f"Ready to learn for {requirement.name}.",
            candidate_evidence="Ready to learn",
            priority_score=priority_score,
            reason=reason
        )

    def _compute_priority_score(self, gap: int, priority: str) -> float:
        weight_mult = 3.0 if priority == "must-have" else (2.0 if priority == "preferred" else 1.0)
        return float(gap * weight_mult)

    def _build_reason(self, gap: int, priority: str, current_lvl: int, req_lvl: int, skill_name: str) -> str:
        if gap == 0:
            return f"Great job! You've reached Level {current_lvl}/4, satisfying the benchmark for this role."
        elif current_lvl > 0:
            return (
                f"You're at Level {current_lvl}/4! Leveling up to Level {req_lvl}/4 will boost your readiness score."
            )
        else:
            return f"Recommended starting skill (Target: Level {req_lvl}/4). A core building block for this career path."
