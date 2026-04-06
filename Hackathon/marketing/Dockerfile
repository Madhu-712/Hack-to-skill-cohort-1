# Use Python 3.12 slim image
FROM python:3.12-slim

# Set working directory inside the container
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy everything (including the socio_marketing subfolder)
COPY . .

# Set PYTHONPATH so Python can find the 'socio_marketing' module
ENV PYTHONPATH=/app

# Expose the Cloud Run default port
EXPOSE 8080

# Run the ADK server
# We point it to the subfolder app logic
CMD ["adk", "web", "--host", "0.0.0.0", "--port", "8080"]