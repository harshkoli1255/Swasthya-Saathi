import re
import uuid
from typing import List
from app.models.session import ClinicalAnswer, SafetyAlert, IntakeSession
from app.models.patient import Encounter
from sqlalchemy.orm import Session
from datetime import datetime, timezone
import logging

logger = logging.getLogger(__name__)

class SafetyRule:
    def __init__(self, rule_id: str, category: str, pattern: str, explanation: str, triage_level: str = "URGENT"):
        self.rule_id = rule_id
        self.category = category
        self.pattern = re.compile(pattern, re.IGNORECASE)
        self.explanation = explanation
        self.triage_level = triage_level

# Deterministic safety rules - transparent, non-LLM, clinically auditable red flags.
SAFETY_RULES = [
    SafetyRule(
        rule_id="RF-001",
        category="CHEST_PAIN",
        pattern=r"\b(chest pain|pain in chest|angina|chest pressure|chest tightness|crushing chest)\b",
        explanation="Patient reported symptoms associated with chest discomfort, requiring urgent clinical review.",
        triage_level="EMERGENCY"
    ),
    SafetyRule(
        rule_id="RF-002",
        category="BREATHING_DIFFICULTY",
        pattern=r"\b(shortness of breath|difficulty breathing|dyspnea|can't breathe|choking|gasping)\b",
        explanation="Patient reported symptoms of respiratory distress, requiring urgent clinical review.",
        triage_level="URGENT"
    ),
    SafetyRule(
        rule_id="RF-003",
        category="UNCONSCIOUSNESS",
        pattern=r"\b(fainted|passed out|unconscious|blacked out|loss of consciousness|syncope|collapsed)\b",
        explanation="Patient reported a loss of consciousness event, requiring urgent clinical review.",
        triage_level="EMERGENCY"
    ),
    SafetyRule(
        rule_id="RF-004",
        category="SEVERE_BLEEDING",
        pattern=r"\b(severe bleeding|hemorrhage|bleeding heavily|coughing up blood|vomiting blood|hematemesis)\b",
        explanation="Patient reported severe bleeding, requiring urgent clinical review.",
        triage_level="EMERGENCY"
    ),
    SafetyRule(
        rule_id="RF-005",
        category="NEUROLOGICAL_DEFICIT",
        pattern=r"\b(facial droop|face drooping|arm weakness|slurred speech|sudden numbness|cannot move arm|cannot move leg|hemiplegia)\b",
        explanation="Patient reported sudden acute neurological deficit symptoms (stroke indicators), requiring immediate emergency evaluation.",
        triage_level="EMERGENCY"
    ),
    SafetyRule(
        rule_id="RF-006",
        category="ANAPHYLAXIS",
        pattern=r"\b(swelling of throat|throat closing|tongue swelling|lip swelling and breathing|severe allergic reaction)\b",
        explanation="Patient reported acute signs of airway compromise or severe systemic allergic reaction, requiring emergency review.",
        triage_level="EMERGENCY"
    ),
    SafetyRule(
        rule_id="RF-007",
        category="SEVERE_INFECTION",
        pattern=r"\b(stiff neck and fever|fever with confusion|high fever and neck pain|delirium with fever)\b",
        explanation="Patient reported high fever with acute neurological signs (meningismus/septic presentation), requiring urgent clinical review.",
        triage_level="EMERGENCY"
    )
]

class SafetyEngine:
    @staticmethod
    def evaluate_facts(db: Session, session_id: uuid.UUID, new_facts: List[ClinicalAnswer]) -> List[SafetyAlert]:
        """
        Evaluates structured facts (not raw unverified text) against deterministic safety rules.
        Automatically updates encounter triage_level to EMERGENCY or URGENT when triggered.
        """
        alerts = []
        highest_triage = None
        
        session = db.query(IntakeSession).filter(IntakeSession.id == session_id).first()
        encounter = session.encounter if session else None

        for fact in new_facts:
            val = fact.value or {}
            
            # Skip negated or historical observations
            status_flag = val.get("status", "current").lower()
            if status_flag in ("negated", "historical"):
                continue
                
            symptom_text = val.get("symptom", "")
            condition_text = val.get("condition", "")
            raw_text = val.get("raw", "")
            combined_text = f"{symptom_text} {condition_text} {raw_text}".strip()
            
            if not combined_text:
                continue

            for rule in SAFETY_RULES:
                if rule.pattern.search(combined_text):
                    logger.info(f"Safety rule {rule.rule_id} ({rule.category}) matched on fact {fact.id}")
                    
                    # Prevent duplicate alerts for the same rule and session
                    existing_alert = db.query(SafetyAlert).filter(
                        SafetyAlert.session_id == session_id,
                        SafetyAlert.rule_id == rule.rule_id
                    ).first()
                    
                    if existing_alert:
                        continue

                    evidence_ids = []
                    if fact.evidence_id:
                        evidence_ids.append(str(fact.evidence_id))
                        
                    alert = SafetyAlert(
                        session_id=session_id,
                        rule_id=rule.rule_id,
                        alert_category=rule.category,
                        deterministic_explanation=rule.explanation,
                        status="DEMO_PENDING_CLINICAL_REVIEW",
                        matched_fact_ids=[str(fact.id)],
                        evidence_ids=evidence_ids
                    )
                    db.add(alert)
                    alerts.append(alert)
                    
                    if rule.triage_level == "EMERGENCY":
                        highest_triage = "EMERGENCY"
                    elif rule.triage_level == "URGENT" and highest_triage != "EMERGENCY":
                        highest_triage = "URGENT"

        # Escalate encounter triage level if safety alerts were triggered
        if highest_triage and encounter:
            if highest_triage == "EMERGENCY" or (highest_triage == "URGENT" and encounter.triage_level != "EMERGENCY"):
                logger.info(f"Escalating encounter {encounter.id} triage_level from {encounter.triage_level} to {highest_triage}")
                encounter.triage_level = highest_triage

        if alerts:
            db.commit()
            for alert in alerts:
                db.refresh(alert)
                
        return alerts
