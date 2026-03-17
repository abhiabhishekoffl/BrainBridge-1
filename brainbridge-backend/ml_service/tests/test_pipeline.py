# tests/test_pipeline.py
# ─────────────────────────────────────────────
# BrainBridge — Pipeline Tests
# Run: python tests/test_pipeline.py
# ─────────────────────────────────────────────

import sys
sys.path.append(".")

from games.schemas import (
    RawGamePayload,
    LetterMirrorGameRaw, LetterMirrorQuestion,
    FocusCatcherGameRaw, FocusCatcherQuestion,
    NumberJumpGameRaw,   NumberJumpQuestion,
)
from pipeline.feature_pipeline import run_feature_pipeline


def make_test_payload(child_age=5, at_risk=True) -> RawGamePayload:
    """
    Builds a realistic test payload.
    at_risk=True  → simulates a child showing risk signals
    at_risk=False → simulates a typical child
    """

    # ── Letter Mirror: 4 questions ─────────────
    if at_risk:
        lm_questions = [
            LetterMirrorQuestion(question_id=1, shown_letter="b", selected_letter="d", time_ms=1900),  # WRONG mirror
            LetterMirrorQuestion(question_id=2, shown_letter="p", selected_letter="q", time_ms=2100),  # WRONG mirror
            LetterMirrorQuestion(question_id=3, shown_letter="d", selected_letter="b", time_ms=1800),  # WRONG mirror
            LetterMirrorQuestion(question_id=4, shown_letter="q", selected_letter="q", time_ms=2300),  # correct
        ]
    else:
        lm_questions = [
            LetterMirrorQuestion(question_id=1, shown_letter="b", selected_letter="b", time_ms=850),
            LetterMirrorQuestion(question_id=2, shown_letter="p", selected_letter="p", time_ms=900),
            LetterMirrorQuestion(question_id=3, shown_letter="d", selected_letter="d", time_ms=820),
            LetterMirrorQuestion(question_id=4, shown_letter="q", selected_letter="q", time_ms=870),
        ]

    # ── Focus Catcher: 4 questions ─────────────
    if at_risk:
        fc_questions = [
            FocusCatcherQuestion(question_id=1, target_appeared_ms=1000, child_tapped_ms=800,  was_premature_tap=True,  task_switched=False, task_switch_correct=False),
            FocusCatcherQuestion(question_id=2, target_appeared_ms=2000, child_tapped_ms=3800, was_premature_tap=False, task_switched=True,  task_switch_correct=False),
            FocusCatcherQuestion(question_id=3, target_appeared_ms=3000, child_tapped_ms=2800, was_premature_tap=True,  task_switched=False, task_switch_correct=False),
            FocusCatcherQuestion(question_id=4, target_appeared_ms=4000, child_tapped_ms=5900, was_premature_tap=False, task_switched=True,  task_switch_correct=False),
        ]
    else:
        fc_questions = [
            FocusCatcherQuestion(question_id=1, target_appeared_ms=1000, child_tapped_ms=1850, was_premature_tap=False, task_switched=False, task_switch_correct=True),
            FocusCatcherQuestion(question_id=2, target_appeared_ms=2000, child_tapped_ms=2900, was_premature_tap=False, task_switched=True,  task_switch_correct=True),
            FocusCatcherQuestion(question_id=3, target_appeared_ms=3000, child_tapped_ms=3850, was_premature_tap=False, task_switched=False, task_switch_correct=True),
            FocusCatcherQuestion(question_id=4, target_appeared_ms=4000, child_tapped_ms=4900, was_premature_tap=False, task_switched=True,  task_switch_correct=True),
        ]

    # ── Number Jump: 4 questions ───────────────
    if at_risk:
        nj_questions = [
            NumberJumpQuestion(question_id=1, shown_quantity_a=6,  shown_quantity_b=9,  selected_answer=6,  correct_answer=9,  shown_as_digits=True,  time_ms=2100),
            NumberJumpQuestion(question_id=2, shown_quantity_a=3,  shown_quantity_b=7,  selected_answer=3,  correct_answer=7,  shown_as_digits=False, time_ms=1900),
            NumberJumpQuestion(question_id=3, shown_quantity_a=12, shown_quantity_b=21, selected_answer=12, correct_answer=21, shown_as_digits=True,  time_ms=2400),
            NumberJumpQuestion(question_id=4, shown_quantity_a=4,  shown_quantity_b=8,  selected_answer=4,  correct_answer=8,  shown_as_digits=False, time_ms=2000),
        ]
    else:
        nj_questions = [
            NumberJumpQuestion(question_id=1, shown_quantity_a=6,  shown_quantity_b=9,  selected_answer=9,  correct_answer=9,  shown_as_digits=True,  time_ms=880),
            NumberJumpQuestion(question_id=2, shown_quantity_a=3,  shown_quantity_b=7,  selected_answer=7,  correct_answer=7,  shown_as_digits=False, time_ms=820),
            NumberJumpQuestion(question_id=3, shown_quantity_a=12, shown_quantity_b=21, selected_answer=21, correct_answer=21, shown_as_digits=True,  time_ms=950),
            NumberJumpQuestion(question_id=4, shown_quantity_a=4,  shown_quantity_b=8,  selected_answer=8,  correct_answer=8,  shown_as_digits=False, time_ms=860),
        ]

    return RawGamePayload(
        child_age               = child_age,
        session_id              = "test-session-001",
        language                = "hindi",
        session_completion_rate = 1.0,
        letter_mirror  = LetterMirrorGameRaw(questions=lm_questions,  duration_ms=8000),
        focus_catcher  = FocusCatcherGameRaw(questions=fc_questions,  duration_ms=9000),
        number_jump    = NumberJumpGameRaw(questions=nj_questions,     duration_ms=7500),
    )


