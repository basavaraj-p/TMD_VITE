import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useQuery } from 'urql'
import { Grid } from '@mui/material'
import SiloContainer from './SiloContainer'

const AllSilos = `query {
  allCurrentSensorValues {
    nodes {
      siloId
    }
  }
}
`;

const Layout = () => {

    const [allSilos, setAllSilos] = useState([]);
    // console.log("allSilos: ", allSilos);

    const [allSilosResult, allSilosResultAgain] = useQuery({
      query: AllSilos,
    });

    const { data, fetching, error } = allSilosResult;

    useEffect(() => {
      if (data) setAllSilos(data.allCurrentSensorValues.nodes);
    }, [data]);

    if (fetching) return <h1>Loading...</h1>;
    if (error) return <h1>Oh no...{error.message}</h1>;

    let allSilosId = [];

    for (let node of allSilos) {
      for (let key in node) {
        if (key === "siloId") allSilosId.push(node[key]);
      }
    }
    // console.log("allSilosId: ", allSilosId);

    let uniqueSilosId = [...new Set(allSilosId)];
    // console.log("uniqueSilosId: ", uniqueSilosId);

    let Silos = uniqueSilosId.map((siloid) => {
      return { id: siloid, name: `Silo -${siloid}` };
    });

    // console.log("AllSilos...123 ", Silos);


 
return (
  <Grid container spacing={2}>
    {" "}
    {/* This provides space between grid items */}
    {Silos.map((silo) => (
      <Grid item xs={12} sm={6} key={silo.id}>
        {" "}
        {/* xs={6} means half of the available width */}
        <SiloContainer silo={silo} />
      </Grid>
    ))}
  </Grid>
);

}

export default Layout