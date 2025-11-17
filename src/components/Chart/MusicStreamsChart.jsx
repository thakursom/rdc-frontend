import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

function MusicStreamsChart() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const initialLabels = ["2023", "2024", "2025"];
    const initialData = [12000, 15000, 18000];

    const distributorLabels = [
      "YouTube",
      "Spotify",
      "Apple Music",
      "JioSaavn",
      "Gaana"
    ];
    const distributorData = [7200, 4300, 6000, 2900, 2700];

    let expanded = false;
    let lastState = {
      labels: initialLabels,
      data: initialData
    };

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: initialLabels,
        datasets: [
          {
            data: initialData,
            backgroundColor: "#2ED3C6",
            borderRadius: 7,
            barPercentage: 0.55,
            categoryPercentage: 0.6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              font: {
                family: "Inter, Arial, sans-serif",
                size: 16
              }
            }
          },
          y: {
            grid: { display: false },
            beginAtZero: true,
            ticks: {
              stepSize: 3696,
              font: {
                family: "Inter, Arial, sans-serif",
                size: 14
              }
            }
          }
        },

        // 🔥 Expand / collapse logic
        onClick: (evt, elements) => {
          const chart = chartInstance.current;

          if (!expanded && elements.length > 0) {
            lastState = {
              labels: [...chart.data.labels],
              data: [...chart.data.datasets[0].data]
            };

            chart.data.labels = distributorLabels;
            chart.data.datasets[0].data = distributorData;
            chart.update();
            expanded = true;
          } else if (expanded) {
            chart.data.labels = lastState.labels;
            chart.data.datasets[0].data = lastState.data;
            chart.update();
            expanded = false;
          }
        }
      }
    });
  }, []);

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}

export default MusicStreamsChart;
