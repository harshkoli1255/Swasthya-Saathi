import pytest
import uuid
from fastapi.testclient import TestClient
from app.models.patient import Patient, Encounter
from app.models.user import User
from app.models.session import ClinicalAnswer, IntakeSession, ClinicalConflict, SafetyAlert
from app.services.export_gating import ExportEligibilityEvaluator
from app.services.fhir_mapper import FHIRMapper

from app.main import app
from app.core.database import get_db
from app.models.base import Base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.api.v1.auth import require_doctor

engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False}, poolclass=StaticPool)
TestingSessionLocal = sessionmaker(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    yield db
    db.close()

async def mock_require_doctor():
    return User(id=uuid.uuid4(), username="dr.test", role="doctor")

app.dependency_overrides[require_doctor] = mock_require_doctor
client = TestClient(app)

@pytest.fixture
def test_db():
    Base.metadata.create_all(engine)
    
    def override_get_db():
        db = TestingSessionLocal()
        yield db
        db.close()
        
    app.dependency_overrides[get_db] = override_get_db
    
    db = TestingSessionLocal()
    yield db
    db.close()
    
    app.dependency_overrides.pop(get_db, None)
    Base.metadata.drop_all(engine)

def test_export_eligibility_evaluator(test_db):
    db_session = test_db
    # Setup test data
    patient = Patient(full_name="Test Patient", abha_number="1234")
    db_session.add(patient)
    db_session.commit()
    
    encounter = Encounter(patient_id=patient.id, opd_id="OPD-123", status="UNDER_REVIEW")
    db_session.add(encounter)
    db_session.commit()
    
    intake = IntakeSession(encounter_id=encounter.id, public_token="token1", state="COMPLETED", language="en")
    db_session.add(intake)
    db_session.commit()
    
    # Create a turn
    from app.models.session import ConversationTurn
    turn = ConversationTurn(session_id=intake.id, turn_number=1, raw_text="text", language="en")
    db_session.add(turn)
    db_session.commit()
    
    # Facts: 1 AI_NORMALIZED, 1 PHYSICIAN_VERIFIED, 1 PATIENT_CONFIRMED with conflict
    f1 = ClinicalAnswer(turn_id=turn.id, slot="current_symptom", value="Headache", status="AI_NORMALIZED", confidence=0.9)
    f2 = ClinicalAnswer(turn_id=turn.id, slot="current_symptom", value="Fever", status="PHYSICIAN_VERIFIED", confidence=0.9)
    f3 = ClinicalAnswer(turn_id=turn.id, slot="current_symptom", value="Cough", status="PATIENT_CONFIRMED", confidence=0.9)
    f4 = ClinicalAnswer(turn_id=turn.id, slot="current_symptom", value="Sneeze", status="PATIENT_CONFIRMED", confidence=0.9)
    
    db_session.add_all([f1, f2, f3, f4])
    db_session.commit()
    
    # Unresolved conflict blocking f3 and f4
    c1 = ClinicalConflict(session_id=intake.id, slot="current_symptom", fact_id_1=f3.id, fact_id_2=f4.id, relationship_status="UNRESOLVED")
    db_session.add(c1)
    db_session.commit()
    
    # Evaluate
    report = ExportEligibilityEvaluator.evaluate(str(encounter.id), db_session)
    
    assert report["unresolved_conflicts"] == 1
    assert len(report["eligible_resources"]) == 1 # Only Fever (f2)
    assert report["eligible_resources"][0]["fact_id"] == str(f2.id)
    assert report["eligible_resources"][0]["mapping"]["code"] == "386661006" # Fever mapping
    
    assert len(report["blocked_resources"]) == 3
    blocked_ids = [r["fact_id"] for r in report["blocked_resources"]]
    assert str(f1.id) in blocked_ids # AI_NORMALIZED
    assert str(f3.id) in blocked_ids # Conflict
    assert str(f4.id) in blocked_ids # Conflict

def test_fhir_mapper_structure(test_db):
    db_session = test_db
    # Setup patient & encounter
    patient = Patient(full_name="Test FHIR", sex="MALE")
    db_session.add(patient)
    db_session.commit()
    encounter = Encounter(patient_id=patient.id, opd_id="OPD-FHIR", status="UNDER_REVIEW")
    db_session.add(encounter)
    db_session.commit()
    intake = IntakeSession(encounter_id=encounter.id, public_token="token2", state="COMPLETED", language="en")
    db_session.add(intake)
    db_session.commit()
    
    # Create a turn
    from app.models.session import ConversationTurn
    turn = ConversationTurn(session_id=intake.id, turn_number=1, raw_text="text", language="en")
    db_session.add(turn)
    db_session.commit()
    
    # Verified facts
    f = ClinicalAnswer(turn_id=turn.id, slot="current_symptom", value="Nausea", status="PHYSICIAN_VERIFIED", confidence=0.9)
    db_session.add(f)
    db_session.commit()
    
    bundle = FHIRMapper.build_fhir_bundle(str(encounter.id), db_session)
    
    # Bundle type check
    assert bundle["resourceType"] == "Bundle"
    assert bundle["type"] == "document"
    
    entries = bundle["entry"]
    assert len(entries) >= 5 # Comp, Pat, Enc, Prac, Obs, Prov
    
    # Composition MUST be first
    assert entries[0]["resource"]["resourceType"] == "Composition"
    assert entries[0]["resource"]["subject"]["reference"] == f"Patient/{patient.id}"
    
    # Check Observation and Provenance
    resources = [e["resource"]["resourceType"] for e in entries]
    assert "Observation" in resources
    assert "Provenance" in resources
    
    # Find Provenance
    prov = next((e["resource"] for e in entries if e["resource"]["resourceType"] == "Provenance"), None)
    assert prov is not None
    assert prov["target"][0]["reference"] == f"Observation/{f.id}"
    assert prov["entity"][0]["what"]["identifier"]["value"] == str(f.id)

def test_abdm_mock_failures(test_db):
    db_session = test_db
    # Setup test user
    u = User(username="drtestfhir", full_name="Dr. Test", role="DOCTOR", password_hash="dummy")
    db_session.add(u)
    db_session.commit()
    
    # Test FAIL-500 ABHA
    p = Patient(full_name="Test Failure", abha_number="FAIL-500")
    db_session.add(p)
    db_session.commit()
    
    enc = Encounter(patient_id=p.id, opd_id="OPD-FAIL", status="UNDER_REVIEW")
    db_session.add(enc)
    db_session.commit()
    
    intake = IntakeSession(encounter_id=enc.id, public_token="token3", state="COMPLETED", language="en")
    db_session.add(intake)
    db_session.commit()
    
    from app.models.session import ConversationTurn
    turn = ConversationTurn(session_id=intake.id, turn_number=1, raw_text="text", language="en")
    db_session.add(turn)
    db_session.commit()
    
    f = ClinicalAnswer(turn_id=turn.id, slot="current_symptom", value="Fatigue", status="PHYSICIAN_VERIFIED", confidence=0.9)
    db_session.add(f)
    db_session.commit()
    
    app.dependency_overrides[require_doctor] = mock_require_doctor
    res = client.post(f"/api/v1/encounters/{enc.id}/export-fhir", headers={"Authorization": "Bearer fake_token"})
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "failed"
    assert data["code"] == "500"
    data = res.json()
    assert data["status"] == "failed"
    assert data["code"] == "500"
    
    # Check export records
    res2 = client.get(f"/api/v1/encounters/{enc.id}/export-records", headers={"Authorization": "Bearer fake_token"})
    records = res2.json()
    assert len(records) == 1
    assert records[0]["status"] == "FAILED"
    assert records[0]["failure_reason"] == "Simulated Gateway Timeout/Unavailable"
