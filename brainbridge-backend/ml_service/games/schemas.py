# games/schemas.py
# ─────────────────────────────────────────────
# BrainBridge — Raw Game Event Schemas
# These represent EXACTLY what React sends
# after each game is completed.
# ─────────────────────────────────────────────

from pydantic import BaseModel, Field
from typing import List, Literal


# ── Single question event ─────────────────────
class QuestionEvent(BaseModel):
    question_id:   int
    time_ms:       float = Field(..., ge=0,    description="Time taken to answer in ms")
    is_correct:    bool
    was_skipped:   bool  = False


# ── Letter Mirror Game ────────────────────────
# Child sees a letter and picks the correct one
# Tests: b/d/p/q confusion, phonetic decoding
class LetterMirrorQuestion(BaseModel):
    question_id:    int
    shown_letter:   str   = Field(..., description="Letter shown to child e.g. 'b'")
    selected_letter:str   = Field(..., description="Letter child picked e.g. 'd'")
    time_ms:        float = Field(..., ge=0)
    was_skipped:    bool  = False

    @property
    def is_correct(self) -> bool:
        return self.shown_letter == self.selected_letter

    @property
    def is_mirror_reversal(self) -> bool:
        # Classic dyslexia reversals
        mirror_pairs = {("b","d"), ("d","b"), ("p","q"), ("q","p")}
        return (self.shown_letter, self.selected_letter) in mirror_pairs


class LetterMirrorGameRaw(BaseModel):
    game_id:    Literal["letter_mirror"]  = "letter_mirror"
    questions:  List[LetterMirrorQuestion] = Field(..., min_items=4, max_items=4)
    duration_ms: float  = Field(..., ge=0, description="Total game duration")


# ── Focus Catcher Game ────────────────────────
# Child taps a moving target as fast as possible
# Tests: attention persistence, impulsivity, task switching
class FocusCatcherQuestion(BaseModel):
    question_id:         int
    target_appeared_ms:  float  = Field(..., ge=0, description="When target appeared")
    child_tapped_ms:     float  = Field(..., ge=0, description="When child tapped")
    was_premature_tap:   bool   = Field(...,        description="Tapped before target appeared")
    task_switched:       bool   = Field(...,        description="Was this a task-switch question")
    task_switch_correct: bool   = False
    was_skipped:         bool   = False

    @property
    def reaction_time_ms(self) -> float:
        if self.was_premature_tap:
            return 0.0
        return max(0.0, self.child_tapped_ms - self.target_appeared_ms)

    @property
    def is_correct(self) -> bool:
        return not self.was_premature_tap and not self.was_skipped


class FocusCatcherGameRaw(BaseModel):
    game_id:     Literal["focus_catcher"] = "focus_catcher"
    questions:   List[FocusCatcherQuestion] = Field(..., min_items=4, max_items=4)
    duration_ms: float = Field(..., ge=0)


# ── Number Jump Game ──────────────────────────
# Child sees dots/numbers and picks the larger group
# Tests: quantity estimation, digit recognition, counting
class NumberJumpQuestion(BaseModel):
    question_id:        int
    shown_quantity_a:   int   = Field(..., ge=1, description="First quantity shown")
    shown_quantity_b:   int   = Field(..., ge=1, description="Second quantity shown")
    selected_answer:    int   = Field(...,       description="Quantity child selected")
    correct_answer:     int   = Field(...,       description="Actual correct quantity")
    shown_as_digits:    bool  = Field(...,       description="True=digits shown, False=dots")
    time_ms:            float = Field(..., ge=0)
    was_skipped:        bool  = False

    @property
    def is_correct(self) -> bool:
        return self.selected_answer == self.correct_answer

    @property
    def estimation_error(self) -> float:
        # Weber fraction: how far off was the estimate
        if self.correct_answer == 0:
            return 0.0
        return abs(self.selected_answer - self.correct_answer) / self.correct_answer


# ── Master Raw Payload ────────────────────────
# This is the FULL object React sends to Node.js
class NumberJumpGameRaw(BaseModel):
    game_id:     Literal["number_jump"] = "number_jump"
    questions:   List[NumberJumpQuestion] = Field(..., min_items=4, max_items=4)
    duration_ms: float = Field(..., ge=0)


class RawGamePayload(BaseModel):
    """
    Master payload sent from React → Node.js
    after all games are completed.
    """
    child_age:                int   = Field(..., ge=3, le=7)
    session_id:               str   = Field(..., description="Anonymous session UUID")
    language:                 str   = Field(..., description="e.g. 'hindi', 'tamil'")
    letter_mirror:            LetterMirrorGameRaw
    focus_catcher:            FocusCatcherGameRaw
    number_jump:              NumberJumpGameRaw
    session_completion_rate:  float = Field(..., ge=0.0, le=1.0)
