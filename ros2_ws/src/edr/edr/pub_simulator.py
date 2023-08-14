import rclpy 
from rclpy.node import Node
from random import randint
from std_msgs.msg import String , Int32 


class MinimalPublisher(Node):

    def __init__(self):
        super().__init__('minimal_publisher')
        self.publisher1 = self.create_publisher(Int32, 'int_test', 10)
        self.publisher2 = self.create_publisher(String, 'string_test', 10)
        
        timer_period = 0.5  # seconds
        self.timer = self.create_timer(timer_period, self.timer_callback)
        self.i = 1

    def timer_callback(self):
        print(f"This is {self.i}-th publish")
        if self.i % 3 == 0 : 
            msg = Int32()
            msg.data = randint(1,10)
            self.publisher1.publish(msg) 
        else : 
            msg = String()
            msg.data = f"test string: {self.i}"
            self.publisher2.publish(msg)
            
        self.get_logger().info('Publishing: "%s"' % msg.data)
        self.i += 1

def main(args=None):
    rclpy.init(args=args)

    minimal_publisher = MinimalPublisher()

    rclpy.spin(minimal_publisher)

    # Destroy the node explicitly
    # (optional - otherwise it will be done automatically
    # when the garbage collector destroys the node object)
    minimal_publisher.destroy_node()
    rclpy.shutdown()

if __name__ == "__main__": 
    main()