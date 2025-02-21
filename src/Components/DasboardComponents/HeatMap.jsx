import createPlotlyComponent from "react-plotlyjs";
import Plotly from "plotly.js-cartesian-dist-min";
import { useState } from "react";
import { useEffect } from "react";
import { useQuery, useSubscription } from "urql";
import siloImage from "/src/assets/silo6.png";


const AllProbesvalues = `subscription($id:Int!) {
  allCurrentSensorValues(filter: {siloId: {equalTo: $id}}, orderBy: PROBE_ID_ASC) {
    nodes {
      nodeId
      paramid
      probeId
      sensorId
      siloId
      updatetime
      value
    }
  }
}`;

const PlotlyComponent1 = createPlotlyComponent(Plotly);
// const xValues = ["P1", "P2", "P3", "P4", "P5","P6","P7","P8","P9","P10","P11","P12","P13","P14","P15","P16","P17","P18","P19"];
//  const yValues = [ "S1","S2","S3","S4","S5","S6","S7","S8","S9","S10",];
// const zValues = [ [37, 3 + 12, 3 + 2, 3 + 3, 3,18,56,44,21,35+12,51,46,18,56,44,21,35+12,51,146],
//   [1, 1 + 15, 1 + 2, 5 + 3, 1,16,32,44,21,35,70,23,18,56,44,21,35+12,51,46],
//   [5, 5 + 1, 54 + 2, 5 + 15, 5,13,32,44,21,35+10,45,12,18,56,44,21,35+12,51,46],
//   [57, 7 + 1, 7 + 2, 7 + 3, 7,18,32,44,21,35+6,60,20,18,56,44,21,35+12,51,46],
//   [9, 92 + 1, 9 + 2, 7 + 31, 9,13,32,44,21,35,70,54,18,56,44,21,35+12,51,46],
//   [11, 11 + 1, 11 + 2, 11 + 3, 11,18,32,44,21,35+35,30,58,18,56,44,21,35+12,51,46],
//   [7, 7 + 1, 7 + 2, 18 + 3, 7,13,32,44,21,35,17,73,18,56,44,21,35+12,51,46],
//   [51, 5 + 1, 9 + 2, 5 + 3, 51,18,32,44,21,35+51,49,71,18,56,44,21,35+12,51,46],
//   [3, 3 + 1, 3 + 2, 9 + 3, 40,13,32,44,21,35+23,18,56,44,21,35+12,51,46,55],
//   [1, 1 + 11, 1 + 22, 1 + 3, 1,18,32,44,21,55,24,18,56,44,21,35+12,51,46],

// ];

