//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ReText } from "react-native-redash";
import Animated, { Easing } from "react-native-reanimated";
import { DeviceWidth } from "../../../src/config/Device";
import SvgUri from "react-native-svg-uri";
import { MONETIZATION_ICONS } from "../../config/Constants";
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
  concat,
  timing,
  stopClock,
  defined,
  interpolate,
  neq,
  Extrapolate,
  onChange,
  floor,
  round,

  and
} = Animated;

const makeSteps = (start, end) => {
  let res = [];
  for (let i = start; i <= end; i += 0.1) {
    res.push(Math.round(i * 10) / 10);
  }
  console.log(" res is ", start, end, res);
  return res;
};

const makeStepDec = (start, end) => {
  let res = [];
  let steps = 10;
  let eachStep = Math.abs(start - end) / steps;

  for (let i = start; i >= end; i -= eachStep) {
    res.push(Math.round(eachStep));
  }
  console.log(" res is ", start, end, res);
  return res;
};
function runTiming({
  // clock,
  value,
  dest,
  onComplete,
  completeNode,
  completeValue,
  duration
}) {
  const clock = new Clock();
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0)
  };

  const config = {
    duration,
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
      // debug(
      // "stop clock",

      stopClock(clock),
      // ),
      cond(eq(state.position, dest), [
        debug("done animating", completeNode),

        set(completeNode, completeValue)
      ]),
      call([], onComplete)
    ]),
    state.position
  ]);
}
// create a component
class GemsAcknowledgement extends Component {
  constructor(props) {
    super(props);
    // this.fromCount = props.fromCount || new Value(0);
    // this.toCount = props.toCount || new Value(0);
    this.close = new Value(0);
    this.startDelay = new Value(0);
    this.endDelay = new Value();
    this.open = new Value(0);
    this.countAnimationFinished = new Value(0);
    // this.backgroundOpacity = new Value(0);
    this.openProgress = new Value(0);
    // this.openClock = new Clock();

    // this.countClock = new Clock();
    this.countProgress = new Value(0);
    this.badgeScale = new Value(0);
    // this.closeClock = new Clock();
  }
  renderCode = () => {
    const { show } = this.props;
    return (
      <>
        <Animated.Code>
          {() =>
            block([
              debug("show countAnimationFinished >>>>>>", show),
              cond(eq(show, 1), [
                set(
                  this.badgeScale,
                  runTiming({
                    duration: 250,
                    completeNode: this.open,
                    completeValue: 1,
                    dest: 1,
                    value: this.badgeScale,
                    onComplete: () => {}
                  })
                )
              ]),
              cond(eq(show, 2), [
                // set(this.countProgress, 0),
                // set(this.open, 0),
                // set(this.countAnimationFinished, 0),
                // set(this.countProgress, 0),
                set(
                  this.badgeScale,
                  runTiming({
                    duration: 250,

                    // state: new Value(-1),
                    // clock: this.closeClock,
                    completeNode: this.close,
                    completeValue: 1,
                    dest: 0,
                    value: this.badgeScale,
                    onComplete: () => {
                      // this.startDelay.setValue(0);
                      // this.open.setValue(0);
                      // show.setValue(0);
                      // this.countProgress.setValue(0);
                      // this.countAnimationFinished.setValue(0);
                    }
                  })
                ),
                cond(eq(this.close, 1), [
                  set(this.startDelay, 0),
                  set(this.countProgress, 0),
                  set(this.open, 0),
                  set(this.countAnimationFinished, 0),
                  set(show, 0),
                  set(this.close, 0)

                  // set(this.countAnimationFinished, 0)
                ])
              ])

              // cond(eq(this.close), [
              //   // set(this.startDelay, 0),
              //   // set(this.open, 0),
              //   // set(this.countProgress, 0),
              //   // set(this.countAnimationFinished, 0),
              //   // set(show, 0)
              // ])
            ])
          }
        </Animated.Code>
        <Animated.Code>
          {() =>
            block([
              // debug(" countAnimationFinished ", this.countProgress),
              // debug(
              //   " countAnimationFinished two  ",
              //   this.countAnimationFinished
              // ),
              cond(eq(this.open, 1), [
                set(
                  this.startDelay,
                  runTiming({
                    duration: 400,
                    completeNode: new Value(0),
                    completeValue: 1,
                    dest: 1,
                    value: this.startDelay,
                    onComplete: () => ({})
                  })
                )
              ]),

              cond(eq(this.startDelay, 1), [
                set(
                  this.countProgress,
                  runTiming({
                    duration: 1000,
                    completeNode: new Value(0),
                    completeValue: 1,
                    dest: 1,
                    value: this.countProgress,
                    onComplete: () => ({})
                  })
                )
              ]),
              cond(eq(this.countProgress, 1), [
                set(
                  this.countAnimationFinished,
                  runTiming({
                    duration: 1000,
                    completeNode: new Value(0),
                    completeValue: 1,
                    dest: 1,
                    value: this.countAnimationFinished,
                    onComplete: () => ({})
                  })
                )
              ]),
              cond(eq(this.countAnimationFinished, 1), [set(show, 2)])
            ])
          }
        </Animated.Code>
      </>
    );
  };
  render() {
    const { fromCount, toCount } = this.props;
    const propsFullfilled = !!fromCount && !!toCount;
    if (!propsFullfilled) {
      return null;
    }

    const shownCount = interpolate(this.countProgress, {
      inputRange: [0, 1],
      outputRange: [fromCount, toCount],
      extrapolate: Extrapolate.CLAMP
    });
    // const opacity = interpolate(this.open, {
    //   inputRange: [0, 1],
    //   outputRange: [0, 0.5],
    //   extrapolate: Extrapolate.CLAMP
    // });

    return (
      <>
        {this.renderCode()}
        <Animated.View
          pointerEvents={"none"}
          style={[styles.container, { opacity: 1 }]}
        >
          <Animated.View
            style={{
              // width: 60,
              backgroundColor: "white",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 20,
              shadowOffset: { width: 2, height: 4 },
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 10,
              flexDirection: "row",
              height: 35,
              paddingHorizontal: 10,
              transform: [{ scale: this.badgeScale }]
            }}
          >
            <SvgUri source={MONETIZATION_ICONS["GEMS"]} />

            <ReText
              style={{
                fontSize: 16
              }}
              text={concat(" ", floor(shownCount))}
            />
          </Animated.View>
        </Animated.View>
      </>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    // flex: 1,
    top: 0,
    left: 0,
    // width: DeviceWidth,
    right: 0,
    // backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10000
  }
});

//make this component available to the app
export default GemsAcknowledgement;
