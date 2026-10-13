# PathPilot AI
> **Your skills. Your direction. Your next breakthrough.**
> *OpenHack26 | ED-03: Career and Skill-Gap Navigator*

PathPilot AI is an explainable career intelligence platform designed to bridge the gap between a student's current skills and their dream job. Rather than offering generic advice or ungrounded employment guarantees, PathPilot AI performs granular feature extraction from resumes and job descriptions, calculates explainable skill deficits using a weighted taxonomy model, and dynamically generates sequenced, milestone-driven learning roadmaps.

---

## 1. System Architecture

PathPilot AI is built upon a **Three-Engine Architecture** with supporting persistence and human review layers:

```
[Candidate Resume (PDF/Text)]   +   [Target Job Description / Predefined Benchmark]
                                     |
                                     v
                       +-------------------------------+
                       |           ENGINE A            |
                       | Parsing & Feature Extraction  |
                       +-------------------------------+
                                     |
                                     v
                       +-------------------------------+
                       |      HUMAN REVIEW LAYER       |
                       |  Review & Correct Estimations |
                       +-------------------------------+
                                     |
                                     v
                       +-------------------------------+
                       |           ENGINE B            |
                       |       Skill Gap Engine        |
                       +-------------------------------+
                                     |
                                     v
                       +-------------------------------+
                       |           ENGINE C            |
                       |  Recommendation & Roadmap Gen |
                       +-------------------------------+
                                     |
                                     v
                       +-------------------------------+
                       |  PERSISTENCE & REASSESSMENT   |
                       |   SQLite Audit & Progression  |
                       +-------------------------------+
```

### Engine A — Parsing & Feature Extraction
- **PDF Extraction**: Dual-engine extraction utilizing PyMuPDF (`fitz`) and `pypdf` with strict 10MB limits, header validation (`%PDF-`), text sanitization, and graceful fallback for scanned/image-only documents.
- **Resume Feature Extraction**: Analyzes skills, programming languages, frameworks, education, projects, and work experience. Isolates contextual evidence sentences from the document to justify starting proficiency estimates.
- **Job Description Parsing**: Differentiates required (`must-have`, weight 3) from preferred (`nice-to-have`, weight 2) qualifications from textual context clues.
- **Review Layer**: Gives users full control to review, edit, confirm, or add skills before calculations proceed.

### Engine B — Skill Gap Engine
- **Taxonomy & Alias Normalization**: Curated technical taxonomy with canonical naming, alias mapping (e.g., `ML` → `Machine Learning`, `postgres` → `PostgreSQL`, `sklearn` → `scikit-learn`), category groupings, and prerequisite DAGs.
- **Multi-Method Matching**:
  1. *Exact & Canonical Alias Matching*
  2. *Controlled Lexical Matching* (via `rapidfuzz` token-sort scoring)
  3. *Semantic Matching* (via `scikit-learn` TF-IDF vectorization and cosine similarity over taxonomy descriptions)
- **Proficiency Scale**: Standardized 0–4 scale:
  - `Level 0`: Not demonstrated
  - `Level 1`: Beginner / Coursework
  - `Level 2`: Basic working knowledge / Project usage
  - `Level 3`: Intermediate / Production standard
  - `Level 4`: Advanced / Specialized mastery
- **Readiness Score Formula**:
  $$\text{Readiness} = \text{round}\left(100 \times \left(1 - \frac{\sum (\text{gap} \times \text{priority\_weight})}{\sum (\text{target\_level} \times \text{priority\_weight})}\right)\right)$$
  - *Must-Have Weight:* 3 | *Preferred Weight:* 2 | *Optional Weight:* 1
  - Explicitly presented as an internal curriculum alignment indicator, **never as a hiring guarantee**.
- **Prerequisite Prioritization Boost**: Skills that serve as prerequisites for other missing requirements receive an explainable boost in the prioritized gap ranking.

### Engine C — Recommendation & Dynamic Roadmap Generator
- **Curated Resource Catalog**: Verified documentation, courses, and interactive tutorials from official providers (Scikit-Learn, PyTorch, FastAPI, Kaggle Learn, MDN, Khan Academy, Docker).
- **Portfolio Project Mapping**: Concrete project specifications (e.g., Predictive ML Pipeline with FastAPI & Docker, NLP Sentiment Service, E-Commerce Retention Dashboard) mapped to target skills.
- **Personalized 4-Phase Roadmap**:
  1. *Phase 1: Learning Foundations* (Level 0 missing prerequisite skills)
  2. *Phase 2: Core Skills & Deep Dives* (Elevating must-have skills to Level 3)
  3. *Phase 3: Practical Portfolio Projects* (Building resume-worthy deliverables)
  4. *Phase 4: Career Preparation* (Testing, code review, documentation, defense)
- **Schedule Adaptation**: Recalculates estimated timeline in weeks based on candidate's weekly study commitment (4 to 30 hrs/week).

---

## 2. Technology Stack

### Backend
- **Framework**: Python 3.14+, FastAPI, Uvicorn
- **Validation**: Pydantic v2
- **PDF Extraction**: `pypdf`, `pymupdf`
- **Data & ML**: `scikit-learn` (TF-IDF & Cosine Similarity), `rapidfuzz` (Lexical matching), `numpy`
- **Persistence**: SQLite (Local embedded storage with audit logging)
- **Testing**: `pytest`

### Frontend
- **Framework**: React 19, TypeScript
- **Tooling**: Vite, `@tailwindcss/vite`, Tailwind CSS
- **Icons**: Lucide React
- **Visual Analytics**: Recharts

