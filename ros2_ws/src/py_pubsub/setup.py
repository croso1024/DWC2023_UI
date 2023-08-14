from setuptools import setup

package_name = 'py_pubsub'

setup(
    name=package_name,
    version='0.0.0',
    packages=[package_name],
    data_files=[
        ('share/ament_index/resource_index/packages',
            ['resource/' + package_name]),
        ('share/' + package_name, ['package.xml']),
    ],
    install_requires=['setuptools'],
    zip_safe=True,
    maintainer='root',
    maintainer_email='croso1024@gmail.com',
    description='TODO: Package description',
    license='TODO: License declaration',
    tests_require=['pytest'],
    entry_points={
        'console_scripts': [
            'talker = py_pubsub.publisher_member_function:main' , 
            'listener = py_pubsub.subscriber_member_function:main' , 
            'ui_tester = py_pubsub.ui_test:main' , 
            'avbus_topic_test = py_pubsub.avbus_topic_test:main',
            'passengerUI_srvClient = py_pubsub.passengerUI_serviceClient:main', 
            'passengerUI_srvServer = py_pubsub.passengerUI_serviceServer:main', 
            'passengerUI_vehiclePos = py_pubsub.passengerUI_vehiclePos:main ' , 
            'driverUI_Moniter = py_pubsub.driverUI_Moniter:main' , 
            'driverUI_srvServer = py_pubsub.driverUI_serviceServer:main' , 
            'driverUI_srvClient = py_pubsub.driverUI_serviceClient:main', 
        ],
    },
)
