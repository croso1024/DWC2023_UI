import React from "react" ; 
import {Button , Alert, Typography} from "@mui/material";


const click_sound = new Audio() ;
click_sound.src = require("../media/click.mp3") ; 

const ReconnectButton = ({ReloadPage}) => {

    return (
        <div className={"unConnection-Page"}>
            <Typography 
                variant="h2"
                sx= {{margin:5 ,color:"orange" , fontWeight:"bold"}}
            > Connection error , Please wait a few seconds and try again 
            
            </Typography>
            <Button 
                variant="contained"  
                onClick={ReloadPage} 
                color="error"
                sx={{margin:5 , fontSize:50}}
            >
                Retry
            </Button>
        </div>
    )
}

export default ReconnectButton ; 