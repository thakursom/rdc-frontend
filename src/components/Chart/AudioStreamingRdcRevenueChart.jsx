import React, { useEffect } from "react";
import Highcharts from "highcharts";

function YoutubeRdcRevenueChart({ revenueByMonth = {} }) {
  useEffect(() => {
    // Clear the container first to prevent duplicate charts
    const container = document.getElementById("yt-rdc-revenue-container");
    if (container) container.innerHTML = "";

    // More strict check - ensure revenueByMonth is not empty object
    if (!revenueByMonth || Object.keys(revenueByMonth).length === 0) {
      return; // Don't render chart if no data
    }

    const years = Object.keys(revenueByMonth).map(key =>
      Number(key.split(" ")[1])
    );

    const selectedYear = Math.max(...years);

    const allMonths = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(selectedYear, i, 1);
      return date.toLocaleString("default", {
        month: "short",
        year: "numeric"
      });
    });

    const barData = allMonths.map(m => revenueByMonth[m] || 0);

    Highcharts.chart("yt-rdc-revenue-container", {
      chart: { zooming: { type: "xy" } },
      title: false,
      credits: { enabled: false },

      xAxis: {
        categories: allMonths,
        crosshair: true
      },

      yAxis: {
        title: { text: "Net Revenue" }
      },

      series: [
        {
          name: "Net Revenue",
          type: "column",
          data: barData
        },
        {
          name: "Trend",
          type: "spline",
          data: barData
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