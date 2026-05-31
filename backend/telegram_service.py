"""
Telegram Bot notification service.

USAGE
-----
Set these two values in /app/backend/.env (leave empty to disable):

    TELEGRAM_BOT_TOKEN="<token from @BotFather>"
    TELEGRAM_CHAT_ID="<numeric chat id from @userinfobot>"

HOW TO GET CREDENTIALS
----------------------
1. TELEGRAM_BOT_TOKEN:
   - Open Telegram, search @BotFather, send /newbot
   - Follow prompts; BotFather returns a token like 1234567890:AA...

2. TELEGRAM_CHAT_ID:
   - Open Telegram, search @userinfobot, send /start
   - It replies with your numeric user id.
   - IMPORTANT: open your new bot and send it any message first ("hi"),
     otherwise the bot cannot DM you.

After setting both, restart backend:
    sudo supervisorctl restart backend

DESIGN
------
- Notifications are fire-and-forget via asyncio.to_thread so the booking
  endpoint never blocks on Telegram's network call.
- If either env var is empty OR the Telegram API errors out, the booking
  still succeeds — we only log the failure.
- No external SDK required: we call the public Bot API HTTPS endpoint
  directly using the already-installed `requests` library.
"""

import os
import asyncio
import logging
import requests

logger = logging.getLogger("telegram")

TELEGRAM_API_BASE = "https://api.telegram.org"
SEND_TIMEOUT_SECONDS = 8


def _build_booking_message(booking: dict) -> str:
    """Format a booking dict (the same shape stored in MongoDB / shown in the
    admin Bookings table) into a Telegram-ready message."""
    return (
        "🏏 New Booking Request\n\n"
        f"Name: {booking.get('full_name', '-')}\n"
        f"Phone: {booking.get('phone', '-')}\n"
        f"Ground: {booking.get('ground_name', '-')}\n"
        f"Date: {booking.get('date', '-')}\n"
        f"Slot: {booking.get('slot_label', '-')}\n"
        f"Status: {str(booking.get('status', 'pending')).capitalize()}"
    )


def _send_sync(token: str, chat_id: str, text: str) -> None:
    """Blocking HTTP POST to Telegram. Runs in a worker thread."""
    url = f"{TELEGRAM_API_BASE}/bot{token}/sendMessage"
    payload = {"chat_id": chat_id, "text": text, "disable_web_page_preview": True}
    resp = requests.post(url, json=payload, timeout=SEND_TIMEOUT_SECONDS)
    if not resp.ok:
        raise RuntimeError(f"Telegram API {resp.status_code}: {resp.text[:200]}")


async def send_booking_notification(booking: dict) -> None:
    """Fire-and-forget admin notification for a newly created booking.

    Never raises — failures are logged so the calling endpoint stays clean.
    """
    token = os.environ.get("TELEGRAM_BOT_TOKEN", "").strip()
    chat_id = os.environ.get("TELEGRAM_CHAT_ID", "").strip()

    if not token or not chat_id:
        logger.info("Telegram not configured (token/chat_id missing) — skipping notification.")
        return

    text = _build_booking_message(booking)
    try:
        await asyncio.to_thread(_send_sync, token, chat_id, text)
        logger.info("Telegram booking notification sent (chat_id=%s).", chat_id)
    except Exception as exc:  # noqa: BLE001 — must never break the booking flow
        logger.warning("Telegram notification failed: %s", exc)
