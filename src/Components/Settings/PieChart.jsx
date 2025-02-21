import React, { useEffect } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts/core";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import { PieChart } from "echarts/charts";
import { LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout,
]);

const PieChartComponent = ({ graphData }) => {
  const customColors = [
    "#1f77b4",
    "#ff7f0e",
    "#2ca02c",
    "#d62728",
    "#9467bd",
    "#8c564b",
    "#e377c2",
    "#7f7f7f",
    "#bcbd22",
    "#17becf",
    "#aec7e8",
    "#ffbb78",
    "#98df8a",
    "#ff9896",
    "#c5b0d5",
    "#c49c94",
    "#f7b6d2",
    "#c7c7c7",
    "#dbdb8d",
    "#9edae5",
    "#393b79",
    "#5254a3",
    "#6b6ecf",
    "#9c9ede",
    "#637939",
    "#8ca252",
    "#b5cf6b",
    "#cedb9c",
    "#8c6d31",
    "#bd9e39",
    "#e7ba52",
    "#e7cb94",
    "#843c39",
    "#ad494a",
  ];

  // console.log("graphData : ", graphData);
  // useEffect(() => {
  //   // You can still use the echarts API here if needed
  // }, []);

const option = {
  title: {
    text: "",
    subtext: "",
    left: "",
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b}: {c} ({d}%)",
  },
  legend: {
    orient: "horizontal",
    bottom: 0,
    left: "left",
  },
  series: [
    {
      name: "Count",
      type: "pie",
      radius: "80%",
      data: graphData,
      itemStyle: {
        color: function (params) {
          return customColors[params.dataIndex];
        },
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: "rgba(0, 0, 0, 0.5)",
      },
      label: {
        show: true,
        position: "inside", // Set position to "inside" to display on the slices
        formatter: "{c}",
        fontWeight: "bold",
        fontSize: 20,
      },
    },
  ],
};



  return (
    <div style={{ marginTop: "-75px" }}>
      <ReactECharts
        echarts={echarts}
        option={option}
        style={{ height: "600px", width: "100%" }}
      />
    </div>
  );
};

export default PieChartComponent;
