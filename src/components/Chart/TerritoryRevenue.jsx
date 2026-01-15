import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const TerritoryRevenue = ({ territoryData = [] }) => {
  const validData = territoryData
    .filter(item =>
      item.territory &&
      item.territory !== "-" &&
      item.territory !== "null" &&
      item.territory !== "Worldwide" &&
      item.territory !== "World" &&
      item.value > 0
    )
    .sort((a, b) => b.value - a.value)
    .slice(0, 15);

  const chartData = {
    labels: validData.map(item => {
      return item.territory;

    }),
    datasets: [
      {
        label: "Revenue",
        data: validData.map(item => item.value),
        backgroundColor: "#1FCCBE",
        borderRadius: 6,
        barPercentage: 0.6
      }
    ]
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,

    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: "#888",
          callback: (value) => `$${value.toLocaleString()}`
        },
        grid: { color: "#eee" }
      },
      y: {
        ticks: {
          color: "#444",
          padding: 10,
          font: {
            size: 13
          }
        },
        grid: { display: false }
      }
    },

    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        intersect: false,
        callbacks: {
          label: (context) => {
            return `$${context.parsed.x.toLocaleString()}`;
          }
        }
      }
    }
  };

  if (validData.length === 0) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#888",
          fontSize: "0.95rem"
        }}
      >
        No territory revenue data available
      </div>
    );
  }

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <Bar
        id="territoryRevenue"
        data={chartData}
        options={options}
      />
    </div>
  );
};

export default TerritoryRevenue;