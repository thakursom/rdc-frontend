import React from "react";
import { PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const PlateFormShare = () => {
  const data = {
    labels: ["RDC", "Purple", "Orange", "Yellow"],
    datasets: [
      {
        data: [20, 30, 40, 40],
        backgroundColor: [
          "rgba(32, 212, 176, 0.7)",   // RDC
          "rgba(162, 132, 245, 0.7)",  // Purple
          "rgba(255, 155, 120, 0.7)",  // Orange
          "rgba(255, 214, 112, 0.7)"   // Yellow
        ],
        borderWidth: 0
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    scales: {
      r: {
        ticks: {
          display: true,
          backdropColor: "transparent",
          color: "#aaa",
          stepSize: 10
        },
        grid: {
          color: "#e6e6e6"
        },
        angleLines: {
          color: "#e6e6e6"
        },
        suggestedMin: 0,
        suggestedMax: 40
      }
    },

    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          padding: 20,
          boxWidth: 20
        }
      }
    }
  };

  return (
    <div >
      <PolarArea id="plateFormShare" data={data} options={options} />
    </div>
  );
};

export default PlateFormShare;
