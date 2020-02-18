import React, { Component } from "react";
import { Text } from "react-native";

class MediumText extends Component {
  render() {
    const { children, style } = this.props;
    return (
      <Text
        style={{
          fontFamily: "Proxima Nova",
          fontWeight: "500",
          ...style
        }}
      >
        {children}
      </Text>
    );
  }
}

export default MediumText;
