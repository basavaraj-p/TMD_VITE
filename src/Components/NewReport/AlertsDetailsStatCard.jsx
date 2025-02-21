import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Grid,
} from "@mui/material";

const AlertsDetailsStatCard = ({ thresholds }) => {
  return (
    <Card
      sx={{
        width: "auto",
        height: "auto",
        backgroundColor: "#f3fde8",
        color: "black",
        margin: "2%",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center" ,marginTop:"5%"}}>
        <Typography variant="h5" color="black" fontWeight="bold">
          Alerts
        </Typography>
      </div>
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography variant="h6" color="black" fontWeight="bold">
              Temp Max:
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" color="black" fontWeight="bold">
              {thresholds && thresholds[0].tempHigh}°C
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" color="black" fontWeight="bold">
              Low Moist:
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" color="black" fontWeight="bold">
              {thresholds && thresholds[0].moistureLow}RH
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" color="black" fontWeight="bold">
              High Moist:
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" color="black" fontWeight="bold">
              {thresholds && thresholds[0].moistureHigh}RH
            </Typography>
          </Grid>
          {/* <Grid item xs={6}>
            <Typography variant="h6" color="black" fontWeight="bold">
              Date and Time:
            </Typography>
          </Grid> */}
          {/* <Grid item xs={6}>
            <Typography variant="body2" color="black" fontWeight="bold">
              04-06-2024, 12:10
            </Typography>
          </Grid> */}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AlertsDetailsStatCard;
