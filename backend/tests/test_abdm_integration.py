import pytest
import uuid
from datetime import datetime, timezone
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes, serialization
import base64
from unittest.mock import patch
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.models.base import Base
from app.services.abdm.crypto import encrypt_abdm_data
from app.services.abdm.base import ABDMProfile
from app.services.abdm.audit import ABDMAuditService
from app.services.abdm.mock_adapter import LocalDevelopmentMockAdapter
from app.services.abdm.sandbox_adapter import ABDMSandboxAdapter
from app.models.patient import Patient, Encounter
from app.models.clinical import Conflict, ProvenanceRecord
from app.models.audit import AuditLog
from app.models.session import IntakeSession


@pytest.fixture
def db_session():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    TestingSessionLocal = sessionmaker(bind=engine)
    db = TestingSessionLocal()
    yield db
    db.close()


def test_abdm_rsa_oaep_encryption():
    """Verify that encrypt_abdm_data encrypts data with RSA-OAEP SHA-1 / MGF1 padding."""
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048
    )
    public_pem = private_key.public_key().public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    ).decode('utf-8')

    plain_text = "999912345678"
    encrypted_b64 = encrypt_abdm_data(plain_text, public_pem)

    assert encrypted_b64 is not None
    assert len(encrypted_b64) > 0

    # Decrypt and verify matching plain text
    ciphertext = base64.b64decode(encrypted_b64)
    decrypted = private_key.decrypt(
        ciphertext,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA1()),
            algorithm=hashes.SHA1(),
            label=None
        )
    ).decode('utf-8')

    assert decrypted == plain_text


@pytest.mark.asyncio
async def test_abdm_local_mock_adapter_is_clearly_labeled():
    """Verify that local development mock adapter is marked LOCAL_DEV_MOCK and NOT claimed as verified."""
    adapter = LocalDevelopmentMockAdapter()
    
    req_res = await adapter.request_otp(
        login_hint="aadhaar",
        login_id="123456789012",
        otp_system="aadhaar",
        scope=["abha-enrol"]
    )
    assert req_res["success"] is True
    assert req_res["txn_id"].startswith("local-mock-txn-")

    verify_res = await adapter.verify_otp(
        txn_id=req_res["txn_id"],
        otp_value="123456",
        scope=["abha-enrol"]
    )
    assert verify_res.success is True
    # Crucial compliance: local mock must NEVER claim to be official ABDM gateway
    assert adapter.environment_name == "LOCAL_DEV_MOCK"
    assert "[LOCAL DEV MOCK]" in verify_res.message
    
    # Profile fetch
    profile = await adapter.get_account_profile(verify_res.token)
    assert "Local Mock" in profile.name


@pytest.mark.asyncio
async def test_abdm_sandbox_adapter_unconfigured_rejection():
    """Verify that unconfigured sandbox adapter gracefully reports configuration required without fabricating behavior."""
    with patch.object(settings, "abdm_client_id", ""), patch.object(settings, "abdm_client_secret", ""):
        adapter = ABDMSandboxAdapter()
        with pytest.raises(ValueError) as exc_info:
            await adapter.get_session_token()
        assert "ABDM Sandbox credentials (CLIENT_ID, CLIENT_SECRET) are not configured" in str(exc_info.value)


