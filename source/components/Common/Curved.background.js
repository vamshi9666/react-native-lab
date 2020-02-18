import React, { Component } from "react";
import { View } from "react-native";
import { DeviceWidth } from "../../config/Device";

class CurvedBackground extends Component {
  render() {
    let { children, radius, style } = this.props;
    return (
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: radius,
          margin: DeviceWidth * 0.025,
          padding: DeviceWidth * 0.05
        }}
      >
        {children}
      </View>
    );
  }
}

export default CurvedBackground;
