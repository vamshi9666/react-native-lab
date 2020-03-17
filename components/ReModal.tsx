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
  private modalTranslateY: Animated.Value<number> = new Value(0);

  private panState: Animated.Value<number> = new Value(State.UNDETERMINED);
  private dragY: Animated.Value<number> = new Value(0);
  private progress: Animated.Value<number> = new Value(0);
  private shadowOpacity: Animated.Value<number> = new Value(0);
  private fromCoordinate: Animated.Value<number> = new Value(0);
  private scaleX: Animated.Value<number> = new Value();
  private toCoordinate: Animated.Value<number> = new Value(0);
  private from;
  private clock: any = new Clock();
  constructor(props) {
    super(props);

    if (props.effect === Effect.SLIDE_FROM_BOTTOM) {
      this.fromCoordinate.setValue(height);
      this.modalTranslateY.setValue(height);
    } else if (props.effect === Effect.SLIDE_FROM_TOP) {
      this.fromCoordinate.setValue(-height);
      this.modalTranslateY.setValue(-height);
      // this.toCoordinate .setValue(0);
    } else if (props.effect === Effect.GEENIE) {
      this.fromCoordinate.setValue(height);
      this.toCoordinate.setValue(0);
      this.modalTranslateY.setValue(height);
      this.fromScaleX.setValue(0);
      this.toScaleX.setValue(1);
    }
  }

  render() {
    const { showModal, effect, children } = this.props;
    const shouldUpdateScale = effect === Effect.GEENIE;
    const gestureHandler = onGestureEvent({
      translationY: this.modalTranslateY,
      state: this.panState
    });
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
                  extrapolate: Extrapolate.CLAMP
                })
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
          pointerEvents={"none"}
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: "#000",
            opacity: this.shadowOpacity
          }}
        />
        <PanGestureHandler enabled={false} {...gestureHandler}>
          <Animated.View
            style={{
              flex: 1,
              // ...styles.container,
              transform: [
                { translateY: this.modalTranslateY as any },
                {
                  scaleX: shouldUpdateScale
                    ? (interpolate(this.modalTranslateY, {
                        inputRange: [this.fromCoordinate, this.toCoordinate],
                        outputRange: [0.4, 1]
                      }) as any)
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
