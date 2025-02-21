import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { siloContentsForBasavaraj } from "../../Firebase/readData";
import { siloSurfaceForBasavaraj } from "../../Firebase/readData";
import SiloVisualize from "./SiloVisualize";
import GaugeCharts from "./GaugeCharts";
import VolumeVSTime from "./VolumeVSTime";
import Progress from "./Progress";
import axios from "axios";
// import { Scatter } from "../../Firebase/readData";
import { useQuery, useMutation, useSubscription } from "urql";

const configQuery = `subscription MySubscription($id:Int!) {
  allSiloConfigs(filter: {siloId: {equalTo: $id}}) {
    nodes {
      cableDensity
      cables
      caliberate
      density
      frustrumRadius
      heightCone
      heightCylinder
      radius
      siloId
      stepsToBeDecremented
      tiltedXAngle
      tiltedYAngle
      tiltedZAngle
      tmdRadius
      topHeightCone
      zLinspace
    }
  }
}
`;

const Index3D = ({ id }) => {
  const [config, setConfig] = useState();
  // console.log("config : ", config);
  const [siloContents, setSiloContents] = useState([]);
  // console.log("siloContents : ", siloContents);
  const [surfaceData, setSurfaceData] = useState([]);
  //   console.log("surfaceData : ", surfaceData);
  const [checkTime, setCheckTime] = useState([]);
  // console.log("checkTime : ", checkTime);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  // console.log("isButtonDisabled : ", isButtonDisabled);
  // console.log("id : ", id);
  // console.log("Scatter : ", Scatter);

  const [allconfigSubscriptionResult, allconfigSubscriptionResultAgain] =
    useSubscription({
      query: configQuery,
      variables: {
        id,
      },
    });

  const {
    data: dataConfigQuery,
    fetching: fetchingConfigQuery,
    error: errorConfigQuery,
  } = allconfigSubscriptionResult;

  useEffect(() => {
    if (dataConfigQuery) setConfig(dataConfigQuery.allSiloConfigs.nodes);
    //  refresh();
  }, [dataConfigQuery]);

 useEffect(() => {
   const fetchData = async () => {
     try {
       const response = await axios.get(
         `http://localhost:3050/api/scheduler/${id}`
       );
       setCheckTime(response.data);
      //  console.log(Date.now());
     } catch (error) {
       console.error("Error fetching data", error);
     }
   };

   // Fetch data initially
   fetchData();

   // Set interval to fetch data every 10 seconds
   const intervalId = setInterval(fetchData, 10000);

   return () => {
     // Cleanup interval on component unmount
     clearInterval(intervalId);
   };
 }, [id]);


  useEffect(() => {
    const checkButtonStatus = () => {
      let isDisabled = false;

      checkTime.forEach((row) => {
        const [hour, minute] = row.time.split(":");
        let currentDatetime = new Date();
        let currentHour = currentDatetime.getHours();
        let currentMinute = currentDatetime.getMinutes();

        if (
          (currentHour === Number(hour) && currentMinute >= Number(minute)) ||
          (currentHour === Number(hour) + 1 && currentMinute < Number(minute))
        ) {
          // If the current time is equal to or after the scheduled time
          // and before the next hour, disable the button
          console.log(`Scan is scheduled at time: ${hour}:${minute}`);
          isDisabled = true;
        }
      });

      setIsButtonDisabled(isDisabled);
    };

    checkButtonStatus(); // Initial check

    // Set up an interval to check the button status every minute
    const intervalId = setInterval(checkButtonStatus, 10000);

    return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  }, [checkTime]);

  useEffect(() => {
    // setSiloContents(siloContentsForBasavaraj);
    setSurfaceData(siloSurfaceForBasavaraj);
  }, []);

  useEffect(() => {
    axios
      //   .get("http://localhost:3002/api/jsonvolume")
      .get("http://localhost:3002/api/data")
      .then((response) => {
        setSiloContents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div>
      {siloContents.length !== 0 ? (
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <div style={{ marginTop: "-50px", position: "relative" }}>
            <SiloVisualize
              siloContents={siloContents}
              surfaceData={surfaceData}
              // scatterPoints={Scatter}
              config={config}
            />
          </div>
          <div>
            <div>
              <GaugeCharts siloId={id} isButtonDisabled={isButtonDisabled}/>
            </div>
            <div>
              <VolumeVSTime />
            </div>
          </div>
        </div>
      ) : (
        <Progress />
      )}
    </div>
  );
};

export default Index3D;
