import React, { Component } from "react";
import { Text } from "react-native";

class RegularText extends Component {
  render() {
    const { children, style, numberOfLines = 100 } = this.props;
    return (
      <Text
        numberOfLines={numberOfLines}
        style={{
          fontFamily: "Proxima Nova",
          fontWeight: "100",
          ...style
        }}
      >
        {children}
      </Text>
    );
  }
}

export default RegularText;
