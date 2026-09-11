from fastapi import APIRouter, Depends, HTTPException, status, Request, UploadFile, File, Form
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from starlette.concurrency import run_in_threadpool
from datetime import datetime, timezone
import logging

logger = logging.getLogger(__name__)

from app.core.database import get_db
from app.core.exceptions import LLMProviderError
from google.genai.errors import APIError
from app.models.session import IntakeSession, ConversationTurn, ClinicalAnswer
from app.models.patient import Consent
from app.models.media import MediaAsset, MediaEvidence
from app.schemas.intake import (
    SessionStatus, ConsentPayload, NextQuestionResponse, 
    AnswerPayload, ReviewSummary, ExtractedFact
)
from app.services.interview_engine import NextQuestionSelector
from app.services.extraction import ExtractionService
from app.services.media_storage import MediaStorageService
from app.services.media.gemini_asr import GeminiASRProcessor
from app.services.media.gemini_document import GeminiDocumentProcessor
from app.core.rate_limit import public_intake_limiter, media_limiter

router = APIRouter(prefix="/intake", tags=["intake"])

def get_session_by_token(public_token: str, db: Session) -> IntakeSession:
    session = db.query(IntakeSession).filter(IntakeSession.public_token == public_token).first()
    if not session:
        raise HTTPException(status_code=404, detail="Invalid or expired intake session")
    return session

@router.post("/demo/create", response_model=dict)
def create_demo_session(db: Session = Depends(get_db)):
    """Creates an isolated demo session with a dynamic token to avoid state collisions."""
    from app.models.patient import Patient, Encounter
    from app.models.session import IntakeSession
    import uuid
    
    unique_suffix = uuid.uuid4().hex[:8]
    token = f"demo-{unique_suffix}"
    
    # Create isolated demo patient
    patient = Patient(
        full_name=f"Demo Patient {unique_suffix[:4].upper()}",
        age=32,
        sex="M",
        phone=f"555-{unique_suffix[:4]}"
    )
    db.add(patient)
    db.flush()
    
    # Create encounter
    encounter = Encounter(
        patient_id=patient.id,
        opd_id=f"OPD-DEMO-{unique_suffix[:4].upper()}",
        status="REGISTERED"
    )
    db.add(encounter)
    db.flush()
    
    # Create session with unique token
    session = IntakeSession(
        encounter_id=encounter.id,
        public_token=token,
        state="CONSENT_PENDING",
        language="en"
    )
    db.add(session)
    db.commit()
    
    return {"status": "success", "token": token, "public_token": token, "encounter_id": str(encounter.id)}

@router.get("/{public_token}", response_model=SessionStatus, dependencies=[Depends(public_intake_limiter)])
def get_session_status(request: Request, public_token: str, db: Session = Depends(get_db)):
    """Validates the intake link and returns basic patient/session info."""
    session = get_session_by_token(public_token, db)
    patient = session.encounter.patient
    return SessionStatus(
        public_token=session.public_token,
        state=session.state,
        patient_name=patient.full_name,
        patient_age=patient.age,
        patient_sex=patient.sex,
        language=session.language
    )

@router.post("/{public_token}/consent", response_model=SessionStatus, dependencies=[Depends(public_intake_limiter)])
def submit_consent(request: Request, public_token: str, payload: ConsentPayload, db: Session = Depends(get_db)):
    """Records patient consent and advances state."""
    session = get_session_by_token(public_token, db)
    
    if session.state != "CONSENT_PENDING":
        raise HTTPException(status_code=400, detail="Consent already processed")
        
    if not payload.agreed:
        raise HTTPException(status_code=400, detail="Cannot proceed without consent")

    consent = Consent(
        patient_id=session.encounter.patient_id,
        consent_version="1.0",
        scope=payload.scope,
        granted_at=datetime.now(timezone.utc)
    )
    db.add(consent)
    
    session.state = "INTERVIEW"
    session.started_at = datetime.now(timezone.utc)
    session.encounter.status = "INTAKE_IN_PROGRESS"
    
    db.commit()
    db.refresh(session)
    return SessionStatus(
        public_token=session.public_token,
        state=session.state,
        patient_name=session.encounter.patient.full_name,
        patient_age=session.encounter.patient.age,
        patient_sex=session.encounter.patient.sex,
        language=session.language
    )

@router.post("/{public_token}/interview/next", response_model=NextQuestionResponse, dependencies=[Depends(public_intake_limiter)])
def get_next_question(request: Request, public_token: str, db: Session = Depends(get_db)):
    """Determines the next question to ask based on fulfilled slots."""
    session = get_session_by_token(public_token, db)
    
    if session.state != "INTERVIEW":
        raise HTTPException(status_code=400, detail=f"Invalid state for interview: {session.state}")

    question = NextQuestionSelector.get_next_question(db, session)
    
    if not question:
        # No more questions in GENERAL phase
        session.state = "REVIEW"
        db.commit()
        return NextQuestionResponse(is_complete=True)
        
    lang = session.language
    text = question.language_variants.get(lang) or question.language_variants.get("en")
    
    return NextQuestionResponse(
        is_complete=False,
        question_id=question.id,
        text=text,
        target_slot=question.targets_slot,
        phase=question.phase
    )

