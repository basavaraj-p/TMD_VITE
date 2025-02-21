import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/system";
import Box from "@mui/material/Box";
import ThreeDRotationIcon from "@mui/icons-material/ThreeDRotation";
import ViewInArSharpIcon from "@mui/icons-material/ViewInArSharp";

const Progress = () => {
  const StyledBox = styled(Box)({
    position: "relative",
  });

  const StyledIcon = styled(ViewInArSharpIcon)({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "#007a37",
  });

  return (
    <StyledBox
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "75vh",
      }}
    >
      <CircularProgress color="success" disableShrink />
      <StyledIcon />
    </StyledBox>
  );
};

export default Progress;
