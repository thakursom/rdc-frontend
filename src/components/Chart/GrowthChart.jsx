import React, { useRef, useEffect } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
  Legend
);

const GrowthChart = () => {
  const canvasRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgba(0, 180, 170, 0.3)");
    gradient.addColorStop(1, "rgba(0, 180, 170, 0)");

    // Destroy previous chart instance if exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new ChartJS(ctx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Growth",
            data: [700, 1000, 1300, 2000, 3000, 3500],
            borderColor: "#00a8a8",
            borderWidth: 3,
            tension: 0.35,
            fill: true,
            backgroundColor: gradient,
            pointRadius: 5,
            pointBackgroundColor: "#00a8a8",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: "#888" },
            grid: { color: "#eee" },
          },
          x: {
            ticks: { color: "#888" },
            grid: { display: false },
          },
        },
      },
    });

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, []);

  return (
    <div>
      <canvas id="growthChart" ref={canvasRef}></canvas>
    </div>
  );
};

export default GrowthChart;
