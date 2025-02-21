import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Button } from "@mui/material";
import { useSubscription } from "urql";
import { Tooltip } from "@mui/material";

const SiloStatisticsQuery = `subscription MySubscription {
  allScanStatistics {
    nodes {
      updatetime
      volume
    }
  }
}
`;

const GaugeChart = ({ title, value, min, max }) => {
  const data = [
    {
      type: "indicator",
      mode: "gauge+number",
      value: value,
      title: { text: title },
      gauge: {
        axis: { range: [min, max] },
        bar: { color: "green" },
      },
    },
  ];

  const layout = {
    plot_bgcolor: "#b3c99c", // Set the background color here
    paper_bgcolor: "#b3c99c",
    width: 260,
    height: 240,
  };

  const config = {
    displayModeBar: false, // Disable the camera and logo
  };

  return (
    <div
      style={{
        height: "auto",
        width: "auto",
        margin: "-20px",
        backgroundColor: "#b3c99c",
      }}
    >
      <Plot data={data} layout={layout} config={config} />
    </div>
  );
};

const GaugeCharts = ({ isButtonDisabled }) => {
  // console.log("isButtonDisabled : ", isButtonDisabled);
  const [data, setData] = useState([]);
  //   console.log("data : ", data);

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

  const volume = data.reduce((result, node) => {
    const parsedVolume = JSON.parse(node.volume);
    if (parsedVolume.tonnes !== undefined) {
      result.push(parsedVolume);
    }
    return result;
  }, []);

  //   console.log("volume : ", volume);

  const percentage = volume.map((node) => node.percentage);
  // console.log("percentage : ", percentage[percentage.length - 1]);
  const tonnes = volume.map((node) => node.tonnes);
  // console.log("tonnes : ", tonnes[tonnes.length - 1]);
  const cubic_meters = volume.map((node) => node.cubic_meters);
  // console.log("cubic_meters : ", cubic_meters[cubic_meters.length -1]);

  const handleScan = async () => {
    // Disable the button
    // setIsButtonDisabled(true);

    // Send an HTTP request to start the scanning process
    try {
      const response = await fetch("http://localhost:3102/startScan", {
        method: "POST",
      });

      if (response.ok) {
        console.log("Scanning has started");
      } else {
        console.error("Failed to start scanning");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      // Re-enable the button
      // setIsButtonDisabled(false);
    }
  };

  return (
    <Card
      style={{
        display: "flex",
        flexDirection: "column",
        height: "auto",
        width: "auto",
        backgroundColor: "#b3c99c",
        marginBottom: "2%",
      }}
    >
      <CardContent
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-around",
        }}
      >
        {/* <h1>Volume</h1> */}
        <GaugeChart
          title="Filled % "
          value={percentage[percentage.length - 1]}
          min={0}
          max={100}
        />
        <GaugeChart
          title="Tonnes (t)"
          value={tonnes[tonnes.length - 1]}
          min={0}
          max={10000}
        />
        <GaugeChart
          title="Cubic Meters (&#13221;)"
          value={cubic_meters[cubic_meters.length - 1]}
          min={0}
          max={10000}
        />
      </CardContent>
      <div
        style={{
          margin: "10px",
          marginTop: "-65px",
          display: "flex",
          justifyContent: "flex-end",
          // color:"black"
        }}
      >
        <Button
          variant="contained"
          onClick={handleScan}
          disabled={isButtonDisabled}
        >
          {isButtonDisabled ? "SCAN IN PROGRESS" : "SCAN"}
        </Button>
      </div>
    </Card>
  );
};

export default GaugeCharts;
