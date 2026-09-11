# 🌿 SwasthyaSaathi (स्वास्थ्य साथी)
### *Structured Pre-Consultation Clinical Intake & Decision Support System for AYUSH OPDs*

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1.svg?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

SwasthyaSaathi is an intelligent pre-consultation workflow software built for **AYUSH (Ayurveda, Yoga, Unani, Siddha, Homeopathy)** and **Integrative Medicine** outpatient departments. 

It captures comprehensive, multimodal patient history (bilingual conversational intake, voice, and past medical records) **before** the patient steps into the doctor's cabin, synthesizing it into an **evidence-grounded, verified clinical draft summary** for the physician.

---

## 📑 Table of Contents
1. [Architecture Overview](#-architecture-overview)
2. [Prerequisites](#-prerequisites)
3. [Quick Start (Docker — Recommended)](#-method-1-quick-start-with-docker-recommended)
4. [Manual Local Setup (Without Docker)](#-method-2-manual-local-setup-without-docker)
5. [Configuring AI Providers (Groq / Gemini / Ollama)](#-configuring-ai-providers)
6. [Accessing the Application & Default Logins](#-accessing-the-application--default-logins)
7. [Project Directory Layout](#-project-directory-layout)
8. [Helpful Makefile Commands](#-helpful-makefile-commands)
9. [Troubleshooting & FAQs](#-troubleshooting--faqs)

---

## 🏛 Architecture Overview

```mermaid
graph TD
    Patient[Patient / Caregiver] -->|Bilingual Voice & Text Intake| WebPatient[Web / Mobile Intake Portal]
    WebPatient -->|HTTP / REST| API[FastAPI Backend :8000]
    API -->|Store Encounters & Facts| DB[(PostgreSQL 16 :5432)]
    API -->|Upload Prescriptions & Reports| MinIO[(MinIO S3 Storage :9000)]
    API -->|Clinical Fact Extraction & Summary| LLM[AI Layer: Groq / Gemini / Ollama]
    Doctor[AYUSH Physician] -->|Reviews Triage & Verified Draft| DoctorPortal[Doctor Clinical Workstation :5173]
```

- **Frontend (`/web`):** React 18, TypeScript, Vite, TanStack Query, Forest Sage Clinical Design System.
- **Backend (`/backend`):** Python 3.11+, FastAPI, SQLAlchemy 2.0, Alembic, Pydantic v2.
- **Database & Storage:** PostgreSQL 16 (relational clinical data) & MinIO (S3-compatible document storage).
- **AI Intelligence:** Multi-provider fallback chain (Groq Cloud LLMs, Google Gemini Flash, or local Ollama) + Deterministic Clinical Normalization Engine.

---

## 🧰 Prerequisites

Before you start, make sure you have the following installed on your computer:

| Requirement | Minimum Version | How to check | Installation Link |
| :--- | :--- | :--- | :--- |
| **Node.js** | `v18.0.0+` | `node -v` | [nodejs.org](https://nodejs.org/) |
| **Python** | `3.11+` | `python3 --version` | [python.org](https://www.python.org/downloads/) |
| **Git** | Any | `git --version` | [git-scm.com](https://git-scm.com/) |
| **Docker & Docker Compose** *(Optional, recommended)* | Latest | `docker compose version` | [docker.com](https://www.docker.com/) |

---

## 🚀 Method 1: Quick Start with Docker (Recommended)

This is the fastest and cleanest way to run PostgreSQL, MinIO, and all services without installing databases on your machine.

### Step 1: Clone the Repository
Open your terminal and clone the repository:
```bash
git clone https://github.com/harshkoli1255/Swasthya-Saathi.git
cd Swasthya-Saathi
```

### Step 2: Set Up Environment Files
Copy the sample environment variables for both root and backend:
```bash
# In the project root:
cp .env.example .env
cp backend/.env.example backend/.env
```

### Step 3: Start Databases (PostgreSQL & MinIO)
Run Docker Compose to launch PostgreSQL (port `5432`) and MinIO (ports `9000` & `9001`):
```bash
docker compose up -d db minio
# Or simply:
make up
```
*Wait ~5–10 seconds for the database container to become healthy.*

### Step 4: Run Database Migrations & Seed Demo Data
Apply the database schema and load demo doctors, clinical questions, and sample patient OPD cases:
```bash
# 1. Apply schema migrations
cd backend
alembic upgrade head

# 2. Seed default doctor user (dr.ayush)
python scripts/seed.py

# 3. Seed clinical intake question bank (AYUSH + General)
python scripts/seed_questions.py

# 4. Seed sample patient queue
python scripts/seed_encounters.py

cd ..
```

### Step 5: Start the Backend Server
In your backend terminal:
```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Backend will be live at: **`http://localhost:8000`** (Interactive Docs: **`http://localhost:8000/docs`**).

### Step 6: Start the Frontend Web App
Open a **new terminal tab or window**:
```bash
cd web
npm install
npm run dev
```
Frontend will be live at: **`http://localhost:5173`**.

---

## 🛠 Method 2: Manual Local Setup (Without Docker)

If you don't have Docker installed or prefer running directly on your operating system with **SQLite** or a local **PostgreSQL** instance:

### Step 1: Set Up Python Virtual Environment
```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS / Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install all backend dependencies
pip install --upgrade pip
pip install -e ".[dev]"
```

### Step 2: Configure Environment Variables
Copy the backend `.env.example` to `.env`:
```bash
cp .env.example .env
```
Open `backend/.env` in your code editor:
- **To use SQLite (Zero configuration):**
  ```env
  DATABASE_URL=sqlite:///./swasthyasaathi.db
  ENVIRONMENT=development
  DEBUG=true
  ```
- **To use local PostgreSQL:**
  ```env
  DATABASE_URL=postgresql://your_user:your_password@localhost:5432/swasthyasaathi
  ```

### Step 3: Apply Migrations & Seed Data
With your virtual environment active in `backend/`:
```bash
alembic upgrade head
python scripts/seed.py
python scripts/seed_questions.py
python scripts/seed_encounters.py
```

### Step 4: Launch Backend
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Step 5: Launch Frontend
Open a new terminal:
```bash
cd web
npm install
npm run dev
```
Visit **`http://localhost:5173`** in your browser.

---

## 🤖 Configuring AI Providers

SwasthyaSaathi includes a multi-tiered AI extraction & clinical summary engine. By default, it features a **fail-safe deterministic engine** that works even with zero API keys. 

To enable generative AI clinical summaries and smart slot extraction:

### Option A: Groq Cloud (Fastest & Free Tier Available)
1. Sign up and generate a free API key at [console.groq.com](https://console.groq.com/).
2. In `backend/.env`, set:
   ```env
   AI_PRIMARY_PROVIDER=groq
   GROQ_API_KEY=gsk_your_groq_api_key_here
   GROQ_MODEL=qwen/qwen3.6-27b
   FEATURE_CLOUD_AI_FALLBACK=true
   ```

### Option B: Google Gemini
1. Get an API key from [Google AI Studio](https://aistudio.google.com/).
2. In `backend/.env`, set:
   ```env
   AI_PRIMARY_PROVIDER=gemini
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-1.5-flash
   FEATURE_CLOUD_AI_FALLBACK=true
   ```

### Option C: Local Offline AI with Ollama
1. Download and install [Ollama](https://ollama.com/).
2. Pull the model:
   ```bash
   ollama run llama3.1:8b
   ```
3. In `backend/.env`, set:
   ```env
   AI_PRIMARY_PROVIDER=ollama
   OLLAMA_BASE_URL=http://localhost:11434
   OLLAMA_MODEL=llama3.1:8b
   ```

---

## 🔐 Accessing the Application & Default Logins

Once both backend (`:8000`) and frontend (`:5173`) are running:

### 1. Doctor Portal
- **URL:** [http://localhost:5173/doctor/login](http://localhost:5173/doctor/login)
- **Demo Username:** `dr.ayush`
- **Demo Password:** `demo_password123`
- **What to explore:**
  - **OPD Triage Queue:** Real-time patient priority list with color-coded severity bars (Emergency, Urgent, Routine) and waiting times.
  - **Clinical Consultation Chart:** Dual-column workstation with Patient Demographics, Verified AI Draft Summary, Timeline, Document Viewer, and AYUSH Prakriti/Agni indicators.

### 2. Patient Pre-Consultation Intake
- **URL:** [http://localhost:5173/](http://localhost:5173/)
- Click **"Experience Patient Intake"** on the landing page or use any active intake token link generated by `seed_encounters.py`.
- **What to explore:**
  - Multilingual selection (English & Hindi).
  - Progressive conversational questions (Chief complaint, duration, digestion/Agni, sleep quality, thermal preferences).
  - Prescription & document camera/file uploader.

### 3. Developer Endpoints
- **Interactive OpenAPI Documentation (Swagger UI):** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Alternative API Docs (ReDoc):** [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **MinIO Storage Dashboard:** [http://localhost:9001](http://localhost:9001)
  - Username: `swasthya_minio`
  - Password: `swasthya_minio_secret`

---

## 📁 Project Directory Layout

```text
Patient-Case-Taking-Software/
├── backend/
│   ├── alembic/                # Database migrations (Postgres/SQLite schema)
│   ├── app/
│   │   ├── api/v1/             # FastAPI REST endpoints (auth, intake, doctor, etc.)
│   │   ├── core/               # Database, settings, security & rate limiting
│   │   ├── models/             # SQLAlchemy ORM models (Patients, Encounters, etc.)
│   │   ├── schemas/            # Pydantic validation schemas
│   │   └── services/           # Business logic (LLMs, ASR, OCR, Triage, Summary)
│   ├── scripts/                # Database seeders (seed.py, seed_encounters.py)
│   ├── tests/                  # Pytest automated test suite
│   ├── Dockerfile              # Backend container definition
│   └── pyproject.toml          # Python package definitions
│
├── web/
│   ├── src/
│   │   ├── components/         # Reusable UI components (Modals, Buttons, Badges)
│   │   ├── layouts/            # Doctor & Patient page layouts
│   │   ├── pages/              # Landing page, Doctor Queue, Encounter Chart, etc.
│   │   ├── services/           # TanStack Query API hooks
│   │   └── styles/             # Global CSS & Design System tokens
│   ├── package.json            # Node.js dependencies
│   └── vite.config.ts          # Vite bundler & API proxy configuration
│
├── docker-compose.yml          # Postgres 16, MinIO, and Backend container orchestration
├── Makefile                    # One-word convenience commands (make up, make dev-web)
└── README.md                   # Project documentation
```

---

## ⚡ Helpful Makefile Commands

If you have `make` installed, you can use these shortcuts:

```bash
make help          # View all available make targets
make up            # Start PostgreSQL and MinIO containers in background
make down          # Stop all containers
make migrate       # Run database migrations
make seed          # Seed database with sample data
make dev-backend   # Launch FastAPI server locally with live reload
make dev-web       # Launch React Vite dev server
make test          # Run the pytest test suite
make clean         # Wipe Docker containers and volumes (caution: removes DB data)
```

---

## ❓ Troubleshooting & FAQs

### 1. `Port 5432 is already in use`
- **Cause:** You may already have a local PostgreSQL server running on your system.
- **Solution:** Either stop your local postgres (`brew services stop postgresql` on macOS, or `sudo systemctl stop postgresql` on Linux), or switch `DATABASE_URL` in `backend/.env` to point to your existing Postgres instance or SQLite.

### 2. `alembic: command not found`
- **Cause:** Virtual environment is not activated or dependencies are not installed.
- **Solution:** Run `source backend/venv/bin/activate` and `pip install -e ".[dev]"`.

### 3. `Failed to fetch / Network Error in Frontend`
- **Cause:** Backend server is not running on port 8000.
- **Solution:** Verify that `uvicorn app.main:app --port 8000` is running in your backend terminal. Test by opening [http://localhost:8000/docs](http://localhost:8000/docs).

### 4. `Groq API Error / Model Not Found`
- **Cause:** Invalid API key or model name in `backend/.env`.
- **Solution:** Ensure `GROQ_API_KEY` is set. Recommended model is `qwen/qwen3.6-27b` or `llama-3.1-8b-instant`. Even if the API key is missing, SwasthyaSaathi's deterministic fallback engine guarantees uninterrupted pre-consultation flow.

---

## 👥 Contributors & Acknowledgements
Built for the **Smart India Hackathon (SIH)** — Transforming pre-consultation OPD efficiency across AYUSH Healthcare Institutions.
