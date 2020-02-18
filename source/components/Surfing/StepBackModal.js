import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { DeviceWidth } from "../../../src/config/Device";
import SvgUri from "react-native-svg-uri";
import { MONETIZATION_ICONS } from "../../config/Constants";
import RegularText from "../Texts/RegularText";
import NoFeedbackTapView from "../Views/NoFeedbackTapView";
import BoldText from "../Texts/BoldText";
import {
  PURPLE,
  WHITE,
  LIGHT_PURPLE,
  FONT_GREY,
  FONT_BLACK
} from "../../config/Colors";
import HorizontalGradientView from "../Views/HorizontalGradientView";

const NOT_AVAILABLE_CONTENT =
  " You cannot step back to the people you already reacted to.";
const AVAILABLE_CONTENT =
  NOT_AVAILABLE_CONTENT +
  " Would you like to step back to the people prior to them ?";
export default class StepBackModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { isPrevAnyAvailable, close } = this.props;
    const textContent = isPrevAnyAvailable
      ? AVAILABLE_CONTENT
      : NOT_AVAILABLE_CONTENT + "!";
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <SvgUri
            height={30}
            width={30}
            source={MONETIZATION_ICONS["STEP_BACK"]}
          />
        </View>
        <View style={styles.body}>
          <RegularText
            style={{
              textAlign: "center",
              fontSize: 18
            }}
          >
            {textContent}
          </RegularText>
        </View>
        <View style={styles.btnCon}>
          {isPrevAnyAvailable ? (
            <>
              <NoFeedbackTapView
                onPress={() => {
                  close(true);
                }}
              >
                <HorizontalGradientView
                  colors={[PURPLE, LIGHT_PURPLE]}
                  style={styles.btnWide}
                >
                  <BoldText style={styles.btnText}>YES</BoldText>
                </HorizontalGradientView>
              </NoFeedbackTapView>
              <NoFeedbackTapView
                onPress={() => {
                  close(false);
                }}
                style={{
                  ...styles.btnWide,
                  backgroundColor: "#fff",
                  marginBottom: 0,
                  borderWidth: 1,
                  borderColor: FONT_GREY
                }}
              >
                <RegularText style={{ ...styles.btnText, color: FONT_BLACK }}>
                  NO
                </RegularText>
              </NoFeedbackTapView>
            </>
          ) : (
            <NoFeedbackTapView
              onPress={() => {
                close(false);
              }}
            >
              <HorizontalGradientView
                style={styles.btn}
                colors={[PURPLE, LIGHT_PURPLE]}
              >
                <BoldText
                  style={{
                    color: WHITE,
                    ...styles.btnText
                  }}
                >
                  OKAY
                </BoldText>
              </HorizontalGradientView>
            </NoFeedbackTapView>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: DeviceWidth * 0.9,
    backgroundColor: "#fff",
    marginHorizontal: DeviceWidth * 0.05,
    top: 200,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    // height/
    paddingHorizontal: 8,
    paddingVertical: 8
  },
  header: {
    flex: 1,
    width: DeviceWidth * 0.9,
    flexDirection: "row",
    justifyContent: "center",
    height: 60,
    alignItems: "center"
  },
  body: {
    justifyContent: "center",
    alignItems: "center"
  },
  btnCon: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 10
  },
  btn: {
    borderRadius: 20,
    backgroundColor: PURPLE,
    paddingHorizontal: 10,
    paddingVertical: 8,
    width: DeviceWidth * 0.4,
    height: 42,
    justifyContent: "center",
    alignItems: "center"
  },
  btnText: {
    fontSize: 18,
    color: WHITE,
    textAlign: "center",
    textAlignVertical: "center"
  },
  btnWide: {
    width: DeviceWidth * 0.5,
    height: 42,
    backgroundColor: PURPLE,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16
  }
});
