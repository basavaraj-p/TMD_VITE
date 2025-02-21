import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Grid,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useEffect } from "react";

const DateSelectionCard = ({
  selectedDate,
  setSelectedDate,
  dateArray,
  setTime,
  time,
  reportRef,
  id,
  status,
}) => {
  // const [value, setValue] = React.useState(moment("2022-04-17"));
  // console.log("dateArray : ", dateArray);
  const handlePrint = () => {
    const input = reportRef.current;
    html2canvas(input, { scale: 1 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(
        `${"VIJAYANAGAR BIOTEH"} Silo ${id} Report on ${moment(selectedDate).format(
          "YYYY-MM-DD"
        )} at ${time}.pdf`
      );
    });
  };

  // function daily_report_sender(status) {
  //   if (status === true) {
  //     // send pdf file
  //     handlePrint();
  //   }
  // }

  // useEffect(() => {
  //   const intervalId = setInterval(daily_report_sender(status), 5 * 60 * 1000);
  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, [status]);

  return (
    <Card
      sx={{
        width: "auto",
        height: "auto",
        backgroundColor: "#f3fde8",
        color: "black",
        margin: "2%",
      }}
    >
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "5%" }}
      >
        <Typography variant="h5" color="black" fontWeight="bold">
          Date and Time Selection
        </Typography>
      </div>
      <CardContent>
        <Grid container spacing={1} justifyContent="space-between">
          <Grid item xs={7}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                label="Select Date"
                format="YYYY-MM-DD"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={5}>
            {dateArray && (
              <TextField
                id="outlined-select-currency"
                select
                label="Select"
                // value={dateArray[0]}
                defaultValue={time}
                helperText="Please select a time"
                onChange={(event) => {
                  setTime(event.target.value);
                }}
              >
                {dateArray &&
                  dateArray.map((value, index) => (
                    <MenuItem key={index} value={value}>
                      {value}
                    </MenuItem>
                  ))}
              </TextField>
            )}
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              endIcon={<DownloadIcon />}
              onClick={handlePrint}
              disableTouchRipple
            >
              DOWNLOAD REPORT
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DateSelectionCard;
