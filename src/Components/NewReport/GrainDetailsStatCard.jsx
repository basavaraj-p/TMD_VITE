import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Grid,
} from "@mui/material";

const GrainDetailsStatCard = ({ parameters }) => {
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
          Grain Detalis
        </Typography>
      </div>
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography variant="h6" color="black" fontWeight="bold">
              Grain:
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" color="black" fontWeight="bold">
              {parameters && parameters[0].grains}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" color="black" fontWeight="bold">
              Variety:
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" color="black" fontWeight="bold">
              {parameters && parameters[0].veriety}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" color="black" fontWeight="bold">
              Density:
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" color="black" fontWeight="bold">
              {parameters && parameters[0].density}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" color="black" fontWeight="bold">
              Comments:
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" color="black" fontWeight="bold">
              {parameters && parameters[0].comment}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default GrainDetailsStatCard;
