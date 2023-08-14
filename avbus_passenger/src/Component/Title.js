import React from "react"; 
import { Typography } from "@mui/material"

const Title = ({mission_name}) => {
    return (
        // <Typography sx={{fontSize:80 ,  textAlign:"center"}}>
        <Typography sx={{fontSize:80  ,marginLeft:20,fontWeight:"bold" ,fontFamily:"-apple-system" ,  color:"gold"  } } > 
            {`Route-${mission_name}`}
        </Typography>
    ) 
}

export default Title; 