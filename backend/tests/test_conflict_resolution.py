import pytest
import uuid
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.base import Base
from app.models.session import ClinicalAnswer, IntakeSession, ClinicalConflict, ConversationTurn
from app.models.patient import Patient, Encounter
from app.services.conflict_resolution import ConflictDetector

@pytest.fixture
def db_session():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    TestingSessionLocal = sessionmaker(bind=engine)
    db = TestingSessionLocal()
    yield db
    db.close()

def test_conflict_true_contradiction(db_session):
    pat = Patient(full_name="Test", age=30, sex="Male")
    db_session.add(pat)
    db_session.commit()
    
    enc = Encounter(patient_id=pat.id, opd_id="123")
    db_session.add(enc)
    db_session.commit()
    
    sess = IntakeSession(encounter_id=enc.id, public_token="abc", state="INTERVIEW", language="en")
    db_session.add(sess)
    db_session.commit()
    
    turn = ConversationTurn(session_id=sess.id, turn_number=1, raw_text="test", language="en")
    db_session.add(turn)
    db_session.commit()

    fact1 = ClinicalAnswer(
        turn_id=turn.id,
        slot="medical_history",
        value={"condition": "Diabetes", "status": "current"},
        status="AI_NORMALIZED",
        confidence=1.0,
        is_approximate=False
    )
    fact2 = ClinicalAnswer(
        turn_id=turn.id,
        slot="medical_history",
        value={"condition": "Diabetes", "status": "negated"},
        status="AI_NORMALIZED",
        confidence=1.0,
        is_approximate=False
    )
    db_session.add_all([fact1, fact2])
    db_session.commit()

    conflicts = ConflictDetector.detect_conflicts(db_session, sess.id)
    assert len(conflicts) == 1
    assert conflicts[0].slot == "medical_history"
    assert conflicts[0].relationship_status == "UNRESOLVED"

def test_conflict_historical_vs_current(db_session):
    sess_id = uuid.uuid4()
    turn = ConversationTurn(session_id=sess_id, turn_number=1, raw_text="test", language="en")
    db_session.add(turn)
    db_session.commit()
    
    fact1 = ClinicalAnswer(
        turn_id=turn.id,
        slot="medical_history",
        value={"condition": "Asthma", "status": "historical"},
        status="AI_NORMALIZED",
        confidence=1.0,
        is_approximate=False
    )
    fact2 = ClinicalAnswer(
        turn_id=turn.id,
        slot="medical_history",
        value={"condition": "Asthma", "status": "current"},
        status="AI_NORMALIZED",
        confidence=1.0,
        is_approximate=False
    )
    db_session.add_all([fact1, fact2])
    db_session.commit()

    conflicts = ConflictDetector.detect_conflicts(db_session, sess_id)
    assert len(conflicts) == 1

def test_conflict_duplicate_rephrased(db_session):
    sess_id = uuid.uuid4()
    turn = ConversationTurn(session_id=sess_id, turn_number=1, raw_text="test", language="en")
    db_session.add(turn)
    db_session.commit()
    
    fact1 = ClinicalAnswer(
        turn_id=turn.id,
        slot="chief_complaint",
        value={"symptom": "headache", "status": "current"},
        status="AI_NORMALIZED",
        confidence=1.0,
        is_approximate=False
    )
    fact2 = ClinicalAnswer(
        turn_id=turn.id,
        slot="chief_complaint",
        value={"symptom": "severe head pain", "status": "current"},
        status="AI_NORMALIZED",
        confidence=1.0,
        is_approximate=False
    )
    db_session.add_all([fact1, fact2])
    db_session.commit()

    conflicts = ConflictDetector.detect_conflicts(db_session, sess_id)
    assert len(conflicts) == 1
