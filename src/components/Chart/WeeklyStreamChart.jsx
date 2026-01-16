import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

function WeeklyStreamChart({ weeklyData = [] }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (!weeklyData?.length) {
      return;
    }

    const ctx = chartRef.current.getContext("2d");

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: weeklyData.map(item => item.day),
        datasets: [
          {
            label: "Streams",
            data: weeklyData.map(item => item.streams || 0),
            borderColor: "orange",
            backgroundColor: "orange",
            pointBackgroundColor: "#F59E0B",
            pointBorderColor: "white",
            pointRadius: 6,
            pointHoverRadius: 8,
            borderWidth: 4,
            tension: 0.4
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
          y: {
            beginAtZero: true,
            suggestedMax: Math.max(...weeklyData.map(d => d.streams || 0), 10000) * 1.1,
            grid: { display: false },
            ticks: {
              callback: value => value.toLocaleString()
            }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [weeklyData]);

  if (!weeklyData?.length) {
    return (
      <div
        style={{
          width: "100%",
          height: "350px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#888",
          fontSize: "1rem"
        }}
      >
        No weekly stream data available
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "350px" }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}

export default WeeklyStreamChart;