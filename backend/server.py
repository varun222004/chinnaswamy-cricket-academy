from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import uuid
import logging
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Literal

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict


# ---------------------------------------------------------------------------
# Config / DB
# ---------------------------------------------------------------------------
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_MINUTES = 60 * 24  # 1 day for admin convenience
REFRESH_TOKEN_DAYS = 7

app = FastAPI(title="Chinnaswamy Academy API")
api = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("academy")


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_token(payload: dict, expires_delta: timedelta) -> str:
    data = payload.copy()
    data["exp"] = datetime.now(timezone.utc) + expires_delta
    return jwt.encode(data, JWT_SECRET, algorithm=JWT_ALGORITHM)


def set_auth_cookies(response: Response, user_id: str, email: str):
    access = create_token(
        {"sub": user_id, "email": email, "type": "access"},
        timedelta(minutes=ACCESS_TOKEN_MINUTES),
    )
    refresh = create_token(
        {"sub": user_id, "type": "refresh"}, timedelta(days=REFRESH_TOKEN_DAYS)
    )
    response.set_cookie("access_token", access, httponly=True, secure=False,
                        samesite="lax", max_age=ACCESS_TOKEN_MINUTES * 60, path="/")
    response.set_cookie("refresh_token", refresh, httponly=True, secure=False,
                        samesite="lax", max_age=REFRESH_TOKEN_DAYS * 86400, path="/")
    return access


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------
class LoginIn(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    name: str
    role: str


SLOT_CONFIG = {
    "morning": {"id": "morning", "label": "6:30 AM – 10:00 AM", "price": 4000},
    "midday":  {"id": "midday",  "label": "10:00 AM – 1:00 PM", "price": 3500},
    "afternoon": {"id": "afternoon", "label": "1:00 PM – 6:00 PM", "price": 3000},
}

GROUNDS = {
    "ground-1": "Chinnaswamy Ground Marsur 1",
    "ground-2": "Chinnaswamy Ground Marsur 2",
}


class BookingIn(BaseModel):
    full_name: str = Field(min_length=2, max_length=80)
    phone: str = Field(min_length=7, max_length=20)
    email: Optional[EmailStr] = None
    team_name: Optional[str] = None
    ground_id: Literal["ground-1", "ground-2"]
    date: str  # YYYY-MM-DD
    slot_id: Literal["morning", "midday", "afternoon"]


class BookingStatusIn(BaseModel):
    status: Literal["pending", "approved", "rejected"]


class AdmissionIn(BaseModel):
    student_name: str
    parent_name: str
    phone: str
    age: int = Field(ge=4, le=60)
    batch: Literal["morning", "evening"]
    joining_date: str


class AttendanceMarkIn(BaseModel):
    batch: Literal["morning", "evening"]
    date: str
    records: List[dict]  # [{student_id, status: "present"|"absent"}]


class BlogIn(BaseModel):
    title: str
    excerpt: str
    content: str
    image_url: Optional[str] = None
    author: str = "Academy Team"


class ContactIn(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str


# ---------------------------------------------------------------------------
# Auth Routes
# ---------------------------------------------------------------------------
@api.post("/auth/login")
async def login(body: LoginIn, response: Response):
    email = body.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    set_auth_cookies(response, user["id"], user["email"])
    return {"id": user["id"], "email": user["email"], "name": user["name"], "role": user["role"]}


@api.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return user


@api.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"ok": True}


# ---------------------------------------------------------------------------
# Public: Slots availability + Booking submit
# ---------------------------------------------------------------------------
@api.get("/grounds")
async def list_grounds():
    return [{"id": gid, "name": name} for gid, name in GROUNDS.items()]


@api.get("/slots")
async def slot_availability(ground_id: str, date: str):
    if ground_id not in GROUNDS:
        raise HTTPException(status_code=400, detail="Invalid ground")
    booked = await db.bookings.find(
        {"ground_id": ground_id, "date": date, "status": {"$in": ["pending", "approved"]}},
        {"_id": 0, "slot_id": 1},
    ).to_list(50)
    taken = {b["slot_id"] for b in booked}
    return [
        {**cfg, "available": cfg["id"] not in taken} for cfg in SLOT_CONFIG.values()
    ]


@api.post("/bookings")
async def create_booking(body: BookingIn):
    # double-booking guard
    existing = await db.bookings.find_one({
        "ground_id": body.ground_id,
        "date": body.date,
        "slot_id": body.slot_id,
        "status": {"$in": ["pending", "approved"]},
    })
    if existing:
        raise HTTPException(status_code=409, detail="This slot is no longer available")

    slot = SLOT_CONFIG[body.slot_id]
    doc = {
        "id": str(uuid.uuid4()),
        "full_name": body.full_name,
        "phone": body.phone,
        "email": body.email,
        "team_name": body.team_name,
        "ground_id": body.ground_id,
        "ground_name": GROUNDS[body.ground_id],
        "date": body.date,
        "slot_id": body.slot_id,
        "slot_label": slot["label"],
        "price": slot["price"],
        "status": "pending",
        "created_at": now_iso(),
    }
    await db.bookings.insert_one(doc)
    doc.pop("_id", None)
    return doc


# ---------------------------------------------------------------------------
# Admin: Bookings
# ---------------------------------------------------------------------------
@api.get("/admin/bookings")
async def admin_bookings(user: dict = Depends(get_current_user)):
    items = await db.bookings.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return items


@api.patch("/admin/bookings/{booking_id}")
async def admin_update_booking(booking_id: str, body: BookingStatusIn, user: dict = Depends(get_current_user)):
    res = await db.bookings.update_one({"id": booking_id}, {"$set": {"status": body.status}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"ok": True}


@api.delete("/admin/bookings/{booking_id}")
async def admin_delete_booking(booking_id: str, user: dict = Depends(get_current_user)):
    res = await db.bookings.delete_one({"id": booking_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"ok": True}


# ---------------------------------------------------------------------------
# Admin: Admissions
# ---------------------------------------------------------------------------
@api.get("/admin/admissions")
async def list_admissions(user: dict = Depends(get_current_user)):
    return await db.admissions.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)


@api.post("/admin/admissions")
async def create_admission(body: AdmissionIn, user: dict = Depends(get_current_user)):
    doc = {"id": str(uuid.uuid4()), **body.model_dump(), "created_at": now_iso()}
    await db.admissions.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api.delete("/admin/admissions/{admission_id}")
async def delete_admission(admission_id: str, user: dict = Depends(get_current_user)):
    res = await db.admissions.delete_one({"id": admission_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Admission not found")
    return {"ok": True}


# ---------------------------------------------------------------------------
# Admin: Attendance
# ---------------------------------------------------------------------------
@api.post("/admin/attendance")
async def mark_attendance(body: AttendanceMarkIn, user: dict = Depends(get_current_user)):
    await db.attendance.delete_many({"batch": body.batch, "date": body.date})
    if body.records:
        docs = [
            {
                "id": str(uuid.uuid4()),
                "batch": body.batch,
                "date": body.date,
                "student_id": r.get("student_id"),
                "status": r.get("status", "absent"),
                "created_at": now_iso(),
            }
            for r in body.records
        ]
        await db.attendance.insert_many(docs)
    return {"ok": True, "count": len(body.records)}


@api.get("/admin/attendance")
async def get_attendance(batch: str, date: str, user: dict = Depends(get_current_user)):
    rows = await db.attendance.find(
        {"batch": batch, "date": date}, {"_id": 0}
    ).to_list(1000)
    return rows


# ---------------------------------------------------------------------------
# Blog (public read, admin write)
# ---------------------------------------------------------------------------
@api.get("/blogs")
async def list_blogs():
    return await db.blogs.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)


@api.get("/blogs/{blog_id}")
async def get_blog(blog_id: str):
    blog = await db.blogs.find_one({"id": blog_id}, {"_id": 0})
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return blog


@api.post("/admin/blogs")
async def create_blog(body: BlogIn, user: dict = Depends(get_current_user)):
    doc = {"id": str(uuid.uuid4()), **body.model_dump(), "created_at": now_iso()}
    await db.blogs.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api.patch("/admin/blogs/{blog_id}")
async def update_blog(blog_id: str, body: BlogIn, user: dict = Depends(get_current_user)):
    res = await db.blogs.update_one({"id": blog_id}, {"$set": body.model_dump()})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Blog not found")
    return {"ok": True}


@api.delete("/admin/blogs/{blog_id}")
async def delete_blog(blog_id: str, user: dict = Depends(get_current_user)):
    res = await db.blogs.delete_one({"id": blog_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog not found")
    return {"ok": True}


# ---------------------------------------------------------------------------
# Contact
# ---------------------------------------------------------------------------
@api.post("/contact")
async def submit_contact(body: ContactIn):
    doc = {"id": str(uuid.uuid4()), **body.model_dump(), "created_at": now_iso()}
    await db.contact_messages.insert_one(doc)
    doc.pop("_id", None)
    return {"ok": True}


# ---------------------------------------------------------------------------
# Stats (admin overview)
# ---------------------------------------------------------------------------
@api.get("/admin/stats")
async def stats(user: dict = Depends(get_current_user)):
    total_bookings = await db.bookings.count_documents({})
    pending = await db.bookings.count_documents({"status": "pending"})
    students = await db.admissions.count_documents({})
    blogs = await db.blogs.count_documents({})
    return {
        "total_bookings": total_bookings,
        "pending_bookings": pending,
        "total_students": students,
        "active_programs": 5,
        "total_blogs": blogs,
    }


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------
@api.get("/")
async def root():
    return {"service": "Chinnaswamy Academy API", "status": "ok"}


# ---------------------------------------------------------------------------
# Startup: seed admin + indexes + sample blogs
# ---------------------------------------------------------------------------
SAMPLE_BLOGS = [
    {
        "title": "Weekend Turf Tournament Highlights",
        "excerpt": "Catch the best moments from last weekend's inter-club T20 tournament played on our premium astro turf.",
        "content": "Last weekend, eight teams battled it out across two of our turf grounds in a fast-paced T20 format. The final was decided on the last ball with a stunning six over long-on. Read on for full highlights and player-of-the-tournament awards.",
        "image_url": "https://images.unsplash.com/photo-1771909712504-900d75c7eccb?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
        "author": "Academy Team",
    },
    {
        "title": "5 Essential Batting Tips for Young Cricketers",
        "excerpt": "From stance to shot selection — five fundamentals every junior cricketer must master before facing the bowling machine.",
        "content": "1. Master your stance. 2. Watch the ball onto the bat. 3. Get your front foot moving early. 4. Play late under your eyes. 5. Build tempo before going aerial. Our head coach walks through each in detail.",
        "image_url": "https://images.unsplash.com/photo-1595210382051-4d2c31fcc2f4?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
        "author": "Coach Ramesh",
    },
    {
        "title": "Why Turf Practice Improves Match Performance",
        "excerpt": "Turf wickets simulate true match conditions far better than mats. Here's why every serious cricketer should train on turf.",
        "content": "Bounce, pace, spin grip — turf wickets replicate match scenarios. Players transitioning from cement to turf see a measurable jump in shot timing within 3-4 weeks. We break down the data from our 2025 academy intake.",
        "image_url": "https://images.unsplash.com/photo-1746053301234-f7f95dc669e0?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
        "author": "Performance Desk",
    },
    {
        "title": "New Coaching Batches Now Open",
        "excerpt": "Morning and evening batches for the 2026 season are now open. Limited slots — secure your spot today.",
        "content": "We're opening 30 new spots across morning (6 - 8 AM) and evening (4:30 - 7 PM) batches. Includes structured drills, video analysis, and bowling machine sessions. Walk in or call us to enroll.",
        "image_url": "https://images.unsplash.com/photo-1587716856188-ef47793f3fb7?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
        "author": "Academy Team",
    },
]


@app.on_event("startup")
async def startup():
    # Indexes
    await db.users.create_index("email", unique=True)
    await db.bookings.create_index([("ground_id", 1), ("date", 1), ("slot_id", 1)])

    # Seed admin
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@academy.com").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if not existing:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Academy Admin",
            "role": "admin",
            "created_at": now_iso(),
        })
        logger.info(f"Seeded admin: {admin_email}")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}},
        )
        logger.info(f"Updated admin password for {admin_email}")

    # Seed sample blogs once
    if await db.blogs.count_documents({}) == 0:
        for b in SAMPLE_BLOGS:
            await db.blogs.insert_one({"id": str(uuid.uuid4()), **b, "created_at": now_iso()})
        logger.info("Seeded sample blog posts")


@app.on_event("shutdown")
async def shutdown():
    client.close()


# Mount routes + CORS
app.include_router(api)
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
