import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

function MusicStreamsChart({ musicData = [] }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!musicData || musicData.length === 0) return;

    const yearlyData = musicData
      .filter(item => item.year && item.year.trim() !== "")
      .sort((a, b) => a.year.localeCompare(b.year));

    const mainLabels = yearlyData.map(item => item.year);
    const mainData = yearlyData.map(item => item.streams || 0);

    const distributorLabels = ["YouTube", "Spotify", "Apple Music", "JioSaavn", "Gaana"];

    const totalStreams = mainData.reduce((sum, v) => sum + v, 0);
    const distributorData = distributorLabels.map(() => {
      return Math.round((Math.random() * 0.4 + 0.1) * (totalStreams / distributorLabels.length));
    });

    let expanded = false;
    let lastState = null;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: mainLabels,
        datasets: [
          {
            data: mainData,
            backgroundColor: "#2ED3C6",
            borderRadius: 7,
            barPercentage: 0.55,
            categoryPercentage: 0.6,
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
                return `${context.parsed.y.toLocaleString()} streams`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              font: {
                family: "Inter, Arial, sans-serif",
                size: 16,
              },
            },
          },
          y: {
            grid: { display: false },
            beginAtZero: true,
            ticks: {
              stepSize: Math.ceil(Math.max(...mainData) / 5 / 1000) * 1000,
              callback: (value) => value.toLocaleString(),
              font: {
                family: "Inter, Arial, sans-serif",
                size: 14,
              },
            },
          },
        },

        onClick: (evt, elements) => {
          const chart = chartInstance.current;

          if (!expanded && elements.length > 0) {
            lastState = {
              labels: [...chart.data.labels],
              data: [...chart.data.datasets[0].data],
            };

            chart.data.labels = distributorLabels;
            chart.data.datasets[0].data = distributorData;
            chart.update();
            expanded = true;
          } else if (expanded) {
            chart.data.labels = lastState.labels;
            chart.data.datasets[0].data = lastState.data;
            chart.update();
            expanded = false;
          }
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [musicData]);

  if (!musicData || musicData.length === 0) {
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
        No music streams data available
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}

export default MusicStreamsChart;