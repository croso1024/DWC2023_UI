import rclpy 
from rclpy.node import Node 
from std_msgs.msg import String 
import json ,random 

class TopicPublisher(Node): 
    
    def __init__(self): 
        super().__init__("AVBus_topic_test")
        self.Publisher = self.create_publisher(String,"UI_vehicle_info",10)
        
    
    def pub(self): 
        vehicle_info = {
            "speed":random.random(),
            "next_station" : ["A","B","C","D","E","F"][random.randint(0,5)] ,
            "stop_at_next_station" : True if random.random() >0.5 else False 
        }
        msg = String() 
        msg.data = json.dumps(vehicle_info)
        self.Publisher.publish(msg)
        

def main(args=None): 
    rclpy.init(args=args)

    publisher = TopicPublisher()
    while 1 : 
        a = int(input("Press any button to publish topic ") ) 
        if a:
            publisher.pub() 
        else : break 
    publisher.destroy_node()
    rclpy.shutdown() 

if __name__ == "__main__": 
    main() 