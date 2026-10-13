"""
PathPilot AI - Skill Taxonomy & Normalization Engine
Maintains canonical tech skills, alias dictionaries, category groupings, and prerequisite DAGs.
"""

from typing import Dict, List, Optional, Tuple, Set

CANONICAL_TAXONOMY: Dict[str, Dict] = {
    # AI / ML
    "Machine Learning": {
        "category": "AI & Machine Learning",
        "aliases": ["ml", "machine learning", "scikit-learn", "sklearn", "statistical learning", "supervised learning", "unsupervised learning"],
        "prerequisites": ["Python", "Statistics & Probability"],
        "description": "Core algorithms for pattern recognition, prediction, classification, and regression."
    },
    "Deep Learning": {
        "category": "AI & Machine Learning",
        "aliases": ["dl", "deep learning", "neural networks", "ann", "cnn", "rnn", "transformers"],
        "prerequisites": ["Machine Learning", "Linear Algebra"],
        "description": "Multi-layer artificial neural networks for complex representations and perceptual tasks."
    },
    "PyTorch": {
        "category": "AI & Machine Learning",
        "aliases": ["pytorch", "torch"],
        "prerequisites": ["Python", "Deep Learning"],
        "description": "Leading open-source deep learning framework based on dynamic computation graphs."
    },
    "TensorFlow": {
        "category": "AI & Machine Learning",
        "aliases": ["tensorflow", "tf", "keras"],
        "prerequisites": ["Python", "Deep Learning"],
        "description": "End-to-end open source platform for machine learning and deep neural networks."
    },
    "Natural Language Processing": {
        "category": "AI & Machine Learning",
        "aliases": ["nlp", "natural language processing", "text mining", "llm", "large language models", "huggingface", "transformers"],
        "prerequisites": ["Machine Learning", "Python"],
        "description": "Computational techniques for processing, understanding, and generating human language."
    },
    "Model Evaluation & Validation": {
        "category": "AI & Machine Learning",
        "aliases": ["model evaluation", "cross-validation", "evaluation metrics", "roc-auc", "f1-score", "validation", "hyperparameter tuning", "model validation"],
        "prerequisites": ["Machine Learning", "Statistics & Probability"],
        "description": "Rigorous performance estimation, metric selection, data leakage prevention, and model diagnostics."
    },
    "Feature Engineering": {
        "category": "AI & Machine Learning",
        "aliases": ["feature engineering", "feature extraction", "feature selection", "feature transformations", "encoding"],
        "prerequisites": ["Data Cleaning & Preprocessing", "Machine Learning"],
        "description": "Domain-driven creation and transformation of variables to maximize predictive model accuracy."
    },
    "Model Deployment & MLOps": {
        "category": "MLOps & Engineering",
        "aliases": ["mlops", "model deployment", "model serving", "mlflow", "triton", "onnx", "model inference", "batch inference"],
        "prerequisites": ["Machine Learning", "REST APIs", "Docker"],
        "description": "Operationalizing machine learning models into reliable, monitored production services."
    },
    
    # Data & Analytics
    "Python": {
        "category": "Programming Languages",
        "aliases": ["python", "py", "python3"],
        "prerequisites": [],
        "description": "Versatile high-level programming language essential for data science, AI, and backend systems."
    },
    "SQL": {
        "category": "Databases & Querying",
        "aliases": ["sql", "structured query language", "relational database", "queries"],
        "prerequisites": [],
        "description": "Standard declarative language for querying and managing relational database management systems."
    },
    "Data Cleaning & Preprocessing": {
        "category": "Data Engineering & Analytics",
        "aliases": ["data cleaning", "data preprocessing", "data wrangling", "pandas", "data manipulation", "imputation"],
        "prerequisites": ["Python"],
        "description": "Handling missing data, outliers, standardizing types, and preparing datasets for downstream analysis."
    },
    "Exploratory Data Analysis": {
        "category": "Data Engineering & Analytics",
        "aliases": ["eda", "exploratory data analysis", "data analysis", "data exploration", "descriptive analysis"],
        "prerequisites": ["Python", "Data Cleaning & Preprocessing"],
        "description": "Investigating dataset characteristics, finding anomalies, testing hypotheses, and checking assumptions."
    },
    "Data Visualization": {
        "category": "Data Engineering & Analytics",
        "aliases": ["data visualization", "matplotlib", "seaborn", "plotly", "tableau", "power bi", "dashboarding", "visualizations"],
        "prerequisites": ["Python"],
        "description": "Translating data insights into informative graphical charts, dashboards, and visual narratives."
    },

    # Foundations & Math
    "Statistics & Probability": {
        "category": "Mathematics & Foundations",
        "aliases": ["statistics", "probability", "stats", "inferential statistics", "hypothesis testing", "p-values", "bayes"],
        "prerequisites": [],
        "description": "Mathematical foundation for data inference, experimental design, and probabilistic modeling."
    },
    "Linear Algebra": {
        "category": "Mathematics & Foundations",
        "aliases": ["linear algebra", "matrices", "vectors", "eigenvalues", "matrix multiplication"],
        "prerequisites": [],
        "description": "Vector spaces and matrix operations foundational to neural networks and dimensionality reduction."
    },
    "Algorithms & Data Structures": {
        "category": "Computer Science Foundations",
        "aliases": ["dsa", "algorithms", "data structures", "time complexity", "big o", "problem solving"],
        "prerequisites": [],
        "description": "Fundamental organization of data and efficient algorithmic problem solving techniques."
    },

    # Full-Stack & Backend
    "JavaScript": {
        "category": "Programming Languages",
        "aliases": ["javascript", "js", "ecmascript"],
        "prerequisites": [],
        "description": "Standard programming language of the modern web platform for both browser and server runtimes."
    },
    "TypeScript": {
        "category": "Programming Languages",
        "aliases": ["typescript", "ts"],
        "prerequisites": ["JavaScript"],
        "description": "Typed superset of JavaScript providing static type verification and robust developer ergonomics."
    },
    "React": {
        "category": "Frontend Development",
        "aliases": ["react", "react.js", "reactjs", "react native"],
        "prerequisites": ["JavaScript", "HTML & CSS"],
        "description": "Declarative component-based library for building interactive user interfaces."
    },
    "HTML & CSS": {
        "category": "Frontend Development",
        "aliases": ["html", "css", "html5", "css3", "web styling"],
        "prerequisites": [],
        "description": "Foundational markup and styling languages powering the structural presentation of the web."
    },
    "Tailwind CSS": {
        "category": "Frontend Development",
        "aliases": ["tailwind", "tailwindcss"],
        "prerequisites": ["HTML & CSS"],
        "description": "Utility-first CSS framework for rapid, maintainable component design."
    },
    "Node.js": {
        "category": "Backend Development",
        "aliases": ["node", "nodejs", "node.js"],
        "prerequisites": ["JavaScript"],
        "description": "Asynchronous event-driven JavaScript runtime built on Chrome's V8 engine."
    },
    "FastAPI": {
        "category": "Backend Development",
        "aliases": ["fastapi"],
        "prerequisites": ["Python", "REST APIs"],
        "description": "High-performance Python web framework for building modern APIs with automatic type validation."
    },
    "REST APIs": {
        "category": "Backend Development",
        "aliases": ["rest", "restful", "rest api", "web api", "http apis", "endpoints"],
        "prerequisites": [],
        "description": "Architectural style for network-based hypermedia systems and stateless web service interfaces."
    },
    "PostgreSQL": {
        "category": "Databases & Querying",
        "aliases": ["postgres", "postgresql", "psql"],
        "prerequisites": ["SQL"],
        "description": "Powerful open-source object-relational database system with advanced indexing and JSON capabilities."
    },
    "MongoDB": {
        "category": "Databases & Querying",
        "aliases": ["mongo", "mongodb", "nosql", "document store"],
        "prerequisites": [],
        "description": "Document-oriented NoSQL database system utilizing flexible JSON-like documents."
    },
    "Docker": {
        "category": "DevOps & Cloud",
        "aliases": ["docker", "containerization", "containers", "dockerfile"],
        "prerequisites": ["Linux"],
        "description": "Platform for packaging applications and dependencies into standardized lightweight containers."
    },
    "Git & GitHub": {
        "category": "Software Engineering & Tools",
        "aliases": ["git", "github", "version control", "vcs", "gitlab"],
        "prerequisites": [],
        "description": "Distributed version control system for source code tracking, branching, and team collaboration."
    },
    "Linux": {
        "category": "DevOps & Cloud",
        "aliases": ["linux", "bash", "shell scripting", "unix", "cli", "terminal"],
        "prerequisites": [],
        "description": "Dominant open-source operating system kernel and command-line shell environment for cloud servers."
    },
    "Testing & Quality Assurance": {
        "category": "Software Engineering & Tools",
        "aliases": ["testing", "unit tests", "pytest", "jest", "integration tests", "tdd", "qa"],
        "prerequisites": [],
        "description": "Automated verification methodologies to guarantee software correctness and prevent regressions."
    },
    "System Design": {
        "category": "Software Engineering & Tools",
        "aliases": ["system design", "distributed systems", "software architecture", "scalability", "load balancing", "caching"],
        "prerequisites": ["REST APIs", "Databases & Querying"],
        "description": "Engineering high-scale, resilient, maintainable architectural topologies for complex systems."
    }
}

