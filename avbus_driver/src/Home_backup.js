import React, {useState , useEffect} from "react"; 
import ROSLIB from "roslib" ; 
import StateMachine_Moniter from "./component/StateMachineMoniter";
import TaskEditor from "./component/TaskEditor";
import ros_setting from "./ros_setting.json";
import "./driverHMI_css.css"
import ReconnectButton from "./component/ReconnectButton";
import StationControl from "./component/StationControl";
import ModeControl from "./component/ModeControl";
import ErrorCode_Moniter from "./component/ErrorCodeMoniter";


import {StateMachine_init , Error_code_init, PreviousTask_init} from "./component/initData" ; 
import { Mission_init } from "./component/initData";
import PreviousTask from "./component/PreviousTask";




const rosClient = new ROSLIB.Ros(ros_setting.rosClient); 
const ErrorCodeSummary_topic =  {
    ros:rosClient , ...ros_setting.ErrorCodeSummary
}

const AddMission_srv = {
    ros:rosClient , ...ros_setting.AddMission
}
const ModeSwitch_srv = {
    ros:rosClient , ...ros_setting.ModeSwitch
}
const EnterStationSwitch_srv = {
    ros:rosClient , ...ros_setting.EnterStationSwitch 
}
const LeaveStation_srv = {
    ros:rosClient , ...ros_setting.LeaveStationSwitch
}
const DepotPassed_srv = {
    ros:rosClient , ...ros_setting.DepotPassed
}


const ReloadPage = () => {
    rosClient.close() ; 
    window.location.reload(true) ; 
}; 


const Home = () =>{
    const [connectionState , setConnectionState] = useState(false); 
    // StateMachine狀態
    const [StateMachine_state , setStateMachine_state] = useState(StateMachine_init) ; 
    // Error Code 
    const [ErrorCode , setErrorCode ] = useState(Error_code_init) ; 
    // 是否進站的狀態
    const [EnterStation , setEnterStation] = useState(true) ; 
    // 前一次任務的狀態
    const [UncompleteTask , setUncompleteTask] = useState(PreviousTask_init);
    // 駕駛模式 
    const [Mode , setMode] = useState(1);
    // 任務編輯器內容 
    const [Mission,  SetMission] = useState(Mission_init) ; 


    const [UserInput , setUserInput] = useState({});  

    // 與顯示內容相關的topic , 基本上要傳進Moniter內 
    const [topic1 , setTopic1] = useState() ; 
    const [topic2 ,setTopic2] = useState() ; 


    useEffect(
        ()=>{
            rosClient.on("connection",  ()=>
                {
                    console.log("(Driver) Connect to ros server"); 
                    setConnectionState(true) ; 

                    const ErrorCodeSummary_subscriber = new ROSLIB.Topic(
                        ErrorCodeSummary_topic
                    )
                    ErrorCodeSummary_subscriber.subscribe(
                        (msg) => {
                            console.log("msg: ",msg)
                            // setVehicle_pos( [msg.vehicle_longitude , msg.vehicle_latitude]  );
                            setErrorCode(msg);
                        }
                    )

                    const AddMission_service = new ROSLIB.Service(
                        AddMission_srv 
                    )
                    const ModeSwitch_service = new ROSLIB.Service(
                        ModeSwitch_srv
                    )
                    const EnterStationSwitch_service = new ROSLIB.Service(
                        EnterStationSwitch_srv
                    )
                    const LeaveStation_service = new ROSLIB.Service(
                        LeaveStation_srv
                    )
                    
                    const DepotPassed_service = new ROSLIB.Service(
                        DepotPassed_srv
                    )
                    DepotPassed_service.advertise(
                        (request, response) => {
                            console.log(`Passed Depot!`) ; 
                            // alert info  
                            response['result'] = true 
                            return true
                        }
                    )
                    // Setup the service call function , as the props for downstream component
                    

                    // Sumbit Mission for the TaskEditor . 
                    const SumbitMission = () => {
                        const request = new ROSLIB.ServiceRequest(...Mission) ; 
                        AddMission_service.callService(
                            request , (response) => {
                                console.log(`Get response for AddMission : ${response}`) ; 
                            }
                        )
                    }
                    
                    // ModeSwitch Request , for the ModeControl 
                    const requestModeSwitch = () => {
                        const request = new ROSLIB.ServiceRequest(
                            {request:true} 
                        )
                        ModeSwitch_service.callService(
                            request , (response) => {
                                console.log(`Get response for ModeSwitch : ${response}`)
                            }
                        )
                    }
                    
                    // EnterStationSwitch , for StationControl
                    const requestEnterStationSwitch = () => {
                        const request = new ROSLIB.ServiceRequest(
                            {request:true} 
                        )
                        EnterStationSwitch_service.callService(
                            request , (response) => {
                                console.log(`Get response for EnterStationSwitch : ${response}`)
                            }
                        )
                    }

                    // LeaveStation , for StationControl 
                    const requestLeaveStation = () => {
                        const request = new ROSLIB.ServiceRequest(
                            {request:true}  
                        )
                        LeaveStation_service.callService(
                            request , (response) => {
                                console.log(`Get response for Enter`)
                            }
                        )
                    }


                }
            ) ; 
            rosClient.on("error", ()=>{
                console.log("(Driver) Ros connection error"); 
            })

            rosClient.on("close", ()=>{
                console.log("(Driver) Ros connection close!") ; 
            })




            return ()=> {
                rosClient.close() ; 
            }
        } , [] 
    )


    useEffect(
        ()=>{
            // 當UserInput發生變化 , 使用Publisher去發送訊息
            console.log("(Driver) user input trigger") ;
            if (UserInput.xxx === "type1") {
                // InputPublisher.publish(  
                    // generateROSMSG( UserInput ) // maybe copy the object first !? 
                
            } 

        } , [UserInput]
    ) 

    if (connectionState ) {
            return (
                // 網頁的顯示內容 , 包含輸入框等
                <div className={"APP-Based"}>
                    <StateMachine_Moniter  StateMachine_state={StateMachine_state}/> 
                    <ErrorCode_Moniter  ErrorCode={ErrorCode}/>
                    <TaskEditor />
                    <PreviousTask PreviousTaskContent={UncompleteTask} />
                    <ModeControl  
                        Mode={StateMachine_state["driving_mode"]} 
                        callModeSwitch = {()=>{}}
                    />
                    <StationControl 
                        EnterStation={EnterStation} 
                        requestEnterStation = {()=>{}}
                        requestLeaveStation = {()=>{}}

                    />
                </div>
            )
        } 
    else {
            // 尚未連上Ros主系統的頁面 
            console.log(`Connection State : ${connectionState}`)
            return (
            <div className={"APP-Based"}>
                <ReconnectButton  ReloadPage={ReloadPage}/>
            </div>
            )
        }   
}; 
export default Home ; 