export const StateMachine_init = {
    "system_level": "initializing",
    "driving_mode": "Manual" , 
    "ad_availability": "ADUnavailable" , 
    "mission":"NoMission" , 
    "mission_register":"StandBy" , 
} ; 
export const Error_code_init = {
    module_name : ["Sensing",'Localization','Perception','Planner','Decision',
    'Communication','Middle_Control','Lower_Control','HMI','Peripherals','System'
    ] , 
    triggered_error : [
        false,false,false,true,false,false,false,true,false,false,false
    ] , 
    error_code : [0,0,0,22,0,0,0,23,0,0,0]
};

export const MiddleControl_init = {
    "throttle":100 , 
    "brake":100 , 
    "odom":200 , 
    "steering":200 , 
};

export const NextDepot_init = {
    "next_depot_name":null , 
    "eta": null , 
    "etd": null , 
}

export const PreviousTask_init = {
    task_type:4 , 
    task_reverse:false , 
    task_name:"test"
}

export const Mission_init = {
    type:null , 
    name : null  ,
    reverse : null ,
}