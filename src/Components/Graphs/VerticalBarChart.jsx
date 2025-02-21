import { Container } from "@mui/material";
import React from "react";
import Plot from "react-plotly.js";
import {useMediaQuery} from "@mui/material";

const VerticalBarChart = ({ siloDetails }) => {
  const matches = useMediaQuery("(max-width:600px)");
  const desktopWidth = useMediaQuery("(max-width:1300px)");

  const xAxis = siloDetails.map((item) => `${item.height}M`);
  const yAxis = siloDetails.map((item) => {
    return item.datas.map((probe, index) => {
      if (index + 1 < 10) return probe[`${index + 11}`];
      else return probe[`${index + 11}`];
    });
  });
  // console.log("yAxis: ", yAxis);

  //

  let meter = 0;
  // let xAxisLabel = ["Probe 1", "Probe 2", "Probe 3", "Probe 4","Probe 5","Probe 6","Probe 7", "Probe 8", "Probe 9", "Probe 10"];
  let xAxisLabel = [
    "P1",
    "P2",
    "P3",
    "P4",
    "P5",
    "P6",
    "P7",
    "P8",
    "P9",
    "P10",
    "P11",
    "P12",
    "P13",
    "P14",
    "P15",
    "P16",
    "P17",
    "P18",
    "P19",
  ];
  let xAxisLabelRes = [
    "P1",
    "P2",
    "P3",
    "P4",
    "P5",
    "P6",
    "P7",
    "P8",
    "P9",
    "P10",
    "P11",
    "P12",
    "P13",
    "P14",
    "P15",
    "P16",
    "P17",
    "P18",
    "P19",
  ];
  // const test = xAxisLabel.map((item, index)=> {index});

  const graphData = yAxis.map((item) => {
    meter += 1;

    return {
      type: "bar",
      x: matches ? xAxisLabelRes : xAxisLabel,
      y: [...item],
      name: `S${meter}`,
      // hovertemplate:  '<b>Probe</b>: %{x}' +
      // '<br><b>Temperature</b>: %{y}'+
      // '<br><b>Sensor</b>:%{z}<extra></extra>',
    };
  });

  const xAxis2 = siloDetails.map((item) => `${item.height}M`);

  const yAxis2 = siloDetails.map((item) => {
    return item.datas.map((probe, index) => probe[`P${index + 1}`]);
  });

  let prob = 0;
  // let xAxisLabel2 = ["2M", "4M", "6M", "8M", "10M", "12M", "14M",];
  var res = [];

  yAxis2.forEach(function (ele) {
    ele.forEach(function (v, i) {
      res[i] = res[i] || []; // define inner array if not defined
      res[i].push(v); // push value to array
    });
  });

  // const xAxis2 = res.map((item) => `${item.height}M`);

  const graphData2 = res.map((item) => {
    prob++;
    return {
      type: "bar",
      x: xAxis2,
      y: [...item],
      name: `Probe ${prob}`,
    };
  });

  return (
    <div>
      <Container
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Plot
          data={graphData}
          layout={{
            title: "Vertical Temperature Graph",
            // width: matches ? 360 : 1980,
            width: matches ? 360 : desktopWidth ? 1200 : 1850,
            height: matches ? 600 : 500,
            margin: { l: 30, r: 30, b: 50, t: 80 },
            xaxis: { fixedrange: true },
            yaxis: { fixedrange: true },
            plot_bgcolor: "#4B4A54",
            paper_bgcolor: "#4B4A54",
            font: { color: "white" },
          }}
          config={{ displayModeBar: false }}
        />
      </Container>
    </div>
  );
};

export default VerticalBarChart;
