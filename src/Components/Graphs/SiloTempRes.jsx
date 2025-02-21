import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useQuery, useSubscription } from "urql";
import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";
import BloodtypeOutlinedIcon from "@mui/icons-material/BloodtypeOutlined";
import ThermostatOutlinedIcon from "@mui/icons-material/ThermostatOutlined";

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

export const SiloTempRes = ({ id }) => {
  const [weatherStations, setWeatherStations] = useState();
  const [anticondensation, setAnticondensation] = useState();

  const iconStyle = {
    verticalAlign: "middle",
    marginBottom: "4px", // Adjust this value based on your specific needs
  };

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
    <div
      style={{
        height: "auto",
        width: "auto",
        // backgroundColor: "purple",
        background:"linear-gradient(315deg, #f3f4f7 0%, #caccd1 74%)",
        border: "solid",
        borderRadius: "2px",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        margin: "5%",
        marginLeft: "7%",
      }}
    >
      <div style={{ color: "black", fontWeight: "bold" }}>
        <CloudOutlinedIcon
          color="success"
          style={{
            verticalAlign: "middle",
            marginBottom: "4px",
            marginRight: "4px",
          }}
        />
        Anti Condensation :{" "}
        {anticondensation &&
          parseFloat(anticondensation[0].humValue).toFixed(2)}
        %
      </div>
      <div style={{ color: "black", fontWeight: "bold" }}>
        <BloodtypeOutlinedIcon color="success" style={iconStyle} />
        Relative Humidity :{" "}
        {weatherStations && parseFloat(weatherStations[0].humValue).toFixed(2)}%
      </div>
      <div style={{ color: "black", fontWeight: "bold" }}>
        <ThermostatOutlinedIcon color="error" style={iconStyle} />
        Top Temperature :{" "}
        {anticondensation &&
          parseFloat(anticondensation[0].tempValue).toFixed(2)}
        °c
      </div>
    </div>
  );
};