@router.post("/{public_token}/interview/answer", dependencies=[Depends(public_intake_limiter)])
async def submit_answer(request: Request, public_token: str, payload: AnswerPayload, db: Session = Depends(get_db)):
    """Receives a raw answer, extracts facts using AI (with fallback), and records it."""
    session = await run_in_threadpool(get_session_by_token, public_token, db)
    
    if session.state != "INTERVIEW":
        raise HTTPException(status_code=400, detail="Session not in interview state")

    def _sync_prepare_turn():
        turn_count = db.query(ConversationTurn).filter(ConversationTurn.session_id == session.id).count()
        turn = ConversationTurn(
            session_id=session.id,
            question_id=payload.question_id,
            turn_number=turn_count + 1,
            raw_text=payload.raw_text,
            language=session.language
        )
        db.add(turn)
        db.flush()
        if payload.evidence_id:
            evidence = db.query(MediaEvidence).filter(MediaEvidence.id == payload.evidence_id).first()
            if not evidence or not evidence.asset or evidence.asset.session_id != session.id:
                raise HTTPException(status_code=403, detail="Evidence does not belong to this session")
        return turn

    turn = await run_in_threadpool(_sync_prepare_turn)
    
    try:
        new_answer = await ExtractionService.process_turn(
            db, turn, payload.target_slot, evidence_id=payload.evidence_id
        )
        
        # Immediately evaluate deterministic safety rules and conflict detection
        from app.services.safety_engine import SafetyEngine
        from app.services.conflict_resolution import ConflictDetector
        
        def _sync_post_process():
            SafetyEngine.evaluate_facts(db, session.id, [new_answer])
            ConflictDetector.detect_conflicts(db, session.id)
            
        await run_in_threadpool(_sync_post_process)
    except (LLMProviderError, RuntimeError, ValueError, SQLAlchemyError) as e:
        logger.error(f"Provider failed during extraction: {e}")
        raise HTTPException(
            status_code=503, 
            detail="Processing is temporarily unavailable. Please retry."
        )
    
    return {"status": "success"}

