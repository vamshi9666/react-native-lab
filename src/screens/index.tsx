import {
  createStackNavigator,
  TransitionPresets
} from "react-navigation-stack";
import { createAppContainer } from "react-navigation";

import { Dimensions } from "react-native";
const { width: sWidth } = Dimensions.get("window");
import HomeScreen from "./Home";
import SettingsScreen from "./Settings";
import MyProfile from "./MyProfile";
import ChatScreen from "./Chat";
const StackNavigation = createStackNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    Settings: {
      screen: SettingsScreen,
      navigationOptions: {
        headerStyleInterpolator: ({ current }) => {
          // const
          return {
            titleStyle: {
              opacity: current.progress,
              transform: [{ scale: current.progress }]
            },
            leftButtonStyle: {
              transform: [{ rotateX: "45deg" }]
            }
          };
        },
        cardStyleInterpolator: ({ current, next, layouts }) => {
          const translateX = current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [sWidth, 0]
          });
          return {
            cardStyle: {
              transform: [{ translateX }]
              // opacity: current.progress
            }
          };
        }
      }
    },
    MyProfile: {
      screen: MyProfile,
      navigationOptions: {
        cardStyleInterpolator: ({ current, next, layouts }) => {
          const translateX = current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [-sWidth, 0]
          });
          return {
            cardStyle: {
              transform: [{ translateX }]
              // opacity: current.progress
            }
          };
        }
      }
    },
    Chat: {
      screen: ChatScreen,
      navigationOptions: {
        cardStyleInterpolator: ({ current, closing }) => {
          const translateX = current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [-sWidth, 0]
          });
          return {
            cardStyle: {
              opacity: current.progress,
              transform: [{ translateX }]
            }
          };
        }
      }
    }
  },
  {
    defaultNavigationOptions: {
      // gestureEnabled: true,
      // gestureDirection: "horizontal"
      // header: null
      // ...TransitionPresets.SlideFromRightIOS
    }
  }
);

export default createAppContainer(StackNavigation);
