import React, { useState, useCallback, useEffect } from "react";
import {
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  Grid,
  Box,
} from "@mui/material";
import { useQuery, useMutation, useSubscription } from "urql";
import "./style.css";

const parameterSubscription = `subscription($id:Int!)  {
  allGraindetails(condition: {siloId: $id}) {
    nodes {
      veriety
      siloId
      grains
      density
      comment
      angleOfRepose
    }
  }
}`;

const updateParameterMutation = `mutation updateParameterRecordById($inpId:Int!,$inpangleOfRepose:Int!, $inpveriety:Int!, $inpcomment:String!, $inpdensity:Float!, $inpgrain:String!){
  updateGraindetailBySiloId(
    input: {graindetailPatch: {grains: $inpgrain, density: $inpdensity, comment: $inpcomment, veriety: $inpveriety, angleOfRepose: $inpangleOfRepose}, siloId: $inpId}
  ) {
    clientMutationId
  }
}`;

const threshold = `subscription($id:Int!)  {
  allThresholdSettings(condition: {siloId: $id}) {
    nodes {
      humHigh
      humLow
      siloId
      tempHigh
      tempLow
      moistureHigh
      moistureLow
    }
  }
}`;

const configQuery = `subscription MySubscription($id:Int!) {
  allSiloConfigs(filter: {siloId: {equalTo: $id}}) {
    nodes {
      cableDensity
      cables
      caliberate
      density
      frustrumRadius
      heightCone
      heightCylinder
      radius
      siloId
      stepsToBeDecremented
      tiltedXAngle
      tiltedYAngle
      tiltedZAngle
      tmdRadius
      topHeightCone
      zLinspace
    }
  }
}
`;

