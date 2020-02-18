import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { Easing } from "react-native-reanimated";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { FONT_BLACK, FONT_GREY } from "../../config/Colors";
import { DeviceHeight, DeviceWidth } from "../../config/Device";
import { updateOwnProfile } from "../../redux/actions/user.info";
import * as constants from "./../../config/Constants";
const {
  cond,
  eq,
  block,
  debug,
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
  Extrapolate
} = Animated;

function runTiming({ clock, value, dest, completeNode }) {
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
class NewCloserModal extends Component {
  constructor(props) {
    super(props);
    this.showModal = new Value(0);
    this.clock = new Clock();
    this.modalTransY = new Value(DeviceHeight);
  }

  componentWillReceiveProps = nextProps => {
    const prevProps = this.props;

    // console.log(
    //   " animated shoule start now ",
    //   nextProps.visible,
    //   "prev is ",
    //   prevProps.visible
    // );
    if (nextProps.visible !== this.props.visible) {
      if (nextProps.visible === true) {
        // this.showModal = new Value(1);
        this.showModal.setValue(1);
        // console.log(" next animated value is !!!!! ", nextProps.visible);
      } else if (nextProps.visible === false && prevProps.visible === true) {
        this.showModal.setValue(2);
        // alert(" should close ");

        // console.log(" next animated value is $$$$$ ", nextProps.visible);
      }
    }
  };
  shouldComponentUpdate = (nextProps, nextState) => {
    return nextProps.visible !== this.props.visible;
  };
  render() {
    const { children, inSecondLevel, inThirdLevel } = this.props;

    return (
      <>
        <Animated.Code>
          {() =>
            block([
              //   set(this.props.callbackNode, this.modalTransY),
              cond(eq(this.showModal, 1), [
                set(
                  this.modalTransY,
                  runTiming({
                    clock: this.clock,
                    dest: new Value(0),
                    value: this.modalTransY,
                    completeNode: this.showModal
                  })
                )
              ]),
              cond(eq(this.showModal, 2), [
                set(
                  this.modalTransY,

                  runTiming({
                    clock: this.clock,
                    dest: new Value(DeviceHeight),
                    value: this.modalTransY,
                    completeNode: this.showModal
                  })
                )
              ])
            ])
          }
        </Animated.Code>
        <Animated.View
          // pointerEvents={cond(eq(this.showModal, 0), "none", "auto")}
          pointerEvents={"box-none"}
          style={{
            ...StyleSheet.absoluteFillObject,
            height: DeviceHeight,
            width: DeviceWidth
          }}
        >
          <Animated.View
            pointerEvents={cond(eq(this.showModal, 0), "none", "auto")}
            style={{
              ...StyleSheet.absoluteFillObject,
              zIndex: inThirdLevel ? 1000000 : inSecondLevel ? 10000 : 1,
              backgroundColor: "#000",
              opacity: interpolate(this.modalTransY, {
                inputRange: [0, DeviceHeight],
                outputRange: [0.8, 0],
                extrapolate: Extrapolate.CLAMP
              })
            }}
          />
          <Animated.View
            // pointerEvents={cond(eq(this.showModal, 0), "none", "auto")}
            style={{
              position: "absolute",
              // marginHorizontal: 4,
              // marginVertical: 24,
              // borderRadius: 20,
              // bottom: 0,
              // justifyContent: "center",
              // alignItems: "center",
              // zIndex: inSecondLevel ? 10001 : 2,
              zIndex: inThirdLevel ? 1000002 : inSecondLevel ? 10001 : 2,

              transform: [
                {
                  translateY: this.modalTransY
                }
              ]
            }}
          >
            {children}
          </Animated.View>
        </Animated.View>
      </>
    );
  }
}

export default NewCloserModal;

// mountModal = modalName => {
//   this.setState({
//     BuygemsModal: modalName === "BuygemsModal" ? true : false,
//     BuygemsModal: modalName === "BuygemsModal" ? true : false,
//     BuygemsModal: modalName === "BuygemsModal" ? true : false,
//     otherGems: otherGems === "otherGems" ? true : false
//   });
// };
