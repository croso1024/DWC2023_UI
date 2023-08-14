from setuptools import setup

package_name = 'edr'

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
    description='Event data recorder develop environment',
    license='Apache License 2.0',
    tests_require=['pytest'],
    entry_points={
        'console_scripts': [
            "sub = edr.multi_subscriber:main" , 
            "pub = edr.pub_simulator:main" , 
            "write_test = edr.WriteTest:main" , 
            "log_test = edr.log_test:main" , 
            "TS_logger = edr.TS_logger:main" , 
        ],
    },
)
