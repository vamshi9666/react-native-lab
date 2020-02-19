import React, { Component } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import Animated, { Easing } from "react-native-reanimated";
import {} from "react-native-gesture-handler";
const { height } = Dimensions.get("window");
const {
  Value,
  cond,
  debug,
  onChange,
  eq,
  set,
  timing,
  Clock,
  clockRunning,
  startClock,
  stopClock,
  block,
  interpolate,
  Extrapolate
} = Animated;

interface runTimingProps {
  clock: Animated.Clock;
  value: Animated.Adaptable<number>;
  dest: number;
  oppositeClock: Animated.Clock;
}
function runTiming({ clock, value, dest, oppositeClock }: runTimingProps) {
  // const clock = new Clock();
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0)
  };

  const config = {
    duration: 350,

    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease)
  };

  return block([
    cond(clockRunning(oppositeClock), stopClock(oppositeClock), 0),
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
    cond(state.finished, stopClock(clock)),
    state.position
  ]);
}

enum Effect {
  SLIDE_FROM_BOTTOM = 1,
  SLIDE_FROM_TOP = 2,
  SLIDE_FROM_LEFT = 3,
  SLIDE_FROM_RIGHT = 4
}
interface IProps {
  visible: Boolean;
  callbackNode: Animated.Adaptable<Number>;
  fromDirection?: String;
  showModal: Animated.Adaptable<Number>;
  effect: Effect;
}
interface IState {}
class ReanimatedModal extends Component<IProps, IState> {
  private modalTranslateY: any;
  constructor(props) {
    super(props);
    this.state = {};
    this.modalTranslateY = new Value(height);
    this.progress = new Value(0);
    this.shadowOpacity = new Value(0);
    this.fromCoordinate = new Value();
    // this.toCoordinate = new Value();
    this.toCoordinate = new Value(0);
    if (props.effect === 1) {
      this.fromCoordinate = new Value(height);
      this.modalTranslateY = new Value(height);
    } else if (props.effect === 2) {
      this.fromCoordinate = new Value(-height);
      this.modalTranslateY = new Value(-height);
      // this.toCoordinate = new Value(0);
    }

    this.clock = new Clock();
  }

  render() {
    const { showModal, effect } = this.props;
    return (
      <>
        <Animated.Code>
          {() =>
            block([
              // debug("callback node is ", showModal),
              // onChange(
              // this.modalTranslateY,
              set(
                this.props.callbackNode,
                interpolate(this.modalTranslateY, {
                  inputRange: [this.fromCoordinate, this.toCoordinate],
                  outputRange: [1, 0],
                  expextrapolate: Extrapolate.CLAMP
                })
                // )
              ),
              set(
                this.shadowOpacity,
                interpolate(this.modalTranslateY, {
                  inputRange: [this.fromCoordinate, this.toCoordinate],
                  outputRange: [0, 1],
                  expextrapolate: Extrapolate.CLAMP
                })
                // )
              ),
              cond(eq(showModal, 1), [
                set(
                  this.modalTranslateY,
                  runTiming({
                    clock: this.clock,
                    value: this.modalTranslateY,
                    dest: this.toCoordinate
                  })
                )
              ]),
              cond(eq(showModal, 2), [
                set(
                  this.modalTranslateY,
                  runTiming({
                    clock: this.clock,
                    value: this.modalTranslateY,
                    dest: this.fromCoordinate
                  })
                )
              ])
            ])
          }
        </Animated.Code>
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: "#000",
            opacity: this.shadowOpacity
          }}
        />

        <Animated.View
          style={{
            ...styles.container,
            transform: [
              { translateY: this.modalTranslateY }
              // {
              //   translateY: this.fromCoordinate
              // }
            ]
          }}
        ></Animated.View>
      </>
    );
  }
}

export default ReanimatedModal;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    marginHorizontal: 32,
    flex: 1,
    marginVertical: 100,
    // height: 300,
    backgroundColor: "red"
  }
});

const PRIMATY_COLOR = "#101935";
const SECONDARY_COLOR = "#dbcbd8";
