import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";

import { Typography } from "@mui/material";
import { Grid, Paper, Container } from "@mui/material";
// Dropdown button...
import { Box } from "@mui/material";
import { InputLabel } from "@mui/material";
import { FormControl } from "@mui/material";
import { NativeSelect } from "@mui/material";
import { useQuery, useSubscription } from "urql";
import Pivot from "quick-pivot";
import { useMediaQuery } from "@mui/material";

const AllProbesHistoryvalues = `subscription($id:Int!,$probrSelection:String!) {
  allProbeHistories(filter: {siloId: {equalTo: $id},, probeId: {equalTo: $probrSelection}},orderBy: UPDATETIME_ASC) {
    nodes {
      value
      updatetime
      siloId
      sensorId
      probeId
    }
  }
}`;

const AllProbesDroupdowns = `subscription($id:Int!) {
  allCurrentSensorValues(filter: {siloId: {equalTo: $id}, sensorId: {equalTo: 1}},orderBy: UPDATETIME_ASC) {
    nodes {
      probeId
    }
  }
}`;

const LineChart = ({ siloDetails, id }) => {
  const [allHistoryProbes, setAllHistoryProbes] = useState([]);
  const [probrSelection, setProbeSelection] = useState("11");
  const [dropdownItem, setDropdownItem] = useState();
  const matches = useMediaQuery("(max-width:600px)");
  const desktopWidth = useMediaQuery("(max-width:1300px)");

    console.log("allHistoryProbes: ", allHistoryProbes);
    console.log("probrSelection: ", probrSelection);
    console.log("dropdownItem: ", dropdownItem);

  useEffect(() => {
    refresh();
  }, [probrSelection]);

  const xAxis = siloDetails.map((item) => item.Time);

  const yAxiss = allHistoryProbes.map((item, index) => {
    return [item["value"]];
  });

  let xAxisLabel = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "june",
    "july",
    "Aus",
    "sep",
  ];

  let probess = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
  ];

  //NOTE: new code starts from here...
  const pivot = new Pivot(
    allHistoryProbes,
    ["updatetime"],
    ["sensorId"],
    "value",
    "sum"
  );
  let time_array = [];
  let sensor_values = [];
  // let array_length = ele.value.length-1;
  let a = 0;
  pivot.data.table.forEach((ele) => {
    if (a != 0) {
      time_array.push(ele.value[0]);
      sensor_values.push(ele.value.slice(1, ele.value.length - 1));
    }
    a++;
  });

  //NOTE: new code ended here...

  var res = [];
  sensor_values.forEach(function (ele) {
    ele.forEach(function (v, i) {
      res[i] = res[i] || []; // define inner array if not defined
      res[i].push(v); // push value to array
    });
  });
  //

  // yAxiss.map((item)=>
  //

  let layout = {
    plot_bgcolor: "#4B4A54",
    paper_bgcolor: "#4B4A54",
    font: { color: "white" },
    // width: matches ? 360 : 900,
    width: matches ? 360 : desktopWidth ? 1200 : 1850,
    height: 410,
    margin: { l: 30, r: 0, b: 40, t: 30 },
    xaxis: {
      autorange: true,
      // range: ['2022-07-01', '2023-02-16'],
      type: "date",
    },
  };

  const updateSelect = (e) => {
    //
    setProbeSelection(e.target.value);
  };
  let Time = [];

  for (let node of allHistoryProbes) {
    for (let key in node) {
      if (key === "updatetime") Time.push(node[key]);
    }
  }
  const historyTime = Time.map((item) => item.slice(0, 19));
  //

  let sensorId = [];

  for (let node of allHistoryProbes) {
    for (let key in node) {
      if (key === "sensorId") sensorId.push(node[key]);
    }
  }
  //

  let uniquesensorId = [...new Set(sensorId)];
  //
  const xAxiss = Time.map((item) => item);

  let AllProbesHistoryvaluess = historyTime.map((time) => {
    let datas = [];
    allHistoryProbes.forEach((data) => {
      if (data.updatetime.slice(0, 19) === time) {
        //
        datas.push({
          [`${data.probeId}`]: { [`S${data.sensorId}`]: data.value },
        });
      }
    });
    return { Time: time, datas: datas };
  });
  //
  //
  let uniqueTime = [...new Set(Time)];
  //

  // let id = parseInt(match.params.id);

  const [allProbesDroupdownsResult, allProbesDroupdownsResultAgain] =
    useSubscription({
      query: AllProbesDroupdowns,
      variables: {
        id,
      },
    });

  const {
    data: droupdownQuery,
    fetching: fetchingdroupdownQuery,
    error: errordroupdownQuery,
  } = allProbesDroupdownsResult;

  useEffect(() => {
    if (droupdownQuery)
      setDropdownItem(droupdownQuery.allCurrentSensorValues.nodes);
    //  refresh();
  }, [droupdownQuery]);

  const [allProbesHistoryResult, allProbesHistoryResultAgain] = useSubscription(
    {
      query: AllProbesHistoryvalues,
      variables: {
        id,
        probrSelection,
      },
    }
  );

  const {
    data: dataQuery,
    fetching: fetchingQuery,
    error: errorQuery,
  } = allProbesHistoryResult;

  useEffect(() => {
    if (dataQuery) setAllHistoryProbes(dataQuery.allProbeHistories.nodes);
    //  refresh();
  }, [dataQuery]);
  time_array.pop();

  let meter = 0;
  const graphData = res.map((item) => {
    item.pop();
    meter += 1;

    return {
      type: "scatter",
      mode: "lines+markers",
      x: time_array,
      y: [...item],
      name: `S${meter}`,
    };
  });

  const refresh = () => {
    // Refetch the query and skip the cache
    allProbesHistoryResultAgain({ requestPolicy: "cache-and-network" });
  };

  return (
    <>
      <Container
        style={{
          width: "auto",
          marginBottom: "30px",
          backgroundColor: "#4B4A54",
          color: "white",
        }}
        component={Paper}
        elevation={3}
      >
        {/* TEMPERATURE HISTORIAN GRAPH DROPDOWN BUTTON */}

        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          style={{ marginTop: "10px", paddingTop: "10px" }}
        >
          <Grid style={{ zIndex: 1 }}>
            <Typography
              variant="h5"
              align="center"
              gutterBottom
              style={{ marginTop: "20px" }}
            >
              Temperature Historian
            </Typography>
          </Grid>
          <Grid style={{ zIndex: 1 }}>
            <Box
              style={{ marginLeft: "10px", color: "white" }}
              sx={{ minWidth: 120 }}
            >
              <FormControl fullWidth>
                <InputLabel
                  style={{ color: "white" }}
                  variant="outlined"
                  htmlFor="uncontrolled-native"
                >
                  Probe Section
                </InputLabel>
                {dropdownItem && (
                  <NativeSelect
                    style={{ color: "white" }}
                    defaultValue="T0"
                    onChange={updateSelect}
                    inputProps={{
                      name: "Probe",
                      id: "uncontrolled-native",
                    }}
                  >
                    {dropdownItem.map((item, i) => (
                      //
                      <option
                        style={{
                          textAlign: "center",
                          color: "white",
                          backgroundColor: "#4B4A54",
                        }}
                        key={i}
                        value={item.probeId}
                      >
                        {i + 1}
                      </option>
                    ))}
                  </NativeSelect>
                )}

              </FormControl>
            </Box>
          </Grid>
        </Grid>
        {/* TEMPERATURE HISTORIAN GRAPH */}
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          style={{
            position: "relative",
            top: "-15px",
            backgroundColor: "#4B4A54",
          }}
        >
          <Plot
            data={graphData}
            layout={layout}
            config={{ displayModeBar: false }}
          />
        </Grid>
      </Container>
    </>
  );
};

export default LineChart;
