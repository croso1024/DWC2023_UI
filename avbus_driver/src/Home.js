import React, {useState , useEffect} from "react"; 
import ROSLIB from "roslib" ; 
import StateMachineMoniter from "./component/StateMachineMoniter";
import TaskEditor from "./component/TaskEditor";
import ros_setting from "./ros_setting.json";
import ReconnectButton from "./component/ReconnectButton";
import StationControl from "./component/StationControl";
import ModeControl from "./component/ModeControl";
import ErrorCodeMoniter from "./component/ErrorCodeMoniter";
import HistoryMoniter from "./component/HistoryMoniter";
import NextStation from "./component/NextStation";
import MotionControl from "./component/MotionControl";


import {StateMachine_init , Error_code_init, PreviousTask_init} from "./component/initData" ; 
import { MiddleControl_init , NextDepot_init } from "./component/initData";
import PreviousTask from "./component/PreviousTask";
import MiddleControlMoniter from "./component/MiddleControlMoniter";


// 768P
// import "./driverHMI_css768.css"
// 1080P
import "./driverHMI_css1080.css"

const rosClient = new ROSLIB.Ros(ros_setting.rosClient); 


// Sumbit Mission for the TaskEditor .
const AddMission_srv = {ros:rosClient , ...ros_setting.AddMission}
const AddMission_service = new ROSLIB.Service(AddMission_srv )
const SumbitMission = (Mission, add_history ) => {
    const request = new ROSLIB.ServiceRequest({...Mission}) ; 
    AddMission_service.callService(
        request , (response) => {
            console.log(`Get response for AddMission : ${response.result}`) ; 
            if (response.result) {
            add_history({severity:"success", module:"Task Editor"
            , message:"New Mission sumbit OK"}) ; 
            } 
            else {
                add_history({severity:"warning", module:"Task Editor"
            , message:`Request denied , Plz check uppercontrol`}) ; 
            }
        }
    )
}

// ModeSwitch Request , for the ModeControl 
const ModeSwitch_srv = {ros:rosClient , ...ros_setting.ModeSwitch}
const ModeSwitch_service = new ROSLIB.Service(ModeSwitch_srv)
const requestModeSwitch = (select_mode, add_history) => {
    const request = new ROSLIB.ServiceRequest(
        {request:select_mode} 
    )
    console.log(`Request for Mode Switch : ${request.request}`); 
    ModeSwitch_service.callService(
        request , (response) => {
            console.log(`Get response for ModeSwitch : ${response.result}`)
            if (response.result) {
                add_history({severity:"success", module:"Driving Mode Switch"
                , message:`Change the driving mode to ${select_mode}`}) ; 
            }
            else {
                add_history({severity:"warning", module:"Driving Mode Switch"
                , message:`Request denied , Plz check uppercontrol`}) ; 
            }
        }
    )
};


// Depot Passed , for Station Control .
const DepotPassed_srv ={ros:rosClient , ...ros_setting.DepotPassed} ; 
const DepotPassed_service = new ROSLIB.Service(DepotPassed_srv) ; 
const requestDepotPassed = (setState,add_history) =>{ 
    const request = new ROSLIB.ServiceRequest(
        {request:true}
    )
    DepotPassed_service.callService(
        request , (response) => {
            // implement the depot passed call ...
            console.log(`Get response for Passed Depot request :${response.result}`);
            // if approval , set enterStation state to false directly. 
            if (response.result) {
                setState(false)
                add_history(
                    {severity:"success", module:"E/L Station switch"
                , message:"Request approved , Passed next depot"}
                )
            }
            else{
                add_history(
                    {severity:"warning", module:"E/L Station switch"
                , message:"Request denied , Plz check uppercontrol"}
                )
            }



            
        }
    )
};
// LeaveStation , for StationControl 
const LeaveStation_srv = {ros:rosClient , ...ros_setting.LeaveStation}
const LeaveStation_service = new ROSLIB.Service(LeaveStation_srv)
const requestLeaveStation = (add_history) => {
    const request = new ROSLIB.ServiceRequest(
        {request:true}  
    )
    LeaveStation_service.callService(
        request , (response) => {
            console.log(`Get response for LeaveStation : ${response.result}`)
            if (response.result) {
            add_history({severity:"success", module:"E/L Station switch"
            , message:"Leave station request submit success"}) ; 
            } 
            else {
                add_history({severity:"warning", module:"E/L Station switch"
            , message:"Request denied , Plz check uppercontrol"}) ; 
            }
        }
    )
}

