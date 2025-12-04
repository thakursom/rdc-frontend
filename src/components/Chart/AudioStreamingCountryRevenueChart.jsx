import React, { useEffect } from "react";
import Highcharts from "highcharts";

function CountryRevenueChart({ revenueByCountry = {} }) {
  useEffect(() => {
    const containerId = "country-revenue-pie";

    // Convert revenueByCountry to Highcharts pie format
    const pieData = Object.entries(revenueByCountry).map(([name, value]) => ({
      name,
      y: Number(value)
    }));

    Highcharts.chart(containerId, {
      chart: {
        type: "pie",
        height: 350
      },

      title: false,
      subtitle: false,

      tooltip: {
        pointFormat: "<b>${point.y:.2f}</b> ({point.percentage:.1f}%) of total"
      },

      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          borderWidth: 1,
          borderColor: "#fff",
          dataLabels: {
            enabled: true,
            format: "{point.name}: {point.percentage:.1f}%",
            connectorColor: "silver",
            distance: 15,
            style: { fontSize: "0.9em" }
          },
          showInLegend: true // Show all slices in legend
        }
      },

      series: [
        {
          name: "Revenue",
          colorByPoint: true,
          data: pieData
        }
      ],

      legend: {
        enabled: true,
        layout: "vertical",
        align: "right",
        verticalAlign: "middle",
        itemStyle: { fontSize: "0.85em" }
      },

      credits: { enabled: false }
    });
  }, [revenueByCountry]);

  return <div id="country-revenue-pie" style={{ width: "100%", height: "350px" }} />;
}

export default CountryRevenueChart;
