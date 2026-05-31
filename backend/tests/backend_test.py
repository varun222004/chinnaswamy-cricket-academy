"""Backend API tests for Chinnaswamy Academy"""
import os
import uuid
from datetime import date, timedelta

import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://chinnaswamy-sports.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@academy.com")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin123")

FUTURE_DATE = (date.today() + timedelta(days=30)).isoformat()
UNIQUE_SUFFIX = uuid.uuid4().hex[:6]


@pytest.fixture(scope="module")
def admin_session():
    s = requests.Session()
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    return s


@pytest.fixture(scope="module")
def anon_session():
    return requests.Session()


# ---------------- Health ----------------
def test_health(anon_session):
    r = anon_session.get(f"{API}/")
    assert r.status_code == 200
    assert r.json().get("status") == "ok"


# ---------------- Auth ----------------
def test_login_sets_cookies_and_me():
    s = requests.Session()
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200
    body = r.json()
    assert body["email"] == ADMIN_EMAIL and body["role"] == "admin"
    # Cookies set
    cookies = {c.name for c in s.cookies}
    assert "access_token" in cookies and "refresh_token" in cookies

    r2 = s.get(f"{API}/auth/me")
    assert r2.status_code == 200
    assert r2.json()["email"] == ADMIN_EMAIL

    r3 = s.post(f"{API}/auth/logout")
    assert r3.status_code == 200
    # After logout, /me should 401
    s2 = requests.Session()
    r4 = s2.get(f"{API}/auth/me")
    assert r4.status_code == 401


def test_login_invalid():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"})
    assert r.status_code == 401


def test_admin_endpoints_require_auth():
    for path in ["/admin/bookings", "/admin/admissions", "/admin/stats"]:
        r = requests.get(f"{API}{path}")
        assert r.status_code == 401, f"{path} should require auth, got {r.status_code}"


# ---------------- Grounds & Slots ----------------
def test_grounds(anon_session):
    r = anon_session.get(f"{API}/grounds")
    assert r.status_code == 200
    grounds = r.json()
    assert len(grounds) == 2
    ids = {g["id"] for g in grounds}
    assert ids == {"ground-1", "ground-2"}


def test_slots_returns_three(anon_session):
    r = anon_session.get(f"{API}/slots", params={"ground_id": "ground-1", "date": FUTURE_DATE})
    assert r.status_code == 200
    slots = r.json()
    assert len(slots) == 3
    ids = {s["id"] for s in slots}
    assert ids == {"morning", "midday", "afternoon"}


def test_slots_invalid_ground(anon_session):
    r = anon_session.get(f"{API}/slots", params={"ground_id": "bad", "date": FUTURE_DATE})
    assert r.status_code == 400


# ---------------- Bookings flow ----------------
@pytest.fixture(scope="module")
def created_booking(anon_session, admin_session):
    # Use unique future date offset to avoid clashes between test runs
    bdate = (date.today() + timedelta(days=45)).isoformat()
    payload = {
        "full_name": f"TEST_{UNIQUE_SUFFIX}",
        "phone": "9876543210",
        "ground_id": "ground-2",
        "date": bdate,
        "slot_id": "morning",
    }
    r = anon_session.post(f"{API}/bookings", json=payload)
    assert r.status_code == 200, r.text
    booking = r.json()
    assert booking["status"] == "pending"
    assert booking["ground_id"] == "ground-2"
    assert "id" in booking
    yield booking, bdate
    # cleanup
    admin_session.delete(f"{API}/admin/bookings/{booking['id']}")


def test_booking_blocks_slot(anon_session, created_booking):
    booking, bdate = created_booking
    r = anon_session.get(f"{API}/slots", params={"ground_id": "ground-2", "date": bdate})
    assert r.status_code == 200
    slots = {s["id"]: s["available"] for s in r.json()}
    assert slots["morning"] == False  # noqa: E712