---

## 3. Installation & Startup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### Backend Startup

```powershell
# Navigate to the backend directory
cd c:\OpenHack\backend

# Install backend dependencies
python -m pip install -r requirements.txt

# Start the FastAPI server on port 8000
python run.py
```
*Backend runs at:* `http://127.0.0.1:8000`  
*Interactive Swagger docs:* `http://127.0.0.1:8000/docs`

### Frontend Startup

```powershell
# In a second terminal, navigate to the frontend directory
cd c:\OpenHack\frontend

# Install dependencies
npm.cmd install

# Start the Vite development server on port 5173
npm.cmd run dev
```
*Frontend runs at:* `http://127.0.0.1:5173`

---

## 4. Automated Testing

Run the automated test suite covering parsing, skill gap calculation, prerequisite boosts, user correction, and recommendation ranking:

```powershell
cd c:\OpenHack
python -m pytest backend/app/tests -v
```

All 7 test suites pass:
- `test_resume_parser_with_aliases_and_evidence` (PASSED)
- `test_resume_parser_no_relevant_evidence` (PASSED)
- `test_job_parser_distinguishes_must_have_and_preferred` (PASSED)
- `test_beginner_candidate_with_several_gaps` (PASSED)
- `test_strong_candidate_with_few_gaps` (PASSED)
- `test_user_corrects_skill_match` (PASSED)
- `test_recommendation_and_roadmap_generation` (PASSED)

---

## 5. Authentication & Streamlined Experience

PathPilot AI features an intuitive **Authentication & Student Session Layer**:
- **Login & Registration**: Students can sign in with their email and password or register with their name, email, and headline.
- **One-Click Demo Access**: For hackathon evaluators, a prominent **"Continue as Alex Morgan (Demo Student)"** button provides instant access without requiring manual typing.
- **Guest Exploration Mode**: Evaluators and guests can explore the platform without creating an account.
- **Streamlined Navigation**: Redundant tabs have been consolidated down to 6 high-impact pillars:
  1. **Dashboard**: Live readiness score gauge, metrics, and domain distribution
  2. **Analyze Resume**: Upload PDF / paste text, choose target benchmark, and review extracted features
  3. **Skill Gaps**: Side-by-side proficiency comparisons with explainable reasoning
  4. **My Roadmap**: 4-phase sequenced timeline with verified resources and persistent checkboxes
  5. **Career Explorer**: Side-by-side career comparison tool and role switcher
  6. **Progress**: Real milestone stats, study hours, reassessment simulator, and audit trail

---

## 6. Hackathon Demonstration Sequence (for Judges)

PathPilot AI includes a built-in **Demo Mode** preloaded with candidate **Alex Morgan** (Junior CS student aiming for **Junior AI/ML Engineer**):

1. **Load Benchmark**: Click **"Reset Demo"** in the top navigation bar to initialize the benchmark state.
2. **Review Extracted Skills**: Navigate to **Analyze Resume**. Observe extracted skills (Python L2, SQL L2, Statistics L2, Machine Learning L1) with evidence quotes extracted from coursework and projects.
3. **Inspect Review Layer**: Edit a skill proficiency or add a custom skill. Note that initial levels are transparent starting estimates requiring confirmation.
4. **Examine Career Dashboard**: Navigate to **Dashboard**. View the overall Readiness Score (34%), formula explanation modal, category breakdown chart, and key metrics.
5. **Inspect Prioritized Gaps**: Open **Skill Gaps**. Click on high-priority gaps (e.g. *Model Evaluation & Validation*, *Feature Engineering*). Inspect why they are prioritized and review the prerequisite dependencies.
6. **Interact with Roadmap**: Navigate to **My Roadmap**. Adjust the weekly study slider to observe timeline updates. Check off Milestone 1: verify that completion persists across page refreshes.
7. **Simulate Skill Growth**: Open **Progress Analytics**. Use the *Reassessment Simulator* to upgrade *Machine Learning* from Level 1 to Level 2. Observe the Readiness Score increase in real-time.
8. **Explore Career Paths**: Go to **Career Explorer**. Compare *Junior AI/ML Engineer* with *Data Analyst* side-by-side to review shared competencies, unique demands, and transition readiness.

---

## 6. Privacy & Security Architecture

- **Untrusted Input Handling**: Uploaded PDF bytes and pasted texts are treated strictly as untrusted raw document strings. Input sanitization strips null bytes and dangerous control characters.
- **In-Memory File Processing**: Uploaded PDF files are parsed in memory and discarded; raw files are not permanently stored on disk.
- **Zero Prompt Injection Surface**: Text parsing and classification use deterministic regex tokens, taxonomy lookups, and TF-IDF vectors rather than unconstrained generative LLM prompt injection surfaces.
- **Local Persistence**: User profile states, roadmap milestones, and progress events are stored locally in SQLite (`backend/app/pathpilot.db`).

---

## 7. Known Limitations & Future Roadmap

- **Scanned PDFs / OCR**: The current implementation supports text-layer PDFs via PyMuPDF/pypdf and falls back gracefully to manual text pasting when a PDF is scanned. Optical Character Recognition (OCR) via Tesseract can be integrated for scanned images.
- **Live Vacancy APIs**: Role benchmarks currently utilize normalized industry standard profiles rather than real-time live scrapers to guarantee reproducibility and prevent broken API dependencies during judging.
- **Embeddings Scaling**: Current semantic similarity uses scikit-learn TF-IDF with cosine distance for zero-latency, local CPU execution without requiring heavy GPU sentence transformers.
