import pytest
import uuid
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.core.database import get_db
from app.core.security import create_access_token, hash_password
from app.models.base import Base
from app.models.patient import Patient, Encounter, Consent
from app.models.session import IntakeSession, ConversationTurn, ClinicalAnswer
from app.models.media import MediaAsset
from app.models.user import User
from app.models.audit import AuditLog

# In-memory SQLite engine for isolated authorization & surface unit testing
test_engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSession = sessionmaker(bind=test_engine)

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_test_database():
    Base.metadata.drop_all(test_engine)
    Base.metadata.create_all(test_engine)

    def override_get_db():
        db = TestingSession()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    yield
    app.dependency_overrides.pop(get_db, None)


def create_doctor(db, username="dr.ayush", role="DOCTOR", facility="Ayurveda OPD"):
    doc_id = uuid.uuid4()
    user = User(
        id=doc_id,
        username=username,
        password_hash=hash_password("password123"),
        full_name=f"Dr. {username}",
        role=role,
        facility=facility,
        is_active=True
    )
    db.add(user)
    db.commit()
    token = create_access_token(subject=str(doc_id))
    return doc_id, token


def test_cross_patient_isolation():
    """Verify that Patient A holding Token A cannot read or mutate Patient B's intake session."""
    with TestingSession() as db:
        pat_a = Patient(full_name="Patient A", age=30, sex="F")
        pat_b = Patient(full_name="Patient B", age=45, sex="M")
        db.add_all([pat_a, pat_b])
        db.flush()

        enc_a = Encounter(patient_id=pat_a.id, opd_id="OPD-A", status="INTAKE_IN_PROGRESS")
        enc_b = Encounter(patient_id=pat_b.id, opd_id="OPD-B", status="INTAKE_IN_PROGRESS")
        db.add_all([enc_a, enc_b])
        db.flush()

        token_a = f"token-patient-a-{uuid.uuid4().hex[:6]}"
        token_b = f"token-patient-b-{uuid.uuid4().hex[:6]}"
        sess_a = IntakeSession(encounter_id=enc_a.id, public_token=token_a, state="INTERVIEW", language="en")
        sess_b = IntakeSession(encounter_id=enc_b.id, public_token=token_b, state="INTERVIEW", language="en")
        db.add_all([sess_a, sess_b])
        db.commit()

    # Querying existing Token A returns 200
    res_a = client.get(f"/api/v1/intake/{token_a}")
    assert res_a.status_code == 200
    assert res_a.json()["patient_name"] == "Patient A"

    # Querying invalid / cross-tenant token returns 404
    res_cross = client.get(f"/api/v1/intake/{token_b}-invalid")
    assert res_cross.status_code == 404

    # Patient A cannot post answers to non-existent session
    res_hack = client.post(
        f"/api/v1/intake/non-existent-token/interview/answer",
        json={"question_id": str(uuid.uuid4()), "target_slot": "chief_complaint", "raw_text": "fever"}
    )
    assert res_hack.status_code == 404


def test_patient_cannot_access_doctor_apis():
    """Verify unauthenticated/patient clients cannot call clinician endpoints."""
    # 1. Queue endpoint
    res_queue = client.get("/api/v1/queue")
    assert res_queue.status_code == 401

    # 2. Encounters overview endpoint
    dummy_enc_id = uuid.uuid4()
    res_enc = client.get(f"/api/v1/encounters/{dummy_enc_id}/overview")
    assert res_enc.status_code == 401

    # 3. Patient registration endpoint
    res_pat = client.post("/api/v1/patients", json={"full_name": "Injected Patient"})
    assert res_pat.status_code == 401


