import React, { useState } from "react";
import { Card, Typography } from "@mui/material";
import HeatMap from "./HeatMap";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SiloContainer = ({ silo }) => {
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();

  const handleHover = () => {
    setHover(true);
  };

  const handleMouseLeave = () => {
    setHover(false);
  };

  const handleDetails = () => {
    navigate(`/silo/${silo.id}/details`);
  }

  return (
    <div style={{ width: "96%", margin: "5% 2%" }}>
      <div
        className="flexDiv"
        style={{
          background: "linear-gradient(to right, #65ba69, #65ba69)",
          height: "100%",
          border: "solid",
          //   transform: hover ? scale(1) : scale(0.5),
          borderColor: "#007a37",
          borderWidth: "1.5px",
          borderRadius: "2%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" style={{ color: "white", fontWeight: "1%" }}>
          {silo.name}
        </Typography>
        <div
          onMouseEnter={handleHover}
          onMouseLeave={handleMouseLeave}
          style={{
            // background: "linear-gradient(315deg, #fefefe 0%, #00a4e4 74%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "95%",
            // border: "solid",
            // transform: hover ? "scale(0.99)" : "scale(1)",
            borderRadius: "2%",
            borderWidth: "1.5px",
            borderColor: "blue",
          }}
        >
          <HeatMap id={silo.id} />
        </div>
        <div style={{ width: "100%", padding: "0.5% 0" }}>
          {/* <hr style={{ width: "100%", borderColor: "#000" }} /> */}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end", // this will push the button to the far right
            width: "95%", // ensure the container takes the full width
            marginBottom: "2%",
          }}
        >
          <Button
            onClick={handleDetails}
            variant="contained"
            style={{
              textTransform: "none",
              // background: "linear-gradient(315deg, #fefefe 0%, #00a4e4 74%)",
              //   boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)", // optional for some shadow effect
              // transform: hover ? "scale(0.99)" : "scale(1)",
              fontWeight: "bold",
              color: "white", // If you want the text color to be white against the gradient background
            }}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SiloContainer;
