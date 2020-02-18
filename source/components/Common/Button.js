import React, { Component } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { DeviceWidth } from "../../config/Device";
import { greyTheme } from "../../config/Colors";

class Button extends Component {
  render() {
    const { action, text, colorReverse, disabled, icon } = this.props;
    return (
      <TouchableOpacity
        style={[
          styles.buttonView,
          {
            backgroundColor: colorReverse ? "#fff" : greyTheme,
            borderColor: colorReverse ? greyTheme : "#0000",
            borderWidth: colorReverse ? 1 : 0
          }
        ]}
        disabled={disabled}
        onPress={action}
      >
        <Text
          style={[
            styles.buttonText,
            { color: colorReverse ? greyTheme : "#fff" }
          ]}
        >
          {text}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  buttonView: {
    height: 50,
    borderRadius: 20,
    // backgroundColor: greyTheme,
    width: DeviceWidth * 0.8
  },
  buttonText: {
    fontSize: 13,
    // color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 18
  }
});

export default Button;
