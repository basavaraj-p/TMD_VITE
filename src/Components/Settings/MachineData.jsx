import React, { useState, useCallback, useEffect } from "react";
import {
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  Grid,
  Box,
} from "@mui/material";
import { useQuery, useMutation, useSubscription } from "urql";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import PieChartComponent from "./PieChart";
import TablePagination from "@mui/material/TablePagination";
import SiloConveyorData from "./SiloConveyorData";
import SiloConveyorDataGraph from "./SiloConveyorDataGraph";

const trip_status_query = `subscription MySubscription {
  allTripStatuses(orderBy: TIME_DESC) {
    nodes {
      value
      time
    }
  }
}
`;



const alarms_query = `subscription MySubscription {
  allAlarms(orderBy: TIME_DESC) {
    nodes {
      value
      time
    }
  }
}
`;

const operation_status_query = `subscription MySubscription {
  allOperationStatuses {
    nodes {
      bypassStartLamp
      emStopCc1
      emStopCc2
      emStopCc4
      loadingAutoMode
      loadingSelection1
      loadingSelection2
      loadingStartLamp
      recirStartLamp
      unloadingAutoMode
      unloadingSelection1
      unloadingSelection2
      unloadingStartLamp
    }
  }
}
`;

const active_query = `subscription MySubscription {
  allActiveData(orderBy: TIME_DESC, first: 1) {
    nodes {
      time
      value
    }
  }
}
`;

const current_query = `subscription MySubscription {
  allCurrentData(orderBy: TIME_DESC, first: 1) {
    nodes {
      time
      value
    }
  }
}
`;

const power_query = `subscription MySubscription {
  allPowerData(orderBy: TIME_DESC, first: 1) {
    nodes {
      time
      value
    }
  }
}
`;

const voltage_query = `subscription MySubscription {
  allVoltageData(orderBy: TIME_DESC, first: 1) {
    nodes {
      time
      value
    }
  }
}
`;

