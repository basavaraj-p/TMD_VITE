import React from 'react'
import ProbeTabs from './ProbeTabs'
import { useMediaQuery } from '@mui/material';

const ProbeStats = ({id,siloDetails}) => {
    const matches = useMediaQuery("(max-width:600px)");

  return (
    <div style={{ marginTop: matches ? "20px" : "-30px"}}>
      <ProbeTabs siloDetails={siloDetails} id={id} />
    </div>
  );
}

export default ProbeStats