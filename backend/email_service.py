"""
Resend email notification service.

CONFIG (backend/.env):
    RESEND_API_KEY="re_..."           # Required. From resend.com -> API Keys.
    SENDER_EMAIL="onboarding@resend.dev"  # Optional. Default Resend sandbox sender.

The RECIPIENT (admin notification email) is stored in MongoDB via the
admin Settings tab (collection: settings, doc id: "notifications").
This lets the academy admin change it anytime without redeploying.

Fire-and-forget: never raises. If Resend fails or settings are empty,
the booking still succeeds — we only log.
"""

import os
import asyncio
import logging
import resend

logger = logging.getLogger("email")


def _build_html(booking: dict) -> str:
    return f"""
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto; background:#0B0B0B; color:#fff; padding:32px; border-radius:6px;">
      <div style="border-left:4px solid #C7F041; padding-left:14px; margin-bottom:24px;">
        <h2 style="margin:0; font-size:22px; color:#C7F041;">🏏 New Booking Request</h2>
        <p style="margin:6px 0 0; color:#D1D1D1; font-size:13px;">Chinnaswamy Academy Marsur</p>
      </div>
      <table style="width:100%; font-size:14px; color:#fff;">
        <tr><td style="padding:6px 0; color:#909090;">Name</td><td><b>{booking.get('full_name', '-')}</b></td></tr>
        <tr><td style="padding:6px 0; color:#909090;">Phone</td><td>{booking.get('phone', '-')}</td></tr>
        <tr><td style="padding:6px 0; color:#909090;">Team</td><td>{booking.get('team_name') or '-'}</td></tr>
        <tr><td style="padding:6px 0; color:#909090;">Ground</td><td>{booking.get('ground_name', '-')}</td></tr>
        <tr><td style="padding:6px 0; color:#909090;">Date</td><td>{booking.get('date', '-')}</td></tr>
        <tr><td style="padding:6px 0; color:#909090;">Slot</td><td>{booking.get('slot_label', '-')}</td></tr>
        <tr><td style="padding:6px 0; color:#909090;">Price</td><td>₹{booking.get('price', '-')}</td></tr>
        <tr><td style="padding:6px 0; color:#909090;">Status</td><td style="color:#C7F041;"><b>{str(booking.get('status', 'pending')).capitalize()}</b></td></tr>
      </table>
      <p style="margin-top:24px; font-size:12px; color:#777;">Open the admin dashboard to approve or reject this booking.</p>
    </div>
    """


def _send_sync(api_key: str, sender: str, to_list: list, subject: str, html: str):
    resend.api_key = api_key
    return resend.Emails.send({
        "from": sender,
        "to": to_list,
        "subject": subject,
        "html": html,
    })


async def send_booking_email(booking: dict, recipient) -> None:
    """Fire-and-forget admin email notification. Never raises."""
    api_key = os.environ.get("RESEND_API_KEY", "").strip()
    sender = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev").strip() or "onboarding@resend.dev"

    if not api_key:
        logger.info("Resend API key not configured — skipping email.")
        return
    if not recipient:
        logger.info("Notification recipient empty — skipping email.")
        return

    to_list = [r.strip() for r in recipient.split(",") if r.strip()]
    subject = f"New Booking — {booking.get('ground_name', 'Ground')} · {booking.get('date', '')}"
    html = _build_html(booking)

    try:
        result = await asyncio.to_thread(_send_sync, api_key, sender, to_list, subject, html)
        logger.info("Booking email sent (id=%s) to %s", (result or {}).get("id"), to_list)
    except Exception as exc:
        logger.warning("Email notification failed: %s", exc)