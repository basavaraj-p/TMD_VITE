import React, { useState, useEffect } from "react";
import createPlotlyComponent from "react-plotlyjs";
import Plotly from "plotly.js-gl3d-dist-min";

const PlotlyComponent1 = createPlotlyComponent(Plotly);

const objectConvertor = (objectOfArrays) => {
  let mainArray = [];
  for (let key in objectOfArrays) {
    mainArray.push(objectOfArrays[key]);
  }
  return mainArray;
};

function createNestedArray(originalArray, chunkSize) {
  const nestedArray = [];
  for (let i = 0; i < originalArray.length; i += chunkSize) {
    const chunk = originalArray.slice(i, i + chunkSize);
    nestedArray.push(chunk);
  }
  return nestedArray;
}

// const originalArray = surfaceData.Yc; // replace with your original array
const chunkSize = 50;
// const nestedArray = createNestedArray(originalArray, chunkSize);
// console.log("Yc : ",nestedArray);

const getSolid = (XYZData, config) => {
  // let radius = config ? Number(config[0].radius) : 0
  // let height_cylinder = Number(height_cylinder);
  // let height_cone = Number(height_cone);
  // let min_z = Number(min_z);
//   let radius = 4.20;
//   let height_cylinder = 10.296;
//   let height_cone = 4.035;
//   let min_z = 1.2;
  let radius = 13.75;
  let height_cylinder = 13.73;
  let height_cone = 4.0;
  let min_z = 1.2;
  //   let min_z = -0.2;
  //   let length_array = XYZData[0].points[18].x.length;
  //   let x_list = [];
  //   let y_list = [];
  //   let z_list = [];
  //   for (let i = 0; i < length_array; i++) {
  //     if (
  //       Math.sqrt(
  //         XYZData[0].points[18].x[i] ** 2 + XYZData[0].points[18].y[i] ** 2
  //       ) >
  //       radius - radius
  //     ) {
  //       x_list.push(XYZData[0].points[18].x[i]);
  //       y_list.push(XYZData[0].points[18].y[i]);
  //       z_list.push(XYZData[0].points[18].z[i]);
  //     }
  //   }
  let flag = true;
  let new_x_list = [];
  let new_y_list = [];
  let new_z_list = [];
  let x_list = [];
  let y_list = [];
  let z_list = [];
  let scaled_x = [];
  let scaled_y = [];
  let a = 1;

  if (min_z < 0) {
    for (let i = 0.1; flag; i = i + 0.5) {
      let new_z = XYZData.points[0].z.map((item) => {
        if (item + i > 0) {
          scaled_x = XYZData.points[0].x.map((x_val) => x_val * a);
          scaled_y = XYZData.points[0].y.map((y_val) => y_val * a);
          flag = false;
        }
        return item + i;
      });

      new_x_list = new_x_list.concat(
        XYZData.points[0].x.map((x_val) => x_val * a)
      );
      new_y_list = new_y_list.concat(
        XYZData.points[0].y.map((y_val) => y_val * a)
      );
      new_z_list = new_z_list.concat(new_z);
      a = a + 0.168;
    }

    for (let i = 0.1; flag; i = i + 0.5) {
      let new_z = XYZData.points[0].z.map((item) => {
        if (item + i > height_cylinder + height_cone) {
          flag = false;
        }
        return item + i;
      });

      new_x_list = new_x_list.concat(scaled_x);
      new_y_list = new_y_list.concat(scaled_y);
      new_z_list = new_z_list.concat(new_z);
      a = a + 0.168;
    }

    let length_array = new_x_list.length;

    for (let i = 0; i < length_array; i++) {
      if (
        Math.sqrt(new_x_list[i] ** 2 + new_y_list[i] ** 2) <
        (height_cylinder + height_cone - new_z_list[i]) *
          ((radius - 0.5) / height_cone)
      ) {
        x_list.push(new_x_list[i]);
        y_list.push(new_y_list[i]);
        z_list.push(new_z_list[i]);
      }
    }
  } else {
    for (let i = 0.1; flag; i = i + 0.5) {
      let new_z = XYZData.points[0].z.map((item) => {
        if (item + i > height_cylinder + 10) {
          flag = false;
        }
        return item + i;
      });

      new_z = new_z.map((item) => {
        if (item < height_cylinder) {
          return item;
        }
      });

      new_x_list = new_x_list.concat(XYZData.points[0].x);
      new_y_list = new_y_list.concat(XYZData.points[0].y);
      new_z_list = new_z_list.concat(new_z);
    }
    let length_array = new_x_list.length;

    for (let i = 0; i < length_array; i++) {
      if (new_z_list[i] > height_cylinder) {
        if (
          Math.sqrt(new_x_list[i] ** 2 + new_y_list[i] ** 2) <
          (height_cylinder + height_cone - new_z_list[i]) *
            ((radius - 0.5) / height_cone)
        ) {
          x_list.push(new_x_list[i]);
          y_list.push(new_y_list[i]);
          z_list.push(new_z_list[i]);
        }
      } else {
        x_list.push(new_x_list[i]);
        y_list.push(new_y_list[i]);
        z_list.push(new_z_list[i]);
      }
    }
  }

  return [x_list, y_list, z_list];
};

