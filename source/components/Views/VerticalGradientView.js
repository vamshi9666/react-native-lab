import React, { Component } from "react";
import LinearGradient from "react-native-linear-gradient";

class VerticalGradientView extends Component {
  render() {
    const { children, style, colors } = this.props;

    return (
      <LinearGradient
        colors={colors}
        style={style}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {children}
      </LinearGradient>
    );
  }
}

export default VerticalGradientView;
