import React from "react" ; 
import { Typography , Avatar, keyframes } from "@mui/material" ; 
import {List , ListItem ,ListItemIcon} from "@mui/material";
import {styled} from "@mui/material" ; 


import  functioning from "../media/functioning.png";
import  error from "../media/error.png" ; 
import {Resolution} from "../ResolutionSetting" ; 

const blinkAnimation = keyframes`
    0% { opacity: 0; }
    50% { opacity: 1; }
    100% { opacity: 0; }
`

const FlashingText = styled(Typography)`
    animation: ${blinkAnimation} 1s infinite ;
`; 


const getDisplayConfig = (resolution) => {
    if (resolution == "1080") {
        return {
            fontSize:28 , radius : 3 
        }
    }
    else 
        if  (resolution =="768") {
        return {
            fontSize:14 , radius : 2 
        }
    }
}

const displayConfig = getDisplayConfig(Resolution) ; 

const ErrorCodeMoniter = ({ErrorCode}) => {

    // const ErrorCode_module = Object.keys(ErrorCode) ; 

    return (
        <div className={"ErrorCode-Moniter"}>
        <List>
            {
                ErrorCode.module_name.map(
                    (module,index) => {

                        const state = ErrorCode[module] 
                        // normal case 
                        if (!ErrorCode.triggered_error[index]) {
                            return (
                                <div className={"ErrorCode-Module"} key={index} >

                                <ListItem key={index}>

                                    <ListItemIcon><Avatar src={functioning}/></ListItemIcon>
                                    
                                    <Typography sx={{fontSize:displayConfig.fontSize ,fontWeight:"bold", fontFamily:"unset"}}>
                                        {`${module} : `}
                                    </Typography>


                                    <span id={"Normal"}>{ErrorCode.error_code[index]}</span>

                                </ListItem>
                                </div>
                            )
                        }
                        else {
                            return (
                                <div className={"ErrorCode-Module"} key={index}>
                                <ListItem key={index} sx={{backgroundColor:"orange",borderRadius:displayConfig.radius}}>

                                    <ListItemIcon><Avatar src={error}/></ListItemIcon>
                                    
                                    <FlashingText sx={{fontSize:displayConfig.fontSize ,fontWeight:"bold" , color:"red" ,backgroundColor:'orange' , fontFamily:"unset"}}>
                                        {`${module} : `}
                                    </FlashingText>
                                    <span id={"haveError"}>{ErrorCode.error_code[index]}</span>

                                </ListItem>

                                </div>
                            )
                        }
                    }
                )
            }
        </List>
        </div>
    )
}
export default ErrorCodeMoniter ; 