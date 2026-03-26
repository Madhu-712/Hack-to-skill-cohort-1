# 🤖 BigQuery AI Agent

An intelligent data analysis agent powered by **Google ADK**, **Gemini 2.5 Flash**, and **BigQuery Toolbox (Pre built MCP Server)** — deployed on **Google Cloud Run**. Ask questions in natural language and get instant insights from your BigQuery datasets.



---

## 🚀 Live Demo

| Service | URL |
|--------|-----|
| **Agent API** | https://bigquery-agent-v32-h2fgvrniba-uc.a.run.app |
| **Toolbox API** | https://bigquery-toolbox-h2fgvrniba-uc.a.run.app |

---

## 📌 Project Overview

This project builds a conversational AI agent that connects to BigQuery and answers natural language questions about your data. It uses:

- **Google ADK (Agent Development Kit)** to orchestrate the agent
- **Gemini 2.5 Flash** via Vertex AI as the underlying LLM
- **BigQuery Toolbox** (prebuilt MCP server) to expose BigQuery operations as tools
- **Google Cloud Run** to host both the agent and toolbox as scalable serverless services

---

## 🏗️ Architecture

```
User / Client
      │
      ▼
┌─────────────────────────┐
│   BigQuery Agent        │  ← Google ADK + Gemini 2.5 Flash
│   (Cloud Run)           │    https://bigquery-agent-v32-...
└────────────┬────────────┘
             │ HTTP (TOOLBOX_URL)
             ▼
┌─────────────────────────┐
│   MCP BigQuery Toolbox  │  ← Prebuilt MCP Toolbox Server
│   (Cloud Run)           │    https://bigquery-toolbox-...
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   Google BigQuery       │  ← Your datasets & tables
└─────────────────────────┘
```

### Available Tools (via Toolbox)

| Tool | Description |
|------|-------------|
| `list_dataset_ids` | List all datasets in the project |
| `list_table_ids` | List all tables in a dataset |
| `get_dataset_info` | Get dataset metadata |
| `get_table_info` | Get table schema and metadata |
| `execute_sql` | Execute SQL queries |
| `search_catalog` | Search for tables, views, models |
| `ask_data_insights` | Get AI-powered insights from tables |
| `forecast` | Forecast time series data |
| `analyze_contribution` | Analyze metric contributions |

---

## 📁 Project Structure

```
bigquery/                   # Root project folder
├── bq/                     # Agent folder (Option 2)
│   ├── __init__.py
│   └── agent.py            # ADK Agent definition
├── mcp-toolbox/            # MCP Toolbox binary folder
│   └── toolbox             # Downloaded toolbox binary
├── Dockerfile              # Container configuration for agent
├── requirements.txt        # Python dependencies
└── README.md
```

---

## 🛠️ Local Development

### Prerequisites

- Python 3.12+
- Google Cloud SDK
- A GCP project with BigQuery and Vertex AI enabled

### Step 1 — Clone & Setup

```bash
git clone https://github.com/your-username/bigquery-agent.git
cd bigquery-agent

# Create virtual environment
python -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 2 — Download & Run MCP Toolbox

Download the toolbox binary:

```bash
export VERSION=0.23.0
curl -O https://storage.googleapis.com/genai-toolbox/v$VERSION/linux/amd64/toolbox
chmod +x toolbox
```

Move it to the `mcp-toolbox` folder and start it:

```bash
mkdir -p mcp-toolbox
mv toolbox mcp-toolbox/
cd mcp-toolbox
./toolbox --prebuilt bigquery
```

Wait until you see:

```
INFO "Server ready to serve!"
```

The toolbox is now running on `http://127.0.0.1:5000`.

### Step 3 — Run the Agent

Open a **new terminal tab** and run:

```bash
cd ~/bigquery
source .venv/bin/activate
adk run bq
```

---

## 🧪 Testing the Agent

### Via curl (Recommended)

**Step 1 — Create a session:**

```bash
curl -X POST https://bigquery-agent-v32-h2fgvrniba-uc.a.run.app/apps/bq/users/user1/sessions/session1 \
  -H "Content-Type: application/json"
```

**Step 2 — Send a query:**

```bash
curl -X POST https://bigquery-agent-v32-h2fgvrniba-uc.a.run.app/run \
  -H "Content-Type: application/json" \
  -d '{
    "app_name": "bq",
    "user_id": "user1",
    "session_id": "session1",
    "new_message": {
      "role": "user",
      "parts": [{"text": "What datasets are available?"}]
    }
  }'
```

### 💬 Sample Questions

```
# Explore datasets
"What datasets are available?"

# Explore tables
"List tables in the riders dataset"

# Analytical query
"Which zone has the highest support tickets and least riders?"

# Strategic insight
"Which zone has the highest support tickets and least riders? How to strategically escalate the issue?"

# Forecasting
"Forecast rider demand for the next 10 days"
```

---

## ☁️ Cloud Run Deployment

### Deploy MCP Toolbox

```bash
gcloud run deploy bigquery-toolbox \
  --image us-central1-docker.pkg.dev/database-toolbox/toolbox/toolbox:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 5000 \
  --args="--prebuilt,bigquery,--address,0.0.0.0" \
  --set-env-vars BIGQUERY_PROJECT=$PROJECT_ID
```

### Deploy Agent

```bash
# Build and push container image
gcloud builds submit --tag gcr.io/$PROJECT_ID/bigquery-agent .

# Deploy to Cloud Run
gcloud run deploy bigquery-agent \
  --image gcr.io/$PROJECT_ID/bigquery-agent \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars GOOGLE_CLOUD_PROJECT=$PROJECT_ID,GOOGLE_CLOUD_LOCATION=us-central1,GOOGLE_GENAI_USE_VERTEXAI=TRUE,TOOLBOX_URL=https://your-toolbox-url.run.app
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📚 Resources

- 📖 [BigQuery meets Google ADK and MCP — Google Cloud Blog](https://cloud.google.com/blog/products/ai-machine-learning/bigquery-meets-google-adk-and-mcp?utm_campaign=CDR_0x77c43128_default_b429113132&utm_medium=external&utm_source=blog)
- 🧪 [Codelab: MCP Toolbox for BigQuery Dataset](https://codelabs.developers.google.com/mcp-toolbox-bigquery-dataset?hl=en#7)
- 🔧 [Google ADK Documentation](https://github.com/google/adk-python)
- 🛠️ [BigQuery Toolbox GitHub](https://github.com/googleapis/genai-toolbox)
- ☁️ [Vertex AI](https://cloud.google.com/vertex-ai)
- 🚀 [Google Cloud Run](https://cloud.google.com/run)

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
