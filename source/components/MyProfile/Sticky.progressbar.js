import React, { Component } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import RegularText from "../Texts/RegularText";
import { PURPLE, LIGHT_PURPLE } from "../../config/Colors";
import { DeviceWidth, DeviceHeight } from "../../config/Device";
import VerticalGradientView from "../Views/VerticalGradientView";
import { sharedStyles } from "../../styles/Shared";
import RowView from "../Views/RowView";
import { createAnimatableComponent } from "react-native-animatable";
const AnimatedRowView = createAnimatableComponent(RowView);
import Animated, { Easing } from "react-native-reanimated";
const {
  Value,
  cond,
  eq,
  multiply,
  divide,
  neq,
  block,
  Clock,

  set,
  spring,
  debug,
  clockRunning,
  startClock,
  stopClock,
  greaterThan,
  lessOrEq,
  or,
  and,
  onChange,
  timing
} = Animated;

function runTiming({ clock, value, dest, animState, duration }) {
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
      stopClock(clock),
      set(animState, 0)
      // stopClock(clock)
      // cond(
      //   eq(config.toValue, dest)
      //   // [set(, 0)]
      // )
      // completeNode)
    ]),
    state.position
  ]);
}

class StickyProgressbar extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.positionY = new Value(0);
    this.openClock = new Clock();
    this.closeClock = new Clock();
    this.filled = props.percentage === 1 ? new Value(1) : new Value(0);
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    const { props: prevProps } = this;
    const isPercentagePropDifferent =
      nextProps.percentage !== prevProps.percentage;
    // const
    if (isPercentagePropDifferent) {
      return true;
    } else {
      return false;
    }
  };
  componentWillReceiveProps = nextProps => {
    const { percentage } = nextProps;
    if (nextProps.percentage !== this.props.percentage) {
      this.filled.setValue(percentage === 1 ? 1 : 0);
    }
  };

  render() {
    const { percentage, parentScrollY, animState } = this.props;

    const { filled } = this;
    return (
      <>
        <Animated.Code>
          {() =>
            block([
              cond(and(eq(animState, 0), eq(filled, 0)), [
                set(
                  this.positionY,
                  cond(greaterThan(parentScrollY, DeviceHeight / 2.5), 150, 0)
                )
              ]),
              // onChange(animState, [
              cond(and(eq(animState, 1), eq(filled, 0)), [
                set(
                  this.positionY,
                  runTiming({
                    value: this.positionY,
                    clock: this.openClock,
                    dest: 150,
                    duration: 500,
                    animState: animState
                  })
                )
              ]),
              cond(and(eq(animState, 2), eq(filled, 0)), [
                set(
                  this.positionY,
                  runTiming({
                    value: this.positionY,
                    clock: this.closeClock,
                    dest: 0,
                    duration: 1000,
                    animState: animState
                  })
                )
              ])
              // ])
            ])
          }
        </Animated.Code>
        {/* <View style={[styles.cardView]} /> */}
        <Animated.View
          style={[
            styles.insideRow,
            {
              transform: [{ translateY: this.positionY }]
            }
          ]}
        >
          <View
            style={{
              height: 10,
              width: DeviceWidth * 0.6,
              backgroundColor: "rgb(242,242,242)",
              borderRadius: 20,
              marginRight: 15
            }}
          >
            <VerticalGradientView
              colors={[LIGHT_PURPLE, PURPLE]}
              style={{
                height: 10,
                width: DeviceWidth * 0.6 * percentage,
                borderRadius: 20
              }}
            />
          </View>
          <RegularText
            style={{
              color: PURPLE,
              fontSize: 14,
              marginLeft: 0
            }}
          >
            {(percentage * 100).toFixed(0)}%
          </RegularText>
        </Animated.View>
        {/* ) : (
          <View />
        )} */}
      </>
    );
  }
}

const styles = StyleSheet.create({
  cardView: {
    height: DeviceHeight * 1,
    width: DeviceWidth,
    backgroundColor: "rgb(242, 243, 246)",
    position: "absolute",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10
    // transform: [{ translateY: 100 }]
  },
  insideRow: {
    position: "absolute",
    zIndex: 888,
    top: -150,
    flexDirection: "row",
    backgroundColor: "#0000",
    height: 50,
    width: DeviceWidth,
    alignSelf: "center",
    alignItems: "center",
    width: DeviceWidth * 1,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      height: 3,
      width: 1
    },
    shadowOpacity: 0.1,
    ...sharedStyles.justifiedCenter
  }
});

export default StickyProgressbar;

// const destination = cond(
//   greaterThan(parentScrollY, DeviceHeight / 3),
//   150,
//   -150
// );
