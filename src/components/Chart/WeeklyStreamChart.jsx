import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

function WeeklyStreamChart() {
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
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Steps per Day",
            data: [4000, 3200, 5000, 4600, 6800, 9200, 6500],
            borderColor: "orange",
            backgroundColor: "orange",
            pointBackgroundColor: "#F59E0B",
            pointBorderColor: "white",
            pointRadius: 6,
            pointHoverRadius: 8,
            borderWidth: 4,
            tension: 0.4 // smooth curve
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            max: 10000,
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
      <canvas id="weeklyChart" ref={chartRef}></canvas>
    </div>
  );
}

export default WeeklyStreamChart;
