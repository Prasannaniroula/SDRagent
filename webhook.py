from flask import Flask, request

app = Flask(__name__)

@app.route("/brevo-webhook", methods=["POST"])
def webhook():
    data = request.get_json()
    print("EVENT RECEIVED:", data)
    return {"status": "ok"}, 200

@app.route("/")
def home():
    return "Webhook running", 200

if __name__ == "__main__":
    app.run()