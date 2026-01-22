import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

function RevenueByMonthChart() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy(); // Destroy old chart instance
    }

    const ctx = chartRef.current.getContext("2d");

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [
          "Sep", "Oct", "Nov", "Dec", "Jan", "Feb",
          "Mar", "Apr", "May", "Jun", "Jul", "Aug"
        ],
        datasets: [
          {
            label: "RDC Channel",
            data: [4, 3, 2.5, 2, 3.5, 5, 4.5, 5, 3, 3.1, 3.1, 3.1],
            backgroundColor: "#14CDBB",
          },
          {
            label: "Premium Revenue",
            data: [3, 2.7, 2.2, 1.6, 2.4, 2.2, 2.2, 2.2, 2, 2, 2, 2],
            backgroundColor: "#9550DF",
          },
          {
            label: "Art Track",
            data: [1.6, 1.4, 1.3, 1, 1.1, 1.2, 1.1, 1.1, 1, 1, 1, 1],
            backgroundColor: "#FFB748",
          },
          {
            label: "UGC",
            data: [2.2, 1.8, 1.6, 1.4, 1.6, 1.4, 1.6, 1.7, 1.2, 1.2, 1.2, 1.2],
            backgroundColor: "#656FF7",
          },
          {
            label: "Partner Channel",
            data: [1.2, 1, 0.8, 0.6, 0.7, 1, 0.7, 0.7, 0.6, 0.6, 0.6, 0.6],
            backgroundColor: "#F88C65",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "bottom",
          },
        },
        scales: {
          x: {
            stacked: true,
            grid: { display: false },
          },
          y: {
            stacked: true,
            beginAtZero: true,
            max: 12,
            title: {
              display: true,
              text: "Revenue (Millions)",
            },
            grid: { display: false },
          },
        },
      },
    });
  }, []);

  return (
    <div style={{ width: "100%", height: "450px" }}>
      <canvas id="revenueChart" ref={chartRef}></canvas>
    </div>
  );
}

export default RevenueByMonthChart;
