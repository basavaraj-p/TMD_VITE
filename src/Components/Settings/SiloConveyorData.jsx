import React from "react";
import { useQuery } from "urql";
import {
  Card,
  CardContent,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { Paper } from "@mui/material";

const CONVEYOR_DATA = `query MyQuery($silo:Int!) {
  getConveyorData(silo: $silo) {
    start_time
    end_time
    duration
    ton
  }
}
`;
export default function SiloConveyorData({ silo }) {
  // console.log("silo000000000000000000 : ", silo);
  const [conveyorData, setConveyorData] = React.useState([]);
  const [allConveyorData, rexAllConveyorData] = useQuery({
    query: CONVEYOR_DATA,
    variables: { silo },
  });
  React.useEffect(() => {
    if (allConveyorData.data) {
      // console.log(allConveyorData.data.getConveyorData);
      setConveyorData(allConveyorData.data.getConveyorData);
    }
  }, [allConveyorData.data]);

  React.useEffect(() => {
    let timer = setInterval(() => {
      rexAllConveyorData({ requestPolicy: "cache-and-network" });
    }, 300000);
    return () => {
      clearInterval(timer);
    };
  });
  
  return (
    <Card style={{ background: "#F3FDE8" }}>
      <CardContent>
        <Typography
          align="center"
          variant="h6"
          fontWeight="bold"
          color="green"
          style={{ marginBottom: "" }}
          // style={{ marginBottom: "41.5%" }}
        >
          SILO {silo === 5 ? "1" : "2"} Consumption
        </Typography>
        <TableContainer component={Paper}>
          <Table
            aria-label="simple table"
            size="small"
            style={{
              border: "2px solid #007a37",
              backgroundColor: "#b3c99c",
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell align="left" style={{ fontWeight: "bold" }}>
                  Date
                </TableCell>

                <TableCell align="left" style={{ fontWeight: "bold" }}>
                  Tons
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {conveyorData &&
                conveyorData
                  // ?.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                  .map((data, index) => (
                    <TableRow key={index}>
                      <TableCell align="left">
                        {!data.start_time
                          ? "null"
                          : new Date(data.end_time)
                              .toLocaleString()
                              .split(",")[0]}
                      </TableCell>

                      <TableCell align="left">{data.ton.toFixed(3)}</TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
          {/* Silo 1 5 */}
          {/* Silo 2 4 */}
          {/* Pagination */}
          {/* <TablePagination
                  rowsPerPageOptions={[]}
                  component="div"
                  count={tripStatus2?.length || 0}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                /> */}
        </TableContainer>
      </CardContent>
    </Card>
  );
}
