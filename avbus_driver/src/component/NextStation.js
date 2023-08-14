import React from "react" ; 
import { Typography , Box } from "@mui/material";
import {Resolution} from "../ResolutionSetting" ; 



const getDisplayConfig = (resolution) => {
    if (resolution == "1080") {
        return {
            TypoFont : 55 
        }
    }
    else 
        if  (resolution =="768") {
        return {
            TypoFont : 30 
        }
    }
}

const displayConfig = getDisplayConfig(Resolution) ; 

const NextStation = ({next_depot_name , eta}) => {

    if (next_depot_name) {

        if (eta <= 60) {
            return (
                <div className={"NextStation"}>
                <Box>
                    <Typography sx={{fontSize:displayConfig.TypoFont   ,textAlign:"center"  , color:'gold',fontFamily:"unset" }} >
                        Arrive at <span>{next_depot_name}</span> remaining <span>{(eta)<=0?  0 : eta }</span> seconds ...
                    </Typography>
                </Box>
                </div>
            )
        }
        else {
            const eta_minutes = Math.round(eta/60,2) ; 
            return (
                <div className={"NextStation"}>
                <Box>
                    <Typography sx={{fontSize:displayConfig.TypoFont   ,textAlign:"center" , color:'gold' , fontFamily:"unset"}}>
                        Arrive at <span>{next_depot_name}</span> remaining <span>{eta_minutes}</span> minutes ...
                    </Typography>
                </Box>
                </div>
            )
        }
    }
    else {
        return (
            <div className={"NextStation"}>
            <Box>
                <Typography sx={{fontSize:displayConfig.TypoFont   ,textAlign:"center" , color:'gold' ,fontFamily:"unset"}} >
                     No mission in schedule
                </Typography>
            </Box>
            </div>
        )
    }

};


export default NextStation ; 