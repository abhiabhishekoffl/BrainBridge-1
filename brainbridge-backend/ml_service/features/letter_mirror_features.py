# features/letter_mirror_features.py
# ─────────────────────────────────────────────
# BrainBridge — Letter Mirror Feature Extractor
# Feeds into: Random Forest (Dyslexia Model)
# ─────────────────────────────────────────────

from pydantic import BaseModel, Field
from typing import List
from games.schemas import LetterMirrorGameRaw
from config.constants import RT_BASELINE_MS
import statistics


# ── Output Feature Schema ─────────────────────
class LetterMirrorFeatures(BaseModel):
    """
    Production features extracted from Letter Mirror game.
    All values normalised to 0.0–1.0 unless stated.
    """

    # Core reversal signals
    letter_reversal_rate:       float = Field(..., ge=0.0, le=1.0,
        description="% of b/d/p/q letters confused out of total attempts")

    mirror_reversal_rate:       float = Field(..., ge=0.0, le=1.0,
        description="% of CLASSIC mirror reversals (b↔d, p↔q) specifically")

    # Phonetic decoding
    phonetic_decoding_accuracy: float = Field(..., ge=0.0, le=1.0,
        description="% of letters correctly identified (inverse of reversal rate)")

    # Response time signals
    response_time_ms:           float = Field(..., ge=0.0,
        description="Average response time in milliseconds across all questions")

    response_time_normalised:   float = Field(..., ge=0.0,
        description="Response time relative to age baseline (>1.0 = slower than expected)")

    response_time_variability:  float = Field(..., ge=0.0,
        description="Std deviation of response times — high = inconsistent attention")

    # Self correction
    self_correction_rate:       float = Field(..., ge=0.0, le=1.0,
        description="% of questions where child changed their answer")

    # Hesitation
    hesitation_rate:            float = Field(..., ge=0.0, le=1.0,
        description="% of questions where response time > 2x age baseline")

    # Completion
    skip_rate:                  float = Field(..., ge=0.0, le=1.0,
        description="% of questions skipped")

    total_questions:            int   = Field(...,
        description="Total questions attempted")


# ── Extractor Function ────────────────────────
def extract_letter_mirror_features(
    game: LetterMirrorGameRaw,
    child_age: int
) -> LetterMirrorFeatures:
    """
    Converts raw LetterMirrorGameRaw events into
    production-ready ML features.
    """
    questions   = game.questions
    total_q     = len(questions)
    baseline_rt = RT_BASELINE_MS.get(child_age, 1600)

    # ── Counts ────────────────────────────────
    wrong_letters    = [q for q in questions if not q.is_correct and not q.was_skipped]
    mirror_reversals = [q for q in questions if q.is_mirror_reversal]
    skipped          = [q for q in questions if q.was_skipped]
    answered         = [q for q in questions if not q.was_skipped]

    # ── Response times ────────────────────────
    times = [q.time_ms for q in answered] if answered else [0.0]
    avg_rt        = statistics.mean(times)
    rt_variability = statistics.stdev(times) if len(times) > 1 else 0.0

    # ── Hesitation: RT > 2× baseline ─────────
    hesitations = [t for t in times if t > (baseline_rt * 2)]

    # ── Self corrections ──────────────────────
    # A self-correction = answered correctly but took > 1.5× avg time
    # (child paused, reconsidered, corrected)
    self_corrections = [
        q for q in answered
        if q.is_correct and q.time_ms > (avg_rt * 1.5)
    ]

    # ── Feature calculations ──────────────────
    letter_reversal_rate       = len(wrong_letters)    / total_q
    mirror_reversal_rate       = len(mirror_reversals) / total_q
    phonetic_decoding_accuracy = 1.0 - letter_reversal_rate
    response_time_normalised   = avg_rt / baseline_rt
    hesitation_rate            = len(hesitations) / max(len(answered), 1)
    self_correction_rate       = len(self_corrections) / max(len(answered), 1)
    skip_rate                  = len(skipped) / total_q

    return LetterMirrorFeatures(
        letter_reversal_rate       = round(letter_reversal_rate,       4),
        mirror_reversal_rate       = round(mirror_reversal_rate,       4),
        phonetic_decoding_accuracy = round(phonetic_decoding_accuracy, 4),
        response_time_ms           = round(avg_rt,                     2),
        response_time_normalised   = round(response_time_normalised,   4),
        response_time_variability  = round(rt_variability,             2),
        self_correction_rate       = round(self_correction_rate,       4),
        hesitation_rate            = round(hesitation_rate,            4),
        skip_rate                  = round(skip_rate,                  4),
        total_questions            = total_q,
    )
