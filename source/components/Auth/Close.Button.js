import React, { Component } from "react";
import { TouchableOpacity, Platform } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { greyTheme } from "../../config/Colors";

class CloseButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { action, iconName } = this.props;
    return (
      <TouchableOpacity
        style={{
          marginTop: Platform.OS === "android" ? 20 : 30,
          alignSelf: "flex-start",
          marginLeft: 20
        }}
        onPress={action}
      >
        <Icon name={iconName} size={30} color={"#060518"} />
      </TouchableOpacity>
    );
  }
}

export default CloseButton;
