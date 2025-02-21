import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./style.css"
import { useQuery, useMutation, useSubscription } from "urql";
import { useMediaQuery } from "@mui/material";

const CalendarEvents = `subscription($id:Int!) {
  allAlerts(condition: {siloId: $id}) {
    nodes {
      title
      start
      color
    }
  }
}`;

const localizer = momentLocalizer(moment);

const CalendarComponent = ({ id }) => {
  const [events, setEvents] = useState([]);
  const matches = useMediaQuery("(max-width:600px)");


  const [allCalendarEventsResult, allCalendarEventsResultAgain] =
    useSubscription({
      query: CalendarEvents,
      variables: {
        id,
      },
    });

  const {
    data: dataQuery,
    fetching: fetchingQuery,
    error: errorQuery,
  } = allCalendarEventsResult;

  useEffect(() => {
    if (dataQuery) {
      const formattedEvents = dataQuery.allAlerts.nodes.map((event) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.start), // assuming each event is just for one day
      }));
      setEvents(formattedEvents);
    }
  }, [dataQuery]);

  return (
    <div
      style={{
        margin: "15px",
        marginTop: matches ? "40px" : "",
        backgroundColor: "#B3C99C",
        minHeight: "60vh",
        display: "flex",
        justifyContent: "space-evenly",
        borderRadius:"5px"
      }}
    >
      <div
        style={{
          width: matches ? "auto" : "100%",
          padding: "10px",
          backgroundColor: "",
        }}
      >
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />
      </div>
    </div>
  );
};

export default CalendarComponent;
