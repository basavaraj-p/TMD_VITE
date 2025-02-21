import { Button } from "@mui/material";
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
  ButtonGroup,
} from "reactstrap";
import "./TemperatureSettings.css";
import { useQuery, useMutation, useSubscription } from "urql";
import { useMediaQuery } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const threshold = `subscription($id:Int!)  {
  allThresholdSettings(condition: {siloId: $id}) {
    nodes {
      humHigh
      humLow
      siloId
      tempHigh
      tempLow
    }
  }
}`;

const updateThresholdSettings = `mutation updateThresholdSettingsRecById($inpId:Int!,$inphightem:Int!, $inplowtemp:Int!, $inphighhum:Int!, $inplowhum:Int!) {
  updateThresholdSettingBySiloId(
    input: {thresholdSettingPatch: {humHigh: $inphighhum, humLow: $inplowhum, tempHigh: $inphightem, tempLow: $inplowtemp}, siloId: $inpId}
  ) {
    clientMutationId
  }
}`;

const TemperatureSettings = ({ id }) => {
  // console.log("id : ", id);
  const [thresholds, setThresholds] = useState();
  // console.log("thresholds : ", thresholds);
  const [schedule, setSchedule] = useState([]);
  // console.log("schedule : ", schedule);
  const matches = useMediaQuery("(max-width:600px)");
  const [newTime, setNewTime] = useState("");
  // console.log("newTime : ", newTime);
  // const sid = String(id);

  // const [timeInterval, setTimeInterval] = useState("1:59 ");
  // const [afOffInterval, setAfOffInterval] = useState("00:00");
  // // console.log("timeInterval: ", timeInterval);
  // let splitTime = timeInterval.split(":");
  // let timeIntervalSecond = +splitTime[0] * 60 * 60 + +splitTime[1] * 60;

  // let splitTimeAfOff = afOffInterval.split(":");
  // let splitTimeAfOffSecond =
  //   +splitTimeAfOff[0] * 60 * 60 + +splitTimeAfOff[1] * 60;

  // // console.log("timeIntervalSecond: ", timeIntervalSecond);
  // function toHoursAndMinutes(totalSeconds) {
  //   const totalMinutes = Math.floor(totalSeconds / 60);

  //   const seconds = totalSeconds % 60;
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

  const [updateThresholdSettingsRecord, updateThreshold] = useMutation(
    updateThresholdSettings
  );
  // const [result, executeMutation] = useMutation(updateSchedulerSettings);

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
  //     setTimeInterval(toHoursAndMinutes(thresholds[0].afOnIntervalSec));
  //     setAfOffInterval(toHoursAndMinutes(thresholds[0].afOffIntervalSec));
  //   }
  // }, [thresholddataQuery, thresholds]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3050/api/scheduler/${id}`
        );
        setSchedule(response.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [id]);

  // const schedule = schedule?.sort((a, b) => {
  //   // Compare the date objects
  //   return a.id - b.id;
  // });


  const handleSubmit = (e) => {
    e.preventDefault();
    let updatedData = {
      inphightem: parseInt(document.getElementById("hightemp").value),
      inplowtemp: parseInt(document.getElementById("lowtemp").value),
      inphighhum: parseInt(document.getElementById("highhum").value),
      inplowhum: parseInt(document.getElementById("lowhum").value),
      // inptimeInterval: parseInt(timeIntervalSecond),
      // inptimeIntervalOff: parseInt(splitTimeAfOffSecond),
      inpId: id,
    };
    updateThresholdRecord(updatedData);
  };

  const handleScan = async (event) => {
    event.preventDefault();

    // Convert the entered time to minutes
    const newTimeSplit = newTime.split(":");
    const newTimeMinutes = +newTimeSplit[0] * 60 + +newTimeSplit[1];

    // Check if there is at least 1-hour difference
    const isTimeValid = schedule.every((scheduleItem) => {
      // Convert schedule time to minutes
      const scheduleTimeSplit = scheduleItem.time.split(":");
      const scheduleTimeMinutes =
        +scheduleTimeSplit[0] * 60 + +scheduleTimeSplit[1];

      // Check if the absolute difference is at least 60 minutes
      return Math.abs(newTimeMinutes - scheduleTimeMinutes) >= 60;
    });

    const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    if (timeRegex.test(newTime) || newTime === "") {
      if (isTimeValid) {
        try {
          // Make a POST request to add a new time to the database
          const response = await axios.put(
            "http://localhost:3050/api/scheduler",
            {
              siloid: id,
              time: newTime,
            }
          );

          // Update the displayed schedule by fetching the latest data
          fetchData();
        } catch (error) {
          console.error("Error adding new time", error);
        }
      } else {
        // Display an error or alert to the user indicating the invalid time
        alert(
          "Please enter a time with at least 1-hour difference from existing schedule times."
        );
      }
    } else {
      alert("Please enter the time in the (hh:mm) format");
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3050/api/scheduler/${id}`
      );
      setSchedule(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handleDelete = async (id, timeDetails) => {
    console.log("silo_id : ", timeDetails?.silo_id);
    console.log("time : ", timeDetails?.time);
    try {
      // Make a POST request to add a new time to the database
      const response = await axios.put(
        "http://localhost:3050/api/scheduler/delete",
        {
          siloid: timeDetails?.silo_id,
          time: timeDetails?.time,
        }
      );

      // Update the displayed schedule by fetching the latest data
      fetchData();
    } catch (error) {
      console.error("Error adding new time", error);
    }
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="TempContainer">
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
          Aeration Fan Settings
        </CardTitle>
        <form onSubmit={handleSubmit}>
          <CardBody
            style={{
              width: "90%",
              padding: "0px",
              marginTop: "-15px",
              zIndex: "1",
            }}
          >
            <Row className="CardRow" style={{ marginBottom: "10px" }}>
              <Col md="7" xs="4">
                <Label
                  style={{ height: "20px", fontSize: matches ? "14px" : "" }}
                >
                  Min Temp(°C)
                </Label>
              </Col>
              <Col md="5" xs="6">
                <FormGroup style={{ zIndex: "1" }}>
                  <Input
                    style={{ color: "black", paddingLeft: "40%" }}
                    type="number"
                    defaultValue={thresholds && thresholds[0].tempLow}
                    id="lowtemp"
                    autoComplete="off"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row className="CardRow">
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
                    defaultValue={thresholds && thresholds[0].tempHigh}
                    id="hightemp"
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
      {/*  style={{height:"245px",marginTop:"5px"}} */}
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
          Aeration Fan Settings
        </CardTitle>
        <form onSubmit={handleSubmit}>
          <CardBody
            style={{ width: "90%", padding: "0px", marginTop: "-15px" }}
          >
            <Row className="CardRow" style={{ marginBottom: "10px" }}>
              <Col md="7" xs="4">
                <Label
                  style={{
                    height: "20px",
                    marginLeft: "-18px",
                    fontSize: matches ? "14px" : "",
                  }}
                >
                  Min Hum(RH)
                </Label>
              </Col>
              <Col md="5" xs="6">
                <FormGroup>
                  <Input
                    style={{ color: "black", paddingLeft: "40%" }}
                    type="number"
                    defaultValue={thresholds && thresholds[0].humLow}
                    id="lowhum"
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
                    marginLeft: "-12px",
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
                    defaultValue={thresholds && thresholds[0].humHigh}
                    id="highhum"
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
      {/* <div className="TempHumCard">
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
          Scan Scheduler
        </CardTitle>
        <form onSubmit={handleScan}>
          <CardBody
            style={{ width: "90%", padding: "0px", marginTop: "-15px" }}
          >
            <Row className="CardRow" style={{ marginBottom: "10px" }}>
              <Col md="7" xs="4">
                <Label
                  style={{
                    height: "20px",
                    marginLeft: "-18px",
                    fontSize: matches ? "14px" : "",
                  }}
                >
                  Time(hh:mm)
                </Label>
              </Col>
              <Col md="5" xs="6">
                <FormGroup>
                  <Input
                    style={{ color: "black", paddingLeft: "40%" }}
                    type="text"
                    defaultValue={schedule[0]?.time}
                    autoComplete="off"
                    onChange={(e) => setNewTime(e.target.value)}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row className="CardRow">
              <Col md="7" xs="4">
                <Label
                  style={{
                    height: "20px",
                    marginLeft: "-12px",
                    fontSize: matches ? "14px" : "",
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={handleClick}
                    size="small"
                  >
                    View Schedule
                  </Button>
                </Label>
              </Col>
              <Col md="5" xs="6">
                <FormGroup>
                  <Button
                    style={{ marginTop: "15px" }}
                    size="small"
                    type="submit"
                    variant="contained"
                  >
                    SET
                  </Button>

                  <Menu
                    id="scheduled-times-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    color="#f3fde8"
                  >
                    {schedule?.map((scheduleItem, index) => (
                      <MenuItem
                        key={index}
                        style={{ backgroundColor: "#f3fde8", color: "black" }}
                      >
                        {scheduleItem.time}

                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDelete(index, scheduleItem)}
                          style={{ color: "#ff0000" }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </MenuItem>
                    ))}
                  </Menu>
                </FormGroup>
              </Col>
            </Row>
          </CardBody>
        </form>
      </div> */}
    </div>
  );
};

export default TemperatureSettings;
