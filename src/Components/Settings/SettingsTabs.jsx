import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Settings from "./Settings";
import MachineData from "./MachineData";
import CandlestickChartSharpIcon from "@mui/icons-material/CandlestickChartSharp";
import PrecisionManufacturingSharpIcon from "@mui/icons-material/PrecisionManufacturingSharp";
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

export default function SettingsTabs({ siloDetails, id }) {
//   console.log("siloDetails : ", siloDetails);
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
            label="Silo Configuration"
            icon={<CandlestickChartSharpIcon />}
            iconPosition="start"
            {...a11yProps(0)}
          />
          <Tab
            label="Silo System"
            icon={<PrecisionManufacturingSharpIcon />}
            iconPosition="start"
            {...a11yProps(1)}
          />
        </Tabs>
        
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Settings id={id} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <MachineData id={id} />
      </CustomTabPanel>
    </Box>
  );
}
