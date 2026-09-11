import asyncio
import httpx
import os
from uuid import uuid4

API_URL = "http://localhost:8000/api/v1"

async def create_dummy_pdf(path="dummy.pdf"):
    from fpdf import FPDF
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt="Patient: John Doe. Symptom: Severe headache for 2 days. Temp: 101F.", ln=1, align="L")
    pdf.output(path)
    return path

async def create_dummy_audio(path="dummy.wav"):
    import wave
    import struct
    # generate a short silent wave file just for format test, 
    # but wait, Gemini needs actual speech to extract facts. 
    # Since we can't easily synthesize speech without an API, we'll rely on Gemini just returning some text or hallucinating if silent?
    # No, we can just test if the endpoint runs without crashing and passes the file to Gemini.
    obj = wave.open(path, 'w')
    obj.setnchannels(1)
    obj.setsampwidth(2)
    obj.setframerate(44100)
    for i in range(44100):
        value = 0
        data = struct.pack('<h', value)
        obj.writeframesraw(data)
    obj.close()
    return path

async def run_validation():
    print("--- Starting Stage 5 Matrix Validation ---")
    
    # 1. Start Session via DB directly (simulating a doctor queueing a patient)
    import sys
    sys.path.append("/Users/harshkoli/Patient-Case-Taking-Software/backend")
    from app.core.database import SessionLocal
    from app.models.patient import Patient, Encounter
    from app.models.session import IntakeSession, ClinicalQuestion
    import uuid

    db = SessionLocal()
    
    # Create test patient
    patient = Patient(full_name="Test Validation", age=30, sex="Male")
    db.add(patient)
    db.commit()

    # Create encounter
    encounter = Encounter(patient_id=patient.id, opd_id="OPD-VAL-5", status="IN_TAKE")
    db.add(encounter)
    db.commit()

    # Create intake session
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

    async with httpx.AsyncClient(timeout=120.0) as client:
        print(f"Session started: {token}")

        # 2. Get Next Question
        res = await client.post(f"{API_URL}/intake/{token}/interview/next")
        q_data = res.json()
        print("Next Question Data:", q_data)
        q_id = q_data.get("question_id")
        target_slot = q_data.get("target_slot")
        print(f"Got Question: {q_data['text']}")

        # 3. Test Document Upload
        print("Testing Document Upload (PDF)...")
        pdf_path = await create_dummy_pdf()
        with open(pdf_path, "rb") as f:
            res = await client.post(
                f"{API_URL}/intake/{token}/upload/document",
                files={"file": ("dummy.pdf", f, "application/pdf")}
            )
            print("Document Upload Status:", res.status_code)
            if res.status_code == 200:
                print("Document extracted text:", res.json()["extracted_text"])
                doc_evidence_id = res.json()["evidence_id"]
            else:
                print("Document error:", res.text)
                doc_evidence_id = None

        # 4. Test Voice Upload
        import asyncio
        print("Sleeping for 30s to respect Gemini API rate limits...")
        await asyncio.sleep(30)
        
        print("Testing Voice Upload (WAV)...")
        wav_path = await create_dummy_audio()
        with open(wav_path, "rb") as f:
            res = await client.post(
                f"{API_URL}/intake/{token}/upload/voice",
                data={"question_id": q_id, "target_slot": target_slot},
                files={"file": ("dummy.wav", f, "audio/wav")}
            )
            print("Voice Upload Status:", res.status_code)
            if res.status_code == 200:
                print("Voice extracted text:", res.json()["transcript"])
                voice_evidence_id = res.json()["evidence_id"]
            else:
                print("Voice error:", res.text)
                voice_evidence_id = None

        # 5. Submit Answer with Document Evidence
        if doc_evidence_id:
            res = await client.post(f"{API_URL}/intake/{token}/interview/answer", json={
                "question_id": q_id,
                "target_slot": target_slot,
                "raw_text": "I uploaded my lab report showing a severe headache and fever.",
                "evidence_id": doc_evidence_id
            })
            print("Answer Submission Status:", res.status_code)

        print("--- Validation Complete ---")

if __name__ == "__main__":
    asyncio.run(run_validation())
