import React, { Component } from "react";
import { Text } from "react-native";

class BoldText extends Component {
  render() {
    const { children, style } = this.props;
    return (
      <Text
        style={{
          fontFamily: "Proxima Nova",
          fontWeight: "900",
          ...style
        }}
      >
        {children}
      </Text>
    );
  }
}

export default BoldText;
