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

const RevenueStackedArea = () => {
  const data = {
    labels: ["Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"],
    datasets: [
      {
        label: "RDC Channel",
        data: [1.5,1.0,0.6,0.5,1.0,2.0,1.8,2.0,1.0,1.1,1.1,1.1],
        borderColor: "#1FCCBE",
        backgroundColor: "rgba(31, 204, 190, 0.25)",
        fill: true,
        tension: 0.3,
        borderWidth: 2
      },
      {
        label: "Premium Revenue",
        data: [0.7,0.65,0.62,0.6,0.7,0.75,0.7,0.68,0.58,0.55,0.55,0.52],
        borderColor: "#FFC94D",
        backgroundColor: "rgba(255, 201, 77, 0.25)",
        fill: true,
        tension: 0.3,
        borderWidth: 2
      },
      {
        label: "Art Track",
        data: [0.6,0.5,0.4,0.3,0.4,0.6,0.4,0.35,0.3,0.28,0.3,0.32],
        borderColor: "#FF8A65",
        backgroundColor: "rgba(255, 138, 101, 0.25)",
        fill: true,
        tension: 0.3,
        borderWidth: 2
      },
      {
        label: "UGC",
        data: [1.0,0.9,0.8,0.6,0.8,0.9,0.95,0.85,0.7,0.75,0.78,0.8],
        borderColor: "#4E7DFF",
        backgroundColor: "rgba(78, 125, 255, 0.25)",
        fill: true,
        tension: 0.3,
        borderWidth: 2
      },
      {
        label: "Partner Channel",
        data: [1.2,1.1,0.9,0.6,1.1,1.0,1.05,0.95,0.85,0.9,0.9,0.95],
        borderColor: "#A678FF",
        backgroundColor: "rgba(166, 120, 255, 0.25)",
        fill: true,
        tension: 0.3,
        borderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "#888" },
        grid: { color: "#eee" }
      },
      x: {
        ticks: { color: "#888" },
        grid: { display: false }
      }
    },

    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true
        }
      },
      tooltip: {
        mode: "index",
        intersect: false
      }
    },

    interaction: {
      mode: "index",
      intersect: false
    }
  };

  return (
    <div >
      <Line id="revenueStackedArea" data={data} options={options} />
    </div>
  );
};

export default RevenueStackedArea;
