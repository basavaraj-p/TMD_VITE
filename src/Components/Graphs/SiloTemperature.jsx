import React, { useEffect } from "react";
import { Container } from "@mui/material";
import { Typography } from "@mui/material";
import {Paper} from "@mui/material";
import { useState } from "react";
import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";
import BloodtypeOutlinedIcon from "@mui/icons-material/BloodtypeOutlined";
import ThermostatOutlinedIcon from "@mui/icons-material/ThermostatOutlined";
import "./SiloTemp.css";
import { useQuery, useSubscription } from "urql";

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
      humValue
      tempValue
    }
  }
}`;


const SiloTemperature = ({ id }) => {
  const [weatherStations, setWeatherStations] = useState();
  const [anticondensation, setAnticondensation] = useState();

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

  const refresh = () => {
    // Refetch the query and skip the cache
    allHumidityResultAgain({ requestPolicy: "cache-and-network" });
  };

  return (
    <div>
      <Container
        component={Paper}
        elevation={4}
        style={{
          height: "300px",
          width: "800px",
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          backgroundColor: "#B3C99C",
        }}
      >
        <div className="temp__container">
          <div className="temp__header">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "18px",
              }}
            >
              AC & RH VALUE
            </div>
          </div>

          <div className="temp__items">
            <div className="temp" style={{ backgroundColor: "#F3FDE8" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "18px",
                }}
              >
                <CloudOutlinedIcon color="success" />
                <span style={{ paddingLeft: "2px" }}>Anti Condensation :</span>
              </div>
              <div className="temp__value">
                <span style={{ paddingRight: "0px" }}></span>
                {anticondensation &&
                  parseFloat(anticondensation[0].humValue).toFixed(2)}
                %
              </div>
            </div>
            <div className="temp">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "18px",
                }}
              >
                <BloodtypeOutlinedIcon color="success" />
                Relative Humidity <span style={{ paddingLeft: "14px" }}>:</span>
              </div>
              <div className="temp__value">
                <span style={{ paddingRight: "0px" }}></span>
                {weatherStations &&
                  parseFloat(weatherStations[0].humValue).toFixed(2)}
                %
              </div>
            </div>
          </div>
        </div>

        <div className="temp__container">
          <div className="temp__header">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "18px",
              }}
            >
              <span style={{ paddingLeft: "5px" }}>SILO TEMPERATURE</span>
            </div>
          </div>
          <div className="temp__items" style={{ height: "80px" }}>
            <div className="temp">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "18px",
                }}
              >
                <ThermostatOutlinedIcon color="error" />
                Top Temperature
              </div>
              <div className="temp__value">
                <span style={{ paddingRight: "10px" }}>:</span>{" "}
                {anticondensation &&
                  parseFloat(anticondensation[0].tempValue).toFixed(2)}
                °c
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SiloTemperature;