def test_doctor_a_cannot_access_doctor_b_encounter():
    """Verify strict BOLA: Doctor B is rejected (403) when attempting to view or edit Doctor A's encounter."""
    with TestingSession() as db:
        doc_a_id, token_a = create_doctor(db, "dr.first")
        doc_b_id, token_b = create_doctor(db, "dr.second")

        pat = Patient(full_name="Assigned Patient", age=40, sex="M")
        db.add(pat)
        db.flush()

        # Encounter is assigned exclusively to Doctor A
        enc = Encounter(patient_id=pat.id, opd_id="OPD-DOC-A", doctor_id=doc_a_id, status="UNDER_REVIEW")
        db.add(enc)
        db.flush()

        sess = IntakeSession(encounter_id=enc.id, public_token="token-b-test", state="REVIEW", language="en")
        db.add(sess)
        db.flush()

        turn = ConversationTurn(session_id=sess.id, turn_number=1, raw_text="Headache for 3 days", language="en")
        db.add(turn)
        db.flush()

        ans = ClinicalAnswer(turn_id=turn.id, slot="chief_complaint", value={"symptom": "Headache"}, status="AI_NORMALIZED", confidence=0.95)
        db.add(ans)
        db.commit()

        enc_id = enc.id
        ans_id = ans.id

    headers_a = {"Authorization": f"Bearer {token_a}"}
    headers_b = {"Authorization": f"Bearer {token_b}"}

    # Doctor A can access
    res_a = client.get(f"/api/v1/encounters/{enc_id}/overview", headers=headers_a)
    assert res_a.status_code == 200

    # Doctor B cannot access overview -> 403 Forbidden
    res_b = client.get(f"/api/v1/encounters/{enc_id}/overview", headers=headers_b)
    assert res_b.status_code == 403
    assert "Not authorized to access an encounter assigned to another physician" in res_b.json()["detail"]

    # Doctor B cannot edit facts on Doctor A's encounter -> 403 Forbidden
    res_edit_b = client.patch(
        f"/api/v1/encounters/{enc_id}/answers/{ans_id}",
        headers=headers_b,
        json={"value": {"symptom": "Migraine"}}
    )
    assert res_edit_b.status_code == 403

    # Doctor B cannot export FHIR for Doctor A's encounter -> 403 Forbidden
    res_fhir_b = client.post(
        f"/api/v1/encounters/{enc_id}/export-fhir",
        headers=headers_b
    )
    assert res_fhir_b.status_code == 403


def test_atomic_encounter_claiming_and_concurrency():
    """Verify that the first physician to open an unassigned encounter claims it atomically, locking out subsequent doctors."""
    with TestingSession() as db:
        doc_a_id, token_a = create_doctor(db, "dr.claim_a")
        doc_b_id, token_b = create_doctor(db, "dr.claim_b")

        pat = Patient(full_name="Unassigned Patient", age=28, sex="F")
        db.add(pat)
        db.flush()

        enc = Encounter(patient_id=pat.id, opd_id="OPD-CLAIM-1", doctor_id=None, status="READY_FOR_DOCTOR")
        db.add(enc)
        db.commit()
        enc_id = enc.id

    headers_a = {"Authorization": f"Bearer {token_a}"}
    headers_b = {"Authorization": f"Bearer {token_b}"}

    # 1. Doctor A opens encounter -> Successfully claims it
    res_a = client.get(f"/api/v1/encounters/{enc_id}/overview", headers=headers_a)
    assert res_a.status_code == 200

    with TestingSession() as db:
        updated_enc = db.query(Encounter).filter(Encounter.id == enc_id).first()
        assert updated_enc.doctor_id == doc_a_id
        assert updated_enc.status == "UNDER_REVIEW"

        # Verify audit log entry
        audit = db.query(AuditLog).filter(AuditLog.entity_id == enc_id, AuditLog.edit_type == "ENCOUNTER_CLAIMED").first()
        assert audit is not None
        assert audit.actor_id == doc_a_id

    # 2. Doctor B attempts to open the same encounter -> Rejected with 403 Forbidden
    res_b = client.get(f"/api/v1/encounters/{enc_id}/overview", headers=headers_b)
    assert res_b.status_code == 403
    assert "assigned to another physician" in res_b.json()["detail"]


def test_admin_role_can_access_any_encounter():
    """Verify that an ADMIN physician can access encounters assigned to another doctor for supervisory review."""
    with TestingSession() as db:
        doc_a_id, token_a = create_doctor(db, "dr.regular", role="DOCTOR")
        admin_doc_id, token_admin = create_doctor(db, "dr.chief", role="ADMIN")

        pat = Patient(full_name="Clinical Oversight Patient", age=50, sex="M")
        db.add(pat)
        db.flush()

        enc = Encounter(patient_id=pat.id, opd_id="OPD-ADMIN-TEST", doctor_id=doc_a_id, status="UNDER_REVIEW")
        db.add(enc)
        db.commit()
        enc_id = enc.id

    headers_admin = {"Authorization": f"Bearer {token_admin}"}
    res_admin = client.get(f"/api/v1/encounters/{enc_id}/overview", headers=headers_admin)
    assert res_admin.status_code == 200


