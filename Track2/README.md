# 🤖 BigQuery AI Agent — Zonal Operations Intelligence for Swiggy

An intelligent data analysis agent powered by **Google ADK**, **Gemini 2.5 Flash**, and **BigQuery Toolbox (Prebuilt MCP)** — deployed on **Google Cloud Run**. Ask questions in natural language and get instant operational insights from your BigQuery datasets.



---
<img width="1366" height="1848" alt="image" src="https://github.com/user-attachments/assets/26f0e2ea-03d1-4024-9869-2afd758d0bc0" />




## 📌 Project Overview

Swiggy operates across multiple city zones like **Whitefield**, **Indiranagar**, and **Koramangala** in Bangalore. Each zone has its own demand patterns, rider availability, delivery performance, and customer complaints. Managing these zones manually is slow, error-prone, and reactive.

This project builds a **conversational AI agent** that connects to **Google BigQuery** and answers natural language questions about zonal operational data — giving operations teams instant, data-driven insights to act on.

**The core idea:** Instead of building dashboards or writing SQL, operations managers simply ask questions like:
> *"Which zone has the highest support tickets and least riders this week?"*

...and the agent instantly queries BigQuery, analyzes the data, and provides actionable recommendations.

---

## 🔴 Problem Statement

### The Real-World Challenge

Food delivery platforms like Swiggy face complex, dynamic operational challenges:

| Problem | Impact |
|---------|--------|
| **Rider shortages in high-demand zones** | Orders go unfulfilled, customers churn |
| **High support ticket volumes** | Operations teams overwhelmed, slow resolution |
| **Late rider logins** | Peak hour supply gaps, surge pricing abuse |
| **Low availability rates** | Poor customer experience, revenue loss |
| **Delivery delays during rain/traffic** | Negative ratings, refund requests |
| **Escalated tickets not resolved fast** | Brand damage, repeat complaints |

### Why Traditional Tools Fall Short

- **Dashboards** are static — they show what happened, not what to do
- **SQL reports** require technical expertise and take hours to build
- **Manual analysis** is slow — by the time insights are ready, the situation has changed
- **Data silos** — rider data, ticket data, and order data are disconnected

### How This Agent Solves It

This AI agent bridges the gap by:
1. **Connecting all three datasets** in BigQuery — riders, support tickets, and zone availability
2. **Understanding natural language** — no SQL knowledge needed
3. **Generating instant insights** — real-time analysis on demand
4. **Providing strategic recommendations** — not just data, but actionable advice
5. **Scaling to any zone or time period** — flexible querying across all dimensions

---

## 📊 Datasets

All three datasets are stored in **Google BigQuery** under the project `bq-prebuilt-tool` and are used by the agent to perform cross-dataset analysis.

---

### 🏍️ Dataset 1: `riders` — Rider Supply Data

**Table:** `riders.rider_supply`

Tracks daily rider availability and activity per zone.

| Column | Type | Description |
|--------|------|-------------|
| `zone` | STRING | Delivery zone (Whitefield, Indiranagar, Koramangala) |
| `date` | DATE | Date of record |
| `total_riders` | INTEGER | Total registered riders in zone |
| `online_riders` | INTEGER | Riders who logged in that day |
| `avg_active_hours` | FLOAT | Average hours riders were active |
| `surge_multiplier` | FLOAT | Surge pricing factor applied (1.0 = no surge) |
| `late_logins` | INTEGER | Riders who logged in late (missed peak hours) |

**Key Insights This Enables:**
- Which zones have the lowest rider-to-demand ratio?
- Which zones have chronic late login problems?
- When does surge pricing spike — and why?
- Are online riders declining over time in any zone?

---

### 🎫 Dataset 2: `support_tickets` — Customer & Operational Complaints

**Table:** `support_tickets.support_tickets`

Tracks every support ticket raised across zones.