def test_double_booking_returns_409(anon_session, created_booking):
    booking, bdate = created_booking
    r = anon_session.post(f"{API}/bookings", json={
        "full_name": "TEST_dup",
        "phone": "9876543211",
        "ground_id": "ground-2",
        "date": bdate,
        "slot_id": "morning",
    })
    assert r.status_code == 409


def test_admin_list_and_update_booking(admin_session, created_booking):
    booking, _ = created_booking
    r = admin_session.get(f"{API}/admin/bookings")
    assert r.status_code == 200
    items = r.json()
    assert any(b["id"] == booking["id"] for b in items)

    r2 = admin_session.patch(f"{API}/admin/bookings/{booking['id']}", json={"status": "approved"})
    assert r2.status_code == 200

    r3 = admin_session.get(f"{API}/admin/bookings")
    updated = [b for b in r3.json() if b["id"] == booking["id"]][0]
    assert updated["status"] == "approved"


# ---------------- Admissions ----------------
def test_admissions_crud(admin_session):
    payload = {
        "student_name": f"TEST_Student_{UNIQUE_SUFFIX}",
        "parent_name": "TEST_Parent",
        "phone": "9876500000",
        "age": 12,
        "batch": "morning",
        "joining_date": FUTURE_DATE,
    }
    r = admin_session.post(f"{API}/admin/admissions", json=payload)
    assert r.status_code == 200
    aid = r.json()["id"]

    r2 = admin_session.get(f"{API}/admin/admissions")
    assert r2.status_code == 200
    assert any(a["id"] == aid for a in r2.json())

    r3 = admin_session.delete(f"{API}/admin/admissions/{aid}")
    assert r3.status_code == 200


# ---------------- Attendance ----------------
def test_attendance_mark_and_get(admin_session):
    bdate = FUTURE_DATE
    payload = {
        "batch": "morning",
        "date": bdate,
        "records": [
            {"student_id": "s1", "status": "present"},
            {"student_id": "s2", "status": "absent"},
        ],
    }
    r = admin_session.post(f"{API}/admin/attendance", json=payload)
    assert r.status_code == 200
    assert r.json()["count"] == 2

    r2 = admin_session.get(f"{API}/admin/attendance", params={"batch": "morning", "date": bdate})
    assert r2.status_code == 200
    assert len(r2.json()) == 2


# ---------------- Blogs ----------------
def test_blogs_public_list(anon_session):
    r = anon_session.get(f"{API}/blogs")
    assert r.status_code == 200
    blogs = r.json()
    assert len(blogs) >= 4  # 4 seeded blogs


def test_blog_admin_crud(admin_session, anon_session):
    payload = {
        "title": f"TEST_Blog_{UNIQUE_SUFFIX}",
        "excerpt": "Test excerpt",
        "content": "Test content body",
        "author": "Tester",
    }
    # anon can't create
    r_anon = anon_session.post(f"{API}/admin/blogs", json=payload)
    assert r_anon.status_code == 401

    r = admin_session.post(f"{API}/admin/blogs", json=payload)
    assert r.status_code == 200
    bid = r.json()["id"]

    r2 = admin_session.patch(f"{API}/admin/blogs/{bid}", json={**payload, "title": "TEST_Updated"})
    assert r2.status_code == 200

    r3 = anon_session.get(f"{API}/blogs/{bid}")
    assert r3.status_code == 200
    assert r3.json()["title"] == "TEST_Updated"

    r4 = admin_session.delete(f"{API}/admin/blogs/{bid}")
    assert r4.status_code == 200


# ---------------- Contact ----------------
def test_contact_public(anon_session):
    r = anon_session.post(f"{API}/contact", json={
        "name": "TEST_user",
        "email": "test@example.com",
        "message": "Hello from tests",
    })
    assert r.status_code == 200
    assert r.json()["ok"] == True  # noqa: E712


# ---------------- Stats ----------------
def test_admin_stats(admin_session):
    r = admin_session.get(f"{API}/admin/stats")
    assert r.status_code == 200
    body = r.json()
    for k in ["total_bookings", "pending_bookings", "total_students", "active_programs"]:
        assert k in body
