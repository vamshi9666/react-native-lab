import { createStackNavigator } from "react-navigation";
import { BLACK } from "../../config/Colors";
import { screenConfig } from "../../config/Config";
import { DeviceWidth } from "../../config/Device";
import BlockAndReports from "./BlockAndReports";
import ChatFavourites from "./Chat.favourites";
import ChatWindow from "./ChatWindow";
import Landing from "./Landing.new";
import MyProfile from "./My.Profile";

// import createAnimatedSwitchNavigator from "react-navigation-animated-switch";
const LEFT_SCREENS = [];

const RIGHT_SCREENS = ["myProfile"];
// const MyProfile = React.lazy(() => import("./My.Profile"));
const getScreenWiseTransition = (transitionProps, prevTransitionProps) => {
  const BASE_SCREEN_DISPLACEMENT = DeviceWidth * 0.2;
  const toRight = RIGHT_SCREENS.some(
    screenName =>
      screenName === transitionProps.scene.route.routeName ||
      (prevTransitionProps &&
        screenName === prevTransitionProps.scene.route.routeName)
  );
  const baseOutputRange = toRight
    ? [0, -BASE_SCREEN_DISPLACEMENT]
    : [0, BASE_SCREEN_DISPLACEMENT];
  const nextCardOutputRange = toRight ? [DeviceWidth, 0] : [-DeviceWidth, 0];
  // console.log("toright is ", toRight, baseOutputRange, nextCardOutputRange);
  return {
    screenInterpolator: sceneprops => {
      const { layout, position, scene, scenes } = sceneprops;
      const { index } = scene;
      const isBaseScreen = index === 0 && scenes.length === 2;

      if (isBaseScreen) {
        const baseScreenTranslateX = position.interpolate({
          inputRange: [0, 1],
          outputRange: baseOutputRange
        });
        // const opacity = position.interpolate({
        //   inputRange: [0, 1],
        //   outputRange: [1, 0]
        // });
        return {
          transform: [{ translateX: baseScreenTranslateX }]
          // backgroundColor: BLACK,
          // opacity
        };
      }
      if (scene.index === 1 && sceneprops.scenes.length === 3) {
        // const translateX = position.interpolate({
        //   inputRange: [1, 2],
        //   outputRange: [0, 2]
        // });
        // const opacity = position.interpolate({
        //   inputRange: [1, 2],
        //   outputRange: [1, 0]
        // });
        return {
          transform: [{ translateX: 0 }],
          // opacity,
          backgroundColor: "#000"
        };
      }
      const nextCardTranslateX = position.interpolate({
        inputRange: [index - 1, index],
        outputRange: nextCardOutputRange
      });
      return {
        transform: [{ translateX: nextCardTranslateX }]
      };
    }
  };
};

export default createStackNavigator(
  {
    landing: screenConfig(Landing),
    chatWindow: {
      screen: ChatWindow,

      navigationOptions: {
        gesturesEnabled: true,
        gestureDirection: "inverted",
        header: null,
        gestureResponseDistance: {
          horizontal: DeviceWidth
        },
        headerMode: "none"
      }
    },
    chatFavourites: {
      screen: ChatFavourites,
      navigationOptions: {
        gesturesEnabled: true,
        header: null,
        gestureDirection: "inverted",
        gestureResponseDistance: {
          horizontal: DeviceWidth
        },

        headerMode: "none"
      }
    },
    myProfile: {
      screen: MyProfile,
      navigationOptions: ({ navigation }) => {
        const { state } = navigation;
        const { params } = state;
        const gesturesEnabled = !params || params.enableGestures === true;
        return {
          header: null,
          gesturesEnabled,
          gestureResponseDistance: {
            horizontal: DeviceWidth
          },

          headerMode: "none"
        };
      }
    },

    blockAndReports: screenConfig(BlockAndReports)
  },
  {
    initialRouteName: "landing",
    navigationOptions: {
      header: null
    },
    cardStyle: {
      // backgroundColor: "transparent",
      shadowColor: BLACK,
      shadowOffset: {
        width: 1,
        height: 1
      },
      shadowOpacity: 0.2,
      shadowRadius: 25
    },

    transitionConfig: getScreenWiseTransition

    // transitionConfig:() => {

    //   return {

    //   }
    // },
  }
);

/**
 * Chatfav screen should translate only 20%
 * Mild background increasing like snapchat iOS
 * Should traverse above chatfavourites
 */
