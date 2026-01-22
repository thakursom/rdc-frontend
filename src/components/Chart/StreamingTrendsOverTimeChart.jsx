import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";

const colorMap = {
  Amazon: "#FF8A65",
  "Apple Music": "#9550DF",
  Facebook: "#FFB748",
  "Jio Saavn": "#4E7DFF",
  Spotify: "#1DB954",
  TikTok: "#14CDBB"
};


function StreamingTrendsOverTimeChart({ trendsData = {} }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [selectedType, setSelectedType] = useState("");
  const { months = [], monthlyData = [], distributors = [] } = trendsData;

  useEffect(() => {
    if (distributors?.length && !selectedType) {
      const allTab = distributors.find(
        d => d.toLowerCase() === "all"
      );
      if (allTab) setSelectedType(allTab);
    }
  }, [distributors, selectedType]);


  useEffect(() => {
    if (chartInstance.current) chartInstance.current.destroy();
    const ctx = chartRef.current.getContext("2d");

    let datasets = [];

    const platformsToShow = selectedType.toLowerCase() === "all"
      ? distributors.filter(d => d.toLowerCase() !== "all")
      : [selectedType];

    datasets = platformsToShow.map(platform => {
      const key = platform;
      const color = colorMap[key] || "#656FF7";

      const data = monthlyData.map(item => {
        const matchedKey = Object.keys(item).find(k => k.toLowerCase() === key.toLowerCase());
        return matchedKey ? Number(item[matchedKey] || 0) : 0;
      });

      return {
        label: platform,
        data,
        borderColor: color,
        backgroundColor: `${color}40`,
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
      };
    });

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: months,
        datasets,
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
        plugins: {
          legend: {
            display: true,
            // position: "bottom"
          }
        },
        interaction: {
          mode: "index",
          intersect: false
        }
      }
    });

    return () => chartInstance.current?.destroy();
  }, [monthlyData, selectedType, distributors]);



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