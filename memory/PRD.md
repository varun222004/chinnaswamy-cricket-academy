# Chinnaswamy Academy Marsur — Product Requirements Document

## Original Problem Statement
Build a modern, premium, fully responsive cricket academy website MVP for "Chinnaswamy Academy Marsur" with sports-themed dark UI. Includes marketing site (hero, about, facilities, grounds, programs, timings, pricing, gallery, blog, contact, footer), a ground booking system with slot pricing, and an admin ERP dashboard (bookings, admissions, attendance, blog management) with JWT auth.

## Architecture
- **Backend**: FastAPI (`/app/backend/server.py`), MongoDB (motor), JWT auth via httpOnly cookies, bcrypt password hashing.
- **Frontend**: React 19 + React Router + Tailwind + shadcn/ui + sonner toasts + lucide-react icons.
- **Theme**: Dark (#0B0B0B) + lime accent (#C7F041), Bebas Neue headings + Poppins body.

## User Personas
1. **Visitor / Cricketer / Team Captain**: Browses marketing site, books a ground slot.
2. **Parent / Student**: Reads programs, enrolls via contact form.
3. **Academy Admin**: Logs in to manage bookings, admissions, attendance, blog posts.

## Core Requirements (static)
- Public marketing pages, mobile-first responsive
- Ground booking with slot pricing (6:30-10am ₹4000, 10am-1pm ₹3500, 1pm-6pm ₹3000)
- Double-booking prevention
- Admin JWT login (seeded admin@academy.com / admin123)
- Admin overview, booking approval, admissions, attendance, blog CRUD

## What's Been Implemented (Feb 2026)
- ✅ FastAPI backend with auth, bookings, admissions, attendance, blog, contact, stats endpoints
- ✅ Admin auto-seeded on startup; 4 sample blog posts seeded on first run
- ✅ React frontend with all 13 marketing sections + booking modal (2-step flow)
- ✅ Admin dashboard with 5 tabs: Overview, Bookings (approve/reject/delete), Admissions (CRUD), Attendance (mark per batch+date), Blog Mgmt (CRUD)
- ✅ Dark theme with Bebas Neue + Poppins via Google Fonts, lime green accents
- ✅ data-testids on all interactive elements
- ✅ Full test pass — 16/16 backend, 100% frontend critical flows (iteration_1.json)

## Prioritized Backlog
### P1 (next session)
- Replace native date input with shadcn Calendar/DatePicker in BookingModal for polished UX
- Add role='admin' verification in admin endpoints (currently only auth-checked)
- Switch to FastAPI lifespan handler (replace deprecated @app.on_event)
- Set CORS_ORIGINS to explicit frontend URL when going to production HTTPS

### P2
- Email notifications for new bookings (SendGrid/Resend)
- Payment integration (Razorpay/Stripe) for booking deposits
- Image upload for blog posts and gallery (object storage)
- Student/parent login for attendance + match schedule
- WhatsApp share for blog posts + booking confirmations

## Next Tasks
- Await user feedback on MVP
- Apply P1 polish items in next iteration
