import React, { useEffect } from "react";
import { useState } from "react";
import { SiloStaticImage } from "./SiloStaticImage";
import SiloTemperature from "./SiloTemperature";
import { Grid } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { SiloTempRes } from "./SiloTempRes";
import GraphsTabs from "./GraphsTabs";

const Graphs = ({ id, siloDetails }) => {
  // console.log("siloDetails : ",siloDetails);
  const matches = useMediaQuery("(max-width:600px)");

  return (
    <div style={{ overflow: "hidden" }}>
      <Grid
        container
        spacing={4}
        style={{
          display: "flex",
          alignItems: "center",
          width: "100vw",
          flexDirection: matches ? "column" : "initial",
        }}
      >
        <Grid item style={{ display: "flex", justifyContent: "center" }}>
          <SiloStaticImage />
        </Grid>
        {matches ? (
          <SiloTempRes id={id} />
        ) : (
          <Grid item style={{ display: "flex", justifyContent: "center" }}>
            <SiloTemperature siloDetails={siloDetails} id={id} />
          </Grid>
        )}
      </Grid>

      <div style={{marginTop:"2%"}}>
        <GraphsTabs siloDetails={siloDetails} id={id} />
      </div>
    </div>
  );
};

export default Graphs;
