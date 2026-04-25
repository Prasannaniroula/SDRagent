from flask import Flask, request, jsonify
import json
import os
from datetime import datetime, timezone

app = Flask(__name__)
LOG_FILE = "email_logs.ndjson"


def now():
    return datetime.now(timezone.utc).isoformat()


def load_records():
    records = {}
    if not os.path.exists(LOG_FILE):
        return records
    with open(LOG_FILE, "r") as f:
        for line in f:
            line = line.strip()
            if line:
                rec = json.loads(line)
                records[rec["id"]] = rec
    return records


def save_records(records):
    with open(LOG_FILE, "w") as f:
        for rec in records.values():
            f.write(json.dumps(rec) + "\n")


def find_record_by_message_id(records, message_id):
    for rec in records.values():
        if rec["status"].get("message_id") == message_id:
            return rec
    return None


# ─── Brevo Webhook Endpoint ───────────────────────────────────────────────────
@app.route("/brevo/webhook", methods=["POST"])
def brevo_webhook():
    events = request.json  # Brevo sends a list of event objects

    if not events:
        return jsonify({"status": "no events"}), 200

    # Brevo can send a single dict or a list
    if isinstance(events, dict):
        events = [events]

    records = load_records()

    for event in events:
        event_type = event.get("event")          # "delivered", "opened", "click", "reply", "bounce", "spam"
        message_id = event.get("message-id") or event.get("MessageId")
        email_addr = event.get("email")
        ts = event.get("date") or now()

        print(f"[Webhook] event={event_type} | message_id={message_id} | email={email_addr}")

        rec = find_record_by_message_id(records, message_id)
        if not rec:
            print(f"  → No matching record found for message_id={message_id}")
            continue

        if event_type == "delivered":
            rec["status"]["delivered"] = True
            rec["timestamps"]["delivered"] = ts

        elif event_type == "opened" or event_type == "unique_opened":
            rec["status"]["opened"] = True
            rec["timestamps"]["opened"] = ts

        elif event_type == "click":
            rec["status"]["clicked"] = True
            rec["timestamps"]["clicked"] = ts

        elif event_type in ("bounce", "hard_bounce", "soft_bounce"):
            rec["status"]["bounced"] = True
            rec["status"]["bounce_type"] = event_type
            rec["timestamps"]["bounced"] = ts

        elif event_type == "spam":
            rec["status"]["spam"] = True
            rec["timestamps"]["spam"] = ts

        elif event_type == "unsubscribe":
            rec["status"]["unsubscribed"] = True
            rec["timestamps"]["unsubscribed"] = ts

        records[rec["id"]] = rec

    save_records(records)
    return jsonify({"status": "ok", "processed": len(events)}), 200


# ─── Metrics Endpoint ─────────────────────────────────────────────────────────
@app.route("/metrics", methods=["GET"])
def metrics():
    records = load_records()
    total = len(records)

    if total == 0:
        return jsonify({"message": "No records found"}), 200

    sent       = sum(1 for r in records.values() if r["status"].get("sent"))
    delivered  = sum(1 for r in records.values() if r["status"].get("delivered"))
    opened     = sum(1 for r in records.values() if r["status"].get("opened"))
    clicked    = sum(1 for r in records.values() if r["status"].get("clicked"))
    replied    = sum(1 for r in records.values() if r["status"].get("replied"))
    bounced    = sum(1 for r in records.values() if r["status"].get("bounced"))
    spam       = sum(1 for r in records.values() if r["status"].get("spam"))

    def rate(n):
        return round((n / sent * 100), 1) if sent > 0 else 0

    return jsonify({
        "total_records": total,
        "sent": sent,
        "delivered": delivered,
        "opened": opened,
        "clicked": clicked,
        "replied": replied,
        "bounced": bounced,
        "spam": spam,
        "rates": {
            "delivery_rate":  f"{rate(delivered)}%",
            "open_rate":      f"{rate(opened)}%",
            "click_rate":     f"{rate(clicked)}%",
            "reply_rate":     f"{rate(replied)}%",
            "bounce_rate":    f"{rate(bounced)}%",
        }
    }), 200


# ─── Per-lead status lookup ────────────────────────────────────────────────────
@app.route("/status/<email>", methods=["GET"])
def status_by_email(email):
    records = load_records()
    matches = [r for r in records.values() if r["email"] == email]
    if not matches:
        return jsonify({"message": "No records found for this email"}), 404
    return jsonify(matches), 200


if __name__ == "__main__":
    app.run(port=5050, debug=True)