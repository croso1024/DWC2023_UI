import React from "react" ; 
import {Button , Typography } from "@mui/material" ; 
import {Resolution} from "../ResolutionSetting" ; 

const click_sound = new Audio() ; 
click_sound .src = require("../media/click.mp3") ; 


const getDisplayConfig = (resolution) => {
    if (resolution == "1080") {
        return {
            ButtonHeight : 100 , 
            ButtonWidth : 260 , 
            ButtonRadius : 5 , 
            TypoFont : 26 , 
        }
    }
    else 
        if  (resolution =="768") {
        return {
            ButtonHeight : 70 , 
            ButtonWidth : 130 , 
            ButtonRadius : 3 , 
            TypoFont : 12 , 
        }
    }
}

const displayConfig = getDisplayConfig(Resolution) ; 

const MotionControl = ({requestOverTake , add_history}) => {

    const ClickOverTake = () => {
        requestOverTake(add_history) ; 
        click_sound.play() ; 
        add_history(
            {severity:"info",module:"OverTake" ,message:"OverTaking request has been sent"}
        )
    };


    return (
        <div className={"MotionControl"}>
            <Button  
            sx={{width:displayConfig.ButtonWidth , height:displayConfig.ButtonHeight ,borderRadius:displayConfig.ButtonRadius}}
            onClick={ClickOverTake}
            variant="contained"
            >
                <Typography sx={{fontSize:displayConfig.TypoFont , fontWeight:"bold" }}>active lane change</Typography>
            </Button>
        </div>
    )
}; 

export default MotionControl ; 