import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import Animated, { Easing } from "react-native-reanimated";
import { State } from "react-native-gesture-handler";
import { DeviceWidth } from "../../config/Device";

const {
  and,
  timing,
  lessThan,
  clockRunning,
  startClock,
  stopClock,
  Clock,
  eq,
  cond,
  Code,
  block,
  set,
  call,
  Value,
  concat,
  or,
  neq,
  debug,
  defined,
  onChange
} = Animated;

function runTiming(clock, value, dest, duration, onEnd) {
  const state = {
    finished: new Value(0),
    position: value,
    time: new Value(0),
    frameTime: new Value(0)
  };

  const config = {
    duration,
    toValue: dest,
    easing: Easing.linear
  };

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      debug("clock is running:", clockRunning(clock))
    ]),
    timing(clock, state, config),
    cond(state.finished, [
      stopClock(clock),
      call([], () => onEnd()),
      debug("clock is stoped", clockRunning(clock))
    ]),
    state.position
  ]);
}

const FULL_LENGTH = DeviceWidth * 0.96;
const BAR_HEIGHT = 3;

class ProgressResponse extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.animatedWidth = new Value(0);
  }

  clock = new Clock();

  initialWidth = new Value(0);

  render() {
    const {
      selectedIndex,
      totalNumber,
      index,
      animatedBackTapCount
    } = this.props;
    const width = concat(this.animatedWidth, "%");
    return (
      <>
        <Code>
          {() =>
            block([
              cond(eq(selectedIndex, index), [
                set(
                  this.animatedWidth,
                  runTiming(
                    this.clock,
                    this.initialWidth,
                    new Value(100),
                    5000,
                    this.props.onAnimationEnd
                  )
                ),
                startClock(this.clock)
              ])
            ])
          }
        </Code>

        {/* <Code>
          {() =>
            block([
              cond(
                and(
                  or(
                    and(defined(pState), neq(pState, State.ACTIVE)),
                    and(
                      defined(longPressState),
                      neq(longPressState, State.ACTIVE)
                    )
                  ),
                  eq(selectedIndex, index)
                ),
                startClock(this.clock),
                stopClock(this.clock)
              ),
              cond(
                eq(selectedIndex, index),
                call([], () => this.initialWidth.setValue(0)),
                cond(
                  lessThan(index, selectedIndex),
                  call([], () => this.initialWidth.setValue(100)),
                  call([], () => this.initialWidth.setValue(0))
                )
              )
            ])
          }
        </Code> */}
        <View
          style={{
            width: FULL_LENGTH / totalNumber,
            ...styles.holderBar
          }}
        >
          <Animated.View style={{ ...styles.innerBar, width }} />
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  innerBar: {
    height: BAR_HEIGHT,
    backgroundColor: "#fff",
    borderRadius: 30
  },
  holderBar: {
    backgroundColor: "#00000030",
    height: BAR_HEIGHT,
    marginHorizontal: DeviceWidth * 0.01,
    alignSelf: "center",
    borderRadius: 30
  }
});

export default ProgressResponse;
