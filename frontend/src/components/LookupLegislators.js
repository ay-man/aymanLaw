import React, { useEffect  } from 'react';
import Typography from '@material-ui/core/Typography';
import LookupModule from './LookupModule.js'
import Spacer from './Spacer'
import './LookupLegislators.css'

export default function LookupLegislators(props){
 
  useEffect(() => {
  },[props?.data]);

  return (
    <div id="legislatorContainer">
      <Typography variant='h3' id='legislator'>Lookup Legislator Tool</Typography>
      <Spacer />
      <LookupModule data={props.data}/>
      <Spacer />
    </div>
  );
}