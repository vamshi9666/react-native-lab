import React, { Component } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { TapGestureHandler, State } from "react-native-gesture-handler";
import Animated, { Easing } from "react-native-reanimated";
import SvgUri from "react-native-svg-uri";
import { DeviceHeight } from "../../config/Device";

const {
  event,
  Value,
  block,
  call,
  cond,
  eq,
  debug,

  Clock,
  SpringUtils,
  spring,
  or,
  set,
  startClock,
  clockRunning,
  timing,
  stopClock,
  defined,
  interpolate,
  neq,
  Extrapolate,
  onChange,
  and
} = Animated;

function runTiming({
  state: tapState,
  // clock,
  value,
  dest,
  onComplete,
  completeNode,
  animState,
  animStateToValue
}) {
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

      set(completeNode, 1),
      set(animState, animStateToValue),
      call([], onComplete)
      // afterCompleteNode ? set(afterCompleteNode, afterCompleteToValue) : 0
    ]),
    state.position
  ]);
}

const SMALL_SCALE = new Value(0.8);
const BIG_SCALE = new Value(1.5);

const BUTTON_STATE = {
  UNDETERMINED: 0,
  SCALE_IN: 1,
  SCALE_OUT: 2,
  DISSAPEAR: 3,
  APPEAR: 4
};
export default class SparkButton extends Component {
  constructor(props) {
    super(props);

    this.tapState = new Value(State.UNDETERMINED);
    this.buttonScale = new Value(1);
    this.scaleClock = new Clock();
    this.bulgeClock = new Clock();
    this.appearClock = new Clock();
    this.wentBack = new Value(0);
    this.animState = new Value(0);
    this.bulgedUp = new Value(0);
    this.dissapeared = new Value(0);
    this.normal = new Value(0);
    this.beingShown = new Value(0);
    this.openClock = new Clock();
  }
  stateBungleAnimation = afterBulge => {
    this.animState.setValue(2);
    setTimeout(() => {
      afterBulge();
    }, 300);
  };
  startToNormal = () => {
    this.animState.setValue(4);
  };
  render() {
    const {
      disabled,
      onPress,
      afterComplete,
      fromProfileModal = false,
      show = new Value(0),
      sparkBtnHandler
    } = this.props;
    const conditionalStyle = fromProfileModal
      ? styles.fromProfileModal
      : styles.surfing;
    return (
      <>
        <Animated.Code>
          {() =>
            block([
              cond(and(eq(this.animState, 1), eq(this.wentBack, 1)), [
                call([], () => onPress(this.stateBungleAnimation))
              ]),
              cond(and(eq(this.animState, 2), eq(this.bulgedUp, 1)), [
                set(this.animState, 3)
                // call([], () => afterComplete())
              ])
            ])
          }
        </Animated.Code>
        <Animated.Code>
          {() =>
            block([
              onChange(
                this.tapState,
                block([
                  cond(
                    and(
                      eq(this.tapState, State.BEGAN),
                      neq(this.animState, 1)
                      // eq(this.normal, 0)
                    ),
                    [set(this.animState, 1)]
                  ),
                  cond(
                    and(
                      eq(this.tapState, State.END),
                      eq(this.animState, 0),
                      eq(this.wentBack, 1)
                    ),
                    [set(this.animState, 2)]
                  )
                ])
              )
            ])
          }
        </Animated.Code>
        <Animated.Code>
          {() =>
            block([
              cond(eq(this.animState, 1), [
                // debug("to open ", this.animState),
                // debug("to open went ", this.wentBack),
                set(
                  this.buttonScale,
                  runTiming({
                    state: this.tapState,
                    clock: new Clock(),
                    dest: SMALL_SCALE,
                    value: this.buttonScale,
                    completeNode: this.wentBack,
                    animState: new Value(1),
                    animStateToValue: 0,
                    onComplete: () => {
                      //   this.animState.setValue(0);
                    }
                  })
                )
              ]),

              cond(eq(this.animState, 2), [
                set(
                  this.buttonScale,
                  runTiming({
                    state: this.tapState,
                    clock: new Clock(),
                    dest: BIG_SCALE,
                    value: this.buttonScale,
                    // toValue: new Value(1)
                    completeNode: this.bulgedUp,
                    animState: this.animState,
                    animStateToValue: 3,

                    onComplete: () => {
                      // this.animState.setValue(3);
                    }
                  })
                )
              ]),
              cond(eq(this.animState, 3), [
                set(
                  this.buttonScale,
                  runTiming({
                    state: this.tapState,
                    clock: new Clock(),
                    dest: 0,
                    value: this.buttonScale,
                    // toValue: new Value(1)
                    completeNode: this.dissapeared,
                    animState: this.animState,
                    animStateToValue: 0,
                    onComplete: () => {
                      // setTimeout(() => {
                      afterComplete();
                      // this.animState.setValue(0);
                      // }, 400);
                    }
                  })
                )
              ]),
              cond(eq(this.animState, 4), [
                set(this.wentBack, 0),

                set(
                  this.buttonScale,
                  runTiming({
                    state: this.tapState,
                    clock: this.scaleClock,
                    dest: 1,
                    value: this.buttonScale,
                    // toValue: new Value(1)
                    completeNode: this.normal,
                    animState: this.animState,
                    animStateToValue: 0,

                    onComplete: () => {
                      setTimeout(() => {
                        // console.log(" onComplete done ");
                        // afterComplete();
                        // this.animState.setValue(0);
                      }, 400);
                    }
                  })
                )
              ])
            ])
          }
        </Animated.Code>
        <Animated.Code>
          {() =>
            block([
              cond(eq(show, 1), [
                set(this.animState, 4),
                set(this.wentBack, 0),
                set(this.bulgedUp, 0)
              ]),

              cond(eq(show, 2), [
                set(this.animState, 3),
                set(this.wentBack, 0),
                set(this.bulgedUp, 0)
              ])
            ])
          }
        </Animated.Code>

        <TapGestureHandler
          ref={sparkBtnHandler}
          onHandlerStateChange={event([
            {
              nativeEvent: {
                state: this.tapState
              }
            }
          ])}
        >
          <Animated.View
            style={[
              conditionalStyle,
              {
                transform: [{ scale: this.buttonScale }, { rotate: 0 }]
              }
            ]}
          >
            {disabled ? (
              <View
                style={{
                  transform: [{ translateX: -1.5 }, { translateY: 2.5 }]
                }}
              >
                <SvgUri
                  width={35}
                  height={35}
                  source={require("../../assets/svgs/ProfileModal/inactiveSpark.svg")}
                />
              </View>
            ) : (
              <View
                style={{
                  transform: [{ translateX: -1.5 }, { translateY: 1.5 }]
                }}
              >
                <SvgUri
                  width={35}
                  height={35}
                  source={require("../../assets/svgs/ProfileModal/activeSpark.svg")}
                />
              </View>
            )}
          </Animated.View>
        </TapGestureHandler>
      </>
    );
  }
}

const BUTTON_SIZE = 50;
const styles = StyleSheet.create({
  surfing: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 20,
    bottom: DeviceHeight * 0.2 - 25,
    zIndex: 2,
    backgroundColor: "#fff",
    shadowColor: "#000000A0",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 3
    }
  },
  fromProfileModal: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    backgroundColor: "#fff",
    height: 50,
    width: 50,
    borderRadius: 25,
    top: DeviceHeight * 0.828,
    right: 25,
    shadowColor: "#000000A0",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 3
    }
  }
});
