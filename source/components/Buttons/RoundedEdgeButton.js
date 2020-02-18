import React, { Component } from "react";
import { TouchableOpacity } from "react-native";

class RoundedEdgeButton extends Component {
  render() {
    const { children, style, onPress, disabled } = this.props;
    return (
      <TouchableOpacity
        disabled={disabled}
        onPress={onPress}
        style={{
          borderRadius: 30,
          alignItems: "center",
          justifyContent: "center",
          ...style
        }}
      >
        {children}
      </TouchableOpacity>
    );
  }
}

export default RoundedEdgeButton;
