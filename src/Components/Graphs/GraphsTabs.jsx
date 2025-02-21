import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import  LineChart  from "./LineChart";
import  VerticalBarChart  from "./VerticalBarChart";
import  HorizontalBarChart  from "./HorizontalBarChart";
import BarChartSharpIcon from "@mui/icons-material/BarChartSharp";
import AccessTimeSharpIcon from "@mui/icons-material/AccessTimeSharp";

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

export default function GraphsTabs({ siloDetails,id }) {
    // console.log("siloDetails : ",siloDetails);
  const [value, setValue] = React.useState(0);

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
        >
          <Tab
            label="Vertical"
            icon={<BarChartSharpIcon />}
            iconPosition="start"
            {...a11yProps(0)}
          />
          <Tab
            label="Horizontal"
            icon={<BarChartSharpIcon style={{ transform: "rotate(90deg)" }} />}
            iconPosition="start"
            {...a11yProps(1)}
          />
          <Tab
            label="Historian"
            icon={<AccessTimeSharpIcon />}
            iconPosition="start"
            {...a11yProps(2)}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <VerticalBarChart siloDetails={siloDetails} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <HorizontalBarChart siloDetails={siloDetails} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <LineChart id={id} siloDetails={siloDetails} />
      </CustomTabPanel>
    </Box>
  );
}
