//import liraries
import React, { Component, PureComponent } from "react";
import { View, Text, StyleSheet } from "react-native";
import { WHITE, PURPLE, LIGHT_PURPLE, FONT_GREY } from "../../config/Colors";
import RegularText from "../Texts/RegularText";
import NoFeedbackTapView from "../Views/NoFeedbackTapView";
import BoldText from "../Texts/BoldText";
import { connect } from "react-redux";
import moment from "moment";
import { DeviceHeight } from "../../config/Device";
import { getDatePhrase } from "../../config/Utils";

const SENT_COLOR = "#b74cd5";
const RECEIVED_COLOR = "#00bcd4";

// create a component
class StackTutorialPopup extends PureComponent {
  // componentDidMount = () => {
  //   const date = moment().format("DD");
  //   const month = moment().format("MMM");
  //   this.setState(
  //     {
  //       date,
  //       month
  //     }
  //   )
  // };

  render() {
    const { isFirstTime, stackType, close, adminProps } = this.props;
    const isSent = stackType === "SENT";
    const displayVerb = isSent ? "sending" : "receiving";
    const { sentStackThreshold, recievingStackThreshold } = adminProps;
    const limitDisplayText = isSent
      ? sentStackThreshold
      : recievingStackThreshold;
    const date = moment().format("D");
    const month = moment().format("MMM");
    const btnColor = isSent ? SENT_COLOR : RECEIVED_COLOR;
    const datePhrase = getDatePhrase(date);
    const requestPhrase = limitDisplayText > 1 ? "requests" : "request";
    // const isFirstTime = false;
    return (
      <View style={styles.container}>
        <View style={styles.triangle} />
        <RegularText style={styles.title}>Limit exceeded !</RegularText>
        <RegularText style={styles.contentText}>
          You exeeced limit of {displayVerb} more than {limitDisplayText}{" "}
          {requestPhrase} today ({date}
          {"" + datePhrase} {month}).
          {isFirstTime &&
            "They're stacked up and you can unlock them with Gems"}
        </RegularText>
        {isFirstTime && (
          <NoFeedbackTapView
            onPress={() => close()}
            style={{ ...styles.confirmBtn, backgroundColor: btnColor }}
          >
            <RegularText style={styles.btnText}> GOT IT </RegularText>
          </NoFeedbackTapView>
        )}
      </View>
    );
  }
}

StackTutorialPopup.defaultProps = {
  isFirstTime: false,
  stackType: "SENT"
};
// define your styles
const styles = StyleSheet.create({
  btnText: {
    fontSize: 16,
    color: WHITE
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    // top: -10,
    marginTop: 6,
    marginBottom: 10
  },
  container: {
    justifyContent: "center",
    position: "absolute",
    top: DeviceHeight * 0.3,
    // left: 20,
    alignSelf: "center",
    marginHorizontal: 10,
    zIndex: 1000,
    padding: 16,
    paddingBottom: 18,
    borderRadius: 15,
    alignItems: "center",
    backgroundColor: WHITE
  },
  triangle: {
    width: 32,
    height: 32,
    transform: [{ rotate: "45deg" }],
    backgroundColor: WHITE,
    position: "absolute",
    top: -10,
    zIndex: -1000,
    borderRadius: 6
  },
  contentText: {
    fontSize: 17,
    textAlign: "center",
    color: FONT_GREY,
    marginBottom: 10,

    lineHeight: 20
    // margin: 4
  },
  confirmBtn: {
    backgroundColor: "#00D3EE",
    justifyContent: "center",
    alignItems: "center",
    // paddingHorizontal: 40,
    minWidth: 100,
    bottom: -4,
    paddingVertical: 8,
    borderRadius: 10
  }
});

const mapState = state => {
  return {
    adminProps: state.app.adminProps
  };
};
//make this component available to the app
export default connect(mapState, {})(StackTutorialPopup);
