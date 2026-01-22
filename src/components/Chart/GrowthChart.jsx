import { useRef, useEffect } from "react";
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

const GrowthChart = ({ revenueByMonthData = [] }) => {
  const canvasRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!revenueByMonthData?.length) return;

    const ctx = canvasRef.current.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgba(0, 180, 170, 0.3)");
    gradient.addColorStop(1, "rgba(0, 180, 170, 0)");

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const validData = revenueByMonthData
      .filter(item => item.month && item.month.trim() !== "")
      .sort((a, b) => a.month.localeCompare(b.month));

    const labels = validData.map(item => {
      const [year, month] = item.month.split("-");
      const date = new Date(Number(year), Number(month) - 1);
      return date.toLocaleString("default", { month: "short", year: "numeric" });
    });

    const values = validData.map(item => Number(item.revenue) || 0);

    chartInstance.current = new ChartJS(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Monthly Revenue",
            data: values,
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
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.parsed.y;
                return `${value.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: "#888",
              callback: (value) => {
                if (value >= 1000000) {
                  return `${(value / 1000000).toFixed(1)}M`;
                }
                if (value >= 1000) {
                  return `${(value / 1000).toFixed(0)}K`;
                }
                return `${value}`;
              },
            },
            grid: { color: "#eee" },
          },
          x: {
            ticks: { color: "#888" },
            grid: { display: false },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [revenueByMonthData]);

  if (!revenueByMonthData?.length) {
    return (
      <div
        style={{
          height: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#888",
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        No monthly revenue data available
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default GrowthChart;