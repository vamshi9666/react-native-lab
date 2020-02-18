import React, { Component } from "react";
import { View, Text } from "react-native";
import JustifiedCenteredView from "../Views/JustifiedCenteredView";
import { DeviceWidth } from "../../config/Device";
import MediumText from "../Texts/MediumText";
import HorizontalGradientView from "../Views/HorizontalGradientView";
import { PURPLE, LIGHT_PURPLE, FONT_BLACK } from "../../config/Colors";
import { LEFT_MARGIN } from "../../config/Constants";
import NoFeedbackTapView from "../Views/NoFeedbackTapView";
const MODAL_UP_TIME = 2000;
class RemovedFavModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    setTimeout(() => {
      this.props.closeModal();
    }, MODAL_UP_TIME);
  };
  render() {
    const { game } = this.props;

    return (
      <JustifiedCenteredView
        style={{
          flex: 1,
          backgroundColor: "#0000"
        }}
      >
        <View
          style={{
            borderRadius: 15,
            backgroundColor: "#fff",
            padding: 10,
            width: DeviceWidth * 0.9,
            justifyContent: "space-evenly"
          }}
        >
          <MediumText>You just removed a favorite from {game}</MediumText>
        </View>
      </JustifiedCenteredView>
    );
  }
}

export default RemovedFavModal;
