"""
PathPilot AI - Multi-User Isolated Persistent Data Layer (SQLite)
Manages per-user storage of candidate profiles, target jobs, roadmaps,
milestone progress, and audit history. Prevents cross-user data leakage.
"""

import sqlite3
import json
import os
from typing import Optional, Dict, Any, List
from app.models.schemas import (
    CandidateProfile,
    TargetJob,
    SkillGapAnalysisResponse,
    CareerRoadmap
)
from app.security import hash_password

DB_PATH = os.path.join(os.path.dirname(__file__), "pathpilot.db")
DEMO_PROFILE_PATH = os.path.join(os.path.dirname(__file__), "data", "demo_profile.json")
PREDEFINED_JOBS_PATH = os.path.join(os.path.dirname(__file__), "data", "predefined_jobs.json")

DEMO_USER_ID = "alex.morgan@university.edu"

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS auth_users (
        email TEXT PRIMARY KEY,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS candidate_profiles (
        id TEXT PRIMARY KEY,
        email TEXT,
        profile_json TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS target_jobs (
        id TEXT PRIMARY KEY,
        job_json TEXT NOT NULL,
        is_active INTEGER DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_active_jobs (
        user_id TEXT PRIMARY KEY,
        job_id TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS roadmaps (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        roadmap_json TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS progress_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL DEFAULT 'demo_candidate',
        event_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        details_json TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Safe migrations if existing database tables lack newer columns
    try:
        cursor.execute("ALTER TABLE candidate_profiles ADD COLUMN email TEXT")
    except sqlite3.OperationalError:
        pass

    try:
        cursor.execute("ALTER TABLE progress_events ADD COLUMN user_id TEXT NOT NULL DEFAULT 'demo_candidate'")
    except sqlite3.OperationalError:
        pass

    try:
        cursor.execute("ALTER TABLE roadmaps ADD COLUMN user_id TEXT")
    except sqlite3.OperationalError:
        pass

    conn.commit()

    # Seed predefined jobs
    cursor.execute("SELECT COUNT(*) as cnt FROM target_jobs")
    if cursor.fetchone()["cnt"] == 0:
        _seed_predefined_jobs(conn)

    # Seed demo profile for Alex Morgan
    cursor.execute("SELECT COUNT(*) as cnt FROM candidate_profiles WHERE id = ? OR email = ?", (DEMO_USER_ID, DEMO_USER_ID))
    if cursor.fetchone()["cnt"] == 0:
        reset_to_demo_state(conn)

    # Ensure demo user credentials exist
    cursor.execute("SELECT COUNT(*) as cnt FROM auth_users WHERE email = ?", (DEMO_USER_ID,))
    if cursor.fetchone()["cnt"] == 0:
        cursor.execute(
            "INSERT OR REPLACE INTO auth_users (email, password_hash, name) VALUES (?, ?, ?)",
            (DEMO_USER_ID, hash_password("demo123"), "Alex Morgan")
        )
        conn.commit()

    conn.close()

def _seed_predefined_jobs(conn):
    if os.path.exists(PREDEFINED_JOBS_PATH):
        with open(PREDEFINED_JOBS_PATH, "r", encoding="utf-8") as f:
            jobs = json.load(f)
            cursor = conn.cursor()
            for idx, job in enumerate(jobs):
                is_active = 1 if idx == 0 else 0
                cursor.execute(
                    "INSERT OR REPLACE INTO target_jobs (id, job_json, is_active) VALUES (?, ?, ?)",
                    (job["id"], json.dumps(job), is_active)
                )
            conn.commit()

def reset_to_demo_state(conn=None):
    should_close = False
    if conn is None:
        conn = get_connection()
        should_close = True

    cursor = conn.cursor()

    # Load demo profile for Alex Morgan
    if os.path.exists(DEMO_PROFILE_PATH):
        with open(DEMO_PROFILE_PATH, "r", encoding="utf-8") as f:
            demo_data = json.load(f)
            cursor.execute(
                "INSERT OR REPLACE INTO candidate_profiles (id, email, profile_json) VALUES (?, ?, ?)",
                (DEMO_USER_ID, DEMO_USER_ID, json.dumps(demo_data))
            )
            cursor.execute(
                "INSERT OR REPLACE INTO candidate_profiles (id, email, profile_json) VALUES (?, ?, ?)",
                ("active_candidate", DEMO_USER_ID, json.dumps(demo_data))
            )

    # Ensure demo user credentials exist in auth_users
    cursor.execute(
        "INSERT OR REPLACE INTO auth_users (email, password_hash, name) VALUES (?, ?, ?)",
        (DEMO_USER_ID, hash_password("demo123"), "Alex Morgan")
    )

    # Set Junior AI/ML Engineer as active target job for demo
    cursor.execute(
        "INSERT OR REPLACE INTO user_active_jobs (user_id, job_id) VALUES (?, ?)",
        (DEMO_USER_ID, "job_aiml_junior")
    )
    cursor.execute(
        "INSERT OR REPLACE INTO user_active_jobs (user_id, job_id) VALUES (?, ?)",
        ("active_candidate", "job_aiml_junior")
    )

    # Clear roadmaps and progress events for demo candidate
    cursor.execute("DELETE FROM roadmaps WHERE id = ? OR user_id = ?", (DEMO_USER_ID, DEMO_USER_ID))
    cursor.execute("DELETE FROM roadmaps WHERE id = 'active_roadmap'")
    cursor.execute("DELETE FROM progress_events WHERE user_id = ? OR user_id = 'active_candidate'", (DEMO_USER_ID,))

    # Record reset event
    cursor.execute(
        "INSERT INTO progress_events (user_id, event_type, entity_id, details_json) VALUES (?, ?, ?, ?)",
        (DEMO_USER_ID, "RESET_DEMO", DEMO_USER_ID, json.dumps({"note": "Restored initial Alex Morgan benchmark state."}))
    )

    conn.commit()
    if should_close:
        conn.close()

def save_auth_user(email: str, password_hash: str, name: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT OR REPLACE INTO auth_users (email, password_hash, name, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)",
        (email.strip().lower(), password_hash, name.strip())
    )
    conn.commit()
    conn.close()

def get_auth_user(email: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT email, password_hash, name, created_at FROM auth_users WHERE email = ?", (email.strip().lower(),))
    row = cursor.fetchone()
    conn.close()
    if row:
        return dict(row)
    return None

def _normalize_user_id(user_id: Optional[str]) -> str:
    if not user_id or user_id in ("demo_candidate", "active_candidate", "guest"):
        return DEMO_USER_ID
    return user_id.strip().lower()

def get_candidate_profile(user_id: Optional[str] = None) -> CandidateProfile:
    uid = _normalize_user_id(user_id)
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT profile_json FROM candidate_profiles WHERE id = ? OR email = ?", (uid, uid))
    row = cursor.fetchone()
    
    if not row and uid == DEMO_USER_ID:
        # Fallback to demo profile
        cursor.execute("SELECT profile_json FROM candidate_profiles WHERE id = 'active_candidate'")
        row = cursor.fetchone()

    conn.close()
    if row:
        return CandidateProfile(**json.loads(row["profile_json"]))

    # For a new distinct user, return an isolated, blank candidate profile ready for their resume!
    user_name = uid.split("@")[0].replace(".", " ").title() if "@" in uid else uid.title()
    new_profile = CandidateProfile(
        id=uid,
        name=user_name,
        email=uid,
        headline="Student Candidate / Career Explorer",
        skills=[],
        education=[],
        projects=[],
        experience=[],
        raw_text=""
    )
    save_candidate_profile(new_profile, user_id=uid)
    return new_profile

def save_candidate_profile(profile: CandidateProfile, user_id: Optional[str] = None):
    uid = _normalize_user_id(user_id or profile.email or profile.id)
    profile.id = uid
    if not profile.email and "@" in uid:
        profile.email = uid

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT OR REPLACE INTO candidate_profiles (id, email, profile_json, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)",
        (uid, profile.email or uid, json.dumps(profile.model_dump()))
    )
    conn.commit()
    conn.close()

def get_all_target_jobs() -> List[TargetJob]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT job_json FROM target_jobs ORDER BY id ASC")
    rows = cursor.fetchall()
    conn.close()
    return [TargetJob(**json.loads(r["job_json"])) for r in rows]

def get_active_target_job(user_id: Optional[str] = None) -> Optional[TargetJob]:
    uid = _normalize_user_id(user_id)
    conn = get_connection()
    cursor = conn.cursor()
    
    # Check user-specific active job
    cursor.execute("SELECT job_id FROM user_active_jobs WHERE user_id = ?", (uid,))
    row = cursor.fetchone()
    job_id = row["job_id"] if row else "job_aiml_junior"

    cursor.execute("SELECT job_json FROM target_jobs WHERE id = ?", (job_id,))
    job_row = cursor.fetchone()
    if not job_row:
        # Fallback to first available
        cursor.execute("SELECT job_json FROM target_jobs LIMIT 1")
        job_row = cursor.fetchone()

    conn.close()
    if job_row:
        return TargetJob(**json.loads(job_row["job_json"]))
    return None

def set_active_target_job(job_id: str, user_id: Optional[str] = None):
    uid = _normalize_user_id(user_id)
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT OR REPLACE INTO user_active_jobs (user_id, job_id, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)",
        (uid, job_id)
    )
    conn.commit()
    conn.close()

def save_custom_target_job(job: TargetJob, user_id: Optional[str] = None):
    uid = _normalize_user_id(user_id)
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT OR REPLACE INTO target_jobs (id, job_json, is_active, updated_at) VALUES (?, ?, 0, CURRENT_TIMESTAMP)",
        (job.id, json.dumps(job.model_dump()))
    )
    cursor.execute(
        "INSERT OR REPLACE INTO user_active_jobs (user_id, job_id, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)",
        (uid, job.id)
    )
    conn.commit()
    conn.close()

def get_saved_roadmap(user_id: Optional[str] = None) -> Optional[CareerRoadmap]:
    uid = _normalize_user_id(user_id)
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT roadmap_json FROM roadmaps WHERE id = ? OR user_id = ?", (uid, uid))
    row = cursor.fetchone()
    conn.close()
    if row:
        return CareerRoadmap(**json.loads(row["roadmap_json"]))
    return None

def save_roadmap(roadmap: CareerRoadmap, user_id: Optional[str] = None):
    uid = _normalize_user_id(user_id)
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT OR REPLACE INTO roadmaps (id, user_id, roadmap_json, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)",
        (uid, uid, json.dumps(roadmap.model_dump()))
    )
    conn.commit()
    conn.close()

def log_progress_event(event_type: str, entity_id: str, details: Dict[str, Any], user_id: Optional[str] = None):
    uid = _normalize_user_id(user_id)
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO progress_events (user_id, event_type, entity_id, details_json) VALUES (?, ?, ?, ?)",
        (uid, event_type, entity_id, json.dumps(details))
    )
    conn.commit()
    conn.close()

def get_progress_history(user_id: Optional[str] = None) -> List[Dict[str, Any]]:
    uid = _normalize_user_id(user_id)
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM progress_events WHERE user_id = ? ORDER BY id DESC LIMIT 50", (uid,))
    rows = cursor.fetchall()
    conn.close()
    return [
        {
            "id": r["id"],
            "event_type": r["event_type"],
            "entity_id": r["entity_id"],
            "details": json.loads(r["details_json"]),
            "created_at": r["created_at"]
        }
        for r in rows
    ]
