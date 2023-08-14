import React from "react" ; 
import {Typography} from "@mui/material" ; 
import { Resolution } from "../ResolutionSetting";


const getDisplayConfig = (resolution) => {
    if (resolution == "1080") {
        return {
            MoniterTypoFont : 40 ,
            MoniterTypoMarginTop : 1 ,
            SubModuleTypoFont : 45 
        }
    }
    else 
        if  (resolution =="768") {
        return {
            MoniterTypoFont : 24 ,
            MoniterTypoMarginTop : 2 ,
            SubModuleTypoFont : 28 
        }
    }
}
const displayConfig = getDisplayConfig(Resolution) ; 


const Module_name = {
    "System": "system_level",
    "Driving Mode": "driving_mode",
    "AD availability": "ad_availability", 
    "Mission": "mission", 
    "Mission register": "mission_register", 
}

const StateMachineMoniter =({StateMachine_state})=>{

    // const StateMachine_module = Object.keys(StateMachine_state);  
    const StateMachine_module = Object.keys(Module_name);
    return (
        <div className={"StateMachine-Moniter"}>
           <Typography 
            sx={{fontSize:displayConfig.MoniterTypoFont ,fontWeight:'bold',color:"gold", textAlign:"center",marginTop:displayConfig.MoniterTypoMarginTop}}>
            State Machine
            </Typography>
            {
                StateMachine_module.map( 
                    (sub_module , index) => (
                        <SubModuleState 
                            key={index}
                            // module_name={Module_name[index]}
                            // module_state={StateMachine_state[sub_module]}
                            module_name={sub_module}
                            module_state={StateMachine_state[Module_name[sub_module]]}
                        />
                    )
                )
            }
        </div>
    )

} ; 

export default StateMachineMoniter ; 


const SubModuleState = ({module_name, module_state}) => {
    return (
        <div className={"SubModuleState-SM"}>
            <Typography sx={{fontSize:displayConfig.SubModuleTypoFont , fontWeight:"bold" , fontFamily:"unset" }}>
                {`${module_name} :  `}
                <span>{module_state}</span>
            </Typography>
        </div>
    )
}