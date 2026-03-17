# pipeline/feature_pipeline.py
# ─────────────────────────────────────────────
# BrainBridge — Master Feature Engineering Pipeline
# 
# Flow:
# RawGamePayload
#   → extract game features
#   → apply age normalisation
#   → apply confidence adjustment
#   → build model input arrays
#   → return PipelineOutput
# ─────────────────────────────────────────────

from dataclasses import dataclass
from typing import Optional

from games.schemas         import RawGamePayload
from features.letter_mirror_features  import extract_letter_mirror_features,  LetterMirrorFeatures
from features.focus_catcher_features  import extract_focus_catcher_features,  FocusCatcherFeatures
from features.number_jump_features    import extract_number_jump_features,     NumberJumpFeatures
from models.schemas        import DyslexiaModelInput, DyscalculiaModelInput, ADHDModelInput
from config.constants      import AGE_WEIGHTS, CONFIDENCE_LOW, CONFIDENCE_MEDIUM


# ── Pipeline Output ───────────────────────────
@dataclass
class PipelineOutput:
    # Raw game features (for logging/debugging)
    letter_mirror_features:  LetterMirrorFeatures
    focus_catcher_features:  FocusCatcherFeatures
    number_jump_features:    NumberJumpFeatures

    # ML model inputs (ready for predict_proba)
    dyslexia_input:          DyslexiaModelInput
    dyscalculia_input:       DyscalculiaModelInput
    adhd_input:              ADHDModelInput

    # Session metadata
    child_age:               int
    age_weight:              float
    confidence_level:        str    # "HIGH" | "MEDIUM" | "LOW"
    is_reliable:             bool   # False = ask child to retry


# ── Confidence helper ─────────────────────────
def _get_confidence(completion_rate: float) -> tuple[str, bool]:
    if completion_rate < CONFIDENCE_LOW:
        return "LOW", False
    elif completion_rate < CONFIDENCE_MEDIUM:
        return "MEDIUM", True
    return "HIGH", True


# ── Master Pipeline ───────────────────────────
def run_feature_pipeline(payload: RawGamePayload) -> PipelineOutput:
    """
    Takes raw game payload from React/Node.js,
    runs all feature extractors,
    returns model-ready inputs.

    Args:
        payload: RawGamePayload — all 3 games + child metadata

    Returns:
        PipelineOutput — everything needed by the 3 ML models
    """

    age         = payload.child_age
    age_weight  = AGE_WEIGHTS.get(age, 1.0)
    confidence, is_reliable = _get_confidence(payload.session_completion_rate)

    # ── Step 1: Extract raw features per game ─
    lm_features = extract_letter_mirror_features(payload.letter_mirror, age)
    fc_features = extract_focus_catcher_features(payload.focus_catcher, age)
    nj_features = extract_number_jump_features(payload.number_jump,    age)

    # ── Step 2: Build model inputs ─────────────
    # Each model receives ONLY its relevant features
    # No cross-contamination between disorders

    dyslexia_input = DyslexiaModelInput(
        letter_reversal_rate       = lm_features.letter_reversal_rate,
        mirror_reversal_rate       = lm_features.mirror_reversal_rate,
        phonetic_decoding_accuracy = lm_features.phonetic_decoding_accuracy,
        response_time_ms           = lm_features.response_time_ms,
        response_time_normalised   = lm_features.response_time_normalised,
        response_time_variability  = lm_features.response_time_variability,
        self_correction_rate       = lm_features.self_correction_rate,
        hesitation_rate            = lm_features.hesitation_rate,
        skip_rate                  = lm_features.skip_rate,
    )

    dyscalculia_input = DyscalculiaModelInput(
        quantity_estimation_error    = nj_features.quantity_estimation_error,
        quantity_estimation_accuracy = nj_features.quantity_estimation_accuracy,
        digit_reversal_rate          = nj_features.digit_reversal_rate,
        digit_vs_dots_gap            = nj_features.digit_vs_dots_gap,
        number_comparison_accuracy   = nj_features.number_comparison_accuracy,
        counting_speed_ratio         = nj_features.counting_speed_ratio,
        response_time_variability    = nj_features.response_time_variability,
        subitizing_accuracy          = nj_features.subitizing_accuracy,
        skip_rate                    = nj_features.skip_rate,
    )

    adhd_input = ADHDModelInput(
        attention_persistence_score = fc_features.attention_persistence_score,
        attention_decay_rate        = fc_features.attention_decay_rate,
        impulsivity_rate            = fc_features.impulsivity_rate,
        reaction_time_avg_ms        = fc_features.reaction_time_avg_ms,
        reaction_time_variability   = fc_features.reaction_time_variability,
        reaction_time_normalised    = fc_features.reaction_time_normalised,
        task_switch_error_rate      = fc_features.task_switch_error_rate,
        task_switch_accuracy        = fc_features.task_switch_accuracy,
        overall_accuracy            = fc_features.overall_accuracy,
        skip_rate                   = fc_features.skip_rate,
    )

    return PipelineOutput(
        letter_mirror_features  = lm_features,
        focus_catcher_features  = fc_features,
        number_jump_features    = nj_features,
        dyslexia_input          = dyslexia_input,
        dyscalculia_input       = dyscalculia_input,
        adhd_input              = adhd_input,
        child_age               = age,
        age_weight              = age_weight,
        confidence_level        = confidence,
        is_reliable             = is_reliable,
    )
