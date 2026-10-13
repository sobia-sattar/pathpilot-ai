"""
PathPilot AI - Curated Learning Resource Catalog
Contains verified, non-fabricated educational resources from official documentation,
recognized university courses, and established developer platforms.
"""

from typing import List, Dict, Optional
from app.models.schemas import LearningResource

CURATED_RESOURCES: List[Dict] = [
    # Machine Learning & AI
    {
        "id": "res_ml_scikit_learn",
        "title": "Scikit-Learn Official User Guide: Supervised Learning",
        "provider": "Scikit-Learn Foundation",
        "canonical_skill": "Machine Learning",
        "topic": "Supervised Learning, Regression & Classification",
        "difficulty": "Beginner",
        "resource_type": "Documentation",
        "estimated_hours": 12,
        "url": "https://scikit-learn.org/stable/user_guide.html",
        "prerequisites": ["Python"],
        "is_free": True,
        "is_verified": True
    },
    {
        "id": "res_ml_kaggle_intro",
        "title": "Intro to Machine Learning: Hands-on Modeling",
        "provider": "Kaggle Learn",
        "canonical_skill": "Machine Learning",
        "topic": "Decision Trees, Random Forests, Overfitting & Validation",
        "difficulty": "Beginner",
        "resource_type": "Tutorial",
        "estimated_hours": 8,
        "url": "https://www.kaggle.com/learn/intro-to-machine-learning",
        "prerequisites": ["Python"],
        "is_free": True,
        "is_verified": True
    },
    {
        "id": "res_model_eval_metrics",
        "title": "Model Evaluation, Scoring Metrics & Cross-Validation Guide",
        "provider": "Scikit-Learn Foundation",
        "canonical_skill": "Model Evaluation & Validation",
        "topic": "ROC-AUC, Precision-Recall, K-Fold Validation & Data Leakage",
        "difficulty": "Intermediate",
        "resource_type": "Documentation",
        "estimated_hours": 10,
        "url": "https://scikit-learn.org/stable/modules/model_evaluation.html",
        "prerequisites": ["Machine Learning"],
        "is_free": True,
        "is_verified": True
    },
    {
        "id": "res_feature_eng_kaggle",
        "title": "Feature Engineering for Tabular Data",
        "provider": "Kaggle Learn",
        "canonical_skill": "Feature Engineering",
        "topic": "Mutual Information, Target Encoding, PCA, Feature Interactions",
        "difficulty": "Intermediate",
        "resource_type": "Tutorial",
        "estimated_hours": 9,
        "url": "https://www.kaggle.com/learn/feature-engineering",
        "prerequisites": ["Data Cleaning & Preprocessing", "Machine Learning"],
        "is_free": True,
        "is_verified": True
    },
    {
        "id": "res_pytorch_official_blitz",
        "title": "Deep Learning with PyTorch: A 60 Minute Blitz",
        "provider": "PyTorch / Linux Foundation",
        "canonical_skill": "PyTorch",
        "topic": "Tensors, Autograd, Neural Networks & Training Classifiers",
        "difficulty": "Beginner",
        "resource_type": "Tutorial",
        "estimated_hours": 10,
        "url": "https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html",
        "prerequisites": ["Python", "Deep Learning"],
        "is_free": True,
        "is_verified": True
    },
    {
        "id": "res_fastapi_tutorial",
        "title": "FastAPI Official Tutorial: Building High-Performance APIs",
        "provider": "Tiangolo / FastAPI",
        "canonical_skill": "FastAPI",
        "topic": "Path Parameters, Pydantic Schemas, Dependency Injection",
        "difficulty": "Beginner",
        "resource_type": "Documentation",
        "estimated_hours": 14,
        "url": "https://fastapi.tiangolo.com/tutorial/",
        "prerequisites": ["Python"],
        "is_free": True,
        "is_verified": True
    },
    {
        "id": "res_docker_get_started",
        "title": "Docker Official Documentation: Orientation & Containerization",
        "provider": "Docker Inc.",
        "canonical_skill": "Docker",
        "topic": "Images, Containers, Multi-Stage Dockerfiles & Compose",
        "difficulty": "Beginner",
        "resource_type": "Documentation",
        "estimated_hours": 10,
        "url": "https://docs.docker.com/get-started/",
        "prerequisites": ["Linux"],
        "is_free": True,
        "is_verified": True
    },
    {
        "id": "res_mlops_mlflow_quickstart",
        "title": "MLflow Tracking & Packaging Quickstart",
        "provider": "MLflow / Linux Foundation",
        "canonical_skill": "Model Deployment & MLOps",
        "topic": "Experiment Tracking, Artifact Storage, Model Registry",
        "difficulty": "Intermediate",
        "resource_type": "Tutorial",
        "estimated_hours": 12,
        "url": "https://mlflow.org/docs/latest/index.html",
        "prerequisites": ["Machine Learning", "Docker"],
        "is_free": True,
        "is_verified": True
    },
    {
        "id": "res_nlp_huggingface",
        "title": "Hugging Face NLP Course: Transformer Architectures",
        "provider": "Hugging Face",
        "canonical_skill": "Natural Language Processing",
        "topic": "Tokenizers, Fine-Tuning, Pipelines & Datasets",
        "difficulty": "Intermediate",
        "resource_type": "Course",
        "estimated_hours": 20,
        "url": "https://huggingface.co/learn/nlp-course/chapter1/1",
        "prerequisites": ["Python", "PyTorch"],
        "is_free": True,
        "is_verified": True
    },

    # Data Analytics & Foundations
    {
        "id": "res_pandas_intro",
        "title": "Pandas Official 10-Minute Walkthrough & Indexing Guide",
        "provider": "Pandas Development Team",
        "canonical_skill": "Data Cleaning & Preprocessing",
        "topic": "DataFrames, Filtering, GroupBy, Merging & Handling Missing Data",
        "difficulty": "Beginner",
        "resource_type": "Documentation",
        "estimated_hours": 8,
        "url": "https://pandas.pydata.org/docs/user_guide/10min.html",
        "prerequisites": ["Python"],
        "is_free": True,
        "is_verified": True
    },
    {
        "id": "res_sql_postgres_tutorial",
        "title": "PostgreSQL Official Tutorial: Relational Modeling & Queries",
        "provider": "PostgreSQL Global Development Group",
        "canonical_skill": "SQL",
        "topic": "Joins, Aggregations, Subqueries, Window Functions & Indexes",
        "difficulty": "Beginner",
        "resource_type": "Tutorial",
        "estimated_hours": 12,
        "url": "https://www.postgresql.org/docs/current/tutorial.html",
        "prerequisites": [],
        "is_free": True,
        "is_verified": True
    },
    {
        "id": "res_statistics_khan",
        "title": "Statistics & Probability: Inferential Statistics & Distributions",
        "provider": "Khan Academy",
        "canonical_skill": "Statistics & Probability",
        "topic": "Confidence Intervals, Hypothesis Testing, p-values & Normal Distribution",
        "difficulty": "Beginner",
        "resource_type": "Course",
        "estimated_hours": 16,
        "url": "https://www.khanacademy.org/math/statistics-probability",
        "prerequisites": [],
        "is_free": True,
        "is_verified": True
    },
    {
        "id": "res_data_viz_plotly",
        "title": "Plotly Python Interactive Visualization Guide",
        "provider": "Plotly",
        "canonical_skill": "Data Visualization",
        "topic": "Interactive Charts, Scatter Plots, Heatmaps & Dashboarding",
        "difficulty": "Beginner",
        "resource_type": "Documentation",
        "estimated_hours": 6,
        "url": "https://plotly.com/python/",
        "prerequisites": ["Python"],
        "is_free": True,
        "is_verified": True
    },

    # Web & Full-Stack
    {
        "id": "res_react_official",
        "title": "React.dev: Quick Start & Describing the UI",
        "provider": "Meta / React Core Team",
        "canonical_skill": "React",
        "topic": "Components, Props, State, Hooks & Effect Lifecycles",
        "difficulty": "Beginner",
        "resource_type": "Documentation",
        "estimated_hours": 15,
        "url": "https://react.dev/learn",
        "prerequisites": ["JavaScript", "HTML & CSS"],
        "is_free": True,
        "is_verified": True
    },
    {
        "id": "res_typescript_handbook",
        "title": "TypeScript Official Handbook: Foundations & Generics",
        "provider": "Microsoft TypeScript Team",
        "canonical_skill": "TypeScript",
        "topic": "Types, Interfaces, Generics, Union Types & Narrowing",
        "difficulty": "Intermediate",
        "resource_type": "Documentation",
        "estimated_hours": 12,
        "url": "https://www.typescriptlang.org/docs/handbook/intro.html",
        "prerequisites": ["JavaScript"],
        "is_free": True,
        "is_verified": True
    },
    {
        "id": "res_git_pro_git",
        "title": "Pro Git Book: Version Control Architecture",
        "provider": "Scott Chacon & Ben Straub",
        "canonical_skill": "Git & GitHub",
        "topic": "Branching, Merging, Rebasing, Conflict Resolution & Remotes",
        "difficulty": "Beginner",
        "resource_type": "Documentation",
        "estimated_hours": 6,
        "url": "https://git-scm.com/book/en/v2",
        "prerequisites": [],
        "is_free": True,
        "is_verified": True
    },
    {
        "id": "res_testing_pytest",
        "title": "Pytest Official Documentation: Fixtures & Parametrization",
        "provider": "pytest-dev",
        "canonical_skill": "Testing & Quality Assurance",
        "topic": "Unit Testing, Assertions, Fixtures, Mocking & Test Coverage",
        "difficulty": "Beginner",
        "resource_type": "Documentation",
        "estimated_hours": 8,
        "url": "https://docs.pytest.org/en/latest/",
        "prerequisites": ["Python"],
        "is_free": True,
        "is_verified": True
    }
]

def get_resources_for_skill(canonical_skill: str) -> List[LearningResource]:
    """Returns all curated resources associated with a canonical skill."""
    matches = []
    for item in CURATED_RESOURCES:
        if item["canonical_skill"].lower() == canonical_skill.lower():
            matches.append(LearningResource(**item))
    return matches

def get_all_resources() -> List[LearningResource]:
    """Returns all curated resources."""
    return [LearningResource(**item) for item in CURATED_RESOURCES]
