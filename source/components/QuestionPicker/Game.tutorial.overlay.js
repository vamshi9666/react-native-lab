import React, { Component } from "react";
import { View, Text } from "react-native";
import { DeviceHeight, DeviceWidth } from "../../config/Device";
import SvgUri from "react-native-svg-uri";
import { GAME_LOGOS } from "../../config/Constants";
import MediumText from "../Texts/MediumText";
import NoFeedbackTapView from "../Views/NoFeedbackTapView";
import { sharedStyles } from "../../styles/Shared";
import { connect } from "react-redux";
import { FONT_GREY } from "../../config/Colors";
import { View as AnimatableView } from "react-native-animatable";
import { bindActionCreators } from "redux";
import { setQuestionPickerSeenCount } from "../../redux/actions/tutorials";

const animationConfig = {
  0: {
    transform: [
      {
        scale: 1
      }
    ]
  },
  0.25: {
    transform: [
      {
        scale: 1.0125
      }
    ]
  },
  0.5: {
    transform: [
      {
        scale: 1.025
      }
    ]
  },
  0.75: {
    transform: [
      {
        scale: 1.0125
      }
    ]
  },
  1: {
    transform: [
      {
        scale: 1
      }
    ]
  }
};

class GameTutorialOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    const { props } = this;
    return props.questionPickersCount !== nextProps.questionPickersCount;
  };

  render() {
    const {
      item,
      setQuestionPickerSeenCount,
      questionPickersCount
    } = this.props;
    if (questionPickersCount[item._id]) {
      return null;
    }
    return (
      <View
        style={{
          position: "absolute",
          zIndex: 11,
          backgroundColor: item.colors[0] + "f0",
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          height: DeviceHeight * 0.9,
          width: DeviceWidth * 0.9,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <View
          style={{
            transform: [
              {
                translateY: -50
              }
            ]
          }}
        >
          <SvgUri
            height={item.value === "NEVER_HAVE_I_EVER" ? 180 : 150}
            width={item.value === "NEVER_HAVE_I_EVER" ? 180 : 150}
            source={GAME_LOGOS[item.value]}
          />
        </View>
        <MediumText
          style={{
            color: "#fff",
            fontSize: 25,
            textAlign: "center",
            transform: [
              {
                translateY: item.value === "NEVER_HAVE_I_EVER" ? -60 : -40
              }
            ]
          }}
        >
          {item.key}
        </MediumText>

        <MediumText
          style={{
            color: FONT_GREY,
            fontSize: 18,
            textAlign: "center",
            paddingHorizontal: 5,
            lineHeight: 22,
            transform: [
              {
                translateY: item.value === "NEVER_HAVE_I_EVER" ? -45 : -35
              }
            ]
          }}
        >
          {"\n"} {item.pickerDescription}
        </MediumText>
        <NoFeedbackTapView
          onPress={() => {
            setQuestionPickerSeenCount(item._id);
          }}
          style={{
            height: 40,
            width: 100,
            borderRadius: 30,
            marginTop: -20,
            backgroundColor: "#fff",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            shadowColor: "#000",
            ...sharedStyles.justifiedCenter
          }}
        >
          <MediumText style={{ color: item.colors[0], fontSize: 16 }}>
            Got it!
          </MediumText>
        </NoFeedbackTapView>
      </View>
    );
  }
}

const mapState = state => {
  return {
    questionPickersCount: state.tutorial.questionPickers
  };
};

const mapDispatch = dispatch => {
  return {
    setQuestionPickerSeenCount: bindActionCreators(setQuestionPickerSeenCount,dispatch)
  };
};
export default connect(mapState, mapDispatch)(GameTutorialOverlay);
