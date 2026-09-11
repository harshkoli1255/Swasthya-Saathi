import uuid
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.session import ClinicalAnswer, IntakeSession

class TimelineBuilder:
    @staticmethod
    def build_timeline(db: Session, session_id: uuid.UUID) -> List[Dict[str, Any]]:
        """
        Builds a chronological timeline of clinical facts.
        Sorts historical documents, patient-reported dates, relative durations, and current visit facts.
        """
        facts = db.query(ClinicalAnswer).join(ClinicalAnswer.turn).filter(
            ClinicalAnswer.turn.has(session_id=session_id)
        ).all()

        timeline = []
        for fact in facts:
            # Determine source type based on evidence
            source_type = "PATIENT_REPORTED"
            if fact.evidence:
                source_type = fact.evidence.source_type
            
            val = fact.value
            status = val.get("status", "current").lower()
            
            event_date = None
            is_approximate = fact.is_approximate
            
            if status == "historical":
                # Check for explicit date in the fact or use a dummy fallback
                # In real scenario, this would parse patient_reported_date
                event_date = fact.patient_reported_date or "historical"
                
            elif fact.relative_duration:
                event_date = f"Duration: {fact.relative_duration}"
            else:
                event_date = "Current Visit"
                
            timeline.append({
                "fact_id": str(fact.id),
                "slot": fact.slot,
                "value": fact.value,
                "status": status,
                "event_date": event_date,
                "is_approximate": is_approximate,
                "source_type": source_type,
                "evidence_id": str(fact.evidence_id) if fact.evidence_id else None
            })
            
        # Basic sorting logic: Historical first, then Relative Durations, then Current Visit
        def sort_key(t):
            d = t["event_date"]
            if d == "historical" or (isinstance(d, str) and d.startswith("19") or d.startswith("20")):
                return 0
            if isinstance(d, str) and d.startswith("Duration:"):
                return 1
            return 2

        timeline.sort(key=sort_key)
        return timeline
