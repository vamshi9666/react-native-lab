import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
import Ionicon from "react-native-vector-icons/Ionicons";

class HeaderIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { iconName, action } = this.props;
    return (
      <TouchableOpacity style={{ margin: 10 }} onPress={() => action()}>
        <Ionicon
          style={{ padding: 5 }}
          name={iconName}
          color={"rgba(0,0,0,0.4)"}
          size={30}
        />
      </TouchableOpacity>
    );
  }
}

export default HeaderIcon;
