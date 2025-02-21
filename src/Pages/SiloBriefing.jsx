import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar";
import Weatherstation from "../Components/Weatherstation/Weatherstation";
import DesktopTabs from "../Components/SiloBriefing/DesktopTabs";
import DesktopTabs2 from "../Components/SiloBriefing/DesktopTabs2";
import ResponsiveDrawer from "../Components/SiloBriefing/ResponsiveDrawer";
import { useMediaQuery } from "@mui/material";
import { useSubscription } from "urql";
import AlarmsDailog from "../Components/Dialogs/AlarmsDialog";
import AlertsDailog from "../Components/Dialogs/AlertsDialog";
import FaultsDailog from "../Components/Dialogs/FaultsDialog";
import AlertFaultAlarmCounts from "../Components/AlertsAlarmsFaults/AlertFaultAlarmCounts";

const AllProbesvalues = `subscription($siloId:Int!) {
  allCurrentSensorValues(filter: {siloId: {equalTo: $siloId}}, orderBy: PROBE_ID_ASC) {
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

const HumidityHistoryValues = `subscription($siloId:Int!) {
    allHumidities(filter: {siloId: {equalTo: $siloId}}, orderBy: SENSOR_ID_ASC) {
      nodes {
        siloId
        probeId
        value
        sensorId
        humValue
        relHumidity
        tempValue
      }
    }
  }`;

const SiloBriefing = () => {
  const [allProbes, setAllProbes] = useState([]);
  const [humidity, setHumidity] = useState([]);
  // console.log("reportHum : ", humidity);
  // console.log("reportTemp : ", allProbes);
  const [openAlarms, setOpenAlarms] = useState(false);
  const [openAlerts, setOpenAlerts] = useState(false);
  const [openFaults, setOpenFaults] = useState(false);

  const handleClickAlarmOpen = (data) => {
    setOpenAlarms(data);
  };
  const handleClickAlertOpen = (data) => {
    setOpenAlerts(data);
  };
  const handleClickFaultOpen = (data) => {
    setOpenFaults(data);
  };

  const OpenAlarmsDialog = () => {
    return (
      <AlarmsDailog
        openDialog={openAlarms}
        closeDialog={() => setOpenAlarms(false)}
        id={id}
      />
    );
  };

  const OpenAlertsDialog = () => {
    return (
      <AlertsDailog
        openDialog={openAlerts}
        closeDialog={() => setOpenAlerts(false)}
        id={id}
      />
    );
  };

  const OpenFaultsDialog = () => {
    return (
      <FaultsDailog
        openDialog={openFaults}
        closeDialog={() => setOpenFaults(false)}
        id={id}
      />
    );
  };

  // console.log("allProbes: ", allProbes);

  const { id } = useParams();
  const matches = useMediaQuery("(max-width:600px)");

  const siloId = Number(id);

  const [allProbesResult, allProbesResultAgain] = useSubscription({
    query: AllProbesvalues,
    variables: {
      siloId,
    },
  });

  const [allHumidityResult, allHumidityResultAgain] = useSubscription({
    query: HumidityHistoryValues,
    variables: {
      siloId,
    },
  });

  const {
    data: dataQuery,
    fetching: fetchingQuery,
    error: errorQuery,
  } = allProbesResult;

  const {
    data: humidityQuery,
    fetching: humidityfetchingQuery,
    error: humidityerrorQuery,
  } = allHumidityResult;

  let sensorId = [];

  for (let node of allProbes) {
    for (let key in node) {
      if (key === "sensorId") sensorId.push(node[key]);
    }
  }

  let uniquesensorId = [...new Set(sensorId)];
  uniquesensorId.sort(function (a, b) {
    return a - b;
  });
  // console.log("uniquesensorId: ", uniquesensorId);

  let AllProbesvaluess = uniquesensorId.map((sensorId) => {
    let datas = [];
    allProbes.forEach((data) => {
      if (data.sensorId === sensorId) {
        datas.push({ [`${data.probeId}`]: parseFloat(data.value).toFixed(2) });
      }
    });
    return { sensor: sensorId, datas: datas };
  });

  useEffect(() => {
    if (dataQuery) setAllProbes(dataQuery.allCurrentSensorValues.nodes);
  }, [dataQuery]);

  useEffect(() => {
    if (humidityQuery) {
      setHumidity(humidityQuery.allHumidities?.nodes);
      //  refresh();
    }
  }, [humidityQuery]);

  return (
    <div>
      {!matches ? (
        <div
          style={{
            display: "flex",
            position: "absolute",
            right: "0",
            marginTop: "65px",
            zIndex: 1,
          }}
        >
          {/* <AlertFaultAlarmCounts
            id={id}
            handleClickAlarmOpen={handleClickAlarmOpen}
            handleClickAlertOpen={handleClickAlertOpen}
            handleClickFaultOpen={handleClickFaultOpen}
          /> */}
        </div>
      ) : null}
      {OpenAlarmsDialog()}
      {OpenAlertsDialog()}
      {OpenFaultsDialog()}
      <Navbar page={`Silo ${id} Details`} project="VIJAYANAGAR BIOTEH" />
      <Weatherstation
        id={siloId}
        // id={id}
        handleClickAlarmOpen={handleClickAlarmOpen}
        handleClickAlertOpen={handleClickAlertOpen}
        handleClickFaultOpen={handleClickFaultOpen}
      />
      {matches ? (
        <ResponsiveDrawer id={siloId} siloDetails={AllProbesvaluess} />
      ) : (
        <DesktopTabs
          id={siloId}
          siloDetails={AllProbesvaluess}
          reportTemp={allProbes}
          reportHum={humidity}
        />
      )}
    </div>
  );
};

export default SiloBriefing;
