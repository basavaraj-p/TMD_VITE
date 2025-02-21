import React, { useState, useEffect } from "react";
import { useQuery, useSubscription } from "urql";
import moment from "moment";
import UsbIcon from "@mui/icons-material/Usb";
import UsbOffIcon from "@mui/icons-material/UsbOff";


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


const AlertFaultAlarmCounts = ({
  id,
  handleClickAlarmOpen,
  handleClickAlertOpen,
  handleClickFaultOpen,
}) => {
  const [alarams, setAlarams] = useState();
  const [alerts, setAlerts] = useState();
  const [faults, setFaults] = useState();
//   const history = useHistory();

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
    <div>
      <div style={{ height: "100px", display: "flex", color: "white" }}>
        <div
          onClick={() => handleClickAlarmOpen(true)}
          style={{
            cursor: "pointer",
            width: "100px",
            backgroundColor: usbConnection ? "#007a37" : "red",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: "16px", fontWeight: "bold" }}>
            {usbConnection ? <UsbIcon /> : <UsbOffIcon />}
          </div>
          <div>USB COM</div>
        </div>
        <div
          onClick={() => handleClickAlarmOpen(true)}
          style={{
            cursor: "pointer",
            width: "100px",
            backgroundColor: "skyblue",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: "16px", fontWeight: "bold" }}>
            {alarams ? alarams.length : 0}
          </div>
          <div>Alarm</div>
        </div>
        <div
          onClick={() => handleClickAlertOpen(true)}
          style={{
            width: "100px",
            backgroundColor: "orange",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <div style={{ fontSize: "16px", fontWeight: "bold" }}>
            {alerts ? alerts.length : 0}
          </div>
          <div>Alert</div>
        </div>
        <div
          onClick={() => handleClickFaultOpen(true)}
          style={{
            cursor: "pointer",
            width: "100px",
            backgroundColor: "red",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: "16px", fontWeight: "bold" }}>
            {faults ? faults.length : 0}
          </div>
          <div>Fault</div>
        </div>
      </div>
    </div>
  );
};

export default AlertFaultAlarmCounts;
