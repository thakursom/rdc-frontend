
// ############ Net Revnue By Month #################


    const canvasEl = document.getElementById('rdcRevenueChart2');

const chart = new Chart(canvasEl, {
  type: 'bar',
  data: {
    labels: ['US', 'UK', 'France', 'Germany', 'Japan', 'India', 'Brazil'],
    datasets: [
      { label: 'Premium Revenue', data: [200000, 400000, 350000, 80000, 50000, 30000, 20000], backgroundColor: '#9550DF', barPercentage: 0.7, categoryPercentage: 0.7 },
      { label: 'Art Track', data: [150000, 300000, 250000, 60000, 40000, 20000, 15000], backgroundColor: '#656FF7', barPercentage: 0.7, categoryPercentage: 0.7 },
      { label: 'UGC', data: [300000, 500000, 400000, 100000, 50000, 30000, 20000], backgroundColor: '#14CDBB', barPercentage: 0.7, categoryPercentage: 0.7 },
      { label: 'RDC Channel', data: [450000, 600000, 500000, 130000, 70000, 40000, 30000], backgroundColor: '#FFB748', barPercentage: 0.7, categoryPercentage: 0.7 },
      { label: 'Partner Channel', data: [200000, 300000, 200000, 90000, 50000, 30000, 10000], backgroundColor: '#F88C65', barPercentage: 0.7, categoryPercentage: 0.7 },
      { label: 'Sound Recording', data: [100000, 250000, 200000, 70000, 30000, 20000, 10000], backgroundColor: '#6E6E6E', barPercentage: 0.7, categoryPercentage: 0.7 }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          font: { size: 12 },
          padding: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const v = context.raw ?? context.parsed?.y ?? context.parsed;
            return context.dataset.label + ': ' + v.toLocaleString();
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 0,
          minRotation: 0
        }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: {
          display: false 
        },
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


  
// ############ Revnue By Channel #################



const revenueCtx2 = document.getElementById('revenueBarChart2').getContext('2d');

const revenueBarChart2 = new Chart(revenueCtx2, {
  type: 'bar',
  data: {
    labels: ['Premium', 'Art', 'UGC', 'RDC', 'Partner', 'Sound'],
    datasets: [{
      label: '',
      data: [700000, 1300000, 1000000, 2000000, 2500000, 1500000], 
      backgroundColor: ['#9550DF', '#14CDBB', '#656FF7', '#FFB748', '#F88C65', '#6E6E6E'],
      borderRadius: {
        topLeft: 6,
        topRight: 6
      },
      borderSkipped: false
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let value = context.raw;
            return value.toLocaleString(); 
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            if (value >= 1000000) return value / 1000000 + 'M';
            if (value >= 1000) return value / 1000 + 'k';
            return value;
          },
          color: '#363636',
          font: {
            size: 12
          }
        },
        grid: {
          display: false
        }
      },
      x: {
        ticks: {
          color: '#363636',
          font: {
            size: 14
          }
        },
        grid: {
          display: false
        }
      }
    }
  }
});



// ############ Revnue By Country #################



const countryCtx = document.getElementById('countryRevenueChart').getContext('2d');

const countryRevenueChart = new Chart(countryCtx, {
  type: 'bar',
  data: {
    labels: ['USA', 'UK', 'Germany', 'India', 'Brazil', 'Japan'],
    datasets: [{
      label: '',
      data: [2300000, 2000000, 1400000, 2100000, 1700000, 2200000], 
      backgroundColor: [
        '#9550DF', // USA
        '#14CDBB', // UK
        '#656FF7', // Germany
        '#FFB748', // India
        '#F88C65', // Brazil
        '#6E6E6E'  // Japan
      ],
      borderRadius: {
        topLeft: 6,
        topRight: 6
      },
      borderSkipped: false
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.raw.toLocaleString();
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            if (value >= 1000000) return value / 1000000 + 'M';
            if (value >= 1000) return value / 1000 + 'k';
            return value;
          },
          color: '#363636',
          font: { size: 12 }
        },
        grid: { display: false }
      },
      x: {
        ticks: {
          color: '#363636',
          font: { size: 14 }
        },
        grid: { display: false }
      }
    }
  }
});


