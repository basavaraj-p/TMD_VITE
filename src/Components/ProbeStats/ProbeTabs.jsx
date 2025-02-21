import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TemperatureStats from "./TemperatureStats";
import HumidityStats from "./HumidityStats";
import FanStats from "./FanStats";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import WindPowerSharpIcon from "@mui/icons-material/WindPowerSharp";
import { useMediaQuery } from "@mui/material";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function ProbeTabs({ siloDetails, id }) {
  // console.log("siloDetails : ",siloDetails);
  const [value, setValue] = React.useState(0);
    const matches = useMediaQuery("(max-width:600px)");


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          variant={matches ? "standard" : "fullWidth"}
        >
          <Tab
            label="Temperature (°C)"
            icon={<DeviceThermostatIcon />}
            iconPosition="start"
            {...a11yProps(0)}
          />
          <Tab
            label="Humidity (RH)"
            icon={<WaterDropIcon />}
            iconPosition="start"
            {...a11yProps(1)}
          />
          {/* <Tab
            label="Fan History"
            icon={<WindPowerSharpIcon />}
            iconPosition="start"
            {...a11yProps(2)}
          /> */}
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <TemperatureStats siloDetails={siloDetails} id={id} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <HumidityStats id={id} />
      </CustomTabPanel>
      {/* <CustomTabPanel value={value} index={2}>
        <FanStats id={id} />
      </CustomTabPanel> */}
    </Box>
  );
}
