import { Typography } from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@mui/material";
import "./SiloControls.css";
import Switch from "@mui/material/Switch";
import { useQuery, useMutation, useSubscription } from "urql";

const AllRelaySubscription = `subscription($id:Int!) {
  allRelays(condition: {siloId: $id}) {
    nodes {
      status
      siloId
      relayId
      channel
      automatic
      fanType
    }
  }
}`;

const updateRelayRecord = `mutation updateRelayRecBySiloId($inpId:Int!,$inpautomatic:Boolean,) {
  updateRelayBySiloId(input: {relayPatch: {automatic: $inpautomatic}, siloId: $inpId}) {
    clientMutationId
  }
}`;

const updateAFRelayRecord = `mutation updateRelayByRelayId($inprelayId:Int!,$inpautomatic:Boolean,) {
    updateRelayByRelayId(input: {relayPatch: {automatic: $inpautomatic}, relayId: $inprelayId}) {
      clientMutationId
    }
  }`;

const updateRFRelayRecord = `mutation updateRelayByRelayId($inprelayId:Int!,$inpautomatic:Boolean,) {
    updateRelayByRelayId(input: {relayPatch: {automatic: $inpautomatic}, relayId: $inprelayId}) {
      clientMutationId
    }
  }`;

const updateRelayManualRecord = `mutation updateRelayRecBySiloId($inpId:Int!,$inpmanual:Boolean,) {
  updateRelayBySiloId(input: {relayPatch: {status: $inpmanual}, siloId: $inpId}) {
    clientMutationId
  }
}`;

const updateAFRelayManualRecord = `mutation updateRelayByRelayId($inprelayId:Int!,$inpmanual:Boolean,) {
    updateRelayByRelayId(input: {relayPatch: {status: $inpmanual}, relayId: $inprelayId}) {
      clientMutationId
    }
  }`;

const updateRFRelayManualRecord = `mutation updateRelayByRelayId($inprelayId:Int!,$inpmanual:Boolean,) {
    updateRelayByRelayId(input: {relayPatch: {status: $inpmanual}, relayId: $inprelayId}) {
      clientMutationId
    }
  }`;

