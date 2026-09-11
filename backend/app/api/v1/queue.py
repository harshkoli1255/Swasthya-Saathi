from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Annotated

from app.core.database import get_db
from app.api.v1.auth import require_doctor
from app.models.user import User
from app.models.patient import Patient, Encounter
from app.schemas.common import QueuePatientCard

router = APIRouter(prefix="/queue", tags=["queue"])


@router.get("", response_model=list[QueuePatientCard], summary="Get patient queue for the doctor")
def get_queue(
    current_user: Annotated[User, Depends(require_doctor)],
    db: Session = Depends(get_db),
) -> list[QueuePatientCard]:
    """
    Returns the list of patients waiting for review, sorted by triage level then wait time.
    EMERGENCY → URGENT → ROUTINE, then oldest first within each level.
    """
    encounters = (
        db.query(Encounter)
        .join(Patient, Encounter.patient_id == Patient.id)
        .filter(
            Encounter.status.in_([
                "READY_FOR_DOCTOR", "INTAKE_IN_PROGRESS", "REGISTERED", "UNDER_REVIEW"
            ]),
            Patient.is_deleted == False,
        )
        .all()
    )

    triage_order = {"EMERGENCY": 0, "URGENT": 1, "ROUTINE": 2}
    encounters.sort(key=lambda e: (triage_order.get(e.triage_level, 2), e.created_at))

    now = datetime.now(timezone.utc)
    cards = []
    for enc in encounters:
        created = enc.created_at
        if created.tzinfo is None:
            created = created.replace(tzinfo=timezone.utc)
        wait_minutes = int((now - created).total_seconds() / 60)

        # Attempt to get chief_complaint from intake session
        cc_val = None
        if enc.intake_session:
            from app.models.session import ClinicalAnswer
            ans = db.query(ClinicalAnswer).join(ClinicalAnswer.turn).filter(
                ClinicalAnswer.turn.has(session_id=enc.intake_session.id),
                ClinicalAnswer.slot == "chief_complaint"
            ).first()
            if ans and isinstance(ans.value, dict):
                cc_val = ans.value.get("symptom", None)

        # Skip encounters with broken patient relationships (e.g. orphaned test data)
        if enc.patient is None:
            continue

        cards.append(
            QueuePatientCard(
                encounter_id=enc.id,
                opd_id=enc.opd_id,
                patient_name=enc.patient.full_name,
                patient_age=enc.patient.age,
                patient_sex=enc.patient.sex,
                chief_complaint=cc_val,
                triage_level=enc.triage_level,
                status=enc.status,
                wait_minutes=wait_minutes,
                created_at=enc.created_at,
            )
        )
    return cards
