FROM python:3.11-slim

WORKDIR /app

# Install system dependencies needed for psycopg2 etc
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy pyproject.toml
COPY pyproject.toml .

# Install Python dependencies
RUN pip install --no-cache-dir -e .

# Copy the rest of the application
COPY . .

# The CMD is defined in docker-compose.yml, but we can set a default
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
