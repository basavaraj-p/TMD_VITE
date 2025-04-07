import React from "react";
import { MaterialReactTable } from "material-react-table";
import { Box } from "@mui/material";
import probeData from "./test";

const TempTableComponent = ({ filtteredProbes, testValue }) => {
  // console.log("testValue : ", testValue);
  const organizeData = (probeData) => {
    const sensors = new Set();
    const probes = new Set();
    const dataMap = {};

    // Collect unique sensors and probes and organize data
    probeData.forEach(({ sensorId, probeId, value }) => {
      sensors.add(sensorId);
      probes.add(probeId);
      if (!dataMap[sensorId]) {
        dataMap[sensorId] = {};
      }
      dataMap[sensorId][probeId] = value;
    });

    const sortedSensors = [...sensors].sort((a, b) => a - b);
    const sortedProbes = [...probes].sort((a, b) => a - b);

    return { sensors: sortedSensors, probes: sortedProbes, dataMap };
  };

  const { sensors, probes, dataMap } = organizeData(filtteredProbes);

  const columns = [
    { accessorKey: "sensor", header: "Sensor", size: 25 },
    ...probes.map((probe) => ({
      accessorKey: `P${probe}`,
      header: `P${probe - 10}`,
      size: 25,
      Cell: ({ cell }) =>
        cell.getValue() !== undefined
          ? parseFloat(cell.getValue()).toFixed(2)
          : "",
    })),
  ];

  const rows = sensors.map((sensor) => {
    const row = { id: sensor, sensor: `S${sensor} (°C)` };
    probes.forEach((probe) => {
      row[`P${probe}`] = dataMap[sensor][probe];
    });
    return row;
  });

  const [density, setDensity] = React.useState("compact");

  //   const toggleDensity = () => {
  //     setDensity((prevDensity) =>
  //       prevDensity === "compact" ? "comfortable" : "compact"
  //     );
  //   };

  return (
    <Box sx={{ height: "auto", width: "100%" }}>
      <MaterialReactTable
        columns={columns}
        data={rows}
        enablePagination={false}
        enableFullScreenToggle={false}
        initialState={{ density }}
        muiTableBodyCellProps={{
          sx: {
            backgroundColor: "#f3fde8", // Change this to your desired background color
            fontSize: "16px",
            fontWeight: "bold",
          },
        }}
        muiTableHeadCellProps={{
          sx: {
            backgroundColor: "#4b4a54", // Change this to your desired header background color
            color: "white",
            fontSize: "16px",
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

export default TempTableComponent;
