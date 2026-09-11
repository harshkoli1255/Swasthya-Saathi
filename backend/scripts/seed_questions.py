import os
import sys

# Add the project root to the python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.session import ClinicalQuestion

def seed_questions(db: Session):
    questions = [
        {
            "code": "CC_01",
            "targets_slot": "chief_complaint",
            "priority": 10,
            "phase": "GENERAL",
            "required_slots": [],
            "language_variants": {
                "en": "What brings you to the clinic today?",
                "hi": "आज आप क्लिनिक में किस समस्या के लिए आए हैं?"
            }
        },
        {
            "code": "DUR_01",
            "targets_slot": "duration",
            "priority": 20,
            "phase": "GENERAL",
            "required_slots": ["chief_complaint"],
            "language_variants": {
                "en": "How long have you been experiencing this?",
                "hi": "यह समस्या आपको कब से है?"
            }
        },
        {
            "code": "SEV_01",
            "targets_slot": "severity",
            "priority": 30,
            "phase": "GENERAL",
            "required_slots": ["chief_complaint"],
            "language_variants": {
                "en": "How would you describe the severity? (Mild, Moderate, Severe)",
                "hi": "आप इस समस्या की गंभीरता को कैसे बताएंगे? (हल्का, मध्यम, गंभीर)"
            }
        },
        {
            "code": "MHX_01",
            "targets_slot": "medical_history",
            "priority": 40,
            "phase": "GENERAL",
            "required_slots": ["chief_complaint", "duration"],
            "language_variants": {
                "en": "Do you have any existing medical conditions like Diabetes or Hypertension?",
                "hi": "क्या आपको पहले से कोई बीमारी है, जैसे मधुमेह या ब्लड प्रेशर?"
            }
        },
        {
            "code": "AYU_AGNI_01",
            "targets_slot": "agni_digestion",
            "priority": 50,
            "phase": "AYUSH",
            "required_slots": ["chief_complaint"],
            "language_variants": {
                "en": "How is your appetite and digestion? Any bloating, acidity, or irregular bowel habits?",
                "hi": "आपकी भूख और पाचन कैसा है? क्या पेट फूलना, गैस, एसिडिटी या कब्ज की समस्या होती है?"
            }
        },
        {
            "code": "AYU_SLEEP_01",
            "targets_slot": "sleep_pattern",
            "priority": 60,
            "phase": "AYUSH",
            "required_slots": ["chief_complaint"],
            "language_variants": {
                "en": "How is your sleep quality? Do you have difficulty falling asleep or feel refreshed in the morning?",
                "hi": "आपकी नींद कैसी है? क्या सोने में परेशानी होती है या सुबह उठकर तरोताजा महसूस करते हैं?"
            }
        },
        {
            "code": "AYU_THERMAL_01",
            "targets_slot": "thermal_preference",
            "priority": 70,
            "phase": "AYUSH",
            "required_slots": ["chief_complaint"],
            "language_variants": {
                "en": "Do you feel more comfortable in cold or warm weather? Any sensitivity to cold or heat?",
                "hi": "आपको ठंडे या गर्म मौसम में अधिक आराम मिलता है? क्या ठंड या गर्मी से कोई खास परेशानी होती है?"
            }
        },
        {
            "code": "AYU_DIET_01",
            "targets_slot": "lifestyle_diet",
            "priority": 80,
            "phase": "AYUSH",
            "required_slots": ["chief_complaint"],
            "language_variants": {
                "en": "Please describe your daily routine and diet (e.g. vegetarian, spicy foods, regular meal times).",
                "hi": "कृपया अपने भोजन और दिनचर्या के बारे में बताएं (जैसे शाकाहारी, तीखा खाना, खाने का नियमित समय)।"
            }
        }
    ]

    for q_data in questions:
        # Check if exists
        existing = db.query(ClinicalQuestion).filter_by(code=q_data["code"]).first()
        if not existing:
            q = ClinicalQuestion(**q_data)
            db.add(q)
            print(f"Added question: {q.code}")
        else:
            print(f"Question {q_data['code']} already exists.")
    
    db.commit()
    print("Question bank seeded successfully.")

if __name__ == "__main__":
    db = SessionLocal()
    try:
        seed_questions(db)
    finally:
        db.close()
