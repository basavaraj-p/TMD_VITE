import React, { useEffect, useState, useCallback } from "react";
import {
  CardTitle,
  CardBody,
  Row,
  Label,
  Input,
  Col,
  FormGroup,
  Form,
  CardHeader,
} from "reactstrap";
import { Container, Paper, Card, Button } from "@mui/material";
import "./TemperatureSettings.css"
import { useQuery, useMutation, useSubscription } from "urql";
import {useMediaQuery} from "@mui/material";

const allCustomer = `query  {
  allCustomers {
    nodes {
      location
      name
    }
  }
}`;

const threshold = `subscription($id:Int!)  {
  allThresholdSettings(condition: {siloId: $id}) {
    nodes {
      rfTempHigh
      rfHumHigh
      moistureHigh
      moistureLow
      siloId
    }
  }
}`;

const updateThresholdSettings = `mutation updateThresholdSettingsRecById($inpId:Int!,$inphighMoi:Int!, $inplowMoi:Int!, $inphighTemp:Int!,$inphighHum:Int!,) {
  updateThresholdSettingBySiloId(
    input: {thresholdSettingPatch: {rfTempHigh:$inphighTemp, rfHumHigh:$inphighHum, moistureHigh: $inphighMoi, moistureLow: $inplowMoi}, siloId: $inpId}
  ) {
    clientMutationId
  }
}`;

