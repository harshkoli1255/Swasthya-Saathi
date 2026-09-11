from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from starlette.concurrency import run_in_threadpool
from typing import Annotated, Optional
from uuid import UUID
import logging

logger = logging.getLogger(__name__)

from app.core.database import get_db
from app.api.v1.auth import require_doctor
from app.models.user import User
from app.models.patient import Encounter
from app.models.session import ClinicalAnswer, ConversationTurn
from app.models.audit import AuditLog
from app.schemas.encounter import EncounterOverviewResponse, FactEditPayload, FactCreatePayload

router = APIRouter(prefix="/encounters", tags=["encounters"])

@router.get("/{encounter_id}/overview", response_model=EncounterOverviewResponse)
def get_encounter_overview(
    encounter_id: UUID,
    current_user: Annotated[User, Depends(require_doctor)],
    db: Session = Depends(get_db)
):
    """Fetch encounter details including patient info and all extracted facts."""
    encounter = db.query(Encounter).filter(Encounter.id == encounter_id).first()
    if not encounter:
        raise HTTPException(status_code=404, detail="Encounter not found")

    from app.core.exceptions import LLMProviderError
    from app.models.session import ClinicalConflict, SafetyAlert
    from app.services.timeline_builder import TimelineBuilder
    from app.services.summary_generator import SummaryGenerator
    from app.services.llm.cloud import GroqProvider
    from app.services.llm.gemini import GeminiProvider
    from app.core.config import settings

    timeline_data = []
    conflicts_data = []
    safety_alerts_data = []
    summary_data = None
    facts = []

    if encounter.intake_session:
        session_id = encounter.intake_session.id
        
        # 1. Fetch facts
        answers = db.query(ClinicalAnswer).join(ClinicalAnswer.turn).filter(
            ClinicalAnswer.turn.has(session_id=session_id)
        ).all()
        
        for ans in answers:
            evidence_data = None
            if ans.evidence:
                evidence_data = {
                    "source_type": ans.evidence.source_type,
                    "extracted_text": ans.evidence.extracted_text,
                    "media_type": ans.evidence.asset.media_type if ans.evidence.asset else None,
                    "media_url": f"/api/v1/media/{ans.evidence.asset.id}" if ans.evidence.asset else None
                }
            
            facts.append({
                "id": ans.id,
                "slot": ans.slot,
                "value": ans.value,
                "status": ans.status,
                "confidence": ans.confidence,
                "updated_at": ans.updated_at,
                "evidence": evidence_data
            })
            
        # 2. Build Timeline
        timeline_data = TimelineBuilder.build_timeline(db, session_id)
        
        # 3. Fetch Conflicts
        conflicts = db.query(ClinicalConflict).filter(ClinicalConflict.session_id == session_id).all()
        for c in conflicts:
            f1 = db.query(ClinicalAnswer).filter(ClinicalAnswer.id == c.fact_id_1).first() if c.fact_id_1 else None
            f2 = db.query(ClinicalAnswer).filter(ClinicalAnswer.id == c.fact_id_2).first() if c.fact_id_2 else None
            conflicts_data.append({
                "id": c.id,
                "slot": c.slot,
                "fact_id_1": str(c.fact_id_1),
                "fact_id_2": str(c.fact_id_2) if c.fact_id_2 else None,
                "relationship_status": c.relationship_status,
                "resolution_notes": c.resolution_notes,
                "fact_1_value": f1.value if f1 else None,
                "fact_2_value": f2.value if f2 else None,
                "fact_1_source": f1.status if f1 else None,
                "fact_2_source": f2.status if f2 else None,
            })
            
        # 4. Fetch Safety Alerts
        alerts = db.query(SafetyAlert).filter(SafetyAlert.session_id == session_id).all()
        for a in alerts:
            safety_alerts_data.append({
                "id": a.id,
                "rule_id": a.rule_id,
                "alert_category": a.alert_category,
                "deterministic_explanation": a.deterministic_explanation,
                "status": a.status,
                "matched_fact_ids": a.matched_fact_ids,
                "evidence_ids": a.evidence_ids
            })
            
        # 5. Build Summary with Groq & Gemini Fallback
        llm_provider = None
        if settings.groq_api_key:
            try:
                llm_provider = GroqProvider()
            except Exception as e:
                logger.warning(f"Failed to initialize GroqProvider for summary: {e}")

        if not llm_provider and settings.gemini_api_key:
            try:
                llm_provider = GeminiProvider()
            except Exception as e:
                logger.warning(f"Failed to initialize GeminiProvider for summary: {e}")
            
        generator = SummaryGenerator(llm_provider=llm_provider)
        summary_data = generator.generate_summary(db, session_id)

    return {
        "id": encounter.id,
        "opd_id": encounter.opd_id,
        "status": encounter.status,
        "triage_level": encounter.triage_level,
        "specialty": encounter.specialty,
        "created_at": encounter.created_at,
        "patient": encounter.patient,
        "clinical_facts": facts,
        "timeline": timeline_data,
        "conflicts": conflicts_data,
        "safety_alerts": safety_alerts_data,
        "summary": summary_data
    }

