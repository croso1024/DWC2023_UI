import rclpy 
from rclpy.node import Node 

from std_msgs.msg import String
from turtorial_interfaces.msg import UpdatePassengerHMI 
from collections import namedtuple
import random

Pos = namedtuple("Pos", "lon,lat")
pos_update = lambda x : x+ (random.random()-0.5)*0.0005

class VehiclePosPublisher(Node):
    
    def __init__(self): 
        super().__init__("pos_publisher")
        self.publisher = self.create_publisher(UpdatePassengerHMI , "/HMI/passenger/update_passenger_hmi", 10)
        timer_period = 1 
        self.timer = self.create_timer(timer_period , self.timer_callback)
        self.init_pos = Pos(lon = 25.13248 , lat=55.38216)
        
    def timer_callback(self): 
        msg = UpdatePassengerHMI()
        msg.vehicle_longitude = self.init_pos.lon
        msg.vehicle_latitude = self.init_pos.lat 
        msg.eta = 1000 # 目前車端還沒有implement eta的更新 , 故react端吃eta也先不更新useState
        self.get_logger().info(f"Publish Pos : {self.init_pos}")
        self.publisher.publish(msg) 
        self.init_pos = Pos(
            lon = round(pos_update(self.init_pos.lon),5) ,
            lat = round( pos_update(self.init_pos.lat) ,5) 
                            )
        
def main(args = None): 
    rclpy.init(args = args) 
    
    publisher = VehiclePosPublisher() 
    
    rclpy.spin(publisher) 
    
    publisher.destroy_node() 
    rclpy.shutdown() 
    

if __name__ == "__main__": 
    main()
