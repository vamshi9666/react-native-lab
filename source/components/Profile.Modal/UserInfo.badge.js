import React, { Component } from "react";
import { View } from "react-native";

class BadgeFlexible extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View
        style={{
          height: "auto",
          borderRadius: 10,
          flexWrap: "wrap",
          margin: 5,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: "rgba(176,77,213,1)",
          ...this.props.style
        }}
      >
        {this.props.children}
      </View>
    );
  }
}

export default BadgeFlexible;