@router.patch("/{encounter_id}/answers/{answer_id}", response_model=dict)
def update_clinical_fact(
    encounter_id: UUID,
    answer_id: UUID,
    payload: FactEditPayload,
    current_user: Annotated[User, Depends(require_doctor)],
    db: Session = Depends(get_db)
):
    """Doctor edits a structured clinical fact. Records an AuditLog."""
    answer = db.query(ClinicalAnswer).filter(ClinicalAnswer.id == answer_id).first()
    if not answer:
        raise HTTPException(status_code=404, detail="Clinical Fact not found")
        
    # BOLA/IDOR protection
    if not answer.turn or not answer.turn.session or answer.turn.session.encounter_id != encounter_id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this fact for this encounter")

    # Record AuditLog
    audit = AuditLog(
        actor_id=current_user.id,
        entity_id=answer.id,
        entity_type="ClinicalAnswer",
        edit_type="UPDATE",
        before_state=answer.value,
        after_state=payload.value
    )
    db.add(audit)

    # Update fact
    answer.value = payload.value
    answer.status = "PHYSICIAN_VERIFIED"
    
    # Also update the encounter status to show it is being reviewed
    encounter = db.query(Encounter).filter(Encounter.id == encounter_id).first()
    if encounter and encounter.status == "READY_FOR_DOCTOR":
        encounter.status = "UNDER_REVIEW"

    db.commit()
    return {"status": "success", "new_value": answer.value}

@router.post("/{encounter_id}/synthesize")
def synthesize_encounter_summary(
    encounter_id: UUID,
    current_user: Annotated[User, Depends(require_doctor)],
    db: Session = Depends(get_db)
):
    """Trigger live AI clinical case narrative synthesis using Groq."""
    encounter = db.query(Encounter).filter(Encounter.id == encounter_id).first()
    if not encounter:
        raise HTTPException(status_code=404, detail="Encounter not found")

    from app.services.summary_generator import SummaryGenerator
    from app.services.llm.cloud import GroqProvider
    from app.services.llm.gemini import GeminiProvider
    from app.core.config import settings

    if not encounter.intake_session:
        raise HTTPException(status_code=400, detail="No intake session associated with this encounter")

    session_id = encounter.intake_session.id
    llm_provider = None
    if settings.groq_api_key:
        try:
            llm_provider = GroqProvider()
        except Exception as e:
            logger.warning(f"Failed to initialize GroqProvider: {e}")

    if not llm_provider and settings.gemini_api_key:
        try:
            llm_provider = GeminiProvider()
        except Exception as e:
            logger.warning(f"Failed to initialize GeminiProvider: {e}")

    generator = SummaryGenerator(llm_provider=llm_provider)
    summary_data = generator.generate_summary(db, session_id)
    return {"status": "success", "summary": summary_data}

@router.post("/{encounter_id}/facts", response_model=dict)
def create_clinical_fact(
    encounter_id: UUID,
    payload: FactCreatePayload,
    current_user: Annotated[User, Depends(require_doctor)],
    db: Session = Depends(get_db)
):
    """Doctor logs a new verified clinical fact during examination."""
    encounter = db.query(Encounter).filter(Encounter.id == encounter_id).first()
    if not encounter or not encounter.intake_session:
        raise HTTPException(status_code=404, detail="Encounter or intake session not found")

    session = encounter.intake_session
    turn = db.query(ConversationTurn).filter(ConversationTurn.session_id == session.id).order_by(ConversationTurn.turn_number.desc()).first()
    if not turn:
        turn = ConversationTurn(
            session_id=session.id,
            turn_number=1,
            raw_text="Physician clinical assessment notes",
            language="en"
        )
        db.add(turn)
        db.flush()

    new_answer = ClinicalAnswer(
        turn_id=turn.id,
        slot=payload.slot,
        value=payload.value if isinstance(payload.value, dict) else {"raw": str(payload.value)},
        status="PHYSICIAN_VERIFIED",
        confidence=1.0
    )
    db.add(new_answer)
    db.flush()

    audit = AuditLog(
        actor_id=current_user.id,
        entity_id=new_answer.id,
        entity_type="ClinicalAnswer",
        edit_type="CREATE",
        before_state=None,
        after_state=new_answer.value
    )
    db.add(audit)

    if encounter.status in ("READY_FOR_DOCTOR", "REGISTERED"):
        encounter.status = "UNDER_REVIEW"

    db.commit()
    return {"status": "success", "id": str(new_answer.id), "slot": new_answer.slot, "value": new_answer.value}

