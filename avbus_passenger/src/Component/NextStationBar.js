import React from "react" ; 
import {Typography , Box} from "@mui/material" ; 


// 顯示元件: 
//  車輛Gif + {estimate_time}分鐘後抵達:{next_station}

// const moving_vehicle = require("../media/moving_car.gif");  

const enter_station_sound = new Audio() ; 
enter_station_sound.src = require("../media/enter_station.mp3") ; 


const NextStationBar = ({next_station , estimate_time}) => {

    // 已經透過Update Depot取得任務開始的情況
    if (next_station && estimate_time){

        const estimate_time_minutes =  Math.round(estimate_time/60 , 2) ; 

        if (estimate_time_minutes<=1) {
            // 目前的作法會導致反覆播放 , 和ETA update rate有關
            enter_station_sound.play() ; 
            return (
                <Box > 
                    <Typography sx={{fontSize:45  ,color:'gold' ,textAlign:"center" ,fontFamily:"-apple-system"}} >  
                        Comming soon to <span>{next_station}</span>
                    </Typography>
                </Box>
            )
        }
        else {
            return (
                <Box >
                    <Typography sx={{fontSize:45   ,color:'gold',textAlign:"center" ,fontFamily:"-apple-system"}} >  
                    Arrive at <span>{next_station}</span> in <span>{estimate_time_minutes}</span> minutes
                    </Typography>
                </Box>
            )
        }
    }

    // 只有執行StartMission , 尚未開始執行任務, 在乘車資訊面板顯示尚未發車 
    else {
        return (
        <Box >
            <Typography sx={{fontSize:45   ,textAlign:"center" , color:'gold' , fontFamily:"-apple-system" }} >  
                No scheduled mission
            </Typography>
        </Box>
        )
    }


}

// export default NextStationBar ; 
export default React.memo(NextStationBar) ; 