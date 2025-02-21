import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import Card from "@mui/material/Card";
import { useQuery, useSubscription } from "urql";
import LinearIndeterminate from "./LinearProgress";

const SiloStatisticsQuery = `subscription MySubscription {
  allScanStatistics {
    nodes {
      updatetime
      volume
    }
  }
}
`;

const VolumeVSTime = () => {
  const [data, setData] = useState([]);
  //   console.log("data : ", data);

  // const [updatetime,setUpdatetime] = useState()
  // console.log("updatetime : ",updatetime);

  // const [volume,setVolume] = useState()
  // console.log("volume : ",volume);

  const [allUpdateTimeResult, allUpdateTimeResultAgain] = useSubscription({
    query: SiloStatisticsQuery,
    // variables: {
    //   id,
    // },
  });

  const {
    data: dataSiloStatisticsQuery,
    fetch: SiloStatisticsfetchingQuery,
    err: SiloStatisticserrorQuery,
  } = allUpdateTimeResult;

  useEffect(() => {
    if (dataSiloStatisticsQuery)
      setData(dataSiloStatisticsQuery.allScanStatistics.nodes);
    //  refresh();
  }, [dataSiloStatisticsQuery]);

  let time = [];
  for (let node of data) {
    for (let key in node) {
      if (key === "updatetime") {
        time.push(node[key]);
      }
    }
  }

  // console.log("time : ", time);

  const volume = data.reduce((result, node) => {
    const parsedVolume = JSON.parse(node.volume);
    if (parsedVolume.tonnes !== undefined) {
      result.push(parsedVolume);
    }
    return result;
  }, []);

  //   console.log("volume : ", volume);

  const tonnes = volume.map((node) => node.tonnes);
  //   console.log("tonnes : ", tonnes);

  const timeArray = time.map((time) => {
    const date = new Date(time);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Format hours and minutes as a string
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString()}`;

    return formattedTime;
  });

  // console.log(timeArray);

  return (
    <div>
      <Card style={{ borderRadius: "5px", backgroundColor: "#b3c99c" }}>
        {/* <h1>Volume</h1> */}
        {timeArray !== 0 ? (
          <Plot
            data={[
              {
                x: timeArray,
                y: tonnes,
                type: "bar",
                mode: "lines+markers",
                marker: { size: 4, color: "green" },
                line: { width: 3, color: "#f3fde8" },
                connectgaps: true,
              },
            ]}
            layout={{
              width: "auto",
              height: "auto",
              title: "Volume Graph",
              paper_bgcolor: "#b3c99c",
              plot_bgcolor: "#b3c99c",
              xaxis: {
                title: "Time",
                tickangle: -45, // Rotate the x-axis labels for better readability
                // tickformat: "%m-%d", // Specify the date and time format
                // showticklabels: false,
              },
              yaxis: { title: "Volume (&#13221;)" },
            }}
            config={{
              displayModeBar: false,
              scrollZoom: false, // Disable zoom
              displaylogo: false, // Disable the Plotly logo
              showAxisDragHandles: false,
            }}
          />
        ) : (
          <LinearIndeterminate />
        )}
      </Card>
    </div>
  );
};

export default VolumeVSTime;
