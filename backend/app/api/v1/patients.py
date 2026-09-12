from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Annotated

from app.core.database import get_db
from app.api.v1.auth import require_doctor
from app.models.user import User
from app.models.patient import Patient
from app.schemas.common import PatientCreate, PatientPublic

router = APIRouter(prefix="/patients", tags=["patients"])


@router.post("", response_model=PatientPublic, summary="Register a new patient")
def create_patient(
    payload: PatientCreate,
    current_user: Annotated[User, Depends(require_doctor)],
    db: Session = Depends(get_db),
) -> PatientPublic:
    """
    Registers a new patient. abha_id is optional and nullable.
    Called by front desk at patient arrival.
    """
    patient = Patient(
        full_name=payload.full_name,
        age=payload.age,
        sex=payload.sex,
        phone=payload.phone,
        abha_id=payload.abha_id,
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return PatientPublic.model_validate(patient)


@router.get("/{patient_id}", response_model=PatientPublic, summary="Get patient by ID")
def get_patient(
    patient_id: str,
    current_user: Annotated[User, Depends(require_doctor)],
    db: Session = Depends(get_db),
) -> PatientPublic:
    from app.core.exceptions import NotFoundError
    import uuid
    patient = db.query(Patient).filter(
        Patient.id == uuid.UUID(patient_id), Patient.is_deleted == False
    ).first()
    if not patient:
        raise NotFoundError("Patient", patient_id)
    return PatientPublic.model_validate(patient)
