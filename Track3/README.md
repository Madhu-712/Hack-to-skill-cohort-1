# TaxCo — AI Tax Compliance Agent

> An intelligent, agentic tax compliance system powered by **Gemini 2.5 Flash** and **Claude Sonnet**, built on **AlloyDB** with **MCP Toolbox**, deployed on **Google Cloud Run**.

---

<img width="2752" height="1536" alt="image" src="https://github.com/user-attachments/assets/58c2c7f7-347f-4b9e-b515-bcc16bb387f1" />


## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Architecture](#architecture)
- [Database — AlloyDB](#database--alloydb)
- [Available Tools](#available-tools)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Sample Questions](#sample-questions)
- [Testing with curl](#testing-with-curl)
- [Deployment](#deployment)
- [Live Demo](#live-demo)
- [Contributing](#contributing)
- [Resources](#resources)
- [License](#license)

---

## Overview

TaxCo is a production-grade **agentic AI system** that automates Indian tax compliance for FY 2024-25. It combines large language models with real database operations — the agent autonomously looks up client financial profiles, calculates tax liability using Indian tax rules, determines tax harvesting strategies, and writes results back to AlloyDB — all from a single natural language query.

The system supports two AI models via a toggle:
- **Gemini 2.5 Flash** (primary) — Google's fast multimodal model with native function calling
- **Claude Sonnet 4** (secondary) — Anthropic's tool-use capable model

---

## Problem Statement

Tax compliance for Indian clients involves:

- **Complex slab-based salary taxation** under the new regime
- **Capital gains calculations** — LTCG at 12.5% above ₹1.25L exemption, STCG at 20% flat
- **Tax harvesting strategies** — identifying when to book losses or gains to optimise tax outgo
- **Manual data entry** — tax advisors spending hours updating client records

TaxCo solves this by giving tax advisors a natural language interface that handles the entire workflow end-to-end — from client lookup to record update — in seconds.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser / Client                          │
│                                                             │
│   taxco-ui.run.app  (nginx + HTML/JS frontend)             │
│        │                                                    │
│        ├──── Gemini 2.5 Flash ────┐                        │
│        │     (Google AI API)      │                        │
│        │                          ├──► Tool Calls          │
│        └──── Claude Sonnet ───────┘         │              │
│              (Anthropic API)                │              │
└─────────────────────────────────────────────┼──────────────┘
                                              │
                                              ▼
┌─────────────────────────────────────────────────────────────┐
│           mcp-toolbox.run.app  (Cloud Run)                  │
│                                                             │
│   MCP Toolbox for Databases                                 │
│   ├── find_client_by_name                                   │
│   ├── get_financial_profile                                 │
│   └── update_tax_records                                    │
└─────────────────────────────────────────────┬───────────────┘
                                              │
                                              ▼
┌─────────────────────────────────────────────────────────────┐
│           AlloyDB for PostgreSQL  (GCP)                     │
│                                                             │
│   clients table                                             │
│   ├── Financial data (salary, ltcg, stcg)                  │
│   ├── Tax results (tax_liability, tax_loss, tax_gain)       │
│   └── Vector embeddings (for semantic name search)          │
│                                                             │
│   Extensions: pgvector, google_ml_integration              │
│   Embedding model: text-embedding-005                       │
└─────────────────────────────────────────────────────────────┘
```

### Agentic Loop

```
User Query
    │
    ▼
AI Model (Gemini / Claude)
    │
    ├── Tool Call: find_client_by_name ──► AlloyDB (vector search)
    │        └── Returns: client_id
    │
    ├── Tool Call: get_financial_profile ──► AlloyDB
    │        └── Returns: salary, ltcg, stcg
    │
    ├── [Internal] Calculate tax liability + harvesting strategy
    │
    └── Tool Call: update_tax_records ──► AlloyDB
             └── Writes: tax_liability, tax_loss, tax_gain
    │
    ▼
Natural Language Response with breakdown
```

---

## Database — AlloyDB

### Instance Details

| Parameter | Value |
|-----------|-------|
| Project | `alloydb-tax-agent` |
| Region | `us-central1` |
| Cluster | `my-alloydb-cluster` |
| Instance | `my-primary-inst` |
| Database | `postgres` |

### Schema

```sql
CREATE TABLE clients (
  client_id          INT PRIMARY KEY,
  firstname          VARCHAR(50) NOT NULL,
  lastname           VARCHAR(50) NOT NULL,
  dateofbirth        DATE,
  gender             VARCHAR(10),
  address            VARCHAR(100),
  phonenumber        VARCHAR(20),
  email              VARCHAR(100),
  occupation         TEXT,
  annualincome       INT,
  salary             INT,
  ltcg               INT,
  stcg               INT,
  tax_liability      INT DEFAULT 0,
  tax_loss_suggested INT DEFAULT 0,
  tax_gain_suggested INT DEFAULT 0,
  embedding          vector(768)         -- for semantic name search
);
```

### Required Extensions

```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS google_ml_integration;
```

### Sample Clients

| ID | Name | Salary | LTCG | STCG |
|----|------|--------|------|------|
| 1 | Aarav Patel | ₹25,83,724 | ₹1,69,237 | ₹83,825 |
| 2 | Zara Khan | ₹11,35,292 | ₹1,46,598 | ₹30,633 |
| 3 | Vihaan Sharma | ₹26,80,681 | ₹1,13,147 | ₹51,889 |
| 4 | Ananya Gupta | ₹7,76,279 | ₹1,41,856 | ₹25,687 |
| 5 | Arjun Nair | ₹18,84,769 | ₹83,949 | ₹80,519 |
| 6 | Saanvi Verma | ₹22,25,732 | ₹80,873 | ₹89,869 |
| 7 | Ishaan Malhotra | ₹28,92,692 | ₹87,473 | ₹36,026 |
| 8 | Kyra Iyer | ₹7,81,022 | ₹1,91,737 | ₹8,072 |
| 9 | Reyansh Singh | ₹20,78,018 | ₹56,748 | ₹71,991 |
| 10 | Myra Joshi | ₹21,94,617 | ₹1,71,815 | ₹81,878 |

---

## Available Tools

### 1. `find_client_by_name`
Semantic vector search to find a client by name — handles fuzzy matches, partial names, and spelling variations.

| Parameter | Type | Description |
|-----------|------|-------------|
| `name_query` | string | The name of the client to search for |

```sql
SELECT client_id, firstname, lastname 
FROM clients 
ORDER BY embedding <=> embedding('text-embedding-005', $1)::vector 
LIMIT 1;
```

### 2. `get_financial_profile`
Fetches salary, LTCG, and STCG for a specific client.

| Parameter | Type | Description |
|-----------|------|-------------|
| `client_id` | integer | Unique client ID |

```sql
SELECT client_id, salary, ltcg, stcg 
FROM clients 
WHERE client_id = $1;
```

### 3. `update_tax_records`
Writes calculated tax liability and harvesting strategy back to the database.

| Parameter | Type | Description |
|-----------|------|-------------|
| `client_id` | integer | Unique client ID |
| `tax_liability` | integer | Total tax amount to be paid |
| `tax_loss` | integer | Suggested tax loss harvesting amount |
| `tax_gain` | integer | Suggested tax gain harvesting amount |

```sql
UPDATE clients 
SET tax_liability = $2, 
    tax_loss_suggested = $3, 
    tax_gain_suggested = $4
WHERE client_id = $1;
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| AI Models | Gemini 2.5 Flash, Claude Sonnet 4 |
| Tool Server | MCP Toolbox for Databases |
| Database | AlloyDB for PostgreSQL |
| Vector Search | pgvector extension |
| Embedding Model | text-embedding-005 (Google) |
| Frontend | HTML / CSS / Vanilla JS |
| Proxy / CORS | nginx |
| Container Registry | Artifact Registry (GCP) |
| CI/CD | Cloud Build |
| Hosting | Cloud Run (serverless) |
| Secrets | Secret Manager (GCP) |
| Dev Environment | Cloud Shell |

---

## Project Structure

```
~/tax/
├── .env                          # Environment variables (DB credentials)
├── Dockerfile                    # Container for MCP Toolbox
├── dbscript.sql                  # Full DB schema + seed data + embeddings
├── mcp-toolbox/
│   ├── toolbox                   # MCP Toolbox binary (linux/amd64)
│   ├── toolbox.log               # Local run logs
│   └── tools.yaml                # Tool definitions (sources + SQL)
└── ui/
    ├── Dockerfile                # nginx container for frontend
    ├── nginx.conf                # CORS proxy config
    └── index.html                # TaxCo frontend (Gemini + Claude toggle)
```

---

## Getting Started

### Prerequisites

- Google Cloud project with billing enabled
- AlloyDB cluster and instance running
- `gcloud` CLI configured
- Docker (or Cloud Build for remote builds)

### 1. Clone / Setup

```bash
mkdir -p ~/tax/mcp-toolbox ~/tax/ui
cd ~/tax
```

### 2. Configure AlloyDB

```bash
# Enable public IP
gcloud alloydb instances update my-primary-inst \
  --cluster=my-alloydb-cluster \
  --region=us-central1 \
  --assign-inbound-public-ip=ASSIGN_IPV4 \
  --database-flags=password.enforce_complexity=on \
  --project=alloydb-tax-agent

# Get public IP
gcloud alloydb instances describe my-primary-inst \
  --cluster=my-alloydb-cluster \
  --region=us-central1 \
  --project=alloydb-tax-agent \
  --format="value(publicIpAddress)"
```

### 3. Setup Database

```bash
PGPASSWORD="your-password" psql -h <PUBLIC_IP> -U postgres -d postgres << 'EOF'
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS google_ml_integration;
EOF

PGPASSWORD="your-password" psql -h <PUBLIC_IP> -U postgres -d postgres -f ~/tax/dbscript.sql
```

### 4. Configure tools.yaml

```yaml
sources:
  alloydb:
    kind: "postgres"
    host: "<PUBLIC_IP>"
    port: 5432
    database: "postgres"
    user: "postgres"
    password: "${DB_PASSWORD}"
```

### 5. Store Secret

```bash
echo -n "your-password" | gcloud secrets create alloydb-password \
  --data-file=- \
  --project=alloydb-tax-agent
```

### 6. Deploy MCP Toolbox

```bash
cd ~/tax
gcloud builds submit \
  --tag us-central1-docker.pkg.dev/alloydb-tax-agent/tax-agent/mcp-toolbox:latest .

gcloud run deploy mcp-toolbox \
  --image=us-central1-docker.pkg.dev/alloydb-tax-agent/tax-agent/mcp-toolbox:latest \
  --region=us-central1 \
  --project=alloydb-tax-agent \
  --set-env-vars="DB_PASSWORD=your-password" \
  --allow-unauthenticated \
  --port=7000 \
  --args="--tools-file,/app/tools.yaml,--port,7000,--address,0.0.0.0"
```

### 7. Deploy Frontend UI

```bash
cd ~/tax/ui
gcloud builds submit \
  --tag us-central1-docker.pkg.dev/alloydb-tax-agent/tax-agent/taxco-ui:latest .

gcloud run deploy taxco-ui \
  --image=us-central1-docker.pkg.dev/alloydb-tax-agent/tax-agent/taxco-ui:latest \
  --region=us-central1 \
  --project=alloydb-tax-agent \
  --allow-unauthenticated \
  --port=8080
```

---

## Sample Questions

Try these queries in the TaxCo UI:

```
Calculate tax liability for Zara Khan and update records
```
```
What is the financial profile of Aarav Patel?
```
```
Calculate taxes for Vihaan Sharma including harvesting strategy
```
```
Find client ID for Ananya Gupta and get their financial details
```
```
Calculate and save tax for all clients with LTCG above 1 lakh
```
```
What is the tax liability for Reyansh Singh?
```

---

## Testing with curl

### Check Toolbox Health

```bash
curl https://mcp-toolbox-408405281092.us-central1.run.app/api/toolset
```

### Find Client by Name (Semantic Search)

```bash
curl -X POST https://mcp-toolbox-408405281092.us-central1.run.app/api/tool/find_client_by_name/invoke \
  -H "Content-Type: application/json" \
  -d '{"name_query": "Zara Khan"}'
```

### Get Financial Profile

```bash
curl -X POST https://mcp-toolbox-408405281092.us-central1.run.app/api/tool/get_financial_profile/invoke \
  -H "Content-Type: application/json" \
  -d '{"client_id": 2}'
```

### Update Tax Records

```bash
curl -X POST https://mcp-toolbox-408405281092.us-central1.run.app/api/tool/update_tax_records/invoke \
  -H "Content-Type: application/json" \
  -d '{"client_id": 2, "tax_liability": 150000, "tax_loss": 20000, "tax_gain": 10000}'
```

### Test via UI Proxy (CORS-safe)

```bash
curl -X POST https://taxco-ui-408405281092.us-central1.run.app/api/tool/find_client_by_name/invoke \
  -H "Content-Type: application/json" \
  -d '{"name_query": "Aarav Patel"}'
```

### Test Gemini API

```bash
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{"role": "user", "parts": [{"text": "Say hello"}]}]
  }'
```

---

## Deployment

### Cloud Run Services

| Service | URL | Purpose |
|---------|-----|---------|
| `mcp-toolbox` | `https://mcp-toolbox-408405281092.us-central1.run.app` | AlloyDB tool API |
| `taxco-ui` | `https://taxco-ui-408405281092.us-central1.run.app` | Frontend UI + CORS proxy |

### Docker Images

| Image | Registry |
|-------|----------|
| `mcp-toolbox:latest` | `us-central1-docker.pkg.dev/alloydb-tax-agent/tax-agent/mcp-toolbox` |
| `taxco-ui:latest` | `us-central1-docker.pkg.dev/alloydb-tax-agent/tax-agent/taxco-ui` |

### Rebuild and Redeploy

```bash
# Rebuild toolbox
cd ~/tax
gcloud builds submit \
  --tag us-central1-docker.pkg.dev/alloydb-tax-agent/tax-agent/mcp-toolbox:latest .

# Rebuild UI
cd ~/tax/ui
gcloud builds submit \
  --tag us-central1-docker.pkg.dev/alloydb-tax-agent/tax-agent/taxco-ui:latest .
```

---

## Live Demo

| Resource | URL |
|----------|-----|
| 🌐 TaxCo UI | https://taxco-ui-408405281092.us-central1.run.app |
| 🔧 MCP Toolbox API | https://mcp-toolbox-408405281092.us-central1.run.app/api/toolset |

**To use the UI:**
1. Open the TaxCo UI URL
2. Enter your **Google AI API key** (`AIza...`) for Gemini or **Anthropic API key** (`sk-ant-...`) for Claude
3. Click **SAVE KEYS**
4. Select a client from the sidebar or type a query
5. Click **▶ RUN AGENT**

---

## Indian Tax Rules (FY 2024-25)

### New Regime Salary Slabs

| Income Range | Tax Rate |
|-------------|----------|
| 0 – ₹3,00,000 | 0% |
| ₹3,00,001 – ₹7,00,000 | 5% |
| ₹7,00,001 – ₹10,00,000 | 10% |
| ₹10,00,001 – ₹12,00,000 | 15% |
| ₹12,00,001 – ₹15,00,000 | 20% |
| Above ₹15,00,000 | 30% |

- **Standard Deduction:** ₹75,000
- **LTCG:** 12.5% on gains above ₹1,25,000 exemption
- **STCG:** 20% flat on short-term equity gains

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Update `tools.yaml` for new tool definitions
4. Update `dbscript.sql` for schema changes
5. Test with curl before deploying
6. Submit a pull request

### Adding a New Tool

```yaml
# In tools.yaml
tools:
  your_new_tool:
    kind: postgres-sql
    source: alloydb
    description: "Description of what this tool does."
    parameters:
      - name: param_name
        type: string
        description: "Parameter description."
    statement: |
      SELECT * FROM clients WHERE column = $1;
```

---

## Resources

- [MCP Toolbox for Databases](https://googleapis.github.io/genai-toolbox/)
- [AlloyDB Documentation](https://cloud.google.com/alloydb/docs)
- [AlloyDB pgvector](https://cloud.google.com/alloydb/docs/ai/work-with-embeddings)
- [Gemini API Documentation](https://ai.google.dev/gemini-api/docs)
- [Gemini Function Calling](https://ai.google.dev/gemini-api/docs/function-calling)
- [Claude Tool Use](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Artifact Registry](https://cloud.google.com/artifact-registry/docs)
- [Google AI Studio (Get API Key)](https://aistudio.google.com/app/apikey)
-[Codelabs](https://codelabs.developers.google.com/search-app-with-geminicli)
---

## License

This project is licensed under the MIT License.

```
MIT License

Copyright (c) 2026 TaxCo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

*Built with ❤️ using Google Cloud, AlloyDB, MCP Toolbox, Gemini 2.5 Flash, and Claude Sonnet*
