# api/main.py
# ─────────────────────────────────────────────
# BrainBridge — FastAPI Application
# Endpoint: POST /v1/predict
# ─────────────────────────────────────────────

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pickle, time, os

from games.schemas          import RawGamePayload
from pipeline.feature_pipeline import run_feature_pipeline
from config.constants       import (
    MODEL_PATHS, RISK_GREEN, RISK_YELLOW,
    AGE_WEIGHTS, DISCLAIMER, API_VERSION
)

app = FastAPI(
    title       = "BrainBridge AI Engine",
    description = "Behavioral risk screening — not a medical diagnostic system",
    version     = "1.0.0",
)

# ── Load all 3 models at startup ──────────────
print("Loading BrainBridge models...")
models = {}
for name, path in MODEL_PATHS.items():
    if os.path.exists(path):
        with open(path, "rb") as f:
            models[name] = pickle.load(f)
        print(f"  ✅ {name} model loaded")
    else:
        print(f"  ⚠️  {name} model not found at {path} — using rule-based fallback")
        models[name] = None


# ── Helpers ───────────────────────────────────
def traffic_light(score: float) -> str:
    if score < RISK_GREEN:   return "GREEN"
    if score < RISK_YELLOW:  return "YELLOW"
    return "RED"


def apply_age_weight(score: float, age: int) -> float:
    weight = AGE_WEIGHTS.get(age, 1.0)
    return round(score * weight, 2)


def rule_based_score(features_dict: dict) -> float:
    """
    Fallback if model .pkl not found.
    Simple weighted average of error rates.
    """
    error_keys = [k for k in features_dict if "error" in k or "reversal" in k]
    if not error_keys:
        return 30.0
    avg = sum(features_dict[k] for k in error_keys) / len(error_keys)
    return round(min(avg * 100, 100), 2)


def predict_score(model, feature_array: list, fallback_features: dict) -> float:
    if model is not None:
        prob = model.predict_proba(feature_array)[0][1]
        return round(prob * 100, 2)
    return rule_based_score(fallback_features)


# ── Response Schema ───────────────────────────
class DisorderResult(BaseModel):
    score:      float
    risk:       str
    age_adjusted_score: float
    age_adjusted_risk:  str

class PredictResponse(BaseModel):
    session_id:  str
    dyslexia:    DisorderResult
    dyscalculia: DisorderResult
    adhd:        DisorderResult
    confidence:  str
    is_reliable: bool
    inference_ms: float
    disclaimer:  str


# ── Main Endpoint ─────────────────────────────
@app.post(f"/api/{API_VERSION}/predict", response_model=PredictResponse)
def predict(payload: RawGamePayload):
    start = time.time()

    # ── Run pipeline ───────────────────────────
    pipeline_out = run_feature_pipeline(payload)

    # ── Guard: unreliable session ──────────────
    if not pipeline_out.is_reliable:
        raise HTTPException(
            status_code=422,
            detail={
                "error":      "Session incomplete",
                "confidence": pipeline_out.confidence_level,
                "message":    "Child did not complete enough games. Please retry."
            }
        )

    # ── Run 3 models ───────────────────────────
    dy_raw  = predict_score(
        models["dyslexia"],
        pipeline_out.dyslexia_input.to_array(),
        pipeline_out.dyslexia_input.dict()
    )
    dc_raw  = predict_score(
        models["dyscalculia"],
        pipeline_out.dyscalculia_input.to_array(),
        pipeline_out.dyscalculia_input.dict()
    )
    ad_raw  = predict_score(
        models["adhd"],
        pipeline_out.adhd_input.to_array(),
        pipeline_out.adhd_input.dict()
    )

    # ── Age-adjusted scores ────────────────────
    dy_adj  = apply_age_weight(dy_raw,  payload.child_age)
    dc_adj  = apply_age_weight(dc_raw,  payload.child_age)
    ad_adj  = apply_age_weight(ad_raw,  payload.child_age)

    elapsed_ms = round((time.time() - start) * 1000, 1)

    return PredictResponse(
        session_id  = payload.session_id,
        dyslexia    = DisorderResult(
            score=dy_raw, risk=traffic_light(dy_raw),
            age_adjusted_score=dy_adj, age_adjusted_risk=traffic_light(dy_adj)
        ),
        dyscalculia = DisorderResult(
            score=dc_raw, risk=traffic_light(dc_raw),
            age_adjusted_score=dc_adj, age_adjusted_risk=traffic_light(dc_adj)
        ),
        adhd        = DisorderResult(
            score=ad_raw, risk=traffic_light(ad_raw),
            age_adjusted_score=ad_adj, age_adjusted_risk=traffic_light(ad_adj)
        ),
        confidence   = pipeline_out.confidence_level,
        is_reliable  = pipeline_out.is_reliable,
        inference_ms = elapsed_ms,
        disclaimer   = DISCLAIMER,
    )


# ── Health check ──────────────────────────────
@app.get("/health")
def health():
    return {
        "status":        "ok",
        "models_loaded": sum(1 for m in models.values() if m is not None),
        "total_models":  3
    }
