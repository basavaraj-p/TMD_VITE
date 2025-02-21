import { Container, useMediaQuery } from "@mui/material";
import React from "react";
import Plot from "react-plotly.js";

const HorizontalBarChart = ({ siloDetails }) => {
    const matches = useMediaQuery("(max-width:600px)");
    const desktopWidth = useMediaQuery("(max-width:1300px)");

  // const xAxis2 = siloDetails.map((item) => `${item.height}M`);
  const xAxis2 = siloDetails.map((item, index) => `S${index + 1}`);
  //
  const yAxis2 = siloDetails.map((item) => {
    return item.datas.map((probe, index) => {
      if (index + 1 < 10) return probe[`${index + 11}`];
      else return probe[`${index + 11}`];
    });
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
  //
  // const xAxis2 = res.map((item) => `${item.height}M`);

  const graphData2 = res.map((item) => {
    //
    prob++;
    return {
      type: "bar",
      x: xAxis2,
      y: [...item],
      name: `P ${prob}`,
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
          data={graphData2}
          layout={{
            title: "Horizontal Temperature Graph",
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

export default HorizontalBarChart;
