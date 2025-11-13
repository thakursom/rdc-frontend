
// ############ Daily Sales & Trends #################



const lineCanvas = document.getElementById('lineChart');

new Chart(lineCanvas, {
  type: 'line',
  data: {
    labels: [
      '2025-07-29',
      '2025-08-12',
      '2025-08-18',
      '2025-08-20',
      '2025-08-23',
      '2025-08-24'
    ],
    datasets: [{
      label: 'Revenue Growth',
      data: [10, 5, 50, 80, 60, 300],
      borderColor: '#32A6FF',
      backgroundColor: '#32A6FF',
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.4,
      borderWidth: 3,
      fill: false
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      x: {
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        grid: { display: false },
        ticks: {
          callback: function (value) {
            if (value >= 1000000) return value / 1000000 + 'M';
            if (value >= 1000) return value / 1000 + 'k';
            return value;
          }
        }
      }
    }
  }
});