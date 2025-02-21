import React, { useState } from "react";
// import { useState } from 'react';
import { useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import { useSubscription } from "urql";
import { useMediaQuery } from "@mui/material";

const highTemperatureSubscription = `subscription($id:Int!) {
  allThresholdSettings(filter: {siloId: {equalTo: $id}}) {
    nodes {
      tempHigh
    }
  }
}`;

let tHeader = [
  "P1",
  "P2",
  "P3",
  "P4",
  "P5",
  "P6",
  "P7",
  "P8",
  "P9",
  "P10",
  "P11",
  "P12",
  "P13",
  "P14",
  "P15",
  "P16",
  "P17",
  "P18",
  "P19",
];

const TemperatureStats = ({ siloDetails, id }) => {
  //   console.log("siloDetails11: ", siloDetails);
  const [highTempThreshold, setHighTempThreshold] = useState(25);
  // console.log("highTempThreshold: ", highTempThreshold);
  const matches = useMediaQuery("(max-width:600px)");

  let n = 0;
  siloDetails.map((item, index) => {
    if (item.datas.length > n) {
      n = item.datas.length;
    }
  });

  const TableHeadValues = tHeader.slice(0, n).map((items) => items);

  TableHeadValues.unshift("SENSOR");

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

  const tableBodyStyles = {
    maxHeight: "300px", // You can adjust this value
    overflowY: "hidden",
  };

  const tableHoverStyles = {
    overflowY: "auto",
  };

  const [allHighTempResult, allHighTempAgain] = useSubscription({
    query: highTemperatureSubscription,
    variables: {
      id,
    },
  });

  const {
    data: dataSubscription,
    fetching: fetchingQuery,
    error: errorQuery,
  } = allHighTempResult;

  useEffect(() => {
    if (dataSubscription)
      setHighTempThreshold(
        dataSubscription.allThresholdSettings.nodes[0].tempHigh
      );
    //  refresh();
  }, [dataSubscription]);

  return (
    <div style={{ margin: "auto", width: "auto", paddingBottom: "25px" }}>
      <TableContainer
        component={Paper}
        elevation={4}
        style={{
          maxHeight: matches ? "640px" : "440px",
          maxWidth: matches ? "395px" : "auto",
        }}
      >
        <Table stickyHeader aria-label="customized table">
          <TableHead>
            <TableRow>
              {TableHeadValues.map((tHead, index) => (
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
                  {tHead}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {siloDetails.map((dataItem, index) => {
              return (
                <StyledTableRow key={index}>
                  <StyledTableCell
                    align="center"
                    style={{ fontWeight: "bold", fontSize: "16px" }}
                  >
                    S{index + 1} (°C)
                  </StyledTableCell>
                  {dataItem.datas.map((probeItem, index) => {
                    // console.log("probeItem111: ", probeItem);

                    // let item = () => {probeItem[`T${index}`]}(index+1) < 10 ? probeItem[`${index+1}`] >= highTempThreshold ? "orange" : "black" : probeItem[`${index+1}`] >= highTempThreshold ? "orange" : "black",
                    return (
                      <StyledTableCell
                        key={index}
                        align="center"
                        style={{
                          fontWeight: "bold",
                          fontSize: "16px",
                          color:
                            (probeItem[`${index + 11}`] >= highTempThreshold &&
                              "orange") ||
                            (probeItem[`${index + 11}`] <= 0 && "red"),
                        }}
                      >
                        {index + 1 < 10
                          ? probeItem[`${index + 11}`]
                          : probeItem[`${index + 11}`]}

                        {/* {probeItem[`${index+11}`] !== "-11.00" ? probeItem[`${index+11}`] : "32.34"} */}
                      </StyledTableCell>
                    );
                  })}
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TemperatureStats;
