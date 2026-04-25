// Comprehensive Dataset
const socialData = [
    { id: "SM001", platform: "Facebook", type: "Image", content: "Fresh cookies!", engagement: 7.4, sentiment: "Positive", device: "Mobile", reach: 2500, month: "03" },
    { id: "SM002", platform: "Instagram", type: "Reel", content: "Morning bake!", engagement: 7.8, sentiment: "Positive", device: "Mobile", reach: 3200, month: "03" },
    { id: "SM003", platform: "Twitter", type: "Text", content: "Oatmeal raisin...", engagement: 5.0, sentiment: "Neutral", device: "Desktop", reach: 1800, month: "03" },
    { id: "SM004", platform: "Facebook", type: "Video", content: "Brownie test!", engagement: 8.0, sentiment: "Positive", device: "Desktop", reach: 2800, month: "03" },
    { id: "SM005", platform: "Instagram", type: "Story", content: "Sugar cookies!", engagement: 8.1, sentiment: "Positive", device: "Mobile", reach: 1500, month: "03" },
    { id: "SM011", platform: "Instagram", type: "Live", content: "Baker Q&A!", engagement: 7.4, sentiment: "Positive", device: "Mobile", reach: 3500, month: "03" },
    { id: "SM014", platform: "Instagram", type: "Image", content: "Fudgy brownies!", engagement: 8.3, sentiment: "Positive", device: "Mobile", reach: 3300, month: "03" },
    { id: "SM030", platform: "Facebook", type: "Image", content: "Feb Batch 1", engagement: 6.2, sentiment: "Positive", device: "Mobile", reach: 2100, month: "02" },
    { id: "SM031", platform: "Instagram", type: "Reel", content: "Feb Reel 1", engagement: 9.5, sentiment: "Positive", device: "Mobile", reach: 4200, month: "02" },
    { id: "SM032", platform: "Twitter", type: "Text", content: "Feb Tweet", engagement: 4.1, sentiment: "Neutral", device: "Desktop", reach: 1200, month: "02" },
    { id: "SM033", platform: "Facebook", type: "Video", content: "Feb Video", engagement: 6.8, sentiment: "Positive", device: "Desktop", reach: 2400, month: "02" }
];

let platformChart, typeChart;

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    updateDashboard('03'); // Default to March
    setupEventListeners();
    addChatWindow();
});

function setupEventListeners() {
    const monthSelect = document.getElementById('monthSelect');
    if(monthSelect) {
        monthSelect.addEventListener('change', (e) => {
            updateDashboard(e.target.value);
        });
    }

    const searchInput = document.getElementById('agentSearch');
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = socialData.filter(item => 
                item.content.toLowerCase().includes(term) || 
                item.platform.toLowerCase().includes(term)
            );
            populateTable(filtered);
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const agent = new SweetTreatsAgent(socialData);
                const response = agent.processQuery(searchInput.value);
                showAgentResponse(searchInput.value, response);
                searchInput.value = '';
            }
        });
    }
}

function updateDashboard(month) {
    const filteredData = month === 'all' ? socialData : socialData.filter(d => d.month === month);
    
    populateTable(filteredData);
    updateMetrics(filteredData);
    updateCharts(filteredData);
    updatePlatformBars(filteredData);
}

function initCharts() {
    const canvas1 = document.getElementById('platformChart');
    const canvas2 = document.getElementById('typeChart');
    
    if(!canvas1 || !canvas2) return;

    const ctx1 = canvas1.getContext('2d');
    const ctx2 = canvas2.getContext('2d');

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20, font: { size: 10 } } }
        }
    };

    platformChart = new Chart(ctx1, {
        type: 'doughnut',
        data: { labels: [], datasets: [{ data: [], backgroundColor: ['#ec4899', '#2563eb', '#38bdf8'] }] },
        options: commonOptions
    });

    typeChart = new Chart(ctx2, {
        type: 'pie',
        data: { labels: [], datasets: [{ data: [], backgroundColor: ['#f472b6', '#fb923c', '#818cf8', '#34d399', '#a78bfa'] }] },
        options: commonOptions
    });
}

function updateCharts(data) {
    if(!platformChart || !typeChart) return;

    // 1. Platform Distribution
    const platforms = [...new Set(data.map(d => d.platform))];
    const platformCounts = platforms.map(p => data.filter(d => d.platform === p).length);
    platformChart.data.labels = platforms;
    platformChart.data.datasets[0].data = platformCounts;
    platformChart.update();

    // 2. Type Distribution
    const types = [...new Set(data.map(d => d.type))];
    const typeCounts = types.map(t => data.filter(d => d.type === t).length);
    typeChart.data.labels = types;
    typeChart.data.datasets[0].data = typeCounts;
    typeChart.update();
}

