import rclpy 
from rclpy.node import Node 
from builtin_interfaces.msg import Time 
from std_msgs.msg import String ,Header ,Bool , Float32 
from turtorial_interfaces.msg import ErrorSummary , WrappedState
import random

error_event = lambda  : False if random.random() > 0.2 else True 

class VehiclePosPublisher(Node):
    
    def __init__(self): 
        super().__init__("driver_fake_publisher")
        self.ErrorCode_publisher = self.create_publisher(ErrorSummary , "/decision/error_summary", 10)
        self.submodule_nums = 8 
        self.SM_state = list("ABCDEFGHIJKLNOPQRSTUVWXYZ")
        self.MC_state = ["100","200","300","400","500"]
        # self.SM_system_level_publisher = self.create_publisher(String , "decision/system_level/state",10)
        # self.SM_mission_publisher = self.create_publisher(String , "decision/mission/state",10)
        # self.SM_mission_register_publisher = self.create_publisher(String , "decision/mission_register/state",10)
        # self.SM_adavailability_publisher = self.create_publisher(String , "decision/ad_availability/state",10)
        # self.SM_driving_mode_publisher = self.create_publisher(String , "decision/driving_mode/state",10)
        self.StateMachine_publisher = self.create_publisher(WrappedState,"/decision/wrapped_state",10) 
        
        self.MC_publishers = [
            self.create_publisher(Float32 , "/middle_control/throttle" , 10),
            self.create_publisher(Float32 , "/middle_control/brake" , 10),
            self.create_publisher(Float32 , "/middle_control/odom" , 10),
            self.create_publisher(Float32 , "/middle_control/steering" , 10)
        ]
        # self.MC_throttle_publisher = self.create_publisher(Float32 , "/middle_control/throttle" , 10)
        # self.MC_brake_publisher =  self.create_publisher(Float32 , "/middle_control/brake" , 10)
        # self.MC_odom_publisher =  self.create_publisher(Float32 , "/middle_control/odom" , 10)
        # self.MC_steering_pusblier = self.create_publisher(Float32 , "/middle_control/steering" , 10)
        
        
        timer_period = 5
        self.timer = self.create_timer(timer_period , self.timer_callback)
        
    def timer_callback(self): 
        # Error code ------------------------------------------------------------
        msg = ErrorSummary()
        header = Header() 
        header.stamp = self.get_clock().now().to_msg()
        header.frame_id = "testUI" 
        msg.header = header 
        msg.module_name = [ "module"+str(i) for i in range(self.submodule_nums )]
        msg.triggered_error = [ error_event() for i in  range(self.submodule_nums) ]
        msg.error_code = [ str(random.randint(a=1,b=10)) for i in range(self.submodule_nums)]
        self.ErrorCode_publisher.publish(msg) 
        # State Machine ------------------------------------------------------------
        msg = WrappedState() 
        msgTime = Time() 
        msgTime.sec = 10 
        msgTime.nanosec = 10 
        msg.stamp = msgTime
        msg.system_level_state = random.choice(self.SM_state) 
        msg.mission_state = random.choice(self.SM_state)
        msg.mission_register_state = random.choice(self.SM_state)
        msg.ad_available = random.choice(self.SM_state)
        # msg.driving_mode =random.choice(self.SM_state)
        msg.driving_mode = "Auto" if random.random() >0.5 else "Manual"
        self.StateMachine_publisher.publish(msg)
        
        # Middle Control ------------------------------------------------------------
        for MC_module in self.MC_publishers : 
            msg = Float32() 
            msg.data = float(random.choice(self.MC_state))
            MC_module.publish(msg)

        print("Publish")
        
def main(args = None): 
    rclpy.init(args = args) 
    
    publisher = VehiclePosPublisher() 
    
    rclpy.spin(publisher) 
    
    publisher.destroy_node() 
    rclpy.shutdown() 
    

if __name__ == "__main__": 
    main()