function MachineData({ id }) {
  const [tripStatus, setTripStatus] = useState([]);
  // console.log("tripStatus : ", tripStatus);

  const [alarms, setAlarms] = useState([]);
  // console.log("alarms : ", alarms);

  const [operationStatus, setOperationStatus] = useState([]);
  // console.log("operationStatus : ", operationStatus);

  const [active, setActive] = useState([]);
  // console.log("active : ", active);

  const [current, setCurrent] = useState([]);
  // console.log("current : ", current);

  const [power, setPower] = useState([]);
  // console.log("power : ", power);

  const [voltage, setVoltage] = useState([]);
  // console.log("voltage : ", voltage);


  const [
    alltripStatusSubscriptionResult,
    alltripStatusSubscriptionResultAgain,
  ] = useSubscription({
    query: trip_status_query,
    // variables: {
    //   id,
    // },
  });



  const {
    data: datatripStatusQuery,
    fetching: fetchingtripStatusQuery,
    error: errortripStatusQuery,
  } = alltripStatusSubscriptionResult;

  useEffect(() => {
    if (datatripStatusQuery)
      setTripStatus(datatripStatusQuery.allTripStatuses.nodes);
    //  refresh();
  }, [datatripStatusQuery]);



  const [allalarmsSubscriptionResult, allalarmsSubscriptionResultAgain] =
    useSubscription({
      query: alarms_query,
      // variables: {
      //   id,
      // },
    });

  const {
    data: dataalarmsQuery,
    fetching: fetchingalarmsQuery,
    error: erroralarmsQuery,
  } = allalarmsSubscriptionResult;

  useEffect(() => {
    if (dataalarmsQuery) setAlarms(dataalarmsQuery.allAlarms.nodes);
    //  refresh();
  }, [dataalarmsQuery]);

  const [allOSSubscriptionResult, allOSSubscriptionResultAgain] =
    useSubscription({
      query: operation_status_query,
      // variables: {
      //   id,
      // },
    });

  const {
    data: dataOSQuery,
    fetching: fetchingOSQuery,
    error: errorOSQuery,
  } = allOSSubscriptionResult;

  useEffect(() => {
    if (dataOSQuery) setOperationStatus(dataOSQuery.allOperationStatuses.nodes);
    //  refresh();
  }, [dataOSQuery]);

  const [allcurrentSubscriptionResult, allcurrentSubscriptionResultAgain] =
    useSubscription({
      query: current_query,
      // variables: {
      //   id,
      // },
    });

  const {
    data: datacurrentQuery,
    fetching: fetchingcurrentQuery,
    error: errorcurrentQuery,
  } = allcurrentSubscriptionResult;

  useEffect(() => {
    if (datacurrentQuery) setCurrent(datacurrentQuery.allCurrentData.nodes);
    //  refresh();
  }, [datacurrentQuery]);

  const [allactiveSubscriptionResult, allactiveSubscriptionResultAgain] =
    useSubscription({
      query: active_query,
      // variables: {
      //   id,
      // },
    });

  const {
    data: dataactiveQuery,
    fetching: fetchingactiveQuery,
    error: erroractiveQuery,
  } = allactiveSubscriptionResult;

  useEffect(() => {
    if (dataactiveQuery) setActive(dataactiveQuery.allActiveData.nodes);
    //  refresh();
  }, [dataactiveQuery]);

  const [allpowerSubscriptionResult, allpowerSubscriptionResultAgain] =
    useSubscription({
      query: power_query,
      // variables: {
      //   id,
      // },
    });

  const {
    data: datapowerQuery,
    fetching: fetchingpowerQuery,
    error: errorpowerQuery,
  } = allpowerSubscriptionResult;

  useEffect(() => {
    if (datapowerQuery) setPower(datapowerQuery.allPowerData.nodes);
    //  refresh();
  }, [datapowerQuery]);

  const [allvoltageSubscriptionResult, allvoltageSubscriptionResultAgain] =
    useSubscription({
      query: voltage_query,
      // variables: {
      //   id,
      // },
    });

  const {
    data: datavoltageQuery,
    fetching: fetchingvoltageQuery,
    error: errorvoltageQuery,
  } = allvoltageSubscriptionResult;

  useEffect(() => {
    if (datavoltageQuery) setVoltage(datavoltageQuery.allVoltageData.nodes);
    //  refresh();
  }, [datavoltageQuery]);

  // Get the current date
  const currentDate = new Date();

  // Calculate the date 7 days ago
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Filter the trips based on the time property
  const tripStatus2 = tripStatus?.filter((trip) => {
    const tripDate = new Date(trip.time);
    return tripDate >= sevenDaysAgo && tripDate <= currentDate;
  });

  // Now you can use filteredTrips directly in your component
  // console.log("tripStatus2 : ", tripStatus2);

  const valueCount = {};

  // Count the occurrences of each "value"
  tripStatus?.forEach((trip) => {
    const { value } = trip;
    valueCount[value] = (valueCount[value] || 0) + 1;
  });

  // Convert the object into an array of objects
  const tripStatusPieChartData = Object.entries(valueCount)?.map(
    ([name, count]) => ({
      value: count,
      name,
    })
  );

  // console.log("tripStatusPieChartData : ", tripStatusPieChartData);

  // Pagination
  const rowsPerPage = 10; // Set the number of rows per page
  const [page, setPage] = useState(0);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  /////////////////////////////////////////////////////////////////////
  // Filter the trips based on the time property
  const alarms2 = alarms?.filter((trip) => {
    const alarmDate = new Date(trip.time);
    return alarmDate >= sevenDaysAgo && alarmDate <= currentDate;
  });

  // Now you can use filteredTrips directly in your component
  // console.log("tripStatus2 : ", tripStatus2);

  const valueCount2 = {};

  // Count the occurrences of each "value"
  alarms?.forEach((trip) => {
    const { value } = trip;
    valueCount2[value] = (valueCount2[value] || 0) + 1;
  });

  // Convert the object into an array of objects
  const alarmsPieChartData = Object.entries(valueCount2)?.map(
    ([name, count]) => ({
      value: count,
      name,
    })
  );

  // console.log("alarmsPieChartData : ", alarmsPieChartData);

  // Pagination
  const rowsPerPage2 = 10; // Set the number of rows per page
  const [page2, setPage2] = useState(0);

  // Handle page change
  const handleChangePage2 = (event, newPage) => {
    setPage2(newPage);
  };

  const operationStatus2 = operationStatus?.flatMap((data) => [
    {
      name: "SILO BYPASS START LAMP",
      status: data.bypassStartLamp,
    },
    {
      name: "LOADING FIELD EM STOP CC1",
      status: data.emStopCc1,
    },
    {
      name: "LOADING FIELD EM STOP CC2",
      status: data.emStopCc2,
    },
    {
      name: "UNLOADING FIELD EM STOP CC4",
      status: data.emStopCc4,
    },
    {
      name: "SILO LOADING AUTO MODE",
      status: data.loadingAutoMode,
    },
    {
      name: "SILO LOADING SELECTION 1",
      status: data.loadingSelection1,
    },
    {
      name: "SILO LOADING SELECTION 2",
      status: data.loadingSelection2,
    },
    {
      name: "SILO LOADING START LAMP",
      status: data.loadingStartLamp,
    },
    {
      name: "SILO RECIR START LAMP",
      status: data.recirStartLamp,
    },
    {
      name: "SILO UNLOADING AUTO MODE",
      status: data.unloadingAutoMode,
    },
    {
      name: "SILO UNLOADING SELECTION 1",
      status: data.unloadingSelection1,
    },
    {
      name: "SILO UNLOADING SELECTION 2",
      status: data.unloadingSelection2,
    },
    {
      name: "SILO UNLOADING START LAMP",
      status: data.unloadingStartLamp,
    },
  ]);
  // console.log("operationStatus2 : ", operationStatus2);

  const active2 = active?.map((data) => ({
    time: data.time,
    value: JSON.parse(data.value),
  }));
  // console.log("active2 : ", active2);

  const current2 = current?.map((data) => ({
    time: data.time,
    value: JSON.parse(data.value),
  }));
  // console.log("current2 : ", current2);

  const power2 = power?.map((data) => ({
    time: data.time,
    value: JSON.parse(data.value),
  }));
  // console.log("power2 : ", power2);

  const voltage2 = voltage?.map((data) => ({
    time: data.time,
    value: JSON.parse(data.value),
  }));
  // console.log("voltage2 : ", voltage2);

  return (
    <Box
      padding={2}
      borderRadius={2}
      style={{ background: "#B3C99C", overflowX: "auto" }}
    >
      <Grid container spacing={2} justifyContent="flex-start">
        {/* Active Data */}
        <Grid item xs={12} sm={6}>
          <Card style={{ background: "#F3FDE8" }}>
            <CardContent>
              <Typography
                align="center"
                variant="h6"
                fontWeight="bold"
                color="green"
                style={{ marginBottom: "" }}
                // style={{ marginBottom: "41.5%" }}
              >
                ACTIVE(Wh)
              </Typography>
              <TableContainer component={Paper}>
                <Table
                  aria-label="simple table"
                  size="small"
                  style={{
                    border: "2px solid #007a37",
                    backgroundColor: "#b3c99c",
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell align="left" style={{ fontWeight: "bold" }}>
                        TIME
                      </TableCell>
                      <TableCell align="left" style={{ fontWeight: "bold" }}>
                        IMPORT
                      </TableCell>
                      <TableCell align="left" style={{ fontWeight: "bold" }}>
                        EXPORT
                      </TableCell>
                      <TableCell align="left" style={{ fontWeight: "bold" }}>
                        NET
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {active2
                      // ?.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                      .map((data, index) => (
                        <TableRow key={index}>
                          <TableCell align="left">
                            {new Date(data.time).toLocaleString()}
                          </TableCell>
                          <TableCell align="left">
                            {data.value.Import}
                          </TableCell>
                          <TableCell align="left">
                            {data.value.Export}
                          </TableCell>
                          <TableCell align="left">{data.value.Net}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                {/* Pagination */}
                {/* <TablePagination
                  rowsPerPageOptions={[]}
                  component="div"
                  count={tripStatus2?.length || 0}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                /> */}
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Power Data */}
        <Grid item xs={12} sm={6}>
          <Card style={{ background: "#F3FDE8" }}>
            <CardContent>
              <Typography
                align="center"
                variant="h6"
                fontWeight="bold"
                color="green"
                style={{ marginBottom: "" }}
                // style={{ marginBottom: "41.5%" }}
              >
                POWER
              </Typography>
              <TableContainer component={Paper}>
                <Table
                  aria-label="simple table"
                  size="small"
                  style={{
                    border: "2px solid #007a37",
                    backgroundColor: "#b3c99c",
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell align="left" style={{ fontWeight: "bold" }}>
                        TIME
                      </TableCell>
                      <TableCell align="left" style={{ fontWeight: "bold" }}>
                        AVGPF
                      </TableCell>
                      <TableCell align="left" style={{ fontWeight: "bold" }}>
                        FREQUENCY(Hz)
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {power2
                      // ?.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                      .map((data, index) => (
                        <TableRow key={index}>
                          <TableCell align="left">
                            {new Date(data.time).toLocaleString()}
                          </TableCell>
                          <TableCell align="left">{data.value.AvgPF}</TableCell>
                          <TableCell align="left">
                            {data.value.Frequency}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                {/* Pagination */}
                {/* <TablePagination
                  rowsPerPageOptions={[]}
                  component="div"
                  count={tripStatus2?.length || 0}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                /> */}
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Tons Bar Graph Data */}
        <Grid item xs={12} sm={6}>
          <SiloConveyorDataGraph silo={5} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <SiloConveyorDataGraph silo={4} />
        </Grid>
        
        {/* Trip Status Card */}
        <Grid item xs={12} sm={4}>
          <Card style={{ background: "#F3FDE8" }}>
            <CardContent>
              <Typography
                align="center"
                variant="h6"
                fontWeight="bold"
                color="green"
              >
                TRIP STATUS
              </Typography>
              <PieChartComponent graphData={tripStatusPieChartData} />
              <TableContainer component={Paper}>
                <Table
                  aria-label="simple table"
                  size="small"
                  style={{
                    border: "2px solid #007a37",
                    backgroundColor: "#b3c99c",
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell align="left" style={{ fontWeight: "bold" }}>
                        TIME
                      </TableCell>
                      <TableCell align="left" style={{ fontWeight: "bold" }}>
                        DESCRIPTION
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tripStatus
                      ?.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                      .map((data, index) => (
                        <TableRow key={index}>
                          <TableCell align="left">
                            {new Date(data.time).toLocaleString()}
                          </TableCell>
                          <TableCell align="left">{data.value}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                {/* Pagination */}
                <TablePagination
                  rowsPerPageOptions={[]}
                  component="div"
                  count={tripStatus?.length || 0}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                />
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* MLS Card */}
        <Grid item xs={12} sm={4}>
          <Card style={{ background: "#F3FDE8" }}>
            <CardContent>
              <Typography
                align="center"
                variant="h6"
                fontWeight="bold"
                color="green"
                style={{ marginBottom: "" }}
              >
                ALARMS
              </Typography>
              <PieChartComponent graphData={alarmsPieChartData} />
              <TableContainer component={Paper}>
                <Table
                  aria-label="simple table"
                  size="small"
                  style={{
                    border: "2px solid #007a37",
                    backgroundColor: "#b3c99c",
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell align="left" style={{ fontWeight: "bold" }}>
                        TIME
                      </TableCell>
                      <TableCell align="left" style={{ fontWeight: "bold" }}>
                        DESCRIPTION
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {alarms
                      ?.slice(page2 * rowsPerPage2, (page2 + 1) * rowsPerPage2)
                      .map((data, index) => (
                        <TableRow key={index}>
                          <TableCell align="left">
                            {new Date(data.time).toLocaleString()}
                          </TableCell>
                          <TableCell align="left">{data.value}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                {/* Pagination */}
                <TablePagination
                  rowsPerPageOptions={[]}
                  component="div"
                  count={alarms?.length || 0}
                  rowsPerPage={rowsPerPage2}
                  page={page2}
                  onPageChange={handleChangePage2}
                />
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Operation Status Card */}
        <Grid item xs={12} sm={4}>
          <Card style={{ background: "#F3FDE8" }}>
            <CardContent>
              <Typography
                align="center"
                variant="h6"
                fontWeight="bold"
                color="green"
                style={{ marginBottom: "" }}
                // style={{ marginBottom: "41.5%" }}
              >
                OPERATION STATUS
              </Typography>
              <TableContainer component={Paper}>
                <Table
                  aria-label="simple table"
                  size="medium"
                  style={{
                    border: "2px solid #007a37",
                    backgroundColor: "#b3c99c",
                  }}
                >
                  <TableHead style={{ backgroundColor: "#325e38" }}>
                    <TableRow style={{ borderBottom: "2.5px solid #dfdfde" }}>
                      <TableCell
                        align="left"
                        style={{
                          fontWeight: "bold",
                          fontSize: "20px",
                          color: "white",
                        }}
                      >
                        NAME
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          fontWeight: "bold",
                          fontSize: "20px",
                          color: "white",
                        }}
                      >
                        STATUS
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {operationStatus2
                      // ?.slice(page2 * rowsPerPage2, (page2 + 1) * rowsPerPage2)
                      .map((data, index) => (
                        <TableRow
                          key={index}
                          style={{
                            borderBottom: "2.5px solid #dfdfde", // Adjust the border size and color
                            // marginBottom:
                            //   index === operationStatus2.length - 1 ? 0 : "8px",
                          }}
                        >
                          <TableCell
                            align="left"
                            style={{
                              height: "4.26rem",
                              // fontWeight: "bold",
                              fontSize: "18px",
                            }}
                          >
                            {data.name}
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{
                              // backgroundColor:
                              //   data.status === "1" ? "red" : "green",
                              borderRadius: "18px",
                              // fontWeight: "bold",
                              fontSize: "20px",
                              color: "black",
                              margin: "10px",
                              height: "4.26rem",
                            }}
                          >
                            {data.status === "1" ? "ON" : "OFF"}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Current Data */}
        <Grid item xs={12} sm={6}>
          <Card style={{ background: "#F3FDE8" }}>
            <CardContent>
              <Typography
                align="center"
                variant="h6"
                fontWeight="bold"
                color="green"
                style={{ marginBottom: "" }}
                // style={{ marginBottom: "41.5%" }}
              >
                CURRENT(Amp)
              </Typography>
              <TableContainer component={Paper}>
                <Table
                  aria-label="simple table"
                  size="small"
                  style={{
                    border: "2px solid #007a37",
                    backgroundColor: "#b3c99c",
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell align="left" style={{ fontWeight: "bold" }}>
                        TIME
                      </TableCell>
                      <TableCell align="left" style={{ fontWeight: "bold" }}>
                        L1
                      </TableCell>
                      <TableCell align="left" style={{ fontWeight: "bold" }}>
                        L2
                      </TableCell>
                      <TableCell align="left" style={{ fontWeight: "bold" }}>
                        L3
                      </TableCell>
                      <TableCell align="left" style={{ fontWeight: "bold" }}>
                        LN
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {current2
                      // ?.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                      .map((data, index) => (
                        <TableRow key={index}>
                          <TableCell align="left">
                            {new Date(data.time).toLocaleString()}
                          </TableCell>
                          <TableCell align="left">{data.value.L1}</TableCell>
                          <TableCell align="left">{data.value.L2}</TableCell>
                          <TableCell align="left">{data.value.L3}</TableCell>
                          <TableCell align="left">{data.value.LN}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                {/* Pagination */}
                {/* <TablePagination
                  rowsPerPageOptions={[]}
                  component="div"
                  count={tripStatus2?.length || 0}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                /> */}
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Voltage Data */}
        <Grid item xs={12} sm={6}>
          <Card style={{ background: "#F3FDE8" }}>
            <CardContent>
              <Typography
                align="center"
                variant="h6"
                fontWeight="bold"
                color="green"
                style={{ marginBottom: "" }}
                // style={{ marginBottom: "41.5%" }}
              >
                VOLTAGE(Volt)
              </Typography>
              <TableContainer component={Paper}>
                <Table
                  aria-label="simple table"
                  size="small"
                  style={{
                    border: "2px solid #007a37",
                    backgroundColor: "#b3c99c",
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell align="left" style={{ fontWeight: "bold" }}>
                        TIME
                      </TableCell>
                      <TableCell align="left" style={{ fontWeight: "bold" }}>
                        V1
                      </TableCell>
                      <TableCell align="left" style={{ fontWeight: "bold" }}>
                        V2
                      </TableCell>
                      <TableCell align="left" style={{ fontWeight: "bold" }}>
                        V3
                      </TableCell>
                      <TableCell align="left" style={{ fontWeight: "bold" }}>
                        V12
                      </TableCell>
                      <TableCell align="left" style={{ fontWeight: "bold" }}>
                        V23
                      </TableCell>
                      <TableCell align="left" style={{ fontWeight: "bold" }}>
                        V31
                      </TableCell>
                      <TableCell align="left" style={{ fontWeight: "bold" }}>
                        Vavg
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {voltage2
                      // ?.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                      .map((data, index) => (
                        <TableRow key={index}>
                          <TableCell align="left">
                            {new Date(data.time).toLocaleString()}
                          </TableCell>
                          <TableCell align="left">{data.value.V1}</TableCell>
                          <TableCell align="left">{data.value.V2}</TableCell>
                          <TableCell align="left">{data.value.V3}</TableCell>
                          <TableCell align="left">{data.value.V12}</TableCell>
                          <TableCell align="left">{data.value.V23}</TableCell>
                          <TableCell align="left">{data.value.V31}</TableCell>
                          <TableCell align="left">{data.value.Vavg}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                {/* Pagination */}
                {/* <TablePagination
                  rowsPerPageOptions={[]}
                  component="div"
                  count={tripStatus2?.length || 0}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                /> */}
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Tons Data */}
        {/* <Grid item xs={12} sm={6}>
          <SiloConveyorData silo={5} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <SiloConveyorData silo={4} />
        </Grid> */}
      </Grid>
    </Box>
  );
}

export default MachineData;
