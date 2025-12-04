import React, { useEffect } from "react";
import Highcharts from "highcharts";

function YoutubeRdcRevenueChart({ revenueByMonth = {} }) {
  useEffect(() => {
    const currentYear = new Date().getFullYear();

    // Generate labels like: Jan 2025, Feb 2025, ... Dec 2025
    const allMonths = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(currentYear, i, 1);
      return date.toLocaleString("default", { month: "short", year: "numeric" });
    });

    // Map revenue values, fallback to 0
    const barData = allMonths.map((m) => revenueByMonth[m] ?? 0);

    Highcharts.chart("yt-rdc-revenue-container", {
      chart: {
        zooming: { type: "xy" }
      },

      title: false,

      credits: { enabled: false },

      xAxis: [
        {
          categories: allMonths,
          crosshair: true
        }
      ],

      yAxis: [
        {
          title: { text: "Net Revenue" },
          labels: {
            formatter: function () {
              if (this.value >= 1_000_000) return this.value / 1_000_000 + "M";
              if (this.value >= 1_000) return this.value / 1_000 + "k";
              return this.value;
            }
          }
        }
      ],

      tooltip: {
        shared: true,
        formatter() {
          let s = `<b>${this.x}</b><br/>`;
          this.points.forEach((point) => {
            s += `${point.series.name}: $${point.y.toLocaleString()}<br/>`;
          });
          return s;
        }
      },

      legend: {
        align: "left",
        verticalAlign: "top"
      },

      series: [
        {
          name: "Net Revenue",
          type: "column",
          data: barData,
          color: "#9550DF",
          borderRadius: 5
        },
        {
          name: "Trend",
          type: "spline",
          data: barData,
          color: "#14CDBB",
          lineWidth: 3
        }
      ]
    });
  }, [revenueByMonth]);

  return (
    <div
      id="yt-rdc-revenue-container"
      style={{ width: "100%", height: "380px" }}
    ></div>
  );
}

export default YoutubeRdcRevenueChart;
