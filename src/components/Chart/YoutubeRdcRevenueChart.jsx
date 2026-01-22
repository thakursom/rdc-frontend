import React, { useEffect, useMemo } from "react";
import Highcharts from "highcharts";

const COLORS = {
  border: "#20D4B0",
  background: "rgba(32, 212, 176, 0.25)"
};


function YoutubeRdcRevenueChart({ revenueByMonth = {} }) {
  const { labels, values } = useMemo(() => {
    if (!revenueByMonth || Object.keys(revenueByMonth).length === 0) {
      return { labels: [], values: [] };
    }

    const transformed = {};

    Object.entries(revenueByMonth).forEach(([key, value]) => {
      if (key.includes("-")) {
        const [year, month] = key.split("-");
        const date = new Date(year, Number(month) - 1, 1);

        const label = date.toLocaleString("default", {
          month: "short",
          year: "numeric"
        });

        transformed[label] = Number(value);
      } else {
        transformed[key] = Number(value);
      }
    });

    const sortedLabels = Object.keys(transformed).sort(
      (a, b) => new Date(a) - new Date(b)
    );

    return {
      labels: sortedLabels,
      values: sortedLabels.map(l => transformed[l] || 0)
    };
  }, [revenueByMonth]);

  useEffect(() => {
    if (labels.length === 0) return;

    Highcharts.setOptions({
      chart: {
        style: { fontFamily: "Segoe UI, system-ui, sans-serif" }
      },
      credits: { enabled: false },
      tooltip: {
        backgroundColor: "rgba(15,23,42,.8)",
        borderRadius: 10,
        style: { color: "#fff" }
      }
    });

    Highcharts.chart("monthlyArea", {
      chart: {
        type: "area",
        backgroundColor: "transparent",
        height: 420
      },

      title: { text: null },

      xAxis: {
        categories: labels,
        lineColor: "#E2E8F0",
        tickColor: "#E2E8F0",
        labels: { style: { color: "#6A7282" } }
      },

      yAxis: {
        title: {
          text: "Revenue",
          style: { color: "#6A7282" }
        },
        gridLineColor: "#E5E7EB",
        labels: { style: { color: "#6A7282" } }
      },

      plotOptions: {
        area: {
          lineWidth: 2,
          marker: {
            radius: 4,
            fillColor: COLORS.border
          },
          fillColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, COLORS.background],
              [1, "rgba(32, 212, 176, 0.05)"]
            ]
          }
        }
      },

      series: [
        {
          name: "Revenue",
          color: COLORS.border,
          data: values
        }
      ]

    });
  }, [labels, values]);

  if (labels.length === 0) {
    return (
      <div
        style={{
          height: "420px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#94A3B8"
        }}
      >
        No revenue data available
      </div>
    );
  }

  return (
    <div
      style={{
        background: "rgba(255,255,255,.7)",
        backdropFilter: "blur(14px)",
        borderRadius: "20px",
        padding: "25px",
        boxShadow: "0 25px 60px rgba(15,23,42,.12)"
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 12 }}>
        Revenue Trend (Month-wise)
      </div>

      <div id="monthlyArea" style={{ height: "420px" }} />
    </div>
  );
}

export default YoutubeRdcRevenueChart;
