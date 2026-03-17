# config/constants.py
# ─────────────────────────────────────────────
# BrainBridge — Central Configuration
# ─────────────────────────────────────────────

# ── Age range supported ───────────────────────
MIN_AGE = 3
MAX_AGE = 7

# ── Questions per game ────────────────────────
QUESTIONS_PER_GAME = 4

# ── Age-based normalisation weights ──────────
# Older children are held to a higher standard
AGE_WEIGHTS = {
    3: 0.50,
    4: 0.65,
    5: 0.75,
    6: 0.90,
    7: 1.00,
}

# ── Risk thresholds (0–100 scale) ─────────────
RISK_GREEN  = 30   # below 30  → GREEN  (low risk)
RISK_YELLOW = 65   # 30–65     → YELLOW (monitor)
                   # above 65  → RED    (seek assessment)

# ── Session confidence thresholds ─────────────
CONFIDENCE_LOW    = 0.50   # below → unreliable, ask retry
CONFIDENCE_MEDIUM = 0.80   # below → reduce score by 15%

# ── Reaction time baselines (ms) by age ───────
# Source: published neuropsychology research
RT_BASELINE_MS = {
    3: 2200,
    4: 1900,
    5: 1600,
    6: 1300,
    7: 1100,
}

# ── Attention span baselines (seconds) by age ─
# Source: Barkley 2014
ATTENTION_BASELINE_SECONDS = {
    3: 120,
    4: 180,
    5: 240,
    6: 300,
    7: 420,
}

# ── Model file paths ──────────────────────────
MODEL_PATHS = {
    "dyslexia":    "models/dyslexia_model.pkl",
    "dyscalculia": "models/dyscalculia_model.pkl",
    "adhd":        "models/adhd_model.pkl",
}

# ── API settings ──────────────────────────────
API_HOST    = "0.0.0.0"
API_PORT    = 8000
API_VERSION = "v1"

# ── Disclaimer (always attached to output) ────
DISCLAIMER = (
    "This tool provides behavioral insights only. "
    "It is not a medical diagnostic system. "
    "Please consult a qualified specialist for clinical assessment."
)