// 提供主動向上控call next depot的功能
const GetDepot_srv = {ros:rosClient,...ros_setting.GetDepot} ; 
const GetDepot_service = new ROSLIB.Service(GetDepot_srv) ; 
const callGetDepot = (setFunc , add_history) => {
    const request = new ROSLIB.ServiceRequest({request:true}) ; 
    GetDepot_service.callService(
        request , (response)=>{
            if (response.next_depot_name == ""){}
            else{
                setFunc(
                    {
                        next_depot_name:response.next_depot_name,
                        eta:response.eta , 
                        etd:response.etd ,
                    }
                )
                add_history({severity:"success", module:"Get Depot function"
                , message:"Fetch the next depot success"})
            }
        }
    )
}

const OverTake_srv = {ros:rosClient,  ...ros_setting.OverTake} ; 
const OverTask_service = new ROSLIB.Service(OverTake_srv) ;
const requestOverTake = (add_history) => {
    const request = new ROSLIB.ServiceRequest({request:true}); 
    OverTask_service.callService(
        request , (response) =>{
            if(response.result) {
                add_history({severity:"success", module:"OverTake"
                , message:"OverTaking request accepted"})
            }
            else{
                add_history({severity:"warning", module:"OverTake"
                , message:"OverTaking request denied"})
            }

        }
    )
}

const ReloadPage = () => {
    rosClient.close() ; 
    window.location.reload(true) ; 
}; 
const ETA_update_rate = 5 ; // in seconds 

