import rclpy
from rclpy.node import Node
from std_msgs.msg import Int32
from sensor_msgs.msg import NavSatFix , Imu ,PointCloud2
from nav_msgs.msg import Odometry
import pymongo 
from pymongo import MongoClient
import json ,time ,bson
from bson.binary import Binary
from message_filters import ApproximateTimeSynchronizer , Subscriber 

""" 
    Data-logger with multiple ros2 topic and timestamp sync 
"""

class TimeSync_multiple_subscriber(Node): 
    
    def __init__(self,queue_size=5,write_interval=1 , sync_delay=0.1): 
        super().__init__("TS_logger_Node")

        self.queue_size = queue_size 
        self.write_interval = write_interval 
        self.sync_delay = sync_delay
        
        self.imu_subscriber = Subscriber(self,Imu, "/imu/data" )
        self.nav_subscriber = Subscriber(self,NavSatFix,"/imu/nav_sat_fix") 
        #self.odom_subscriber = Subscriber(self,Odometry,"/imu/odometry") 
        self.pointClout_subscriber = Subscriber(self,PointCloud2,"rslidar_points")
        """ 
            use a timer to periodically write to database
        """
        #self.Database_writer = self.create_timer(self.write_interval , self.Database_write)

        self.ApproximateTimeSync = ApproximateTimeSynchronizer(
            # [self.imu_subscriber,self.nav_subscriber,self.odom_subscriber,self.pointClout_subscriber],
            [self.imu_subscriber,self.nav_subscriber,self.pointClout_subscriber],
            queue_size=queue_size ,
            slop = self.sync_delay
        )

        self.data_table = {
            "IMU":{} ,"NavSatFix":{} , "Point_cloud":{}
        }
        self.non_empty = False 
        #self.connect_database()
        self.ApproximateTimeSync.registerCallback(self.TimeSync_Callback)

    def connect_database(self): 
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
    def Database_write(self): 
        if self.non_empty: 
            print(f"Log data -- ")
            self.data_table["_id"] = time.time() 
            try : 
                self.Database_handler.insert_one(self.data_table) 
            except pymongo.errors.DuplicateKeyError: 
                pass 
    
    def TimeSync_Callback(self,imu_msg,nav_msg,PointClout2_msg): 
        self.non_empty = True 
        self.update_IMU(imu_msg)
        self.update_NavSatFix(nav_msg)
        self.update_PointCloud(PointClout2_msg)


    def update_IMU(self,msg):
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
    
    def update_NavSatFix(self,msg): 
        nav_data = {
            "latitude":msg.latitude , 
            "longitude":msg.longitude , 
            "altitude":msg.altitude ,
        }
        self.data_table["NavSatFix"] = nav_data
    
    def update_Odom(self,msg): 
        pass 
    
    def update_PointCloud(self,msg): 
        point_cloud = {
            # "data":json.dumps(msg.data.tolist())
            "data":Binary(msg.data.tobytes())
        }
        self.data_table["Point_cloud"] = point_cloud

def main(args=None):
    print(f"-- start --")
    rclpy.init(args=args)

    node = TimeSync_multiple_subscriber()
    
    rclpy.spin(node)

if __name__ == "__main__":
    main()
