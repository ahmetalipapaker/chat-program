from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)
classifier = pipeline("sentiment-analysis", model="savasy/bert-base-turkish-sentiment-cased")

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    message = data.get("text", "")
    result = classifier(message)[0]
    return jsonify({"label": result["label"], "score": float(result["score"])})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7860)
