import pytest
import uuid
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.base import Base
from app.models.session import ClinicalAnswer, IntakeSession, ConversationTurn
from app.models.patient import Patient, Encounter
from app.services.timeline_builder import TimelineBuilder

@pytest.fixture
def db_session():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    TestingSessionLocal = sessionmaker(bind=engine)
    db = TestingSessionLocal()
    yield db
    db.close()

def test_timeline_builder_sorting(db_session):
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

    # Fact 1: Current visit
    fact1 = ClinicalAnswer(
        turn_id=turn.id,
        slot="chief_complaint",
        value={"symptom": "fever"},
        status="AI_NORMALIZED",
        confidence=1.0,
        is_approximate=False
    )
    # Fact 2: Historical (2015)
    fact2 = ClinicalAnswer(
        turn_id=turn.id,
        slot="medical_history",
        value={"condition": "Asthma", "status": "historical"},
        patient_reported_date="2015-01-01",
        status="AI_NORMALIZED",
        confidence=1.0,
        is_approximate=False
    )
    # Fact 3: Relative duration
    fact3 = ClinicalAnswer(
        turn_id=turn.id,
        slot="chief_complaint",
        value={"symptom": "headache"},
        relative_duration="3 days",
        status="AI_NORMALIZED",
        confidence=1.0,
        is_approximate=True
    )
    db_session.add_all([fact1, fact2, fact3])
    db_session.commit()

    timeline = TimelineBuilder.build_timeline(db_session, sess.id)
    assert len(timeline) == 3
    
    # 0 = Historical, 1 = Duration, 2 = Current
    assert timeline[0]["event_date"] == "2015-01-01"
    assert timeline[1]["event_date"] == "Duration: 3 days"
    assert timeline[1]["is_approximate"] == True
    assert timeline[2]["event_date"] == "Current Visit"
