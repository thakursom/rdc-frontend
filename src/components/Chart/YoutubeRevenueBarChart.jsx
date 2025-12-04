import React, { useEffect } from "react";
import Highcharts from "highcharts";


function RevenueBarChart2({ revenueByChannel = {} }) {
  useEffect(() => {
    const containerId = "channel-revenue-pie";

    // Convert revenueByChannel to pie data format
    const pieData = Object.entries(revenueByChannel).map(([name, value]) => ({
      name,
      y: value,
      drilldown: null // you can map a drilldown here later if needed
    }));

    Highcharts.chart(containerId, {
      chart: {
        type: "pie"
      },

      title: false,
      subtitle: false,

      accessibility: {
        announceNewData: { enabled: true },
        point: { valueSuffix: "%" }
      },

      tooltip: {
        pointFormat:
          "<b>${point.y:.2f}</b> ({point.percentage:.1f}%) of total<br/>"
      },

      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          borderWidth: 1,
          borderColor: "#fff",
          borderRadius: 5,
          dataLabels: [
            {
              enabled: true,
              distance: 10,
              format: "{point.name}"
            },
            {
              enabled: true,
              distance: "-40%",
              filter: {
                property: "percentage",
                operator: ">",
                value: 5
              },
              format: "{point.percentage:.1f}%",
              style: { fontSize: "0.8em", textOutline: "none" }
            }
          ]
        }
      },

      series: [
        {
          name: "Channels",
          colorByPoint: true,
          data: pieData
        }
      ],

      drilldown: {
        series: [] // you can add drilldown here later
      },

      credits: { enabled: false }
    });
  }, [revenueByChannel]);

  return (
    <div id="channel-revenue-pie" style={{ width: "100%", height: "330px" }} />
  );
}

export default RevenueBarChart2;
