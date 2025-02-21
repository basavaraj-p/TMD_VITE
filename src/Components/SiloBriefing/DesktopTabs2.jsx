import React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Icons
import TimelineIcon from "@mui/icons-material/Timeline";
import TableChartIcon from "@mui/icons-material/TableChart";
import SettingsInputComponentSharpIcon from "@mui/icons-material/SettingsInputComponentSharp";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import ArticleSharpIcon from "@mui/icons-material/ArticleSharp";
import InfoSharpIcon from "@mui/icons-material/InfoSharp";
import HelpOutlineSharpIcon from "@mui/icons-material/HelpOutlineSharp";
import ViewInArSharpIcon from "@mui/icons-material/ViewInArSharp";

// Components
import Graphs from "../Graphs/Graphs";
import ProbeStats from "../ProbeStats/ProbeStats";
import Parameters from "../Parameters/Parameters";
import Parameters2 from "../Parameters/Parameters2";
import CalendarComponent from "../Calendar/Calendar";
import Settings from "../Settings/Settings";
import Settings2 from "../Settings/Settings2";
// import Report from "../Report/Report";
import Report from "../NewReport/Report";
import { Info } from "../Info/Info";
import { Help } from "../Help/Help";
import Index3D from "../3DScanner/index3D";
import Footer from "../Footer/Footer";

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
          <Typography component="div">{children}</Typography>
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

const DesktopTabs2 = ({ id, siloDetails,reportTemp, reportHum }) => {
  // console.log(siloDetails);
  const theme = createTheme({
    components: {
      //   MuiTabs: {
      //     styleOverrides: {
      //       indicator: {
      //         backgroundColor: "skyblue", // Change to the color you want
      //       },
      //     },
      //   },
      MuiTab: {
        styleOverrides: {
          root: {
            fontWeight: "bold",
            color: "green", // Change to the color you want
          },
        },
      },
    },
  });

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // console.log("id : ",id)
  //   const siloId = Number(id);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          position: "sticky", // Make the tabs container sticky
          top: 0, // Stick to the top of the viewport
          // zIndex: 100, // Adjust z-index as needed
          // backgroundColor: "#fff", // Specify background color if needed
          // borderBottom: "1px solid #ccc", // Optional border
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            //   textColor="primary"
            indicatorColor="primary"
            variant={"fullWidth"}
            //   scrollButtons={true}
          >
            <Tab
              label="Graphs"
              icon={<TimelineIcon />}
              // iconPosition="start"
              {...a11yProps(0)}
            />
            {/* <Tab
              label="3D Scanner"
              icon={<ViewInArSharpIcon />}
              // iconPosition="start"
              {...a11yProps(1)}
            /> */}
            <Tab
              label="Probes Stats"
              icon={<TableChartIcon />}
              // iconPosition="start"
              {...a11yProps(1)}
            />
            <Tab
              label="Parameters"
              icon={<SettingsInputComponentSharpIcon />}
              // iconPosition="start"
              {...a11yProps(2)}
            />
            <Tab
              label="Calendar"
              icon={<CalendarMonthOutlinedIcon />}
              // iconPosition="start"
              {...a11yProps(3)}
            />
            <Tab
              label="Settings"
              icon={<SettingsIcon />}
              // iconPosition="start"
              {...a11yProps(4)}
            />
            <Tab
              label="Report"
              icon={<ArticleSharpIcon />}
              // iconPosition="start"
              {...a11yProps(5)}
            />
            <Tab
              label="Info"
              icon={<InfoSharpIcon />}
              // iconPosition="start"
              {...a11yProps(6)}
            />
            <Tab
              label="Help"
              icon={<HelpOutlineSharpIcon />}
              // iconPosition="start"
              {...a11yProps(7)}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Graphs id={id} siloDetails={siloDetails} />
          <Footer />
        </CustomTabPanel>
        {/* <CustomTabPanel value={value} index={1}>
          <Index3D id={id} />
          <Footer />
        </CustomTabPanel> */}
        <CustomTabPanel value={value} index={1}>
          <ProbeStats id={id} siloDetails={siloDetails} />
          <Footer />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <Parameters2 id={id} />
          <Footer />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <CalendarComponent id={id} />
          <Footer />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={4}>
          <Settings id={id} />
          <Footer />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={5}>
          <Report id={id} reportTemp={reportTemp} reportHum={reportHum} />
          <Footer />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={6}>
          <Info />
          <Footer />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={7}>
          <Help />
          <Footer />
        </CustomTabPanel>
      </Box>
    </ThemeProvider>
  );
};

export default DesktopTabs2;
