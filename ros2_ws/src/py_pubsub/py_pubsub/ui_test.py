import rclpy 
from rclpy.node import Node 
from std_msgs.msg import String  
import json



class PagePublisher(Node): 
    
    def __init__(self): 
        super().__init__("web_page")
        self.pagePublish = self.create_publisher(String,"UI_RenderPage",10) 
        self.Page_template = {
        "page_name":None , 
        "page_info":{
            "vehicle_id":"AMR01"        , 
            "battery" : 20, 
            # "destination":"test destination" , 
            # "waypoint" : "test waypoint " , 
            "customer_id": "customer2"  , 
            # "evaluation_time": 22 , 
            "mission_type":"pickUP" , 
            "order_id" : "order1231" ,   #this is for delivery 
            "layer_info" : {
                "layer1": {"c_id":"customer1","o_id":"order1230","items":["test1","test2"]} ,   # this is for pickup
                "layer2" : {"c_id":"customer2" ,"o_id":"order1231", "items":["good1","good2"]}, 
                "layer3" : {"c_id":"customer3" , "o_id":"order1232","items":["123","456"]}, 
            },
            "commodity":     {
                "layer1": {"c_id":"customer1","o_id":"order1230","items":["test1","test2"]} ,   # this is for pickup
                "layer2" : {"c_id":"customer2" ,"o_id":"order1231", "items":["good1","good2"]}, 
                "layer3" : {"c_id":"customer3" , "o_id":"order1232","items":["123","456"]}, 
            }
        }
        }
        self.pageFunc = [None ,self.StandBy ,self.OnMission,self.PickUp,self.Delivery] 
    def StandBy(self): 
        Page = {}
        Page.update({"page_name":"StandBy"})
        Page.update({"page_info":   {
            "vehicle_id":"AMR01" , 
            "battery": 20 
        }})
        msg = String() 
        msg.data = json.dumps(Page)
        # self.pagePublish.publish(json.dumps(Page)) 
        self.pagePublish.publish(msg)
    def OnMission(self):
        Page = {}
        Page.update({"page_name":"OnMission"})
        Page.update({"page_info":   {
            "vehicle_id":"AMR01" , 
            "battery": 20 ,
            "customer_id":"Iam" ,
            "mission_type":"ongoing"
        }})
        msg = String() 
        msg.data = json.dumps(Page)
        self.pagePublish.publish(msg) 
    def PickUp(self):
        Page = {}
        Page.update({"page_name": "PickUp" })
        Page.update({"page_info":   {
            "vehicle_id":"AMR01" , 
            "battery": 20 ,
            "mission_type":"pickup",
            "layer_info" : {
                "layer1": {"c_id":"customer1","o_id":"order1230","items":["test1","test2"]} ,   # this is for pickup
                "layer2" : {"c_id":"customer2" ,"o_id":"order1231", "items":["good1","good2"]}, 
                "layer3" : {"c_id":"customer3" , "o_id":"order1232","items":["123","456"]}, 
            }
        }})
        msg = String() 
        msg.data = json.dumps(Page)
        self.pagePublish.publish(msg) 
    def Delivery(self):
        Page = {}
        Page.update({"page_name": "Delivery" })
        Page.update({"page_info":   {
            "vehicle_id":"AMR01" , 
            "battery": 20 ,
            "order_id":"order1232",
            #"customer_id":"Iam" ,
            "mission_type":"ongoing",
            "commodity":{
                "layer1": {"c_id":"customer1","o_id":"order1230","items":["test1","test2"]} ,   # this is for pickup
                "layer2" : {"c_id":"customer2" ,"o_id":"order1231", "items":["good1","good2"]}, 
                "layer3" : {"c_id":"customer3" , "o_id":"order1232","items":["123","456"]}, 
            }
        }})
        msg = String() 
        msg.data = json.dumps(Page)
        self.pagePublish.publish(msg) 

def main(args=None): 
    rclpy.init(args=args) 
    
    publisher = PagePublisher()

    while 1 : 
        mode = int(input("plz input page u want to go by id "))
        if mode == 999 : break 
        publisher.pageFunc[mode]()
    
    publisher.destroy_node()
    rclpy.shutdown() 

if __name__ == "__main__": 
    main() 