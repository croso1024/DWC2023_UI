import socketio 
import eventlet , json  , time 
import Jetson.GPIO as GPIO 
""" 
    Python後端的動作只有單一的警示燈運作 , 因此從上控傳遞HMIAction後 ,
    由HMI來負責decode , 並發出對應的relay control到python back-end
"""

socketIO_server = socketio.Server(cors_allowed_origins="*") 
relay_signal_pin = 31 

def GPIO_Setting(): 
    GPIO.setwarnings(False)
    GPIO.setmode(GPIO.BOARD)
    GPIO.setup( relay_signal_pin , GPIO.OUT )
    GPIO.output( relay_signal_pin , GPIO.LOW )
    print("GPIO-Setting Complete !")
    
# GPIO_control : by the signal of High/Low, 
# Note: Relay is normal open , so only use the high volt to trigger the alter light  
# Then we have 3 case 
#   (control_code = 0 ) signal without duration --> a. trigger open , wait for next command  
#   (control_code > 0 ) signal with duration --> trigger open with a timmer 
#   (control_code = -1) use for somecase that need to stop alter emergency .
def GPIO_control( control_code ) :
    
    assert type(control_code) is int , f"control_code format error, receive:{control_code}"
    try : 
        if control_code > 0 : 
            GPIO.output(relay_signal_pin, GPIO.HIGH)
            time.sleep(control_code)
            GPIO.output(relay_signal_pin,GPIO.LOW)

        elif control_code == 0 : 
            GPIO.output(relay_signal_pin,GPIO.LOW)
        elif control_code == -1 : 
            GPIO.output(relay_signal_pin,GPIO.HIGH)
        else : 
            raise RuntimeError(f"Control code range error , receive : {control_code}")
    
    except Exception as error : 
        print(f"GPIO control error: {error}")
        GPIO.cleanup()     

def HMIAction_Decoder(hmi_action): 
    # ----- action type coding:
    # uint8 STOP_BELL_TRIGGERED = 11
    # uint8 APPROACHING_DEPOT = 12
    # uint8 BEFORE_OPEN_DOOR = 21
    # uint8 BEFORE_CLOSE_DOOR = 22
    # uint8 BEFORE_DEPARTURE = 23
    # uint8 AFTER_DEPARTURE = 24
    # uint8 ARRIVE_AT_TERMINAL = 31
    # uint8 CLOSE_DOOR_COUNTDOWN = 51
    # uint8 ADVERTISEMENT = 101
    # *uint8 TESTING = 200
    
    # ----- duration coding:
    # int16 ONLY_ONCE = 0
    # int16 REPEAT_FOREVER = -1
    print(f"Decode --HMIAction:{hmi_action}")    
    control_code = hmi_action["duration"]
    return control_code
    
    
    
@socketIO_server.event 
def connect(sid, environ):
    print('Client connected:', sid)
    
@socketIO_server.event 
def hmi_action(sid, data):
    print('Received message:', data)
    # 在这里处理来自客户端的消息，执行相应的操作
    # 例如，可以调用硬件控制的功能并发送回应消息给客户端
    control_code = HMIAction_Decoder(data)    
    print(f"Generate control code : {control_code}")

    GPIO_control(control_code)
    





if __name__ == "__main__": 
    print("Start GPIO backend")	
    GPIO_Setting()
    app = socketio.WSGIApp(socketIO_server)
    eventlet.wsgi.server(eventlet.listen(( "localhost",3061) ), app)
    # app = socketio.WGSIApp(socketIO_server)
    # socketio.WSGIServer( ('lcalhost', 3061)  ,app) .serve_forever()
