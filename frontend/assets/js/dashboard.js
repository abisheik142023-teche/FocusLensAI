let activityChart, appUsageChart;

async function fetchData() {
  return {
    productiveHours: (6 + Math.random()).toFixed(1),
    focusPercentage: Math.min(100, Math.floor(80 + Math.random() * 10)),
    burnoutRisk: Math.min(100, Math.floor(20 + Math.random() * 15)),
    weeklyTrend: Math.floor(5 + Math.random() * 6),
    performanceScore: Math.floor(70 + Math.random() * 30),
    activityData: [
      (4 + Math.random()).toFixed(1),
      (1 + Math.random()).toFixed(1),
      (1.5 + Math.random()).toFixed(1),
      (0.5 + Math.random()).toFixed(1),
      (1 + Math.random()).toFixed(1)
    ],
    appUsageData: [
      30 + Math.floor(Math.random() * 10),
      20 + Math.floor(Math.random() * 10),
      15 + Math.floor(Math.random() * 10),
      10 + Math.floor(Math.random() * 10),
      5 + Math.floor(Math.random() * 5)
    ]
  };
}

function initCharts(data) {
  const actCtx = document.getElementById('activityChart').getContext('2d');
  activityChart = new Chart(actCtx, {
    type: 'bar',
    data: {
      labels: ['Focus','Meetings','Communication','Break','Distracted'],
      datasets: [{ label: 'Hours', data: data.activityData }]
    },
    options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
  });

  const appCtx = document.getElementById('appUsageChart').getContext('2d');
  appUsageChart = new Chart(appCtx, {
    type: 'doughnut',
    data: { labels: ['VS Code','Slack','Chrome','Zoom','Terminal'], datasets: [{ data: data.appUsageData }] },
    options: { responsive: true, maintainAspectRatio: false }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const data = await fetchData();
  initCharts(data);
  document.getElementById('refreshBtn').addEventListener('click', async () => {
    const d = await fetchData();
    activityChart.data.datasets[0].data = d.activityData;
    activityChart.update();
    appUsageChart.data.datasets[0].data = d.appUsageData;
    appUsageChart.update();
  });
});
