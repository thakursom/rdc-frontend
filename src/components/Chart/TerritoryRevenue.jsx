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

const TerritoryRevenue = () => {
  const data = {
    labels: ["US", "CA", "JM", "TT", "PR", "DO", "BS", "GB"],
    datasets: [
      {
        label: "Plays",
        data: [4500, 1500, 900, 800, 1800, 1400, 700, 2000],
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
        ticks: { color: "#888" },
        grid: { color: "#eee" }
      },
      y: {
        ticks: { color: "#444", padding: 10 },
        grid: { display: false }
      }
    },

    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        intersect: false
      }
    }
  };

  return (
    <div >
      <Bar id="territoryRevenue" data={data} options={options} />
    </div>
  );
};

export default TerritoryRevenue;
