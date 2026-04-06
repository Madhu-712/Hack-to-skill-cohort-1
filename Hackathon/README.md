# SweetTreats Marketing Intelligence System
An AI-powered analytics and support system designed to synthesize social media performance and automate marketing strategy for SweetTreatsBakeryoperations.

## Project Overview
This project provides an autonomous marketing analytics solution for SweetTreatsBakery, leveraging Google's Agent Development Kit (ADK) to automate data analysis and strategic recommendations. It features an intelligent agent system designed to process social media performance data, generate executive reports, and formulate actionable marketing strategies.

## Problem Statement
Manually analyzing vast amounts of social media data and translating it into actionable marketing strategies is time-consuming and resource-intensive. This project addresses the need for an automated system that can swiftly generate data-backed insights, produce formal performance reports, and provide strategic recommendations to optimize marketing efforts.

## Architecture
The system is built around an agent-based architecture using the Google ADK, comprising three main agents:

*   **Orchestrator Agent (`root_agent`):** The primary agent responsible for managing the overall workflow. It delegates tasks to sub-agents, compiles their findings, and handles external communications (e.g., uploading reports to GCS, drafting emails). It also manages the workflow state and can reset it.
*   **Data Analyst Agent (`data_analyst`):** Responsible for retrieving and analyzing raw social media performance data. It provides data-backed insights and generates formal performance reports (in Markdown format).
*   **Marketing Strategist Agent (`marketing_strategist`):** Analyzes the data and reports provided by the Data Analyst to formulate high-growth marketing initiatives. It provides specific, data-justified tactical recommendations.

These agents interact with each other and external services (like Google Cloud Storage) through defined tools.

## Tech Stack
*   **Agent Framework:** Google Agent Development Kit (ADK)
*   **Programming Language:** Python 3.12

*   **Cloud Services:**
    *   Google Cloud Storage (GCS) for data persistence (social logs, reports)
    *   Vertex AI (implied by `GOOGLE_GENAI_USE_VERTEXAI` and `GOOGLE_CLOUD_LOCATION`)
    *   Google Gemini Models (`gemini-2.5-flash`)
*   **Dependency Management:** `pip` with `requirements.txt`
*   **Containerization:** Docker

## Project Structure
```
marketing/
├── .env                  # Environment variables for the project
├── Dockerfile            # Dockerfile for the main project
├── requirements.txt      # Python dependencies
└── socio_marketing/      # Core agent logic and tools
    ├── __init__.py       # Initializes the socio_marketing package, exports root_agent
    ├── .env              # Environment variables specific to socio_marketing (can override main .env)
    ├── agent.py          # Defines the Orchestrator, Data Analyst, and Marketing Strategist agents
    ├── Dockerfile        # Dockerfile for the socio_marketing service (if deployed separately)
    └── tools.py          # Defines the custom tools (fetch_social_data, upload_report, reset_workflow_state)
```

## Getting Started

To run this project locally, follow these steps:

**Prerequisites:**
*   Python 3.12 installed
*   Docker (optional, for containerized deployment)
*   Google Cloud SDK configured and authenticated with appropriate permissions for GCS.
*   A Google Cloud Project and a GCS bucket named `socialmarketing123`.

