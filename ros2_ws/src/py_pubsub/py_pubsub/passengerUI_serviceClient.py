from turtorial_interfaces.srv import UpdateDepot , HMIAction
from turtorial_interfaces.msg import StartMission , NextDepot
import rclpy 
from rclpy.node import Node 


class simulatorServiceClient(Node):
    
    def __init__(self): 
        super().__init__("simulator_service_client")
        # self.startMission_srvClient = self.create_client(
        #     StartMission,"/HMI/passenger/start_mission" 
        # ) 
        
        self.startMission_publisher = self.create_publisher(
            StartMission , "/HMI/passenger/start_mission" , 10 
        )
        # self.updateDepot_srvClient = self.create_client(
        #     UpdateDepot , "/HMI/passenger/update_depot" 
        # )
        
        self.updateDepot_publisher = self.create_publisher(
            NextDepot , "/HMI/driver/next_depot" , 10 
        )
        self.hmiAction_srcClient = self.create_client(
            HMIAction , "/HMI/passenger/hmi_action"  
        )
        
        # while not self.startMission_srvClient.wait_for_service(timeout_sec=1.0) : 
        #     self.get_logger().info("service not available,waiting again...")
        # while not self.updateDepot_srvClient.wait_for_service(timeout_sec=1.0) : 
        #     self.get_logger().info("service not available,waiting again...")
        while not self.hmiAction_srcClient .wait_for_service(timeout_sec=1.0) : 
            self.get_logger().info("service not available,waiting again...")


        # self.startMission_request = StartMission.Request()
        # self.updateDepot_request = UpdateDepot.Request() 
        self.hmiAction_request = HMIAction.Request() 
        
    
    # def send_StartMission(self,data:dict):
    #     self.startMission_request.mission_name = data["mission_name"]        
    #     self.startMission_request.depot_names =data["depot_names"]
    #     self.startMission_request.depot_longitude = data["depot_longitude"]
    #     self.startMission_request.depot_latitude = data["depot_latitude"]
    #     self.startMission_request.additional_message = data["additional_message"]
    #     self.future1 = self.startMission_srvClient.call_async(self.startMission_request) 
    #     rclpy.spin_until_future_complete(self,self.future1) 
    #     return self.future1.result()
    
    # def send_UpdateDepot(self,data:dict): 
        
    #     self.updateDepot_request.next_depot_name = data["next_depot_name"]
    #     self.updateDepot_request.eta = data["ETA"]
    #     self.updateDepot_request.etd = data["ETD"]

    #     self.future2 = self.updateDepot_srvClient.call_async(self.updateDepot_request)
    #     rclpy.spin_until_future_complete(self,self.future2)
    #     return self.future2.result()
    
    
    def send_StartMission(self,data:dict) : 
        msg = StartMission() 
        msg.mission_name = data["mission_name"]        
        msg.depot_names =data["depot_names"]
        msg.depot_longitude = data["depot_longitude"]
        msg.depot_latitude = data["depot_latitude"]
        msg.additional_message = data["additional_message"] 
        
        self.startMission_publisher.publish(msg) 
    
    def send_UpdateDepot(self,data:dict): 
        msg = NextDepot() 
        msg.next_depot_name = data["next_depot_name"]
        msg.eta = data["ETA"]
        msg.etd = data["ETD"]
        
        self.updateDepot_publisher.publish(msg) 

    
    def send_HMIAction(self,data:dict): 
        self.hmiAction_request.action_type = data["action_type"]
        self.hmiAction_request.duration = data["duration"]

        self.future3 = self.hmiAction_srcClient.call_async(self.hmiAction_request) 
        rclpy.spin_until_future_complete(self,  self.future3)
        return self.future3.result() 
        
        
        

def main(): 
    rclpy.init() 
    service_client = simulatorServiceClient()

    while 1 : 
        mode = str(input("Plz input test message type-- 1:StartMission 2:UpdateDepot 3:HMIAction"))
        if mode == str(1) : 
            data = {
                "mission_name":"507",
                "depot_names" : ["A","B","C","D","E","F","G"],
                "depot_longitude" : [25.132032,25.131039,25.135036,25.136035,25.137034,25.131039,25.13183639042842],
                "depot_latitude" :[55.38159,55.38259,55.38359,55.38459,55.38559 , 55.38759,55.38399] ,
                "additional_message":["Please fasten your seatbelts","Welcome aboard the Iauto bus","----Test----"], 
            }
            response_startMission = service_client.send_StartMission(data)
            print(f"\n----\n")
        
            
        elif mode == str(2) : 
            next_depot = None
            while next_depot not in ["B","C","D","E","F"]:
                next_depot = str(input("Plz input next_depot name"))
                
            data = {
                "next_depot_name":next_depot , 
                "ETA":200 , 
                "ETD":1250, 
            }

            response_updateDepot = service_client.send_UpdateDepot(data) 
            print(f"\n----\n")
        
        elif mode == str(3): 
            
            action_type = int(input("PLZ input action type\n")) 
            duration = int(input("input duration")) 
            data = {
                "action_type":action_type ,
                "duration":duration
            }
            response_hmiAction = service_client.send_HMIAction(data) 
            
        else : 
            print("--Break--")
            break
    
    service_client.destroy_node()
    rclpy.shutdown() 
    
if __name__ == "__main__":
    main()