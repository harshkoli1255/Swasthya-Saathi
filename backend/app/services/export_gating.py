from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.patient import Encounter
from app.models.session import ClinicalAnswer, ClinicalConflict, SafetyAlert
from app.services.terminology_mapper import TerminologyMapper

class ExportEligibilityEvaluator:
    """
    Evaluates encounter facts before export and produces a deterministic
    Export Eligibility Report.
    """
    @staticmethod
    def evaluate(encounter_id: str, db: Session) -> Dict[str, Any]:
        import uuid
        enc_uuid = uuid.UUID(encounter_id) if isinstance(encounter_id, str) else encounter_id
        encounter = db.query(Encounter).filter(Encounter.id == enc_uuid).first()
        if not encounter or not encounter.intake_session:
            return {"error": "Encounter or Session not found"}
            
        session_id = encounter.intake_session.id
        
        facts = db.query(ClinicalAnswer).join(ClinicalAnswer.turn).filter(
            ClinicalAnswer.turn.has(session_id=session_id)
        ).all()
        conflicts = db.query(ClinicalConflict).filter(
            ClinicalConflict.session_id == session_id,
            ClinicalConflict.relationship_status == "UNRESOLVED"
        ).all()
        alerts = db.query(SafetyAlert).filter(
            SafetyAlert.session_id == session_id,
            SafetyAlert.status == "DEMO_PENDING_CLINICAL_REVIEW"
        ).all()
        
        # Determine blocked facts by ID from conflicts and alerts
        blocked_fact_ids: Dict[str, str] = {}
        
        for c in conflicts:
            blocked_fact_ids[str(c.fact_id_1)] = f"Unresolved conflict: {c.id}"
            if c.fact_id_2:
                blocked_fact_ids[str(c.fact_id_2)] = f"Unresolved conflict: {c.id}"
                
        for a in alerts:
            for fid in a.matched_fact_ids:
                blocked_fact_ids[str(fid)] = f"Unacknowledged safety alert: {a.id}"
        
        report = {
            "eligible_resources": [],
            "blocked_resources": [],
            "unresolved_conflicts": len(conflicts),
            "unverified_safety_conditions": len(alerts),
            "terminology_failures": 0
        }
        
        for fact in facts:
            reason = None
            if fact.status == "AI_NORMALIZED":
                reason = "AI_NORMALIZED facts are not eligible for export."
            elif str(fact.id) in blocked_fact_ids:
                reason = blocked_fact_ids[str(fact.id)]
                
            if reason:
                report["blocked_resources"].append({
                    "fact_id": str(fact.id),
                    "value": fact.value,
                    "reason": reason
                })
                continue
                
            # If eligible, attempt terminology mapping
            mapping = TerminologyMapper.map_concept(fact.value)
            if not mapping:
                report["terminology_failures"] += 1
                
            report["eligible_resources"].append({
                "fact_id": str(fact.id),
                "slot": fact.slot,
                "value": fact.value,
                "status": fact.status,
                "mapping": mapping.__dict__ if mapping else None
            })
            
        return report
