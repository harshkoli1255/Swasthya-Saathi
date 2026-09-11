import pytest
import uuid
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.base import Base
from app.models.session import ClinicalAnswer, IntakeSession, ConversationTurn
from app.models.patient import Patient, Encounter
from app.services.summary_generator import SummaryGenerator
from app.schemas.clinical import StructuredSummaryResult, SummarySection

@pytest.fixture
def db_session():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    TestingSessionLocal = sessionmaker(bind=engine)
    db = TestingSessionLocal()
    yield db
    db.close()

class MockLLMProvider:
    def __init__(self, should_fail=False, fake_ids=False, valid_id=""):
        self.should_fail = should_fail
        self.fake_ids = fake_ids
        self.valid_id = valid_id

    def generate_structured_summary(self, prompt: str) -> StructuredSummaryResult:
        if self.should_fail:
            raise Exception("LLM connection failed")
            
        evidence_ids = ["fake-ev-123"] if self.fake_ids else [self.valid_id]
        return StructuredSummaryResult(
            sections=[
                SummarySection(text="Patient has headache", evidence_ids=evidence_ids)
            ]
        )

def setup_data(db_session):
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
    
    fact_id = uuid.uuid4()
    ev_id = uuid.uuid4()
    fact = ClinicalAnswer(
        id=fact_id,
        turn_id=turn.id,
        slot="chief_complaint",
        value={"symptom": "headache"},
        status="PATIENT_CONFIRMED", # Must be confirmed to be included!
        confidence=1.0,
        evidence_id=ev_id
    )
    db_session.add(fact)
    
    # Unconfirmed fact
    fact2 = ClinicalAnswer(
        id=uuid.uuid4(),
        turn_id=turn.id,
        slot="chief_complaint",
        value={"symptom": "fever"},
        status="AI_NORMALIZED",
        confidence=1.0,
        evidence_id=uuid.uuid4()
    )
    db_session.add(fact2)
    db_session.commit()
    
    return sess.id, str(ev_id)

def test_summary_fallback(db_session):
    sess_id, ev_id = setup_data(db_session)
    
    gen = SummaryGenerator(llm_provider=MockLLMProvider(should_fail=True))
    result = gen.generate_summary(db_session, sess_id)
    
    # Should fallback to deterministic
    assert len(result.sections) == 1
    assert "headache" in result.sections[0].text
    assert result.sections[0].evidence_ids == [ev_id]
    # "fever" (AI_NORMALIZED) should be ignored

def test_summary_fake_evidence_validation(db_session):
    sess_id, ev_id = setup_data(db_session)
    
    gen = SummaryGenerator(llm_provider=MockLLMProvider(should_fail=False, fake_ids=True, valid_id=ev_id))
    result = gen.generate_summary(db_session, sess_id)
    
    # LLM returns fake-ev-123, which is not in allowed evidence ids (ev_id).
    # It should be stripped.
    assert len(result.sections) == 1
    assert len(result.sections[0].evidence_ids) == 0

def test_summary_valid_evidence(db_session):
    sess_id, ev_id = setup_data(db_session)
    
    class ValidMockLLM:
        def generate_structured_summary(self, prompt: str) -> StructuredSummaryResult:
            return StructuredSummaryResult(
                sections=[
                    SummarySection(text="Patient has headache", evidence_ids=[ev_id])
                ]
            )
            
    gen = SummaryGenerator(llm_provider=ValidMockLLM())
    result = gen.generate_summary(db_session, sess_id)
    
    assert len(result.sections) == 1
    assert result.sections[0].evidence_ids == [ev_id]
