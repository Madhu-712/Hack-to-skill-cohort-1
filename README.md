
The Google Cloud Gen AI Academy APAC 2026 is an expanded, challenge-based program designed to upskill professionals in Generative AI across the region [1, 2].
Spanning three quarters, the program focuses on a "Learn, Challenge, Build" framework utilizing Google Cloud tools like Vertex AI and GKE to create production-ready applications [1, 2]. 
For full program details, visit the Gen AI Academy APAC 2026 website.

---

# 🍰 SweetTreats Marketing Intelligence System (Hackathon)

This section details the dynamic, data-driven marketing dashboard and AI agent implemented for the bakery campaign analysis.

### 🚀 Frontend Features
- **Visual Analytics Dashboard**: Interactive Doughnut and Pie charts visualizing platform engagement and content distribution.
- **Agentic Query Engine**: A built-in AI assistant that processes natural language queries about reach, sentiment, and performance.
- **Dynamic Filtering**: Real-time month-wise data segmentation (March vs. February).

### 📂 Project Structure
- **/Hackathon/frontend**: Contains the web interface (`index.html` and `script.js`).
- **/social data.txt**: The underlying dataset used for logic mapping.

### 🛠️ Execution Steps
1. **Navigate to the dashboard folder**:
   ```bash
   cd Hackathon/frontend
   ```
2. **Launch a local server**:
   ```bash
   python -m http.server 8000
   ```
3. **Open the App**:
   Visit [http://localhost:8000](http://localhost:8000) in your browser.

### 📊 Interaction Guide
- **Search**: Type keywords in the top-right bar to filter the activity log.
- **AI Agent**: Type a question (e.g., "Best platform?") and press **Enter** to see the SweetTreats AI calculate insights instantly.
