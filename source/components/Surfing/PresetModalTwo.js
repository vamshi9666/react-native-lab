import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { LEFT_MARGIN } from "../../config/Constants";
import RegularText from "../Texts/RegularText";
import NoFeedbackTapView from "../Views/NoFeedbackTapView";
import HorizontalGradientView from "../Views/HorizontalGradientView";
import { PURPLE, LIGHT_PURPLE, FONT_GREY } from "../../config/Colors";
import { DeviceWidth } from "../../config/Device";
import { DeviceHeight } from "../../../src/config/Device";

class PresetModalTwo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { dismissModal } = this.props;

    return (
      <View style={[styles.baseLayout, styles.justfiedContent]}>
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: LEFT_MARGIN,
            ...styles.justfiedContent
          }}
        >
          <RegularText
            style={{
              ...styles.darkText,
              marginVertical: LEFT_MARGIN
            }}
          >
            Displaying the right profile cards always interests the right people
            passing by.
          </RegularText>
          <RegularText style={styles.darkText}>
            Are you sure you want to edit later?
          </RegularText>
          <NoFeedbackTapView
            style={{
              height: DeviceHeight * 0.06,
              width: DeviceWidth * 0.3,
              alignItems: "center",
              justifyContent: "center"
              //   backgroundColor: "pink"
            }}
            onPress={dismissModal}
          >
            <RegularText style={styles.darkText}>Yes</RegularText>
          </NoFeedbackTapView>
          <HorizontalGradientView
            colors={[PURPLE, LIGHT_PURPLE]}
            style={styles.gradientView}
          >
            <NoFeedbackTapView
              onPress={() => dismissModal(true)}
              style={styles.gradientView}
            >
              <RegularText style={styles.buttonText}>Edit now</RegularText>
            </NoFeedbackTapView>
          </HorizontalGradientView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  darkText: {
    fontSize: 16,
    color: "rgb(30, 36, 50)",
    marginHorizontal: LEFT_MARGIN
  },
  gradientView: {
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    width: DeviceWidth * 0.6,
    borderRadius: 30,
    alignSelf: "center",
    marginVertical: LEFT_MARGIN
  },
  buttonText: {
    fontSize: 16,
    color: "#fff"
  },
  textStyle: {
    fontSize: 16,
    color: FONT_GREY
  },
  justfiedContent: {
    alignItems: "center",
    justifyContent: "center"
  },
  baseLayout: {
    flex: 1,
    width: "95%",
    backgroundColor: "#0000",
    alignSelf: "center"
  }
});

export default PresetModalTwo;
