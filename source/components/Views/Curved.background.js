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
          marginHorizontal: DeviceWidth * 0.05,
          marginVertical: DeviceWidth * 0.025,
          padding: DeviceWidth * 0.05,
          shadowColor: "#000000A0",
          shadowOpacity: 0,
          shadowRadius: 5,
          shadowOffset: {
            width: 0,
            height: 2
          },
          elevation: 2,
          ...style
        }}
      >
        {children}
      </View>
    );
  }
}

export default CurvedBackground;
