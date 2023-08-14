import rclpy
from rclpy.node import Node

from std_msgs.msg import String
from std_msgs.msg import Int32


class Multiple_subscriber(Node): 
    
    def __init__(self): 
        super().__init__("Multiple_subscriber")
        self.subscription1 = self.create_subscription(
            Int32 , "int_test" , self.callback1 , 10
        )
        self.subscription2 = self.create_subscription(
            String , "string_test" , self.callback2 , 10 
        )
    
    def callback1(self,msg): 
        self.get_logger().info(f"Receive from topic int test :{msg.data}")
    
    def callback2(self,msg): 
        self.get_logger().info(f"Receive from topic string test : {msg.data}")


def main(args=None): 
    print(f"-- start --")
    rclpy.init(args=args) 
    
    node = Multiple_subscriber()
    
    rclpy.spin(node)

if __name__ == "__main__" : 
    main() 