| Column | Type | Description |
|--------|------|-------------|
| `ticket_id` | STRING | Unique ticket identifier |
| `zone` | STRING | Zone where the issue occurred |
| `date` | DATE | Date ticket was raised |
| `category` | STRING | Type: Rider No Show, Rider Shortage, Payment Issue, Delivery Delay, App Issue |
| `priority` | STRING | Severity: Critical, High, Medium, Low |
| `resolution_time_minutes` | INTEGER | Time taken to resolve the ticket |
| `escalated` | STRING | Whether ticket was escalated (Yes/No) |

**Key Insights This Enables:**
- Which zones generate the most Critical/High priority tickets?
- What are the top complaint categories per zone?
- Which zones have the worst resolution times?
- How many tickets are being escalated — and where?

---

### 📦 Dataset 3: `zone_availability` — Order Fulfillment & Delivery Performance

**Table:** `zone_availability.zone_availability`

Tracks daily order fulfillment and delivery metrics per zone.

| Column | Type | Description |
|--------|------|-------------|
| `zone` | STRING | Delivery zone |
| `date` | DATE | Date of record |
| `total_orders` | INTEGER | Total orders placed |
| `fulfilled_orders` | INTEGER | Orders successfully delivered |
| `availability_rate` | FLOAT | Fulfillment ratio (fulfilled/total) |
| `avg_delivery_time_minutes` | FLOAT | Average delivery time |
| `weather` | STRING | Weather condition (Rain, Clear) |
| `traffic_index` | FLOAT | Traffic congestion index (0-1) |

**Key Insights This Enables:**
- Which zones have the lowest availability rates?
- How does rain and traffic affect delivery times per zone?
- Are high-traffic zones also high-ticket zones?
- Which zones need more riders to meet order demand?

---

## 🔍 Zonal Operational Analysis

Based on the data structure, here is the kind of cross-dataset intelligence the agent can generate:

### Zone Performance Matrix

| Zone | Rider Supply | Support Tickets | Fulfillment | Risk Level |
|------|-------------|-----------------|-------------|------------|
| Whitefield | ~293 total, ~260 online | High — Rider No Show, Shortage | ~90% avg | 🔴 High |
| Indiranagar | ~310 total, ~280 online | Medium — Delivery Delay | ~92% avg | 🟡 Medium |
| Koramangala | ~280 total, ~255 online | Medium — App Issues | ~91% avg | 🟡 Medium |

---

### 📉 Scenario: High Support Tickets + Low Riders — Strategic Escalation Plan

When a zone shows **high ticket volume** (especially Rider No Show, Rider Shortage) combined with **low online riders**, the agent recommends:

#### 🚨 Immediate Actions (0–24 hours)
- **Activate surge incentives** — Push bonus earnings for riders who log in during peak hours in affected zones
- **Reroute nearby riders** — Pull riders from low-demand adjacent zones temporarily
- **Notify operations team** — Auto-alert zone managers about the supply-demand gap
- **Prioritize Critical tickets** — Escalate unresolved Critical tickets immediately

#### 📅 Short-Term Actions (1–7 days)
- **Audit late login patterns** — Identify riders with consistent late logins and engage via app notifications or calls
- **Increase online rider targets** — Set daily login quotas per zone with performance incentives
- **Deploy rapid response team** — Assign dedicated support agents to high-ticket zones
- **Track resolution time SLAs** — Flag zones where avg resolution time exceeds 60 minutes

#### 📈 Long-Term Strategic Actions (1–4 weeks)
- **Zone-specific rider recruitment drives** — Run targeted hiring campaigns in underserved zones
- **Predictive scheduling** — Use the forecasting tool to predict demand spikes and pre-position riders
- **Root cause analysis** — Identify if Rider No Show tickets correlate with weather, traffic, or surge multiplier patterns
- **Gamification** — Introduce zone-level leaderboards for riders to reduce absenteeism

---

## 🏗️ Architecture

