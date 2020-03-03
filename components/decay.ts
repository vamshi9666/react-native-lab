import { Platform } from "react-native";
import Animated, { Easing } from "react-native-reanimated";

const P = <T extends any>(android: T, ios: T): T =>
  Platform.OS === "ios" ? ios : android;

const magic = {
  damping: 1200,
  mass: 1,
  stiffness: 121.6,
  overshootClamping: true,
  restSpeedThreshold: 0.3,
  restDisplacementThreshold: 0.3,
  deceleration: 0.399,
  bouncyFactor: 1,
  velocityFactor: P(1, 0.8),
  toss: 0.4,
  coefForTranslatingVelocities: 5
};

const {
  damping,
  mass,
  stiffness,
  overshootClamping,
  restSpeedThreshold,
  restDisplacementThreshold,
  deceleration,
  velocityFactor,
  toss
} = magic;

const {
  Value,
  cond,
  set,
  block,
  clockRunning,
  startClock,
  timing,
  stopClock,
  call,
  multiply,
  decay,
  Clock
} = Animated;

export function runDecay({ value, clock, velocity, completeNode, safe }) {
  // const clock = new Clock();
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0)
  };

  const config = { deceleration };

  return [
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.velocity, multiply(velocity, velocityFactor)),
      set(state.position, value),
      set(state.time, 0),
      startClock(clock)
    ]),
    cond(clockRunning(clock), decay(clock, state, config)),
    cond(state.finished, [
      stopClock(clock),
      set(completeNode, 1),
      set(safe, state.position)
    ]),
    state.position
  ];
}
