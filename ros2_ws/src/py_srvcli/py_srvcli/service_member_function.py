from example_interfaces.srv import AddTwoInts 
from turtorial_interfaces.srv import AddThreeInts
#這個是到example_interfaces底下src資料夾去引用 AddTwoInts這個檔案 
# , 內部已經define了request & responce的格式
import rclpy
from rclpy.node import Node


class MinimalService(Node):

    def __init__(self):
        super().__init__('minimal_service')
        # self.srv = self.create_service(AddTwoInts, 'add_two_ints', self.add_two_ints_callback)
        self.srv = self.create_service(AddThreeInts, 'add_three_ints', self.add_three_ints_callback)


    def add_two_ints_callback(self, request, response):
        response.sum = request.a + request.b
        self.get_logger().info('Incoming request\na: %d b: %d' % (request.a, request.b))

        return response

    def add_three_ints_callback(self,request , response):
        response.sum = request.a + request.b + request.c
        self.get_logger().info(f"Incoming reqeust :{request.a}/{request.b}/{request.c}")
        return response

def main():
    rclpy.init()

    minimal_service = MinimalService()

    rclpy.spin(minimal_service)

    rclpy.shutdown()


if __name__ == '__main__':
    main()