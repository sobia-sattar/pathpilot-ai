"""
PathPilot AI - FastAPI Application Entry Point
Personalized Career and Skill-Gap Navigator
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.database import init_db
from app.routes.auth import router as auth_router
from app.routes.parse import router as parse_router
from app.routes.analyze import router as analyze_router
from app.routes.recommendations import router as recommendations_router
from app.routes.career_explorer import router as career_router
from app.routes.progress import router as progress_router
from app.routes.demo import router as demo_router
from app.routes.chat import router as chat_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure SQLite database schema and seeds exist
    init_db()
    yield

app = FastAPI(
    title="PathPilot AI API",
    description="Career and Skill-Gap Navigator Backend Engine",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Subsystems
app.include_router(auth_router)
app.include_router(parse_router)
app.include_router(analyze_router)
app.include_router(recommendations_router)
app.include_router(career_router)
app.include_router(progress_router)
app.include_router(demo_router)
app.include_router(chat_router)

@app.get("/")
async def root():
    return {
        "app": "PathPilot AI",
        "tagline": "Your skills. Your direction. Your next breakthrough.",
        "status": "online",
        "documentation": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
