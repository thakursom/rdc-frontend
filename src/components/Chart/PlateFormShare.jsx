import { PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const PlateFormShare = ({ data = [] }) => {
  const COLORS = [
    "rgba(32, 212, 176, 0.7)",
    "rgba(162, 132, 245, 0.7)",
    "rgba(255, 155, 120, 0.7)",
    "rgba(255, 214, 112, 0.7)",
    "rgba(100, 181, 246, 0.7)",
    "rgba(240, 98, 146, 0.7)",
    "rgba(126, 211, 33, 0.7)",
  ];

  const chartData = {
    labels: data.map(item => item.platform || "Unknown"),
    datasets: [{
      data: data.map(item => Number(item.value) || 0),
      backgroundColor: COLORS.slice(0, data.length),
      borderWidth: 0
    }]
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
          stepSize: 1000000,
          callback: (value) => `$${(value / 1000000).toFixed(1)}M`
        },
        grid: {
          color: "#e6e6e6"
        },
        angleLines: {
          color: "#e6e6e6"
        },
        suggestedMin: 0,
      }
    },

    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          padding: 20,
          boxWidth: 20,
          color: "#333"
        }
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => {
            const value = context.raw;
            return `${context.label}: $${value.toLocaleString()}`;
          }
        }
      }
    }
  };

  if (!data || data.length === 0) {
    return (
      <div style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#aaa",
        fontSize: "1rem"
      }}>
        No platform share data available
      </div>
    );
  }

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <PolarArea
        id="plateFormShare"
        data={chartData}
        options={options}
      />
    </div>
  );
};

export default PlateFormShare;