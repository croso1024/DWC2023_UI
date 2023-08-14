import React  from 'react' ; 
import Clock from './Clock';
import ConnectionStatus from './ConnectionStatus';
import {Grid , Box } from '@mui/material' ; 

const Status = ({connectionState}) =>{

    // return (
    //     <Grid container >
    //         <Clock />
    //         <ConnectionStatus connectionState={connectionState} />  
    //     </Grid>
            
    // )

    return (
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={4}>
            <Box display="flex" justifyContent="center">
              <Clock />
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box display="flex" justifyContent="center">
              <ConnectionStatus connectionState={connectionState} />
            </Box>
          </Grid>
        </Grid>
      );

};

export default Status ; 