import React from "react" ; 
import {Typography ,Box} from "@mui/material" ; 
import {Resolution} from "../ResolutionSetting" ; 

const Module_name = [
    "throttle",
    "brake", 
    "odom",
    "steering"
]

const getDisplayConfig = (resolution) => {
    if (resolution == "1080") {
        return {
            MoniterFont : 45 , 
            MoniterMarginBottom : -2 , 
            subModuleFont:25 , 
            subModuleWidth : 150 
        }
    }
    else 
        if  (resolution =="768") {
        return {
            MoniterFont : 30 , 
            MoniterMarginBottom : -1 , 
            subModuleFont:15 , 
            subModuleWidth : 82 
        }
    }
}

const displayConfig = getDisplayConfig(Resolution) ; 

const MiddleControlMoniter =({MiddleControl_state})=>{

    const MC_module = Object.keys(MiddleControl_state);  

    return (
        <div className={"MiddleControl-Moniter"}>
            <Typography 
            sx={{fontSize:displayConfig.MoniterFont ,fontWeight:'bold',color:"gold" , textAlign:"center",marginBottom:displayConfig.MoniterMarginBottom}}>
            Middle Control
            </Typography>
            <Box display="flex"  flexDirection="row" >
            {
                MC_module.map( 
                    (sub_module , index) => (
                        <SubModuleState 
                            key={index}
                            module_name={Module_name[index]}
                            module_state={MiddleControl_state[sub_module]}
                        />
                    )
                )
            }
            </Box>
        </div>
    )

} ; 

export default MiddleControlMoniter; 


// const SubModuleState = ({module_name, module_state}) => {
//     return (
//         <div className={"SubModuleState"}>
//             <Typography sx={{fontSize:30 , fontWeight:"bold" ,fontFamily:"unset"}}>
//                 {`${module_name} :  `}
//                 <span>{module_state}</span>
//             </Typography>
//         </div>
//     )
// }

const SubModuleState = ({module_name, module_state}) => {
    return (
        <div className={"SubModuleState-MC"}>
            <Typography sx={{fontSize:displayConfig.subModuleFont , fontWeight:"bold" ,fontFamily:"unset",
            textAlign:"center",
            minWidth:displayConfig.subModuleWidth ,             
            maxWidth:displayConfig.subModuleWidth, 
            }}>
                {`${module_name} `}
                <span>{module_state}</span>
            </Typography>
            {/* <span>{module_state}</span> */}
        </div>
    )
}