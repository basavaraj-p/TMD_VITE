import React from "react";
import { useState, useEffect } from "react";
import { useSubscription } from "urql";
import LineChartComponent from "./LineChartComponent";
import { Card, CardContent,Typography } from "@mui/material";

const fanHistoryQuery = `subscription MySubscription {
  allRelayLoggers(orderBy: TIME_ASC) {
    nodes {
      automatic
      channel
      relayId
      status
      time
    }
  }
}

`;

const FanStats = ({ id }) => {
  const [fanHistory, setFanHistory] = useState([]);
  console.log("fanHistory : ", fanHistory);
  console.log("id : ", id);

  const [allfanHistoryResult, allfanHistoryAgain] = useSubscription({
    query: fanHistoryQuery,
    // variables: {
    //   id,
    // },
  });

  const {
    data: dataSubscription,
    fetching: fetchingQuery,
    error: errorQuery,
  } = allfanHistoryResult;

  useEffect(() => {
    if (dataSubscription) setFanHistory(dataSubscription.allRelayLoggers.nodes);
    //  refresh();
  }, [dataSubscription]);

  const relayId1 = id === 1 ? 50 : 52;
  console.log("relayId1 : ", relayId1);

  const relayId2 = id === 1 ? 51 : 53;
  console.log("relayId2 : ", relayId2);

  const filteredFanHistory = fanHistory
    .filter((item) => item.relayId === relayId1 || item.relayId === relayId2)
    .sort((a, b) => new Date(a.time) - new Date(b.time));

  console.log("filteredFanHistory : ", filteredFanHistory);

  return (
    <div>
      {/* <h1>FanStats</h1> */}
      <Card style={{ background: "#b3c99c" }}>
        <CardContent>
          <Typography
            align="center"
            variant="h6"
            fontWeight="bold"
            color="green"
            style={{ marginBottom: "" }}
            // style={{ marginBottom: "41.5%" }}
          >
            FANS STATUS
          </Typography>
          <LineChartComponent data={filteredFanHistory} />
        </CardContent>
      </Card>
    </div>
  );
};

export default FanStats;
