import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { DeviceHeight, DeviceWidth } from "../../config/Device";
import { runSpringForModal } from "../../config/Animations";
const {
  set,
  cond,
  eq,
  lessOrEq,
  Value,
  block,
  and,
  greaterThan,
  call,
  interpolate
} = Animated;

class AnimModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    const { x, y, width, height } = props.position;
    this.translateX = new Value(x);
    this.translateY = new Value(y);
    this.width = new Value(width);
    this.height = new Value(height);
    this.scale = new Value(0.3);

    this.velocityY = new Value(0);
    this.pState = new Value(State.UNDETERMINED);

    this._onPanGestureEvent = Animated.event(
      [
        {
          nativeEvent: {
            translationX: this.translateX,
            translationY: this.translateY,
            velocityY: this.velocityY,
            state: this.pState
          }
        }
      ],
      { useNativeDriver: true }
    );
  }

  renderAnimatedCode = () => {
    const {
      props,
      translateX,
      translateY,
      width,
      height,
      scale,
      pState,
      velocityY
    } = this;
    const { position, onClose } = props;

    return (
      <Animated.Code>
        {() =>
          block([
            cond(
              eq(pState, State.UNDETERMINED),
              runSpringForModal(translateX, 0)
            ),
            cond(
              eq(pState, State.UNDETERMINED),
              runSpringForModal(translateY, 0)
            ),
            cond(
              eq(pState, State.UNDETERMINED),
              runSpringForModal(width, DeviceWidth)
            ),
            cond(
              eq(pState, State.UNDETERMINED),
              runSpringForModal(height, DeviceHeight)
            ),
            cond(eq(pState, State.UNDETERMINED), runSpringForModal(scale, 1)),
            cond(
              and(eq(pState, State.END), lessOrEq(velocityY, 0)),
              block([
                runSpringForModal(translateX, 0),
                runSpringForModal(translateY, 0),
                runSpringForModal(width, DeviceWidth),
                runSpringForModal(height, DeviceHeight),
                runSpringForModal(scale, 1)
              ])
            ),

            cond(
              and(eq(pState, State.END), greaterThan(velocityY, 0)),
              block([
                runSpringForModal(translateX, position.x),
                runSpringForModal(translateY, position.y),
                runSpringForModal(width, position.width),
                runSpringForModal(height, position.height),
                runSpringForModal(scale, 0.3),
                cond(eq(height, position.height), call([], onClose))
              ])
            ),
            cond(
              eq(pState, State.ACTIVE),
              set(
                height,
                interpolate(translateY, {
                  inputRange: [0, DeviceHeight],
                  outputRange: [DeviceHeight, position.height]
                })
              )
            ),
            cond(
              eq(pState, State.ACTIVE),
              set(
                width,
                interpolate(translateY, {
                  inputRange: [0, DeviceHeight],
                  outputRange: [DeviceWidth, position.width]
                })
              )
            )
          ])
        }
      </Animated.Code>
    );
  };

  render() {
    const { props, translateX, translateY, width, height } = this;

    return (
      <View style={styles.base}>
        {this.renderAnimatedCode()}
        <PanGestureHandler
          activeOffsetY={100}
          onGestureEvent={this._onPanGestureEvent}
          onHandlerStateChange={this._onPanGestureEvent}
        >
          <Animated.View
            style={{
              backgroundColor: "pink",
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              height,
              width,
              transform: [
                {
                  translateX
                },
                {
                  translateY
                }
                // {
                //   scale
                // }
              ]
            }}
          >
            <Text>ok</Text>
          </Animated.View>
        </PanGestureHandler>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  base: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20000
  }
});

export default AnimModal;
