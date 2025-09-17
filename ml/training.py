from __future__ import annotations
import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from datetime import datetime

ARTIFACT_DIR = os.environ.get("ML_ARTIFACT_DIR", "./artifacts")
MODEL_NAME = "execution_anomaly_iforest"

os.makedirs(ARTIFACT_DIR, exist_ok=True)


def load_training_data(csv_path: str) -> pd.DataFrame:
    # Expect a CSV with feature columns; for bootstrap we simulate
    if not os.path.exists(csv_path):
        # Create synthetic minimal dataset
        rng = np.random.RandomState(42)
        normal = pd.DataFrame({
            "num_events": rng.poisson(50, 200),
            "num_errors": rng.poisson(1, 200),
            "num_warnings": rng.poisson(3, 200),
            "has_auth_failure": rng.binomial(1, 0.05, 200),
            "has_timer_timeout": rng.binomial(1, 0.08, 200),
            "has_rrc_reconfig": rng.binomial(1, 0.2, 200),
        })
        anomalies = pd.DataFrame({
            "num_events": rng.poisson(120, 20),
            "num_errors": rng.poisson(8, 20),
            "num_warnings": rng.poisson(10, 20),
            "has_auth_failure": rng.binomial(1, 0.6, 20),
            "has_timer_timeout": rng.binomial(1, 0.7, 20),
            "has_rrc_reconfig": rng.binomial(1, 0.6, 20),
        })
        df = pd.concat([normal, anomalies], ignore_index=True)
        return df
    return pd.read_csv(csv_path)


def train_model(df: pd.DataFrame):
    feature_cols = list(df.columns)
    X = df[feature_cols].values
    model = IsolationForest(n_estimators=200, contamination=0.08, random_state=42)
    model.fit(X)
    return model, feature_cols


def save_artifacts(model, feature_cols):
    ts = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    version = ts
    model_path = os.path.join(ARTIFACT_DIR, f"{MODEL_NAME}_{version}.joblib")
    meta_path = os.path.join(ARTIFACT_DIR, f"{MODEL_NAME}_{version}.json")

    joblib.dump({"model": model, "features": feature_cols}, model_path)
    with open(meta_path, "w") as f:
        json.dump({"model_name": MODEL_NAME, "version": version, "features": feature_cols}, f)

    # Also write/overwrite active pointer
    active_path = os.path.join(ARTIFACT_DIR, f"{MODEL_NAME}_active.joblib")
    joblib.dump({"model": model, "features": feature_cols}, active_path)
    return model_path, meta_path, version


if __name__ == "__main__":
    data = load_training_data(os.environ.get("ML_TRAIN_CSV", "./bootstrap.csv"))
    model, feats = train_model(data)
    mpath, metapath, ver = save_artifacts(model, feats)
    print(json.dumps({"artifact": mpath, "version": ver}))

