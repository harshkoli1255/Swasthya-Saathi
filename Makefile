.PHONY: help up down migrate seed dev-backend dev-web test clean

# ── Help ────────────────────────────────────────────────────────────────────
help:
	@echo "SwasthyaSaathi — Development Commands"
	@echo ""
	@echo "  make up            Start all services via Docker Compose"
	@echo "  make down          Stop all services"
	@echo "  make migrate       Run Alembic database migrations"
	@echo "  make seed          Seed synthetic demo patient data"
	@echo "  make dev-backend   Run FastAPI backend locally (without Docker)"
	@echo "  make dev-web       Run React web app locally"
	@echo "  make test          Run backend test suite"
	@echo "  make clean         Remove Docker volumes (caution: data loss)"

# ── Docker ──────────────────────────────────────────────────────────────────
up:
	docker compose up -d

down:
	docker compose down

clean:
	docker compose down -v

# ── Database ────────────────────────────────────────────────────────────────
migrate:
	cd backend && alembic upgrade head

migrate-down:
	cd backend && alembic downgrade -1

migration:
	@read -p "Migration name: " name; \
	cd backend && alembic revision --autogenerate -m "$$name"

seed:
	cd backend && python scripts/seed_demo_data.py

# ── Local Development (without Docker) ──────────────────────────────────────
dev-backend:
	cd backend && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

dev-web:
	cd web && npm run dev

# ── Testing ─────────────────────────────────────────────────────────────────
test:
	cd backend && pytest

test-unit:
	cd backend && pytest tests/unit

test-api:
	cd backend && pytest tests/api

# ── Setup ───────────────────────────────────────────────────────────────────
setup-backend:
	cd backend && pip install -e ".[dev]"

setup-web:
	cd web && npm install

setup: setup-backend setup-web
	@echo "Setup complete. Run 'make up' to start Docker services."
