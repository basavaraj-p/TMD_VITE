import React, { useEffect, useState } from "react";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import { TableBody, TableHead, TableRow, TableCell } from "@mui/material";
// import TableCell from '@mui/material';
import { useQuery, useSubscription } from "urql";
import moment from "moment";
import { useMediaQuery } from "@mui/material";

//// new queries by basavaraj
const ProbeHistoryValues = `subscription($id:Int!) {
  allProbeHistories(filter: {siloId: {equalTo: $id}}, orderBy: PROBE_ID_ASC) {
    nodes {
      probeId
      sensorId
      siloId
      updatetime
      value
    }
  }
}`;

const HumidityHistoryValues = `subscription($id:Int!){
    allHumidityHistories(filter: {siloId: {equalTo: $id}}, orderBy: SENSOR_ID_ASC) {
      nodes {
        updatetime
        siloId
        probeId
        relHumidity
        tempValue
        sensorId
      }
    }
  }`;
//// end of new queries by basavaraj

let tHeader = [
  "P1",
  "P2",
  "P3",
  "P4",
  "P5",
  "P6",
  "P7",
  "P8",
  "P9",
  "P10",
  "P11",
  "P12",
  "P13",
  "P14",
  "P15",
  "P16",
  "P17",
  "P18",
  "P19",
];
let tHeader2 = [
  "SENSOR",
  "P1",
  "P2",
  "P3",
  "P4",
  "P5",
  "P6",
  "P7",
  "P8",
  "P9",
  "P10",
  "P11",
  "P12",
  "P13",
  "P14",
  "P15",
  "P16",
  "P17",
  "P18",
  "P19",
];

let HHeader = [
  "Probes",
  "S1",
  "S2",
  "S3",
  "S4",
  "S5",
  "S6",
  "S7",
  "S8",
  "S9",
  "S10",
  "S11",
];

