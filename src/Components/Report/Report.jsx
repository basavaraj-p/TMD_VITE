import React, { useRef, useState, useEffect } from "react";
import ReactToPrint from "react-to-print";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import DirectionsOutlinedIcon from "@mui/icons-material/DirectionsOutlined";
import { Button } from "reactstrap";
// import ProbeStats from "../Silo details tabs/ProbeStats";
// import ReportStats from "../ReportStats/ReportStats";
import ReportStats from "./ReportStats";
import { useQuery, useMutation, useSubscription } from "urql";
// import "date-fns";
import Box from "@mui/material/Box";
// import DateFnsAdapter from "@mui/lab/AdapterDateFns";
// import LocalizationProvider from "@mui/lab/LocalizationProvider";
// import DatePicker from "@mui/lab/DatePicker";
import TextField from "@mui/material/TextField";
import moment from "moment";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useMediaQuery } from "@mui/material";


const StyledFormControl = styled(FormControl)(({ theme }) => ({
  margin: theme.spacing(1),
  minWidth: 70,
}));

const parameterSubscription = `subscription($id:Int!)  {
  allGraindetails(condition: {siloId: $id}) {
    nodes {
      veriety
      siloId
      grains
      density
      comment
      angleOfRepose
    }
  }
}`;

const threshold = `subscription($id:Int!)  {
  allThresholdSettings(condition: {siloId: $id}) {
    nodes {
      humHigh
      humLow
      siloId
      tempHigh
      tempLow
      moistureLow
      moistureHigh
    }
  }
}`;

//new queries by basavaraj
const probeHistory = `subscription MySubscription($selectedDate:Datetime,$nextDay:Datetime) {
  allProbeHistories(
    filter: {updatetime: {greaterThanOrEqualTo: $selectedDate, lessThan: $nextDay}}
  ) {
    nodes {
      updatetime
    }
  }
}
`;

const getLatestDate = `subscription MySubscription ($id:Int!){
  allProbeHistories(
    orderBy: UPDATETIME_DESC
    first: 1
    filter: {siloId: {equalTo: $id}}
  ) {
    nodes {
      updatetime
    }
  }
}
`;
const getLatestDateFC = `subscription MySubscription ($id:Int!){
  allProbeHistories(
    orderBy: UPDATETIME_ASC
    first: 1
    filter: {siloId: {equalTo: $id}}
  ) {
    nodes {
      updatetime
    }
  }
}
`;
const getMaxDate = `subscription MySubscription ($id:Int!){
  allProbeHistories(
    orderBy: UPDATETIME_DESC
    first: 1
    filter: {siloId: {equalTo: $id}}
  ) {
    nodes {
      updatetime
    }
  }
}
`;
//end of new queries by basavaraj


