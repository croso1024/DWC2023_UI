# header.stamp: current time
# header.frame_id: module_name
# module_name = [
#     'Sensing',
#     'Localization',
#     'Perception',
#     'Planner',
#     'Decision',
#     'Communication',
#     'Middle_Control',
#     'Lower_Control',
#     'HMI',
#     'Peripherals',
#     'System'
# ]
std_msgs/Header header

# error_code:
#     positive: announce a new error with error_code
#     negative: clear the correspond error of -error_code
#     zero: clear all error
int16 error_code