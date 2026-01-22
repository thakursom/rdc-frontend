import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
  Legend
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

const COLORS = [
  { border: "#20D4B0", background: "rgba(32, 212, 176, 0.25)" },
  { border: "#A284F5", background: "rgba(162, 132, 245, 0.25)" },
  { border: "#FF9B78", background: "rgba(255, 155, 120, 0.25)" },
  { border: "#FFD670", background: "rgba(255, 214, 112, 0.25)" },
  { border: "#64B5F6", background: "rgba(100, 181, 246, 0.25)" },
  { border: "#F06292", background: "rgba(240, 98, 146, 0.25)" },
  { border: "#7ED321", background: "rgba(126, 211, 33, 0.25)" },
];

const RevenueStackedArea = ({ revenueData = [] }) => {

  const labels = revenueData
    .map(item => item._id)
    .filter(id => id !== "")
    .sort();

  const allPlatforms = new Set();
  revenueData.forEach(item => {
    item.platforms.forEach(p => allPlatforms.add(p.name));
  });
  const platformNames = Array.from(allPlatforms);


  const datasets = platformNames.map((platformName, index) => {
    const colorIndex = index % COLORS.length;
    const color = COLORS[colorIndex] || COLORS[index % COLORS.length];

    const data = labels.map(month => {
      const monthEntry = revenueData.find(item => item._id === month);
      if (!monthEntry) return 0;

      const platformEntry = monthEntry.platforms.find(p => p.name === platformName);
      return platformEntry ? Number(platformEntry.value) : 0;
    });

    return {
      label: platformName,
      data: data,
      borderColor: color.border,
      backgroundColor: color.background,
      fill: true,
      tension: 0.3,
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 5,
    };
  });

  const data = {
    labels,
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "#888" },
        grid: { color: "#eee" },
        title: {
          display: false,
        },
      },
      x: {
        ticks: { color: "#888" },
        grid: { display: false },
      },
    },

    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          boxWidth: 12,
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },

    interaction: {
      mode: "index",
      intersect: false,
    },
  };

  if (labels.length === 0) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#aaa",
        }}
      >
        No revenue data available
      </div>
    );
  }

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <Line id="revenueStackedArea" data={data} options={options} />
    </div>
  );
};

export default RevenueStackedArea;