import React, { useEffect } from "react";
import Highcharts from "highcharts";

const COLORS = [
  { border: "#20D4B0", background: "rgba(32, 212, 176, 0.25)" },
  { border: "#A284F5", background: "rgba(162, 132, 245, 0.25)" },
  { border: "#FF9B78", background: "rgba(255, 155, 120, 0.25)" },
  { border: "#FFD670", background: "rgba(255, 214, 112, 0.25)" },
  { border: "#64B5F6", background: "rgba(100, 181, 246, 0.25)" },
  { border: "#F06292", background: "rgba(240, 98, 146, 0.25)" },
  { border: "#7ED321", background: "rgba(126, 211, 33, 0.25)" }
];

function CountryRevenueChart({ revenueByCountry = {} }) {
  useEffect(() => {
    const containerId = "country-revenue-pie";

    const pieData = Object.entries(revenueByCountry).map(
      ([name, value], index) => {
        const color = COLORS[index % COLORS.length];
        return {
          name,
          y: Number(value),
          color: color.background,
          borderColor: color.border,
          borderWidth: 2
        };
      }
    );

    Highcharts.chart(containerId, {
      chart: {
        type: "pie",
        height: 350
      },

      title: false,
      subtitle: false,

      tooltip: {
        backgroundColor: "rgba(15,23,42,.8)",
        borderRadius: 10,
        style: { color: "#fff" },
        pointFormat:
          "<b>{point.y:.2f}</b> ({point.percentage:.1f}%) of total"
      },

      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "{point.name}: {point.percentage:.1f}%",
            connectorColor: "silver",
            style: {
              color: "#6A7282",
            }
          },
          showInLegend: true
        }
      },

      series: [
        {
          name: "Revenue",
          colorByPoint: false,
          data: pieData
        }
      ],

      legend: {
        enabled: true,
        layout: "vertical",
        align: "right",
        verticalAlign: "middle",
        itemStyle: {
          color: "#6A7282"
        },
        itemHoverStyle: {
          color: "#6A7282"
        }
      },

      credits: { enabled: false }
    });
  }, [revenueByCountry]);

  return (
    <div
      id="country-revenue-pie"
      style={{ width: "100%", height: "350px" }}
    />
  );
}

export default CountryRevenueChart;
