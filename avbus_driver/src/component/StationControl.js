import React from "react" ; 
import {Button, Typography,keyframes , styled} from "@mui/material" ; 
import {Resolution} from "../ResolutionSetting" ; 
// 控制靠站&離站功能
// 需要顯示目前的靠站設定(預設是必須靠) , 並且通過按鈕發srv來向上控發起修改請求 
// 離站功能則應該是直接發送離站srv 


const click_sound = new Audio();
click_sound.src = require("../media/click.mp3") ; 
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
            ButtonFont:25 , 
            ButtonWidth:260 , 
            ButtonHeight:100 ,
            ButtonRadius:5,
            ButtonMarginTop : 2 ,
            TypoFont : 22 ,
        }
    }
    else 
        if  (resolution =="768") {
        return {
            ButtonFont:14 , 
            ButtonWidth:130 , 
            ButtonHeight:70 ,
            ButtonRadius:3,
            ButtonMarginTop : 2 ,
            TypoFont : 12 ,
        }
    }
};
const displayConfig = getDisplayConfig(Resolution) ; 
/* 
    --0706 : remove the enterStation change button , only preserve the leave station and passed depot
    , it mean once driver request to passed depot , this operation cannot inverse

*/
const StationControl = ({EnterStation ,setEnterStation, requestDepotPassed
     , requestLeaveStation ,etd , add_history}) => {
   
    const ClickPassedStation = () => {
        requestDepotPassed(setEnterStation , add_history);
        click_sound.play() ; 
        add_history(
            {severity:"info",module:"E/L Station switch" ,message:"Request pass this depot"}
        )
   };


    const ClickLeaveStation = () => {
        requestLeaveStation(add_history) ; 
        click_sound.play() ; 
        add_history(
            {severity:"info",module:"E/L Station switch" ,message:"Request leave depot"}
        )
    }
    let standard_time_for_etd = null;
    // let standard_time_for_etd ;
    if (etd) {standard_time_for_etd = etd.toString().slice(0,2) + ":" + etd.toString().slice(2,4) ; }
    else {
        standard_time_for_etd = " No Mission"
    }

    return (
        <div className={"StationControl"}>
                <Button 
                onClick={ClickPassedStation}
                variant="contained"
                sx={{
                    fontSize:displayConfig.ButtonFont ,backgroundColor: EnterStation? "orange":"purple",
                    width:displayConfig.ButtonWidth , height:displayConfig.ButtonHeight ,borderRadius:displayConfig.ButtonRadius,flexDirection:"column"
                }}
                >
                <Typography sx={{fontSize:displayConfig.TypoFont }}>Pass Depot</Typography>
                <Typography sx={{fontSize:displayConfig.TypoFont,color:"red",fontWeight:"bold"}}>{` Now :${EnterStation? "ENTER":"PASS"}`}</Typography>
                </Button>

                <Button
                onClick={ClickLeaveStation}
                variant = "contained"
                sx = {{
                    fontSize:displayConfig.ButtonFont ,marginTop:displayConfig.ButtonMarginTop,backgroundColor:"orange",
                    width:displayConfig.ButtonWidth , height:displayConfig.ButtonHeight,borderRadius:displayConfig.ButtonRadius,flexDirection:"column"
                    }}
                > 
                <Typography sx={{fontSize:displayConfig.TypoFont }}>Departure Reqeust</Typography>
                <Typography sx={{fontSize:displayConfig.TypoFont ,color:"red",fontWeight:"bold"}}>{`${standard_time_for_etd}`}</Typography>
                </Button>

        </div>
    )

}

export default StationControl ; 



