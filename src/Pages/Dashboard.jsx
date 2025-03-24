import React, { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import Navbar from "../Components/Navbar/Navbar";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import SnackbarContent from "@mui/material/SnackbarContent";
// import { useContext } from 'react';
import { GlobalContext } from "../Context/context";
import Layout from "../Components/DasboardComponents/layout";
import Footer from "../Components/Footer/Footer";
import Weatherstation from "../Components/Weatherstation/Weatherstation";

const Dashboard = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { state, dispatch } = useContext(GlobalContext);

  useEffect(() => {
    // Trigger the Snackbar as soon as the component mounts
    setSnackbarOpen(true);
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      <Navbar page="Silo Overview" project="SENSEOPS" />
      <Weatherstation notshow="notshow" />
      <Layout />
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <SnackbarContent
          message={`Logged in using ${state.email}`}
          style={{ backgroundColor: "#618264" }} // Color of your choice
          action={
            <React.Fragment>
              <IconButton
                size="small"
                color="success"
                onClick={handleCloseSnackbar}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />
      </Snackbar>
      <Footer />
    </div>
  );
};

export default Dashboard;
