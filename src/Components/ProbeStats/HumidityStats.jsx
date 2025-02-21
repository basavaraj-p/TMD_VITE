import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { useQuery, useSubscription } from "urql";
import { useMediaQuery } from "@mui/material";


const AllHumidityvalues = `subscription($id:Int!) {
    allHumidities(filter: {siloId: {equalTo: $id}}, orderBy: SENSOR_ID_ASC) {
      nodes {
        siloId
        probeId
        value
        sensorId
        humValue
        relHumidity
        tempValue
      }
    }
  }`;


const HumidityStats = ({ id }) => {
  // let HHeader = ["Probes","S2","S3","S4","S5","S6","S7","S8","S9","S10"]
  const [humidity, setHumidity] = useState();
  console.log("humidity : ",humidity);
//   console.log("id : ",id);
    const matches = useMediaQuery("(max-width:600px)");


  const humidityValues = [];
  if (humidity) {
    for (var i = 0; i < humidity.length; i++) {
      if (i % 2 === 0) {
        humidityValues.push(humidity[i]);
      }
    }
  }
  let THeader = [];
  if (humidity) {
    THeader = humidity.map((item, i) => `S${i + 1}`);
  }

  THeader.unshift("SENSOR");

  const [allHumidityResult, allHumidityResultAgain] = useSubscription({
    query: AllHumidityvalues,
    variables: {
      id,
    },
  });

  const {
    data: humidityQuery,
    fetchihumidityfetchingQuery,
    errhumidityerrorQuery,
  } = allHumidityResult;

  useEffect(() => {
    if (humidityQuery) setHumidity(humidityQuery.allHumidities.nodes);
    //  refresh();
  }, [humidityQuery]);

  //  MUI Table Functions
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));
  return (
    <div style={{ margin: "auto", width: "auto", paddingBottom: "25px" }}>
      <TableContainer
        component={Paper}
        elevation={4}
        sx={{ maxWidth: matches ? 395 : "auto" }}
      >
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              {THeader.map((HHead, index) => (
                <StyledTableCell
                  key={index}
                  align="center"
                  style={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    backgroundColor: "#4B4A54",
                    width: "auto",
                  }}
                >
                  {HHead}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <StyledTableRow>
              <StyledTableCell
                align="center"
                style={{ fontWeight: "bold", fontSize: "16px" }}
              >
                Moisture(RH)
              </StyledTableCell>

              {humidity &&
                humidity.map((probeItem, index) => {
                  // console.log('probeItem: ', probeItem.relHumidity);
                  return (
                    <StyledTableCell
                      key={index}
                      align="center"
                      style={{ fontWeight: "bold", fontSize: "16px" }}
                    >
                      {parseFloat(probeItem.relHumidity).toFixed(1)}
                    </StyledTableCell>
                  );
                })}
            </StyledTableRow>

            <StyledTableRow>
              <StyledTableCell
                align="center"
                style={{ fontWeight: "bold", fontSize: "16px" }}
              >
                Temperature(&#8451;)
              </StyledTableCell>

              {humidity &&
                humidity.map((probeItem, index) => {
                  // console.log('probeItem: ', probeItem);
                  return (
                    <StyledTableCell
                      key={index}
                      align="center"
                      style={{ fontWeight: "bold", fontSize: "16px" }}
                    >
                      {parseFloat(probeItem.tempValue).toFixed(1)}
                    </StyledTableCell>
                  );
                })}
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default HumidityStats;
