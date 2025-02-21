import { Container,Grid } from "@mui/material";
import React from "react";
import CustomerDetails from "./CustomerDetails";
import TemperatureSettings from "./TemperatureSettings";
import SiloControls1 from "./SiloControls1";

const Settings = ({ id }) => {
  return (
    <>
      <div
        style={{
          margin: "15px",
          backgroundColor: "#B3C99C",
          paddingBottom: "25px",
          paddingTop: "25px",
          borderRadius:"5px",
          width:"100%"
        }}
      >
        <div style={{ margin: "auto", width: "auto" }}>
          <Container style={{ backgroundColor: "#B3C99C" }}>
            <Grid container spacing={3}>
              <Grid
                item
                style={{ display: "flex", justifyContent: "center" }}
                xs={12}
                md={4}
              >
                <CustomerDetails id={id} />
              </Grid>
              <Grid
                item
                style={{ display: "flex", justifyContent: "center" }}
                xs={12}
                md={4}
              >
                <TemperatureSettings id={id} />
              </Grid>
              <Grid
                item
                style={{ display: "flex", justifyContent: "center" }}
                xs={12}
                md={4}
              >
                <SiloControls1 id={id} />
              </Grid>
            </Grid>
          </Container>
        </div>
      </div>
    </>
  );
};

export default Settings;