const ReportStats = ({ id, formState, dateArray, showDateArray }) => {
  //new useState() by basavaraj
  const [humidity, setHumidity] = useState([]);
  // console.log("humidity : ",humidity)
  const [allProbes, setAllProbes] = useState([]);
  // console.log('allProbes: ', allProbes);
  const [checkHumidity, setCheckHumidity] = useState(false);
  // console.log("checkHumidity : ",checkHumidity);
  const [checkTemperature, setCheckTemperature] = useState(false);
  // console.log("checkTemperature : ",checkTemperature)
  const [checkH, setCheckH] = useState(false);
  // console.log("checkH : ",checkH)
  const [checkT, setCheckT] = useState(false);
  // console.log("CheckT : ",checkT)
  // end of new useState() by basavaraj
  const matches = useMediaQuery("(max-width:600px)");

  const humidityValues = [];
  if (humidity) {
    for (var i = 0; i < humidity.length; i++) {
      if (i % 2 === 0) {
        humidityValues.push(humidity[i]);
      }
    }
  }
  let THeader = [];
  if (humidity) {
    let SHeader = [];

    for (let node of humidity) {
      for (let key in node) {
        if (key === "sensorId") {
          SHeader.push(node[key]);
        }
      }
    }

    let newSHeader = [...new Set(SHeader)];
    THeader = newSHeader.map((item, i) => `S${i + 1}`);
  }

  THeader.unshift("SENSOR");

  const [allHumidityResult, allHumidityResultAgain] = useSubscription({
    query: HumidityHistoryValues,
    variables: {
      id,
    },
  });

  const {
    data: humidityQuery,
    fetching: humidityfetchingQuery,
    error: humidityerrorQuery,
  } = allHumidityResult;

  useEffect(() => {
    if (humidityQuery) {
      setHumidity(humidityQuery.allHumidityHistories.nodes);
      //  refresh();
    }
  }, [humidityQuery]);

  //new code by basavaraj

  for (var i = 0; i < 11; i++) {
    let siloProbeIndex;
    if (i < 9) {
      siloProbeIndex = `0${i + 1}`;
    } else {
      siloProbeIndex = `${i + 1}`;
    }
    // console.log('siloProbeIndex: ', siloProbeIndex);
  }

  const [allProbesResult, allProbesResultAgain] = useSubscription({
    query: ProbeHistoryValues,
    variables: {
      id,
    },
  });

  const {
    data: dataQuery,
    fetching: fetchingQuery,
    error: errorQuery,
  } = allProbesResult;

  useEffect(() => {
    if (dataQuery) setAllProbes(dataQuery.allProbeHistories.nodes);
  }, [dataQuery]);

  let sensorId = [];
  //change the value of humidity to allProbes
  for (let node of allProbes) {
    for (let key in node) {
      if (key === "sensorId") {
        sensorId.push(node[key]);
      }
    }
  }

  let uniquesensorId = [...new Set(sensorId)];
  uniquesensorId.sort(function (a, b) {
    return a - b;
  });
  // console.log('uniquesensorId: ', uniquesensorId);

  // temperature table map code
  let checkDatas = [];

  let NewSiloDetails = uniquesensorId.map((sensorId) => {
    let datas = [];
    if (showDateArray && formState.time !== "") {
      allProbes.forEach((data) => {
        if (
          data.sensorId === sensorId &&
          moment(data.updatetime).format("hh:mm") === formState.time
        ) {
          datas.push({
            [`${data.probeId}`]: parseFloat(data.value).toFixed(2),
          });
          checkDatas.push(parseFloat(data.value).toFixed(2));
        }
      });
    } else if (showDateArray && formState.time === "") {
      allProbes.forEach((data) => {
        if (
          data.sensorId === sensorId &&
          moment(data.updatetime).format("hh:mm") === dateArray[0]
        ) {
          datas.push({
            [`${data.probeId}`]: parseFloat(data.value).toFixed(2),
          });
          checkDatas.push(parseFloat(data.value).toFixed(2));
        }
      });
    }
    return { sensor: sensorId, datas: datas };
  });
  // end of temperature table map code
  // console.log("formState.time : ",formState)
  // console.log("checkDatas : ",checkDatas)
  console.log("NewSiloDetails : ", NewSiloDetails);

  const CDArray = [...new Set(checkDatas)];
  // console.log("CDArray : ",CDArray)

  useEffect(() => {
    if (NewSiloDetails)
      if (checkDatas.length !== 0) {
        setCheckTemperature(true);
      } else {
        setCheckTemperature(false);
      }

    if (CDArray[0] !== "NaN" && CDArray.length !== 1) {
      setCheckT(true);
    } else {
      setCheckT(false);
    }
  }, [NewSiloDetails]);

  ////
  // NOTE: working code V-by-Anoop 2.0....
  let n = 0;
  NewSiloDetails.map((item, index) => {
    if (item.datas.length > n) {
      n = item.datas.length;
    }
  });

  // const TableHeadValues = header[0].map((items)=> items);
  const TableHeadValues = tHeader.slice(0, n).map((items) => items);

  TableHeadValues.unshift("SENSOR");
  // console.log("TableHeadValues : ",TableHeadValues);
  // console.log("tHeader2 : ",tHeader2);

  //code for the humidity table

  let probeId = [];

  for (let node of humidity) {
    for (let key in node) {
      if (key === "probeId") {
        probeId.push(node[key]);
      }
    }
  }

  let uniqueprobeId = [...new Set(probeId)];

  // console.log('uniqueprobeId: ', uniqueprobeId);

  // humidity table map code
  let checkHumidityDatas = [];
  let checkTempDatas = [];

  const HumidityValues = uniqueprobeId.map((probeId) => {
    let humidityDatas = [];
    let tempDatas = [];

    if (showDateArray && formState.time !== "") {
      humidity.forEach((data) => {
        if (
          data.probeId === probeId &&
          moment(data.updatetime).format("hh:mm") === formState.time
        ) {
          humidityDatas.push({
            [`${data.sensorId}`]: parseFloat(data.relHumidity).toFixed(2),
          });
          tempDatas.push({
            [`${data.sensorId}`]: parseFloat(data.tempValue).toFixed(2),
          });

          checkHumidityDatas.push(parseFloat(data.relHumidity).toFixed(2));
          checkTempDatas.push(parseFloat(data.tempValue).toFixed(2));
        }
      });
    } else if (showDateArray && formState.time === "") {
      humidity.forEach((data) => {
        if (
          data.probeId === probeId &&
          moment(data.updatetime).format("hh:mm") === dateArray[0]
        ) {
          humidityDatas.push({
            [`${data.sensorId}`]: parseFloat(data.relHumidity).toFixed(2),
          });
          tempDatas.push({
            [`${data.sensorId}`]: parseFloat(data.tempValue).toFixed(2),
          });

          checkHumidityDatas.push(parseFloat(data.relHumidity).toFixed(2));
          checkTempDatas.push(parseFloat(data.tempValue).toFixed(2));
        }
      });
    }
    return {
      probeId: probeId,
      humidityDatas: humidityDatas,
      tempDatas: tempDatas,
    };
  });
  console.log("HumidityValues", HumidityValues);
  // end of humidity table map code

  const HArray = [...new Set(checkHumidityDatas)];
  // console.log("HArray : ",HArray)
  const TArray = [...new Set(checkTempDatas)];
  // console.log("TArray : ",TArray);

  useEffect(() => {
    if (HumidityValues)
      if (checkHumidityDatas.length !== 0 && checkTempDatas.length !== 0) {
        setCheckHumidity(true);
      } else {
        setCheckHumidity(false);
      }

    if (
      (HArray[0] !== "NaN" && HArray.length !== 1) ||
      (TArray[0] !== "NaN" && TArray.length !== 1)
    ) {
      setCheckH(true);
    } else {
      setCheckH(false);
    }
  }, [HumidityValues]);

  //// end of code for the humidity table
  if (errorQuery) return <p>Oh No...{errorQuery.message}</p>;

  ////
  //end of new code by basavaraj
  return (
    <div style={{ marginTop: "10px", padding: "10px" }}>
      <div style={{ fontWeight: "bold", fontSize: "18px" }}>
        TEMPERATURE STATS
      </div>
      <TableContainer
        component={Paper}
        elevation={4}
        style={{
          maxHeight: matches ? "640px" : "none",
          maxWidth: matches ? "395px" : "auto",
          backgroundColor: "#F3FDE8",
        }}
      >
        {checkTemperature && checkT ? (
          <Table
            className="table-bordered table-striped"
            aria-label="customized table"
          >
            <TableHead>
              <TableRow>
                {TableHeadValues.map((tHead, index) => (
                  <td
                    key={index}
                    style={{
                      fontWeight: "bold",
                      height: "50px",
                      backgroundColor: "#4B4A54",
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    {tHead}
                  </td>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {NewSiloDetails.map((dataItem, index) => {
                return (
                  <TableRow key={index}>
                    <td style={{ fontWeight: "bold", textAlign: "center" }}>
                      S{index + 1} (°C)
                    </td>

                    {dataItem.datas.map((probeItem, index) => {
                      //
                      // let item = () => {probeItem[`T${index}`]}
                      return (
                        <td
                          key={index}
                          style={{
                            fontWeight: "bold",
                            fontSize: "16px",
                            color:
                              probeItem[`P${index + 1}`] >= 45
                                ? "red"
                                : "black",
                            textAlign: "center",
                          }}
                        >
                          {/* {probeItem[`T${index}`] == -273 ? 27 : probeItem[`T${index}`]} */}
                          {
                            <div>
                              {index + 1 < 10
                                ? probeItem[`${index + 11}`]
                                : probeItem[`${index + 11}`]}
                            </div>
                          }
                        </td>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <Table
            className="table-bordered table-striped"
            aria-label="customized table"
          >
            <TableHead>
              {checkT ? (
                <TableRow>
                  {tHeader2.map((tHead, index) => (
                    <td
                      key={index}
                      style={{
                        fontWeight: "bold",
                        height: "50px",
                        backgroundColor: "#4B4A54",
                        color: "white",
                        textAlign: "center",
                      }}
                    >
                      {tHead}
                    </td>
                  ))}
                </TableRow>
              ) : (
                <TableRow>
                  {TableHeadValues.map((tHead, index) => (
                    <td
                      key={index}
                      style={{
                        fontWeight: "bold",
                        height: "50px",
                        backgroundColor: "#4B4A54",
                        color: "white",
                        textAlign: "center",
                      }}
                    >
                      {tHead}
                    </td>
                  ))}
                </TableRow>
              )}
            </TableHead>
            <TableBody>
              <TableRow>
                {showDateArray === false && checkT === true ? (
                  <td
                    colSpan={20}
                    style={{
                      fontWeight: "bold",
                      fontSize: "15px",
                      height: "200px",
                      backgroundColor: "white",
                      color: "black",
                      textAlign: "center",
                    }}
                  >
                    No Records to display
                  </td>
                ) : (
                  <td
                    colSpan={20}
                    style={{
                      fontWeight: "bold",
                      fontSize: "15px",
                      height: "200px",
                      backgroundColor: "white",
                      color: "black",
                      textAlign: "center",
                    }}
                  >
                    No Records to display at{" "}
                    {formState.time === "" ? dateArray[0] : formState.time}
                  </td>
                )}
              </TableRow>
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <div style={{ fontWeight: "bold", fontSize: "18px", marginTop: "50px" }}>
        HUMIDITY STATS
      </div>
      <TableContainer
        component={Paper}
        elevation={4}
        style={{
          maxHeight: matches ? "640px" : "440px",
          backgroundColor: "#F3FDE8",
          maxWidth: matches ? "395px" : "auto",
        }}
      >
        {checkHumidity && checkH ? (
          <Table
            className="table-bordered table-striped"
            aria-label="customized table"
          >
            <TableHead>
              <TableRow>
                {THeader.map((HHead, index) => (
                  <td
                    key={index}
                    style={{
                      fontWeight: "bold",
                      height: "50px",
                      backgroundColor: "#4B4A54",
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    {HHead}
                  </td>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {HumidityValues.map((dataItem, index) => {
                return (
                  <TableRow key={index}>
                    <td style={{ fontWeight: "bold", textAlign: "center" }}>
                      Moisture(RH)
                    </td>
                    {dataItem.humidityDatas.map((probeItem, index) => {
                      return (
                        <td
                          key={index}
                          style={{
                            fontWeight: "bold",
                            color: "black",
                            textAlign: "center",
                          }}
                        >
                          {index + 1 < 0
                            ? probeItem[`${index + 1}`]
                            : probeItem[`${index + 1}`]}
                        </td>
                      );
                    })}
                  </TableRow>
                );
              })}

              {HumidityValues.map((dataItem, index) => {
                return (
                  <TableRow key={index}>
                    <td style={{ fontWeight: "bold", textAlign: "center" }}>
                      Temperature(°C)
                    </td>
                    {dataItem.tempDatas.map((probeItem, index) => {
                      return (
                        <td
                          key={index}
                          style={{
                            fontWeight: "bold",
                            color: "black",
                            textAlign: "center",
                          }}
                        >
                          {index + 1 < 0
                            ? probeItem[`${index + 1}`]
                            : probeItem[`${index + 1}`]}
                        </td>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <Table
            className="table-bordered table-striped"
            aria-label="customized table"
          >
            <TableHead>
              {checkH ? (
                <TableRow>
                  {THeader.map((HHead, index) => (
                    <td
                      key={index}
                      style={{
                        fontWeight: "bold",
                        height: "50px",
                        backgroundColor: "#4B4A54",
                        color: "white",
                        textAlign: "center",
                      }}
                    >
                      {HHead}
                    </td>
                  ))}
                </TableRow>
              ) : (
                <TableRow>
                  {THeader.map((HHead, index) => (
                    <td
                      key={index}
                      style={{
                        fontWeight: "bold",
                        height: "50px",
                        backgroundColor: "#4B4A54",
                        color: "white",
                        textAlign: "center",
                      }}
                    >
                      {HHead}
                    </td>
                  ))}
                </TableRow>
              )}
            </TableHead>
            <TableBody>
              <TableRow>
                {/* <td></td> */}
                {showDateArray === false && checkH === true ? (
                  <td
                    colSpan={15}
                    style={{
                      fontWeight: "bold",
                      fontSize: "15px",
                      height: "90px",
                      backgroundColor: "white",
                      color: "black",
                      textAlign: "center",
                    }}
                  >
                    No Records to display
                  </td>
                ) : (
                  <td
                    colSpan={15}
                    style={{
                      fontWeight: "bold",
                      fontSize: "15px",
                      height: "90px",
                      backgroundColor: "white",
                      color: "black",
                      textAlign: "center",
                    }}
                  >
                    No Records to display at{" "}
                    {formState.time === "" ? dateArray[0] : formState.time}
                  </td>
                )}
              </TableRow>
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </div>
  );
};

export default ReportStats;
