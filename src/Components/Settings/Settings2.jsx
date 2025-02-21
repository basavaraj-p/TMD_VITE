import React from "react";
import SettingsTabs from "./SettingsTabs";
import { useMediaQuery } from "@mui/material";

const Settings2 = ({ id, siloDetails }) => {
  const matches = useMediaQuery("(max-width:600px)");

  return (
    <div style={{ marginTop: matches ? "20px" : "-30px" }}>
      <SettingsTabs siloDetails={siloDetails} id={id} />
    </div>
  );
};

export default Settings2;
