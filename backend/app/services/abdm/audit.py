import uuid
import logging
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session

from app.models.audit import AuditLog
from app.models.clinical import ProvenanceRecord, Conflict
from app.models.patient import Patient, Encounter
from app.services.abdm.base import ABDMProfile

logger = logging.getLogger(__name__)


class ABDMAuditService:
    """
    Handles immutable audit logging, clinical provenance tracking,
    and demographic conflict reconciliation for ABDM operations.
    Strictly sanitizes sensitive data (never logs raw OTPs, tokens, or private keys).
    """

    @staticmethod
    def log_abdm_event(
        db: Session,
        action: str,
        entity_id: uuid.UUID,
        entity_type: str = "PATIENT",
        before_state: Optional[Dict[str, Any]] = None,
        after_state: Optional[Dict[str, Any]] = None,
        actor_id: Optional[uuid.UUID] = None
    ) -> AuditLog:
        """
        Records an immutable audit event for compliance.
        """
        audit_entry = AuditLog(
            actor_id=actor_id,
            entity_id=entity_id,
            entity_type=entity_type,
            edit_type=action,
            before_state=before_state,
            after_state=after_state
        )
        db.add(audit_entry)
        return audit_entry

    @staticmethod
    def record_provenance(
        db: Session,
        patient_id: uuid.UUID,
        session_id: Optional[uuid.UUID],
        source: str,
        reference_id: Optional[str] = None
    ) -> ProvenanceRecord:
        """
        Attaches a provenance record detailing the exact verification origin.
        """
        provenance = ProvenanceRecord(
            fact_table="patients",
            fact_id=str(patient_id),
            source=f"{source}:{reference_id}" if reference_id else source,
            session_id=session_id,
            recorded_at=datetime.now(timezone.utc),
            confidence=1.0
        )
        db.add(provenance)
        return provenance

    @staticmethod
    def reconcile_patient_demographics(
        db: Session,
        encounter: Encounter,
        verified_profile: ABDMProfile,
        verification_source: str,
        verification_method: str,
        verification_ref: Optional[str]
    ) -> Patient:
        """
        Attaches verified ABDM credentials to the patient record.
        Detects demographic discrepancies between existing intake data and verified identity.
        If a discrepancy exists, logs a conflict record for physician reconciliation rather than
        blindly destroying historical data.
        """
        patient = encounter.patient
        now = datetime.now(timezone.utc)

        before_state = {
            "full_name": patient.full_name,
            "age": patient.age,
            "sex": patient.sex,
            "phone": patient.phone,
            "verification_status": patient.verification_status
        }

        # Check for conflicts
        if patient.full_name and verified_profile.name:
            if patient.full_name.strip().lower() != verified_profile.name.strip().lower():
                # Don't flag trivial demo placeholder names as conflict
                if not patient.full_name.startswith("Demo Patient"):
                    conflict = Conflict(
                        encounter_id=encounter.id,
                        field="patient.full_name",
                        value_a_ref={
                            "source": "pre_intake_entry",
                            "value": patient.full_name
                        },
                        value_b_ref={
                            "source": verification_source,
                            "value": verified_profile.name,
                            "reference": verification_ref
                        },
                        classification="IDENTITY_MISMATCH",
                        is_resolved=False
                    )
                    db.add(conflict)
                    logger.info("Demographic conflict logged for encounter %s: Name mismatch", encounter.id)

        # Update verified patient attributes
        patient.full_name = verified_profile.name
        if verified_profile.age is not None:
            patient.age = verified_profile.age
        if verified_profile.gender:
            patient.sex = verified_profile.gender[:1].upper()
        if verified_profile.mobile:
            patient.phone = verified_profile.mobile

        patient.abha_number = verified_profile.abha_number
        patient.abha_address = verified_profile.abha_address
        patient.verification_status = "VERIFIED_SANDBOX" if "SANDBOX" in verification_source else "VERIFIED_DEV_MOCK"
        patient.verification_method = verification_method
        patient.verification_source = verification_source
        patient.verified_at = now
        patient.verification_reference = verification_ref

        after_state = {
            "full_name": patient.full_name,
            "age": patient.age,
            "sex": patient.sex,
            "phone": patient.phone,
            "abha_number": patient.abha_number,
            "abha_address": patient.abha_address,
            "verification_status": patient.verification_status,
            "verification_source": patient.verification_source
        }

        # Record audit log
        ABDMAuditService.log_abdm_event(
            db=db,
            action="ABDM_IDENTITY_VERIFIED",
            entity_id=patient.id,
            entity_type="PATIENT",
            before_state=before_state,
            after_state=after_state
        )

        # Record clinical provenance
        session_id = encounter.intake_session.id if encounter.intake_session else None
        ABDMAuditService.record_provenance(
            db=db,
            patient_id=patient.id,
            session_id=session_id,
            source=verification_source,
            reference_id=verification_ref
        )

        db.flush()
        return patient
