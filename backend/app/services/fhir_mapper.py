import uuid
from typing import Dict, Any, List
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.patient import Encounter
from app.models.user import User
from app.services.export_gating import ExportEligibilityEvaluator
from app.services.terminology_mapper import TerminologyMapper

class FHIRMapper:
    """
    Transforms eligible canonical records to FHIR R4 Document Bundle.
    """
    @staticmethod
    def build_fhir_bundle(encounter_id: str, db: Session) -> Dict[str, Any]:
        enc_uuid = uuid.UUID(encounter_id) if isinstance(encounter_id, str) else encounter_id
        encounter = db.query(Encounter).filter(Encounter.id == enc_uuid).first()
        if not encounter:
            raise ValueError("Encounter not found")
            
        patient = encounter.patient
        
        # 1. Check eligibility
        report = ExportEligibilityEvaluator.evaluate(encounter_id, db)
        if "error" in report:
            raise ValueError(report["error"])
            
        eligible_facts = report["eligible_resources"]
        
        # Base URLs for FHIR R4
        # Using placeholder domain for standard compliant IDs
        system_domain = "https://swasthyasaathi.example.com"
        
        composition_id = str(uuid.uuid4())
        patient_id = str(patient.id)
        encounter_fhir_id = str(encounter.id)
        practitioner_id = str(encounter.doctor_id) if encounter.doctor_id else "unknown-practitioner"
        
        now_str = datetime.now(timezone.utc).isoformat()
        
        # 2. Composition (Must be first entry in document bundle)
        composition = {
            "resourceType": "Composition",
            "id": composition_id,
            "status": "final",
            "type": {
                "coding": [{
                    "system": "http://loinc.org",
                    "code": "11503-0",
                    "display": "Medical records"
                }]
            },
            "subject": {"reference": f"Patient/{patient_id}"},
            "encounter": {"reference": f"Encounter/{encounter_fhir_id}"},
            "date": now_str,
            "author": [{"reference": f"Practitioner/{practitioner_id}"}],
            "title": f"Clinical Note for {patient.full_name}",
            "section": [
                {
                    "title": "Clinical Findings",
                    "code": {
                        "coding": [{
                            "system": "http://loinc.org",
                            "code": "10164-2",
                            "display": "History of Present illness"
                        }]
                    },
                    "entry": [] # populated dynamically
                }
            ]
        }
        
        entries = [
            {"fullUrl": f"{system_domain}/Composition/{composition_id}", "resource": composition}
        ]
        
        # 3. Patient
        patient_resource = {
            "resourceType": "Patient",
            "id": patient_id,
            "name": [{"text": patient.full_name}],
            "gender": patient.sex.lower() if patient.sex else "unknown",
        }
        # Masked ABHA handling if requested/present
        if patient.abha_number:
            patient_resource["identifier"] = [{
                "type": {
                    "coding": [{"system": "http://terminology.hl7.org/CodeSystem/v2-0203", "code": "MR"}]
                },
                "system": "https://healthid.ndhm.gov.in",
                "value": patient.abha_number
            }]
            
        entries.append({"fullUrl": f"{system_domain}/Patient/{patient_id}", "resource": patient_resource})
        
        # 4. Encounter
        encounter_resource = {
            "resourceType": "Encounter",
            "id": encounter_fhir_id,
            "status": "finished",
            "class": {
                "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                "code": "AMB",
                "display": "ambulatory"
            },
            "subject": {"reference": f"Patient/{patient_id}"},
            "period": {"start": encounter.created_at.isoformat()}
        }
        entries.append({"fullUrl": f"{system_domain}/Encounter/{encounter_fhir_id}", "resource": encounter_resource})
        
        # 5. Practitioner
        doc_user = db.query(User).filter(User.id == encounter.doctor_id).first() if encounter.doctor_id else None
        doc_name = doc_user.username if doc_user else "Attending Clinician"
        if doc_name and not doc_name.lower().startswith("dr"):
            doc_name = f"Dr. {doc_name}"

        practitioner_resource = {
            "resourceType": "Practitioner",
            "id": practitioner_id,
            "name": [{"text": doc_name}]
        }
        entries.append({"fullUrl": f"{system_domain}/Practitioner/{practitioner_id}", "resource": practitioner_resource})
        
        # 6. Clinical Facts & Provenance
        for fact in eligible_facts:
            fact_id = fact["fact_id"]
            
            # Map slot semantics to FHIR types
            # "medical_history" -> Condition
            # "current_symptom" -> Observation
            # "lifestyle" -> Observation
            resource_type = "Observation"
            if fact["slot"] == "medical_history":
                resource_type = "Condition"
                
            code_concept = {"text": fact["value"]}
            if fact.get("mapping"):
                codings = [{
                    "system": fact["mapping"]["system"],
                    "code": fact["mapping"]["code"],
                    "display": fact["mapping"]["display"]
                }]
                if fact["mapping"].get("namaste_code"):
                    codings.append({
                        "system": "http://ayush.gov.in/namaste",
                        "code": fact["mapping"]["namaste_code"],
                        "display": fact["mapping"].get("namaste_display") or fact["mapping"]["display"]
                    })
                code_concept["coding"] = codings
                
            clinical_res = {
                "resourceType": resource_type,
                "id": fact_id,
                "subject": {"reference": f"Patient/{patient_id}"},
                "encounter": {"reference": f"Encounter/{encounter_fhir_id}"}
            }
            
            if resource_type == "Condition":
                clinical_res["code"] = code_concept
                clinical_res["clinicalStatus"] = {
                    "coding": [{"system": "http://terminology.hl7.org/CodeSystem/condition-clinical", "code": "active"}]
                }
            else: # Observation
                clinical_res["status"] = "final"
                clinical_res["code"] = code_concept
                clinical_res["valueString"] = fact["value"]
                
            # Ayurveda Semantics Extension (Optional, as an example)
            if encounter.specialty == "AYURVEDA":
                clinical_res["extension"] = [{
                    "url": f"{system_domain}/StructureDefinition/ayurveda-context",
                    "valueString": "Canonical Ayurveda Fact"
                }]
                
            entries.append({"fullUrl": f"{system_domain}/{resource_type}/{fact_id}", "resource": clinical_res})
            composition["section"][0]["entry"].append({"reference": f"{resource_type}/{fact_id}"})
            
            # Standard Provenance Resource
            provenance_id = str(uuid.uuid4())
            provenance = {
                "resourceType": "Provenance",
                "id": provenance_id,
                "target": [{"reference": f"{resource_type}/{fact_id}"}],
                "recorded": now_str,
                "agent": [{
                    "type": {
                        "coding": [{"system": "http://terminology.hl7.org/CodeSystem/provenance-participant-type", "code": "author"}]
                    },
                    "who": {"reference": f"Practitioner/{practitioner_id}" if fact["status"] == "PHYSICIAN_VERIFIED" else f"Patient/{patient_id}"}
                }],
                "entity": [{
                    "role": "source",
                    "what": {"identifier": {"system": f"{system_domain}/Evidence", "value": fact_id}} # Pointing to the internal evidence canonical ID
                }]
            }
            entries.append({"fullUrl": f"{system_domain}/Provenance/{provenance_id}", "resource": provenance})
            
        bundle = {
            "resourceType": "Bundle",
            "id": str(uuid.uuid4()),
            "type": "document",
            "timestamp": now_str,
            "entry": entries
        }
        
        return bundle
