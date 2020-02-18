import Animated, { Easing } from "react-native-reanimated";
import { State } from "react-native-gesture-handler/GestureHandler";

const {
  Clock,
  Value,
  block,
  cond,
  lessOrEq,
  startClock,
  stopClock,
  spring,
  eq,
  clockRunning,
  set,
  timing,
  call
} = Animated;

export function runSpring({ translateY, velocityY, state: _state, toValue }) {
  const clock = new Clock();
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0)
  };
  const config = {
    stiffness: new Value(10),
    mass: new Value(1),
    damping: new Value(10),
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001
  };

  // startClock(clock);
  return block([
    cond(lessOrEq(translateY, 0), [
      cond(
        lessOrEq(velocityY, -300),
        [startClock(clock), spring(clock, state, { ...config, toValue })],
        [
          cond(
            eq(_state, State.END),
            [startClock(clock), spring(clock, state, config)],

            [
              set(state.position, translateY)
              // debug("clock  2 happened", eq(_state, State.ACTIVE))
            ]
          )
        ]
      )
    ]),
    state.position
  ]);
}

export function runSpringForModal(value, dest) {
  const clock = new Clock();
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0)
  };

  const config = {
    damping: 30,
    mass: 1,
    tension: 300,
    stiffness: 400,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
    toValue: new Value(0)
  };

  return [
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.velocity, 0),
      set(state.position, value),
      set(config.toValue, dest),
      startClock(clock)
    ]),
    spring(clock, state, config),
    cond(state.finished, stopClock(clock)),
    set(value, state.position)
  ];
}

export function runTimingForNavbarNob(value, dest, duration) {
  const clock = new Clock();
  const state = {
    finished: new Value(0),
    position: value,
    time: new Value(0),
    frameTime: new Value(0)
  };

  const config = {
    duration,
    toValue: dest,
    easing: Easing.inOut(Easing.ease)
  };

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock)
    ]),
    timing(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position
  ]);
}

export const runRepeatedTiming = (value, dest, duration) => {
  const clock = new Clock();
  const state = {
    finished: new Value(0),
    position: value,
    time: new Value(0),
    frameTime: new Value(0)
  };

  const config = {
    duration,
    toValue: dest,
    easing: Easing.inOut(Easing.ease)
  };

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock)
    ]),
    timing(clock, state, config),
    cond(state.finished, [
      stopClock(clock),
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, 0),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock)
    ]),
    state.position
  ]);
};

export function runTiming({
  value,
  dest,
  completeNode,
  completeValue,
  onComplete,
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
      stopClock(clock),
      set(completeNode, completeValue),
      call([], () => onComplete())
    ]),
    state.position
  ]);
}
