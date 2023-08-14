import React  from "react" ; 
import { Stepper,Step,StepConnector , StepLabel, Typography,styled ,keyframes} from "@mui/material";
import { stepConnectorClasses } from "@mui/material";

// import Bus from "../media/truck1.png";
// import Bus_normal from "../media/bus_normal.png" ; 
// import Bus_comming_soon from "../media/bus_commingsoon.png";


import termination from "../media/terminal.png" ; 

const StepIcon = ({ icon }) => {
    return (
      <div className={"StepIcon"} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={icon} alt="step_icon" height={"100%"}/>
     </div>
    );
  };


const blinkAnimation = keyframes`
    0% { opacity: 0; }
    50% { opacity: 1; }
    100% { opacity: 0; }
`;

const FlashingText = styled(Typography)`
    animation: ${blinkAnimation} 2s infinite;
`;


const QontoConnector = styled(StepConnector)(({ theme }) => ({
[`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 15,
    // left: 'calc(-50% + 16px)',
    // right: 'calc(50% + 16px)',
    left: 'calc(-35%)',
    right: 'calc(65%)',

},
[`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
    // borderColor: '#784af4',
    borderColor:'red',
    },
},
[`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
    borderColor: 'gold',
    },
},
[`& .${stepConnectorClasses.line}`]: {
    // borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : 'grey',
    borderStyle: 'dotted' , 
    borderTopWidth: 3,
    borderRadius: 5,
},


}));
  
///////////////////////////////


const StationStepper = ({icon_array , station_list  , next_station ,estimate_time}) => {

    const station_names = Object.keys(station_list) ; 
    // console.log(station_names);

    // 發現說Stepper的設定，繪製的連階段是由目前已經完成的連接到Current ,
    // 因此若要達成"當前站點到下一站點"這種過程 , 應該是把實際的next_station設置為current 
    // 另外Stepper的工作原理由第一個點到next_station的前一個點(current_station)連接一個顏色  , current_station到next_station另外一個顏色 
    // 所以實際上只要輸入next_station作為元件的參數就可以了

    const next_station_index = station_names.indexOf(next_station) ; 

    const estimate_time_minutes = Math.round(estimate_time/60 , 2) ; 
    return (
        <Stepper activeStep={next_station_index} alternativeLabel connector={<QontoConnector/>}>
            {
                station_names.map(
                    (station , i) =>{
                        
                        // 優先繪製下一個要到達的站點 , 除了icon以及站點名稱以外有增加閃爍文字的部份. 
                        // 如果next_station為null (亦即還未執行UpdateDepot)則indexOf的結果會回傳-1 ,
                        // 換句話下面這段if的渲染只在已經有了下一個站點目標的情況下 , 為下一個站點名稱增加顏色與閃爍的預估時間
                        if (  i === next_station_index  ) {
                            return (<Step key={i}>
                                <StepLabel StepIconComponent={StepIcon} icon={icon_array[i]}>
                                    <Typography sx={{fontSize:25 , fontWeight:"bold" ,color:"red"}}>{station}</Typography>
                                    {
                                        (estimate_time_minutes< 2) && (<FlashingText sx={{fontSize:25 , fontWeight:"bold" ,color:"red",fontFamily:"-apple-system"}}>comming soon</FlashingText>) 
                                    }
                                    {
                                        (estimate_time_minutes >= 2 ) && (<FlashingText  sx={{fontSize:23 , fontWeight:"bold" ,color:"red" ,fontFamily:"-apple-system" ,margin:-1.5}}>{`${Math.round(estimate_time/60)}minutes`}</FlashingText>)
                                    }
                                    
                                </StepLabel>
                            </Step>)
                        }

                        // 無論有沒有給定下一個站點 , 下面就是正常繪製出站點icon以及站點名稱 , 在起尾兩站點使用了不同的Icon
                        if ( i === 0  || i === (station_names.length-1) ){
                            return (
                            <Step key={i}>
                                {/* <StepLabel StepIconComponent={StepIcon} icon={icon_array[i]}> */}
                                <StepLabel StepIconComponent={StepIcon} icon={termination} >
                                <Typography sx={{fontSize:25 , fontWeight:"bold" ,color:"gold"}}>{station}</Typography>
                                </StepLabel>
                            </Step>)
                            }

                        else{
                            return (
                                <Step key={i}>
                                    <StepLabel StepIconComponent={StepIcon} icon={icon_array[i]}>
                                        <Typography sx={{fontSize:25 , fontWeight:"bold" ,color:"gold"}}>{station}</Typography>
                                    </StepLabel>
                                </Step>
                            )
                        }
                    }
                )
            }
        </Stepper>
    )




};

export default StationStepper ; 