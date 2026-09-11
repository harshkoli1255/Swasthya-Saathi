import asyncio
import sys
import uuid
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
sys.path.append("/Users/harshkoli/Patient-Case-Taking-Software/backend")
from app.models.patient import Encounter, Patient
from app.models.session import IntakeSession
from app.models.user import User

from playwright.async_api import async_playwright

async def run():
    engine = create_engine("sqlite:///./swasthyasaathi.db")
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = SessionLocal()
    enc_id = str(uuid.uuid4())
    patient_id = str(uuid.uuid4())
    session_id = str(uuid.uuid4())
    session_token = f"demo-a11y-{uuid.uuid4().hex[:8]}"
    
    pat = Patient(id=patient_id, full_name="A11y Test Patient", age=30, sex="M")
    session.add(pat)
    enc = Encounter(id=enc_id, patient_id=patient_id, opd_id="OPD-A11y", status="REGISTERED")
    session.add(enc)
    intake = IntakeSession(id=session_id, encounter_id=enc_id, public_token=session_token, state="CONSENT_PENDING", language="en")
    session.add(intake)
    session.commit()
    session.close()

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto("http://localhost:5174/doctor/login")
        await page.get_by_label("Username", exact=False).fill("doctor")
        await page.get_by_label("Password", exact=False).fill("password")
        await page.get_by_role("button", name="Sign In", exact=False).click()
        await page.wait_for_timeout(2000)
        
        await page.goto(f"http://localhost:5174/doctor/overview/{enc_id}")
        await page.wait_for_timeout(2000)
        
        html = await page.content()
        with open("overview_html.txt", "w") as f:
            f.write(html)
        print("HTML saved to overview_html.txt")
        await browser.close()

asyncio.run(run())
