import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import init_db

client = TestClient(app)

def test_auth_login_wrong_password_rejected():
    """Verify that entering an incorrect password returns 401 Unauthorized."""
    init_db()
    response = client.post("/api/auth/login", json={
        "email": "alex.morgan@university.edu",
        "password": "wrong_password_123"
    })
    assert response.status_code == 401
    assert "Incorrect password" in response.json()["detail"]

def test_auth_login_demo_user_success():
    """Verify that demo credentials succeed."""
    init_db()
    response = client.post("/api/auth/login", json={
        "email": "alex.morgan@university.edu",
        "password": "demo123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "token" in data
    assert data["user"]["email"] == "alex.morgan@university.edu"

def test_auth_register_and_login_validation():
    """Verify registering a new user, logging in with correct password, and rejection with wrong password."""
    init_db()
    import uuid
    unique_email = f"student_{uuid.uuid4().hex[:6]}@college.edu"
    
    # 1. Register new user
    reg_res = client.post("/api/auth/register", json={
        "name": "Jordan Smith",
        "email": unique_email,
        "password": "mySecurePassword123",
        "headline": "Junior Dev"
    })
    assert reg_res.status_code == 200
    assert reg_res.json()["user"]["name"] == "Jordan Smith"

    # 2. Login with WRONG password must fail with 401
    bad_login = client.post("/api/auth/login", json={
        "email": unique_email,
        "password": "incorrectPassword999"
    })
    assert bad_login.status_code == 401
    assert "Incorrect password" in bad_login.json()["detail"]

    # 3. Login with CORRECT password must succeed
    good_login = client.post("/api/auth/login", json={
        "email": unique_email,
        "password": "mySecurePassword123"
    })
    assert good_login.status_code == 200
    assert good_login.json()["user"]["email"] == unique_email

    # 4. Attempt duplicate registration must fail with 400
    dup_res = client.post("/api/auth/register", json={
        "name": "Jordan Smith",
        "email": unique_email,
        "password": "mySecurePassword123"
    })
    assert dup_res.status_code == 400
