let chartInstance;

function simulate() {
  const profile = document.getElementById('profile').value;
  const loading = document.getElementById('loading');
  if (loading) loading.style.display = 'block';

  fetch('http://localhost:3000/simulate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile })
  })
  .then(res => {
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    return res.json();
  })
  .then(data => {
    console.log('Simulation result:', data);
    showChart(data);
    loadLogs(); // Refresh logs after simulation
  })
  .catch(err => {
    console.error('Simulation failed:', err);
    alert('Simulation failed. Is your backend running?');
  })
  .finally(() => {
    if (loading) loading.style.display = 'none';
  });
}

function showChart(data) {
  const ctx = document.getElementById('chart');
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Latency (ms)', 'Packet Loss (%)'],
      datasets: [{
        label: 'Network Performance',
        data: [data.latency, data.packetLoss],
        backgroundColor: ['#3498db', '#e74c3c']
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

function resetChart() {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
}

function loadLogs() {
  fetch('http://localhost:3000/logs')
    .then(res => res.json())
    .then(logs => {
      const list = document.getElementById('logList');
      list.innerHTML = '';

      logs.forEach(log => {
        const item = document.createElement('li');
        item.textContent = `${log.profile.toUpperCase()} → Latency: ${log.latency}ms, Packet Loss: ${log.packetLoss}%, Time: ${new Date(log.timestamp).toLocaleString()}`;
        list.appendChild(item);
      });
    })
    .catch(err => {
      console.error('Error loading logs:', err);
    });
}