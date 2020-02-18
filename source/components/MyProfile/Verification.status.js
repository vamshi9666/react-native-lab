import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import BoldText from "../../components/Texts/BoldText";
import MediumText from "../../components/Texts/MediumText";
import HorizontalGradientView from "../../components/Views/HorizontalGradientView";
import JustifiedCenteredView from "../../components/Views/JustifiedCenteredView";
import { LIGHT_PURPLE, PURPLE } from "../../config/Colors";
import { DeviceWidth } from "../../config/Device";
import * as constants from "./../../config/Constants";
class VerificationStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { content, Desc, type, goBack } = this.props;

    return (
      <JustifiedCenteredView
        style={{
          flex: 1,
          backgroundColor: "#0000"
        }}
      >
        <View style={styles.cardView}>
          <BoldText style={styles.headerText}>{content}</BoldText>

          <MediumText style={styles.descText}>{Desc}</MediumText>
          <HorizontalGradientView
            style={styles.okayTextView}
            colors={[PURPLE, LIGHT_PURPLE]}
          >
            <TouchableOpacity onPress={goBack} style={{ padding: 10 }}>
              <MediumText style={styles.okayText}>Okay</MediumText>
            </TouchableOpacity>
          </HorizontalGradientView>
        </View>
      </JustifiedCenteredView>
    );
  }
}

const styles = StyleSheet.create({
  cardView: {
    borderRadius: 15,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: constants.LEFT_MARGIN
  },
  headerText: {
    textAlign: "center",
    fontSize: 22,
    paddingVertical: 5
  },
  okayText: {
    fontSize: 20,
    color: "#fff"
  },
  okayTextView: {
    alignItems: "center",
    justifyContent: "center",
    width: DeviceWidth * 0.7,
    borderRadius: 30,
    alignSelf: "center"
  },
  descText: {
    textAlign: "center",
    fontSize: 17,
    paddingVertical: 5,
    paddingHorizontal: constants.LEFT_MARGIN
  }
});

export default VerificationStatus;
