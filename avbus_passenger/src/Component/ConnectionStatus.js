import React from "react" ; 
import { Avatar,Box } from "@mui/material";


const connection_success = require("../media/wifi.png");
const connection_fail= require("../media/no_wifi.png");

const ConnectionStatus = ({connectionState}) => {
    const text = connectionState? "Connection : Success":"Connection : Error" 
    const src = connectionState? connection_success:connection_fail ; 
    // const src = connectionState? "../media/wifi.png":"../media/no_wifi.png"
    return (
        <Box display="flex" sx={{alignItems:"center" ,justifyContent:"center" }}  >
        {/* <Box > */}
            {/* <h1>{text}</h1> */}
            {/* <Typography sx={{fontSize:40, fontWeight:700 ,display:"inline", textAlign:"center"}}>{text}</Typography> */}
            <Avatar alt={"connection-state"} src={src} sx={{width:50 ,height:50,left:35 }}/>
        </Box>
    )
}

export default ConnectionStatus