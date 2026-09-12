import pytest
import uuid
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import get_db
from app.models.base import Base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.patient import Patient, Encounter
from app.models.session import IntakeSession, ClinicalConflict, SafetyAlert
from app.models.user import User
from app.models.audit import AuditLog

from sqlalchemy.pool import StaticPool

engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(bind=engine)
Base.metadata.create_all(engine)

def override_get_db():
    db = TestingSessionLocal()
    yield db
    db.close()

# Global dependency override removed to prevent leaking. It is handled by the fixture now.
from app.api.v1.auth import require_doctor
client = TestClient(app)

@pytest.fixture
def test_db():
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    
    def override_get_db():
        db = TestingSessionLocal()
        yield db
        db.close()
        
    db = TestingSessionLocal()
    mock_user = User(
        id=uuid.uuid4(),
        username=f"dr.test_{uuid.uuid4().hex[:4]}",
        password_hash="hashed_pw",
        full_name="Dr. Test",
        role="DOCTOR",
        is_active=True
    )
    db.add(mock_user)
    db.commit()

    async def mock_require_doctor():
        return mock_user
        
    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[require_doctor] = mock_require_doctor
    
    yield (db, mock_user)
    db.close()
    
    app.dependency_overrides.clear()

def test_resolve_conflict_endpoint(test_db):
    db, mock_user = test_db
    pat = Patient(full_name="Test", age=30, sex="Male")
    db.add(pat)
    db.commit()
    
    enc = Encounter(patient_id=pat.id, opd_id="123", doctor_id=mock_user.id, status="UNDER_REVIEW")
    db.add(enc)
    db.commit()
    
    sess = IntakeSession(encounter_id=enc.id, public_token="abc", state="INTERVIEW", language="en")
    db.add(sess)
    db.commit()

    conflict = ClinicalConflict(
        session_id=sess.id,
        slot="medical_history",
        fact_id_1=uuid.uuid4(),
        fact_id_2=uuid.uuid4(),
        relationship_status="UNRESOLVED"
    )
    db.add(conflict)
    db.commit()

    response = client.patch(
        f"/api/v1/encounters/{enc.id}/conflicts/{conflict.id}/resolve",
        json={"relationship_status": "RESOLVED", "resolution_notes": "All good"}
    )
    
    assert response.status_code == 200
    
    # Verify DB update
    db.refresh(conflict)
    assert conflict.relationship_status == "RESOLVED"
    assert conflict.resolution_notes == "All good"
    
    # Verify AuditLog
    from app.models.audit import AuditLog
    audit = db.query(AuditLog).filter(AuditLog.entity_id == conflict.id).first()
    assert audit is not None
    assert audit.edit_type == "UPDATE"
    assert audit.after_state["relationship_status"] == "RESOLVED"

def test_acknowledge_alert_endpoint(test_db):
    db, mock_user = test_db
    pat = Patient(full_name="Test", age=30, sex="Male")
    db.add(pat)
    db.commit()
    
    enc = Encounter(patient_id=pat.id, opd_id="123", doctor_id=mock_user.id, status="UNDER_REVIEW")
    db.add(enc)
    db.commit()
    
    sess = IntakeSession(encounter_id=enc.id, public_token="abc", state="INTERVIEW", language="en")
    db.add(sess)
    db.commit()

    alert = SafetyAlert(
        session_id=sess.id,
        rule_id="RF-001",
        alert_category="CHEST_PAIN",
        deterministic_explanation="Test",
        status="DEMO_PENDING_CLINICAL_REVIEW",
        matched_fact_ids=[],
        evidence_ids=[]
    )
    db.add(alert)
    db.commit()

    response = client.patch(
        f"/api/v1/encounters/{enc.id}/alerts/{alert.id}/acknowledge",
        json={"status": "REVIEWED_AND_DISMISSED"}
    )
    
    assert response.status_code == 200
    
    db.refresh(alert)
    assert alert.status == "REVIEWED_AND_DISMISSED"
    
    from app.models.audit import AuditLog
    audit = db.query(AuditLog).filter(AuditLog.entity_id == alert.id).first()
    assert audit is not None
    assert audit.after_state["status"] == "REVIEWED_AND_DISMISSED"
