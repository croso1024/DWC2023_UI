import sys

from example_interfaces.srv import AddTwoInts
#這個是到example_interfaces底下src資料夾去引用 AddTwoInts這個檔案 
# , 內部已經define了request & responce的格式

from turtorial_interfaces.srv import AddThreeInts 
import rclpy
from rclpy.node import Node


class MinimalClientAsync(Node):

    def __init__(self):
        super().__init__('minimal_client_async')
        # create client的 service type,  name(add_two_ints)都要和service server相同才能正常通訊!
        # self.cli = self.create_client(AddTwoInts, 'add_two_ints')
        self.cli = self.create_client(AddThreeInts, 'add_three_ints')
        # 此while迴圈官方文檔是說用來檢查service的type和nanme是不是可用的(service server那邊是否也被register???)
        while not self.cli.wait_for_service(timeout_sec=1.0):
            self.get_logger().info('service not available, waiting again...')
        # self.req = AddTwoInts.Request()
        self.req = AddThreeInts.Request() 

    def send_request(self, a, b,c):
        self.req.a = a
        self.req.b = b
        self.req.c = c 
        self.future = self.cli.call_async(self.req)
        rclpy.spin_until_future_complete(self, self.future)
        return self.future.result()


def main():
    rclpy.init()

    minimal_client = MinimalClientAsync()
    # response = minimal_client.send_request(int(sys.argv[1]), int(sys.argv[2]))
    response = minimal_client.send_request(int(sys.argv[1]), int(sys.argv[2]),int(sys.argv[3]))
    minimal_client.get_logger().info(
        'Result of add_two_ints: for %d + %d + %d = %d' %
        (int(sys.argv[1]), int(sys.argv[2]),int(sys.argv[3]), response.sum))

    minimal_client.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()