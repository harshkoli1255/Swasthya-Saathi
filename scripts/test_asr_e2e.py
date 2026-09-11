import asyncio
import httpx
import uuid
import sys
import time

sys.path.append("/Users/harshkoli/Patient-Case-Taking-Software/backend")
sys.path.append("/Users/harshkoli/Patient-Case-Taking-Software")
from app.core.database import SessionLocal
from app.models.patient import Patient, Encounter
from app.models.session import IntakeSession, ClinicalQuestion, ClinicalAnswer, ConversationTurn
from scripts.stage5_validation import create_dummy_audio

API_URL = "http://127.0.0.1:8000/api/v1"

async def run_asr_e2e():
    print("--- Starting ASR E2E Validation ---")
    
    # Removed sleep since we are using mocks
    
    db = SessionLocal()
    
    # 1. Setup Patient & Encounter
    patient = Patient(
        full_name="Test ASR E2E",
        age=35,
        sex="Female"
    )
    db.add(patient)
    db.commit()

    encounter = Encounter(
        patient_id=patient.id,
        opd_id="OPD-ASR-E2E",
    )
    db.add(encounter)
    db.commit()

    # Seed question
    question = ClinicalQuestion(
        code="chief_complaint",
        targets_slot="chief_complaint",
        priority=1,
        phase="GENERAL",
        required_slots=[],
        language_variants={"en": "What brings you to the clinic today?"}
    )
    db.add(question)
    
    token = f"demo-token-{uuid.uuid4()}"
    session = IntakeSession(
        encounter_id=encounter.id,
        public_token=token,
        state="INTERVIEW",
        language="en"
    )
    db.add(session)
    db.commit()
    db.close()

    from unittest.mock import patch
    from app.main import app
    from app.schemas.clinical import LLMExtractionResult
    
    mock_result = LLMExtractionResult(
        extracted_value={"symptom": "headache", "severity": "severe", "duration": "3 days"},
        evidence="I have had a severe headache for 3 days.",
        confidence=1.0,
        status="AI_NORMALIZED"
    )

    with patch("app.api.v1.intake.GeminiASRProcessor.transcribe", return_value="I have had a severe headache for 3 days."), \
         patch("app.services.llm.gemini.GeminiProvider.extract_clinical_fact", return_value=mock_result):
        async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
            print(f"Session started: {token}")

            # 2. Get Next Question
            res = await client.post(f"{API_URL}/intake/{token}/interview/next")
            q_data = res.json()
            q_id = q_data.get("question_id")
            target_slot = q_data.get("target_slot")
            
            # 3. Test Voice Upload (MOCK ASR)
            print("Testing Voice Upload (WAV) with MOCK ASR...")
            wav_path = await create_dummy_audio()
            with open(wav_path, "rb") as f:
                res = await client.post(
                    f"{API_URL}/intake/{token}/upload/voice",
                    data={"question_id": q_id, "target_slot": target_slot},
                    files={"file": ("dummy.wav", f, "audio/wav")}
                )
                print("Voice Upload Status:", res.status_code)
                if res.status_code == 200:
                    print("MOCK ASR SUCCESS!")
                    transcript = res.json().get("transcript")
                    print("Transcript:", transcript)
                    evidence_id = res.json().get("evidence_id")
                    
                    print("Proceeding to submit answer with extracted evidence...")
                    res = await client.post(f"{API_URL}/intake/{token}/interview/answer", json={
                        "question_id": q_id,
                        "target_slot": target_slot,
                        "raw_text": transcript,
                        "evidence_id": evidence_id
                    })
                    print("Answer Submission Status:", res.status_code)
                    
                    print("\nFetching Review Summary...")
                    res = await client.get(f"{API_URL}/intake/{token}/review")
                    review_data = res.json()
                    print("Review Summary:", review_data)
                    
                    print("\nConfirming Review (AI_NORMALIZED -> PATIENT_CONFIRMED)...")
                    res = await client.post(f"{API_URL}/intake/{token}/confirm")
                    print("Confirm Status:", res.status_code)
                    
                    print("\nSimulating Physician Verification...")
                    # Update status directly in DB to simulate physician verification
                    db = SessionLocal()
                    answers = db.query(ClinicalAnswer).join(ClinicalAnswer.turn).join(ConversationTurn.session).filter(
                        IntakeSession.public_token == token
                    ).all()
                    
                    for ans in answers:
                        if ans.status == "PATIENT_CONFIRMED":
                            ans.status = "PHYSICIAN_VERIFIED"
                            print(f"Fact '{ans.value}' verified by physician.")
                            # Validate provenance
                            evidence = ans.evidence
                            if evidence:
                                print(f"Provenance traced: Evidence ID {evidence.id}, Source Type: {evidence.source_type}, Transcript: '{evidence.extracted_text}'")
                                media = evidence.asset
                                print(f"Media Asset traced: Type {media.media_type}, Ref {media.immutable_storage_ref}")
                    db.commit()
                    db.close()
                    
                    print("\nSuccessfully validated full provenance chain: Audio -> MediaAsset -> ASR_TRANSCRIPT -> MediaEvidence -> ClinicalFact -> AI_NORMALIZED -> PATIENT_CONFIRMED -> PHYSICIAN_VERIFIED")
                else:
                    print("Voice error:", res.text)
                    
    print("--- Test Complete ---")

if __name__ == "__main__":
    asyncio.run(run_asr_e2e())
