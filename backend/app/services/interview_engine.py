from sqlalchemy.orm import Session
from typing import Optional
from app.models.session import IntakeSession, ClinicalQuestion, ClinicalAnswer

class SlotFillingEngine:
    """Manages the state of collected vs required slots for an IntakeSession."""
    
    @staticmethod
    def get_fulfilled_slots(db: Session, session_id: str) -> set[str]:
        """Returns a set of slot names that have been answered for this session."""
        answers = db.query(ClinicalAnswer).join(ClinicalAnswer.turn).filter(
            ClinicalAnswer.turn.has(session_id=session_id),
            ClinicalAnswer.status.in_(["AI_NORMALIZED", "DETERMINISTIC_NORMALIZED", "RAW_INPUT", "PATIENT_CONFIRMED", "PATIENT_REPORTED"])
        ).all()
        return {ans.slot for ans in answers}


class NextQuestionSelector:
    """Deterministically selects the next question based on missing slots."""

    @staticmethod
    def get_next_question(db: Session, session: IntakeSession) -> Optional[ClinicalQuestion]:
        """
        Evaluate fulfilled slots and return the highest priority missing question.
        Returns None if all questions in the active phase are fulfilled.
        """
        fulfilled_slots = SlotFillingEngine.get_fulfilled_slots(db, session.id)

        # Get all active questions ordered by priority
        # Lower number = higher priority (e.g., 10 > 20)
        # Select questions across active intake phases in priority order (GENERAL, then AYUSH)
        all_questions = db.query(ClinicalQuestion).filter(
            ClinicalQuestion.phase.in_(["GENERAL", "AYUSH"])
        ).order_by(ClinicalQuestion.priority.asc()).all()

        for question in all_questions:
            # If this question's target slot is already fulfilled, skip it
            if question.targets_slot in fulfilled_slots:
                continue
                
            # Check if this question's prerequisites (required_slots) are met
            prereqs_met = all(req in fulfilled_slots for req in question.required_slots)
            
            if prereqs_met:
                return question
                
        # If no question is available, we are done with the phase
        return None
