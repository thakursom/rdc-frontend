import React, { useEffect } from "react";
import Highcharts from "highcharts";

function YoutubeRdcRevenueChart({ revenueByMonth = {} }) {

  useEffect(() => {
    const container = document.getElementById("yt-rdc-revenue-container");
    if (container) container.innerHTML = "";

    if (!revenueByMonth || Object.keys(revenueByMonth).length === 0) {
      return;
    }

    const transformedData = {};

    Object.keys(revenueByMonth).forEach(key => {
      if (key.includes('-')) {
        const [year, month] = key.split('-');
        const monthNumber = parseInt(month, 10) - 1;
        const date = new Date(year, monthNumber, 1);

        let monthLabel = date.toLocaleString("default", {
          month: "short",
          year: "numeric"
        });

        if (monthLabel.startsWith("Sep")) {
          monthLabel = monthLabel.replace("Sept", "Sep");
        }

        transformedData[monthLabel] = revenueByMonth[key];
      } else {
        transformedData[key] = revenueByMonth[key];
      }
    });

    const allMonthsFromData = Object.keys(transformedData);

    allMonthsFromData.sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA - dateB;
    });

    const barData = allMonthsFromData.map(m => transformedData[m] || 0);

    Highcharts.chart("yt-rdc-revenue-container", {
      chart: { zooming: { type: "xy" } },
      title: false,
      credits: { enabled: false },

      xAxis: {
        categories: allMonthsFromData,
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