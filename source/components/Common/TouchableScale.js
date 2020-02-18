import React from "react";
import { State, TapGestureHandler } from "react-native-gesture-handler";
import Animated, { Easing } from "react-native-reanimated";

const {
  Value,
  block,
  and,
  call,
  onChange,
  debug,
  cond,
  event,
  timing,
  eq,
  set,
  Clock,
  clockRunning,
  startClock,
  stopClock,
  useCode
} = Animated;

function runTiming({
  value,
  dest,
  completeNode,
  completeValue,
  animState,
  animStateToValue,
  onComplete
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

      set(completeNode, completeValue),
      set(animState, animStateToValue),
      call([], () => onComplete())
    ]),
    state.position
  ]);
}

const CustomTappableScale = ({
  style = {},
  onPress,
  children,
  minScale = 0.9,
  maxScale = 1.2
}) => {
  const tapState = new Value(State.UNDETERMINED);
  const scale = new Value(maxScale);
  const animState = new Value(0);
  const wentIn = new Value(0);
  //event handling with animated nodes
  useCode(
    block([
      cond(and(eq(animState, 1), eq(wentIn, 0)), [
        set(
          scale,
          runTiming({
            animState: animState,
            animStateToValue: 2,
            completeNode: wentIn,
            completeValue: 1,
            dest: minScale,
            value: scale,
            onComplete: onPress
          })
        )
      ]),
      cond(and(eq(animState, 2), eq(wentIn, 1)), [
        set(
          scale,
          runTiming({
            animState: animState,
            animStateToValue: 0,
            completeNode: wentIn,
            completeValue: 0,
            dest: maxScale,
            value: scale,
            onComplete: () => ({})
          })
        )
      ])
    ])
  );
  //tap state handling

  useCode(
    block([
      onChange(tapState, [
        cond(and(eq(tapState, State.BEGAN), eq(animState, 0)), [
          set(animState, 1)
        ])
      ])
    ])
  );
  return (
    <TapGestureHandler
      onHandlerStateChange={event([
        {
          nativeEvent: {
            state: tapState
          }
        }
      ])}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </TapGestureHandler>
  );
};

export default CustomTappableScale;