# Inverted index from alias to canonical name
ALIAS_TO_CANONICAL: Dict[str, str] = {}
for canonical, details in CANONICAL_TAXONOMY.items():
    ALIAS_TO_CANONICAL[canonical.lower()] = canonical
    for alias in details["aliases"]:
        ALIAS_TO_CANONICAL[alias.lower()] = canonical

def normalize_skill_name(raw_name: str) -> Optional[str]:
    """
    Normalizes a skill name by searching canonical taxonomy and alias index.
    Returns Canonical name if found, or None.
    """
    cleaned = raw_name.strip().lower()
    return ALIAS_TO_CANONICAL.get(cleaned)

def get_skill_metadata(canonical_name: str) -> Optional[Dict]:
    """Returns metadata for a canonical skill."""
    return CANONICAL_TAXONOMY.get(canonical_name)

def get_all_canonical_skills() -> List[str]:
    """Returns list of all canonical skill names."""
    return list(CANONICAL_TAXONOMY.keys())

def get_prerequisites_for_skill(canonical_name: str) -> List[str]:
    """Returns list of prerequisite canonical skill names."""
    meta = CANONICAL_TAXONOMY.get(canonical_name)
    if meta:
        return meta.get("prerequisites", [])
    return []

def get_category_for_skill(canonical_name: str) -> str:
    """Returns category for a skill."""
    meta = CANONICAL_TAXONOMY.get(canonical_name)
    return meta.get("category", "General") if meta else "General"
