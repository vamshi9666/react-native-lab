import React, { Component } from "react";
import { View, Text } from "react-native";
import { DeviceHeight, DeviceWidth } from "../../config/Device";
import Animated, { Easing } from "react-native-reanimated";
import RegularText from "../Texts/RegularText";
import { FONT_BLACK, WHITE } from "../../config/Colors";
import BoldText from "../Texts/BoldText";
import CircularImage from "../Views/CircularImage";
import Ionicon from "react-native-vector-icons/Ionicons";
import NoFeedbackTapView from "../Views/NoFeedbackTapView";
import RowView from "../Views/RowView";
import { connect } from "react-redux";
import { useTransition, bInterpolate, bin } from "react-native-redash";
import NonFriendsItem from "../Chat/NonFriends.item";
import StackItem from "./StackItem";
import { LEFT_MARGIN } from "../../config/Constants";
import { STATIC_URL } from "../../config/Api";

const {
  not,
  eq,
  block,
  debug,
  cond,
  Clock,
  SpringUtils,
  spring,
  or,
  set,
  startClock,
  Value,
  clockRunning,
  timing,
  stopClock,
  call,
  defined,
  interpolate,
  Extrapolate,
  createAnimatedComponent
} = Animated;

const TouchableWithOutFeedBack = createAnimatedComponent(NoFeedbackTapView);

function runTiming({ value, dest, completeNode }) {
  const clock = new Clock();
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0)
  };

  const config = {
    duration: 250,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease)
  };

  return block([
    cond(
      clockRunning(clock),
      [set(config.toValue, dest)],
      [
        set(state.finished, 0),
        set(state.time, 0),
        set(state.position, value),
        set(state.frameTime, 0),
        set(config.toValue, dest),
        startClock(clock)
      ]
    ),
    timing(clock, state, config),
    cond(state.finished, [
      stopClock(clock),
      cond(
        eq(config.toValue, DeviceHeight),

        [set(completeNode, 0)]
      )

      // completeNode)
    ]),
    state.position
  ]);
}
const LIST_ITEM_HEIGHT = 110;
const SENT_BG_COLOR = "#00bcd4";
const RECEIVED_BG_COLOR = "#b74cd5";
const stackSneakPeakCount = 2;

const AnimatedIcon = createAnimatedComponent(Ionicon);
class Stack extends Component {
  constructor(props) {
    super(props);
    this.stackOpen = new Value(0);
    this.stackHeight = new Value(0);
    this.clock = new Clock();
    // this.
    this.complete = new Value(0);
    this.previewImagesOpacity = new Value(1);
    this.progress = new Value(0);
    this.titleTranslateX = new Value(0);
    this.state = {
      stackOpen: false
    };
    this.titleSize = interpolate(this.titleTranslateX, {
      inputRange: [-100, 0],
      outputRange: [0.9, 1],
      extrapolate: Extrapolate.CLAMP
    });
    this.iconRotate = interpolate(this.titleTranslateX, {
      inputRange: [-100, 0],
      outputRange: [-Math.PI / 2, 0],
      extrapolate: Extrapolate.CLAMP
    });
    this.profileImageOpacity = interpolate(this.previewImagesOpacity, {
      inputRange: [0, 0.8, 1],
      outputRange: [1, 0, 0],
      extrapolate: Extrapolate.CLAMP
    });

    this.marginBottom = interpolate(this.previewImagesOpacity, {
      inputRange: [0, 1],
      outputRange: [0, 10],
      extrapolate: Extrapolate.CLAMP
    });
    // this.previewImagesOpacity = interpolate(this.progress, {
    //   inputRange: [0, 1],
    //   outputRange: [1, 0],
    //   extrapolate: Extrapolate.CLAMP
    // });
  }
  renderStackList = () => {
    const { sentStack, receivedStack, inSent } = this.props;
    const stackToBeShown = inSent ? sentStack : receivedStack;
    const backgroundColor = inSent && false ? SENT_BG_COLOR : RECEIVED_BG_COLOR;

    return (
      <Animated.View
        style={{
          height: this.stackHeight,
          backgroundColor,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20
        }}
      >
        {stackToBeShown.map((roomObj, index) => {
          return (
            <Animated.View
              key={index}
              style={{
                opacity: this.profileImageOpacity
                // this.marginBottom:
                // marginBottom: stackToBeShown.length === index + 1 ? 50 : 0
              }}
            >
              <StackItem
                onStackItemTapped={this.props.onStackItemTapped}
                //   opacity={this.profileImageOpacity}
                //   inStack={true}
                item={roomObj}
                fetchChatRoomAndGoToChat={() => ({})}
              />
            </Animated.View>
          );
        })}
      </Animated.View>
    );
  };

