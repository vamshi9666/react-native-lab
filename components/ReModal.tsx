import React, { Component } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import Animated, { Easing } from "react-native-reanimated";
import { PanGestureHandler, State } from "react-native-gesture-handler";
const { height } = Dimensions.get("window");
import { onGestureEvent } from "react-native-redash";
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
function runTiming({
  clock,
  value,
  dest
  // oppositeClock
}) {
  // const clock = new Clock();
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0)
  };

  const config = {
    duration: 300,

    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease)
  };

  return block([
    // cond(clockRunning(oppositeClock), stopClock(oppositeClock), 0),
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

export enum Effect {
  SLIDE_FROM_BOTTOM = 1,
  SLIDE_FROM_TOP = 2,
  SLIDE_FROM_LEFT = 3,
  SLIDE_FROM_RIGHT = 4,
  GEENIE = 5
}
interface IProps {
  callbackNode: Animated.Adaptable<any>;
  fromDirection?: String;
  showModal: Animated.Adaptable<any>;
  effect: Effect;
}
interface IState {}
class ReanimatedModal extends Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {};
    this.modalTranslateY = new Value(0);

    this.panState = new Value(State.UNDETERMINED);
    this.dragY = new Value(0);
    this.progress = new Value(0);
    this.shadowOpacity = new Value(0);
    this.fromCoordinate = new Value(0);
    this.scaleX = new Value();
    // this.toCoordinate = new Value();
    this.toCoordinate = new Value(0);
    if (props.effect === Effect.SLIDE_FROM_BOTTOM) {
      this.fromCoordinate = new Value(height);
      this.modalTranslateY = new Value(height);
    } else if (props.effect === Effect.SLIDE_FROM_TOP) {
      this.fromCoordinate = new Value(-height);
      this.modalTranslateY = new Value(-height);
      // this.toCoordinate = new Value(0);
    } else if (props.effect === Effect.GEENIE) {
      this.fromCoordinate = new Value(height);
      this.toCoordinate = new Value(0);
      this.modalTranslateY = new Value(height);
      this.fromScaleX = new Value(0);
      this.toScaleX = new Value(1);
    }

    this.clock = new Clock();

    this.gesureHandler = onGestureEvent({
      translationY: this.modalTranslateY,
      state: this.panState
    });
  }

  render() {
    const { showModal, effect, children } = this.props;
    const shouldUpdateScale = effect === Effect.GEENIE;
    return (
      <>
        <Animated.Code>
          {() =>
            block([
              set(
                this.shadowOpacity,
                interpolate(this.modalTranslateY, {
                  inputRange: [this.fromCoordinate, this.toCoordinate],
                  outputRange: [0, 1],
                  expextrapolate: Extrapolate.CLAMP
                })
              ),
              cond(eq(showModal, 1), [
                set(
                  this.modalTranslateY,
                  runTiming({
                    oppositeClock: new Clock(),
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
          pointerEvents={"none"}
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: "#000",
            opacity: this.shadowOpacity
          }}
        />
        <PanGestureHandler {...this.gesureHandler}>
          <Animated.View
            style={{
              flex: 1,
              // ...styles.container,
              transform: [
                { translateY: this.modalTranslateY },
                {
                  scaleX: shouldUpdateScale
                    ? interpolate(this.modalTranslateY, {
                        inputRange: [this.fromCoordinate, this.toCoordinate],
                        outputRange: [0, 1]
                      })
                    : 1
                }
              ]
            }}
          >
            {children}
          </Animated.View>
        </PanGestureHandler>
      </>
    );
  }
}

export default ReanimatedModal;

const PRIMATY_COLOR = "#101935";
const SECONDARY_COLOR = "#dbcbd8";
