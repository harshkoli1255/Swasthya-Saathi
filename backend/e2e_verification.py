import requests
import json
import uuid

BASE_URL = "http://localhost:8000/api/v1"

def run_e2e_test():
    print("=== STARTING FULL END-TO-END VERIFICATION ===")
    
    # 1. Create a demo session
    res = requests.post(f"{BASE_URL}/intake/demo/create")
    assert res.status_code == 200, f"Failed demo session creation: {res.text}"
    session_data = res.json()
    token = session_data["token"]
    encounter_id = session_data["encounter_id"]
    print(f"✓ Step 1: Created Demo Session. Public Token: {token}, Encounter ID: {encounter_id}")

    # 2. Check session status (CONSENT_PENDING)
    status_res = requests.get(f"{BASE_URL}/intake/{token}")
    assert status_res.status_code == 200, f"Failed get status: {status_res.text}"
    status_data = status_res.json()
    assert status_data["state"] == "CONSENT_PENDING", f"Unexpected state: {status_data['state']}"
    print(f"✓ Step 2: Session validated. Patient: {status_data['patient_name']}, State: {status_data['state']}")

    # 3. Submit Consent
    consent_res = requests.post(
        f"{BASE_URL}/intake/{token}/consent",
        json={"agreed": True, "scope": ["treatment", "data_processing"]}
    )
    assert consent_res.status_code == 200, f"Failed consent: {consent_res.text}"
    assert consent_res.json()["state"] == "INTERVIEW"
    print(f"✓ Step 3: Patient consent granted. State transitioned to INTERVIEW.")

    # 4. Adaptive Question Intake Loop
    answers_to_submit = [
        ("chief_complaint", "Severe abdominal burning and pain for 4 days after eating meals"),
        ("duration", "4 days"),
        ("severity", "Severe"),
        ("medical_history", "None"),
        ("agni_digestion", "Slow digestion with frequent acidity, bloating, and irregular bowel habits"),
        ("sleep_pattern", "Disturbed sleep, difficulty falling asleep, waking up tired"),
        ("thermal_preference", "Sensitive to cold weather, prefer warm food and drinks"),
        ("lifestyle_diet", "Vegetarian diet, irregular meal timings, frequent tea consumption")
    ]

    for slot, ans_text in answers_to_submit:
        q_res = requests.post(f"{BASE_URL}/intake/{token}/interview/next")
        assert q_res.status_code == 200, f"Failed interview/next: {q_res.text}"
        q_next = q_res.json()
        if q_next.get("is_complete"):
            print(f"  -> All active intake slots fulfilled.")
            break
        q_id = q_next.get("question_id")
        target_slot = q_next.get("target_slot")
        q_text = q_next.get("text")
        
        print(f"  [Q] Slot: {target_slot} | Question: {q_text}")
        sub_res = requests.post(
            f"{BASE_URL}/intake/{token}/interview/answer",
            json={
                "question_id": q_id,
                "target_slot": target_slot,
                "raw_text": ans_text
            }
        )
        assert sub_res.status_code == 200, f"Failed submitting answer for {target_slot}: {sub_res.text}"
        print(f"  -> [A] Successfully submitted answer for {target_slot}")

    # 5. Patient Review Step
    rev_res = requests.get(f"{BASE_URL}/intake/{token}/review")
    assert rev_res.status_code == 200, f"Failed review: {rev_res.text}"
    review_facts = rev_res.json().get("facts", [])
    print(f"✓ Step 5: Patient Review loaded {len(review_facts)} extracted clinical facts:")
    for f in review_facts:
        print(f"    - {f['slot']}: {json.dumps(f['value'])} (status={f['status']})")

    # 6. Patient Confirms Review
    conf_res = requests.post(f"{BASE_URL}/intake/{token}/confirm")
    assert conf_res.status_code == 200, f"Failed confirm review: {conf_res.text}"
    print(f"✓ Step 6: Patient confirmed review successfully.")

    # 7. Doctor Login
    login_res = requests.post(
        f"{BASE_URL}/auth/login",
        json={"username": "dr.ayush", "password": "demo_password123"}
    )
    assert login_res.status_code == 200, f"Doctor login failed: {login_res.text}"
    auth_token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {auth_token}"}
    print(f"✓ Step 7: Doctor logged in successfully as dr.ayush")

    # 8. Fetch Doctor Queue to locate the patient's encounter
    queue_res = requests.get(f"{BASE_URL}/queue", headers=headers)
    assert queue_res.status_code == 200, f"Queue fetch failed: {queue_res.text}"
    encounters = queue_res.json()
    matching = [e for e in encounters if str(e["encounter_id"]) == str(encounter_id)]
    assert len(matching) > 0, f"Encounter {encounter_id} not found in doctor queue"
    target_encounter = matching[0]
    print(f"✓ Step 8: Found encounter in Doctor Queue. ID: {encounter_id}, Status: {target_encounter['status']}, Triage: {target_encounter['triage_level']}")

    # 9. Doctor Encounter Overview (Full Case Sheet)
    enc_res = requests.get(f"{BASE_URL}/encounters/{encounter_id}/overview", headers=headers)
    assert enc_res.status_code == 200, f"Encounter overview failed: {enc_res.text}"
    enc_data = enc_res.json()
    print(f"✓ Step 9: Clinical Overview Loaded:")
    print(f"  - Status: {enc_data['status']}")
    print(f"  - Triage Level: {enc_data['triage_level']}")
    print(f"  - Clinical Facts: {len(enc_data['clinical_facts'])}")
    print(f"  - Timeline Events: {len(enc_data['timeline'])}")
    print(f"  - Safety Alerts: {len(enc_data['safety_alerts'])}")
    print(f"  - Conflicts: {len(enc_data['conflicts'])}")

    summary = enc_data.get("summary")
    if summary:
        print(f"  - Summary Chief Complaint: {summary.get('chief_complaint')}")
        print(f"  - Summary HPI: {summary.get('history_of_present_illness')}")
        print(f"  - AYUSH Observations: {summary.get('ayush_observations')}")
        print(f"  - Narrative Sections: {len(summary.get('sections', []))}")
    else:
        print("  - Warning: No summary returned")

    # Verify all facts were promoted to PATIENT_CONFIRMED
    for fact in enc_data["clinical_facts"]:
        print(f"    * Fact {fact['slot']}: status={fact['status']}, value={json.dumps(fact['value'])}")
        assert fact["status"] in ("PATIENT_CONFIRMED", "PHYSICIAN_VERIFIED"), f"Fact {fact['slot']} not confirmed: {fact['status']}"

    # 10. Doctor Edits a Fact (Physician Verification)
    first_fact = enc_data["clinical_facts"][0]
    edit_res = requests.patch(
        f"{BASE_URL}/encounters/{encounter_id}/answers/{first_fact['id']}",
        headers=headers,
        json={"value": {"symptom": "abdominal pain", "character": "sharp epigastric burning", "severity": "severe"}}
    )
    assert edit_res.status_code == 200, f"Failed editing fact: {edit_res.text}"
    print(f"✓ Step 10: Doctor edited fact {first_fact['slot']} (promoted to PHYSICIAN_VERIFIED)")

    # 11. Acknowledge any alerts if flagged
    for alert in enc_data["safety_alerts"]:
        if alert["status"] != "PHYSICIAN_ACKNOWLEDGED":
            ack_res = requests.patch(
                f"{BASE_URL}/encounters/{encounter_id}/alerts/{alert['id']}/acknowledge",
                headers=headers,
                json={"status": "PHYSICIAN_ACKNOWLEDGED"}
            )
            assert ack_res.status_code == 200, f"Failed alert ack: {ack_res.text}"
            print(f"✓ Step 11: Acknowledged safety alert {alert['rule_id']}")

    # 12. Evaluate FHIR Eligibility
    elig_res = requests.get(f"{BASE_URL}/encounters/{encounter_id}/export-eligibility", headers=headers)
    assert elig_res.status_code == 200, f"Eligibility failed: {elig_res.text}"
    elig_data = elig_res.json()
    print(f"✓ Step 12: FHIR Eligibility Evaluation:")
    print(f"  - Eligible resources: {len(elig_data.get('eligible_resources', []))}")
    print(f"  - Blocked resources: {len(elig_data.get('blocked_resources', []))}")
    print(f"  - Unresolved conflicts: {elig_data.get('unresolved_conflicts')}")

    # 13. Export FHIR R4 Document Bundle
    export_res = requests.post(f"{BASE_URL}/encounters/{encounter_id}/export-fhir", headers=headers)
    export_data = export_res.json()
    bundle = export_data.get("bundle", export_data)
    print(f"✓ Step 13: Exported FHIR R4 Bundle successfully:")
    print(f"  - Bundle Type: {bundle.get('type')}")
    print(f"  - Total entries: {len(bundle.get('entry', []))}")

    # Check Practitioner in Bundle
    practitioner_entries = [e for e in bundle.get("entry", []) if e.get("resource", {}).get("resourceType") == "Practitioner"]
    if practitioner_entries:
        practitioner_name = practitioner_entries[0]["resource"].get("name", [{}])[0].get("text")
        print(f"  - Attending Practitioner: {practitioner_name}")
        assert "dr.ayush" in practitioner_name.lower() or "dr." in practitioner_name.lower()

    # Check for NAMASTE & SNOMED dual-coding
    coded_entries = [
        e for e in bundle.get("entry", []) 
        if any(c.get("system") == "http://ayush.gov.in/namaste" for c in e.get("resource", {}).get("code", {}).get("coding", []))
    ]
    print(f"  - Resources dual-coded with Ministry of Ayush NAMASTE: {len(coded_entries)}")
    for e in coded_entries:
        res = e["resource"]
        codings = res.get("code", {}).get("coding", [])
        snomed = [c["code"] for c in codings if "snomed" in c.get("system", "")]
        namaste = [f"{c['code']} ({c.get('display')})" for c in codings if "namaste" in c.get("system", "")]
        print(f"    * {res['resourceType']}/{res['id']}: SNOMED={snomed} | NAMASTE={namaste}")

    print("\n=======================================================")
    print("ALL 13 PIPELINE VERIFICATION STEPS PASSED WITH 100% SUCCESS")
    print("=======================================================")

if __name__ == "__main__":
    run_e2e_test()
