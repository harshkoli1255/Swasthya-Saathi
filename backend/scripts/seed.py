import sys
import os

# Add the parent directory to the path so we can import app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
from app.models.user import User
from app.core.security import hash_password

def seed_db():
    with SessionLocal() as db:
        existing_user = db.query(User).filter(User.username == "dr.ayush").first()
        
        if not existing_user:
            print("Creating demo user 'dr.ayush'...")
            user = User(
                username="dr.ayush",
                password_hash=hash_password("demo_password123"),
                full_name="Dr. Ayush Sharma",
                role="DOCTOR",
                facility="Ayurveda Wellness Center",
                is_active=True
            )
            db.add(user)
            db.commit()
            print("Demo user created successfully.")
        existing_sharma = db.query(User).filter(User.username == "dr.sharma").first()
        if not existing_sharma:
            print("Creating demo user 'dr.sharma'...")
            user = User(
                username="dr.sharma",
                password_hash=hash_password("demo_password123"),
                full_name="Dr. Priya Sharma",
                role="DOCTOR",
                facility="Ayurveda Wellness Center",
                is_active=True
            )
            db.add(user)
            db.commit()
            print("Demo user dr.sharma created successfully.")

        existing_admin = db.query(User).filter(User.username == "admin").first()
        if not existing_admin:
            print("Creating admin user 'admin'...")
            user = User(
                username="admin",
                password_hash=hash_password("admin_password123"),
                full_name="Hospital Administrator",
                role="ADMIN",
                is_active=True
            )
            db.add(user)
            db.commit()
            print("Admin user created successfully.")

if __name__ == "__main__":
    seed_db()
