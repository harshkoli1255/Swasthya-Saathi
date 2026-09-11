import pytest
import uuid
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.base import Base
from app.models.session import ClinicalAnswer, IntakeSession, SafetyAlert
from app.models.patient import Patient, Encounter
from app.services.safety_engine import SafetyEngine

@pytest.fixture
def db_session():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    TestingSessionLocal = sessionmaker(bind=engine)
    db = TestingSessionLocal()
    yield db
    db.close()

def test_safety_engine_positive_red_flag(db_session):
    pat = Patient(full_name="Test", age=30, sex="Male")
    db_session.add(pat)
    db_session.commit()
    
    enc = Encounter(patient_id=pat.id, opd_id="123")
    db_session.add(enc)
    db_session.commit()
    
    sess = IntakeSession(encounter_id=enc.id, public_token="abc", state="INTERVIEW", language="en")
    db_session.add(sess)
    db_session.commit()

    fact = ClinicalAnswer(
        turn_id=uuid.uuid4(),
        slot="chief_complaint",
        value={"symptom": "severe chest pain"},
        status="AI_NORMALIZED",
        confidence=1.0,
        is_approximate=False
    )
    db_session.add(fact)
    db_session.commit()

    alerts = SafetyEngine.evaluate_facts(db_session, sess.id, [fact])
    assert len(alerts) == 1
    assert alerts[0].rule_id == "RF-001"
    assert alerts[0].status == "DEMO_PENDING_CLINICAL_REVIEW"
    assert alerts[0].deterministic_explanation == "Patient reported symptoms associated with chest discomfort, requiring urgent clinical review."

def test_safety_engine_negated(db_session):
    sess_id = uuid.uuid4()
    fact = ClinicalAnswer(
        turn_id=uuid.uuid4(),
        slot="chief_complaint",
        value={"symptom": "no chest pain", "status": "negated"},
        status="AI_NORMALIZED",
        confidence=1.0,
        is_approximate=False
    )
    db_session.add(fact)
    db_session.commit()

    alerts = SafetyEngine.evaluate_facts(db_session, sess_id, [fact])
    assert len(alerts) == 0

def test_safety_engine_historical(db_session):
    sess_id = uuid.uuid4()
    fact = ClinicalAnswer(
        turn_id=uuid.uuid4(),
        slot="medical_history",
        value={"symptom": "chest pain in 2010", "status": "historical"},
        status="AI_NORMALIZED",
        confidence=1.0,
        is_approximate=False
    )
    db_session.add(fact)
    db_session.commit()

    alerts = SafetyEngine.evaluate_facts(db_session, sess_id, [fact])
    assert len(alerts) == 0

def test_safety_engine_unrelated_substring(db_session):
    sess_id = uuid.uuid4()
    fact = ClinicalAnswer(
        turn_id=uuid.uuid4(),
        slot="chief_complaint",
        value={"symptom": "ate a chestnut"},
        status="AI_NORMALIZED",
        confidence=1.0,
        is_approximate=False
    )
    db_session.add(fact)
    db_session.commit()

    alerts = SafetyEngine.evaluate_facts(db_session, sess_id, [fact])
    # \bchest pain\b pattern should not match chestnut
    assert len(alerts) == 0

def test_safety_engine_multi_factor(db_session):
    sess_id = uuid.uuid4()
    fact1 = ClinicalAnswer(
        turn_id=uuid.uuid4(),
        slot="chief_complaint",
        value={"symptom": "chest pain"},
        status="AI_NORMALIZED",
        confidence=1.0,
        is_approximate=False
    )
    fact2 = ClinicalAnswer(
        turn_id=uuid.uuid4(),
        slot="chief_complaint",
        value={"symptom": "shortness of breath"},
        status="AI_NORMALIZED",
        confidence=1.0,
        is_approximate=False
    )
    db_session.add(fact1)
    db_session.add(fact2)
    db_session.commit()

    alerts = SafetyEngine.evaluate_facts(db_session, sess_id, [fact1, fact2])
    assert len(alerts) == 2
    rule_ids = {a.rule_id for a in alerts}
    assert "RF-001" in rule_ids
    assert "RF-002" in rule_ids
