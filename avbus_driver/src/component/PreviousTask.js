import React , {useState}from "react"; 
import {Dialog , Button, Typography} from '@mui/material';
import {DialogTitle , DialogContent , DialogActions} from "@mui/material";
import { Resolution } from "../ResolutionSetting";



const getDisplayConfig = (resolution) => {
    if (resolution == "1080") {
        return {
            ButtonHeight : 100 , 
            ButtonWidth : 260 , 
            ButtonRadius : 5 , 
            ButtonFont : 30 ,
        }
    }
    else 
        if  (resolution =="768") {
        return {
            ButtonHeight : 70 , 
            ButtonWidth : 130 , 
            ButtonRadius : 3 , 
            ButtonFont : 15 ,  
        }
    }
}

const displayConfig = getDisplayConfig(Resolution) ; 


const PreviousTask = ({PreviousTaskContent}) =>{

    const [ Open , setOpen ] = useState(false); 

    const handleDialogOpen = () => {
        setOpen(true) ; 
    }; 
    const handleDialogClose = () => {
        setOpen(false) ; 
    }
    const handleDialogCancel = () =>{
        // 放棄任務
        return null ; 
    }
    const handleDialogSumbit = () =>{
        // 繼續任務
        return null ; 
    }
    const task_type = PreviousTaskContent.task_type ; 
    const task_depot = PreviousTaskContent.task_name ; 
    const task_reverse = PreviousTaskContent.task_reverse ; 

    return (
        <div className={"PreviousTask"}>
            <Button 
                variant="contained" 
                color="warning"
                onClick={handleDialogOpen}
                sx={{fontSize:displayConfig.ButtonFont ,borderRadius:displayConfig.ButtonRadius ,width:displayConfig.ButtonWidth, height:displayConfig.ButtonHeight}}
            >Previous Task</Button>
            <Dialog open={Open} onClose={handleDialogClose}>
                <DialogTitle sx={{fontSize:25}}>Detail of previous task</DialogTitle>
                <DialogContent>
                    <Typography>{`Mission Type:${task_type} / Reverse:${task_reverse} / Depot:${task_depot}`}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} sx={{fontSize:20}}>Cancel</Button>
                    <Button onClick={handleDialogCancel} sx={{fontSize:20}}>Abandon task</Button>
                    <Button onClick={handleDialogSumbit} sx={{fontSize:20}}>Continue task</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default PreviousTask ; 