// const getCylinder = (start, height, radius) => {
//   let x_list = [];
//   let y_list = [];
//   let z_list = [];
//   let y = 0;
//   for (let z = 0 + start; z < height; z = z + 0.1) {
//     for (let x = -radius; x <= radius; x = x + 0.1) {
//       y = Math.sqrt(radius * radius - x * x);
//       x_list.push(x);
//       y_list.push(y);
//       z_list.push(z);
//     }
//   }
//   for (let z = 0 + start; z < height; z = z + 0.1) {
//     for (let x = -radius; x <= radius; x = x + 0.1) {
//       y = Math.sqrt(radius * radius - x * x);
//       x_list.push(x);
//       y_list.push(-y);
//       z_list.push(z);
//     }
//   }
//   return [x_list, y_list, z_list];
// };

const SiloVisualize = (props) => {
  let pointCloudDatas = props.siloContents;
  // console.log("pointCloudDatas : ",pointCloudDatas)
  // console.log("x : ",pointCloudDatas.points)
  let data = [];
  let ID = 0;
  let array = []

  let pointCloud = getSolid(pointCloudDatas, props.config);
  // console.log("pointCloud : ",pointCloud);

  // let pointCloud = props.scatterPoints;

  //let pointCloud1 = getCylinder(3, 13.5, 13.5);
  //   console.log("pointCloud1 : ", pointCloud1);

  let surfaceData = props.surfaceData;
  // console.log("config : ", props.config);

  if (pointCloudDatas) {
    data = [
      //comment this piece of code to disable the mesh that represents the level of the silo
      {
        type: "mesh3d",
        x: pointCloudDatas.points[0].x,
        y: pointCloudDatas.points[0].y,
        z: pointCloudDatas.points[0].z,
        // mode: "markers",
        // marker: {
        //   size: 6,
        //   color: "#FFBA52FF",
        //   showlegend: false,
        //   legendgroup: "Volume Filled",
        // },
        // color: "red",
        intensity: pointCloudDatas.points[0].z,
        colorscale: [
          [0, "rgb(255, 0, 0)"],
          [0.5, "rgb(255,255,0)"],
          [1, "rgb(0, 255, 0)"],
        ],
        showscale: false,
        showlegend: false,
        legendgroup: "Volume Filled",
        name: "Volume Filled",
      },
      //comment this piece of code to disable the contents inside the silo
      {
        type: "scatter3d",
        x: pointCloud[0],
        y: pointCloud[1],
        z: pointCloud[2],
        // x: pointCloud[0],
        // y: pointCloud[1],
        // z: pointCloud[2],
        mode: "markers",
        marker: {
          size: 1,
          color: "rgb(0, 255, 0)",
          showlegend: false,
          legendgroup: "Volume Filled",
        },

        showlegend: false,
        legendgroup: "Volume Filled",
        name: "Volume Filled",
      },
      // comment this piece of code to disable the cone at the bottom of the silo
      {
        type: "surface",
        x: createNestedArray(surfaceData.CPx, chunkSize),
        y: createNestedArray(surfaceData.CPy, chunkSize),
        z: createNestedArray(surfaceData.CPz, chunkSize),
        colorscale: [
          [0, "rgb(75,75,75)"],
          //   [0.5, "rgb(102, 43, 43)"],
          [1, "rgb(75,75,75)"],
        ],
        // opacity: 0.5,
        showscale: false,
        showlegend: false,
        legendgroup: "Silo",
        name: "Silo",
      },
      // comment this piece of code to disable the cone at the top of the silo
      {
        type: "surface",
        x: createNestedArray(surfaceData.Xco2, chunkSize),
        y: createNestedArray(surfaceData.Yco2, chunkSize),
        z: createNestedArray(surfaceData.Zco2, chunkSize),
        colorscale: [
          [0, "rgb(75,75,75)"],
          [1, "rgb(75,75,75)"],
        ],
        opacity: 0.5,
        showscale: false,
        showlegend: false,
        legendgroup: "Silo",
        name: "Silo",
      },
      // comment this piece of code to disable the 2nd part of the cylinder surface
      {
        type: "surface",
        x: createNestedArray(surfaceData.Xc, chunkSize),
        y: createNestedArray(surfaceData.Yc, chunkSize),
        z: createNestedArray(surfaceData.Zc, chunkSize),
        //x: createNestedArray(pointCloud1[0], chunkSize),
        //y: createNestedArray(pointCloud1[1], chunkSize),
        //z: createNestedArray(pointCloud1[2], chunkSize),
        colorscale: [
          [0, "rgb(75,75,75)"],
          [1, "rgb(75,75,75)"],
        ],
        //color: "rgb(0, 255, 0)",
        opacity: 0.5,
        showscale: false,
        showlegend: false,
        legendgroup: "Silo",
        name: "Silo",
      },
      // comment this piece of code to disable the 1st part of the cylinder surface
      {
        type: "surface",
        x: createNestedArray(surfaceData.Xc2, chunkSize),
        y: createNestedArray(surfaceData.Yc2, chunkSize),
        z: createNestedArray(surfaceData.Zc2, chunkSize),
        colorscale: [
          [0, "rgb(75,75,75)"],
          [1, "rgb(75,75,75)"],
        ],
        opacity: 0.5,
        showscale: false,
        showlegend: false,
        legendgroup: "Silo",
        name: "Silo",
      },
      // {
      //   type: "surface",
      //   // x: objectConvertor(pointCloudDatas.points[0].x),
      //   // y: objectConvertor(pointCloudDatas.points[0].y),
      //   // z: objectConvertor(pointCloudDatas.points[0].z),
      //   x: objectConvertor(surfaceData.FXc),
      //   y: objectConvertor(surfaceData.FYc),
      //   z: objectConvertor(surfaceData.FZc),
      //   colorscale: [
      //     [0, "#FFBA52FF"],
      //     [1, "#FFBA52FF"],
      //   ],
      //   // opacity: 0.5,
      //   showscale: false,
      //   showlegend: false,
      //   legendgroup: "Volume Filled",
      // },
      //   {
      //     type: "surface",
      //     // x: objectConvertor(pointCloudDatas.points[0].x),
      //     // y: objectConvertor(pointCloudDatas.points[0].y),
      //     // z: objectConvertor(pointCloudDatas.points[0].z),
      //     x: objectConvertor(surfaceData.FXco),
      //     y: objectConvertor(surfaceData.FYco),
      //     z: objectConvertor(surfaceData.FZco),
      //     colorscale: [
      //       [0, "#FFBA52FF"],
      //       [1, "#FFBA52FF"],
      //     ],
      //     // opacity: 0.5,
      //     showscale: false,
      //     showlegend: false,
      //     legendgroup: "Volume Filled",
      //   },
    ];
    ID = pointCloudDatas.ID;
  } else {
    return <div style={{ display: "none" }}></div>;
  }

  const layout = {
    scene: {
      xaxis: {
        autorange: true,
        visible: true,
      },
      yaxis: {
        autorange: true,
        visible: true,
      },
      zaxis: {
        autorange: true,
        visible: true,
      },
      camera: {
        // center: {x: 0, y: 0, z: 0},
        // up: { x: 0, y: 0, z: -1 },
        // eye: { x: 1.2, y: 1.2, z: -1.2 },
        center: { x: 0, y: 0, z: 0 },
        eye: { x: 2, y: 2, z: -0.1 },
        up: { x: 1.2, y: 1.2, z: -1.2 },
          // center: {x: 0, y: 0, z: 0},
          // eye: {x: 0.1, y: 2.5, z: 0.1},
          // up: {x: 0, y: 0, z: 1}
      },
      dragmode: "orbit",
    },
    margin: { l: 0, r: 0, t: 0, b: 0 },
    // title: {
    //   text: "SILO " + ID.toString(),
    //   font: {
    //     color: "#4A4A4A",
    //     size: 30,
    //     family: "IBM Plex Sans Condensed",
    //   },
    //   y: 0.0,
    //   xanchor: "center",
    //   yanchor: "bottom",
    // },
    height: 700,
    width: 550,
    legend: {
      // font: {
      //   family: "Tisa",
      //   size: 20,
      //   // color: "#4A4A4A",
      // },
      // bgcolor: "rgba(0,0,0,0)",
      // xanchor: "center",
      // x: "0.22",
      // xpad:"100",
      // yanchor: "bottom",
      // y: "1.22",
      // ypad:"100",
      // zpad:"100"
    },
    paper_bgcolor: "transparent",
    // paper_bgcolor: "#f3fde8",
    // plot_bgcolor: "rgba(0,0,0,0)",
  };
  const config = {
    displayModeBar: false,
    scrollZoom: false,
    autosize: false,
    responsive: true,
  };

  return (
    <div>
      <PlotlyComponent1
        className="Silo 1"
        data={data}
        layout={layout}
        config={config}
      />
    </div>
  );
};

export default SiloVisualize;
