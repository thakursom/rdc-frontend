import React, { useEffect, useRef } from "react";
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

// Register components
Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const BAR_COLORS = [
  { border: "#20D4B0", background: "rgba(32, 212, 176, 0.25)" },
  { border: "#A284F5", background: "rgba(162, 132, 245, 0.25)" },
  { border: "#FF9B78", background: "rgba(255, 155, 120, 0.25)" },
  { border: "#FFD670", background: "rgba(255, 214, 112, 0.25)" },
  { border: "#64B5F6", background: "rgba(100, 181, 246, 0.25)" },
  { border: "#F06292", background: "rgba(240, 98, 146, 0.25)" },
  { border: "#7ED321", background: "rgba(126, 211, 33, 0.25)" },
];

function RevenueBarChart2({ revenueByChannel = {} }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const labels = Object.keys(revenueByChannel);
    const data = Object.values(revenueByChannel);

    chartInstanceRef.current = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: labels.map(
              (_, i) => BAR_COLORS[i % BAR_COLORS.length].background
            ),
            borderColor: labels.map(
              (_, i) => BAR_COLORS[i % BAR_COLORS.length].border
            ),
            borderWidth: 2,
            borderRadius: 10
          }
        ]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: "rgba(15,23,42,.9)",
            borderRadius: 10,
            style: { color: "#fff" },
          }
        },
        scales: {
          x: {
            grid: {
              color: "#E5E7EB"
            },
            ticks: {
              color: "#64748B"
            }
          },
          y: {
            grid: {
              display: false
            },
            ticks: {
              color: "#1E293B"
            }
          }
        }
      }
    });

    return () => chartInstanceRef.current?.destroy();
  }, [revenueByChannel]);

  return (
    <div
      style={{
        width: "100%",
        height: "330px",
        background: "#FFFFFF",
        padding: "20px",
        borderRadius: "14px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
      }}
    >
      <canvas ref={chartRef} />
    </div>
  );
}

export default RevenueBarChart2;