from fastapi.responses import FileResponse
from app.models.media import MediaAsset
import os

@router.get("/media/{asset_id}")
def get_media_asset(
    asset_id: UUID,
    current_user: Annotated[User, Depends(require_doctor)],
    db: Session = Depends(get_db)
):
    """Serve the original immutable media asset, protected by authentication and strict BOLA checks."""
    asset = db.query(MediaAsset).filter(MediaAsset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Media not found")
        
    # BOLA protection - verify the doctor is authorized to view this asset
    if not asset.session or not asset.session.encounter:
        raise HTTPException(status_code=404, detail="Associated encounter not found")
        
    encounter = asset.session.encounter
    if encounter.doctor_id and encounter.doctor_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=403, 
            detail="Not authorized to access media for an encounter assigned to another physician"
        )
        
    if encounter.patient and encounter.patient.is_deleted:
        raise HTTPException(status_code=404, detail="Patient record is deactivated")

    if not asset.immutable_storage_ref or not os.path.isfile(asset.immutable_storage_ref):
        raise HTTPException(status_code=404, detail="Media file not found on disk")

    # Record access audit
    audit = AuditLog(
        actor_id=current_user.id,
        entity_id=asset.id,
        entity_type="MediaAsset",
        edit_type="MEDIA_ACCESSED",
        before_state=None,
        after_state={"encounter_id": str(encounter.id), "media_type": asset.media_type}
    )
    db.add(audit)
    db.commit()
        
    return FileResponse(
        path=asset.immutable_storage_ref,
        media_type=asset.mime_type
    )

from pydantic import BaseModel
class ConflictResolutionPayload(BaseModel):
    relationship_status: str
    resolution_notes: Optional[str] = None

@router.patch("/{encounter_id}/conflicts/{conflict_id}/resolve", response_model=dict)
def resolve_conflict(
    encounter_id: UUID,
    conflict_id: UUID,
    payload: ConflictResolutionPayload,
    current_user: Annotated[User, Depends(require_doctor)],
    db: Session = Depends(get_db)
):
    from app.models.session import ClinicalConflict
    conflict = db.query(ClinicalConflict).filter(ClinicalConflict.id == conflict_id).first()
    if not conflict:
        raise HTTPException(status_code=404, detail="Conflict not found")
        
    if not conflict.session or conflict.session.encounter_id != encounter_id:
        raise HTTPException(status_code=403, detail="Not authorized to resolve this conflict for this encounter")

    audit = AuditLog(
        actor_id=current_user.id,
        entity_id=conflict.id,
        entity_type="ClinicalConflict",
        edit_type="UPDATE",
        before_state={"relationship_status": conflict.relationship_status},
        after_state={"relationship_status": payload.relationship_status, "notes": payload.resolution_notes}
    )
    db.add(audit)
    
    conflict.relationship_status = payload.relationship_status
    conflict.resolution_notes = payload.resolution_notes
    db.commit()
    return {"status": "success"}

class SafetyAlertAckPayload(BaseModel):
    status: str

