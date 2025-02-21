import React, { useEffect } from "react";
import { useState } from "react";
import cloud from "/src/assets/cloud1.png";
import { useQuery, useSubscription } from "urql";
import { useMediaQuery } from "@mui/material";
import moment from "moment";
import UsbIcon from "@mui/icons-material/Usb";
import UsbOffIcon from "@mui/icons-material/UsbOff";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import CrisisAlertIcon from "@mui/icons-material/CrisisAlert";
import DangerousIcon from "@mui/icons-material/Dangerous";
import {Badge} from "@mui/material";


const AllWeatherStationsvalues = `subscription {
  allWeatherStations {
    nodes {
      sensorId
      humValue
      tempValue
    }
  }
}`;

const AllHumidityvalues = `subscription($id:Int!) {
  allHumidities(filter: {siloId: {equalTo: $id}}) {
    nodes {
      siloId
      probeId
      value
      humValue
    }
  }
}`;

const AllAlarams = `subscription($id:Int!,$date:Date!)  {
    allAlerts(condition: {siloId: $id}, filter: {alertId: {lessThanOrEqualTo: 3},date: {equalTo:$date}}) {
      nodes {
        title
        start
        color
        siloId
        alertId
      }
      totalCount
    }
  }`;

const AllAlerts = `subscription($id:Int!, $date:Date!)  {
    allAlerts(condition: {siloId: $id}, filter: {alertId: {lessThanOrEqualTo: 2},date: {equalTo: $date}}) {
      nodes {
        title
        start
        color
        siloId
        alertId
      }
      totalCount
    }
  }`;
const AllFaults = `subscription($id:Int!, $date:Date!)  {
    allAlerts(condition: {siloId: $id}, filter: {alertId: {equalTo: 5},date: {equalTo: $date}}) {
      nodes {
        title
        start
        color
        siloId
        alertId
      }
      totalCount
    }
  }`;

const usbStatus = `subscription {
    allUsbs(first: 1, orderBy: TIME_DESC) {
      nodes {
        status
      }
    }
  }`;


