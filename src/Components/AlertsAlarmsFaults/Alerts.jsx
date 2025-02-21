import React, { useState, useEffect } from "react";
import { useSubscription } from "urql";
import moment from "moment";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";

const AllAlarams = `subscription($siloId:Int!,$date:Date!)  {
  allAlerts(condition: {siloId: $siloId}, filter: {alertId: {lessThanOrEqualTo: 2},date: {equalTo:$date}},orderBy: START_DESC) {
    nodes {
      title
      start
      color
      siloId
      alertId
      date
      value
    }
    totalCount
  }
}`;

const Alerts = ({ id }) => {
  // const siloID = id;
  // let id = parseInt( id);
  // console.log(typeof id);
  const siloId = Number(id);
  const [alarams, setAlarams] = useState();
  // console.log("alarams11: ", alarams);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value); // Convert rows per page value to a number
    setPage(0); // Reset to first page
  };

  let date = moment(new Date()).format("YYYY-MM-DD");
  const [allAlaramsResult, allAlaramsResultAgain] = useSubscription({
    query: AllAlarams,
    variables: {
      siloId,
      date
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

  return (
    <div>
      <div
        style={{
          margin: "15px",
          backgroundColor: "#dddddd",
          minHeight: "60vh",
        }}
      >
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: "#f3820a" }}>
                  <TableCell align="center" style={{ width: "15%" }}>
                    Date
                  </TableCell>
                  <TableCell align="center" style={{ width: "15%" }}>
                    Time
                  </TableCell>
                  <TableCell align="center" style={{ width: "60%" }}>
                    Alerts Description
                  </TableCell>
                  <TableCell align="center" style={{ width: "10%" }}>
                    Value
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {alarams &&
                  alarams
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((alarm) => (
                      <TableRow key={alarm.siloId}>
                        <TableCell align="center">
                          {moment(alarm.date).format("DD-MM-YYYY")}
                        </TableCell>
                        <TableCell align="center">
                          {alarm.start.slice(11).slice(0, 5)}
                        </TableCell>
                        <TableCell align="center">{alarm.title}</TableCell>
                        <TableCell align="center">
                          {parseFloat(alarm.value).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={10}
            rowsPerPageOptions={[10, 20, 50]}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    </div>
  );
};

export default Alerts;
