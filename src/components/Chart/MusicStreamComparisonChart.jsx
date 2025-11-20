import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

function MusicStreamComparisonChart() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May"],
        datasets: [
          {
            label: "2024",
            data: [1000, 3000, 5000, 2000, 11000],
            borderColor: "#656FF7",
            backgroundColor: "#656FF7",
            pointBackgroundColor: "#656FF7",
            pointBorderColor: "white",
            borderWidth: 3,
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 7
          },
          {
            label: "2025",
            data: [2000, 6500, 9000, 4000, 20000],
            borderColor: "#14CDBB",
            backgroundColor: "#14CDBB",
            pointBackgroundColor: "#14CDBB",
            pointBorderColor: "white",
            borderWidth: 3,
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 7
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: {
              usePointStyle: true,
              boxWidth: 10
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Streams",
              color: "#363636"
            },
            grid: { display: false }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });

    return () => chartInstance.current?.destroy();
  }, []);

  return (
    <div style={{ width: "100%", height: "350px" }}>
      <canvas id="streamsChart" ref={chartRef}></canvas>
    </div>
  );
}

export default MusicStreamComparisonChart;