def test_abdm_audit_and_conflict_detection(db_session):
    """Verify that ABDM identity verification records immutable audit log, provenance, and demographic conflict."""
    # 1. Create Patient with initial self-reported demographics
    patient = Patient(
        id=uuid.uuid4(),
        full_name="Ramesh Kumar",
        age=45,
        sex="M",
        phone="9876543210",
        verification_status="UNVERIFIED"
    )
    db_session.add(patient)

    # 2. Create Encounter
    encounter = Encounter(
        id=uuid.uuid4(),
        patient_id=patient.id,
        opd_id="OPD-2026-TEST",
        status="IN_INTAKE",
        triage_level="ROUTINE"
    )
    db_session.add(encounter)

    # 3. Create IntakeSession
    session = IntakeSession(
        id=uuid.uuid4(),
        encounter_id=encounter.id,
        public_token="test-token-audit",
        state="NOT_STARTED",
        language="en"
    )
    db_session.add(session)
    db_session.commit()

    # Link relationships
    encounter.patient = patient
    encounter.intake_session = session

    # 4. ABDM Profile returned from gateway with slightly different name and ABHA details
    abdm_profile = ABDMProfile(
        abha_number="91-1234-5678-9012",
        abha_address="ramesh.k@sbx",
        name="Ramesh Kumar Sharma",  # Conflicting / updated name
        gender="M",
        year_of_birth=1980,
        age=46,
        mobile="9876543210"
    )

    # 5. Execute ABDMAuditService reconciliation
    ABDMAuditService.reconcile_patient_demographics(
        db=db_session,
        encounter=encounter,
        verified_profile=abdm_profile,
        verification_source="ABDM_SANDBOX",
        verification_method="AADHAAR_OTP",
        verification_ref="TXN-NHA-998877"
    )

    db_session.commit()

    # 6. Verify Patient state updated and provenance preserved
    db_session.refresh(patient)
    assert patient.verification_status == "VERIFIED_SANDBOX"
    assert patient.verification_method == "AADHAAR_OTP"
    assert patient.verification_source == "ABDM_SANDBOX"
    assert patient.verification_reference == "TXN-NHA-998877"
    assert patient.abha_number == "91-1234-5678-9012"
    assert patient.abha_address == "ramesh.k@sbx"
    assert patient.full_name == "Ramesh Kumar Sharma"

    # 7. Verify conflict was detected and recorded in conflicts table
    conflicts = db_session.query(Conflict).filter(Conflict.encounter_id == encounter.id).all()
    assert len(conflicts) == 1
    conflict = conflicts[0]
    assert conflict.field == "patient.full_name"
    assert conflict.classification == "IDENTITY_MISMATCH"
    assert conflict.value_a_ref["value"] == "Ramesh Kumar"
    assert conflict.value_b_ref["value"] == "Ramesh Kumar Sharma"

    # 8. Verify audit log entry
    audit_logs = db_session.query(AuditLog).filter(AuditLog.entity_id == patient.id).all()
    assert len(audit_logs) >= 1
    assert any(log.edit_type == "ABDM_IDENTITY_VERIFIED" for log in audit_logs)

    # 9. Verify provenance record
    provenance = db_session.query(ProvenanceRecord).filter(ProvenanceRecord.fact_id == str(patient.id)).all()
    assert len(provenance) >= 1
    assert any("ABDM_SANDBOX" in p.source for p in provenance)


def test_patient_encounter_isolation(db_session):
    """Verify that verifying Patient A's identity via ABDM cannot alter Patient B's encounter or verification status."""
    # Patient A
    p_a = Patient(id=uuid.uuid4(), full_name="Patient Alpha", age=30, sex="M", phone="9000000001", verification_status="UNVERIFIED")
    enc_a = Encounter(id=uuid.uuid4(), patient_id=p_a.id, opd_id="OPD-A", status="IN_INTAKE", triage_level="ROUTINE")
    sess_a = IntakeSession(id=uuid.uuid4(), encounter_id=enc_a.id, public_token="token-a", state="NOT_STARTED", language="en")
    
    # Patient B
    p_b = Patient(id=uuid.uuid4(), full_name="Patient Beta", age=40, sex="F", phone="9000000002", verification_status="UNVERIFIED")
    enc_b = Encounter(id=uuid.uuid4(), patient_id=p_b.id, opd_id="OPD-B", status="IN_INTAKE", triage_level="ROUTINE")
    sess_b = IntakeSession(id=uuid.uuid4(), encounter_id=enc_b.id, public_token="token-b", state="NOT_STARTED", language="en")

    db_session.add_all([p_a, enc_a, sess_a, p_b, enc_b, sess_b])
    db_session.commit()

    enc_a.patient = p_a
    enc_a.intake_session = sess_a
    enc_b.patient = p_b
    enc_b.intake_session = sess_b

    # Authenticate Patient A only
    profile_a = ABDMProfile(
        abha_number="91-1111-2222-3333",
        abha_address="alpha@sbx",
        name="Patient Alpha Verified",
        gender="M",
        age=30
    )

    ABDMAuditService.reconcile_patient_demographics(
        db=db_session,
        encounter=enc_a,
        verified_profile=profile_a,
        verification_source="ABDM_SANDBOX",
        verification_method="AADHAAR_OTP",
        verification_ref="TXN-AAA-111"
    )
    db_session.commit()

    db_session.refresh(p_a)
    db_session.refresh(p_b)

    # Patient A should be verified
    assert p_a.verification_status == "VERIFIED_SANDBOX"
    assert p_a.full_name == "Patient Alpha Verified"
    assert p_a.abha_number == "91-1111-2222-3333"

    # Patient B MUST remain completely unverified and unchanged
    assert p_b.verification_status == "UNVERIFIED"
    assert p_b.full_name == "Patient Beta"
    assert p_b.verification_reference is None
    assert p_b.abha_number is None
