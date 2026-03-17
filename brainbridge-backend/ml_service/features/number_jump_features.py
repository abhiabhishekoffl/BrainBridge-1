# features/number_jump_features.py
# ─────────────────────────────────────────────
# BrainBridge — Number Jump Feature Extractor
# Feeds into: XGBoost (Dyscalculia Model)
# ─────────────────────────────────────────────

from pydantic import BaseModel, Field
from typing import List
from games.schemas import NumberJumpGameRaw
from config.constants import RT_BASELINE_MS
import statistics


# ── Output Feature Schema ─────────────────────
class NumberJumpFeatures(BaseModel):
    """
    Production features extracted from Number Jump game.
    All values normalised to 0.0–1.0 unless stated.
    """

    # Quantity estimation (Weber fraction)
    quantity_estimation_error:   float = Field(..., ge=0.0,
        description="Average Weber fraction deviation — how far off estimates were")

    quantity_estimation_accuracy: float = Field(..., ge=0.0, le=1.0,
        description="% of quantity comparisons answered correctly")

    # Digit recognition signals
    digit_reversal_rate:         float = Field(..., ge=0.0, le=1.0,
        description="% of digit-based questions where child reversed numbers (e.g. 6→9)")

    digit_vs_dots_gap:           float = Field(...,
        description="Accuracy gap: digit questions vs dot questions. Positive = worse with digits")

    # Number comparison
    number_comparison_accuracy:  float = Field(..., ge=0.0, le=1.0,
        description="% correct on greater-than/less-than comparisons")

    # Counting speed
    counting_speed_ratio:        float = Field(..., ge=0.0,
        description="Child's response speed vs age baseline (>1.0 = slower than expected)")

    # Response time signals
    response_time_avg_ms:        float = Field(..., ge=0.0,
        description="Average response time in milliseconds")

    response_time_variability:   float = Field(..., ge=0.0,
        description="Std deviation of response times")

    # Subitizing (instant recognition of small quantities ≤ 4)
    subitizing_accuracy:         float = Field(..., ge=0.0, le=1.0,
        description="% correct on small quantity questions (≤4 dots) — tests instant recognition")

    # Overall
    overall_accuracy:            float = Field(..., ge=0.0, le=1.0,
        description="% of all questions answered correctly")

    skip_rate:                   float = Field(..., ge=0.0, le=1.0,
        description="% of questions skipped")

    total_questions:             int   = Field(...,
        description="Total questions attempted")


# ── Extractor Function ────────────────────────
def extract_number_jump_features(
    game: NumberJumpGameRaw,
    child_age: int
) -> NumberJumpFeatures:
    """
    Converts raw NumberJumpGameRaw events into
    production-ready ML features.
    """
    questions   = game.questions
    total_q     = len(questions)
    baseline_rt = RT_BASELINE_MS.get(child_age, 1600)

    # ── Categorise questions ──────────────────
    skipped       = [q for q in questions if q.was_skipped]
    answered      = [q for q in questions if not q.was_skipped]
    correct       = [q for q in answered if q.is_correct]
    digit_qs      = [q for q in answered if q.shown_as_digits]
    dot_qs        = [q for q in answered if not q.shown_as_digits]
    digit_correct = [q for q in digit_qs if q.is_correct]
    dot_correct   = [q for q in dot_qs   if q.is_correct]

    # ── Subitizing: small quantity questions (≤4) ─
    subitize_qs      = [q for q in answered if q.correct_answer <= 4]
    subitize_correct = [q for q in subitize_qs if q.is_correct]

    # ── Digit reversals ───────────────────────
    # Classic dyscalculia: confusing 6 and 9, 12 and 21
    REVERSAL_PAIRS = {(6,9),(9,6),(12,21),(21,12),(13,31),(31,13)}
    digit_reversals = [
        q for q in digit_qs
        if (q.shown_quantity_a, q.selected_answer) in REVERSAL_PAIRS
        or (q.shown_quantity_b, q.selected_answer) in REVERSAL_PAIRS
    ]

    # ── Weber fraction (estimation error) ────
    estimation_errors = [q.estimation_error for q in answered]
    avg_estimation_error = statistics.mean(estimation_errors) if estimation_errors else 0.0

    # ── Response times ────────────────────────
    times = [q.time_ms for q in answered]
    avg_rt         = statistics.mean(times) if times else float(baseline_rt)
    rt_variability = statistics.stdev(times) if len(times) > 1 else 0.0

    # ── Accuracy metrics ──────────────────────
    overall_accuracy          = len(correct)       / max(len(answered), 1)
    digit_accuracy            = len(digit_correct) / max(len(digit_qs), 1)
    dot_accuracy              = len(dot_correct)   / max(len(dot_qs),   1)
    digit_vs_dots_gap         = dot_accuracy - digit_accuracy   # positive = worse with digits
    number_comparison_accuracy = overall_accuracy               # all questions are comparisons
    subitizing_accuracy       = len(subitize_correct) / max(len(subitize_qs), 1)
    digit_reversal_rate       = len(digit_reversals)  / max(len(digit_qs),    1)
    skip_rate                 = len(skipped)           / total_q
    counting_speed_ratio      = avg_rt                 / baseline_rt

    return NumberJumpFeatures(
        quantity_estimation_error    = round(avg_estimation_error,        4),
        quantity_estimation_accuracy = round(overall_accuracy,            4),
        digit_reversal_rate          = round(digit_reversal_rate,         4),
        digit_vs_dots_gap            = round(digit_vs_dots_gap,           4),
        number_comparison_accuracy   = round(number_comparison_accuracy,  4),
        counting_speed_ratio         = round(counting_speed_ratio,        4),
        response_time_avg_ms         = round(avg_rt,                      2),
        response_time_variability    = round(rt_variability,              2),
        subitizing_accuracy          = round(subitizing_accuracy,         4),
        overall_accuracy             = round(overall_accuracy,            4),
        skip_rate                    = round(skip_rate,                   4),
        total_questions              = total_q,
    )