const Home = () =>{
    const [connectionState , setConnectionState] = useState(false); 
    // StateMachine狀態 ( 包含駕駛模式狀態也直接從裡面拿 )
    const [StateMachine_state , setStateMachine_state] = useState(StateMachine_init) ; 
    // MiddleControl狀態 
    const [MiddleControl_state , setMiddleControl_state] = useState(MiddleControl_init); 
    // Error Code 
    const [ErrorCode , setErrorCode ] = useState(Error_code_init) ; 
    // 是否進站的狀態
    const [EnterStation , setEnterStation] = useState(true) ; 
    // 前一次任務的狀態
    const [UncompleteTask , setUncompleteTask] = useState(PreviousTask_init);
    // 下一站資訊 , 包含name,eta ,etd 
    const [NextDepot , setNextDepot ] = useState(NextDepot_init);
    // 訊息欄位 - 提供駕駛如console的作用
    const [History , setHistory]  = useState([]) ; 


    const add_history = (item) => {
        // console.log(item);
        setHistory(
            (prev) =>{
                if ( prev.length >= 6 ) {prev.shift(); } 
                return [ ...prev , item]
            }
        )
        // console.log(History); 
    }

    useEffect(
        ()=>{
            // 所有Subscriber , ServiceServer類的都放在connection之後做定義 , 而Service
            rosClient.on("connection",  ()=>
                {
                    console.log("(Driver) Connect to ros server"); 
                    setConnectionState(true) ; 
                    const WrappedState_topic = {ros:rosClient , ...ros_setting.WrappedState} ; 
                    const WrappedStaet_subscriber = new ROSLIB.Topic(WrappedState_topic) ; 
                    WrappedStaet_subscriber.subscribe(
                        (msg)=> {
                            setStateMachine_state(
                                {
                                    system_level :msg.system_level_state ,
                                    mission : msg.mission_state ,
                                    mission_register : msg.mission_register_state ,
                                    ad_availability : msg.ad_available , 
                                    driving_mode : msg.driving_mode 
                                }
                            )
                        }
                    )
                    const ErrorCodeSummary_topic =  {ros:rosClient , ...ros_setting.ErrorCodeSummary}
                    const ErrorCodeSummary_subscriber = new ROSLIB.Topic(ErrorCodeSummary_topic)
                    ErrorCodeSummary_subscriber.subscribe(
                        (msg) => {
                            console.log("msg: ",msg)
                            setErrorCode(()=>(
                                {
                                    module_name : msg.module_name , 
                                    triggered_error : msg.triggered_error, 
                                    error_code : msg.error_code
                                }
                            ));
                        }
                    )

              
                    // const MC_throttle_topic = {ros:rosClient,...ros_setting.MC_throttle} ; 
                    // const MC_brake_topic = {ros:rosClient,...ros_setting.MC_brake} ; 
                    // const MC_odom_topic = {ros:rosClient,...ros_setting.MC_odom} ; 
                    // const MC_steering_topic = {ros:rosClient,...ros_setting.MC_steering} ; 
                    // const MC_throttle_subscriber = new ROSLIB.Topic(MC_throttle_topic);
                    // const MC_brake_subscriber = new ROSLIB.Topic(MC_brake_topic) ; 
                    // const MC_odom_subsciber = new ROSLIB.Topic(MC_odom_topic) ; 
                    // const MC_steering_subscriber = new ROSLIB.Topic(MC_steering_topic) ; 

                    // MC_throttle_subscriber.subscribe
                    // ((msg)=> {setMiddleControl_state((prev)=> {prev.throttle = msg.data ; return prev}  )})
                    // MC_brake_subscriber.subscribe
                    // ((msg)=> {setMiddleControl_state((prev)=> {prev.brake = msg.data ; return prev}  )})
                    // MC_odom_subsciber.subscribe
                    // ((msg)=> {setMiddleControl_state((prev)=> {prev.odom = msg.data ; return prev}  )})
                    // MC_steering_subscriber.subscribe
                    // ((msg)=> {setMiddleControl_state((prev)=> {prev.steering= msg.data ; return prev}  )})
                    const MiddleControl_topics = {
                        throttle : {ros:rosClient, ...ros_setting.MC_throttle},
                        brake : {ros:rosClient, ...ros_setting.MC_brake},
                        odom  : {ros:rosClient, ...ros_setting.MC_odom},
                        steering: {ros:rosClient, ...ros_setting.MC_steering},
                    };
                    Object.entries(MiddleControl_topics).forEach(
                        ([key]) => {
                            console.log(key); 
                            const subscriber = new ROSLIB.Topic( MiddleControl_topics[key] ) ; 
                            subscriber.subscribe(
                                (msg)=>{
                                    setMiddleControl_state((prev)=>{return {...prev ,[key]:msg.data} })
                                }
                            )
                        }
                    );
                    //
                    
                    // Update Depot subscriber 
                    const UpdateDepot_topic = {ros:rosClient, ...ros_setting.UpdateDepot};  
                    const UpdateDepot_subscriber = new ROSLIB.Topic(UpdateDepot_topic); 
                    UpdateDepot_subscriber.subscribe(
                        (request) => {
                            setNextDepot(
                                            {
                                                "next_depot_name":request.next_depot_name , 
                                                "eta": request.eta , 
                                                "etd": request.etd ,
                                            }
                                        );
                        }
                    )

                    const MissionMsg_topic = {ros:rosClient, ...ros_setting.MissionMsg} ;
                    const MissionMsg_subscriber = new ROSLIB.Topic(MissionMsg_topic);
                    MissionMsg_subscriber.subscribe(
                        (msg) => {
                            console.log(msg.name , msg.reverse) ;
                            setUncompleteTask(
                                () => ({
                                    task_type : 4 , 
                                    task_name : msg.name , 
                                    task_reverse: msg.reverse , 
                                })
                            )
                        }
                    )
                }

            ) ; 
            rosClient.on("error", ()=>{
                console.log("(Driver) Ros connection error"); 
                
                rosClient.close() ; 
                setConnectionState(false) ; 
            })

            rosClient.on("close", ()=>{
                console.log("(Driver) Ros connection close!") ; 
                rosClient.close() ; 
                setConnectionState(false) ; 
            })

            return ()=> {
                rosClient.close() ; 
            }
        } , [] 
    )
    
    // Get Depot -- note this is low efficiency way to auto track the mission 
    useEffect(
        () => {
            let ETA_timer_ID = null ; 
            if (!NextDepot.next_depot_name) {
                callGetDepot(setNextDepot , add_history)
            }
            else {
                ETA_timer_ID = setTimeout(
                    () => {
                        setNextDepot(
                            (prev) => ({...prev , eta : prev.eta - ETA_update_rate })
                        )} , ETA_update_rate * 1000
                )
            } 
            return ()=>{
                clearTimeout(ETA_timer_ID) ; 
            }
        } , [NextDepot] 
    )

    if (connectionState  ) {
            return (
                // 網頁的顯示內容 , 包含輸入框等
                <div className={"APP-Based"}>
                    <StateMachineMoniter  StateMachine_state={StateMachine_state}/> 
                    <MiddleControlMoniter MiddleControl_state={MiddleControl_state} /> 
                    <ErrorCodeMoniter  ErrorCode={ErrorCode}/>
                    <TaskEditor  
                        SumbitMission={SumbitMission} 
                        add_history={add_history}    
                        />
                    <PreviousTask PreviousTaskContent={UncompleteTask} />
                    <MotionControl requestOverTake={requestOverTake} add_history={add_history} />
                    <ModeControl  
                        Mode={StateMachine_state["driving_mode"]} 
                        callModeSwitch = {requestModeSwitch}
                        add_history={add_history}
                    />
                    <StationControl 
                        EnterStation={EnterStation} 
                        setEnterStation = {setEnterStation}
                        requestDepotPassed = {requestDepotPassed}
                        requestLeaveStation = {requestLeaveStation}
                        etd={NextDepot.etd}
                        add_history = {add_history}
                    />
                    <NextStation next_depot_name={NextDepot.next_depot_name} eta={NextDepot.eta}/>
                    <HistoryMoniter History={History} setHistory={setHistory} />
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
