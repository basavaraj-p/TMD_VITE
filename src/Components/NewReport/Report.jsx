import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Button,
} from "@mui/material";
import GrainDetailsStatCard from "./GrainDetailsStatCard";
import AlertsDetailsStatCard from "./AlertsDetailsStatCard";
import DateSelectionCard from "./DateSelectionCard";
import ReportStats from "./ReportStats";
import { useQuery, useMutation, useSubscription } from "urql";
import { useState, useEffect, useRef } from "react";
import moment from "moment";

const parameterSubscription = `subscription($id:Int!)  {
  allGraindetails(condition: {siloId: $id}) {
    nodes {
      veriety
      siloId
      grains
      density
      comment
      angleOfRepose
    }
  }
}`;

const threshold = `subscription($id:Int!)  {
  allThresholdSettings(condition: {siloId: $id}) {
    nodes {
      humHigh
      humLow
      siloId
      tempHigh
      tempLow
      moistureLow
      moistureHigh
    }
  }
}`;

const Report = ({ id, reportTemp, reportHum }) => {
  const reportRef = useRef(); // Create a ref for the report card
  const [thresholds, setThresholds] = useState();
  const [parameters, setParameters] = useState();
  //   console.log("thresholds : ", thresholds);
  //   console.log("parameters : ", parameters);
  const [selectedDate, setSelectedDate] = useState(moment());
    // console.log("selectedDate : ", selectedDate);
  const nextDay = moment(selectedDate).add(1, "days").format("YYYY-MM-DD");
    // console.log("nextDayValue : ", nextDay);
  const [dateArray, setDateArray] = useState("");
  // console.log("dateArray : ", dateArray);
  const [time, setTime] = useState();
  console.log("time : ", time);
  const [status, setStatus] = useState(false);
  // console.log("status : ", status);

  const [allthresholdSubscriptionResult, allthresholdSubscriptionResultAgain] =
    useSubscription({
      query: threshold,
      variables: {
        id,
      },
    });

  const [allparameterSubscriptionResult, allparameterSubscriptionResultAgain] =
    useSubscription({
      query: parameterSubscription,
      variables: {
        id,
      },
    });

  const {
    data: thresholddataQuery,
    fetching: thresholdfetchingQuery,
    error: thresholderrorQuery,
  } = allthresholdSubscriptionResult;

  const {
    data: dataQuery,
    fetching: fetchingQuery,
    error: errorQuery,
  } = allparameterSubscriptionResult;

  useEffect(() => {
    if (thresholddataQuery) {
      setThresholds(thresholddataQuery.allThresholdSettings.nodes);
    }
  }, [thresholddataQuery]);

  useEffect(() => {
    if (dataQuery) setParameters(dataQuery.allGraindetails.nodes);
  }, [dataQuery]);

  const isWithin10MinutesOfMidnight = (uniqueDates) => {
    const now = moment();
    const startOfDay = moment().startOf("day");
    const endOfDay = moment().endOf("day");

    const minutesSinceStartOfDay = now.diff(startOfDay, "minutes");
    const minutesUntilEndOfDay = endOfDay.diff(now, "minutes");

    console.table({ minutesSinceStartOfDay, minutesUntilEndOfDay });

    if (minutesSinceStartOfDay <= 10) {
      setTime(uniqueDates[0]);
      return true;
    } else if (minutesUntilEndOfDay <= 10) {
      setTime(uniqueDates[uniqueDates.length - 1]);
      return true;
    } else {
      setTime(uniqueDates[0]);
      return false;
    }
    // return minutesSinceStartOfDay <= 10 || minutesUntilEndOfDay <= 10;
  };

  // const date_result = isWithin10MinutesOfMidnight()
  // console.log("date_result : ", date_result);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5090/probe-history?startDate=${moment(
            selectedDate
          ).format("YYYY-MM-DD")}&endDate=${nextDay}`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const result = await response.json();
        console.log("result : ", result);
        let uniqueDates = Array.from(
          new Set(result.map((item) => moment(item.updatetime).format("HH:mm")))
        );

        // Sort uniqueDates in ascending order
        uniqueDates = uniqueDates.sort((a, b) => a.localeCompare(b));

        setDateArray(uniqueDates);
        // setTime(uniqueDates[0]);
        // setStatus(isWithin10MinutesOfMidnight(uniqueDates));
      } catch (error) {
        // setError(error);
        console.error("error : ", error);
      } finally {
        // setLoading(false);
      }
    };
    fetchData();
    // Set up interval to fetch data every 5 minutes
    const intervalId = setInterval(fetchData, 5 * 60 * 1000);

    // Clean up interval on component unmount or dependency change
    return () => clearInterval(intervalId);
  }, [selectedDate, nextDay]);

  return (
    <Card
      sx={{ width: "100%", height: "100%", backgroundColor: "#b3c99c" }}
      ref={reportRef}
    >
      <CardHeader />
      <Typography
        variant="h4"
        color="black"
        fontWeight={"bold"}
        display={"flex"}
        justifyContent={"center"}
      >
        Report for SILO {id} on {moment(selectedDate).format("YYYY-MM-DD")} at
        time {time}
      </Typography>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <GrainDetailsStatCard parameters={parameters} />
        <AlertsDetailsStatCard thresholds={thresholds} />
        <DateSelectionCard
          setSelectedDate={setSelectedDate}
          selectedDate={selectedDate}
          dateArray={dateArray}
          setTime={setTime}
          time={time}
          reportRef={reportRef}
          id={id}
          status={status}
        />
      </div>
      <CardContent>
        <ReportStats
          id={id}
          selectedDate={selectedDate}
          dateArray={dateArray}
          time={time}
          nextDay={nextDay}
          reportTemp={reportTemp}
          reportHum={reportHum}
        />
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
        {/* <Button variant="contained" size="small">
          Download
        </Button> */}
      </CardActions>
    </Card>
  );
};

export default Report;
