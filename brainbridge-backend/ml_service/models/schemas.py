# models/schemas.py
# ─────────────────────────────────────────────
# BrainBridge — Model Input Schemas
# ─────────────────────────────────────────────

from pydantic import BaseModel
from typing import List, ClassVar

class DyslexiaModelInput(BaseModel):
    letter_reversal_rate:       float
    mirror_reversal_rate:       float
    phonetic_decoding_accuracy: float
    response_time_ms:           float
    response_time_normalised:   float
    response_time_variability:  float
    self_correction_rate:       float
    hesitation_rate:            float
    skip_rate:                  float

    FEATURE_NAMES: ClassVar[List[str]] = [
        "letter_reversal_rate", "mirror_reversal_rate",
        "phonetic_decoding_accuracy", "response_time_ms",
        "response_time_normalised", "response_time_variability",
        "self_correction_rate", "hesitation_rate", "skip_rate"
    ]

    def to_array(self):
        return [[getattr(self, f) for f in self.FEATURE_NAMES]]

class DyscalculiaModelInput(BaseModel):
    quantity_estimation_error:    float
    quantity_estimation_accuracy: float
    digit_reversal_rate:          float
    digit_vs_dots_gap:            float
    number_comparison_accuracy:   float
    counting_speed_ratio:         float
    response_time_variability:    float
    subitizing_accuracy:          float
    skip_rate:                    float

    FEATURE_NAMES: ClassVar[List[str]] = [
        "quantity_estimation_error", "quantity_estimation_accuracy",
        "digit_reversal_rate", "digit_vs_dots_gap",
        "number_comparison_accuracy", "counting_speed_ratio",
        "response_time_variability", "subitizing_accuracy", "skip_rate"
    ]

    def to_array(self):
        return [[getattr(self, f) for f in self.FEATURE_NAMES]]

class ADHDModelInput(BaseModel):
    attention_persistence_score: float
    attention_decay_rate:        float
    impulsivity_rate:            float
    reaction_time_avg_ms:        float
    reaction_time_variability:   float
    reaction_time_normalised:    float
    task_switch_error_rate:      float
    task_switch_accuracy:        float
    overall_accuracy:            float
    skip_rate:                   float

    FEATURE_NAMES: ClassVar[List[str]] = [
        "attention_persistence_score", "attention_decay_rate",
        "impulsivity_rate", "reaction_time_avg_ms",
        "reaction_time_variability", "reaction_time_normalised",
        "task_switch_error_rate", "task_switch_accuracy",
        "overall_accuracy", "skip_rate"
    ]

    def to_array(self):
        return [[getattr(self, f) for f in self.FEATURE_NAMES]]
