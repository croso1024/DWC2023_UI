cmake_minimum_required(VERSION 3.8)
project(turtorial_interfaces)

if(CMAKE_COMPILER_IS_GNUCXX OR CMAKE_CXX_COMPILER_ID MATCHES "Clang")
  add_compile_options(-Wall -Wextra -Wpedantic)
endif()

# find dependencies
find_package(ament_cmake REQUIRED)
# uncomment the following section in order to fill in
# further dependencies manually.
# find_package(<dependency> REQUIRED)

find_package(geometry_msgs REQUIRED)
find_package(rosidl_default_generators REQUIRED)

rosidl_generate_interfaces(${PROJECT_NAME}
  "msg/Num.msg"
  "msg/Sphere.msg"
  "msg/UpdatePassengerHMI.msg"
  "msg/ErrorCode.msg"
  "msg/ErrorSummary.msg" 
  "msg/WrappedState.msg"
  "msg/MissionMsg.msg"
  "msg/NextDepot.msg" 
  "msg/StartMission.msg"
  "srv/AddThreeInts.srv"
  "srv/SimpleBoolService.srv"
  "srv/SimpleStringService.srv"
  "srv/AddMission.srv"
  "srv/StartMission.srv"
  "srv/UpdateDepot.srv"
  "srv/GetDepot.srv"
  "srv/GetMission.srv"
  "srv/HMIAction.srv"
  DEPENDENCIES geometry_msgs # Add packages that above messages depend on, in this case geometry_msgs for Sphere.msg
)


if(BUILD_TESTING)
  find_package(ament_lint_auto REQUIRED)
  # the following line skips the linter which checks for copyrights
  # comment the line when a copyright and license is added to all source files
  set(ament_cmake_copyright_FOUND TRUE)
  # the following line skips cpplint (only works in a git repo)
  # comment the line when this package is in a git repo and when
  # a copyright and license is added to all source files
  set(ament_cmake_cpplint_FOUND TRUE)
  ament_lint_auto_find_test_dependencies()
endif()

ament_package()

