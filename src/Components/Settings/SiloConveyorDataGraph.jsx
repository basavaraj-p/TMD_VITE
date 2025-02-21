import React from "react";
import { useQuery } from "urql";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts/core";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import { BarChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
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
import moment from "moment";


echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer,
]);

const CONVEYOR_DATA = `query MyQuery($silo:Int!) {
  getConveyorData(silo: $silo) {
    start_time
    end_time
    duration
    ton
  }
}
`;

export default function SiloConveyorDataGraph({ silo }) {
  // console.log("silo000000000000000000 : ", silo);
  const [conveyorData, setConveyorData] = React.useState([]);
  console.log("conveyorData : ", conveyorData);
  const [allConveyorData, rexAllConveyorData] = useQuery({
    query: CONVEYOR_DATA,
    variables: { silo },
  });

  React.useEffect(() => {
    if (allConveyorData.data) {
      // console.log(
      //   "allConveyorData.data.getConveyorData : ",
      //   allConveyorData.data.getConveyorData
      // );
      setConveyorData(allConveyorData.data.getConveyorData);
    } else if (allConveyorData.error) {
      console.error("allConveyorData.error : ", allConveyorData.error);
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

  // Function to filter, sort, and set 'ton' value
  const filterSortAndSetTon = (data) => {
    const fiveDaysAgo = moment().subtract(5, "days");
    return data
      .filter((item) => moment(item.end_time).isAfter(fiveDaysAgo))
      .sort((a, b) => moment(b.end_time).diff(moment(a.end_time)))
      .map((item) => ({
        ...item,
        ton: item.duration * 0.67,
      }));
  };

  // Filter, sort, and set 'ton' for conveyorData
  // const processedData = filterSortAndSetTon(conveyorData);

  // console.log(processedData);

  // Prepare data for bar chart
  const xAxisData = [];
  const seriesData = [];

  // const conveyorData2 = conveyorData?.sort((a, b) => a.end_time.toDate() - b.end_time.toDate())

  filterSortAndSetTon(conveyorData)?.forEach((data) => {
    xAxisData.push(moment(data.end_time).format("MM/DD"));
    seriesData.push(data.ton.toFixed(3));
  });

  const option = {
    title: {
      text: `SILO ${silo === 5 ? 1 : 2} Consumption`,
      left: "center",
      textStyle: {
        color: "green",
        fontSize: "20px",
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    // grid: {
    //   left: "3%",
    //   right: "4%",
    //   bottom: "3%",
    //   containLabel: true,
    // },
    xAxis: {
      type: "category",
      data: xAxisData,
      name: "Time",
      axisLabel: {
        textStyle: {
          fontSize: "15px",
          color: "black", // Adjust the color of the axis labels
        },
      },
    },
    yAxis: {
      type: "value",
      name: "Tonnes",
      axisLabel: {
        textStyle: {
          fontSize: "15px",
          color: "black", // Adjust the color of the axis labels
        },
      },
    },
    series: [
      {
        name: "Tons",
        type: "bar",
        data: seriesData,
        itemStyle: {
          color: "green", // Change the color of the bars here
        },
        label: {
          show: true,
          position: "top", // Show labels on top of bars
          textStyle: {
            fontSize: "15px",
            color: "black", // Adjust the color of the labels
          },
        },
      },
    ],
  };

  return (
    <div>
      <Card style={{ background: "#F3FDE8" }}>
        <CardContent>
          <ReactECharts
            echarts={echarts}
            option={option}
            style={{ height: "400px", width: "100%" }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