const SiloControls1 = ({ id }) => {
  const [auto, setAuto] = useState(true);
  //
  const [manual, setManual] = useState(false);
  // const [mode, setMode] = useState("Auto Mode")
  const [manualONOFF, setManualONOFF] = useState("OFF");
  //
  const [isToggled, setIstoggled] = useState(true);
  const [afId, setAfId] = useState();
  const [rfId, setRfId] = useState();
  const [rfFanStatus, setRfFanStatus] = useState();
  // console.log("rfFanStatus: ", rfFanStatus);
  const [afFanStatus, setAfFanStatus] = useState();
  // console.log("afFanStatus: ", afFanStatus);
  //
  const toggleTrueFalse = () => {
    // setToggled(!isToggled);
    // setAuto(!auto);
    // setManual(!manual);
    let updatedAFData = {
      inpautomatic: !auto,
      inprelayId: afId,
    };
    let updatedRFData = {
      inpautomatic: !auto,
      inprelayId: rfId,
    };

    let updatedManualAFData = {
      inpmanual: false,
      inprelayId: afId,
    };
    let updatedManualRFData = {
      inpmanual: false,
      inprelayId: rfId,
    };

    updateAFRelayRecords(updatedAFData);
    updateRFRelayRecords(updatedRFData);
    updateAFManualRelayRecords(updatedManualAFData);
    updateRFManualRelayRecords(updatedManualRFData);
  };

  const ManualON = () => {
    let updatedAFData = {
      inpmanual: true,
      inprelayId: afId,
    };
    let updatedRFData = {
      inpmanual: true,
      inprelayId: rfId,
    };
    updateAFManualRelayRecords(updatedAFData);
    updateRFManualRelayRecords(updatedRFData);
  };
  const ManualOFF = () => {
    let updatedAFData = {
      inpmanual: false,
      inprelayId: afId,
    };
    let updatedRFData = {
      inpmanual: false,
      inprelayId: rfId,
    };
    updateAFManualRelayRecords(updatedAFData);
    updateRFManualRelayRecords(updatedRFData);
  };

  // useEffect(() => {
  //   setManual(true);
  //   setAuto(false);
  // }, [])
  const [thresholds, setThresholds] = useState();

  const [allRelaySubscriptionResult, allRelaySubscriptionResultAgain] =
    useSubscription({
      query: AllRelaySubscription,
      variables: {
        id,
      },
    });

  const {
    data: dataQuery,
    fetching: fetchingQuery,
    error: errorQuery,
  } = allRelaySubscriptionResult;

  useEffect(() => {
    if (dataQuery) {
      if (
        dataQuery.allRelays.nodes[0].automatic === true &&
        dataQuery.allRelays.nodes[1].automatic === true
      ) {
        setAuto(true);
        setManual(false);
        setIstoggled(true);
      } else {
        setAuto(false);
        setManual(true);
        setIstoggled(false);
      }
      //  refresh();
    }
  }, [dataQuery]);

  useEffect(() => {
    if (dataQuery) {
      dataQuery.allRelays.nodes.forEach((node) => {
        if (node.fanType == "AF") {
          setAfId(node.relayId);
        }
        if (node.fanType == "RF") {
          setRfId(node.relayId);
        }
      });
    }
  }, [dataQuery]);

  useEffect(() => {
    if (dataQuery) {
      if (
        dataQuery.allRelays.nodes[0].status === true &&
        dataQuery.allRelays.nodes[1].status === true
      ) {
        setManualONOFF("ON");
      } else {
        setManualONOFF("OFF");
      }
      //  refresh();
    }
  }, [dataQuery]);

  useEffect(() => {
    if (dataQuery) {
      dataQuery.allRelays.nodes.forEach((node) => {
        if (node.fanType == "AF") {
          if (node.status === true) {
            setAfFanStatus("ON");
          } else {
            setAfFanStatus("OFF");
          }
        }
        if (node.fanType == "RF") {
          if (node.fanType == "RF") {
            if (node.status === true) {
              setRfFanStatus("ON");
            } else {
              setRfFanStatus("OFF");
            }
          }
        }
      });
    }
  }, [dataQuery]);

  const [updateAFManualRelayRec, updateAFManualRelay] = useMutation(
    updateAFRelayManualRecord
  );

  const updateAFManualRelayRecords = useCallback((changedDetails) => {
    updateAFManualRelay(changedDetails).then((result) => {
      if (result.error) {
        console.log("result.error: ", result.error);

        return false;
      } else {
        return true;
      }
    });
  });

  const [updateRFManualRelayRec, updateRFManualRelay] = useMutation(
    updateRFRelayManualRecord
  );

  const updateRFManualRelayRecords = useCallback((changedDetails) => {
    updateRFManualRelay(changedDetails).then((result) => {
      if (result.error) {
        console.log("result.error: ", result.error);

        return false;
      } else {
        return true;
      }
    });
  });

  const [updateAFRelayRec, updateAFRelay] = useMutation(updateAFRelayRecord);
  const updateAFRelayRecords = useCallback((changedDetails) => {
    updateAFRelay(changedDetails).then((result) => {
      if (result.error) {
        console.log("result.error: ", result.error);

        return false;
      } else {
        return true;
      }
    });
  });

  const [updateRFRelayRec, updateRFRelay] = useMutation(updateRFRelayRecord);
  const updateRFRelayRecords = useCallback((changedDetails) => {
    updateRFRelay(changedDetails).then((result) => {
      if (result.error) {
        console.log("result.error: ", result.error);

        return false;
      } else {
        return true;
      }
    });
  });
  return (
    <div className="SiloControlsContainer">
      <Typography
        className="text-muted"
        variant="h5"
        align="center"
        gutterBottom
      >
        Silo - {id} Controls
      </Typography>

      <div className="main__button">
        <div
          style={{
            width: "55%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div>Auto Mode</div>
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* <FormControlLabel
                      control={<Android12Switch defaultChecked />}
                      onClick={toggleTrueFalse}
                      label=""
                  /> */}
            <Switch
              checked={isToggled}
              onChange={toggleTrueFalse}
              inputProps={{ "aria-label": "controlled" }}
            />
            <div style={{ marginLeft: "-0px" }}>
              {isToggled == true ? "ON" : "OFF"}
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "-10px",
        }}
      >
        {/* STATUS CONTAINER */}
        <div className="status__container">
          <div className="status__header">Fan Status</div>
          {/* <div style={{marginTop:"10px"}}>{mode}</div> */}
          {!manual && (
            <div style={{ width: "100%" }}>
              <div className="FanStatus">Roof : {rfFanStatus}</div>
              <div
                style={{
                  marginTop: "20px",
                  borderBottom: "0px solid",
                  textAlign: "center",
                  paddingBottom: "0px",
                  marginLeft: "-20px",
                }}
              >
                Aeration <span style={{ paddingLeft: "0px" }}>:</span>{" "}
                {afFanStatus}
              </div>
            </div>
          )}

          {manual && (
            // <div style={{marginTop:"20px"}}>Ventilation : {manualONOFF}</div>
            <div style={{ width: "100%" }}>
              <div className="FanStatus">Roof : {manualONOFF}</div>
              <div
                style={{
                  marginTop: "20px",
                  borderBottom: "0px solid",
                  textAlign: "center",
                  paddingBottom: "0px",
                  marginLeft: "-20px",
                }}
              >
                Aeration <span style={{ paddingLeft: "0px" }}>:</span>{" "}
                {manualONOFF}
              </div>
            </div>
          )}
        </div>

        {/* MANUAL CONTROLS BUTTONS */}
        {manual && (
          <div className="control__container">
            <div className="control__header">Manual Controls</div>
            <div className="manual__buttons">
              <Button
                style={{ outline: "none" }}
                onClick={ManualON}
                variant="contained"
                color="success"
              >
                ON
              </Button>
              <Button
                style={{ marginTop: "10px", outline: "none" }}
                onClick={ManualOFF}
                variant="contained"
                color="error"
              >
                OFF
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SiloControls1;
