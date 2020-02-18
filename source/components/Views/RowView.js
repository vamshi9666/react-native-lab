import React, { Component } from "react";
import { View } from "react-native";

class RowView extends Component {
  render() {
    const { children, style } = this.props;

    return (
      <View
        style={{
          flexDirection: "row",
          ...style
        }}
      >
        {children}
      </View>
    );
  }
}

export default RowView;
