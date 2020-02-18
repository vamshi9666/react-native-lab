import React, { Component } from "react";
import { TouchableWithoutFeedback, View } from "react-native";

class NoFeedbackTapView extends Component {
  render() {
    const {
      children,
      style,
      onPress,
      disabled,
      onPressIn,
      onPressOut,
      onLongPress
    } = this.props;

    return (
      <TouchableWithoutFeedback
        onLongPress={onLongPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled}
        onPress={onPress}
      >
        <View style={style}>{children}</View>
      </TouchableWithoutFeedback>
    );
  }
}

export default NoFeedbackTapView;
