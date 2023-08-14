import rclpy
from rclpy.node import Node
from std_msgs.msg import Int32
from sensor_msgs.msg import Imu
from sensor_msgs.msg import NavSatFix
from nav_msgs.msg import Odometry
from sensor_msgs.msg import PointCloud2
import pymongo 
from pymongo import MongoClient
import json ,time ,bson
from bson.binary import Binary

class Multiple_subscriber(Node):

    def __init__(self , queue_size=1 , write_interval=0.05):
        super().__init__("Multiple_subscriber")
        self.imu_subscriber = self.create_subscription(
            Imu, "/imu/data", self.imu_callback, queue_size
        )
        self.nav_subscriber = self.create_subscription(
            NavSatFix, "/imu/nav_sat_fix", self.nav_callback, queue_size
        )
        self.odom_subscriber = self.create_subscription(
            Odometry, "/imu/odometry", self.odom_callback, queue_size
        )
        self.point_cloud_subscriber = self.create_subscription(
            PointCloud2, "/rslidar_points", self.point_cloud_callback, queue_size
        )
        self.write_interval = write_interval 
        self.timer = self.create_timer(self.write_interval , self.timer_callback) 
        self.data_table = {
            "IMU": {} , "NavSatFix":{} ,"Point_cloud":{}
        }         
        self.connection_database() 
        
    def connection_database(self): 
        with open("/root/ros2_ws/src/edr/edr/config.json","r") as file : 
            file = json.load(file) 
            server = file["Server"]
            database_name = file['Database']
            port = file['port']
            collection = file["CollectionNames"]
        try : 
            self.Database = MongoClient(server,port,username="croso1024" , password="croso1024")    
            if database_name in self.Database.list_database_names() : print(f"DB : {database_name} already exist !")
            else : print(f"DB : {database_name} not yet create  !")
            if collection in self.Database[database_name].list_collection_names() : print(f"Collection : {collection} already exist !")
            else : print(f"Collection : {collection} not yet create !")
        except : 
            raise RuntimeError("Can not connection to the database")
        self.Database_handler = self.Database[database_name][collection]
        print(f"Database connect success")
        
        
    """
        time_callback : write the log-data into mongo-container every {interval} milli-seconds . 
    """
    def timer_callback(self):
        #print(f"Write log-data : {self.data_table}")
        print(f"Log data---")
        self.data_table['_id'] = time.time()
        try: 
           self.Database_handler.insert_one(self.data_table)
            
        except pymongo.errors.DuplicateKeyError: 
            pass 
        
    def imu_callback(self, msg):
        # Handle incoming IMU message
        linear_accerleration = {
            "x":msg.linear_acceleration.x , 
            "y":msg.linear_acceleration.y ,
            "z":msg.linear_acceleration.z 
        }
        angular_accerleration = {
            "x":msg.angular_velocity.x ,
            "y":msg.angular_velocity.y ,
            "z":msg.angular_velocity.z ,
        }
        orientation = {
            "x":msg.orientation.x ,
            "y":msg.orientation.y ,
            "z":msg.orientation.z ,
        }
        IMU_data = {
        
            "linear":linear_accerleration , 
            "angular":angular_accerleration , 
            "orientation":orientation ,         
        }
        # self.get_logger().info(f"Receive imu msg")
        self.data_table["IMU"] = IMU_data
    def nav_callback(self, msg):
        # Handle incoming NavSatFix message
        nav_data = {
            "latitude":msg.latitude , 
            "longitude":msg.longitude , 
            "altitude":msg.altitude ,
        }
        self.data_table["NavSatFix"] = nav_data
    def odom_callback(self, msg):
        # Handle incoming Odometry message
        pass

    def point_cloud_callback(self, msg):
        # Handle incoming PointCloud2 message
        point_cloud = {
            # "data":json.dumps(msg.data.tolist())
            "data":Binary(msg.data.tobytes())
        }
        self.data_table["Point_cloud"] = point_cloud
        
        
def main(args=None):
    print(f"-- start -ss-")
    rclpy.init(args=args)

    node = Multiple_subscriber()

    rclpy.spin(node)

if __name__ == "__main__":
    main()