```
User / Operations Manager
          │
          ▼
┌─────────────────────────┐
│   BigQuery AI Agent     │  ← Google ADK + Gemini 2.5 Flash
│   (Cloud Run)           │    Natural language → SQL → Insights
└────────────┬────────────┘
             │ HTTP (TOOLBOX_URL)
             ▼
┌─────────────────────────┐
│   MCP BigQuery Toolbox  │  ← 9 prebuilt BigQuery tools
│   (Cloud Run)           │    execute_sql, forecast, analyze_contribution...
└────────────┬────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│         Google BigQuery              │
│  ┌─────────┐ ┌──────────┐ ┌──────┐  │
│  │ riders  │ │ support_ │ │ zone_│  │
│  │ dataset │ │ tickets  │ │avail │  │
│  └─────────┘ └──────────┘ └──────┘  │
└──────────────────────────────────────┘
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

```bash
export VERSION=0.23.0
curl -O https://storage.googleapis.com/genai-toolbox/v$VERSION/linux/amd64/toolbox
chmod +x toolbox

# Move to mcp-toolbox folder
mkdir -p mcp-toolbox
mv toolbox mcp-toolbox/
cd mcp-toolbox

# Start the toolbox
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

### Step 1 — Create a Session

```bash
curl -X POST https://bigquery-agent-v32-h2fgvrniba-uc.a.run.app/apps/bq/users/user1/sessions/session1 \
  -H "Content-Type: application/json"
```

### Step 2 — Send a Query

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

```bash
# Explore datasets
"What datasets are available?"

# Explore tables
"List tables in the riders dataset"

# Rider supply analysis
"Which zone has the least online riders this month?"

# Support ticket analysis
"Which zone has the highest number of critical support tickets?"

# Cross-dataset intelligence
"Which zone has the highest support tickets and least riders? How to strategically escalate the issue?"

# Availability analysis
"Which zone has the lowest order fulfillment rate?"

# Weather impact
"How does rain affect delivery times across zones?"

# Forecasting
"Forecast rider demand for Whitefield for the next 10 days"

# Late login analysis
"Which zone has the most late rider logins?"
```

---

## 🏢 How Companies Can Adopt This

This solution is not just for Swiggy — any **logistics, delivery, or field operations company** can adopt this pattern:

| Company Type | Use Case |
|-------------|----------|
| **Food Delivery** (Swiggy, Zomato) | Zonal rider management, ticket analysis |
| **E-commerce** (Flipkart, Amazon) | Last-mile delivery optimization |
| **Ride Hailing** (Ola, Uber) | Driver supply vs demand balancing |
| **Quick Commerce** (Zepto, Blinkit) | Dark store performance monitoring |
| **Healthcare Logistics** | Medical supply delivery SLA tracking |

### Integration Roadmap for Businesses

1. **Ingest your data into BigQuery** — Connect your existing databases, CSVs, or event streams
2. **Deploy the toolbox** — One command, no code changes needed
3. **Deploy the agent** — Configure with your BigQuery project ID
4. **Connect to your tools** — Slack bot, internal dashboard, mobile app, or REST API
5. **Train your ops team** — Replace SQL queries with natural language questions
6. **Scale** — Cloud Run scales automatically with zero infrastructure management

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
gcloud builds submit --tag gcr.io/$PROJECT_ID/bigquery-agent . && \
gcloud run deploy bigquery-agent \
  --image gcr.io/$PROJECT_ID/bigquery-agent \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars GOOGLE_CLOUD_PROJECT=$PROJECT_ID,GOOGLE_CLOUD_LOCATION=us-central1,GOOGLE_GENAI_USE_VERTEXAI=TRUE,TOOLBOX_URL=https://your-toolbox-url.run.app
```

---

## 🚀 Live Demo

| Service | URL |
|--------|-----|
| **Agent API** | https://bigquery-agent-v32-h2fgvrniba-uc.a.run.app |
| **Toolbox API** | https://bigquery-toolbox-h2fgvrniba-uc.a.run.app |

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
