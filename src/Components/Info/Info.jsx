import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useMediaQuery } from "@mui/material";

function createData(number, listItems) {
  return { number, listItems };
}

const rows = [
  createData("1", "Always turn off the panel power before opening it."),
  createData("2", "Ensure physical communication cable connections are firm."),
  createData(
    "3",
    "Ensure Power ratings of the input souce and compatibility before installation."
  ),
];

export function Info() {
  const matches = useMediaQuery("(max-width:600px)");

  return (
    <TableContainer
      component={Paper}
      style={{ marginTop: matches ? "10%" : "" }}
    >
      <Table aria-label="simple table">
        <TableHead style={{ backgroundColor: "#90A17D" }}>
          <TableRow>
            <TableCell
              align="center"
              style={{ color: "white", fontWeight: "bold", fontSize: "large" }}
            >
              #
            </TableCell>
            <TableCell
              align="left"
              style={{ color: "white", fontWeight: "bold", fontSize: "large" }}
            >
              Do's
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={row.number}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                backgroundColor: index % 2 ? "#E2F6CA" : "#CCEEBC",
              }}
            >
              <TableCell align="center" component="th" scope="row">
                {row.number}
              </TableCell>
              <TableCell align="left">{row.listItems}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
