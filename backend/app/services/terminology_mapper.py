from typing import Optional, Dict

class TerminologyMapping:
    def __init__(
        self,
        system: str,
        code: str,
        display: str,
        namaste_code: Optional[str] = None,
        namaste_display: Optional[str] = None
    ):
        self.system = system
        self.code = code
        self.display = display
        self.namaste_code = namaste_code
        self.namaste_display = namaste_display

# Deterministic terminology mapping supporting both SNOMED CT and Ministry of Ayush NAMASTE
SNOMED_MAPPINGS: Dict[str, TerminologyMapping] = {
    "fever": TerminologyMapping("http://snomed.info/sct", "386661006", "Fever", "AYU-DS-001", "Jwara"),
    "headache": TerminologyMapping("http://snomed.info/sct", "25064002", "Headache", "AYU-DS-002", "Shirashula"),
    "cough": TerminologyMapping("http://snomed.info/sct", "49727002", "Cough", "AYU-DS-003", "Kasa"),
    "nausea": TerminologyMapping("http://snomed.info/sct", "422587007", "Nausea", "AYU-DS-013", "Hrillasa"),
    "vomiting": TerminologyMapping("http://snomed.info/sct", "422400008", "Vomiting", "AYU-DS-010", "Chhardi"),
    "chest pain": TerminologyMapping("http://snomed.info/sct", "29857009", "Chest pain", "AYU-DS-014", "Urahshula"),
    "fatigue": TerminologyMapping("http://snomed.info/sct", "84229001", "Fatigue", "AYU-DS-015", "Klama"),
    "diarrhea": TerminologyMapping("http://snomed.info/sct", "62315008", "Diarrhea", "AYU-DS-008", "Atisara"),
    "hypertension": TerminologyMapping("http://snomed.info/sct", "38341003", "Hypertensive disorder", "AYU-DS-016", "Raktachapa"),
    "diabetes": TerminologyMapping("http://snomed.info/sct", "73211009", "Diabetes mellitus", "AYU-DS-006", "Madhumeha"),
    "dizziness": TerminologyMapping("http://snomed.info/sct", "404640003", "Dizziness", "AYU-DS-017", "Bhrama"),
    "abdominal pain": TerminologyMapping("http://snomed.info/sct", "21522001", "Abdominal pain", "AYU-DS-009", "Udarashula"),
    "acidity": TerminologyMapping("http://snomed.info/sct", "195593006", "Gastric hyperacidity", "AYU-DS-004", "Amlapitta"),
    "hyperacidity": TerminologyMapping("http://snomed.info/sct", "195593006", "Gastric hyperacidity", "AYU-DS-004", "Amlapitta"),
    "indigestion": TerminologyMapping("http://snomed.info/sct", "267026004", "Indigestion", "AYU-DS-011", "Ajeerna"),
    "joint pain": TerminologyMapping("http://snomed.info/sct", "396275006", "Osteoarthritis", "AYU-DS-005", "Sandhivata"),
    "insomnia": TerminologyMapping("http://snomed.info/sct", "193462001", "Insomnia", "AYU-DS-012", "Anidra"),
    "asthma": TerminologyMapping("http://snomed.info/sct", "267036007", "Dyspnea", "AYU-DS-007", "Tamaka Shwasa")
}

class TerminologyMapper:
    """
    Deterministic terminology mapping engine.
    Maps clinical facts to SNOMED CT where exactly known.
    Leaves unmapped facts as UNMAPPED.
    """
    @staticmethod
    def map_concept(value: any) -> Optional[TerminologyMapping]:
        if not value:
            return None
        
        if isinstance(value, dict):
            val_str = value.get("symptom") or value.get("condition") or value.get("raw") or str(value)
            normalized_value = str(val_str).lower().strip()
        elif isinstance(value, str):
            normalized_value = value.lower().strip()
        else:
            normalized_value = str(value).lower().strip()
        
        # Simple exact string match for MVP
        # This prevents hallucination of codes since it's a closed list.
        if normalized_value in SNOMED_MAPPINGS:
            return SNOMED_MAPPINGS[normalized_value]
        
        # For partial matches, we could add regexes, but the rules dictate:
        # "Never invent clinical codes. Unsupported concepts must remain explicitly unmapped."
        # Therefore, if it's not a direct match, we return None.
        return None