const CustomerDetails = ({ id }) => {
  const [thresholds, setThresholds] = useState();
  const [customers, setCustomers] = useState();
  const matches = useMediaQuery("(max-width:600px)");

  // const [timeInterval, setTimeInterval] = useState("00:00");
  // const [rfOffInterval, setRfOffInterval] = useState("00:00");
  // console.log("timeInterval: ", timeInterval);
  // let splitTime = timeInterval.split(":");
  // let timeIntervalSecond = +splitTime[0] * 60 * 60 + +splitTime[1] * 60;

  // let splitTimeRfOff = rfOffInterval.split(":");
  // let splitTimeRfOffSecond =
  //   +splitTimeRfOff[0] * 60 * 60 + +splitTimeRfOff[1] * 60;

  // console.log("timeIntervalSecond: ", timeIntervalSecond);
  // function toHoursAndMinutes(totalSeconds) {
  //   const totalMinutes = Math.floor(totalSeconds / 60);

  //   const hours = Math.floor(totalMinutes / 60);
  //   const minutes = totalMinutes % 60;
  //   if (hours < 10 && minutes < 10) {
  //     return `0${hours}:0${minutes}`;
  //   } else if (hours < 10 && minutes > 10) {
  //     return `0${hours}:${minutes}`;
  //   } else if (hours > 10 && minutes < 10) {
  //     return `${hours}:${minutes}`;
  //   } else {
  //     return `${hours}:${minutes}`;
  //   }
  // }

  const [allCustomersResult, allCustomersResultAgain] = useQuery({
    query: allCustomer,
  });

  const {
    data: customerQuery,
    fetching: customefetchingQuery,
    error: customeerrorQuery,
  } = allCustomersResult;

  useEffect(() => {
    if (customerQuery) setCustomers(customerQuery.allCustomers.nodes);
    //  refresh();
  }, [customerQuery]);

  const [allthresholdSubscriptionResult, allthresholdSubscriptionResultAgain] =
    useSubscription({
      query: threshold,
      variables: {
        id,
      },
    });

  const {
    data: thresholddataQuery,
    fetching: thresholdfetchingQuery,
    error: thresholderrorQuery,
  } = allthresholdSubscriptionResult;

  useEffect(() => {
    if (thresholddataQuery)
      setThresholds(thresholddataQuery.allThresholdSettings.nodes);

    //  refresh();
  }, [thresholddataQuery]);

  // useEffect(() => {
  //   if (thresholds) {
  //     setTimeInterval(toHoursAndMinutes(thresholds[0].rfOnIntervalSec));
  //     setRfOffInterval(toHoursAndMinutes(thresholds[0].rfOffIntervalSec));
  //   }
  // }, [thresholddataQuery, thresholds]);

  const [updateThresholdSettingsRecord, updateThreshold] = useMutation(
    updateThresholdSettings
  );

  const updateThresholdRecord = useCallback((changedDetails) => {
    updateThreshold(changedDetails).then((result) => {
      if (result.error) {
        console.error("Oh no!", result.error);
        return false;
      } else {
        return true;
      }
    });
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    let updatedData = {
      inphighMoi: parseInt(document.getElementById("highMoisture").value),
      inplowMoi: parseInt(document.getElementById("lowMoisture").value),
      inphighTemp: parseInt(document.getElementById("highTemp").value),
      inphighHum: parseInt(document.getElementById("highHum").value),
      // inptimeInterval: parseInt(timeIntervalSecond),
      // inptimeIntervalOff: parseInt(splitTimeRfOffSecond),
      inpId: id,
    };
    updateThresholdRecord(updatedData);
  };

  return (
    <div className="TempContainer">
      <div className="TempHumCard" style={{ color: "black" }}>
        <CardTitle
          tag="h5"
          className="text-muted"
          style={{
            width: "100%",
            textAlign: "center",
            margin: "10px",
            color: "black",
            textDecorationColor: "black",
          }}
        >
          Customer Details
        </CardTitle>
        <form onSubmit={handleSubmit}>
          <CardBody style={{ width: "90%", padding: "0px" }}>
            <Row
              style={{
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
                marginBottom: "20px",
                marginTop: "25px",
              }}
            >
              <Col md="3" xs="4">
                <Label style={{ height: "20px", paddingLeft: "50%" }}>
                  Name
                </Label>
              </Col>
              <Col md="9" xs="6">
                <FormGroup>
                  <input
                    readOnly
                    style={{
                      outline: "none",
                      height: "30px",
                      width: "100%",
                      marginLeft: "-0px",
                      color: "white",
                      backgroundColor: "#4B4A54",
                      border: "1px solid gray",
                      borderRadius: "5px",
                      paddingLeft: "10px",
                    }}
                    type="text"
                    value={customers && customers[0].name}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row
              style={{
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Col md="3" xs="4">
                <Label style={{ height: "20px", paddingLeft: "50%" }}>
                  Place
                </Label>
              </Col>
              <Col md="9" xs="6">
                <FormGroup>
                  <input
                    readOnly
                    style={{
                      outline: "none",
                      height: "30px",
                      width: "100%",
                      marginLeft: "-0px",
                      color: "white",
                      backgroundColor: "#4B4A54",
                      border: "1px solid gray",
                      borderRadius: "5px",
                      paddingLeft: "10px",
                    }}
                    type="text"
                    value={customers && customers[0].location}
                  />
                </FormGroup>
              </Col>
            </Row>
          </CardBody>
          {/* <div style={{float: "right",paddingBottom: "5px",marginRight:"38px"}}>
         <button style={{border:"1px solid",borderRadius:"5px",cursor:"pointer",padding:"0px 20px",backgroundColor:"gray",color:"white"}} type='submit'>set</button>
        </div> */}
        </form>
      </div>
      {/* NOTE: Below card has to be uncommented style={{height:"245px",marginTop:"5px"}}*/}
      <div className="TempHumCard">
        <CardTitle
          tag="h5"
          style={{
            width: "100%",
            textAlign: "center",
            color: "black",
            paddingLeft: "3px",
            marginBottom: "30px",
            marginTop: "10px",
          }}
        >
          Roof Ventilation Settings
        </CardTitle>
        <form onSubmit={handleSubmit}>
          <CardBody
            style={{ width: "90%", padding: "0px", marginTop: "-15px" }}
          >
            <Row className="CardRow" style={{ marginBottom: "10px" }}>
              <Col md="7" xs="4">
                <Label
                  style={{ height: "20px", fontSize: matches ? "14px" : "" }}
                >
                  Max Temp(°C)
                </Label>
              </Col>
              <Col md="5" xs="6">
                <FormGroup>
                  <Input
                    style={{ color: "black", paddingLeft: "40%" }}
                    type="number"
                    defaultValue={thresholds && thresholds[0].rfTempHigh}
                    id="highTemp"
                    autoComplete="off"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row className="CardRow">
              <Col md="7" xs="4">
                <Label
                  style={{
                    height: "20px",
                    marginLeft: "-20px",
                    fontSize: matches ? "14px" : "",
                  }}
                >
                  Max Hum(RH)
                </Label>
              </Col>
              <Col md="5" xs="6">
                <FormGroup>
                  <Input
                    style={{ color: "black", paddingLeft: "40%" }}
                    type="number"
                    defaultValue={thresholds && thresholds[0].rfHumHigh}
                    id="highHum"
                    autoComplete="off"
                  />
                </FormGroup>
              </Col>
            </Row>
          </CardBody>
          <div
            style={{
              float: "right",
              paddingBottom: "5px",
              marginRight: "38px",
            }}
          >
            <Button
              style={{
                outline: 0,
                border: "none",
                // borderRadius: "5px",
                cursor: "pointer",
                padding: "0px 5px",
                // backgroundColor: "#2e7d32",
                color: "white",
                fontSize: "12px",
                fontWeight: "bold",
              }}
              variant="contained"
              type="submit"
            >
              set
            </Button>
          </div>
        </form>
      </div>
      <div className="TempHumCard">
        <CardTitle
          tag="h5"
          style={{
            width: "100%",
            textAlign: "center",
            color: "black",
            paddingLeft: "3px",
            marginBottom: "30px",
            marginTop: "10px",
          }}
        >
          Grains Moisture Settings
        </CardTitle>
        <form onSubmit={handleSubmit}>
          <CardBody
            style={{ width: "90%", padding: "0px", marginTop: "-15px" }}
          >
            <Row className="CardRow" style={{ marginBottom: "10px" }}>
              <Col md="7" xs="4">
                <Label
                  style={{ height: "20px", fontSize: matches ? "14px" : "" }}
                >
                  Min Moist(RH)
                </Label>
              </Col>
              <Col md="5" xs="6">
                <FormGroup>
                  <Input
                    style={{ color: "black", paddingLeft: "40%" }}
                    type="number"
                    defaultValue={thresholds && thresholds[0].moistureLow}
                    id="lowMoisture"
                    autoComplete="off"
                    min={0}
                    max={10}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row className="CardRow">
              <Col md="7" xs="4">
                <Label
                  style={{
                    height: "20px",
                    marginLeft: "-0px",
                    fontSize: matches ? "13px" : "",
                  }}
                >
                  Max Moist(RH)
                </Label>
              </Col>
              <Col md="5" xs="6">
                <FormGroup>
                  <Input
                    style={{ color: "black", paddingLeft: "40%" }}
                    type="number"
                    defaultValue={thresholds && thresholds[0].moistureHigh}
                    id="highMoisture"
                    autoComplete="off"
                    min={10}
                    max={20}
                  />
                </FormGroup>
              </Col>
            </Row>
          </CardBody>
          <div
            style={{
              float: "right",
              paddingBottom: "5px",
              marginRight: "38px",
            }}
          >
            <Button
              style={{
                outline: 0,
                border: "none",
                // borderRadius: "5px",
                cursor: "pointer",
                padding: "0px 5px",
                // backgroundColor: "#2e7d32",
                color: "white",
                fontSize: "12px",
                fontWeight: "bold",
              }}
              type="submit"
              variant="contained"
            >
              set
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerDetails;
