import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useSubscription } from "urql";
import { useState,useEffect } from "react";
import moment from "moment";

// Icons
import TimelineIcon from "@mui/icons-material/Timeline";
import TableChartIcon from "@mui/icons-material/TableChart";
import SettingsInputComponentSharpIcon from "@mui/icons-material/SettingsInputComponentSharp";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import ArticleSharpIcon from "@mui/icons-material/ArticleSharp";
import InfoSharpIcon from "@mui/icons-material/InfoSharp";
import HelpOutlineSharpIcon from "@mui/icons-material/HelpOutlineSharp";
import UsbIcon from "@mui/icons-material/Usb";
import UsbOffIcon from "@mui/icons-material/UsbOff";

// Components
import Graphs from "../Graphs/Graphs";
import ProbeStats from "../ProbeStats/ProbeStats";
import  Parameters  from "../Parameters/Parameters";
import CalendarComponent from "../Calendar/Calendar";
import Settings  from "../Settings/Settings";
import Settings2 from "../Settings/Settings2";
import  Report  from "../Report/Report";
import { Info } from "../Info/Info";
import { Help } from "../Help/Help";
import Alarms from "../AlertsAlarmsFaults/Alarms";
import Alerts from "../AlertsAlarmsFaults/Alerts";
import Faults from "../AlertsAlarmsFaults/Faults";
import Footer from "../Footer/Footer";

const AllAlarams = `subscription($id:Int!,$date:Date!)  {
    allAlerts(condition: {siloId: $id}, filter: {alertId: {lessThanOrEqualTo: 3},date: {equalTo:$date}}) {
      nodes {
        title
        start
        color
        siloId
        alertId
      }
      totalCount
    }
  }`;

const AllAlerts = `subscription($id:Int!, $date:Date!)  {
    allAlerts(condition: {siloId: $id}, filter: {alertId: {lessThanOrEqualTo: 2},date: {equalTo: $date}}) {
      nodes {
        title
        start
        color
        siloId
        alertId
      }
      totalCount
    }
  }`;
const AllFaults = `subscription($id:Int!, $date:Date!)  {
    allAlerts(condition: {siloId: $id}, filter: {alertId: {equalTo: 5},date: {equalTo: $date}}) {
      nodes {
        title
        start
        color
        siloId
        alertId
      }
      totalCount
    }
  }`;

  const usbStatus = `subscription {
    allUsbs(first: 1, orderBy: TIME_DESC) {
      nodes {
        status
      }
    }
  }`;

const drawerWidth = 240;

