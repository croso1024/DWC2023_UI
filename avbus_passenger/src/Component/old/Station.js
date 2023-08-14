import React from 'react'; 
import {Box,Card , CardContent , Typography,CardMedia} from "@mui/material";


// const station_img = require("../media/busStop.png") ; 
// const station_img = require("../media/test.gif") ; 
const station_img = require("../media/bus.png") ; 
const Station = ({station_name , station_state}) => {

    return (
        <Box sx={{backgroundColor: 'transparent'}}>
          <CardContent>
            <Box display="flex" flexDirection="column" alignItems="center">
              <CardMedia component="img"  image={station_img} 
              sx={{width:75,height:65 , maxHeight:80,maxWidth:80}} alt={station_name} />
              <Typography gutterBottom variant="h5" component="div">
                {station_name}
              </Typography>
              <Typography variant="body2">
                {station_state}
              </Typography>
            </Box>
          </CardContent>
        </Box>
      );
}; 

export default Station ; 
