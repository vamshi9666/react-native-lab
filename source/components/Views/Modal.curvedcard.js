import React, { Component } from "react";
import JustifiedCenteredView from "./JustifiedCenteredView";
import { LEFT_MARGIN } from "../../config/Constants";
import { DeviceWidth } from "../../config/Device";
import { View } from "react-native";

class ModalCurvedcard extends Component {
  render() {
    const { children, style } = this.props;
    return (
      <JustifiedCenteredView
        style={{
          flex: 1,
          backgroundColor: "#0000"
        }}
      >
        <View
          style={{
            borderRadius: 20,
            backgroundColor: "#fff",
            padding: LEFT_MARGIN,
            width: DeviceWidth * 0.8,
            ...style
          }}
        >
          {children}
        </View>
      </JustifiedCenteredView>
    );
  }
}

export default ModalCurvedcard;
