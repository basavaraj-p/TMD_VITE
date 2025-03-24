import React from "react";
import TempTableComponent from "./TempTableComponent";
import { Typography } from "@mui/material";
import HumTableComponent from "./HumTableComponent";
import { useQuery, useMutation, useSubscription } from "urql";
import { useState, useEffect } from "react";
import moment from "moment";

const ReportStats = ({
  id,
  time,
  dateArray,
  selectedDate,
  nextDay,
  reportTemp,
  reportHum,
}) => {
  const [humidity, setHumidity] = useState([]);
  console.log("humidity : ", humidity);
  const [allProbes, setAllProbes] = useState([]);
  console.log("allProbes: ", allProbes);
  const [filtteredProbes, setFiltteredProbes] = useState([]);
  const [filtteredHumidity, setFiltteredHumidity] = useState([]);
  // console.log("filtteredProbes : ", filtteredProbes);
  // console.log("filtteredHumidity : ", filtteredHumidity);
  const [averageProbeValues, setAverageProbeValues] = useState([]);
  const [averageHumidityValues, setAverageHumidityValues] = useState([]);
  // console.log("averageProbeValues : ", averageProbeValues);
  // console.log("averageHumidityValues : ", averageHumidityValues);

  useEffect(() => {
    const fetchData1 = async () => {
      try {
        const response = await fetch(
          `https://tmd-report-rest.onrender.com/probe-history-id?startDate=${moment(
            selectedDate
          ).format("YYYY-MM-DD")}&endDate=${nextDay}&id=${id}`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const result = await response.json();
        // console.log("result : ", result);
        setAllProbes(result);
      } catch (error) {
        // setError(error);
        console.error("error : ", error);
      } finally {
        // setLoading(false);
      }
    };

    const fetchData2 = async () => {
      try {
        const response = await fetch(
          `https://tmd-report-rest.onrender.com/humidity-history-id?startDate=${moment(
            selectedDate
          ).format("YYYY-MM-DD")}&endDate=${nextDay}&id=${id}`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const result = await response.json();
        // console.log("result : ", result);
        setHumidity(result);
      } catch (error) {
        // setError(error);
        console.error("error : ", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchData1();
    fetchData2();
  }, [selectedDate, nextDay, id, time]);

  function filterByTime(probeData, time) {
    // Parse the provided hours and minutes using moment
    const targetTime = moment(time, "HH:mm");
    const targetHour = targetTime.hours();
    const targetMinute = targetTime.minutes();

    return probeData.filter((item) => {
      const itemTime = moment(item.updatetime);
      return (
        itemTime.hours() === targetHour && itemTime.minutes() === targetMinute
      );
    });
  }
  console.log(
    "DATAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    filterByTime(allProbes, time)
  );

  function calculateAveragesForHum(data) {
    const sensorData = data.reduce(
      (acc, { sensorId, tempValue, relHumidity }) => {
        if (!acc[sensorId]) {
          acc[sensorId] = { tempSum: 0, humiditySum: 0, count: 0 };
        }
        acc[sensorId].tempSum += tempValue;
        acc[sensorId].humiditySum += Number(relHumidity);
        acc[sensorId].count += 1;
        return acc;
      },
      {}
    );

    return Object.entries(sensorData).map(
      ([sensorId, { tempSum, humiditySum, count }]) => ({
        probeId: "1",
        sensorId: parseInt(sensorId, 10),
        tempValue: tempSum / count,
        relHumidity: humiditySum / count,
      })
    );
  }

  const calculateAveragesForTemp = (probes) => {
    const map = new Map();

    probes.forEach(({ probeId, sensorId, value }) => {
      const key = `${probeId}-${sensorId}`;
      const numericValue = Number(value);

      if (!map.has(key)) {
        map.set(key, { sum: 0, count: 0 });
      }

      const entry = map.get(key);
      entry.sum += numericValue;
      entry.count += 1;
    });

    return Array.from(map.entries()).map(([key, { sum, count }]) => {
      const [probeId, sensorId] = key.split("-");
      return {
        probeId,
        sensorId: parseInt(sensorId, 10),
        value: sum / count,
      };
    });
  };

  const isWithinTenMinutes = (timeString) => {
    // Parse the input time string
    const inputTime = moment(timeString, "HH:mm");

    // Get the current time
    const currentTime = moment();

    // Calculate the difference in minutes
    const difference = Math.abs(currentTime.diff(inputTime, "minutes"));

    // Check if the difference is less than 10 minutes
    return difference < 9;
  };

  const isWithinTenMinutesResult = isWithinTenMinutes(time);
  console.log("isWithinTenMinutesResult : ", isWithinTenMinutesResult);

  useEffect(() => {
    if (allProbes.length !== 0 && time !== undefined) {
      setFiltteredProbes(filterByTime(allProbes, time));
      setFiltteredHumidity(reportHum);
      // setFiltteredHumidity(filterByTime(humidity, time));
      setAverageProbeValues(calculateAveragesForTemp(allProbes));
      setAverageHumidityValues(calculateAveragesForHum(humidity));
    }
  }, [humidity, allProbes, time]);

  return (
    <div>
      <Typography variant="h6" color={"black"} fontWeight={"bold"}>
        TEMPERATURE STATS
      </Typography>
      {isWithinTenMinutesResult === true ? (
        <TempTableComponent
          filtteredProbes={reportTemp}
          testValue="Current Temperature Data"
        />
      ) : filtteredProbes.length !== 0 ? (
        <TempTableComponent
          filtteredProbes={filtteredProbes}
          testValue="Actual Report History for Temp"
        />
      ) : (
        <TempTableComponent
          filtteredProbes={averageProbeValues}
          testValue="Average Report History for Temp"
        />
      )}
      <Typography variant="h6" color={"black"} fontWeight={"bold"}>
        HUMIDITY STATS
      </Typography>
      {isWithinTenMinutesResult === true ? (
        <HumTableComponent
          filtteredHumidity={reportHum}
          testValue="Current Humidity Data"
        />
      ) : filtteredHumidity.length !== 0 ? (
        <HumTableComponent
          filtteredHumidity={filtteredHumidity}
          testValue="Actual Report History for Hum"
        />
      ) : (
        <HumTableComponent
          filtteredHumidity={averageHumidityValues}
          testValue="Average Report History for Hum"
        />
      )}
    </div>
  );
};

export default ReportStats;
