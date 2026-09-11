from app.core.exceptions import InvalidStateTransitionError

# Placeholder for IntakeSession state machine

VALID_TRANSITIONS = {
    "CONSENT_PENDING": ["WELCOME"],
    "WELCOME": ["INTERVIEW"],
    "INTERVIEW": ["AYUSH", "DOCUMENTS", "REVIEW"],
    "AYUSH": ["DOCUMENTS", "REVIEW"],
    "DOCUMENTS": ["REVIEW"],
    "REVIEW": ["COMPLETED"],
    "COMPLETED": []
}

def transition_state(current_state: str, new_state: str) -> str:
    if new_state not in VALID_TRANSITIONS.get(current_state, []):
        raise InvalidStateTransitionError(current_state, new_state)
    return new_state
