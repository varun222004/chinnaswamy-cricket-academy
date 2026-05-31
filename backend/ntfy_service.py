"""
ntfy.sh push notification service.

CONFIG: The ntfy topic name is stored in MongoDB via the admin Settings tab
(collection: settings, doc id: "notifications", field: "ntfy_topic").
This lets the academy admin change/rotate the topic anytime without redeploying.

HOW IT WORKS:
- ntfy.sh is a free public push service. We POST plain text to
  https://ntfy.sh/<topic-name> and anyone subscribed to that topic via the
  ntfy mobile app receives an instant push notification.
- Pick a long, unguessable topic name (acts as a shared secret).
- No API key, no account, no signup required.

Fire-and-forget: never raises. If the topic is empty or ntfy errors out,
the booking still succeeds — we only log.
"""

import asyncio
import logging
import requests

logger = logging.getLogger("ntfy")

NTFY_BASE = "https://ntfy.sh"
SEND_TIMEOUT_SECONDS = 8


def _build_message(booking: dict) -> str:
    return (
        f"Name: {booking.get('full_name', '-')}\n"
        f"Phone: {booking.get('phone', '-')}\n"
        f"Ground: {booking.get('ground_name', '-')}\n"
        f"Date: {booking.get('date', '-')}\n"
        f"Slot: {booking.get('slot_label', '-')}\n"
        f"Status: {str(booking.get('status', 'pending')).capitalize()}"
    )


def _send_sync(topic: str, body: str, title: str):
    resp = requests.post(
        f"{NTFY_BASE}/{topic}",
        data=body.encode("utf-8"),
        headers={
            "Title": title,
            "Priority": "high",
            "Tags": "cricket,bookmark",
        },
        timeout=SEND_TIMEOUT_SECONDS,
    )
    if not resp.ok:
        raise RuntimeError(f"ntfy {resp.status_code}: {resp.text[:200]}")


async def send_booking_push(booking: dict, topic) -> None:
    """Fire-and-forget push notification. Never raises."""
    if not topic or not str(topic).strip():
        logger.info("ntfy topic empty — skipping push notification.")
        return
    topic = str(topic).strip().lstrip("/")
    title = f"New Booking · {booking.get('ground_name', 'Ground')}"
    body = _build_message(booking)
    try:
        await asyncio.to_thread(_send_sync, topic, body, title)
        logger.info("ntfy push sent (topic=%s)", topic)
    except Exception as exc:
        logger.warning("ntfy push failed: %s", exc)