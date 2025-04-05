from flask import Flask, request, jsonify
import joblib
import pandas as pd

# Load the trained model and encoder
model = joblib.load("model.pkl")
encoder = joblib.load("encoder.pkl")

# Initialize Flask app
app = Flask(__name__)

@app.route("/")
def home():
    return "ML Model API is running 🚀"

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    try:
        features = pd.DataFrame([[
            data["bug_type"],
            data["priority"],
            data["resolution_time"],
            data["dev_avg_res_time"],
            data["dev_total_fixes"]
        ]], columns=[
            "bug_type", "priority", "resolution_time", "dev_avg_res_time", "dev_total_fixes"
        ])

        pred = model.predict(features)
        predicted_dev = encoder.inverse_transform(pred)

        return jsonify({
            "recommended_developer": int(predicted_dev[0])
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)
