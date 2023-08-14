from turtorial_interfaces.srv import GetMission , GetDepot
import rclpy 
from rclpy.node import Node 
import random


class simulatorServiceServer(Node):

    def __init__(self , next_stop:bool):
        super().__init__("passenger_service_server")
        self.GetMission_srvServer = self.create_service(
            GetMission , "/decision/get_mission" ,  self.get_mission_callback
        )
        self.GetDepot_srvServer = self.create_service(
            GetDepot , "/decision/get_depot" , self.get_depot_callback
        )
        self.next_stop = next_stop 
        
        
    def get_mission_callback(self,request , response): 
        response.mission_name = "284"
        response.depot_names = ["A","B","C","D","E","F","G"]
        response.depot_longitude = [25.132032,25.131039,25.135036,25.136035,25.137034,25.131039,25.13183639042842]
        response.depot_latitude = [55.38159,55.38259,55.38359,55.38459,55.38559 , 55.38759,55.383994523312434]
        response.additional_message = ["Please fasten your seatbelts","Welcome aboard the Iauto bus","---wewewe"]

        return response
    
    def get_depot_callback(self,request , response): 
        
        if self.next_stop : 
            response.next_depot_name = random.choice(["B","C","D","E","F"])
            response.eta = random.randint(100,220)
            response.etd = int(str(random.randint(0,23)) + str(random.randint(0,60)))
        else : 
            response.next_depot_name = ""
            response.eta = random.randint(100,220)
            response.etd = int(str(random.randint(0,23)) + str(random.randint(0,60)))

        self.get_logger().info(f"Response get-depot : {response.next_depot_name} at {response.eta} seconds")
        return response
            
def main(): 
   
    rclpy.init()
    next_stop =  bool(int(input("Have next stop !? Yes:1 , No:0 ")))
    simulator_serviceServer = simulatorServiceServer(next_stop=next_stop)
    rclpy.spin(simulator_serviceServer)
    rclpy.shutdown()



if __name__ == "__main__":
    main()