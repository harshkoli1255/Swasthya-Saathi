import asyncio
import sys
import os
from playwright.async_api import async_playwright

async def run_a11y_tests():
    print("Starting Automated Accessibility Scan (Axe-Core)...")
    axe_script_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../web/node_modules/axe-core/axe.min.js"))
    
    if not os.path.exists(axe_script_path):
        print(f"FAIL: Local axe-core not found at {axe_script_path}")
        sys.exit(1)

    with open(axe_script_path, "r") as f:
        axe_script = f.read()

    async with async_playwright() as p:
        try:
            browser = await p.chromium.launch()
            page = await browser.new_page()
            
            # Helper to run Axe on a given path
            async def scan_path(name, path, pre_steps=None):
                print(f"Scanning {name}...")
                await page.goto(f'http://localhost:5174{path}')
                await page.wait_for_timeout(2000)
                if pre_steps:
                    await pre_steps(page)
                    await page.wait_for_timeout(1000)
                await page.evaluate(axe_script)
                results = await page.evaluate("async () => { return await axe.run(); }")
                violations = results.get('violations', [])
                if violations:
                    print(f"  -> {len(violations)} violations found")
                    for v in violations:
                        print(f"     [{v['impact']}] {v['id']}: {v['description']}")
                else:
                    print(f"  -> PASS")
                return violations

            all_violations = []

            # 1. Patient Intake Homepage
            v = await scan_path("Patient Intake Home", "/")
            all_violations.extend(v)
            
            # To test Intake routes properly, we need a valid token. Let's just create one.
            import sys
            sys.path.append("/Users/harshkoli/Patient-Case-Taking-Software/backend")
            import uuid
            from sqlalchemy import create_engine
            from sqlalchemy.orm import sessionmaker
            from app.models.patient import Encounter, Patient
            from app.models.session import IntakeSession
            from app.models.user import User
            from app.core.security import hash_password
            
            engine = create_engine("sqlite:///./swasthyasaathi.db")
            SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
            session = SessionLocal()
            
            # Create doctor if needed
            if not session.query(User).filter_by(username="doctor").first():
                doc = User(
                    id=uuid.uuid4(),
                    username="doctor",
                    password_hash=hash_password("password"),
                    full_name="Dr. A11y",
                    role="DOCTOR",
                    is_active=True
                )
                session.add(doc)
            
            enc_id = uuid.uuid4()
            patient_id = uuid.uuid4()
            session_id = uuid.uuid4()
            session_token = f"demo-a11y-{uuid.uuid4().hex[:8]}"
            
            pat = Patient(id=patient_id, full_name="A11y Test Patient", age=30, sex="M")
            session.add(pat)
            enc = Encounter(id=enc_id, patient_id=patient_id, opd_id="OPD-A11y", status="REGISTERED")
            session.add(enc)
            intake = IntakeSession(id=session_id, encounter_id=enc_id, public_token=session_token, state="CONSENT_PENDING", language="en")
            session.add(intake)
            session.commit()
            
            # Modals/Dialogs are on Consent page or other pages
            async def open_modal(page):
                # E.g. clicking something that opens a modal
                pass
            
            v = await scan_path("Patient Consent", f"/intake/{session_token}/consent")
            all_violations.extend(v)
            
            v = await scan_path("Upload / Recording Controls (Documents)", f"/intake/{session_token}/documents")
            all_violations.extend(v)

            # Login to doctor portal
            print("Logging into Doctor Portal...")
            await page.goto("http://localhost:5174/doctor/login")
            await page.get_by_label("Username", exact=False).fill("doctor")
            await page.get_by_label("Password", exact=False).fill("password")
            await page.get_by_role("button", name="Sign In", exact=False).click()
            await page.wait_for_timeout(2000)

            v = await scan_path("Doctor Dashboard (Queue)", "/doctor/queue")
            all_violations.extend(v)
            
            v = await scan_path("Doctor Patient Overview (Timeline & Summary)", f"/doctor/overview/{enc_id}")
            all_violations.extend(v)
            
            session.close()

            if len(all_violations) > 0:
                print("\nAutomated Accessibility: FAIL")
                sys.exit(1)
            else:
                print("\nAutomated Accessibility: PASS")
                
        except Exception as e:
            print(f"\nAutomated Accessibility FAIL: {e}")
            sys.exit(1)
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(run_a11y_tests())