function updatePlatformBars(data) {
    const container = document.getElementById('platformBars');
    if(!container) return;
    
    const platforms = ['Instagram', 'Facebook', 'Twitter'];
    container.innerHTML = platforms.map(p => {
        const pData = data.filter(d => d.platform === p);
        if(pData.length === 0) return '';
        const avgEngage = (pData.reduce((acc, curr) => acc + curr.engagement, 0) / pData.length).toFixed(1);
        const color = p === 'Instagram' ? 'bg-pink-500' : p === 'Facebook' ? 'bg-blue-600' : 'bg-sky-400';
        const icon = p === 'Instagram' ? 'fab fa-instagram text-pink-500' : p === 'Facebook' ? 'fab fa-facebook text-blue-600' : 'fab fa-twitter text-sky-400';
        
        return `
            <div>
                <div class="flex justify-between text-sm mb-2">
                    <span class="font-semibold"><i class="${icon} mr-2"></i> ${p}</span>
                    <span class="text-slate-500">${avgEngage}% Engagement</span>
                </div>
                <div class="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div class="${color} h-full rounded-full transition-all duration-1000" style="width: ${avgEngage * 10}%"></div>
                </div>
            </div>
        `;
    }).join('');
}

function populateTable(data) {
    const tableBody = document.getElementById('activityTable');
    if(!tableBody) return;
    tableBody.innerHTML = '';
    data.forEach(item => {
        const row = document.createElement('tr');
        row.className = "hover:bg-slate-50 transition";
        row.innerHTML = `
            <td class="px-8 py-4">
                <p class="font-bold text-sm">${item.content}</p>
                <p class="text-xs text-slate-400">${item.id}</p>
            </td>
            <td class="px-8 py-4"><span class="bg-slate-100 px-2 py-1 rounded text-xs font-bold">${item.type}</span></td>
            <td class="px-8 py-4 font-bold text-pink-600">${item.engagement}%</td>
            <td class="px-8 py-4 text-xs">
                <span class="px-2 py-1 rounded-full ${item.sentiment === 'Positive' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'} font-bold">
                    ${item.sentiment}
                </span>
            </td>
            <td class="px-8 py-4 text-xs text-slate-400"><i class="fas ${item.device === 'Mobile' ? 'fa-mobile-alt' : 'fa-desktop'} mr-1"></i> ${item.device}</td>
        `;
        tableBody.appendChild(row);
    });
}

function updateMetrics(data) {
    const totalReach = data.reduce((acc, curr) => acc + curr.reach, 0);
    const avgEngage = data.length > 0 ? (data.reduce((acc, curr) => acc + curr.engagement, 0) / data.length).toFixed(1) : 0;
    
    const reachEl = document.getElementById('totalReach');
    const engageEl = document.getElementById('avgEngage');
    if(reachEl) reachEl.innerText = totalReach.toLocaleString();
    if(engageEl) engageEl.innerText = avgEngage + '%';
}

class SweetTreatsAgent {
    constructor(data) { this.data = data; }
    processQuery(q) {
        q = q.toLowerCase();
        if (q.includes('best')) return "Your best performing post in this view is currently identified. Instagram Reels consistently lead engagement.";
        return "I am analyzing the " + this.data.length + " filtered records for you.";
    }
}

function addChatWindow() {
    if(document.getElementById('agentChat')) return;
    const container = document.createElement('div');
    container.id = 'agentChat';
    container.className = 'fixed bottom-8 right-8 w-80 glass-card rounded-3xl p-6 hidden z-[100] border-2 border-pink-200 shadow-2xl';
    container.innerHTML = `
        <div class="flex justify-between items-center mb-4"><h3 class="font-bold text-pink-600"><i class="fas fa-robot mr-2"></i> SweetTreats AI</h3><button onclick="document.getElementById('agentChat').classList.add('hidden')"><i class="fas fa-times"></i></button></div>
        <div id="chatMessages" class="text-xs space-y-4 max-h-60 overflow-y-auto mb-4 scrollbar-hide"></div>
    `;
    document.body.appendChild(container);
}

function showAgentResponse(query, response) {
    const chat = document.getElementById('agentChat');
    const messages = document.getElementById('chatMessages');
    if(!chat || !messages) return;
    chat.classList.remove('hidden');
    messages.innerHTML += `<div class="bg-pink-500 text-white p-2 rounded-xl ml-8 mb-2">${query}</div>`;
    setTimeout(() => {
        messages.innerHTML += `<div class="bg-slate-100 p-2 rounded-xl mr-8 mb-2">${response}</div>`;
        messages.scrollTop = messages.scrollHeight;
    }, 500);
}
