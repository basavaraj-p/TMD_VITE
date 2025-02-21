import React from "react";
import fwtImage from "/src/assets/image001.png";
import logo from "/src/assets/FWTLogo.jpg";
import { useMediaQuery } from "@mui/material";
import { Button } from "@mui/material";

export const Help = () => {
  const matches = useMediaQuery("(max-width:600px)");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column", // Stack children vertically
        justifyContent: "center",
        alignItems: "center",
        height: "50vh", // Make the container fill the viewport height
        width: "70vw",
        margin: matches ? "auto" : "auto",
        marginTop:matches ? "10%" : "-0.2%",
        backgroundColor: "#dddddd",
        border: "solid",
        borderWidth: "1.5px",
        borderRadius: "3px",
        borderColor: "#007a37",
        // marginRight:"auto"
      }}
    >
      {/* {matches ? null : ( */}
        <img
          src={matches ? logo : fwtImage}
          alt="FWT"
          style={{
            height: matches ? "50%" : "50%",
            width: matches ? "50%" : "70%",
            marginBottom: "10px",
          }}
        />
      {/* )} */}
      <span style={{ textAlign: "center", marginBottom: "10px" }}>
        In case of any service related issues, please contact Fowler Westrup
        Service Department on this
      </span>
      <span>Whatsapp Number : +91 7760564751</span>
      <Button
        variant="contained"
        style={{
          margin: "2%",
          textTransform: "none",
          // background: "linear-gradient(315deg, #17f9f2 0%, #b0f9a9 74%)",
          //   boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)", // optional for some shadow effect
          // transform: hover ? "scale(0.99)" : "scale(1)",
          fontWeight: "bold",
          color: "white", // If you want the text color to be white against the gradient background
        }}
      >
        <a
          href="https://www.fowlerwestrup.com/"
          target="blank"
          style={{ textDecoration: "none", color: "white" }}
        >
          Know More 
        </a>
      </Button>
    </div>
  );
};

// background-color: #17f9f2;
// background-image: linear-gradient(315deg, #17f9f2 0%, #b0f9a9 74%);
