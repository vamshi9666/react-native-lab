import React, { Component } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { DeviceWidth } from "../../../src/config/Device";
import { greyTheme } from "../../../src/config/Colors";
import MediumText from "./MediumText";

class Button extends Component {
  render() {
    const {
      action,
      text,
      underlined,
      styles: _propStyles,
      textStyles
    } = this.props;
    return (
      <TouchableOpacity
        style={[styles.buttonView, _propStyles]}
        onPress={action}
      >
        <MediumText
          style={{
            ...styles.buttonText,
            ...textStyles,
            textDecorationLine: underlined ? "underline" : "none"
          }}
        >
          {text}
        </MediumText>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  buttonView: {
    height: 50,
    borderRadius: 20,
    backgroundColor: "#0000",
    width: DeviceWidth * 0.8
    // display: "flex"
  },
  buttonText: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10
  }
});

export default Button;
