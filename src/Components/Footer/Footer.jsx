// Footer.js
import React from "react";
import Typography from "@mui/material/Typography";
import Logo from "/src/assets/ourlogo.png";
import { styled } from "@mui/system";
import { useTheme } from "@mui/material/styles";

const StyledFooter = styled("div")(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  right: 0,
  display: "flex",
  alignItems: "center",
  fontFamily: "inherit",
  overflowX: "hidden",

  // Media query for screens smaller than md
  [theme.breakpoints.down("sm")]: {
    right: 0,
    bottom: 0,
    flexDirection: "column",
    alignItems: "flex-end",
  },
}));

function Footer() {
  useTheme();

  return (
    <StyledFooter>
      <Typography variant="body2">
        Developed By
        <img
          style={{ height: "7%", width: "7%", verticalAlign: "middle" }}
          src={Logo}
          alt="logo"
        />
        <span style={{ color: "black" }}>
          SENSEOPS Tech Solutions Pvt. Ltd. &copy;
        </span>
        <span style={{ color: "black" }}>{new Date().getFullYear()}</span>
      </Typography>
    </StyledFooter>
  );
}

export default Footer;
