import React, { Component } from "react";
import { View, TextInput, StyleSheet, Animated, Easing } from "react-native";
import { TapGestureHandler, State } from "react-native-gesture-handler";
import RegularText from "../Texts/RegularText";
import { DeviceWidth } from "../../config/Device";
import { sharedStyles } from "../../styles/Shared";
import { LEFT_MARGIN } from "../../config/Constants";
import { connect } from "react-redux";
import {
  FONT_GREY,
  FONT_BLACK,
  CORRECT_RESPONSE_GREEN
} from "../../config/Colors";
import MediumText from "../Texts/MediumText";
import { STATIC_URL } from "../../config/Api";
import CircularImage from "../Views/CircularImage";
import { bindActionCreators } from "redux";
import { setOptionFadeAnimation } from "../../redux/actions/nav";

const AnimatedRegularText = Animated.createAnimatedComponent(RegularText);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

class DoubletapEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.initialValue = new Animated.Value(0);
  }

  doubleTapRef = React.createRef();

  startAnimation = () => {
    const { initialValue } = this;

    Animated.timing(initialValue, {
      toValue: 1,
      duration: 400,
      easing: Easing.linear
    }).start();
  };

  // componentDidMount = () => {
  //   setTimeout(() => {
  //     this.startAnimation();
  //   }, 2000);
  // };

  componentWillReceiveProps = nextProps => {
    const {
      setOptionFadeAnimation,
      showFadeAnimation,
      index,
      pickedOption
    } = nextProps;
    if (showFadeAnimation && index === pickedOption) {
      setOptionFadeAnimation(false);
      // setTimeout(() => {
      this.startAnimation();
      // }, 2000);
    }
  };

  render() {
    const {
      onChangeText,
      editMode,
      index,
      currentlyEditingItem,
      text,
      onSubmitEditingHandler,
      onSingleTap,
      onDoubleTap,
      isNewOption,
      isQuestion,
      pickedOption,
      showImage,
      fromSharePreview,
      bgColor,
      editable,
      myData: { images }
    } = this.props;

    const { initialValue } = this;

    const animatedBgColor = initialValue.interpolate({
      inputRange: [0, 1],
      outputRange: [bgColor, "#fff"]
    });

    const animatedTextColor = initialValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["#fff", FONT_BLACK]
    });

    const animatedBorderColor = initialValue.interpolate({
      inputRange: [0, 1],
      outputRange: [bgColor, "#00000040"]
    });

    const animatedImageOpacity = initialValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0]
    });

    return (
      <TapGestureHandler
        onHandlerStateChange={({ nativeEvent }) => {
          const { state } = nativeEvent;
          if (state === State.END) {
            // this.startAnimation();
            onSingleTap(index);
          }
        }}
        waitFor={this.doubleTapRef}
      >
        <TapGestureHandler
          ref={this.doubleTapRef}
          numberOfTaps={2}
          onHandlerStateChange={({ nativeEvent }) => {
            const { state } = nativeEvent;
            if (state === State.END) {
              onDoubleTap(index);
            }
          }}
        >
          {isQuestion ? (
            <View>
              {editMode ? (
                <TextInput
                  multiline
                  autoFocus={currentlyEditingItem === index}
                  onSubmitEditing={onSubmitEditingHandler}
                  returnKeyType={"done"}
                  blurOnSubmit
                  onFocus={() => onDoubleTap(index)}
                  value={text}
                  placeholder={"Add question (optional)"}
                  numberOfLines={2}
                  style={{
                    ...styles.questionText,
                    marginTop: fromSharePreview ? 35 : 10
                  }}
                  onChangeText={onChangeText}
                />
              ) : (
                <MediumText
                  style={{
                    ...styles.questionText,
                    color: text === "" ? FONT_GREY : FONT_BLACK,
                    marginTop: fromSharePreview ? 35 : 10
                  }}
                >
                  {text === "" ? "Add question (optional)" : text}
                </MediumText>
              )}
            </View>
          ) : (
            <Animated.View
              style={{
                ...styles.optionView,
                flexDirection: "row",
                borderStyle: !isNewOption ? "solid" : "dashed",
                backgroundColor:
                  pickedOption === index ? animatedBgColor : "#fff",
                borderColor:
                  pickedOption === index ? animatedBorderColor : "#00000040",
                opacity: editMode && !editable ? 0.5 : 1
              }}
            >
              {showImage ? (
                <Animated.View
                  style={{
                    width: DeviceWidth * 0.075,
                    opacity: pickedOption === index ? animatedImageOpacity : 0,
                    justifyContent: "center"
                  }}
                >
                  <CircularImage
                    height={25}
                    style={{
                      borderWidth: 2,
                      borderColor: "#fff",
                      backgroundColor: "#fff"
                    }}
                    source={{
                      uri: STATIC_URL + images[0].split("uploads")[1]
                    }}
                  />
                </Animated.View>
              ) : (
                <View />
              )}
              <View
                style={{
                  flex: 1,
                  justifyContent: "center"
                }}
              >
                {editMode ? (
                  <AnimatedTextInput
                    editable={editable}
                    multiline
                    autoFocus={currentlyEditingItem === index}
                    onSubmitEditing={onSubmitEditingHandler}
                    returnKeyType={"done"}
                    blurOnSubmit
                    onFocus={() => onDoubleTap(index)}
                    value={text}
                    placeholder={"Add (optional)"}
                    numberOfLines={2}
                    style={{
                      ...styles.optionText,
                      color:
                        pickedOption === index ? animatedTextColor : FONT_BLACK
                    }}
                    onChangeText={onChangeText}
                  />
                ) : (
                  <AnimatedRegularText
                    style={{
                      ...styles.optionText,
                      color:
                        isNewOption && text === ""
                          ? FONT_GREY
                          : pickedOption === index
                          ? animatedTextColor
                          : FONT_BLACK
                    }}
                  >
                    {isNewOption && text === "" ? "Add (optional)" : text}
                  </AnimatedRegularText>
                )}
              </View>
              {showImage ? (
                <View
                  style={{
                    width: DeviceWidth * 0.075
                  }}
                />
              ) : (
                <View />
              )}
            </Animated.View>
          )}
        </TapGestureHandler>
      </TapGestureHandler>
    );
  }
}

const styles = StyleSheet.create({
  optionView: {
    width: DeviceWidth * 0.7,
    paddingHorizontal: 10,
    paddingVertical: 5,
    minHeight: 50,
    alignSelf: "center",
    borderWidth: 1.5,
    borderRadius: 30,
    marginVertical: LEFT_MARGIN / 2
  },
  optionText: {
    fontSize: 16,
    ...sharedStyles.regularText,
    textAlign: "center"
  },
  questionText: {
    ...sharedStyles.mediumText,
    fontSize: 26,
    marginVertical: 10,
    textAlign: "center"
  }
});

const mapStateToProps = state => {
  return {
    myData: state.info.userInfo || {},
    showFadeAnimation: state.nav.showFadeAnimation
  };
};

const mapDispatchToProps = dispatch => ({
  setOptionFadeAnimation: bindActionCreators(setOptionFadeAnimation, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(DoubletapEditor);
