"""
PathPilot AI - Curated Portfolio Projects Catalog
Realistic, resume-worthy projects designed to build concrete evidence for target roles.
"""

from typing import List, Dict
from app.models.schemas import PortfolioProject

PORTFOLIO_PROJECTS: List[Dict] = [
    {
        "id": "proj_ml_pipeline_api",
        "title": "Production-Grade Predictive ML Pipeline & Serving API",
        "description": "Architect a complete machine learning lifecycle project: raw dataset ingestion, automated feature engineering, multi-model evaluation, and low-latency REST API model serving containerized in Docker.",
        "difficulty": "Intermediate",
        "relevant_skills": ["Machine Learning", "Feature Engineering", "Model Evaluation & Validation", "FastAPI", "Docker"],
        "tech_stack": ["Python", "scikit-learn", "FastAPI", "Docker", "Pandas", "Uvicorn"],
        "deliverables": [
            "Reproducible feature engineering pipeline with scikit-learn ColumnTransformer",
            "Cross-validated model comparison suite with ROC-AUC & F1-score evaluation",
            "FastAPI inference endpoint with strict Pydantic input schema validation",
            "Dockerfile and docker-compose deployment configuration with health checks"
        ],
        "estimated_hours": 30,
        "milestones": [
            "Milestone 1: Data ingestion, missing value imputation, and domain feature engineering",
            "Milestone 2: Model training, hyperparameter tuning, and cross-validation benchmarking",
            "Milestone 3: FastAPI inference service implementation with error handling",
            "Milestone 4: Containerization with Docker and automated testing with Pytest"
        ],
        "skills_addressed": ["Machine Learning", "Feature Engineering", "Model Evaluation & Validation", "FastAPI", "Docker"]
    },
    {
        "id": "proj_nlp_sentiment_service",
        "title": "NLP Semantic Sentiment & Intent Analysis Service",
        "description": "Build an end-to-end NLP system analyzing user reviews or customer feedback using transformer representations, fine-tuning or zero-shot inference, and delivering interactive analytics.",
        "difficulty": "Intermediate",
        "relevant_skills": ["Natural Language Processing", "Machine Learning", "PyTorch", "FastAPI", "REST APIs"],
        "tech_stack": ["Python", "Hugging Face Transformers", "PyTorch", "FastAPI", "Plotly"],
        "deliverables": [
            "Text tokenization, cleaning, and preprocessing pipeline",
            "Transformer model inference module with confidence thresholding",
            "Batch and single-item prediction endpoints via FastAPI",
            "Interactive analysis dashboard visualizing sentiment trends over time"
        ],
        "estimated_hours": 28,
        "milestones": [
            "Milestone 1: Dataset collection, text cleaning, and baseline classifier benchmark",
            "Milestone 2: Hugging Face transformer integration and classification head fine-tuning",
            "Milestone 3: REST API endpoint creation for synchronous and batch inference",
            "Milestone 4: Evaluation report documenting latency, precision-recall, and error analysis"
        ],
        "skills_addressed": ["Natural Language Processing", "Machine Learning", "PyTorch", "FastAPI"]
    },
    {
        "id": "proj_analytics_retention_dashboard",
        "title": "E-Commerce Customer Retention & Cohort Analytics Engine",
        "description": "Construct an end-to-end business intelligence engine computing customer retention cohorts, RFM segmentation, and lifetime value drivers from transactional data.",
        "difficulty": "Beginner",
        "relevant_skills": ["SQL", "Data Cleaning & Preprocessing", "Exploratory Data Analysis", "Data Visualization", "Statistics & Probability"],
        "tech_stack": ["Python", "SQL", "PostgreSQL", "Pandas", "Plotly / Seaborn"],
        "deliverables": [
            "Relational database schema with optimized SQL queries and cohort views",
            "Automated Pandas cohort analysis script calculating month-over-month retention",
            "Statistical hypothesis tests evaluating marketing campaign impact",
            "Interactive dashboard visualizing churn risk and revenue breakdown"
        ],
        "estimated_hours": 24,
        "milestones": [
            "Milestone 1: Relational database schema design and SQL extraction queries",
            "Milestone 2: Cohort retention matrix computation and RFM segmentation in Pandas",
            "Milestone 3: Statistical hypothesis testing and significance analysis",
            "Milestone 4: Executive dashboard build with actionable business recommendations"
        ],
        "skills_addressed": ["SQL", "Data Cleaning & Preprocessing", "Exploratory Data Analysis", "Data Visualization", "Statistics & Probability"]
    },
    {
        "id": "proj_fullstack_dev_hub",
        "title": "Collaborative Developer Workspace & Knowledge Hub",
        "description": "Engineer a full-stack web application featuring user authentication, real-time Markdown documentation, tagging, PostgreSQL persistence, and a modern responsive user interface.",
        "difficulty": "Intermediate",
        "relevant_skills": ["React", "TypeScript", "Tailwind CSS", "FastAPI", "PostgreSQL", "Docker", "Git & GitHub"],
        "tech_stack": ["React 19", "TypeScript", "Tailwind CSS", "FastAPI", "PostgreSQL", "Docker"],
        "deliverables": [
            "Component-driven React single-page frontend with responsive Tailwind design",
            "RESTful API backend in FastAPI with SQLAlchemy ORM and JWT authentication",
            "PostgreSQL database migration scripts and normalized data models",
            "Docker Compose multi-container orchestrator connecting frontend, backend, and DB"
        ],
        "estimated_hours": 36,
        "milestones": [
            "Milestone 1: Database schema and FastAPI CRUD endpoints with Pydantic validation",
            "Milestone 2: React TypeScript component hierarchy and Tailwind UI layout",
            "Milestone 3: State management, API integration, and error boundary handling",
            "Milestone 4: Docker Compose deployment and GitHub Actions CI pipeline"
        ],
        "skills_addressed": ["React", "TypeScript", "Tailwind CSS", "FastAPI", "PostgreSQL", "Docker", "Git & GitHub"]
    }
]

def get_all_projects() -> List[PortfolioProject]:
    return [PortfolioProject(**p) for p in PORTFOLIO_PROJECTS]

def get_projects_for_skills(skills: List[str]) -> List[PortfolioProject]:
    normalized_skills = {s.lower() for s in skills}
    matched = []
    for p in PORTFOLIO_PROJECTS:
        addressed = {s.lower() for s in p["skills_addressed"]}
        if normalized_skills & addressed:
            matched.append(PortfolioProject(**p))
    return matched
