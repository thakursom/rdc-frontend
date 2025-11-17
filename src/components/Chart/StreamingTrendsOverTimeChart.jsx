import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";

function StreamingTrendsOverTimeChart() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [selectedType, setSelectedType] = useState("all");

  const datasets = {
    all:  { color: "#656FF7", data: [1.5, 2, 2.5, 5.2, 3.8, 3.2, 3.9, 4.3] },
    rdc:  { color: "#14CDBB", data: [1.2, 1.8, 2.3, 4.8, 3.9, 3.4, 3.6, 4.0] },
    tunec:{ color: "#9550DF", data: [0.8, 1.3, 1.9, 4.5, 3.5, 3.1, 3.8, 4.1] },
    ditto:{ color: "#F88C65", data: [1.0, 1.5, 2.0, 3.7, 3.1, 2.8, 3.3, 3.9] },
    amus: { color: "#FFB748", data: [0.9, 1.6, 2.4, 4.0, 3.6, 3.2, 3.7, 4.2] }
  };

  useEffect(() => {
    if (chartInstance.current) chartInstance.current.destroy();

    const ctx = chartRef.current.getContext("2d");
    const selected = datasets[selectedType];

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
        datasets: [
          {
            label: "Streams (Millions)",
            data: selected.data,
            borderColor: selected.color,
            backgroundColor: `${selected.color}50`,
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointBackgroundColor: selected.color,
            pointBorderColor: "#fff",
            pointRadius: 5,
            pointHoverRadius: 7
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Streams (Millions)",
              color: "#6A7282"
            },
            grid: { display: false }
          },
          x: { grid: { display: false } }
        },
        plugins: { legend: { display: false } }
      }
    });

    return () => chartInstance.current?.destroy();
  }, [selectedType]);

  return (
    <div>
      {/* BUTTON GROUP */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        {["all", "rdc", "tunec", "ditto", "amus"].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={selectedType === type ? "active" : ""}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              cursor: "pointer",
              background: selectedType === type ? "#14CDBB" : "#FFF",
              color: selectedType === type ? "#FFF" : "#333",
              fontWeight: 600
            }}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>

      {/* CHART */}
      <div style={{ width: "100%", height: "350px" }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}

export default StreamingTrendsOverTimeChart;
