from flask import Flask, request
import json
from datetime import datetime, timezone
import os

app = Flask(__name__)

LOG_FILE = "email_logs.ndjson"

def now():
    return datetime.now(timezone.utc).isoformat()


def normalize_message_id(mid):
    if not mid:
        return None
    return mid.replace("<", "").replace(">", "").strip()


def ensure_log_file():
    """Make sure file exists (important for Render)"""
    if not os.path.exists(LOG_FILE):
        open(LOG_FILE, "w").close()



def update_record(message_id, event_type):
    ensure_log_file()

    message_id = normalize_message_id(message_id)

    updated_lines = []

    try:
        with open(LOG_FILE, "r") as f:
            lines = f.readlines()
    except Exception as e:
        print("ERROR reading log file:", e)
        return

    for line in lines:
        if not line.strip():
            continue

        try:
            record = json.loads(line)
        except Exception as e:
            print("Skipping corrupt line:", e)
            continue

        stored_id = normalize_message_id(
            record.get("status", {}).get("message_id")
        )

   
        if stored_id == message_id:

    
            if event_type in ["delivered"]:
                record["status"]["delivered"] = True
                record["timestamps"]["delivered"] = now()

     
            if event_type in ["opened", "unique_opened", "first_opening"]:
                record["status"]["opened"] = True
                record["timestamps"]["opened"] = now()

        updated_lines.append(json.dumps(record))
    try:
        with open(LOG_FILE, "w") as f:
            f.write("\n".join(updated_lines))
    except Exception as e:
        print("ERROR writing log file:", e)

@app.route("/brevo-webhook", methods=["POST"])
def webhook():
    data = request.get_json()

    print("\nRAW WEBHOOK:", data)

    event = data.get("event")
    message_id = (
        data.get("message-id")
        or data.get("messageId")
        or data.get("message_id")
    )

    print("EVENT:", event)
    print("MESSAGE_ID:", message_id)

    if event and message_id:
        update_record(message_id, event)
    else:
        print("Missing event or message_id")

    return {"status": "ok"}, 200


@app.route("/")
def home():
    return "Webhook running", 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)