import re
from typing import Optional
from sqlalchemy.orm import Session
from app.models.session import ClinicalAnswer, ConversationTurn
import uuid


class ExtractionService:
    """
    Interface for extracting structured clinical facts from raw patient responses.
    Currently implements deterministic regex/keyword extraction for Stage 3 MVP.
    Will be swapped with LLM extraction in future stages.
    """

    # Basic deterministic matching for MVP demo purposes
    KEYWORD_MAP = {
        "chief_complaint": [
            (r"fever", {"symptom": "fever"}),
            (r"cough", {"symptom": "cough"}),
            (r"pain|hurt|ache", {"symptom": "pain"}),
            (r"headache", {"symptom": "headache"}),
            (r"stomach|abdomen", {"symptom": "abdominal pain"}),
        ],
        "duration": [
            (r"(\d+)\s*days?", {"unit": "days", "value": lambda m: int(m.group(1))}),
            (r"(\d+)\s*weeks?", {"unit": "weeks", "value": lambda m: int(m.group(1))}),
            (r"(\d+)\s*months?", {"unit": "months", "value": lambda m: int(m.group(1))}),
        ],
        "severity": [
            (r"mild|little", {"level": "mild"}),
            (r"moderate|medium", {"level": "moderate"}),
            (r"severe|bad|terrible", {"level": "severe"}),
        ],
        "medical_history": [
            (r"diabetes|sugar", {"condition": "diabetes"}),
            (r"hypertension|bp|blood pressure", {"condition": "hypertension"}),
            (r"asthma", {"condition": "asthma"}),
            (r"none|nothing", {"condition": "none"}),
        ]
    }

    @classmethod
    def extract_deterministic(cls, target_slot: str, raw_text: str) -> Optional[dict]:
        """Runs regex patterns against raw_text to extract a structured dict."""
        if target_slot not in cls.KEYWORD_MAP:
            return None

        text_lower = raw_text.lower()
        for pattern, base_val in cls.KEYWORD_MAP[target_slot]:
            match = re.search(pattern, text_lower)
            if match:
                result = dict(base_val)
                # Resolve callable values (like lambda for matched groups)
                for k, v in result.items():
                    if callable(v):
                        result[k] = v(match)
                return result
        
        # Fallback if no specific keyword matched but slot was targeted
        return {"raw": raw_text}

    @classmethod
    async def process_turn(cls, db: Session, turn: ConversationTurn, target_slot: str, evidence_id: Optional[uuid.UUID] = None) -> ClinicalAnswer:
        """
        Process a conversation turn and generate a ClinicalAnswer.
        Uses AI extraction if available, falling back to deterministic matching.
        """
        raw_text = turn.raw_text or ""
        
        extracted_value = None
        evidence = None
        confidence = 0.5
        status = "AI_NORMALIZED"
        
        # 1. AI Extraction
        from app.schemas.clinical import SLOT_SCHEMAS
        from app.services.llm.service import LLMService
        
        target_schema = SLOT_SCHEMAS.get(target_slot)
        if target_schema:
            llm_svc = LLMService()
            ai_result = await llm_svc.extract_clinical_fact(raw_text, target_slot, target_schema)
            if ai_result and ai_result.extracted_value:
                extracted_value = ai_result.extracted_value
                evidence = ai_result.evidence
                confidence = ai_result.confidence
                status = ai_result.status
                
        # 2. Deterministic Fallback if AI fails or returns nothing
        if not extracted_value:
            det_val = cls.extract_deterministic(target_slot, raw_text)
            if det_val:
                extracted_value = det_val
                evidence = None
                confidence = 0.8
                status = "DETERMINISTIC_NORMALIZED"
            else:
                extracted_value = {"raw": raw_text}
                evidence = raw_text
                confidence = 0.5
                status = "RAW_INPUT"

        # 3. Create the ClinicalAnswer
        from starlette.concurrency import run_in_threadpool

        def _save_answer():
            answer = ClinicalAnswer(
                turn_id=turn.id,
                question_id=turn.question_id,
                slot=target_slot,
                value=extracted_value,
                status=status,
                confidence=confidence,
                evidence_id=evidence_id
            )
            db.add(answer)
            db.commit()
            db.refresh(answer)
            return answer

        return await run_in_threadpool(_save_answer)

