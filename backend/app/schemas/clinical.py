from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Literal

class ExtractedBase(BaseModel):
    model_config = ConfigDict(extra="ignore")

class ChiefComplaintFact(ExtractedBase):
    symptom: Optional[str] = Field(description="The primary symptom normalized (e.g. abdominal pain). Omit if no symptom found.", default=None)
    character: Optional[str] = Field(description="Character of the symptom (e.g. sharp, dull)", default=None)
    severity: Optional[str] = Field(description="Severity of the symptom if explicitly stated (e.g. mild, severe). Do not infer from vague text.", default=None)
    aggravating_factor: Optional[str] = Field(description="What makes the symptom worse if stated (e.g. after eating).", default=None)
    relieving_factor: Optional[str] = Field(description="What makes the symptom better if stated (e.g. resting).", default=None)

class DurationFact(ExtractedBase):
    unit: Optional[str] = Field(description="Unit of time (e.g. days, weeks, months). Omit if no duration found.", default=None)
    value: Optional[int] = Field(description="Numeric value of duration", default=None)

class SeverityFact(ExtractedBase):
    level: Optional[str] = Field(description="Severity level. Must be one of: mild, moderate, severe. Preserve original text if uncertain, do not manufacture certainty.", default=None)

class MedicalHistoryFact(ExtractedBase):
    condition: Optional[str] = Field(description="Medical condition name (e.g. diabetes). Use 'none' if explicitly denied. Omit if not mentioned.", default=None)

class AgniDigestionFact(ExtractedBase):
    appetite: Optional[str] = Field(description="Appetite state: normal (Samagni), sluggish/low (Mandagni), irregular (Vishamagni), sharp/excessive (Tikshnagni)", default=None)
    digestion_issues: Optional[str] = Field(description="Digestive symptoms (e.g. bloating, acidity, burning sensation, constipation, loose motions)", default=None)
    bowel_regularity: Optional[str] = Field(description="Bowel habit regularity (e.g. regular, irregular, constipated)", default=None)

class SleepPatternFact(ExtractedBase):
    quality: Optional[str] = Field(description="Sleep quality: sound, disturbed, difficulty falling asleep (insomnia), excessive sleepiness", default=None)
    duration_hours: Optional[float] = Field(description="Approximate sleep duration in hours", default=None)
    morning_refreshment: Optional[str] = Field(description="Whether patient feels refreshed or fatigued upon waking", default=None)

class ThermalPreferenceFact(ExtractedBase):
    preference: Optional[str] = Field(description="Thermal preference: cold sensitive / prefers warmth (Sheeta intolerance), heat sensitive / prefers coolness (Ushna intolerance), neutral/balanced", default=None)

class LifestyleDietFact(ExtractedBase):
    diet_type: Optional[str] = Field(description="Diet type: vegetarian, non-vegetarian, vegan", default=None)
    meal_regularity: Optional[str] = Field(description="Meal schedule regularity: regular, irregular", default=None)
    dominant_taste: Optional[str] = Field(description="Dominant taste preference or habits (e.g. spicy, sweet, salty, sour, oily)", default=None)
    habits: Optional[str] = Field(description="Lifestyle habits (e.g. tea/coffee frequency, late night meals, physical activity)", default=None)

# Mapping from slot name to schema
SLOT_SCHEMAS = {
    "chief_complaint": ChiefComplaintFact,
    "duration": DurationFact,
    "severity": SeverityFact,
    "medical_history": MedicalHistoryFact,
    "agni_digestion": AgniDigestionFact,
    "sleep_pattern": SleepPatternFact,
    "thermal_preference": ThermalPreferenceFact,
    "lifestyle_diet": LifestyleDietFact
}

class LLMExtractionResult(BaseModel):
    extracted_value: dict | None = Field(description="The extracted fields matching the target schema. Null if nothing could be safely extracted.")
    evidence: str | None = Field(description="A direct quote or literal substring from the patient's text that supports the extraction.")
    confidence: float = Field(description="A float between 0.0 and 1.0 indicating extraction quality and certainty.", ge=0.0, le=1.0)
    status: str = Field(description="Status of extraction, usually 'AI_NORMALIZED'", default="AI_NORMALIZED")

class SummarySection(BaseModel):
    text: str = Field(description="The narrative prose for this section of the summary.")
    evidence_ids: list[str] = Field(description="A list of evidence UUIDs that explicitly support the text in this section.", default_factory=list)

class StructuredSummaryResult(BaseModel):
    chief_complaint: Optional[str] = Field(description="Normalized summary of chief complaint", default=None)
    history_of_present_illness: Optional[str] = Field(description="Narrative of the present illness including onset, character, aggravating/relieving factors", default=None)
    past_medical_history: Optional[str] = Field(description="Relevant past medical history or explicitly denied conditions", default=None)
    ayush_observations: Optional[str] = Field(description="AYUSH specific observations including Agni, Nidra, Ahara, and thermal preferences", default=None)
    sections: list[SummarySection] = Field(description="List of narrative sections with evidence backing.", default_factory=list)
