# models/train_all.py
# ─────────────────────────────────────────────
# BrainBridge — Train All 3 Models
# Run: python models/train_all.py
# Output: models/*.pkl (ready for production)
# ─────────────────────────────────────────────

import pandas as pd
import pickle
import os
from sklearn.ensemble   import RandomForestClassifier
from sklearn.svm        import SVC
from sklearn.pipeline   import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics    import classification_report, accuracy_score
from xgboost            import XGBClassifier

from models.schemas import (
    DyslexiaModelInput,
    DyscalculiaModelInput,
    ADHDModelInput,
)

os.makedirs("models", exist_ok=True)
DATA = "data/"


def evaluate(name, model, X_test, y_test):
    y_pred = model.predict(X_test)
    acc    = accuracy_score(y_test, y_pred)
    print(f"\n── {name} ──────────────────────")
    print(f"Accuracy: {acc:.4f}")
    print(classification_report(y_test, y_pred, target_names=["Typical", "At-Risk"]))


# ─────────────────────────────────────────────
# Model 1 — Random Forest (Dyslexia)
# ─────────────────────────────────────────────
def train_dyslexia():
    df = pd.read_csv(f"{DATA}dyslexia_dataset.csv")
    X  = df[DyslexiaModelInput.FEATURE_NAMES]
    y  = df["label"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model = RandomForestClassifier(
        n_estimators    = 200,
        max_depth       = 8,
        min_samples_leaf= 5,
        max_features    = "sqrt",
        class_weight    = "balanced",
        n_jobs          = -1,
        random_state    = 42,
    )
    model.fit(X_train, y_train)
    evaluate("Random Forest — Dyslexia", model, X_test, y_test)

    with open("models/dyslexia_model.pkl", "wb") as f:
        pickle.dump(model, f)
    print("✅ Saved: models/dyslexia_model.pkl")


# ─────────────────────────────────────────────
# Model 2 — XGBoost (Dyscalculia)
# ─────────────────────────────────────────────
def train_dyscalculia():
    df = pd.read_csv(f"{DATA}dyscalculia_dataset.csv")
    X  = df[DyscalculiaModelInput.FEATURE_NAMES]
    y  = df["label"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model = XGBClassifier(
        n_estimators        = 200,
        max_depth           = 5,
        learning_rate       = 0.05,
        subsample           = 0.8,
        colsample_bytree    = 0.8,
        min_child_weight    = 5,
        gamma               = 0.1,
        use_label_encoder   = False,
        eval_metric         = "logloss",
        random_state        = 42,
        n_jobs              = -1,
    )
    model.fit(X_train, y_train,
              eval_set=[(X_test, y_test)], verbose=False)
    evaluate("XGBoost — Dyscalculia", model, X_test, y_test)

    with open("models/dyscalculia_model.pkl", "wb") as f:
        pickle.dump(model, f)
    print("✅ Saved: models/dyscalculia_model.pkl")


# ─────────────────────────────────────────────
# Model 3 — SVM (ADHD)
# ─────────────────────────────────────────────
def train_adhd():
    df = pd.read_csv(f"{DATA}adhd_dataset.csv")
    X  = df[ADHDModelInput.FEATURE_NAMES]
    y  = df["label"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # Pipeline: scaler + SVM (scaling is mandatory for SVM)
    model = Pipeline([
        ("scaler", StandardScaler()),
        ("svm", SVC(
            kernel          = "rbf",
            C               = 10.0,
            gamma           = "scale",
            probability     = True,   # needed for predict_proba
            class_weight    = "balanced",
            random_state    = 42,
        ))
    ])
    model.fit(X_train, y_train)
    evaluate("SVM — ADHD", model, X_test, y_test)

    with open("models/adhd_model.pkl", "wb") as f:
        pickle.dump(model, f)
    print("✅ Saved: models/adhd_model.pkl")


# ─────────────────────────────────────────────
if __name__ == "__main__":
    print("Training BrainBridge models...\n")
    train_dyslexia()
    train_dyscalculia()
    train_adhd()
    print("\n✅ All 3 models trained and saved to models/")
    print("Run: uvicorn api.main:app --reload --port 8000")
