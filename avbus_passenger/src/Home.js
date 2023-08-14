import React  , {useState ,useEffect ,useRef} from "react"; 
import io from  'socket.io-client';
import Title from "./Component/Title";
import ROSLIB from "roslib";
import ros_setting from "./config/ros_setting.json" ; 
import "./avbus_css_no_webcam.css" 
import { Button, Typography } from "@mui/material";
import MapComponent from "./Component/MapComponent";
import NextStationBar from "./Component/NextStationBar";
import ImageGallery from "./Component/ImageGallery" ; 
import Status from "./Component/Status";
import StationStepper from "./Component/StationStepper";
import BottomMessage from "./Component/BottomMessage";
// import StreamLive from "./Component/StreamLive";

import icon_a from "./media/letter-a.png";
import icon_b from "./media/letter-b.png";
import icon_c from "./media/letter-c.png";
import icon_d from "./media/letter-d.png";
import icon_e from "./media/letter-e.png";
import icon_f from "./media/letter-f.png";
import icon_g from "./media/letter-g.png";
import icon_h from "./media/letter-h.png";
import icon_i from "./media/letter-i.png";
import icon_j from "./media/letter-j.png";
import icon_k from "./media/letter-k.png";
import { LocalConvenienceStoreOutlined } from "@mui/icons-material";


const icon_array = [
    icon_a , icon_b , icon_c , icon_d , icon_e , icon_f , icon_g,icon_h ,icon_i , icon_j ,icon_k 
]

const rosClient = new ROSLIB.Ros(
    ros_setting.rosClient
)


// const Vehicle_Info_topic = {
//     ros:rosClient , ...ros_setting.Vehicle_Info_topic
// }

// const ServiceCall_test = {
//     ros:rosClient , ...ros_setting.ServiceCall_test
// }

// const test_Customize_srv = {
//     ros:rosClient , ...ros_setting.Custome_message
// }

// const StartMission_topic = {
//     ros:rosClient ,...ros_setting.StartMission_topic
// }
// const UpdateDepot_topic = {
//     ros:rosClient , ...ros_setting.UpdateDepot_topic
// }
const GetMission_srv={
    ros:rosClient , ...ros_setting.GetMission_srv
}
const GetDepot_srv = {
    ros:rosClient , ...ros_setting.GetDepot_srv
}
// const HMIAction_topic = {
//     ros:rosClient , ...ros_setting.HMIAction_msg
// }
// const VehiclePos_topic = {
//     ros:rosClient , ...ros_setting.VehiclePos_topic
// }


const ETA_update_rate = 30 ;// unit:second 

const route_setting_sound = new Audio(); 
route_setting_sound .src = require("./media/route_setting.mp3");
const next_station_sound = new Audio(); 
next_station_sound  .src = require("./media/next_station.mp3") ; 


const door_close_sound = new Audio() ; 
door_close_sound.src = require("./media/door_close.mp3") ; 
const door_open_sound = new Audio() ; 
door_open_sound.src = require("./media/door_open.mp3") ; 
const arrive_terminal_sound = new Audio();  
arrive_terminal_sound.src = require("./media/arrive_terminal.mp3"); 
const after_departure_sound = new Audio(); 
after_departure_sound.src = require("./media/after_departure.mp3");
const approaching_depot_sound = new Audio(); 
approaching_depot_sound.src = require("./media/approaching_depot.mp3");

// const action_trigger = [12 , 21 ,22 ,24 ,31]
const action_trigger = {
    12: approaching_depot_sound , 
    21 : door_open_sound , 
    22 : door_close_sound , 
    24 : after_departure_sound , 
    31 : arrive_terminal_sound ,
} ;



