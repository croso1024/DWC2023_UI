// 用來顯示與切換人駕/自駕/Fallback三個模式 ，其中Fallback mode需要額外的
// 警示音效等來提醒駕駛 

import   {useEffect} from "react"; 
import {Button,Typography} from "@mui/material" ; 
import {Resolution} from "../ResolutionSetting" ; 
const Warning_sound = new Audio()
Warning_sound.src = require("../media/Warning.mp3") ; 
const click_sound = new Audio() 
click_sound.src = require("../media/click.mp3"); 


const getDisplayConfig = (resolution) => {
    if (resolution == "1080") {
        return {
            ButtonHeight : 100 , 
            ButtonWidth : 260 , 
            ButtonRadius : 5 , 
            TypoFont : 22 , 
        }
    }
    else 
        if  (resolution =="768") {
        return {
            ButtonHeight : 70 , 
            ButtonWidth : 130 , 
            ButtonRadius : 3 , 
            TypoFont : 10 , 
        }
    }
}

const displayConfig = getDisplayConfig(Resolution) ; 


const ModeControl = ({Mode , callModeSwitch ,add_history}) => {


    // --0706 : modify the Mode change from bool srv -> string srv , 
    // specific the mode that be selected , if Mode in "Fallback"/"Auto" ,
    // Click the button the request the UpperControl switch to manual 
    
    const CallSwitchMode = () => {
        click_sound.play() ; 
        console.log(`Debug Current Mode  : ${Mode}`) ; 
        const select_mode = (Mode!=="Manual")? "Manual":"Auto" ; 
        console.log(`Switch to Mode :${select_mode}`) ; 
        callModeSwitch(select_mode,add_history) ; 
        add_history(
            {severity:"info", module:"Driving Mode Switch"
            , message:"Mode Switch request has been sent"}
        )
    }

    useEffect( 
        () => {
            const warning_timmer = null
            if (Mode == "Fallback")  {
                const warning_timmer = setInterval(
                    ()=> {Warning_sound.play()} , 10000
                ); 
            }
            return ()=>{
                clearInterval(warning_timmer) ; 
            }
        }  ,[ Mode ]
    )
 

    return (
        <div className={"ModeControl"} >
            <Button 
                variant="contained" 
                color="secondary"  
                onClick={CallSwitchMode}
                sx={{ borderRadius:displayConfig.ButtonRadius, height:displayConfig.ButtonHeight ,width:displayConfig.ButtonWidth, flexDirection:"column"}}>
                <Typography sx={{fontSize:displayConfig.TypoFont }}>Switch Driving Mode</Typography>
                <Typography sx={{fontSize:displayConfig.TypoFont,color:"orange",fontWeight:"bold"}}>{`${Mode}-Mode`}</Typography>
            </Button>
        </div>
    )

}

export  default ModeControl;