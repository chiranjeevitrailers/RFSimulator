from __future__ import annotations
import os
import joblib
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict, Any, List

MODEL_PATH = os.environ.get("ML_ACTIVE_MODEL", "./artifacts/execution_anomaly_iforest_active.joblib")

app = FastAPI(title="5GLabX ML Inference API")

class ScoreRequest(BaseModel):
    features: Dict[str, float]

class SimilarRequest(BaseModel):
    features: Dict[str, float]
    top_k: int = 5

# Lazy load
_model_bundle = None

def load_model():
    global _model_bundle
    if _model_bundle is None:
        _model_bundle = joblib.load(MODEL_PATH)
    return _model_bundle

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/score")
async def score(req: ScoreRequest):
    bundle = load_model()
    model = bundle["model"]
    feature_cols = bundle["features"]

    X = [[req.features.get(col, 0.0) for col in feature_cols]]
    # IsolationForest: -1 anomaly, 1 normal
    pred = model.predict(X)[0]
    score = model.decision_function(X)[0]

    result = {
        "is_anomaly": pred == -1,
        "anomaly_score": float(-score),
        "confidence": float(min(max(( -score - 0.1) / 0.5, 0.0), 1.0)),
    }

    # Basic heuristic recommendations
    recs: List[Dict[str, Any]] = []
    if req.features.get("has_auth_failure", 0) == 1:
        recs.append({
            "recommendation": "Verify UE credentials/keys and network auth settings.",
            "confidence": 0.8,
        })
    if req.features.get("has_timer_timeout", 0) == 1:
        recs.append({
            "recommendation": "Increase specific protocol timers and check paging/coverage.",
            "confidence": 0.7,
        })
    if req.features.get("num_errors", 0) > 5:
        recs.append({
            "recommendation": "Review recent error messages; try rerun with verbose logging.",
            "confidence": 0.6,
        })

    return {"result": result, "recommendations": recs}

@app.post("/similar")
async def similar(req: SimilarRequest):
    # Placeholder for retrieval
    return {"items": []}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8081)))

