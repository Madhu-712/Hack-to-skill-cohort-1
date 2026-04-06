# Use Python 3.12 slim image
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Copy requirements and install dependencies
# Note: Ensure you have a requirements.txt file in your folder
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the project files
COPY . .

# Set PYTHONPATH so the ADK can find your modules
ENV PYTHONPATH=/app

# Expose the port ADK runs on
EXPOSE 8080

# Command to run the ADK web server
# We use 0.0.0.0 and port 8080 for Cloud Run compatibility
CMD ["adk", "web", "--host", "0.0.0.0", "--port", "8080"]