import uuid
import logging
from typing import List
from sqlalchemy.orm import Session
from app.models.session import ClinicalAnswer, IntakeSession
from app.schemas.clinical import StructuredSummaryResult, SummarySection
from app.core.exceptions import LLMProviderError
import json

logger = logging.getLogger(__name__)

class SummaryGenerator:
    def __init__(self, llm_provider=None, fallback_provider=None):
        self.llm_provider = llm_provider
        self.fallback_provider = fallback_provider

    def generate_summary(self, db: Session, session_id: uuid.UUID) -> StructuredSummaryResult:
        """
        Generates a summary of confirmed/verified clinical facts.
        Attempts primary provider first, fallback provider next, then deterministic.
        """
        facts = db.query(ClinicalAnswer).join(ClinicalAnswer.turn).filter(
            ClinicalAnswer.turn.has(session_id=session_id)
        ).all()
        
        # Use confirmed or verified facts for synthesis
        valid_facts = [
            f for f in facts 
            if f.status in ("PATIENT_CONFIRMED", "PHYSICIAN_VERIFIED")
        ]
        
        if not valid_facts:
            return StructuredSummaryResult(
                chief_complaint="Pre-consultation intake registered",
                history_of_present_illness="Patient arrived at OPD and completed preliminary triage registration. Pre-consultation intake questionnaire is in progress.",
                past_medical_history="Awaiting patient medical history questionnaire.",
                ayush_observations="AYUSH constitutional examination (Agni, Nidra, Satmya) pending physician evaluation.",
                sections=[
                    SummarySection(
                        text="Preliminary case registered. Structured clinical narrative will be compiled as intake facts are recorded.",
                        evidence_ids=[]
                    )
                ]
            )

        allowed_evidence_ids = {str(f.evidence_id) for f in valid_facts if f.evidence_id}
        
        providers = []
        if self.llm_provider:
            providers.append(self.llm_provider)
        if self.fallback_provider and self.fallback_provider is not self.llm_provider:
            providers.append(self.fallback_provider)

        if not providers:
            return self._generate_deterministic_fallback(valid_facts)

        prompt = self._build_prompt(valid_facts)
        for provider in providers:
            try:
                provider_name = type(provider).__name__
                logger.info(f"Attempting clinical summary generation with {provider_name}")
                result = provider.generate_structured_summary(prompt)
                if result:
                    return self._validate_and_sanitize(result, allowed_evidence_ids, valid_facts)
            except Exception as e:
                logger.warning(f"Summary generation with {type(provider).__name__} failed: {e}")

        logger.info("All AI summary providers failed or unavailable. Using deterministic fallback.")
        return self._generate_deterministic_fallback(valid_facts)
            
    def _build_prompt(self, facts: List[ClinicalAnswer]) -> str:
        prompt = "Create a clinical summary using ONLY the following facts:\n"
        for fact in facts:
            evidence_id = str(fact.evidence_id) if fact.evidence_id else "NO_EVIDENCE"
            prompt += f"- ID: {evidence_id} | Slot: {fact.slot} | Value: {json.dumps(fact.value)}\n"
        
        prompt += "\nDo NOT invent facts, diagnoses, treatments, or prescriptions. Do NOT invent new evidence IDs."
        return prompt

    def _validate_and_sanitize(self, result: StructuredSummaryResult, allowed_evidence_ids: set, facts: List[ClinicalAnswer]) -> StructuredSummaryResult:
        sanitized_sections = []
        for section in result.sections:
            valid_ids = []
            for eid in section.evidence_ids:
                if eid in allowed_evidence_ids:
                    valid_ids.append(eid)
                else:
                    logger.warning(f"Discarding invalid evidence ID from LLM: {eid}")
            
            sanitized_sections.append(SummarySection(
                text=section.text,
                evidence_ids=valid_ids
            ))
            
        return StructuredSummaryResult(
            chief_complaint=result.chief_complaint,
            history_of_present_illness=result.history_of_present_illness,
            past_medical_history=result.past_medical_history,
            ayush_observations=result.ayush_observations,
            sections=sanitized_sections
        )
        
    def _generate_deterministic_fallback(self, facts: List[ClinicalAnswer]) -> StructuredSummaryResult:
        sections = []
        fact_by_slot = {f.slot: f for f in facts}

        # 1. Chief Complaint
        cc_fact = fact_by_slot.get("chief_complaint")
        cc_text = None
        if cc_fact and isinstance(cc_fact.value, dict):
            symptom = cc_fact.value.get("symptom") or "Unspecified complaint"
            character = cc_fact.value.get("character")
            severity = cc_fact.value.get("severity")
            parts = [symptom]
            if character:
                parts.append(f"({character})")
            if severity:
                parts.append(f"- {severity} severity")
            cc_text = " ".join(parts)
            evidence_ids = [str(cc_fact.evidence_id)] if cc_fact.evidence_id else []
            sections.append(SummarySection(text=f"Chief Complaint: {cc_text}.", evidence_ids=evidence_ids))

        # 2. History of Present Illness (HPI)
        hpi_parts = []
        hpi_eids = []
        dur_fact = fact_by_slot.get("duration")
        sev_fact = fact_by_slot.get("severity")

        if cc_fact:
            hpi_parts.append(f"Patient presents with {cc_text or 'symptoms'}")
            if cc_fact.evidence_id:
                hpi_eids.append(str(cc_fact.evidence_id))
        
        if dur_fact and isinstance(dur_fact.value, dict):
            val = dur_fact.value.get("value")
            unit = dur_fact.value.get("unit", "days")
            if val is not None:
                hpi_parts.append(f"persisting for approximately {val} {unit}")
            if dur_fact.evidence_id:
                hpi_eids.append(str(dur_fact.evidence_id))

        if sev_fact and isinstance(sev_fact.value, dict):
            lvl = sev_fact.value.get("level")
            if lvl:
                hpi_parts.append(f"rated as {lvl}")
            if sev_fact.evidence_id:
                hpi_eids.append(str(sev_fact.evidence_id))

        hpi_text = ". ".join([p.strip() for p in hpi_parts if p.strip()]) + "." if hpi_parts else None
        if hpi_text and (dur_fact or sev_fact):
            sections.append(SummarySection(text=f"History of Present Illness: {hpi_text}", evidence_ids=hpi_eids))

        # 3. Past Medical History
        pmh_fact = fact_by_slot.get("medical_history")
        pmh_text = None
        if pmh_fact and isinstance(pmh_fact.value, dict):
            cond = pmh_fact.value.get("condition")
            if cond and cond.lower() not in ("none", "no", "denied"):
                pmh_text = f"Reported history of {cond}."
            else:
                pmh_text = "No prior chronic medical conditions reported."
            evidence_ids = [str(pmh_fact.evidence_id)] if pmh_fact.evidence_id else []
            sections.append(SummarySection(text=f"Past Medical History: {pmh_text}", evidence_ids=evidence_ids))

        # 4. AYUSH Specific Observations
        ayush_obs = []
        ayush_eids = []
        agni_fact = fact_by_slot.get("agni_digestion")
        if agni_fact and isinstance(agni_fact.value, dict):
            app = agni_fact.value.get("appetite")
            dig = agni_fact.value.get("digestion_issues")
            bowl = agni_fact.value.get("bowel_regularity")
            desc = []
            if app: desc.append(f"appetite: {app}")
            if dig: desc.append(f"digestion: {dig}")
            if bowl: desc.append(f"bowel: {bowl}")
            if desc:
                ayush_obs.append(f"Agni / Digestion: {', '.join(desc)}")
            if agni_fact.evidence_id:
                ayush_eids.append(str(agni_fact.evidence_id))

        sleep_fact = fact_by_slot.get("sleep_pattern")
        if sleep_fact and isinstance(sleep_fact.value, dict):
            q = sleep_fact.value.get("quality")
            hrs = sleep_fact.value.get("duration_hours")
            ref = sleep_fact.value.get("morning_refreshment")
            desc = []
            if q: desc.append(f"quality: {q}")
            if hrs: desc.append(f"{hrs} hrs/night")
            if ref: desc.append(f"morning status: {ref}")
            if desc:
                ayush_obs.append(f"Nidra / Sleep: {', '.join(desc)}")
            if sleep_fact.evidence_id:
                ayush_eids.append(str(sleep_fact.evidence_id))

        therm_fact = fact_by_slot.get("thermal_preference")
        if therm_fact and isinstance(therm_fact.value, dict):
            pref = therm_fact.value.get("preference")
            if pref:
                ayush_obs.append(f"Thermal Satmya: {pref}")
            if therm_fact.evidence_id:
                ayush_eids.append(str(therm_fact.evidence_id))

        diet_fact = fact_by_slot.get("lifestyle_diet")
        if diet_fact and isinstance(diet_fact.value, dict):
            dt = diet_fact.value.get("diet_type")
            reg = diet_fact.value.get("meal_regularity")
            taste = diet_fact.value.get("dominant_taste")
            desc = []
            if dt: desc.append(f"diet: {dt}")
            if reg: desc.append(f"regularity: {reg}")
            if taste: desc.append(f"dominant taste: {taste}")
            if desc:
                ayush_obs.append(f"Ahara & Vihara: {', '.join(desc)}")
            if diet_fact.evidence_id:
                ayush_eids.append(str(diet_fact.evidence_id))

        ayush_text = "; ".join(ayush_obs) + "." if ayush_obs else None
        if ayush_text:
            sections.append(SummarySection(text=f"AYUSH Functional Assessment: {ayush_text}", evidence_ids=ayush_eids))

        if not sections:
            sections.append(SummarySection(text="No confirmed clinical facts available.", evidence_ids=[]))
            
        return StructuredSummaryResult(
            chief_complaint=cc_text,
            history_of_present_illness=hpi_text,
            past_medical_history=pmh_text,
            ayush_observations=ayush_text,
            sections=sections
        )
