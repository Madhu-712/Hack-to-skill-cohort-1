# Use Python 3.11 (ADK requires 3.10+)
FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Copy requirements and install dependencies
# We install google-adk explicitly in case it's missing from requirements.txt
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir google-adk

# Copy the application code
COPY . .

# Cloud Run injects the PORT environment variable (default 8080)
ENV PORT=8080

# Expose the port
EXPOSE 8080

# Start the ADK Web UI
# --host 0.0.0.0 is crucial for Cloud Run to receive traffic
# --port $PORT ensures it listens on the port Cloud Run expects
CMD ["sh", "-c", "adk web --host 0.0.0.0 --port $PORT ."]


# Use a specific version for reproducibility
FROM python:3.11-slim

# Set environment variables to optimize Python for containers
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

WORKDIR /app

# Install system dependencies (needed for some ADK sub-dependencies)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install requirements + ADK
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir google-adk

# Copy the rest of the app
COPY . .

# Cloud Run automatically provides credentials, but ADK needs to know which project to use
# We'll set these as defaults, but they can be overridden in the Cloud Run Console
ENV GOOGLE_GENAI_USE_VERTEXAI=TRUE

EXPOSE 8080

# 'exec' ensures the app receives termination signals from Cloud Run
# 'adk web' starts the built-in UI/API server
CMD exec adk web --host 0.0.0.0 --port $PORT .