const Weatherstation = ({
  id,
  notshow,
  handleClickAlarmOpen,
  handleClickAlertOpen,
  handleClickFaultOpen,
}) => {
  const [weatherStations, setWeatherStations] = useState();
  const [anticondensation, setAnticondensation] = useState();
  const [alarams, setAlarams] = useState();
  const [alerts, setAlerts] = useState();
  const [faults, setFaults] = useState();
  const matches = useMediaQuery("(max-width:600px)");

  if (anticondensation) {
  }

  const [allHumidityResult, allHumidityResultAgain] = useSubscription({
    query: AllHumidityvalues,
    variables: {
      id,
    },
  });

  const {
    data: humidityQuery,
    fetchihumidityfetchingQuery,
    errhumidityerrorQuery,
  } = allHumidityResult;

  useEffect(() => {
    if (humidityQuery) setAnticondensation(humidityQuery.allHumidities.nodes);
    //  refresh();
  }, [humidityQuery]);

  const [allWeatherStationsResult, allWeatherStationsAgain] = useSubscription({
    query: AllWeatherStationsvalues,
  });

  const {
    data: dataQuery,
    fetching: fetchingQuery,
    error: errorQuery,
  } = allWeatherStationsResult;

  useEffect(() => {
    if (dataQuery) setWeatherStations(dataQuery.allWeatherStations.nodes);
    //  refresh();
  }, [dataQuery]);

  let date = moment(new Date()).format("YYYY-MM-DD");
  const [allAlertsResult, allAlertsResultAgain] = useSubscription({
    query: AllAlerts,
    variables: {
      id,
      date,
    },
  });
  const {
    data: alertdataQuery,
    fetching: alertfetchingQuery,
    error: alerterrorQuery,
  } = allAlertsResult;

  useEffect(() => {
    if (alertdataQuery) setAlerts(alertdataQuery.allAlerts.nodes);
  }, [alertdataQuery]);

  const [allFaultsResult, allFaultssResultAgain] = useSubscription({
    query: AllFaults,
    variables: {
      id,
      date,
    },
  });

  const {
    data: faultdataQuery,
    fetching: faultfetchingQuery,
    error: faulterrorQuery,
  } = allFaultsResult;

  useEffect(() => {
    if (faultdataQuery) setFaults(faultdataQuery.allAlerts.nodes);
  }, [faultdataQuery]);

  const [allAlaramsResult, allAlaramsResultAgain] = useSubscription({
    query: AllAlarams,
    variables: {
      id,
      date,
    },
  });

  const {
    data: alaramdataQuery,
    fetching: alaramfetchingQuery,
    error: alaramerrorQuery,
  } = allAlaramsResult;

  useEffect(() => {
    if (alaramdataQuery) setAlarams(alaramdataQuery.allAlerts.nodes);
  }, [alaramdataQuery]);

  const [usbConnection, setUsbConnection] = useState();

  const [usbStatuResult, usbStatuResultAgain] = useSubscription({
    query: usbStatus,
  });

  const {
    data: usbQuery,
    fetching: usbfetchingQuery,
    error: usberrorQuery,
  } = usbStatuResult;

  useEffect(() => {
    if (usbQuery) setUsbConnection(usbQuery.allUsbs.nodes[0].status);
    //  refresh();
  }, [usbQuery]);

  return (
    <div
      style={{
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        color: "black",
        height: "100%",
        width: "100%",
        background: "linear-gradient(to right, #78C1F3, #B9F3FC)",
        margin: "0.1% 0 0 0",
        // marginBottom: matches ? "2%" : "0",
        display: "flex",
        position: "sticky",
        top: 0,
        zIndex: 1,
      }}
    >
      {/* {!matches && (
        <img
          src={cloud}
          alt="cloud"
          style={{
            width: "10%",
            height: "10%",
            animationName: "sun",
            animationDuration: "1.5s",
            animationIterationCount: "infinite",
          }}
        />
      )} */}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          // marginLeft: "1%",
          color: "#dadde2",
          border: "1px solid",
          paddingLeft: "1%",
          paddingRight: "1%",
          // width: "10%",
          // height: "10%",
        }}
      >
        <div
          style={{
            fontSize: "160%",
            fontWeight: "bold",
            paddingTop: "10%",
            color: "black",
          }}
        >
          {weatherStations &&
            parseFloat(weatherStations[0].tempValue).toFixed(2)}
          <small>°C</small>
        </div>
        <div
          style={{
            fontSize: "80%",
            fontWeight: "bold",
            color: "black",
            textTransform: "capitalize",
          }}
        >
          TEMPERATURE
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          // marginLeft: "2%",
          color: "#dadde2",
          border: "1px solid",
          paddingLeft: "1%",
          paddingRight: "1%",
          // marginRight:"1%"
          // background: "linear-gradient(to right, #78C1F3, #B9F3FC)",
        }}
      >
        <div
          style={{
            fontSize: "160%",
            fontWeight: "bold",
            paddingTop: "10%",
            color: "black",
          }}
        >
          {weatherStations &&
            parseFloat(weatherStations[0].humValue).toFixed(2)}
          <small>RH</small>
        </div>
        <small style={{ fontSize: "80%", fontWeight: "bold", color: "black" }}>
          HUMIDITY
        </small>
      </div>

      {!notshow && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            // marginLeft: "1%",
            color: "#dadde2",
            border: "1px solid",
            paddingLeft: "1%",
            paddingRight: "1%",
          }}
        >
          <div
            style={{
              fontSize: "160%",
              fontWeight: "bold",
              paddingTop: "7%",
              color: "black",
            }}
          >
            {anticondensation && 
              parseFloat(anticondensation[0].humValue).toFixed(2)}
            <small>RH</small>
          </div>
          <small
            style={{ fontSize: "80%", fontWeight: "bold", color: "black" }}
          >
            ANTI-CONDENSATION
          </small>
        </div>
      )}
      {/*  */}
      {!notshow && !matches && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "auto", // <-- Add this
            color: "white",
            // backgroundColor: !usbConnection ? "red" : "green",
            backgroundColor: !usbConnection ? "red" : "green",
            width: "100px",
            // height: "100px",
          }}
        >
          <div
            style={{
              fontSize: "170%",
              fontWeight: "bold",
              padding: "7%",
              color: "white",
              width: "auto",
            }}
          >
            {usbConnection ? (
              <UsbIcon fontSize="large" />
            ) : (
              <UsbOffIcon fontSize="large" />
            )}
            {/* <small>RH</small> */}
          </div>
          <small
            style={{ fontSize: "110%", fontWeight: "bold", color: "white" }}
          >
            USB COM
          </small>
        </div>
      )}
      {!notshow && !matches && (
        <div
          onClick={() => handleClickAlarmOpen(true)}
          style={{
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            // marginLeft: "auto", // <-- Add this
            color: "white",
            backgroundColor: "skyblue",
            width: "100px",
            // height: "100px",
          }}
        >
          <div
            style={{
              fontSize: "170%",
              fontWeight: "bold",
              padding: "7%",
              color: "white",
              width: "auto",
            }}
          >
            {/* {alarams ? alarams.length : 0} */}
            <Badge
              badgeContent={alarams ? alarams.length : 0}
              color="error"
              max={999}
            >
              <AccessAlarmIcon fontSize="large" />
            </Badge>
            {/* <small>RH</small> */}
          </div>
          <small
            style={{ fontSize: "110%", fontWeight: "bold", color: "white" }}
          >
            ALARMS
          </small>
        </div>
      )}
      {/*  */}
      {/*  */}
      {!notshow && !matches && (
        <div
          onClick={() => handleClickAlertOpen(true)}
          style={{
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "",
            color: "white",
            backgroundColor: "#ffa500",
            width: "100px",
            // height: "100px",
          }}
        >
          <div
            style={{
              fontSize: "170%",
              fontWeight: "bold",
              padding: "7%",
              color: "white",
            }}
          >
            {/* {alerts ? alerts.length : 0} */}
            <Badge
              badgeContent={alerts ? alerts.length : 0}
              color="error"
              max={999}
            >
              <CrisisAlertIcon fontSize="large" />
            </Badge>

            {/* <small>RH</small> */}
          </div>
          <small
            style={{ fontSize: "110%", fontWeight: "bold", color: "white" }}
          >
            ALERTS
          </small>
        </div>
      )}
      {/*  */}
      {/*  */}
      {!notshow && !matches && (
        <div
          onClick={() => handleClickFaultOpen(true)}
          style={{
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "",
            color: "white",
            marginRight: "",
            backgroundColor: "red",
            width: "100px",
            // height: "100px",
          }}
        >
          <div
            style={{
              fontSize: "170%",
              fontWeight: "bold",
              padding: "7%",
              color: "white",
              // marginRight:"10%"
            }}
          >
            {/* {faults ? faults.length : 0} */}
            <Badge
              badgeContent={faults ? faults.length : 0}
              color="primary"
              max={999}
            >
              <DangerousIcon fontSize="large" />
            </Badge>
            {/* <small>RH</small> */}
          </div>
          <small
            style={{ fontSize: "110%", fontWeight: "bold", color: "white" }}
          >
            FAULTS
          </small>
        </div>
      )}
      {/*  */}
    </div>
  );
};

export default Weatherstation;
