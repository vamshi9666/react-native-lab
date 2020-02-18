import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  FlatList
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { PURPLE, LIGHT_PURPLE } from "../../config/Colors";
import { DeviceHeight, DeviceWidth } from "../../config/Device";
import Ionicon from "react-native-vector-icons/Ionicons";
import Slider from "react-native-slider";
import Modal from "react-native-modal";
import ContactUs from "../../components/Settings/Contact";
import SignOutModal from "../../components/Settings/Signout.modal";

class OutlinedButton extends Component {
  render() {
    const { onPress, text, style } = this.props;

    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          borderRadius: 30,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          ...style
        }}
      >
        <Text> {text}</Text>
      </TouchableOpacity>
    );
  }
}

export default OutlinedButton;
