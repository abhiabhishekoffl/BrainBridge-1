# data/generate_datasets.py
# ─────────────────────────────────────────────
# BrainBridge — Synthetic Dataset Generator
# Generates training data based on published
# clinical research baselines.
# Run: python data/generate_datasets.py
# ─────────────────────────────────────────────

import numpy as np
import pandas as pd
import os

np.random.seed(42)
N = 5000   # 2500 at-risk + 2500 typical per disorder
OUT = "data/"
os.makedirs(OUT, exist_ok=True)


def clip(val, lo=0.0, hi=1.0):
    return float(np.clip(val, lo, hi))


# ─────────────────────────────────────────────
# Dataset 1 — Dyslexia (Random Forest)
# Features match DyslexiaModelInput exactly
# Clinical source: Shaywitz 2003, NICHD
# ─────────────────────────────────────────────
def generate_dyslexia(n=N):
    rows = []
    for i in range(n):
        risk = i < n // 2
        rows.append({
            # At-risk: higher reversal rates, slower RT
            "letter_reversal_rate":       clip(np.random.normal(0.55, 0.12) if risk else np.random.normal(0.10, 0.05)),
            "mirror_reversal_rate":       clip(np.random.normal(0.45, 0.12) if risk else np.random.normal(0.06, 0.04)),
            "phonetic_decoding_accuracy": clip(np.random.normal(0.42, 0.12) if risk else np.random.normal(0.88, 0.07)),
            "response_time_ms":           float(np.clip(np.random.normal(1900, 300) if risk else np.random.normal(950, 200), 300, 4000)),
            "response_time_normalised":   float(np.clip(np.random.normal(1.8,  0.4) if risk else np.random.normal(0.9, 0.2), 0.2, 4.0)),
            "response_time_variability":  float(np.clip(np.random.normal(420,  80)  if risk else np.random.normal(160, 50),  0,   800)),
            "self_correction_rate":       clip(np.random.normal(0.15, 0.07) if risk else np.random.normal(0.40, 0.10)),
            "hesitation_rate":            clip(np.random.normal(0.55, 0.15) if risk else np.random.normal(0.10, 0.06)),
            "skip_rate":                  clip(np.random.normal(0.20, 0.10) if risk else np.random.normal(0.03, 0.02)),
            "label": int(risk),
        })
    df = pd.DataFrame(rows).sample(frac=1).reset_index(drop=True)
    df.to_csv(f"{OUT}dyslexia_dataset.csv", index=False)
    print(f"✅ Dyslexia dataset: {len(df)} rows → {OUT}dyslexia_dataset.csv")
    return df


# ─────────────────────────────────────────────
# Dataset 2 — Dyscalculia (XGBoost)
# Features match DyscalculiaModelInput exactly
# Clinical source: Halberda 2008, Butterworth 2011
# ─────────────────────────────────────────────
def generate_dyscalculia(n=N):
    rows = []
    for i in range(n):
        risk = i < n // 2
        rows.append({
            # At-risk: higher Weber fraction, digit reversals
            "quantity_estimation_error":    float(np.clip(np.random.normal(0.45, 0.12) if risk else np.random.normal(0.12, 0.06), 0, 1.5)),
            "quantity_estimation_accuracy": clip(np.random.normal(0.38, 0.12) if risk else np.random.normal(0.82, 0.08)),
            "digit_reversal_rate":          clip(np.random.normal(0.50, 0.14) if risk else np.random.normal(0.06, 0.04)),
            "digit_vs_dots_gap":            float(np.clip(np.random.normal(0.35, 0.12) if risk else np.random.normal(0.04, 0.03), -0.2, 1.0)),
            "number_comparison_accuracy":   clip(np.random.normal(0.40, 0.13) if risk else np.random.normal(0.84, 0.08)),
            "counting_speed_ratio":         float(np.clip(np.random.normal(1.90, 0.40) if risk else np.random.normal(0.95, 0.20), 0.3, 4.0)),
            "response_time_variability":    float(np.clip(np.random.normal(380,  90)   if risk else np.random.normal(150, 45),    0,   800)),
            "subitizing_accuracy":          clip(np.random.normal(0.35, 0.14) if risk else np.random.normal(0.88, 0.07)),
            "skip_rate":                    clip(np.random.normal(0.22, 0.10) if risk else np.random.normal(0.03, 0.02)),
            "label": int(risk),
        })
    df = pd.DataFrame(rows).sample(frac=1).reset_index(drop=True)
    df.to_csv(f"{OUT}dyscalculia_dataset.csv", index=False)
    print(f"✅ Dyscalculia dataset: {len(df)} rows → {OUT}dyscalculia_dataset.csv")
    return df


# ─────────────────────────────────────────────
# Dataset 3 — ADHD (SVM)
# Features match ADHDModelInput exactly
# Clinical source: Barkley 2014, Leth-Steensen 2000
# ─────────────────────────────────────────────
def generate_adhd(n=N):
    rows = []
    for i in range(n):
        risk = i < n // 2
        rows.append({
            # At-risk: low attention, high impulsivity, high RT variability
            "attention_persistence_score": float(np.clip(np.random.normal(28, 10) if risk else np.random.normal(72, 12), 0, 100)),
            "attention_decay_rate":        clip(np.random.normal(0.60, 0.15) if risk else np.random.normal(0.10, 0.07)),
            "impulsivity_rate":            clip(np.random.normal(0.55, 0.15) if risk else np.random.normal(0.08, 0.05)),
            "reaction_time_avg_ms":        float(np.clip(np.random.normal(1700, 350) if risk else np.random.normal(900, 180), 200, 4000)),
            "reaction_time_variability":   float(np.clip(np.random.normal(480,  90)  if risk else np.random.normal(180, 50),  0,   800)),
            "reaction_time_normalised":    float(np.clip(np.random.normal(1.75, 0.4) if risk else np.random.normal(0.88, 0.2), 0.2, 4.0)),
            "task_switch_error_rate":      clip(np.random.normal(0.58, 0.14) if risk else np.random.normal(0.10, 0.06)),
            "task_switch_accuracy":        clip(np.random.normal(0.38, 0.13) if risk else np.random.normal(0.88, 0.07)),
            "overall_accuracy":            clip(np.random.normal(0.40, 0.13) if risk else np.random.normal(0.84, 0.08)),
            "skip_rate":                   clip(np.random.normal(0.25, 0.10) if risk else np.random.normal(0.04, 0.02)),
            "label": int(risk),
        })
    df = pd.DataFrame(rows).sample(frac=1).reset_index(drop=True)
    df.to_csv(f"{OUT}adhd_dataset.csv", index=False)
    print(f"✅ ADHD dataset: {len(df)} rows → {OUT}adhd_dataset.csv")
    return df


if __name__ == "__main__":
    print("Generating BrainBridge synthetic datasets...")
    generate_dyslexia()
    generate_dyscalculia()
    generate_adhd()
    print("\nAll datasets ready. Run training scripts next.")
