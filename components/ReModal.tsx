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

function runTiming({ clock, value, dest }) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0)
  };

  const config = {
    duration: 500,
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
    cond(state.finished, debug("stop clock", stopClock(clock))),
    state.position
  ]);
}
interface IProps {
  visible: Boolean;
  callbackNode: Animated.Adaptable<Numer>;
}
interface IState {}
class ReanimatedModal extends Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {};
    this.modalTranslateY = new Value(height);
    this.showModal = new Value(0);
    this.clock = new Clock();
  }
  componentWillReceiveProps = nextProps => {
    if (nextProps.visible !== this.props.visible) {
      console.log(" to bal", nextProps.visile ? 1 : 0);
      this.showModal.setValue(nextProps.visible ? 1 : 2);
    }
  };

  render() {
    return (
      <>
        <Animated.Code>
          {() =>
            block([
              // debug("callback node is ", this.props.callBackNode),
              // onChange(
              // this.modalTranslateY,
              set(
                this.props.callbackNode,
                interpolate(this.modalTranslateY, {
                  inputRange: [0, height],
                  outputRange: [0, 1],
                  expextrapolate: Extrapolate.CLAMP
                })
                // )
              ),
              cond(eq(this.showModal, 1), [
                set(
                  this.modalTranslateY,
                  runTiming({
                    clock: this.clock,
                    value: this.modalTranslateY,
                    dest: new Value(0)
                  })
                )
              ]),
              cond(eq(this.showModal, 2), [
                set(
                  this.modalTranslateY,
                  runTiming({
                    clock: this.clock,
                    value: this.modalTranslateY,
                    dest: new Value(height)
                  })
                )
              ]),
              debug("show this ", this.props.callbackNode)
            ])
          }
        </Animated.Code>
        {/*<Animated.View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor:"#000",
              opacity: this.modalTranslateY
            }}

        />
*/}

        <Animated.View
          style={{
            ...styles.container,
            transform: [{ translateY: this.modalTranslateY }]
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