const HeatMap = ({ id }) => {
  // const [siloDetails, setSiloDetails] = useState([]);
  const [allProbes, setAllProbes] = useState([]);
//   console.log("allProbes: ", allProbes);

  const [allProbesResult, allProbesResultAgain] = useSubscription({
    query: AllProbesvalues,
    variables: {
      id,
    },
  });

  const {
    data: dataQuery,
    fetching: fetchingQuery,
    error: errorQuery,
  } = allProbesResult;

  let sensorId = [];

  for (let node of allProbes) {
    for (let key in node) {
      if (key === "sensorId") sensorId.push(node[key]);
    }
  }
//   console.log("sensorId: ", sensorId);

  let uniquesensorId = [...new Set(sensorId)];
  uniquesensorId.sort(function (a, b) {
    return a - b;
  });
//   console.log("uniqueSilosId: ", uniquesensorId);

  let AllProbesvaluess = uniquesensorId.map((sensorId) => {
    // console.log("sensorId: ", sensorId);
    let datas = [];
    allProbes.forEach((data) => {
      if (data.sensorId === sensorId) {
        datas.push({ [`${data.probeId}`]: parseInt(data.value) });
      }
    });
    return { sensor: sensorId, datas: datas };
  });
//   console.log("AllProbesvalues:uniqueSilosId ", AllProbesvaluess);
  useEffect(() => {
    if (dataQuery) setAllProbes(dataQuery.allCurrentSensorValues.nodes);
    //  refresh();
  }, [dataQuery]);

  const yAxis = AllProbesvaluess.map((item, index) => `S${index + 1}`);
  const zAxis = AllProbesvaluess.map((item) => {
    return item.datas.map((probe, index) => {
      if (index + 1 < 10) return probe[`${index + 11}`];
      else return probe[`${index + 11}`];
    });
  });

  const xAxis = AllProbesvaluess.map((item) => {
    return item.datas.map((probe, index) => `P${index + 1}`);
  });
  xAxis.sort(function (a, b) {
    // ASC  -> a.length - b.length
    // DESC -> b.length - a.length
    return b.length - a.length;
  });
  const xAxisValues = xAxis.map((item) => item);
//   console.log("heatmap...", xAxisValues);
//   console.log("heatmap...zAxis", zAxis);

  // useEffect(() => {
  //   fetch(`http://localhost:3000/details/${id}`)
  //     .then((res) => res.json())
  //     .then(({ data }) => setSiloDetails(data));
  // }, []);
  let data = [
    {
      z: zAxis,
      x: xAxisValues[0],
      y: yAxis,
      type: "heatmap",
      hoverongaps: false,
      colorscale: [
        [0, "rgb(115, 207, 254)"],
        [0.2, "rgb(119, 206, 252)"],
        [0.4, "rgb(187, 187, 187)"],
        [0.6, "rgb(255, 190, 23)"],
        [0.8, "rgb(253, 52, 2)"],
        [1, "rgb(253, 52, 2)"],
      ],
      colorbar: {
        thickness: 10,
        tickmode: "array",
        tickvals: [0, 10, 20, 30, 40, 50, 60, 70, 80],
      },
      zauto: false,
      zmin: 10,
      zmax: 80,
      hovertemplate:
        "<b>Probe</b>: %{x}" +
        "<br><b>Sensor</b>: %{y}" +
        "<br><b>Temperature</b>: %{z}<br><extra></extra>",
    },
  ];

  var layout = {
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "#7a7a7a",
    height: 210,
    // width:260,
    autosize: true,
    margin: { l: 40, r: 0, b: 5, t: 38 },
    xaxis: {
      fixedrange: true,
      showticklabels: false,
      tickcolor: "rgba(0,0,0,0)",
      showgrid: false,
    },
    yaxis: {
      fixedrange: true,
      showticklabels: false,
      tickcolor: "rgba(0,0,0,0)",
      autorange: "reversed",
      showgrid: false,
    },

    // plot_bgcolor: "#eeeeee",
    annotations: [],
    images: [
      {
        source: siloImage,
        xref: "paper",
        yref: "paper",
        x: 0,
        y: 1.2,
        sizex: 1.03,
        sizey: 1.45,
      },
    ],
  };

  // for (var i = 0; i < yValues.length; i++) {
  //   for (var j = 0; j < xValues.length; j++) {
  //     var currentValue = zValues[i][j];
  //     if (currentValue != 0.0) {
  //       var textColor = "white";
  //     } else {
  //       var textColor = "black";
  //     }
  // var result = {
  //   xref: "x1",
  //   yref: "y1",
  //   x: xValues[j],
  //   y: yValues[i],
  //   text: zValues[i][j],
  //   font: {
  //     family: "Arial",
  //     size: 12,
  //     color: "rgb(50, 171, 96)",
  //   },
  //   showarrow: false,
  //   font: {
  //     color: textColor,
  //   },
  // };
  // layout.annotations.push(result);
  //   }
  // }

  const config = { displayModeBar: false };

  return (
    <div style={{ width: "260px" }}>
      <PlotlyComponent1 data={data} layout={layout} config={config} />
    </div>
  );
};

export default HeatMap;
