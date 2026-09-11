import uuid
from typing import List
from sqlalchemy.orm import Session
from app.models.session import ClinicalAnswer, ClinicalConflict

class ConflictDetector:
    @staticmethod
    def detect_conflicts(db: Session, session_id: uuid.UUID) -> List[ClinicalConflict]:
        """
        Detects conflicts between extracted clinical facts within a session.
        For example: a document says 'Diabetes Type 2', but the patient says 'No chronic conditions'.
        """
        facts = db.query(ClinicalAnswer).join(ClinicalAnswer.turn).filter(
            ClinicalAnswer.turn.has(session_id=session_id)
        ).all()
        
        # Group by slot
        slots = {}
        for fact in facts:
            if fact.slot not in slots:
                slots[fact.slot] = []
            slots[fact.slot].append(fact)
            
        new_conflicts = []
        
        # Evaluate combinations within slots for obvious conflicts.
        # This is deterministic and conservative: if two facts share a slot but have opposing logical structures
        # (e.g. current vs historical, or negated vs present), flag for review.
        for slot, fact_list in slots.items():
            if len(fact_list) < 2:
                continue
                
            for i in range(len(fact_list)):
                for j in range(i + 1, len(fact_list)):
                    fact1 = fact_list[i]
                    fact2 = fact_list[j]
                    
                    # Avoid flagging the exact same facts
                    if fact1.id == fact2.id:
                        continue
                        
                    # Check if conflict already exists
                    existing = db.query(ClinicalConflict).filter(
                        ((ClinicalConflict.fact_id_1 == fact1.id) & (ClinicalConflict.fact_id_2 == fact2.id)) |
                        ((ClinicalConflict.fact_id_1 == fact2.id) & (ClinicalConflict.fact_id_2 == fact1.id))
                    ).first()
                    
                    if existing:
                        continue
                        
                    status1 = fact1.value.get("status", "current").lower()
                    status2 = fact2.value.get("status", "current").lower()
                    
                    val1 = str(fact1.value.get("symptom") or fact1.value.get("condition") or "")
                    val2 = str(fact2.value.get("symptom") or fact2.value.get("condition") or "")
                    
                    is_conflict = False
                    
                    # Case 1: True contradiction (one says 'negated' and the other says 'current')
                    if (status1 == "negated" and status2 == "current") or (status1 == "current" and status2 == "negated"):
                        is_conflict = True
                        
                    # Case 2: Temporal difference (one historical, one current)
                    elif (status1 == "historical" and status2 == "current") or (status1 == "current" and status2 == "historical"):
                        # If they reference the same base condition, they might just be different context, but we still flag for reconciliation.
                        is_conflict = True
                        
                    # Case 3: Duplicate/Rephrased facts
                    elif status1 == status2 and status1 == "current":
                        # Both current, different wording? Might just be duplication. Let doctor reconcile.
                        if val1 and val2 and val1 != val2:
                            is_conflict = True
                            
                    if is_conflict:
                        conflict = ClinicalConflict(
                            session_id=session_id,
                            slot=slot,
                            fact_id_1=fact1.id,
                            fact_id_2=fact2.id,
                            relationship_status="UNRESOLVED"
                        )
                        db.add(conflict)
                        new_conflicts.append(conflict)
                        
        if new_conflicts:
            db.commit()
            for c in new_conflicts:
                db.refresh(c)
                
        return new_conflicts
