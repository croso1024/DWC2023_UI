from turtorial_interfaces.srv import SimpleBoolService , SimpleStringService ,AddMission , GetDepot
import rclpy 
from rclpy.node import Node 
import random


class simulatorServiceServer(Node):

    def __init__(self ):
        super().__init__("driver_service_server")
        
        self.AddMission_srvServer = self.create_service(
            AddMission , "/decision/add_mission_trigger" , self.AddMission_response
        )
        self.ModeSwitch_srvServer = self.create_service(
            SimpleStringService , "/decision/mode_switch" ,  self.SimpleStringService_response
        )
        self.LeaveStation_srvServer = self.create_service(
            SimpleBoolService , "/decision/leave_depot" ,  self.SimpleBoolService_response
        )
        self.DepotPassed_srvServer = self.create_service(
            SimpleBoolService ,"/decision/pass_depot" ,  self.SimpleBoolService_response
        )
        self.GetDepot_srvServer = self.create_service(
            GetDepot , "/decision/get_depot" , self.GetDepot_response
        )
    def SimpleBoolService_response(self,request , response):
        self.get_logger().info(f"Receive request : {request}")
        response.result = True if random.random() >0.5 else False 
        return response 
    
    def SimpleStringService_response(self,request,response):
        self.get_logger().info(f"Receive request : {request}")
        response.result = True if random.random() >0.5 else False 
        return response 
    
    def GetDepot_response(self,request , response): 
        self.get_logger().info(f"Receive request : {request}")
        response.next_depot_name = random.choice(["A","B","C","D"]) 
        response.eta = 80 
        response.etd = random.choice([1315,2312,1829])
        return response 
    
    def AddMission_response(self,request , response): 
        self.get_logger().info(f"Receive AddMission request : Type:{request.type} Name:{request.name} Reverse:{request.reverse}")
        response.result = True
        return response
            
def main(): 
   
    rclpy.init()
    simulator_serviceServer = simulatorServiceServer()
    rclpy.spin(simulator_serviceServer)
    rclpy.shutdown()

if __name__ == "__main__":
    main()