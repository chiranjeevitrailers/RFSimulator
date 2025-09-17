# 5GLabX ML Issue Learning (Anomaly + Recommendations)

## Components
- supabase/ml_schema.sql: Tables for events, features, labels, models, recommendations
- ml/utils/feature_extraction.py: Converts execution events -> model features
- ml/training.py: Trains IsolationForest and writes versioned artifacts
- ml/inference.py: FastAPI server exposing /score and /similar
- ml/requirements.txt: Python dependencies

## Quickstart
1) Train model
```
cd ml
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python training.py
```
Artifacts are written to ml/artifacts and active pointer saved as execution_anomaly_iforest_active.joblib.

2) Run inference API
```
uvicorn inference:app --host 0.0.0.0 --port 8081
```

3) Score a run
```
curl -X POST http://localhost:8081/score \
  -H 'Content-Type: application/json' \
  -d '{"features":{"num_events":60,"num_errors":7,"num_warnings":5,"has_auth_failure":1,"has_timer_timeout":1,"has_rrc_reconfig":0}}'
```

## Integration Notes
- During/after a run, collect execution events and extract features using the Python util or a Node port.
- Send features to the inference API and display results in UI (Issue Insight panel).
- Save recommendations + helpful feedback back to Supabase in ml_recommendations.

## Next Steps
- Add retrieval of similar incidents
- Add failure classifier and sequence model
- Automate nightly retraining