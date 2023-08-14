from pymongo import MongoClient 

import json 
from datetime import datetime 


def main() : 
    with  open("/root/ros2_ws/src/edr/edr/config.json", "r") as file : 
        file = json.load(file) 
        server = file["Server"]
        db_name = file["Database"]
        port = file['port']



    # try : 
    Database = MongoClient(server,port , username="croso1024" , password="croso1024" )
    print(f"Connection database sucess")

    while 1 :  
        data = int(input("add str"))
        msg = {"testing":data}


        Database[db_name]["col"].insert_one(msg)
        
    

    # except : 
    #     raise RuntimeError("Error !")
