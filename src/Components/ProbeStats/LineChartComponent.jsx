import React, { useEffect } from "react";
import * as echarts from "echarts/core";
import { LineChart } from "echarts/charts";
import { TooltipComponent, GridComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import moment from "moment/moment";

// Register the required components
echarts.use([LineChart, TooltipComponent, GridComponent, CanvasRenderer]);

const LineChartComponent = ({ data }) => {
  useEffect(() => {
    // Initialize ECharts
    const chart = echarts.init(document.getElementById("line-chart"));

    // Extract x-axis (time) and y-axis (automatic) data
    const xAxisData = data.map((item) =>
      moment(item.time).format("YYYY-MM-DD HH:mm")
    );
    const yAxisData = data.map((item) => item.automatic);

    // Line chart options
    const option = {
      xAxis: {
        type: "category",
        data: xAxisData,
      },
      yAxis: {
        type: "category",
        data: ["OFF", "ON"], // Y-axis values
      },
      series: [
        {
          type: "line",
          data: yAxisData,
          showSymbol: false, // Disable data points
          lineStyle: {
            color: "green", // Line color
          },
        },
      ],
    };

    // Set the chart options
    chart.setOption(option);

    // Handle chart resize
    window.addEventListener("resize", () => {
      chart.resize();
    });

    // Clean up on component unmount
    return () => {
      chart.dispose();
      window.removeEventListener("resize", () => {
        chart.resize();
      });
    };
  }, [data]);

  return <div id="line-chart" style={{ width: "100%", height: "400px" }} />;
};

export default LineChartComponent;
