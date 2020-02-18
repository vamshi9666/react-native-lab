import React, { Component } from "react";
import { View } from "react-native";

class JustifiedCenteredView extends Component {
  render() {
    const { children, style } = this.props;

    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          ...style
        }}
      >
        {children}
      </View>
    );
  }
}

export default JustifiedCenteredView;