function Parameters2({ id }) {
  const [parameters, setParameters] = useState();
  const [thresholds, setThresholds] = useState();
  const [config, setConfig] = useState();
  // console.log("Parameters : ",parameters);
  // console.log("Thresholds : ",thresholds);
  // console.log("Config : ",config);
  const defaultParams = parameters && parameters[0] ? parameters[0] : {};

  const handleSubmit = (e) => {
    e.preventDefault();
    let updatedData = {
      inpgrain: document.getElementById("inpgrain").value,
      inpveriety: parseInt(document.getElementById("inpverity").value),
      inpangleOfRepose: parseInt(
        document.getElementById("angleOfRepose").value
      ),
      inpdensity: parseFloat(document.getElementById("inpdensity").value),
      inpcomment: document.getElementById("inpcomment").value,
      inpId: id,
    };

    updateFormationItemDetailRecord(updatedData);
  };
  let inpangleOfRepose;
  let inpveriety;
  let inpcomment;
  let inpdensity;
  let inpgrain;
  const [updateParameterRecord, updateParameter] = useMutation(
    updateParameterMutation
  );

  const updateFormationItemDetailRecord = useCallback((changedDetails) => {
    updateParameter(changedDetails).then((result) => {
      if (result.error) {
        return false;
      } else {
        return true;
      }
    });
  });

  const [allthresholdSubscriptionResult, allthresholdSubscriptionResultAgain] =
    useSubscription({
      query: threshold,
      variables: {
        id,
      },
    });

  const {
    data: thresholddataQuery,
    fetching: thresholdfetchingQuery,
    error: thresholderrorQuery,
  } = allthresholdSubscriptionResult;

  useEffect(() => {
    if (thresholddataQuery)
      setThresholds(thresholddataQuery.allThresholdSettings.nodes);
    //  refresh();
  }, [thresholddataQuery]);

  const [allparameterSubscriptionResult, allparameterSubscriptionResultAgain] =
    useSubscription({
      query: parameterSubscription,
      variables: {
        id,
      },
    });

  const {
    data: dataQuery,
    fetching: fetchingQuery,
    error: errorQuery,
  } = allparameterSubscriptionResult;

  useEffect(() => {
    if (dataQuery) setParameters(dataQuery.allGraindetails.nodes);
    //  refresh();
  }, [dataQuery]);

  const [allconfigSubscriptionResult, allconfigSubscriptionResultAgain] =
    useSubscription({
      query: configQuery,
      variables: {
        id,
      },
    });

  const {
    data: dataConfigQuery,
    fetching: fetchingConfigQuery,
    error: errorConfigQuery,
  } = allconfigSubscriptionResult;

  useEffect(() => {
    if (dataConfigQuery) setConfig(dataConfigQuery.allSiloConfigs.nodes);
    //  refresh();
  }, [dataConfigQuery]);

  return (
    <Box padding={2} borderRadius={2} style={{ background: "#B3C99C" }}>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={4}>
          {/* Grains Card */}
          <Card style={{ background: "#F3FDE8" }}>
            <CardContent>
              <Typography
                align="center"
                variant="h6"
                fontWeight="bold"
                color="green"
              >
                GRAINS
              </Typography>
              <Box mt={2}>
                <TextField
                  label="Grains"
                  fullWidth
                  margin="normal"
                  type="text"
                  id="inpgrain"
                  ref={(value) => (inpgrain = value)}
                  color="success"
                  focused
                  placeholder={defaultParams.grains}
                />
                <TextField
                  label="Variety"
                  fullWidth
                  margin="normal"
                  type="number"
                  id="inpverity"
                  ref={(value) => (inpveriety = value)}
                  color="success"
                  focused
                  placeholder={defaultParams.veriety}
                />
                <TextField
                  label="Angle of Repose"
                  fullWidth
                  margin="normal"
                  type="number"
                  id="angleOfRepose"
                  ref={(value) => (inpangleOfRepose = value)}
                  color="success"
                  focused
                  placeholder={defaultParams.angleOfRepose}
                />
                <TextField
                  label="Density"
                  fullWidth
                  margin="normal"
                  type="number"
                  id="inpdensity"
                  ref={(value) => (inpdensity = value)}
                  color="success"
                  focused
                  placeholder={defaultParams.density}
                />
                <TextField
                  label="Comments"
                  multiline
                  fullWidth
                  margin="normal"
                  id="inpcomment"
                  ref={(value) => (inpcomment = value)}
                  color="success"
                  focused
                  placeholder={defaultParams.comment}
                />
                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    style={{ textTransform: "none" }}
                  >
                    Add To Report
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Alarms Card */}
        <Grid item xs={12} sm={4}>
          <Card style={{ background: "#F3FDE8", marginBottom: "6%" }}>
            <CardContent>
              <Typography
                align="center"
                variant="h6"
                fontWeight="bold"
                color="green"
              >
                ALARMS
              </Typography>
              <Box mt={2}>
                <TextField
                  color="success"
                  label="High Temperature (°C)"
                  fullWidth
                  margin="normal"
                  // disabled
                  focused
                  value={thresholds && thresholds[0].tempHigh}
                  className="customTextField"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  // style={{ color: "green", borderColor: "green" }}
                />
                <TextField
                  color="success"
                  label="Low Moisture (RH)"
                  fullWidth
                  margin="normal"
                  // disabled
                  focused
                  value={thresholds && thresholds[0].moistureLow}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  color="success"
                  label="High Moisture (RH)"
                  fullWidth
                  margin="normal"
                  // disabled
                  focused
                  value={thresholds && thresholds[0].moistureHigh}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          {/* Alerts Card */}
          <Card style={{ background: "#F3FDE8" }}>
            <CardContent>
              <Typography
                align="center"
                variant="h6"
                fontWeight="bold"
                color="green"
              >
                ALERTS
              </Typography>
              <Box mt={2}>
                <TextField
                  color="success"
                  label="Temperature Rise (°C)"
                  fullWidth
                  margin="normal"
                  // disabled
                  focused
                  value={thresholds && thresholds[0].tempHigh}
                  className="customTextField"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  color="success"
                  label="Moisture Rise (RH)"
                  fullWidth
                  margin="normal"
                  // disabled
                  focused
                  value={thresholds && thresholds[0].moistureHigh}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Parameters2;