def test_session_recovery():
    """Verify intake session state recovers correctly on page refresh."""
    with TestingSession() as db:
        pat = Patient(full_name="Recovering Patient", age=25, sex="F")
        db.add(pat)
        db.flush()

        enc = Encounter(patient_id=pat.id, opd_id="OPD-RECOVER", status="INTAKE_IN_PROGRESS")
        db.add(enc)
        db.flush()

        token = f"token-recovery-{uuid.uuid4().hex[:6]}"
        sess = IntakeSession(encounter_id=enc.id, public_token=token, state="CONSENT_PENDING", language="hi")
        db.add(sess)
        db.commit()

    # Session status check
    res = client.get(f"/api/v1/intake/{token}")
    assert res.status_code == 200
    assert res.json()["state"] == "CONSENT_PENDING"
    assert res.json()["language"] == "hi"

    # Patient accepts consent with valid schema
    res_consent = client.post(f"/api/v1/intake/{token}/consent", json={"agreed": True, "scope": ["clinical"]})
    assert res_consent.status_code == 200
    assert res_consent.json()["state"] == "INTERVIEW"

    # Subsequent refresh returns updated INTERVIEW state
    res_refreshed = client.get(f"/api/v1/intake/{token}")
    assert res_refreshed.status_code == 200
    assert res_refreshed.json()["state"] == "INTERVIEW"


def test_intake_submission_appears_in_doctor_queue():
    """Verify that a confirmed patient intake appears in the doctor queue."""
    with TestingSession() as db:
        doc_id, token_doc = create_doctor(db, "dr.triage")

        pat = Patient(full_name="Queue Test Patient", age=33, sex="M")
        db.add(pat)
        db.flush()

        enc = Encounter(patient_id=pat.id, opd_id="OPD-QUEUE-TEST", status="REGISTERED", triage_level="URGENT")
        db.add(enc)
        db.flush()

        token = f"token-queue-{uuid.uuid4().hex[:6]}"
        sess = IntakeSession(encounter_id=enc.id, public_token=token, state="REVIEW", language="en")
        db.add(sess)
        db.commit()

    # Patient confirms intake
    res_confirm = client.post(f"/api/v1/intake/{token}/confirm")
    assert res_confirm.status_code == 200

    # Doctor queries queue -> patient appears with status READY_FOR_DOCTOR
    headers = {"Authorization": f"Bearer {token_doc}"}
    res_queue = client.get("/api/v1/queue", headers=headers)
    assert res_queue.status_code == 200
    queue = res_queue.json()
    assert any(p["opd_id"] == "OPD-QUEUE-TEST" for p in queue)


def test_concurrent_simultaneous_encounter_claiming():
    """Concurrency test: Two physicians race simultaneously to claim the same unassigned encounter in PostgreSQL."""
    from app.core.database import SessionLocal
    from concurrent.futures import ThreadPoolExecutor

    # Temporarily remove dependency override so it tests against PostgreSQL
    app.dependency_overrides.pop(get_db, None)

    try:
        with SessionLocal() as db:
            u1_id, token_1 = create_doctor(db, f"dr.race1_{uuid.uuid4().hex[:4]}")
            u2_id, token_2 = create_doctor(db, f"dr.race2_{uuid.uuid4().hex[:4]}")

            pat = Patient(full_name="Racing Patient", age=29, sex="M")
            db.add(pat)
            db.flush()

            enc = Encounter(patient_id=pat.id, opd_id=f"OPD-RACE-{uuid.uuid4().hex[:4]}", doctor_id=None, status="READY_FOR_DOCTOR")
            db.add(enc)
            db.commit()
            enc_id = enc.id

        def request_claim(token):
            c = TestClient(app)
            return c.get(f"/api/v1/encounters/{enc_id}/overview", headers={"Authorization": f"Bearer {token}"})

        with ThreadPoolExecutor(max_workers=2) as executor:
            f1 = executor.submit(request_claim, token_1)
            f2 = executor.submit(request_claim, token_2)
            res1 = f1.result()
            res2 = f2.result()

        status_codes = [res1.status_code, res2.status_code]
        # Exactly one doctor claims the encounter (200), the other receives 403 Forbidden
        assert 200 in status_codes
        assert 403 in status_codes

        with SessionLocal() as db:
            claimed_enc = db.query(Encounter).filter(Encounter.id == enc_id).first()
            # The assigned doctor matches the one who received 200
            winner_id = u1_id if res1.status_code == 200 else u2_id
            assert claimed_enc.doctor_id == winner_id
            assert claimed_enc.status == "UNDER_REVIEW"
    finally:
        def override_get_db():
            db = TestingSession()
            try:
                yield db
            finally:
                db.close()
        app.dependency_overrides[get_db] = override_get_db


def test_unauthorized_media_access_rejection():
    """Verify unauthorized media asset requests are rejected."""
    # Unauthenticated request for media asset
    res_unauth = client.get(f"/api/v1/encounters/media/{uuid.uuid4()}")
    assert res_unauth.status_code == 401

