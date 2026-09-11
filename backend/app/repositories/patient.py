import uuid
from sqlalchemy.orm import Session
from app.models.patient import Patient, Encounter

class PatientRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, patient_id: uuid.UUID) -> Patient | None:
        return self.db.query(Patient).filter(Patient.id == patient_id, Patient.is_deleted == False).first()

    def create(self, patient: Patient) -> Patient:
        self.db.add(patient)
        self.db.commit()
        self.db.refresh(patient)
        return patient

class EncounterRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, encounter_id: uuid.UUID) -> Encounter | None:
        return self.db.query(Encounter).filter(Encounter.id == encounter_id).first()

    def create(self, encounter: Encounter) -> Encounter:
        self.db.add(encounter)
        self.db.commit()
        self.db.refresh(encounter)
        return encounter