def test_pipeline():
    print("=" * 50)
    print("TEST 1 — At-Risk Child (age 5)")
    print("=" * 50)
    payload = make_test_payload(child_age=5, at_risk=True)
    out     = run_feature_pipeline(payload)

    print(f"\n📊 Letter Mirror Features:")
    print(f"  letter_reversal_rate:       {out.letter_mirror_features.letter_reversal_rate}")
    print(f"  mirror_reversal_rate:       {out.letter_mirror_features.mirror_reversal_rate}")
    print(f"  phonetic_decoding_accuracy: {out.letter_mirror_features.phonetic_decoding_accuracy}")
    print(f"  response_time_ms:           {out.letter_mirror_features.response_time_ms}")

    print(f"\n🎯 Focus Catcher Features:")
    print(f"  attention_persistence_score:{out.focus_catcher_features.attention_persistence_score}")
    print(f"  impulsivity_rate:           {out.focus_catcher_features.impulsivity_rate}")
    print(f"  task_switch_error_rate:     {out.focus_catcher_features.task_switch_error_rate}")
    print(f"  reaction_time_variability:  {out.focus_catcher_features.reaction_time_variability}")

    print(f"\n🔢 Number Jump Features:")
    print(f"  quantity_estimation_error:  {out.number_jump_features.quantity_estimation_error}")
    print(f"  digit_reversal_rate:        {out.number_jump_features.digit_reversal_rate}")
    print(f"  subitizing_accuracy:        {out.number_jump_features.subitizing_accuracy}")

    print(f"\n✅ Pipeline metadata:")
    print(f"  age_weight:      {out.age_weight}")
    print(f"  confidence:      {out.confidence_level}")
    print(f"  is_reliable:     {out.is_reliable}")

    print("\n" + "=" * 50)
    print("TEST 2 — Typical Child (age 6)")
    print("=" * 50)
    payload2 = make_test_payload(child_age=6, at_risk=False)
    out2     = run_feature_pipeline(payload2)
    print(f"  letter_reversal_rate:  {out2.letter_mirror_features.letter_reversal_rate}  (expect ~0.0)")
    print(f"  impulsivity_rate:      {out2.focus_catcher_features.impulsivity_rate}  (expect ~0.0)")
    print(f"  digit_reversal_rate:   {out2.number_jump_features.digit_reversal_rate}  (expect ~0.0)")
    print("\n✅ All tests passed!")


if __name__ == "__main__":
    test_pipeline()