function Home() 
{

    const [connectionState , setConnectionState ] = useState(false); 
    // Dubai 
    const [vehicle_pos , setVehicle_pos] = useState([25.13248,55.38216]) ; 

    //TPK 
    // const [vehicle_pos , setVehicle_pos] = useState([25.1500,121.39216]) ; 

    // update by : StartMission service call 
    const [Mission_name , setMission_name] = useState(null); 
    const [Stations , setStations] = useState(null); 
    const [RemindMsg , setRemindMsg] = useState(null); 

    // update by : UpdateDepot service call
    const [next_station , setNextStation ] = useState(null); 
    // next_ETA 在已經有設定數值的情況下 , 透過timmer來做更新
    const [next_ETA , setNextETA] = useState(null) ; 


    // const [display , setDistplay] = useState(1) ; 
    const [ImageIndex , setImageIndex] = useState(0) ; 

    // socket io server Ref
    const socketRef = useRef(null); 

    useEffect(
        ()=>{
            // cause the rosClient.on is async function , so we create the reload timmer at the head of useEffect with 5000ms timeout , 
            // if connection success , clear the timmer , else perform the reload . 
            let reloader_ID = setTimeout(
                ()=>{
                    console.log("Setup the reloader");
                    rosClient.close();
                    window.location.reload(true);
                } , 10000 
            )
            // 連接成功後的處理項目
            // 1. 連接socket.io 到  硬體控制的後端
            // 2. 處理service , topic的註冊工作 , 
            // 3. 同時監控路線資訊的傳達 , 以及fetch上控端的資訊 
            rosClient.on("connection", ()=>{
                console.log("Connect to websocket server");
                setConnectionState(true); 
                clearTimeout(reloader_ID); 
                console.log("Clear reloader")


                socketRef.current = io("http://localhost:3061", {
                    reconnection : true, 
                    reconnectionAttempts: 10 , 
                    reconnectionDelay: 3000 , 
                    reconnectionDelayMax: 5000 , 
                }) ; 
                socketRef.current.on("connect",
                    ()=>{
                        console.log("Connect to backend-python server") ;
                    }
                )
                socketRef.current.on("connect_error" , 
                    (e)=>{
                        console.log("Socket Connect error") ; 
                    }
                ) 

                // note Vehicle pos topic 是有包含ETA的 , 但上控ETA還沒完成 , 因此這邊也不更新ETA
                const VehiclePos_topic = {ros:rosClient , ...ros_setting.VehiclePos_topic}
                const Vehicle_pos_subscriber = new ROSLIB.Topic(VehiclePos_topic) ; 
                Vehicle_pos_subscriber.subscribe(
                    (msg) => {
                        // console.log("msg.lon",msg.vehicle_longitude , "msg.lat",msg.vehicle_latitude) ; 
                        setVehicle_pos( [msg.vehicle_longitude , msg.vehicle_latitude]  );
                    }
                )


                // const StartMission = new ROSLIB.Service(StartMission_srv) ; 
                

                // StartMission : 由HMI作為Service server , 接受上控傳過來的初始訊息
                // const StartMission = new ROSLIB.Service(StartMission_srv) ; 
                // StartMission.advertise(
                //     (request,responce) =>{
                //         // console.log(`Receive Start Mission request : ${request}`); 
                //         setMission_name( request.mission_name  ) ; 
                //         const stations_temp  = {}
                //         // console.log("request depot_names :",request.depot_names);
                //         // console.log("request depot_longitude:",request.depot_longitude);
                //         // console.log("request depot_latutude:",request.depot_latutude) ; 
                //         for (let i=0 ; i < request.depot_names.length ; i++  ) {
                //             console.log('--',request.depot_names[i] ,request.depot_longitude[i],request.depot_latitude[i] );
                //             stations_temp[request.depot_names[i]] = [ request.depot_longitude[i] , request.depot_latitude[i] ];
                //         }
                //         console.log(`Debug StartMission station_temps: ${stations_temp}`) ; 
                //         setStations(stations_temp) ; 
                //         setRemindMsg(request.additional_message) ; 
                //         route_setting_sound.play();
                //         responce['result'] = true ; 
                //         return true
                //     }
                // )
                const StartMission_topic = {
                    ros:rosClient ,...ros_setting.StartMission_topic
                }
                const StartMission_subscriber = new ROSLIB.Topic(StartMission_topic); 
                StartMission_subscriber.subscribe(
                    (request) => {
                        console.log("DEBUG",request.mission_name);
                        setMission_name( request.mission_name  ) ; 
                        const stations_temp  = {}
                        for (let i=0 ; i < request.depot_names.length ; i++  ) {
                            console.log('--',request.depot_names[i] ,request.depot_longitude[i],request.depot_latitude[i] );
                            stations_temp[request.depot_names[i]] = [ request.depot_longitude[i] , request.depot_latitude[i] ];
                        }
                        console.log(`Debug StartMission station_temps: ${stations_temp}`) ; 
                        setStations(stations_temp) ; 
                        setRemindMsg(request.additional_message) ; 
                        route_setting_sound.play();
                    }
                )

                // // UpdateDepot : 由HMI作為Service server , 接受上控更新下一個目標點 
                // const UpdateDepont = new ROSLIB.Service(UpdateDepot_srv) ;
                // UpdateDepot.advertise(
                //     (request , responce) => {
                //         console.log(`Receive Update Depot request :${request}`) ; 
                //         setNextStation(request.next_depot_name);
                //         setNextETA(request.eta) ; 
                //         next_station_sound.play() ;
                //         responce['result'] = true ; 
                //         return true
                //     }
                // )
                const UpdateDepot_topic = {
                    ros:rosClient , ...ros_setting.UpdateDepot_topic
                }
                const Update_depot_subscriber = new ROSLIB.Topic(UpdateDepot_topic) ; 
                Update_depot_subscriber.subscribe(
                    (request) => {
                        console.log(`Receive Update Depot request :${request}`) ; 
                        setNextStation(request.next_depot_name);
                        setNextETA(request.eta) ; 
                        next_station_sound.play() ;
                    }
                )
                // GetMission : 主動探測主系統是否完成了初始化以及索取路線資訊 
                const GetMission = new ROSLIB.Service(GetMission_srv);
                const GetDepot = new ROSLIB.Service(GetDepot_srv) ; 
                const GetMission_request = new ROSLIB.ServiceRequest({
                    request:true
                })
                console.log("Call Service"); 
                GetMission.callService(
                    GetMission_request , 
                    (response)=>{
                        console.log(`GetMission Receive response ${response}`); 

                        // 預留一個接到空的Mission name的情況
                        // if(response.mission_name == "") {  }

                        // Settup the Mission configuration ( parelle with the StartMission , only need the one in the  both)
                        if (!Mission_name) {
                            setMission_name(response.mission_name) ; 
                            const stations_temp  = {} ; 
                            for (let i=0 ; i < response.depot_names.length ; i++  ) {
                                console.log('--',response.depot_names[i] ,response.depot_longitude[i],response.depot_latitude[i] );
                                stations_temp[response.depot_names[i]] = [ response.depot_longitude[i] , response.depot_latitude[i] ];
                            }
                            setStations(stations_temp) ; 
                            setRemindMsg(response.additional_message) ; 

                            // 06-29 repair the audio but ( overlay )
                            // route_setting_sound.play();
                            // if GetMission success , try GetDepot next . 
                            const GetDepot_request = new ROSLIB.ServiceRequest({request:true})
                            GetDepot.callService(
                                GetDepot_request , 
                                (response) => {
                                    if (response.next_depot_name == "") {
                                        // recover to the main page , but not yet specify next stop
                                        route_setting_sound.play();
                                    }
                                    else {
                                    setNextStation(response.next_depot_name) ; 
                                    setNextETA(response.eta); 
                                    next_station_sound.play() 
                                    }
                                },
                                (error)=>{
                                    console.log(`GetDepot Receive Error: ${error}`)
                                }
                            )
                        }
                    } , 
                    (error) => {console.log(`GetMission Receive error :${error}`) ; }
                )
                const HMIAction_topic = {
                    ros:rosClient , ...ros_setting.HMIAction_msg
                }
                const HMIAction = new ROSLIB.Topic(HMIAction_topic) ; 
                // HMIAction.advertise(
                //     (request , response) =>{
                //         console.log(`request action type: ${request.action_type} duration:${request.duration}`);
                //         // connect the socket server 

                //         // 0721 : Add sound for action_type 
                //         if ( Object.keys(action_trigger).includes(request.action_type.toString()) ) {
                //             action_trigger[request.action_type.toString()].play()
                //         }

                //         socketRef.current.emit("hmi_action" , {"action_type":request.action_type , "duration":request.duration})
                //         response['result'] = true ; 
                //         return true
                //     }
                // );
                HMIAction.subscribe(
                    (request) => {
                        console.log(`request action type: ${request.action_type} duration:${request.duration}`);
                        // connect the socket server 
                        // 0721 : Add sound for action_type 
                        if ( Object.keys(action_trigger).includes(request.action_type.toString()) ) {
                            console.log("HMIACTION - Voice !!!")
                            action_trigger[request.action_type.toString()].play()
                        }
                        console.log("HMIACTION - Call Buzzer !!!")
                        socketRef.current.emit("hmi_action" , {"action_type":request.action_type , "duration":request.duration})
                    }
                ) ; 

            });

            // timmer inside "error" & "close" is to handle the situation that connection success already but break off in process 
            rosClient.on("error",()=>{
                console.log("detect disconnection");
                setConnectionState(false);
                setTimeout(()=>{
                    console.log("Setup the reloader in error");
                    rosClient.close();
                    window.location.reload(true);
                } , 3000 );
            });
            rosClient.on("close",()=>{
                console.log("detect disconnection");
                setConnectionState(false)
                setTimeout(()=>{
                    console.log("Setup the reloader in close");
                    rosClient.close();
                    window.location.reload(true);
                } , 3000 );
            });

        return () =>{
            rosClient.close() ; 
            if (socketRef.current){socketRef.current.disconnect() ; }
        }

        } , []
    );

    // 換頁用Timmer --- ( 注意這邊用Timeout , 但依靠bind display來做循環)

    // useEffect(
    //     ()=>{
    //         const switch_display_timmer = setTimeout(
    //             ()=>{
    //                setDistplay((prev) =>{return prev===1? 0 : 1}  );
    //             } , 8000 
    //         ); 

    //         return ()=>{
    //             clearTimeout(switch_display_timmer) ; 
    //         }
    //     }  , [display]

    // )

    // 刷新ETA用Timmer --- (ETA的timmer 使用timeInterval)
    useEffect(
        () => {
            const ETA_timmer_ID = setTimeout(
                ()=>{
                    if (next_ETA) { setNextETA((prev) => prev-ETA_update_rate  ) }
                    console.log("Trigger eta timmer ,ETA:",next_ETA);
                } , ETA_update_rate * 1000  // covert time unit to second
            )
            return ()=>{
                clearTimeout(ETA_timmer_ID) ; 
            }
        }  , [next_ETA] 
    )
    

    // Render condition : 1. Connect to Ros Server 2. Fetch the HMI infomation complete
    console.log(`MissionName:${Mission_name} , connection state :${connectionState}`);
    if (Mission_name && connectionState) {
       
        return (
            <div className={"APP_Based"}>
                <div className={"Title-Board"}>
                    <Title mission_name={Mission_name}/>
                </div>
    
                {/* 類捷運站點進度條 */}
                <div className={"StationStepper-Board"}>
                    <StationStepper 
                    icon_array={icon_array}
                    // station_list={fixed_stations}  
                    station_list={Stations}
                    next_station={next_station} 
                    estimate_time={next_ETA}
                    />
                </div>
    
                {/* 訊息跑馬燈 -- 0620 discard */}
                {/* <div className={"marqueeBoard"}>
                    <MessageCarousel messages={messages} />
                </div> */}
                <div className={"BottomMessage-Board"}>
                    {/* <BottomMessage  messages={messages}/> */}
                    <BottomMessage messages={RemindMsg}/>
                </div>
    
    
    
                {/* <div className={"Connection-Board"}>
                    <ConnectionStatus connectionState={connectionState} />
                </div> */}
                {            }
                {/* 狀態欄(整合時間 , 通訊狀況 maybe + 天氣預報) */}
                <div className={"Status-Board"}>
                <Status connectionState={connectionState} /> 
                </div>
    
                {/* 乘客資訊 */}
                <div className={`NextStation-Board`}>
                    <NextStationBar next_station={next_station} estimate_time={next_ETA}/>
                </div>
    
                <div className={"Main-Board"}>
                </div>
    
                {/* leaf-let地圖 */}
                {
                    <div className={"RouteMap-Board"}>
                    <MapComponent 
                        icon_array={icon_array}
                        // fixed_stations={fixed_stations} 
                        fixed_stations={Stations}
                        vehiclePos={vehicle_pos}
                        next_station={next_station}
                    />
                    </div>
                }
                {/*  圖片燈箱 */}
         
                {
                        <div className={"ImageCarousel-Board"}>
                            <ImageGallery ImageIndex={ImageIndex} setImageIndex={setImageIndex} />
                        </div>
                }
    
                {/* JSMPeg & RTSP stream */}
                         {/* <div className={"StreamLive"}>
                            <StreamLive /> 
                        </div>  */}
            
            
            </div>
           
        )
    }
    else{
        console.log("Debug : ConnectionState : ,",connectionState);
        return (
            <div className={"WaittingConnect"}>
                <div className={"WaittingConnection-message"}>
                <Typography sx={{fontWeight:"bold",fontSize:100 , fontFamily:"-apple-system"}}>
                Wait for connect</Typography>
                </div>
            </div>
        )
    }


}

export default Home ;