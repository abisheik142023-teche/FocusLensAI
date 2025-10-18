from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, conlist
import numpy as np
import pickle
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("FocusLensAI")

app = FastAPI(title="FocusLensAI Engine")

# Load models (trained by ml-training)
try:
    with open('models/productivity_model.pkl','rb') as f:
        productivity_model = pickle.load(f)
    with open('models/burnout_model.pkl','rb') as f:
        burnout_model = pickle.load(f)
    with open('models/focus_model.pkl','rb') as f:
        focus_model = pickle.load(f)
    logger.info("AI models loaded")
except Exception as e:
    logger.error(f"Failed to load models: {e}")
    # Raise error so service fails fast if models missing
    raise RuntimeError("Failed to initialize AI models")

class InputSchema(BaseModel):
    app_usage: conlist(float, min_items=3, max_items=10)
    activity_pattern: conlist(float, min_items=5, max_items=5)
    historical_metrics: conlist(float, min_items=2, max_items=2)
    sentiment_score: float
    work_patterns: conlist(float, min_items=2, max_items=2)

@app.post("/predict")
async def predict(data: InputSchema):
    try:
        features = np.array([
            np.mean(data.app_usage[:3]),
            data.activity_pattern[0],
            data.activity_pattern[-1],
            data.historical_metrics[0],
            data.sentiment_score,
            data.work_patterns[0]
        ]).reshape(1, -1)

        prod = float(productivity_model.predict(features)[0])
        burn = float(burnout_model.predict(features)[0])
        foc = float(focus_model.predict(features)[0])

        insights = generate_insights(prod, burn, foc, data.activity_pattern, data.sentiment_score)

        return {
            "productivity_score": prod,
            "burnout_risk": burn,
            "focus_score": foc,
            "insights": insights,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}

def generate_insights(productivity, burnout_risk, focus_score, activity_pattern, sentiment):
    insights = {"strengths": [], "improvement_areas": [], "recommendations": []}
    if productivity > 0.7: insights["strengths"].append("High productivity consistently")
    if activity_pattern[0] > 0.5: insights["strengths"].append("Strong focus blocks")
    if sentiment > 0.3: insights["strengths"].append("Positive communication")

    if burnout_risk > 0.6: insights["improvement_areas"].append("Elevated burnout risk")
    if activity_pattern[-1] > 0.3: insights["improvement_areas"].append("High distraction time")
    if focus_score < 0.5: insights["improvement_areas"].append("Suboptimal focus")

    if burnout_risk > 0.6: insights["recommendations"].append("Schedule breaks and redistribute workload")
    if activity_pattern[-1] > 0.3: insights["recommendations"].append("Use focus blocks with app restrictions")
    if sentiment < -0.2: insights["recommendations"].append("Adjust communication style")
    return insights