@router.patch("/{encounter_id}/alerts/{alert_id}/acknowledge", response_model=dict)
def acknowledge_alert(
    encounter_id: UUID,
    alert_id: UUID,
    payload: SafetyAlertAckPayload,
    current_user: Annotated[User, Depends(require_doctor)],
    db: Session = Depends(get_db)
):
    from app.models.session import SafetyAlert
    alert = db.query(SafetyAlert).filter(SafetyAlert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Safety Alert not found")
        
    if not alert.session or alert.session.encounter_id != encounter_id:
        raise HTTPException(status_code=403, detail="Not authorized to acknowledge this alert for this encounter")

    audit = AuditLog(
        actor_id=current_user.id,
        entity_id=alert.id,
        entity_type="SafetyAlert",
        edit_type="UPDATE",
        before_state={"status": alert.status},
        after_state={"status": payload.status}
    )
    db.add(audit)
    
    alert.status = payload.status
    db.commit()
    return {"status": "success"}

@router.get("/{encounter_id}/export-eligibility", response_model=dict)
def get_export_eligibility(
    encounter_id: UUID,
    current_user: Annotated[User, Depends(require_doctor)],
    db: Session = Depends(get_db)
):
    from app.services.export_gating import ExportEligibilityEvaluator
    
    audit = AuditLog(
        actor_id=current_user.id,
        entity_id=encounter_id,
        entity_type="Encounter",
        edit_type="ELIGIBILITY_EVALUATED",
        before_state=None,
        after_state={"action": "Export Eligibility Evaluated"}
    )
    db.add(audit)
    db.commit()
    
    return ExportEligibilityEvaluator.evaluate(str(encounter_id), db)

from fastapi import Request
from app.core.rate_limit import export_limiter

@router.post("/{encounter_id}/export-fhir", response_model=dict, dependencies=[Depends(export_limiter)])
async def export_fhir_bundle(
    request: Request,
    encounter_id: UUID,
    current_user: Annotated[User, Depends(require_doctor)],
    db: Session = Depends(get_db)
):
    from app.services.fhir_mapper import FHIRMapper
    from app.services.abdm_mock import MockABDMGateway
    from app.models.export import FHIRExportRecord
    from datetime import datetime
    import uuid
    
    # 1. Audit Export Requested
    audit_req = AuditLog(
        actor_id=current_user.id,
        entity_id=encounter_id,
        entity_type="Encounter",
        edit_type="EXPORT_REQUESTED",
        before_state=None,
        after_state=None
    )
    db.add(audit_req)
    
    try:
        # 2. Build Bundle in threadpool
        def _build_and_audit():
            bundle = FHIRMapper.build_fhir_bundle(str(encounter_id), db)
            audit_gen = AuditLog(
                actor_id=current_user.id,
                entity_id=encounter_id,
                entity_type="Encounter",
                edit_type="EXPORT_GENERATED",
                before_state=None,
                after_state=None
            )
            db.add(audit_gen)
            return bundle

        bundle = await run_in_threadpool(_build_and_audit)
        
        # 3. Dispatch to Mock ABDM
        success, status, fail_code, fail_reason = await MockABDMGateway.sync_clinical_record(bundle)
        
        # 4. Record in threadpool
        def _record_export():
            export_record = FHIRExportRecord(
                encounter_id=encounter_id,
                export_id=bundle["id"],
                status="SUCCESS" if success else "FAILED",
                exported_at=datetime.utcnow() if success else None,
                bundle_identifier=bundle["id"],
                bundle_version="1",
                validation_status="VALID" if success else "INVALID",
                failure_code=fail_code,
                failure_reason=fail_reason,
                actor_id=current_user.id
            )
            db.add(export_record)
            
            audit_result = AuditLog(
                actor_id=current_user.id,
                entity_id=encounter_id,
                entity_type="Encounter",
                edit_type="EXPORT_SUCCEEDED" if success else "EXPORT_FAILED",
                before_state=None,
                after_state={"failure_reason": fail_reason} if not success else None
            )
            db.add(audit_result)
            db.commit()

        await run_in_threadpool(_record_export)
        
        if not success:
            # We don't raise 500, we return 400 or a controlled payload as requested
            return {"status": "failed", "reason": fail_reason, "code": fail_code}
            
        return {
            "status": "success",
            "export_id": bundle["id"],
            "bundle_id": bundle["id"],
            "resource_count": len(bundle.get("entry", [])),
            "bundle": bundle,
        }
        
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    except (SQLAlchemyError, RuntimeError, KeyError, TypeError) as e:
        import traceback
        traceback.print_exc()
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Internal Server Error during export generation: {str(e)}")

@router.get("/{encounter_id}/export-records", response_model=list)
def list_export_records(
    encounter_id: UUID,
    current_user: Annotated[User, Depends(require_doctor)],
    db: Session = Depends(get_db)
):
    from app.models.export import FHIRExportRecord
    records = db.query(FHIRExportRecord).filter(FHIRExportRecord.encounter_id == encounter_id).order_by(FHIRExportRecord.created_at.desc()).all()
    
    audit = AuditLog(
        actor_id=current_user.id,
        entity_id=encounter_id,
        entity_type="Encounter",
        edit_type="BUNDLE_VIEWED",
        before_state=None,
        after_state=None
    )
    db.add(audit)
    db.commit()
    
    return [
        {
            "id": r.id,
            "export_id": r.export_id,
            "status": r.status,
            "exported_at": r.exported_at,
            "failure_reason": r.failure_reason,
            "validation_status": r.validation_status
        } for r in records
    ]
