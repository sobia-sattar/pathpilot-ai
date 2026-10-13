import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_chat_message_english():
    response = client.post(
        "/api/chat/message",
        json={
            "message": "How do I improve my Python skill and become a Junior AI Engineer?",
            "context": {
                "target_role": "Junior AI/ML Engineer",
                "readiness_score": 45,
                "missing_skills": ["PyTorch", "Model Evaluation"],
                "active_milestone": "Python Foundations"
            }
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert "Pip" in data["reply"] or "Python" in data["reply"] or "AI" in data["reply"]
    assert "suggestions" in data
    assert len(data["suggestions"]) > 0

def test_chat_message_urdu():
    response = client.post(
        "/api/chat/message",
        json={
            "message": "میں مشین لرننگ کیسے سیکھوں اور اپنا اسکور کیسے بہتر کروں؟",
            "context": {
                "target_role": "Junior AI/ML Engineer",
                "readiness_score": 50,
                "missing_skills": ["Machine Learning"],
                "active_milestone": "Core ML Algorithms"
            }
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert any('\u0600' <= char <= '\u06FF' for char in data["reply"])

def test_chat_message_roman_urdu():
    response = client.post(
        "/api/chat/message",
        json={
            "message": "Readiness score kaise barhayen aur agla step kya hai?",
            "context": {
                "target_role": "Junior AI/ML Engineer",
                "readiness_score": 42,
                "missing_skills": ["PyTorch"],
                "active_milestone": "Deep Learning with PyTorch"
            }
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    reply_lower = data["reply"].lower()
    assert "score" in reply_lower or "milestone" in reply_lower or "aap" in reply_lower or "pip" in reply_lower
