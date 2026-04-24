from flask import Flask, request
import json
from datetime import datetime, timezone

app = Flask(__name__)

LOG_FILE = "email_logs.ndjson"


def now():
    return datetime.now(timezone.utc).isoformat()


def normalize_message_id(mid):
    if not mid:
        return None
    return mid.replace("<", "").replace(">", "")


def update_record(message_id, event_type):
    message_id = normalize_message_id(message_id)

    updated = []

    try:
        with open(LOG_FILE, "r") as f:
            for line in f:
                record = json.loads(line)

                stored_id = normalize_message_id(
                    record.get("status", {}).get("message_id")
                )

                if stored_id == message_id:
                    if event_type == "delivered":
                        record["status"]["delivered"] = True
                        record["timestamps"]["delivered"] = now()

                    if event_type == "opened":
                        record["status"]["opened"] = True
                        record["timestamps"]["opened"] = now()

                updated.append(json.dumps(record))

        with open(LOG_FILE, "w") as f:
            f.write("\n".join(updated))

    except Exception as e:
        print("ERROR updating record:", e)


@app.route("/brevo-webhook", methods=["POST"])
def webhook():
    data = request.get_json()

    print("EVENT RECEIVED:", data)

    event = data.get("event")
    message_id = data.get("message-id")

    print("EVENT:", event)
    print("MESSAGE ID:", message_id)

    update_record(message_id, event)

    return {"status": "ok"}, 200


@app.route("/")
def home():
    return "Webhook running", 200


if __name__ == "__main__":
    app.run()