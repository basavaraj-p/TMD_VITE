import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import EmailIcon from "@mui/icons-material/Email";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useContext } from "react";
import { GlobalContext } from "../../Context/context";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function Navbar({ page, project }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { state, dispatch } = useContext(GlobalContext);
  // const location = useLocation();
  // console.log(location.pathname);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "#007a37" }}>
        <Toolbar
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            "@media (max-width: 600px)": {
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              justifyItems: "center",
            },
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{
              margin: "0 0%",
              "@media (max-width: 600px)": {
                marginBottom: "8px",
                fontSize: "110%",
              },
            }}
          >
            {page}
          </Typography>
          <Typography
            variant="h6"
            component="div"
            sx={{
              margin: "0 0%",
              "@media (max-width: 600px)": {
                marginBottom: "8px",
                fontSize: "90%",
              },
            }}
          >
            {project}
          </Typography>
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>
                <EmailIcon style={{ color: "#007a37" }} />
                <div style={{ marginRight: "15%", marginLeft: "3%" }}>
                  {state.email}
                </div>
              </MenuItem>
              {location.pathname === "/dashboard" ? null : (
                <Link
                  to={"/dashboard"}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <MenuItem onClick={handleClose}>
                    <DashboardIcon style={{ color: "#007a37" }} />
                    <div style={{ marginRight: "15%", marginLeft: "3%" }}>
                      Silo Overview
                    </div>
                  </MenuItem>
                </Link>
              )}
              <Link
                to={"/"}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <MenuItem onClick={handleClose}>
                  <LogoutIcon style={{ color: "#007a37" }} />
                  <div style={{ marginRight: "15%", marginLeft: "3%" }}>
                    Logout
                  </div>
                </MenuItem>
              </Link>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
