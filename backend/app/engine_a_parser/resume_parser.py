"""
PathPilot AI - Resume Parser Engine
Extracts technical competencies, education, projects, and work experience from resume text.
Extracts practical evidence, starting proficiency estimates, and confidence scores.
"""

import re
from typing import List, Dict, Tuple, Optional
from app.models.schemas import (
    CandidateProfile,
    CandidateSkill,
    EducationItem,
    ProjectItem,
    ExperienceItem
)
from app.engine_b_skill_gap.taxonomy import (
    CANONICAL_TAXONOMY,
    ALIAS_TO_CANONICAL,
    normalize_skill_name,
    get_category_for_skill
)

class ResumeParser:
    def __init__(self):
        # Precompile skill search regex patterns for accuracy and speed
        # Ensure word boundaries so 'c' does not match every word with 'c'
        self.skill_patterns = []
        for alias, canonical in ALIAS_TO_CANONICAL.items():
            # Avoid single short letter boundary false positives except specific ones like C or R
            if len(alias) <= 1:
                pattern = re.compile(r'(?<![a-zA-Z0-9])' + re.escape(alias) + r'(?![a-zA-Z0-9])', re.IGNORECASE)
            else:
                pattern = re.compile(r'\b' + re.escape(alias) + r'\b', re.IGNORECASE)
            self.skill_patterns.append((alias, canonical, pattern))

    def parse(self, raw_text: str) -> CandidateProfile:
        """
        Parses raw resume text and constructs a reviewable CandidateProfile.
        """
        if not raw_text or not raw_text.strip():
            return CandidateProfile(raw_text="")

        lines = [line.strip() for line in raw_text.splitlines() if line.strip()]
        
        # 1. Candidate Name & Contact
        name, email, headline = self._extract_header_info(lines, raw_text)

        # 2. Extract Structured Sections
        sections = self._split_into_sections(lines)

        # 3. Extract Education
        education = self._extract_education(sections.get("education", []))

        # 4. Extract Projects
        projects = self._extract_projects(sections.get("projects", []))

        # 5. Extract Experience
        experience = self._extract_experience(sections.get("experience", []))

        # 6. Extract Skills with Evidence & Starting Proficiency
        skills = self._extract_skills(raw_text, sections, projects, experience, education)

        return CandidateProfile(
            id="candidate_profile",
            name=name,
            email=email,
            headline=headline,
            skills=skills,
            education=education,
            projects=projects,
            experience=experience,
            raw_text=raw_text
        )

    def _extract_header_info(self, lines: List[str], full_text: str) -> Tuple[str, Optional[str], str]:
        email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', full_text)
        email = email_match.group(0) if email_match else None

        name = "Student Candidate"
        headline = "Aspiring Tech Professional"

        for line in lines[:5]:
            clean = re.sub(r'[^\w\s]', '', line).strip()
            if email and email in line:
                continue
            if re.search(r'(resume|curriculum|cv|phone|http|github|linkedin)', line, re.I):
                continue
            words = clean.split()
            if 2 <= len(words) <= 4 and all(w[0].isupper() for w in words if w):
                name = clean
                break

        # Check for headline in early lines
        for line in lines[1:6]:
            if any(term in line.lower() for term in ["student", "engineer", "developer", "candidate", "intern", "graduate"]):
                headline = line[:80].strip()
                break

        return name, email, headline

    def _split_into_sections(self, lines: List[str]) -> Dict[str, List[str]]:
        sections: Dict[str, List[str]] = {
            "skills": [],
            "education": [],
            "projects": [],
            "experience": [],
            "certifications": [],
            "other": []
        }
        current_section = "other"

        section_headers = {
            "skills": re.compile(r'^(technical\s+)?skills\b|technologies\b|tools\b', re.I),
            "education": re.compile(r'^education\b|academic\s+background\b|coursework\b', re.I),
            "projects": re.compile(r'^projects\b|key\s+projects\b|academic\s+projects\b|portfolio\b', re.I),
            "experience": re.compile(r'^(work\s+)?experience\b|employment\b|internships\b', re.I),
            "certifications": re.compile(r'^certifications?\b|licenses\b', re.I)
        }

        for line in lines:
            header_detected = False
            for sec_name, pattern in section_headers.items():
                if pattern.search(line) and len(line) < 40:
                    current_section = sec_name
                    header_detected = True
                    break
            if not header_detected:
                sections[current_section].append(line)

        return sections

    def _extract_education(self, lines: List[str]) -> List[EducationItem]:
        items: List[EducationItem] = []
        if not lines:
            return items

        current_degree = "Bachelor of Science"
        current_inst = "University"
        current_year = ""
        coursework = []

        for line in lines:
            deg_match = re.search(r'(bachelor|master|b\.s|m\.s|b\.tech|m\.tech|bachelor of science|diploma|associate)\b[^\n,]*', line, re.I)
            if deg_match:
                current_degree = deg_match.group(0).strip()
            
            inst_match = re.search(r'(university|institute|college|school|academy)\b[^\n,]*', line, re.I)
            if inst_match:
                current_inst = inst_match.group(0).strip()

            year_match = re.search(r'(20\d\d\s*[-–]\s*20\d\d|20\d\d)', line)
            if year_match:
                current_year = year_match.group(0)

            if "course" in line.lower() or "subjects" in line.lower():
                parts = re.split(r'[,;:]', line)
                for p in parts[1:]:
                    if p.strip():
                        coursework.append(p.strip())

        items.append(EducationItem(
            degree=current_degree,
            institution=current_inst,
            year=current_year,
            coursework=coursework
        ))
        return items

    def _extract_projects(self, lines: List[str]) -> List[ProjectItem]:
        projects: List[ProjectItem] = []
        current_title = ""
        current_desc = []
        
        for line in lines:
            if (line.startswith("•") or line.startswith("-") or line.startswith("*")) and current_title:
                current_desc.append(line.lstrip("•-* "))
            elif len(line) < 60 and not line.startswith("•") and not line.startswith("-"):
                if current_title and current_desc:
                    techs = self._detect_technologies(" ".join(current_desc))
                    projects.append(ProjectItem(title=current_title, description=" ".join(current_desc), technologies=techs))
                    current_desc = []
                current_title = line
            else:
                current_desc.append(line)

        if current_title and current_desc:
            techs = self._detect_technologies(" ".join(current_desc))
            projects.append(ProjectItem(title=current_title, description=" ".join(current_desc), technologies=techs))

        return projects

    def _extract_experience(self, lines: List[str]) -> List[ExperienceItem]:
        experiences: List[ExperienceItem] = []
        current_role = ""
        current_company = ""
        current_desc = []

        for line in lines:
            if (line.startswith("•") or line.startswith("-")) and current_role:
                current_desc.append(line.lstrip("•- "))
            elif len(line) < 60 and not line.startswith("•"):
                if current_role and current_desc:
                    experiences.append(ExperienceItem(
                        role=current_role,
                        company=current_company or "Company",
                        description=" ".join(current_desc)
                    ))
                    current_desc = []
                parts = line.split(" at ") if " at " in line else line.split(" - ")
                current_role = parts[0].strip()
                current_company = parts[1].strip() if len(parts) > 1 else ""
            else:
                current_desc.append(line)

        if current_role and current_desc:
            experiences.append(ExperienceItem(
                role=current_role,
                company=current_company or "Company",
                description=" ".join(current_desc)
            ))

        return experiences

    def _detect_technologies(self, text: str) -> List[str]:
        techs = []
        for alias, canonical, pattern in self.skill_patterns:
            if pattern.search(text):
                if canonical not in techs:
                    techs.append(canonical)
        return techs

    def _extract_skills(
        self,
        full_text: str,
        sections: Dict[str, List[str]],
        projects: List[ProjectItem],
        experience: List[ExperienceItem],
        education: List[EducationItem]
    ) -> List[CandidateSkill]:
        """
        Discovers skills, locates concrete evidence, and estimates initial proficiency level.
        """
        discovered_skills: Dict[str, Dict] = {}
        sentences = re.split(r'[.\n\r;]+', full_text)
        cleaned_sentences = [s.strip() for s in sentences if len(s.strip()) > 8]

        skills_section_text = " ".join(sections.get("skills", []))
        projects_text = " ".join([f"{p.title} {p.description}" for p in projects])
        exp_text = " ".join([f"{e.role} {e.company} {e.description}" for e in experience])
        edu_text = " ".join([f"{ed.degree} {' '.join(ed.coursework)}" for ed in education])

        for alias, canonical, pattern in self.skill_patterns:
            # Check if mentioned anywhere
            if not pattern.search(full_text):
                continue

            if canonical in discovered_skills:
                continue

            # Find specific evidence sentence
            evidence_sentences = []
            for s in cleaned_sentences:
                if pattern.search(s):
                    # Sanitize sentence snippet
                    clean_s = re.sub(r'^[•\-\*\s]+', '', s).strip()
                    if len(clean_s) > 15:
                        evidence_sentences.append(clean_s)
                        if len(evidence_sentences) >= 2:
                            break

            evidence = " | ".join(evidence_sentences[:2]) if evidence_sentences else f"Listed under skills: '{alias}'"

            # Determine initial proficiency estimate (Level 1 to 4)
            in_skills_list = bool(pattern.search(skills_section_text))
            in_projects = bool(pattern.search(projects_text))
            in_exp = bool(pattern.search(exp_text))
            in_edu = bool(pattern.search(edu_text))

            # Rules:
            # Level 1: Listed in skills section or coursework only
            # Level 2: Used in academic projects or student projects
            # Level 3: Used in full project or professional/internship experience
            # Level 4: Mentioned extensively in professional experience with advanced impact
            if in_exp and in_projects:
                proficiency = 3
                confidence = 0.92
                is_inferred = False
            elif in_exp:
                proficiency = 3
                confidence = 0.88
                is_inferred = False
            elif in_projects:
                proficiency = 2
                confidence = 0.85
                is_inferred = False
            elif in_edu:
                proficiency = 1
                confidence = 0.70
                is_inferred = True
            elif in_skills_list:
                proficiency = 1
                confidence = 0.75
                is_inferred = False
            else:
                proficiency = 1
                confidence = 0.65
                is_inferred = True

            category = get_category_for_skill(canonical)

            discovered_skills[canonical] = {
                "name": canonical,
                "normalized_name": canonical,
                "category": category,
                "proficiency": proficiency,
                "evidence": evidence,
                "confidence": confidence,
                "is_inferred": is_inferred,
                "user_confirmed": False
            }

        return [CandidateSkill(**data) for data in discovered_skills.values()]