function ResponsiveDrawer(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [selectedTab, setSelectedTab] = React.useState("Graphs");

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

    const [alarams, setAlarams] = useState();
    const [alerts, setAlerts] = useState();
    const [faults, setFaults] = useState();
    //   const history = useHistory();

    const id = props.id
    let date = moment(new Date()).format("YYYY-MM-DD");
    const [allAlertsResult, allAlertsResultAgain] = useSubscription({
      query: AllAlerts,
      variables: {
        id,
        date,
      },
    });
    const {
      data: alertdataQuery,
      fetching: alertfetchingQuery,
      error: alerterrorQuery,
    } = allAlertsResult;

    useEffect(() => {
      if (alertdataQuery) setAlerts(alertdataQuery.allAlerts.nodes);
    }, [alertdataQuery]);

    const [allFaultsResult, allFaultssResultAgain] = useSubscription({
      query: AllFaults,
      variables: {
        id,
        date,
      },
    });

    const {
      data: faultdataQuery,
      fetching: faultfetchingQuery,
      error: faulterrorQuery,
    } = allFaultsResult;

    useEffect(() => {
      if (faultdataQuery) setFaults(faultdataQuery.allAlerts.nodes);
    }, [faultdataQuery]);

    const [allAlaramsResult, allAlaramsResultAgain] = useSubscription({
      query: AllAlarams,
      variables: {
        id,
        date,
      },
    });

    const {
      data: alaramdataQuery,
      fetching: alaramfetchingQuery,
      error: alaramerrorQuery,
    } = allAlaramsResult;

    useEffect(() => {
      if (alaramdataQuery) setAlarams(alaramdataQuery.allAlerts.nodes);
    }, [alaramdataQuery]);

     const [usbConnection, setUsbConnection] = useState();

     const [usbStatuResult, usbStatuResultAgain] = useSubscription({
       query: usbStatus,
     });

     const {
       data: usbQuery,
       fetching: usbfetchingQuery,
       error: usberrorQuery,
     } = usbStatuResult;

     useEffect(() => {
       if (usbQuery) setUsbConnection(usbQuery.allUsbs.nodes[0].status);
       //  refresh();
     }, [usbQuery]);

    //  console.log(usbConnection);

  const drawer = (
    <div>
      <Toolbar />

      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            selected={selectedTab === "Graphs"}
            onClick={() => {
              setSelectedTab("Graphs");
              setMobileOpen(!mobileOpen);
            }}
          >
            <ListItemIcon>{<TimelineIcon />}</ListItemIcon>
            <ListItemText primary={"Graphs"} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            selected={selectedTab === "Probes Stats"}
            onClick={() => {
              setSelectedTab("Probes Stats");
              setMobileOpen(!mobileOpen);
            }}
          >
            <ListItemIcon>{<TableChartIcon />}</ListItemIcon>
            <ListItemText primary={"Probes Stats"} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            selected={selectedTab === "Parameters"}
            onClick={() => {
              setSelectedTab("Parameters");
              setMobileOpen(!mobileOpen);
            }}
          >
            <ListItemIcon>{<SettingsInputComponentSharpIcon />}</ListItemIcon>
            <ListItemText primary={"Parameters"} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            selected={selectedTab === "Calendar"}
            onClick={() => {
              setSelectedTab("Calendar");
              setMobileOpen(!mobileOpen);
            }}
          >
            <ListItemIcon>{<CalendarMonthOutlinedIcon />}</ListItemIcon>
            <ListItemText primary={"Calendar"} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            selected={selectedTab === "Settings"}
            onClick={() => {
              setSelectedTab("Settings");
              setMobileOpen(!mobileOpen);
            }}
          >
            <ListItemIcon>{<SettingsIcon />}</ListItemIcon>
            <ListItemText primary={"Settings"} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            selected={selectedTab === "Report"}
            onClick={() => {
              setSelectedTab("Report");
              setMobileOpen(!mobileOpen);
            }}
          >
            <ListItemIcon>{<ArticleSharpIcon />}</ListItemIcon>
            <ListItemText primary={"Report"} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            selected={selectedTab === "Info"}
            onClick={() => {
              setSelectedTab("Info");
              setMobileOpen(!mobileOpen);
            }}
          >
            <ListItemIcon>{<InfoSharpIcon />}</ListItemIcon>
            <ListItemText primary={"Info"} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            selected={selectedTab === "Help"}
            onClick={() => {
              setSelectedTab("Help");
              setMobileOpen(!mobileOpen);
            }}
          >
            <ListItemIcon>{<HelpOutlineSharpIcon />}</ListItemIcon>
            <ListItemText primary={"Help"} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            selected={selectedTab === "Alarms"}
            onClick={() => {
              setSelectedTab("Alarms");
              setMobileOpen(!mobileOpen);
            }}
          >
            <ListItemIcon>{alarams?.length}</ListItemIcon>
            {/* {alarams?.length} */}
            <ListItemText primary={"Alarms"} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            selected={selectedTab === "Alerts"}
            onClick={() => {
              setSelectedTab("Alerts");
              setMobileOpen(!mobileOpen);
            }}
          >
            <ListItemIcon>{alerts?.length}</ListItemIcon>
            {/* {alarams?.length} */}
            <ListItemText primary={"Alerts"} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            selected={selectedTab === "Faults"}
            onClick={() => {
              setSelectedTab("Faults");
              setMobileOpen(!mobileOpen);
            }}
          >
            <ListItemIcon>{faults?.length}</ListItemIcon>
            {/* {alarams?.length} */}
            <ListItemText primary={"Faults"} />
          </ListItemButton>
        </ListItem>

      </List>
      <Divider />
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="absolute"
        // color="success"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          mt: "47.5%",
          // height:"80%"
          backgroundColor: "#007a37",
        }}
      >
        <Toolbar>
          <IconButton
            // color="black"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" }, color: "black" }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h5" noWrap component="div">
            {usbConnection ? <UsbIcon /> : <UsbOffIcon /> } {selectedTab}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, pt: 3, mt: 2 }}>
        {selectedTab === "Graphs" && (
          <Graphs id={props.id} siloDetails={props.siloDetails} />
        )}
        {/* <Footer /> */}
        {selectedTab === "Probes Stats" && (
          <ProbeStats id={props.id} siloDetails={props.siloDetails} />
        )}
        {/* <Footer /> */}
        {selectedTab === "Parameters" && <Parameters id={props.id} />}
        {/* <Footer /> */}
        {selectedTab === "Calendar" && <CalendarComponent id={props.id} />}
        {selectedTab === "Settings" && <Settings2 id={props.id} />}
        {selectedTab === "Report" && <Report id={props.id} />}
        {selectedTab === "Info" && <Info />}
        {selectedTab === "Help" && <Help />}
        {selectedTab === "Alarms" && <Alarms id={props.id} />}
        {selectedTab === "Alerts" && <Alerts id={props.id} />}
        {selectedTab === "Faults" && <Faults id={props.id} />}
        {!selectedTab === "Info" && !selectedTab === "Help" && <Footer />}
      </Box>
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;