const Report = ({ id }) => {
  const [thresholds, setThresholds] = useState();
  const [parameters, setParameters] = useState();
  const matches = useMediaQuery("(max-width:600px)");

  // console.log("id : ",id)
  // console.log("siloID : ",siloID)

  //new useState() by basavaraj
  const [selectedDate, setSelectedDate] = useState();
  console.log("selectedDate : ", selectedDate);
  const nextDay = moment(selectedDate).add(1, "days").format("YYYY-MM-DD");
  console.log("nextDayValue : ", nextDay);
  const [latestDate, setLatestDate] = useState();
  console.log("latestDate : ", latestDate);
  const [maxDate, setMaxDate] = useState();
  console.log("maxDate : ", maxDate);

  //dateArray is used to get all the updatetimes from the database
  const [dateArray, setDateArray] = useState("");
  // console.log("dateArray : ", dateArray);
  const [showDateArray, setShowDateArray] = useState(false);
  // console.log('Show Dropdown Status : ',showDateArray);
  //end of new useState() by basavaraj

  //new functions by basavaraj
  const handleDateChange = (dateChange) => {
    setSelectedDate(dayjs(dateChange).format("YYYY-MM-DD"));
    setFormState({
      time: "",
      name: "null",
    });
  };

  // const classes = useStyles();
  const [formState, setFormState] = useState({
    time: "",
    name: "null",
  });

  // console.log("formState : ",formState);

  const handleChange = (event) => {
    const name = event.target.name;
    setFormState({
      ...formState,
      [name]: event.target.value,
    });
  };

  //end new functions by basavaraj

  const [allthresholdSubscriptionResult, allthresholdSubscriptionResultAgain] =
    useSubscription({
      query: threshold,
      variables: {
        id,
      },
    });

  const {
    data: thresholddataQuery,
    fetching: thresholdfetchingQuery,
    error: thresholderrorQuery,
  } = allthresholdSubscriptionResult;

  useEffect(() => {
    if (thresholddataQuery) {
      // console("array1 : ");
      setThresholds(thresholddataQuery.allThresholdSettings.nodes);
      //  refresh();
    }
  }, [thresholddataQuery]);

  const [allparameterSubscriptionResult, allparameterSubscriptionResultAgain] =
    useSubscription({
      query: parameterSubscription,
      variables: {
        id,
      },
    });

  const {
    data: dataQuery,
    fetching: fetchingQuery,
    error: errorQuery,
  } = allparameterSubscriptionResult;

  useEffect(() => {
    if (dataQuery) setParameters(dataQuery.allGraindetails.nodes);
    //  refresh();
  }, [dataQuery]);

  //// new code by basavaraj
  const [allResult, allResultAgain] = useSubscription({
    query: probeHistory,
    variables: {
      selectedDate,
      nextDay,
    },
  });

  const {
    data: dataHistoryQuery,
    fetching: fetchingHistoryQuery,
    error: errorHistoryQuery,
  } = allResult;

  if (errorHistoryQuery) console.log(errorHistoryQuery);

  useEffect(() => {
      if(dataHistoryQuery) {
        // console("array1 : ");
        // const array1 = [...new Set((dataHistoryQuery.allProbeHistories.nodes).reverse().map(item => item.updatetime))];
        const array = [...new Set((dataHistoryQuery.allProbeHistories.nodes).map(item => item.updatetime).map(function(d) { return moment(d).format('hh:mm'); }))];

        if(array.length !== 0)
        {
          setDateArray(array);
          setShowDateArray(true);
        }else{
          setShowDateArray(false);
        }

      }

    }, [dataHistoryQuery])

  const [latestDateSub, latestDateSubAgain] = useSubscription({
    query: getLatestDate,
    variables: {
      id,
    },
  });

  const {
    data: dataLatestDateQuery,
    fetching: fetdataLatestDateQuery,
    error: errorLatestDateQuery,
  } = latestDateSub;

  if (errorLatestDateQuery) console.log(errorLatestDateQuery);

  useEffect(() => {
    if (dataLatestDateQuery) {
      // console("array1 : ");
      setSelectedDate(
        moment(
          dataLatestDateQuery.allProbeHistories.nodes[0]?.updatetime
        ).format("YYYY-MM-DD")
      );
      // setLatestDate(moment(dataLatestDateQuery.allProbeHistories.nodes[0].updatetime).format('YYYY-MM-DD'));
    }
  }, [dataLatestDateQuery]);
  ////
  const [latestDateSubFC, latestDateSubAgainFC] = useSubscription({
    query: getLatestDateFC,
    variables: {
      id,
    },
  });

  const {
    data: dataLatestDateFCQuery,
    fetching: fetdataLatestDateFCQuery,
    error: errorLatestDateFCQuery,
  } = latestDateSubFC;

  if (errorLatestDateFCQuery) console.log(errorLatestDateFCQuery);

  useEffect(() => {
    if (dataLatestDateFCQuery) {
      setLatestDate(
        moment(
          dataLatestDateFCQuery.allProbeHistories.nodes[0]?.updatetime
        ).format("YYYY-MM-DD")
      );
    }
  }, [dataLatestDateFCQuery]);

  ////
  const [maxDateSub, maxDateSubAgain] = useSubscription({
    query: getMaxDate,
    variables: {
      id,
    },
  });

  const {
    data: dataMaxDateQuery,
    fetching: fetchingMaxDateQuery,
    error: errorMaxDateQuery,
  } = maxDateSub;

  if (errorMaxDateQuery) console.log(errorMaxDateQuery);

  useEffect(() => {
    if (dataMaxDateQuery) {
      setMaxDate(
        moment(dataMaxDateQuery.allProbeHistories.nodes[0]?.updatetime).format(
          "YYYY-MM-DD"
        )
      );
    }
  }, [dataMaxDateQuery]);

  const refresh = () => {
    // Refetch the query and skip the cache
    allResultAgain({ requestPolicy: "cache-and-network" });
  };

  useEffect(() => {
    refresh();
  }, [selectedDate]);

  //// end of new code by basavaraj
  // new JSX by basavaraj
  const DateDetails = () => {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box display="flex" justifyContent="center">
          {/* <DatePicker
          label="Check Probe History"
          format="yyyy/MM/dd"
          value={selectedDate}
          onChange={(newDate) => handleDateChange(newDate)}
          minDate={new Date(latestDate)}
          maxDate={new Date(maxDate)}
          renderInput={(params) => <TextField {...params} helperText="" />}
        /> */}
          <DatePicker
            margin="normal"
            id="date-picker-dialog"
            // label="Check Probe History"
            format="YYYY/MM/DD"
            value={dayjs(selectedDate)}
            onChange={handleDateChange}
            minDate={dayjs(latestDate)}
            maxDate={dayjs(maxDate)}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
            // variant="text"
          />

          {showDateArray && (
            <StyledFormControl variant="standard" style={{ marginTop: "-1px" }}>
              <InputLabel htmlFor="time-native-simple"></InputLabel>
              <Select
                variant="outlined"
                native
                value={formState.time}
                onChange={handleChange}
                inputProps={{
                  name: "time",
                  id: "time-native-simple",
                }}
              >
                {dateArray.map((item, i) => (
                  <option
                    style={{
                      textAlign: "center",
                      color: "white",
                      backgroundColor: "#4B4A54",
                    }}
                    key={i}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </Select>
            </StyledFormControl>
          )}
        </Box>
      </LocalizationProvider>
    );
  };

  //// end of new JSX by basavaraj

  const componentRef = useRef();

  const ComponentToPrint = React.forwardRef((props, ref) => (
    <div
      style={{
        width: matches ? "395px" : "auto",
        paddingTop: "10px",
        margin: "auto",
        marginTop:""
      }}
      ref={ref}
      className="print-source"
    >
      <h3 style={{ color: "black", textAlign: "center", fontWeight: "bold" }}>
        SILO {id}
      </h3>
      <div>
        <DateDetails />
      </div>

      <div style={{ paddingLeft: "25px", fontWeight: "bold" }}>
        <div>Grain : {parameters && parameters[0].grains}</div>
        <div>Variety : {parameters && parameters[0].veriety}</div>
        <div>Density : {parameters && parameters[0].density}</div>
        <div>Comments : {parameters && parameters[0].comment} </div>
        <div style={{ height: "20px" }}></div>
        <div>
          Alerts : Temperature Max{" "}
          <span style={{ color: "red" }}>
            {thresholds && thresholds[0].tempHigh}°C
          </span>
          , Low Moisture{" "}
          <span style={{ color: "orange" }}>
            {thresholds && thresholds[0].moistureLow}RH
          </span>
          , High Moisture{" "}
          <span style={{ color: "green" }}>
            {thresholds && thresholds[0].moistureHigh}RH
          </span>
          .
        </div>
        <div>
          Date : {moment(selectedDate).format("DD-MM-YYYY")} , Time :{" "}
          {showDateArray && formState.time === ""
            ? dateArray[0]
            : formState.time !== ""
            ? formState.time
            : null}
        </div>
        {/* <div>Ventilation Mode : OFF</div> */}
      </div>
      {/* <ProbeStats siloDetails={siloDetails} match={match} /> */}
      <ReportStats
        // siloDetails={siloDetails}
        // match={match}
        id={id}
        formState={formState}
        dateArray={dateArray}
        showDateArray={showDateArray}
        selectedDate={selectedDate}
      />
    </div>
  ));
  return (
    <>
      <div
        style={{
          margin: "15px",
          backgroundColor: "#B3C99C",
          minHeight: "60vh",
          marginTop: "10px",
          borderRadius: "5px",
        }}
      >
        {/* <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <DateDetails />
        </div> */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingRight: "2px",
          }}
        >
          <ReactToPrint
            trigger={() => (
              <div>
                {/* <span style={{ fontSize: "16px", paddingRight: "2px" }}>
                  print report
                  <DirectionsOutlinedIcon />
                </span> */}
                <Button
                  color="primary"
                  style={{ padding: "2.5px 7.5px", cursor: "pointer" }}
                >
                  <LocalPrintshopOutlinedIcon
                    style={{ color: "white", fontSize: "34px" }}
                  />
                </Button>
              </div>
            )}
            content={() => componentRef.current}
          />
        </div>
        <ComponentToPrint ref={componentRef} />
      </div>
    </>
  );
};

export default Report;
