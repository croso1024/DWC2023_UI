// 紀錄操作訊息和來自上控的一些回報 
import React from 'react' ;
import {Alert, AlertTitle,Box , Typography,Button } from "@mui/material" ; 
import {Avatar} from "@mui/material" ; 
import info_img from "../media/info.png";
import warning_img from "../media/warning.png";
import error_img from "../media/error.png";
import success_img from "../media/functioning.png";
import {Resolution} from "../ResolutionSetting" ; 


const severity_icon_set = {
    "success":success_img , 
    "info": info_img , 
    "warning": warning_img , 
    "error":error_img
}



const getDisplayConfig = (resolution) => {
    if (resolution == "1080") {
        return {
            CleanButtonFont:25  , CleanButtonWidth : 450 , CleanButtonHeight : 250 ,
            AlertIconSize : 45 ,  
            AlertRadius : 5 , AlertMaxH : 70 , AlertMinH : 10 ,   AlertTitleFont : 20 ,
            TypoFont :18 , TypoMarginTop : -2 , TypoWidth:350
            
        }
    }
    else 
        if  (resolution =="768") {
        return {
            CleanButtonFont:20  , CleanButtonWidth : 240 , CleanButtonHeight : 150 ,
            AlertIconSize : 22 ,  
            AlertRadius : 3 , AlertMaxH : 80 , AlertMinH : 10 ,   AlertTitleFont : 10 ,
            TypoFont :8 , TypoMarginTop : -1 , TypoWidth:200
        }
    }
}

const displayConfig = getDisplayConfig(Resolution) ; 



const AlertMessage = ({record}) =>{
    const severity = record.severity ; 
    const severity_icon = severity_icon_set[severity] ; 
   
    return (
        <Alert 
            severity={record.severity} 
            icon={<Avatar src={severity_icon} sx={{height:displayConfig.AlertIconSize ,width:displayConfig.AlertIconSize}}/>} 
            variant={"filled"} 
            sx={{borderRadius:displayConfig.AlertRadius , maxHeight:displayConfig.AlertMaxH,minHeight:displayConfig.AlertMinH }}>
            {/* <Box display="flex" displayDirection="row"  textAlign="center" justifyContent={"center"} >
                <Typography sx={{fontSize:20 , fontWeight:"bold" , color:"red"}} >{record.module}</Typography>
                <Typography sx={{fontSize:20  , color:"white" ,marginLeft:3}}  >{record.message}</Typography>
            </Box> */}
            <AlertTitle sx={{fontSize:displayConfig.AlertTitleFont , fontWeight:"bold" , color:"red"}}>{record.module}</AlertTitle>
            <Typography sx={{fontSize:displayConfig.TypoFont , marginTop:displayConfig.TypoMarginTop , textAlign:"right" ,width:displayConfig.TypoWidth}}>{record.message}</Typography>
        </Alert>
    )
}; 




const HistoryMoniter = ({History , setHistory}) => {

    const cleanHistory = () =>{
    setHistory([]) ; 
    } ; 
    return (
        <React.Fragment>
        <div className={'HistoryCleanButton'}>
            <Button
                variant='contained'
                onClick={cleanHistory} 
                sx={{fontSize:displayConfig.CleanButtonFont ,color:"gold" , width:displayConfig.CleanButtonWidth ,Height:displayConfig.CleanButtonHeight , fontFamily:"unset"}}
            >
                Clean History
            </Button> 
            </div>
        <div    className={"HistoryMoniter"}>
            {
                History.map(
                    (record ,index)=>{
                        return (
                            <div className={"HistoryMoniter-item"} key={index}>
                                 <AlertMessage record={record} key={index} />
                            </div>
                            )
                    }
                )
            }
        </div>
        </React.Fragment>
    )
}

export default HistoryMoniter ; 
