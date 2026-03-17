# features/focus_catcher_features.py
# ─────────────────────────────────────────────
# BrainBridge — Focus Catcher Feature Extractor
# Feeds into: SVM (ADHD Model)
# ─────────────────────────────────────────────

from pydantic import BaseModel, Field
from typing import List
from games.schemas import FocusCatcherGameRaw
from config.constants import RT_BASELINE_MS, ATTENTION_BASELINE_SECONDS
import statistics


# ── Output Feature Schema ─────────────────────
class FocusCatcherFeatures(BaseModel):
    """
    Production features extracted from Focus Catcher game.
    All values normalised to 0.0–1.0 unless stated.
    """

    # Attention signals
    attention_persistence_score: float = Field(..., ge=0.0, le=100.0,
        description="0–100 score: how consistently child stayed on task")

    attention_decay_rate:        float = Field(..., ge=0.0, le=1.0,
        description="Did accuracy drop in later questions vs earlier? (0=stable, 1=severe decay)")

    # Impulsivity signals
    impulsivity_rate:            float = Field(..., ge=0.0, le=1.0,
        description="% of premature taps (tapped before target appeared)")

    premature_tap_count:         int   = Field(..., ge=0,
        description="Raw count of premature taps")

    # Reaction time signals
    reaction_time_avg_ms:        float = Field(..., ge=0.0,
        description="Average reaction time across correct responses")

    reaction_time_variability:   float = Field(..., ge=0.0,
        description="Std deviation of reaction times — high = inconsistent (ADHD signal)")

    reaction_time_normalised:    float = Field(..., ge=0.0,
        description="Reaction time relative to age baseline")

    # Task switching signals
    task_switch_error_rate:      float = Field(..., ge=0.0, le=1.0,
        description="% of errors specifically on task-switch questions")

    task_switch_accuracy:        float = Field(..., ge=0.0, le=1.0,
        description="% correct on task-switch questions")

    # Overall accuracy
    overall_accuracy:            float = Field(..., ge=0.0, le=1.0,
        description="% of correct responses overall")

    skip_rate:                   float = Field(..., ge=0.0, le=1.0,
        description="% of questions skipped")

    total_questions:             int   = Field(...,
        description="Total questions attempted")


# ── Extractor Function ────────────────────────
def extract_focus_catcher_features(
    game: FocusCatcherGameRaw,
    child_age: int
) -> FocusCatcherFeatures:
    """
    Converts raw FocusCatcherGameRaw events into
    production-ready ML features.
    """
    questions   = game.questions
    total_q     = len(questions)
    baseline_rt = RT_BASELINE_MS.get(child_age, 1600)
    attn_base   = ATTENTION_BASELINE_SECONDS.get(child_age, 240)

    # ── Categorise questions ──────────────────
    skipped         = [q for q in questions if q.was_skipped]
    answered        = [q for q in questions if not q.was_skipped]
    premature_taps  = [q for q in answered if q.was_premature_tap]
    correct         = [q for q in answered if q.is_correct]
    task_switches   = [q for q in answered if q.task_switched]
    switch_correct  = [q for q in task_switches if q.task_switch_correct]
    switch_errors   = [q for q in task_switches if not q.task_switch_correct]

    # ── Reaction times (correct non-premature only) ───
    valid_rt = [q.reaction_time_ms for q in correct if q.reaction_time_ms > 0]
    avg_rt        = statistics.mean(valid_rt) if valid_rt else float(baseline_rt)
    rt_variability = statistics.stdev(valid_rt) if len(valid_rt) > 1 else 0.0

    # ── Attention decay ───────────────────────
    # Split questions into first half and second half
    # If accuracy drops in second half → attention decayed
    half = total_q // 2
    first_half_correct  = sum(1 for q in questions[:half] if q.is_correct)
    second_half_correct = sum(1 for q in questions[half:] if q.is_correct)
    first_half_acc  = first_half_correct  / max(half, 1)
    second_half_acc = second_half_correct / max(total_q - half, 1)
    attention_decay_rate = max(0.0, first_half_acc - second_half_acc)

    # ── Attention persistence score (0–100) ───
    # Based on: accuracy + low impulsivity + low decay
    accuracy_component    = (len(correct) / max(len(answered), 1)) * 40
    impulsivity_component = (1 - len(premature_taps) / max(len(answered), 1)) * 30
    decay_component       = (1 - attention_decay_rate) * 30
    attention_persistence_score = accuracy_component + impulsivity_component + decay_component

    # ── Feature calculations ──────────────────
    impulsivity_rate         = len(premature_taps) / max(len(answered), 1)
    task_switch_error_rate   = len(switch_errors)  / max(len(task_switches), 1)
    task_switch_accuracy     = len(switch_correct) / max(len(task_switches), 1)
    overall_accuracy         = len(correct)        / max(len(answered), 1)
    skip_rate                = len(skipped)        / total_q
    reaction_time_normalised = avg_rt              / baseline_rt

    return FocusCatcherFeatures(
        attention_persistence_score = round(attention_persistence_score, 2),
        attention_decay_rate        = round(attention_decay_rate,        4),
        impulsivity_rate            = round(impulsivity_rate,            4),
        premature_tap_count         = len(premature_taps),
        reaction_time_avg_ms        = round(avg_rt,                     2),
        reaction_time_variability   = round(rt_variability,             2),
        reaction_time_normalised    = round(reaction_time_normalised,   4),
        task_switch_error_rate      = round(task_switch_error_rate,     4),
        task_switch_accuracy        = round(task_switch_accuracy,       4),
        overall_accuracy            = round(overall_accuracy,           4),
        skip_rate                   = round(skip_rate,                  4),
        total_questions             = total_q,
    )
