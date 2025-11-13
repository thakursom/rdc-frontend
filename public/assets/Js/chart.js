// ############## monthly revenue ###############

const rdcCtxDashboardBar = document.getElementById('barChartDashboard').getContext('2d');
const rdcDashboardBarChart = new Chart(rdcCtxDashboardBar, {
  type: 'bar',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: '',
      data: [1800, 2000, 2200, 2800, 4500, 5200],
      backgroundColor: '#14CDBB',
      borderRadius: {
        topLeft: 6,
        topRight: 6,
        bottomLeft: 0,
        bottomRight: 0
      },
      borderSkipped: false,
      barPercentage: 0.6 // ✅ 60% width
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
        max: 6000,
        ticks: {
          stepSize: 1500,
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
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    responsive: true,
    maintainAspectRatio: false
  }
});





//############## Plateform Share ##############

  


const Utils = {
  rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  numbers(cfg) {
    const nums = [];
    for (let i = 0; i < cfg.count; i++) {
      nums.push(this.rand(cfg.min, cfg.max));
    }
    return nums;
  },
  CHART_COLORS: {
    green: '#14CDBB',
    purple: '#9550DF',
    orange: '#F88C65',
    yellow: '#FFB748',
    blue: '#656FF7'
  }
};

const DATA_COUNT = 5;
const NUMBER_CFG = { count: DATA_COUNT, min: 0, max: 100 };

const data = {
  labels: ['green', 'purple', 'orange', 'yellow', 'blue'],
  datasets: [
    {
      label: 'Dataset 1',
      data: Utils.numbers(NUMBER_CFG),
      backgroundColor: Object.values(Utils.CHART_COLORS).slice(0, DATA_COUNT),
    }
  ]
};

const config = {
  type: 'doughnut',
  data: data,
  options: {
    responsive: true,
    maintainAspectRatio: true, 
    aspectRatio: 1,            
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
      }
    }
  },
};

const myChart = new Chart(
  document.getElementById('myChart'),
  config
);


const chartCanvas = document.getElementById('myChart');
chartCanvas.style.width = '100%';
chartCanvas.style.height = 'auto';
chartCanvas.style.maxWidth = '600px';  



//############## revenue by month ############## 

const revenueCtx = document.getElementById('revenueChart').getContext('2d');
  const revenueChart = new Chart(revenueCtx, {
    type: 'bar',
    data: {
      labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
      datasets: [
        {
          label: 'RDC Channel',
          data: [4, 3, 2.5, 2, 3.5, 5, 4.5, 5, 3, 3.1, 3.1, 3.1],
          backgroundColor: '#14CDBB'
        },
        {
          label: 'Premium Revenue',
          data: [3, 2.7, 2.2, 1.6, 2.4, 2.2, 2.2, 2.2, 2, 2, 2, 2],
          backgroundColor: '#9550DF'
        },
        {
          label: 'Art Track',
          data: [1.6, 1.4, 1.3, 1, 1.1, 1.2, 1.1, 1.1, 1, 1, 1, 1],
          backgroundColor: '#FFB748'
        },
        {
          label: 'UGC',
          data: [2.2, 1.8, 1.6, 1.4, 1.6, 1.4, 1.6, 1.7, 1.2, 1.2, 1.2, 1.2],
          backgroundColor: '#656FF7'
        },
        {
          label: 'Partner Channel',
          data: [1.2, 1, 0.8, 0.6, 0.7, 1, 0.7, 0.7, 0.6, 0.6, 0.6, 0.6],
          backgroundColor: '#F88C65'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        }
      },
      scales: {
        x: {
          stacked: true,
          grid: {
            display: false
          }
        },
        y: {
          stacked: true,
          beginAtZero: true,
          max: 12,
          title: {
            display: true,
            text: 'Revenue (Millions $)'
          },
          grid: {
            display: false
          }
        }
      }
    }
  });


