import os
import sys
import uuid
import secrets

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.patient import Patient, Encounter
from app.models.session import IntakeSession

def seed_encounters(db: Session):
    import time
    timestamp = str(int(time.time()))
    cases = [
        {"name": f"Routine Ramesh {timestamp}", "triage": "ROUTINE", "age": 45, "sex": "Male"},
        {"name": f"Urgent Usha {timestamp}", "triage": "URGENT", "age": 62, "sex": "Female"},
        {"name": f"Emergency Esha {timestamp}", "triage": "EMERGENCY", "age": 28, "sex": "Female"},
    ]

    print("\n" + "="*50)
    print("SWASTHYASAATHI SYNTHETIC ENCOUNTERS SEEDED")
    print("="*50 + "\n")

    for idx, case in enumerate(cases):
        # Create Patient
        patient = Patient(
            full_name=case["name"],
            age=case["age"],
            sex=case["sex"],
            phone=f"987654321{idx}"
        )
        db.add(patient)
        db.flush()

        # Create Encounter
        opd_id = f"OPD-2026-09-{100+idx}"
        encounter = Encounter(
            opd_id=opd_id,
            patient_id=patient.id,
            triage_level=case["triage"],
            status="REGISTERED"
        )
        db.add(encounter)
        db.flush()

        # Create IntakeSession
        public_token = secrets.token_urlsafe(16)
        session = IntakeSession(
            encounter_id=encounter.id,
            public_token=public_token,
            state="CONSENT_PENDING",
            language="en"
        )
        db.add(session)
        db.flush()

        print(f"Patient: {case['name']} ({case['triage']})")
        print(f"OPD ID:  {opd_id}")
        print(f"INTAKE LINK: http://localhost:5173/intake/{public_token}\n")

    db.commit()

if __name__ == "__main__":
    db = SessionLocal()
    try:
        seed_encounters(db)
    finally:
        db.close()
