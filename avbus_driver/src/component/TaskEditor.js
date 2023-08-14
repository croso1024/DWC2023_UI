import React,{ useState} from "react"; 
import {Button , Dialog , Select ,MenuItem, TextField } from "@mui/material";
import {DialogTitle , DialogContent,DialogActions} from "@mui/material";
import {FormHelperText,FormControl} from "@mui/material"; 
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

const TaskEditor = ({SumbitMission , add_history}) => {

    const [ Open , setOpen] = useState(false) ; 
    const [ SelectTaskType , setSelectTaskType ] = useState("") ; 
    const [ SelectTaskReverse , setSelectTaskReverse ] = useState("") ; 
    const [ TargetDepot , setTargetDepot ] = useState("") ; 

    // Handle Dialog control  ,
    const handleDialogOpen = () => {
        setOpen(true) ; 
    }; 
    const handleDialogClose = () => {
        setOpen(false) ;
        setSelectTaskType("");
        setSelectTaskReverse("");
        setTargetDepot("") ; 
    };
    const handleDialogSumbit = () => {
        // SetMission( {type: SelectTaskType,name: TargetDepot , reverse: SelectTaskReverse } ); 
        const mission = {"type": SelectTaskType,"name": TargetDepot , "reverse": SelectTaskReverse };
        SumbitMission(mission , add_history); 
        handleDialogClose() ; 
        add_history(
            {severity:"info", module:"Task Editor", message:"Add mission request has been sent"} 
        ); 
    };

    // Handle Select component state change
    const handleTaskTypeChange = (event) => {
        setSelectTaskType(event.target.value) ; 
    }
    const handleTaskReverseChange = (event) => {
        setSelectTaskReverse(event.target.value);
    }
    const handleTargetDepotChange = (event) => {
        console.log(event.target.value) ; 
        setTargetDepot(event.target.value) ; 
    }


    return (
        <div className={"TaskEditor"}>

            <Button variant="contained" 
            onClick={handleDialogOpen}
            sx={{fontSize:displayConfig.ButtonFont ,borderRadius:displayConfig.ButtonRadius ,width:displayConfig.ButtonWidth , height:displayConfig.ButtonHeight}}
            > Open TaskEditor</Button>


            <Dialog open={Open} onClose={handleDialogClose}>
                <DialogTitle sx={{fontSize:30}} >Task Editor</DialogTitle>
                <DialogContent>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <Select  
                        value={SelectTaskType} 
                        onChange={handleTaskTypeChange}
                    >
                    <MenuItem value={1}>Mode-1</MenuItem>
                    <MenuItem value={2}>Mode-2</MenuItem>
                    <MenuItem value={3}>Mode-3</MenuItem>
                    <MenuItem value={4}>Mode-4</MenuItem>
                    </Select>
                    <FormHelperText sx={{fontSize:20}} >Type</FormHelperText>
                    </FormControl>

                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <Select  
                        value={SelectTaskReverse} 
                        onChange={handleTaskReverseChange}
                    >
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                    </Select>
                    <FormHelperText sx={{fontSize:20}}>Reverse</FormHelperText>
                    </FormControl>

                    {/*   --- Manual fill target depot mode 
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <TextField 
                        label="Please fill the depot manual"
                        value={TargetDepot} 
                        onChange={handleTargetDepotChange} 
                    />
                    <FormHelperText sx={{fontSize:20}}>Depot</FormHelperText>
                    </FormControl> */}
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <Select 
                        value={TargetDepot}
                        onChange={handleTargetDepotChange}
                    >
                    <MenuItem value={"DWC_A_S1"}>DWC_A_S1</MenuItem>
                    <MenuItem value={"DWC_A_S2"}>DWC_A_S2</MenuItem>
                    <MenuItem value={"DWC_A_S3"}>DWC_A_S3</MenuItem>
                    <MenuItem value={"DWC_C_S1"}>DWC_C_S1</MenuItem>
                    <MenuItem value={"DWC_C_S2"}>DWC_C_S2</MenuItem>
                    <MenuItem value={"DWC_A_S4"}>DWC_A_S4</MenuItem>
                    </Select>
                    <FormHelperText sx={{fontSize:20}} >Depot</FormHelperText>
                    </FormControl>


                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} sx={{fontSize:20}}>Cancel</Button>
                    <Button onClick={handleDialogSumbit} sx={{fontSize:20}}>Sumbit</Button>
                </DialogActions>
            </Dialog>
        </div>
    )

} ;  

export default TaskEditor ;