**Local Setup:**

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Madhu-712/Hack-to-skill-cohort-1.git
    cd Hack-to-skill-cohort-1/Hackathon/marketing
    ```

2.  **Create a Python Virtual Environment:**
    ```bash
    python3.12 -m venv .venv
    source .venv/bin/activate
    pip install google-adk
    ```

3.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure Environment Variables:**
    Create or update the `.env` file in the `marketing/` directory and ensure it contains:
    ```
    GEMINI_MODEL="gemini-2.5-flash"
    GOOGLE_GENAI_USE_VERTEXAI=1
    GOOGLE_CLOUD_PROJECT=your-gcp-project-id  # Replace with your actual GCP Project ID
    GOOGLE_CLOUD_LOCATION=us-central1
    BUCKET_NAME=socialmarketing123
    PYTHONPATH=/app # Or the absolute path to your marketing directory if not using Docker
    GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/gcp/credentials.json # Replace with path to your service account key
    ```
    Ensure you have created a service account key and set its path correctly.

5.  **Run the ADK Server:**
    ```bash
    cd ~/marketing
    export PYTHONPATH=$PYTHONPATH:.
    export ADK_APP_NAME=socio_marketing
    adk web --host 0.0.0.0 --port 8080 --allow_origins "*" OR
    adk web --host 0.0.0.0 --port 8080 --allow_origins "https://*.cloudshell.dev"
    ```
    This will start the ADK web server, and you can interact with the agents via its interface, typically accessed through a browser.

## About Data

The project interacts with the following data elements:

*   **`social data.txt`:** (Simulated/Placeholder) Represents raw social media logs from which the `data_analyst` agent fetches information. In a real-world scenario, this would be a file within the configured GCS bucket (`socialmarketing123`).
*   **`marketing_performance_report.md`:** A Markdown-formatted report generated by the `data_analyst` agent and uploaded to the GCS bucket. This report synthesizes key performance metrics and analysis for executive review.

## 📊 Data & Insights

The system processes a comprehensive dataset containing engagement metrics from March 18 to March 28, 2025.

Metric,Instagram,Facebook,Twitter
Avg. Engagement Rate,7.79% ,6.22% ,4.92% 
Avg. Impressions,"3,233 ","2,744 ","2,131 "
CTR,22.2% ,44.4% ,37.5% 


## Sample Questions

Users can interact with the orchestrator agent by asking questions such as:
*Based on current metrics, how do we bridge the gap between "interest" and "purchase"?
*Which platform should we prioritize for brand awareness vs. direct sales?
*"Evaluate our social media footprint across Instagram, Facebook, and Twitter. Generate a detailed performance report that highlights top-performing content and provides a metrics-based evaluation of each site."
* "Analyze the current marketing campaign's performance by evaluating key engagement metrics across Instagram, Facebook, and Twitter. Provide a        comparative assessment of each platform’s effectiveness."
* "Synthesize a comprehensive marketing performance report. Audit social media metrics for Instagram, Facebook, and Twitter, identifying trends in user interaction and platform-specific ROI."
* "Which platform demonstrated the most significant growth across key performance indicators (KPIs), specifically CTR, engagement, reach, impressions, and conversions?"
*   "Generate a marketing performance report."
*   "Upload the marketing performance report."
*   "What is the Facebook CTR?"
*   "Draft an email for next quarter's campaign."
*   "Reset the workflow state."
*   "Identify the top-performing platform by analyzing the upward trends in reach and impressions alongside conversion and click-through rates."
*   How should our content type differ between Instagram and Facebook?
*   "Generate a strategic pivot for Q2 based on current Instagram reach." 

## Testing

While explicit test files are not provided in this structure, a comprehensive testing strategy would involve:

*   **Unit Tests:** For `tools.py` to ensure each tool (`fetch_social_data`, `upload_report`, `reset_workflow_state`) functions as expected in isolation.
*   **Agent Logic Tests:** For `agent.py` to verify individual agent behaviors and responses to various prompts, ensuring they adhere to their instructions.
*   **Integration Tests:** To test the interaction between agents (e.g., Orchestrator delegating to Data Analyst, then to Marketing Strategist) and with external services (GCS).
*   **End-to-End Tests:** Simulating user interactions with the `root_agent` to ensure the entire workflow executes correctly from request to final output.

## Deploying

The project is designed to be containerized using Docker, making it suitable for deployment on platforms like Google Cloud Run.

**Deployment with Docker:**

1.  **Build the Docker image:** Navigate to the `marketing/` directory (or `marketing/socio_marketing/` if building that specific Dockerfile) and run:
    ```bash
    docker build -t marketing-agents:latest .
    ```
2.  **Run the Docker container locally:**
    ```bash
    docker run -p 8080:8080 marketing-agents:latest
    ```
    Then access the ADK UI at `http://localhost:8080`.

**Deployment to Google Cloud Run:**

1.  **Build and push the Docker image to Google Container Registry (GCR) or Artifact Registry:**
    ```bash
    gcloud auth configure-docker
    docker build -t gcr.io/your-gcp-project-id/marketing-agents:latest .
    docker push gcr.io/your-gcp-project-id/marketing-agents:latest
    ```
2.  **Deploy to Cloud Run:**
    ```bash
    gcloud run deploy marketing-agents --image gcr.io/your-gcp-project-id/marketing-agents:latest \
      --platform managed \
      --region us-central1 \
      --allow-unauthenticated \
      --set-env-vars GOOGLE_CLOUD_PROJECT=your-gcp-project-id,BUCKET_NAME=socialmarketing123,GEMINI_MODEL=gemini-2.5-flash,... \
      --port 8080
    ```
    Remember to set all necessary environment variables during deployment.

## Live Demo

A live demo is not hosted, but you can follow the "Getting Started" section to run the application locally and interact with the agents through the ADK web interface.
link:
https://socio-marketing-service-738033056694.us-central1.run.app

## Contribution

Contributions are welcome! If you'd like to contribute, please follow these steps:
1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

## Resources

*   [Google Agent Development Kit (ADK) Documentation](https://cloud.google.com/vertex-ai/generative-ai/docs/adk/overview) (placeholder for actual link)
*   [Google Cloud Storage Documentation](https://cloud.google.com/storage/docs)
*   [Google Gemini Models](https://ai.google.dev/models/gemini)
*   [FastAPI Documentation](https://fastapi.tiangolo.com/)
*   [Docker Documentation](https://docs.docker.com/)

## License

This project is licensed under the Apache 2.0 License. See the [LICENSE](LICENSE) file for details.
