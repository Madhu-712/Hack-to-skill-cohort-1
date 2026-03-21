# Customer Support Agent (built with Google ADK)

## Project Overview
This project is an intelligent customer support agent designed to handle various types of user inquiries including billing, technical, account, and general issues. Leveraging the [Google Agent Development Kit (ADK)](https://github.com/google-gemini/adk) and Gemini 2.5 Flash, the agent can:
- **Classify** customer messages into categories.
- **Analyze** screenshots and user descriptions to provide step-by-step troubleshooting.
- **Perform Research** using Google Search to provide up-to-date resolutions.
- **Create Support Tickets** for further tracking by human agents.

## Architecture
The application is built using a modular agent-first architecture:
- **Agent Layer (`agent.py`)**: Defines the root agent, its persona, instructions, and associated tools.
- **Tool Layer (`tools.py`)**: Implements the business logic for classification, screenshot analysis, and ticket creation as ADK FunctionTools.
- **Web UI (`adk web`)**: The project uses the built-in ADK Web UI for interactive testing, debugging, and session management.

## Project Structure
```text
.
├── agent.py          # Root agent definition and tool registration
├── tools.py          # Custom tool implementations (FunctionTools)
├── dockerfile        # Containerization for deployment
├── requirements.txt  # Project dependencies
├── .env              # Environment variables configuration
└── .adk/             # ADK metadata and session storage
```

## Getting Started

### Prerequisites
- Python 3.10+
- A Google Cloud Project with Vertex AI API enabled
- Authenticated `gcloud` CLI or a Service Account with necessary permissions

### Local Setup
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd custsupport_agent
   ```

2. **Create and activate a virtual environment**:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**:
   Create a `.env` file in the root directory:
   ```env
   MODEL=gemini-2.5-flash
   GOOGLE_CLOUD_PROJECT=your-project-id
   GOOGLE_CLOUD_LOCATION=us-central1
   ```

### Running the Agent
The agent is designed to be run using the built-in interactive dashboard:

```bash
adk web --host 0.0.0.0 --port 8080 .
```
Access the UI at `http://localhost:8080`.

## Contributions
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

## License
This project is licensed under the Apache 2.0 License. See the LICENSE file for details (if available).
