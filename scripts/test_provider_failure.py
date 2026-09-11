import asyncio
import httpx
import uuid
import os
import sys

# Temporarily override API key for test
os.environ["GEMINI_API_KEY"] = "invalid-key-for-testing-503-error"

# Ensure we can import backend code
sys.path.append("/Users/harshkoli/Patient-Case-Taking-Software/backend")
from app.main import app
from app.core.database import SessionLocal
from app.models.patient import Patient, Encounter
from app.models.session import IntakeSession, ClinicalQuestion
sys.path.append("/Users/harshkoli/Patient-Case-Taking-Software")
from scripts.stage5_validation import create_dummy_audio
from unittest.mock import patch

API_URL = "http://test/api/v1"

async def test_503_handling():
    print("--- Starting Provider Failure Test ---")
    db = SessionLocal()
    
    # 1. Setup Patient & Encounter
    patient = Patient(
        full_name="Test Validation",
        age=30,
        sex="Male"
    )
    db.add(patient)
    db.commit()

    encounter = Encounter(
        patient_id=patient.id,
        opd_id="OPD-VAL-5",
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

    with patch("app.api.v1.intake.GeminiASRProcessor.transcribe", side_effect=Exception("Mocked Gemini 429 Error")):
        async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
            print(f"Session started: {token}")

            # 2. Get Next Question
            res = await client.post(f"{API_URL}/intake/{token}/interview/next")
            q_data = res.json()
            q_id = q_data.get("question_id")
            target_slot = q_data.get("target_slot")
            
            # 3. Test Voice Upload with mock Provider Failure
            print("Testing Voice Upload (WAV) with Provider Failure...")
            wav_path = await create_dummy_audio()
            with open(wav_path, "rb") as f:
                res = await client.post(
                    f"{API_URL}/intake/{token}/upload/voice",
                    data={"question_id": q_id, "target_slot": target_slot},
                    files={"file": ("dummy.wav", f, "audio/wav")}
                )
                print("Voice Upload Status:", res.status_code)
                if res.status_code == 503:
                    print("SUCCESS: Received expected 503 Provider Error")
                    print("Patient-facing message:", res.json().get("detail"))
                elif res.status_code == 500:
                    print("FAIL: Received unhandled 500 error!")
                else:
                    print("Unexpected status:", res.status_code, res.text)
                    
    print("--- Test Complete ---")

if __name__ == "__main__":
    asyncio.run(test_503_handling())