  render() {
    const { sentStack, receivedStack, inSent } = this.props;
    const stackToBeShown = inSent ? sentStack : receivedStack;
    const stackItemsCount = stackToBeShown.length;
    const backgroundColor = inSent && false ? SENT_BG_COLOR : RECEIVED_BG_COLOR;
    const targetUserIdentifier = inSent ? "postedBy" : "answeredBy";
    const peopleWord = stackToBeShown.length > 1 ? "people" : "person";
    return (
      <>
        <Animated.Code>
          {() =>
            block([
              cond(
                eq(this.stackOpen, 1),
                [
                  set(
                    this.stackHeight,
                    // 0
                    runTiming({
                      //   clock: this.clock,
                      value: this.stackHeight,
                      dest: stackItemsCount * LIST_ITEM_HEIGHT,
                      completeNode: this.complete
                      //   stackItemsCount * LIST_ITEM_HEIGHT
                    })
                  ),

                  set(
                    this.previewImagesOpacity,
                    runTiming({
                      //   clock: this.clock,
                      value: this.previewImagesOpacity,
                      dest: 0,
                      completeNode: this.complete
                    })
                  ),
                  set(
                    this.titleTranslateX,
                    runTiming({
                      //   clock: this.clock,
                      value: this.titleTranslateX,
                      dest: -100,
                      completeNode: this.complete
                    })
                  )
                ],
                0
              ),
              cond(
                eq(this.stackOpen, 0),
                [
                  set(
                    this.stackHeight,
                    runTiming({
                      //   clock: this.clock,
                      value: this.stackHeight,
                      dest: 0,
                      completeNode: this.complete
                    })
                  ),
                  set(
                    this.previewImagesOpacity,
                    runTiming({
                      //   clock: this.clock,
                      value: this.progress,
                      dest: 1,
                      completeNode: this.complete
                    })
                  ),
                  set(
                    this.titleTranslateX,
                    runTiming({
                      //   clock: this.clock,
                      value: this.titleTranslateX,
                      dest: 0,
                      completeNode: this.complete
                    })
                  )
                ],
                0
              )
            ])
          }
        </Animated.Code>
        <View
          style={[
            styles.container,
            {
              backgroundColor,
              elevation: 2,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              //   backgroundColor: "red",
              justifyContent: "center"
            }
          ]}
        >
          <TouchableWithOutFeedBack
            onPress={() => {
              this.stackOpen.setValue(cond(eq(this.stackOpen, 1), 0, 1));
            }}
            style={{
              justifyContent: "space-evenly",
              alignItems: "center",
              flexDirection: "row",
              marginHorizontal: 10,
              marginVertical: 10,
              height: 60,
              //   marginTop: 0,
              //   backgroundColor: "green",

              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: this.marginBottom
            }}
          >
            <Animated.View
              style={[
                styles.stackedRow,
                {
                  opacity: this.previewImagesOpacity,
                  //   backgroundColor: "green",
                  //   marginLeft: 20,
                  //   position: "absolute",
                  left: 10
                  //   backgroundColor: "red"
                  //   marginRight: -20
                }
              ]}
            >
              {stackToBeShown.map((stackObj, stackItemIndex) => {
                const imageUrl = stackObj[targetUserIdentifier].images[0].split(
                  "uploads"
                )[1];
                if (stackItemIndex > stackSneakPeakCount) {
                  return null;
                }
                return (
                  <View
                    key={stackItemIndex}
                    style={{
                      transform: [{ translateX: -25 * stackItemIndex }],
                      zIndex: stackItemIndex,
                      alignSelf: "center",
                      justifyContent: "center"
                    }}
                  >
                    <CircularImage
                      style={{
                        borderWidth: 1.5,
                        borderColor: "#fff"
                      }}
                      height={40}
                      source={{
                        uri: STATIC_URL + imageUrl
                      }}
                    />
                  </View>
                );
              })}
            </Animated.View>
            <Animated.Text
              style={[
                styles.titleText,
                {
                  //   alignSelf: "center",
                  flex: 1,
                  textAlign: "center",
                  textAlignVertical: "center",
                  right: 40,
                  //   left: DeviceWidth * 0.1,
                  //   flex: 1,
                  // paddingRight: 30,
                  transform: [
                    { translateX: this.titleTranslateX },
                    { scale: this.titleSize }
                  ]
                }
              ]}
            >
              {stackToBeShown.length || 0} More {peopleWord}
            </Animated.Text>
            <AnimatedIcon
              style={{
                right: 35,
                // alignSelf: "flex-end",
                // backgroundColor: "red",
                // height: 140,
                // justifyContent: "center",
                // alignItems: "center",
                transform: [
                  {
                    rotateZ: this.iconRotate
                  }
                ]
              }}
              name={"ios-arrow-forward"}
              size={22}
              color={"#fff"}
            />
          </TouchableWithOutFeedBack>
          {this.renderStackList()}
        </View>
      </>
    );
  }
}

const mapState = state => {
  return {
    sentStack: state.rooms.sentStack,
    receivedStack: state.rooms.recievedStack
  };
};
const mapDispatch = dispatch => {
  return {};
};
export default connect(mapState, mapDispatch)(Stack);
const styles = {
  container: {
    // flexDirection: "",
    width: "90%",
    // height: 90,
    justifyContent: "center",
    borderRadius: 20,
    alignSelf: "center",
    marginTop: DeviceHeight * 0.025,
    elevation: 2,
    shadowColor: "rgba(0,0,0,0.2)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35
  },

  titleText: {
    fontFamily: "Proxima Nova",
    fontWeight: "700",
    fontSize: 18,
    color: WHITE,
    // marginLeft: -20,
    alignSelf: "center"
    // backgroundColor: "red"
    // transform: [{ translateX: 0 }]
  },
  stackedRow: {
    height: 95,
    // width: "100%",
    alignItems: "center",
    flexDirection: "row"
    // transform: [{ translateX: -LEFT_MARGIN / 2.5 }]
  },
  showPeopleText: {
    fontSize: 16,
    color: FONT_BLACK,
    transform: [{ translateX: -20 }]
  },
  tappableRow: {
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 10,
    height: 60
  }
};

// Stack.prototype = {
//   inSent: Boolean // whether to show sent or received stack,
// onStackItemTapped: func // to be called once tapped
// };
