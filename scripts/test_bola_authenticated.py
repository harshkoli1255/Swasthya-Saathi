import asyncio
import uuid
import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '../backend'))

from fastapi.testclient import TestClient
from app.main import app
from app.core.database import SessionLocal
from app.models.base import Base
from app.models.patient import Patient, Encounter
from app.models.session import IntakeSession, ClinicalConflict, SafetyAlert
from app.models.user import User
from app.models.export import FHIRExportRecord

client = TestClient(app)

def run_bola_tests():
    from app.core.database import engine
    Base.metadata.create_all(engine)
    db = SessionLocal()
    try:
        # Create user
        doc = User(username="dr.bola", full_name="Dr Bola", password_hash="hash", role="doctor")
        db.add(doc)
        db.commit()

        # Create Patient A and Encounter A
        pat_a = Patient(full_name="Patient A", age=30, sex="Male")
        db.add(pat_a)
        db.commit()
        enc_a = Encounter(patient_id=pat_a.id, opd_id="OPD-A", status="UNDER_REVIEW")
        db.add(enc_a)
        db.commit()
        sess_a = IntakeSession(encounter_id=enc_a.id, public_token="token-A", state="INTERVIEW", language="en")
        db.add(sess_a)
        db.commit()
        alert_a = SafetyAlert(session_id=sess_a.id, rule_id="R-1", alert_category="TEST", deterministic_explanation="Test", matched_fact_ids=[], evidence_ids=[])
        db.add(alert_a)
        db.commit()

        # Create Patient B and Encounter B
        pat_b = Patient(full_name="Patient B", age=40, sex="Female")
        db.add(pat_b)
        db.commit()
        enc_b = Encounter(patient_id=pat_b.id, opd_id="OPD-B", status="UNDER_REVIEW")
        db.add(enc_b)
        db.commit()

        print("Testing BOLA: Accessing Alert A through Encounter B...")
        
        # We must override dependency for require_doctor so it authenticates us
        from app.api.v1.auth import require_doctor
        app.dependency_overrides[require_doctor] = lambda: doc

        # Try to resolve Alert A using Encounter B's endpoint
        response = client.patch(
            f"/api/v1/encounters/{enc_b.id}/alerts/{alert_a.id}/acknowledge",
            json={"status": "REVIEWED_AND_DISMISSED"}
        )
        
        if response.status_code == 403:
            print("PASS - BOLA properly mitigated. Received 403 Forbidden.")
        else:
            print(f"FAIL - Received {response.status_code}")
            sys.exit(1)
            
    finally:
        db.close()

if __name__ == "__main__":
    run_bola_tests()
