import React, { Component } from "react";
import { View } from "react-native";
import MediumText from "../Texts/MediumText";
import { sharedStyles } from "../../styles/Shared";
import { PURPLE } from "../../config/Colors";

class LottieSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={{ flex: 1, ...sharedStyles.justifiedCenter }}>
        <MediumText style={{ fontSize: 18, color: PURPLE }}>
          Searching...
        </MediumText>
      </View>
    );
  }
}

export default LottieSearch;
