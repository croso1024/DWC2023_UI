from turtorial_interfaces.srv import UpdateDepot 
from turtorial_interfaces.msg import MissionMsg , NextDepot
import rclpy 
from rclpy.node import Node 
import random

class simulatorServiceClient(Node):
    
    def __init__(self): 
        super().__init__("driver_service_client")
 
        # self.updateDepot_srvClient = self.create_client(
        #     UpdateDepot , "/HMI/driver/update_depot" 
        # )
        
        self.updateDepot_publisher = self.create_publisher(
            NextDepot , "HMI/driver/next_depot" , 10 
        )
        
        self.MissionMsg_publisher = self.create_publisher(
            MissionMsg , "/decision/pending_mission" , 10 
        )
        
    #     while not self.updateDepot_srvClient.wait_for_service(timeout_sec=1.0) : 
    #         self.get_logger().info("service not available,waiting again...")
    #     self.updateDepot_request = UpdateDepot.Request() 
        
    
    # def send_UpdateDepot(self,data:dict): 
        
    #     self.updateDepot_request.next_depot_name = data["next_depot_name"]
    #     self.updateDepot_request.eta = data["ETA"]
    #     self.updateDepot_request.etd = data["ETD"]

    #     self.future2 = self.updateDepot_srvClient.call_async(self.updateDepot_request)
    #     rclpy.spin_until_future_complete(self,self.future2)
    #     return self.future2.result()
 
    # def send_pending_mission(self,data:dict):
        
    #     msg = MissionMsg() 
    #     msg.name = data['name']
    #     msg.reverse = data["reverse"]
        
    #     self.MissionMsg_publisher.publish(msg)

    def send_UpdateDepot(self , data:dict): 
        
        msg = NextDepot() 
        depot_name = data["next_depot_name"]
        msg.next_depot_name= data["next_depot_name"]
        msg.eta = data["ETA"] 
        msg.etd = data["ETD"] 
        
        self.updateDepot_publisher.publish(msg) 
        print(f"Publish ! Depot:{depot_name}")
        
def main(): 
    rclpy.init() 
    service_client = simulatorServiceClient()

    while 1 : 
        mode = str(input("Plz input test message: 1. UpdateDepot , 2. MissionMsg ")) 
        if mode == str(1): 
            next_depot = None
            while next_depot not in ["A","B","C","D","E","F"]:
                next_depot = str(input("Plz input next_depot name"))
            data = {
                "next_depot_name":next_depot , 
                "ETA":70 , 
                "ETD":1250, 
            }
            service_client.send_UpdateDepot(data) 
        
        elif mode  == str(2) : 
            data = {
                "name": random.choice(["test1","test2","test3","test4"]),
                "reverse": True 
            }
            service_client.send_pending_mission(data)  
        else : 
            break 

    service_client.destroy_node()
    rclpy.shutdown() 
    
if __name__ == "__main__":
    main()