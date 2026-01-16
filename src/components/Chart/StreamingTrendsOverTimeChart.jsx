import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";

function StreamingTrendsOverTimeChart({ trendsData = {} }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [selectedType, setSelectedType] = useState("all");

  const { months = [], monthlyData = [], distributors = [] } = trendsData;

  useEffect(() => {
    if (chartInstance.current) chartInstance.current.destroy();

    const ctx = chartRef.current.getContext("2d");

    const selectedKey = selectedType.toLowerCase();

    const selectedData = monthlyData.map(item => {
      if (selectedKey === "all") return item.all || 0;
      const matchingKey = Object.keys(item).find(
        key => key.toLowerCase() === selectedKey
      );
      return matchingKey ? item[matchingKey] : 0;
    });

    const colorMap = {
      all: "#656FF7",
      amazon: "#FF8A65",
      "apple music": "#9550DF",
      facebook: "#FFB748",
      "jio saavn": "#4E7DFF",
      spotify: "#1DB954",
      tiktok: "#14CDBB"
    };

    const selectedColor = colorMap[selectedType.toLowerCase()] || "#656FF7";

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: months,
        datasets: [
          {
            label: "Streams (Millions)",
            data: selectedData,
            borderColor: selectedColor,
            backgroundColor: `${selectedColor}50`,
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointBackgroundColor: selectedColor,
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
  }, [monthlyData, selectedType]);

  return (
    <div>
      <div style={{ width: "100%", height: "450px" }}>
        <canvas id="musicChart" ref={chartRef}></canvas>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "20px 0 0px 0",
            gap: "10px",
            marginBottom: "15px"
          }}
        >
          {distributors.map((type) => (
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
      </div>
    </div>
  );
}

export default StreamingTrendsOverTimeChart;