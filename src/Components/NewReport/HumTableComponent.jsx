import React from "react";
import { MaterialReactTable } from "material-react-table";
import humidityData from "./test2";
import { Box } from "@mui/material";

const HumTableComponent = ({ filtteredHumidity, testValue }) => {
  // console.log("testValue : ", testValue);
  const formatData = (data) => {
    const formattedData = {
      // Sensor: ["Sensor"],
      Moisture: ["Moisture (RH)"],
      Temperature: ["Temperature (°C)"],
    };

    data.forEach((item) => {
      // formattedData.Sensor.push(`S${item.sensor_id}`);
      formattedData.Moisture.push(parseFloat(item.relHumidity).toFixed(2));
      formattedData.Temperature.push(parseFloat(item.tempValue).toFixed(2));
    });

    return Object.keys(formattedData).map((key) => ({
      id: key,
      ...formattedData[key].reduce((acc, curr, index) => {
        acc[`col${index}`] = curr;
        return acc;
      }, {}),
    }));
  };

  const columns = [
    { accessorKey: "col0", header: "Sensor", size: 50 },
    { accessorKey: "col1", header: "S1", size: 50 },
    { accessorKey: "col2", header: "S2", size: 50 },
    { accessorKey: "col3", header: "S3", size: 50 },
    { accessorKey: "col4", header: "S4", size: 50 },
    { accessorKey: "col5", header: "S5", size: 50 },
    { accessorKey: "col6", header: "S6", size: 50 },
    { accessorKey: "col7", header: "S7", size: 50 },
    { accessorKey: "col8", header: "S8", size: 50 },
    { accessorKey: "col9", header: "S9", size: 50 },
    { accessorKey: "col10", header: "S10", size: 50 },
    { accessorKey: "col11", header: "S11", size: 50 },
  ];
  const tableData = formatData(filtteredHumidity);
  // Render the Material React Table
  return (
    <Box sx={{ height: "auto", width: "100%" }}>
      <MaterialReactTable
        columns={columns}
        data={tableData}
        enablePagination={false}
        enableFullScreenToggle={false}
        muiTableBodyCellProps={{
          sx: {
            fontSize: "20px",
            backgroundColor: "#f3fde8", // Change this to your desired background color
            fontWeight: "bold",
          },
        }}
        muiTableHeadCellProps={{
          sx: {
            backgroundColor: "#4b4a54", // Change this to your desired header background color
            color: "white",
            fontSize: "20px",
          },
        }}
        muiTableBodyRowProps={{
          sx: {
            "&:nth-of-type(odd)": {
              backgroundColor: "#f3fde8", // Background color for odd rows
            },
            "&:nth-of-type(even)": {
              backgroundColor: "#b3c99c", // Background color for even rows
            },
          },
        }}
      />
    </Box>
  );
};

export default HumTableComponent;