// ############## Music Streams Dashboard chart ##############


  const initialLabels = ['2023', '2024', '2025'];
        const initialData = [12000, 15000, 18000];

        const distributorLabels = [
            'YouTube',
            'Spotify',
            'Apple Music',
            'JioSaavn',
            'Gaana'
        ];
        const distributorData = [7200, 4300, 6000, 2900, 2700];

        const yearCtx = document.getElementById('yearChart').getContext('2d');
        let expanded = false;
        let lastState = {
            labels: initialLabels,
            data: initialData
        };
        const yearChart = new Chart(yearCtx, {
            type: 'bar',
            data: {
                labels: initialLabels,
                datasets: [{
                    data: initialData,
                    backgroundColor: '#2ED3C6',
                    borderRadius: 7,
                    barPercentage: 0.55,
                    categoryPercentage: 0.6
                }]
            },
            options: {
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: {
                            font: { family: 'Inter, Arial, sans-serif', size: 16 }
                        }
                    },
                    y: {
                        grid: { display: false },
                        beginAtZero: true,
                        ticks: {
                            stepSize: 3696,
                            font: { family: 'Inter, Arial, sans-serif', size: 14 }
                        }
                    }
                },
                onClick: (evt, elements) => {
                    if (!expanded && elements.length > 0) {
                        
                        lastState = {
                            labels: yearChart.data.labels.slice(),
                            data: yearChart.data.datasets[0].data.slice()
                        };
                        yearChart.data.labels = distributorLabels;
                        yearChart.data.datasets[0].data = distributorData;
                        yearChart.update();
                        expanded = true;
                    } else if (expanded) {
                        
                        yearChart.data.labels = lastState.labels;
                        yearChart.data.datasets[0].data = lastState.data;
                        yearChart.update();
                        expanded = false;
                    }
                }
            }
        });



// ############## Weekly Streams ##############


const weeklyCtx = document.getElementById('weeklyChart').getContext('2d');

    new Chart(weeklyCtx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Steps per Day',
          data: [4000, 3200, 5000, 4600, 6800, 9200, 6500],
          borderColor: 'orange',
          backgroundColor: 'orange',
          tension: 0.4, 
          pointBackgroundColor: '#F59E0B',
          pointBorderColor: 'white',
          pointRadius: 6,
          pointHoverRadius: 8,
          borderWidth: 4
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 10000,
            grid: { display: false } 
          },
          x: {
            grid: { display: false } 
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  


// ############## Music Stream Comparison ##############


 const streamsCtx = document.getElementById('streamsChart').getContext('2d');

    new Chart(streamsCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [
          {
            label: '2024',
            data: [1000, 3000, 5000, 2000, 11000],
            borderColor: '#656FF7', // blue
            backgroundColor: '#656FF7',
            pointBackgroundColor: '#656FF7',
            pointBorderColor: 'white',
            borderWidth: 3,
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 7
          },
          {
            label: '2025',
            data: [2000, 6500, 9000, 4000, 20000],
            borderColor: '#14CDBB', // teal/green
            backgroundColor: '#14CDBB',
            pointBackgroundColor: '#14CDBB',
            pointBorderColor: 'white',
            borderWidth: 3,
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 7
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Streams',
              color: '#363636'
            },
            grid: { display: false } 
          },
          x: {
            grid: { display: false }
          }
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              usePointStyle: true,
              boxWidth: 10
            }
          }
        }
      }
    });





// ############## Streaming Trends Over Time ##############


    const musicCtx = document.getElementById('musicChart').getContext('2d');

    const datasets = {
      all:  { color: '#656FF7', data: [1.5, 2, 2.5, 5.2, 3.8, 3.2, 3.9, 4.3] },
      rdc:  { color: '#14CDBB', data: [1.2, 1.8, 2.3, 4.8, 3.9, 3.4, 3.6, 4.0] },
      tunec:{ color: '#9550DF', data: [0.8, 1.3, 1.9, 4.5, 3.5, 3.1, 3.8, 4.1] },
      ditto:{ color: '#F88C65', data: [1.0, 1.5, 2.0, 3.7, 3.1, 2.8, 3.3, 3.9] },
      amus: { color: '#FFB748', data: [0.9, 1.6, 2.4, 4.0, 3.6, 3.2, 3.7, 4.2] }
    };

    const musicChart = new Chart(musicCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        datasets: [{
          label: 'Streams (Millions)',
          data: datasets.all.data,
          borderColor: datasets.all.color,
          backgroundColor: `${datasets.all.color}50`,
          fill: true,
          tension: 0.4,
          borderWidth: 3,
          pointBackgroundColor: datasets.all.color,
          pointBorderColor: '#fff',
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Streams (Millions)',
              color: '#6A7282'
            },
            grid: { display: false }
          },
          x: {
            grid: { display: false }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });

    document.querySelectorAll('.stream-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.stream-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const type = btn.classList[1];
        const selected = datasets[type];

        const chartData = musicChart.data.datasets[0];
        chartData.data = selected.data;
        chartData.borderColor = selected.color;
        chartData.backgroundColor = `${selected.color}50`;
        chartData.pointBackgroundColor = selected.color;

        musicChart.update();
      });
    });



    
 

















    