@router.post("/{public_token}/upload/voice", dependencies=[Depends(media_limiter)])
async def upload_voice(
    request: Request,
    public_token: str,
    question_id: str = Form(...),
    target_slot: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Handles audio uploads, transcribes via ASR, extracts facts, and saves provenance."""
    session = await run_in_threadpool(get_session_by_token, public_token, db)
    
    if session.state != "INTERVIEW":
        raise HTTPException(status_code=400, detail="Session not in interview state")

    # Save immutable asset
    asset_info = await MediaStorageService.save_upload(file, session.id)

    def _create_voice_asset():
        asset = MediaAsset(
            session_id=session.id,
            media_type="AUDIO",
            mime_type=asset_info["mime_type"],
            immutable_storage_ref=asset_info["immutable_storage_ref"],
            sha256_hash=asset_info["sha256_hash"],
            processing_status="PROCESSING"
        )
        db.add(asset)
        db.commit()
        db.refresh(asset)
        return asset

    asset = await run_in_threadpool(_create_voice_asset)
    
    # Process ASR
    asr = GeminiASRProcessor()
    try:
        transcript = await asr.transcribe(asset.immutable_storage_ref, asset.mime_type)
    except (APIError, RuntimeError, ValueError, OSError) as e:
        logger.error(f"Provider failed during ASR: {e}")
        raise HTTPException(
            status_code=503, 
            detail="Voice processing is temporarily unavailable. Please retry or enter your symptoms by text."
        )
    
    def _finalize_voice():
        asset.processing_status = "COMPLETED"
        evidence = MediaEvidence(
            media_asset_id=asset.id,
            source_type="ASR_TRANSCRIPT",
            extracted_text=transcript,
        )
        db.add(evidence)
        db.commit()
        db.refresh(evidence)
        return evidence

    evidence = await run_in_threadpool(_finalize_voice)
    
    return {"status": "success", "transcript": transcript, "evidence_id": evidence.id}

@router.post("/{public_token}/upload/document", dependencies=[Depends(media_limiter)])
async def upload_document(
    request: Request,
    public_token: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Handles document uploads (PDF/Images), OCR extraction, and fact normalization."""
    session = await run_in_threadpool(get_session_by_token, public_token, db)
    
    # Save immutable asset
    asset_info = await MediaStorageService.save_upload(file, session.id)
    m_type = "PDF" if "pdf" in asset_info["mime_type"] else "IMAGE"

    def _create_doc_asset():
        asset = MediaAsset(
            session_id=session.id,
            media_type=m_type,
            mime_type=asset_info["mime_type"],
            immutable_storage_ref=asset_info["immutable_storage_ref"],
            sha256_hash=asset_info["sha256_hash"],
            processing_status="PROCESSING"
        )
        db.add(asset)
        db.commit()
        db.refresh(asset)
        return asset

    asset = await run_in_threadpool(_create_doc_asset)
    
    # Process OCR
    doc_proc = GeminiDocumentProcessor()
    try:
        raw_text = await doc_proc.extract_text(asset.immutable_storage_ref, asset.mime_type)
    except (APIError, RuntimeError, ValueError, OSError) as e:
        logger.error(f"Provider failed during Document OCR: {e}")
        raise HTTPException(
            status_code=503, 
            detail="Document processing is temporarily unavailable. Please retry or enter your symptoms by text."
        )
    
    def _finalize_doc():
        asset.processing_status = "COMPLETED"
        evidence = MediaEvidence(
            media_asset_id=asset.id,
            source_type="DOCUMENT_TEXT",
            extracted_text=raw_text,
        )
        db.add(evidence)
        turn_count = db.query(ConversationTurn).filter(ConversationTurn.session_id == session.id).count()
        turn = ConversationTurn(
            session_id=session.id,
            question_id=None,
            turn_number=turn_count + 1,
            raw_text=raw_text,
            language=session.language
        )
        db.add(turn)
        db.commit()
        db.refresh(evidence)
        db.refresh(turn)
        return evidence, turn

    evidence, turn = await run_in_threadpool(_finalize_doc)
    
    try:
        ans1 = await ExtractionService.process_turn(db, turn, "chief_complaint", evidence_id=evidence.id)
        ans2 = await ExtractionService.process_turn(db, turn, "medical_history", evidence_id=evidence.id)
        
        # Evaluate safety and conflict on document facts
        from app.services.safety_engine import SafetyEngine
        from app.services.conflict_resolution import ConflictDetector
        
        def _sync_post_doc():
            SafetyEngine.evaluate_facts(db, session.id, [ans1, ans2])
            ConflictDetector.detect_conflicts(db, session.id)
            
        await run_in_threadpool(_sync_post_doc)
    except (LLMProviderError, RuntimeError, ValueError, SQLAlchemyError) as e:
        logger.error(f"Provider failed during document extraction: {e}")
        raise HTTPException(
            status_code=503,
            detail="Document processing is temporarily unavailable. Please retry or enter your symptoms by text."
        )
    
    return {"status": "success", "extracted_text": raw_text, "evidence_id": evidence.id}

@router.get("/{public_token}/review", response_model=ReviewSummary, dependencies=[Depends(public_intake_limiter)])
def get_review_summary(request: Request, public_token: str, db: Session = Depends(get_db)):
    """Fetches all extracted facts for patient confirmation."""
    session = get_session_by_token(public_token, db)
    
    answers = db.query(ClinicalAnswer).join(ClinicalAnswer.turn).filter(
        ClinicalAnswer.turn.has(session_id=session.id)
    ).all()
    
    facts = []
    for ans in answers:
        facts.append(ExtractedFact(
            slot=ans.slot,
            value=ans.value,
            status=ans.status
        ))
        
    return ReviewSummary(facts=facts)

@router.post("/{public_token}/confirm", dependencies=[Depends(public_intake_limiter)])
def confirm_review(request: Request, public_token: str, db: Session = Depends(get_db)):
    """Patient confirms the extracted facts. Promotes all unconfirmed facts to PATIENT_CONFIRMED and marks session complete."""
    session = get_session_by_token(public_token, db)
    
    if session.state not in ["REVIEW", "INTERVIEW"]:
        raise HTTPException(status_code=400, detail="Session not ready for completion")
        
    # Promote ALL non-verified facts to PATIENT_CONFIRMED
    answers = db.query(ClinicalAnswer).join(ClinicalAnswer.turn).filter(
        ClinicalAnswer.turn.has(session_id=session.id),
        ClinicalAnswer.status.in_(["AI_NORMALIZED", "DETERMINISTIC_NORMALIZED", "RAW_INPUT"])
    ).all()
    
    for ans in answers:
        ans.status = "PATIENT_CONFIRMED"

    # Run Safety Engine on all facts
    from app.services.safety_engine import SafetyEngine
    SafetyEngine.evaluate_facts(db, session.id, answers)

    # Run Conflict Detector
    from app.services.conflict_resolution import ConflictDetector
    ConflictDetector.detect_conflicts(db, session.id)

    session.state = "COMPLETED"
    session.completed_at = datetime.now(timezone.utc)
    session.encounter.status = "READY_FOR_DOCTOR"
    
    db.commit()
    return {"status": "success"}
