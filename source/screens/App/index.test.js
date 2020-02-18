import React, { Component } from "react";
import { Text, View } from "react-native";
import {
  createStackNavigator,
  createDrawerNavigator,
  createAppContainer
} from "react-navigation";
import { screenConfig } from "../../config/Config";
import Landing from "./Landing.new";
import ChatWindow from "./ChatWindow";
import Settings from "./Settings";
import BlockAndReports from "./BlockAndReports";
import { DeviceWidth } from "../../config/Device";

// export default createStackNavigator(
//   {
//     landing: screenConfig(Landing),
//     chatWindow: screenConfig(ChatWindow),
//     settings: screenConfig(Settings),
//     blockAndReports: screenConfig(BlockAndReports)
//   },
//   {
//     initialRouteName: "landing",
//     navigationOptions: {
//       header: null,
//       gesturesEnabled: false
//     }
//   }
// );

const ContentScreen = ({ navigation }) => <Landing navigation={navigation} />;

const LeftDrawerScreen = ({ navigation }) => (
  <View>
    <Text>Left drawer</Text>
  </View>
);

const RightDrawerScreen = ({ navigation }) => <Settings />;

const ContentNavigator = createDrawerNavigator(
  {
    Content: {
      screen: ContentScreen
    }
  },
  {
    contentComponent: RightDrawerScreen,
    drawerPosition: "right",
    drawerWidth: DeviceWidth
  }
);

export default RootNavigator = createDrawerNavigator(
  {
    Child: {
      screen: ContentNavigator
    }
  },
  {
    contentComponent: LeftDrawerScreen,
    drawerWidth: DeviceWidth
  }
);
