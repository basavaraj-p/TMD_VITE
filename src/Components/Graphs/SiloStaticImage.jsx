import React from "react";
import { Container } from "@mui/material";
import { Typography } from "@mui/material";
import SiloTopImage from "/src/assets/silo.PNG";
import {useMediaQuery} from "@mui/material";

export const SiloStaticImage = () => {
  const matches = useMediaQuery("(max-width:600px)");

  return (
    <Container
      elevation={4}
      style={{
        height: "400px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#F3FDE8",
        marginTop: matches ? "10%" : "-1rem",
      }}
    >
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        style={{
          color: "#6d6d6d",
          padding: "2px 0",
          width: "256.5px",
          margin: "5px 0 15px 0",
          fontSize: "28px",
          fontWeight: "750",
        }}
      >
        PROBES LAYOUT
      </Typography>
      <img
        src={SiloTopImage}
        height="85%"
        width="100%"
        style={{ objectFit: "contain", marginTop: "-5px" }}
      />
    </Container>
  );
};
