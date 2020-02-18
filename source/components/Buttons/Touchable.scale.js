import React, { Component } from "react";
import Animated from "react-native-reanimated";
import { TapGestureHandler, State } from "react-native-gesture-handler";

const { Value, cond, eq } = Animated;

class ReAnimatedTouchableScale extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    const gestureState = new Value(-1);
    this.animatedScale = cond(eq(gestureState, State.BEGAN), 0.8, 1);
  }

  render() {
    const { children } = this.props;

    return (
      <TapGestureHandler onHandlerStateChange={this.onStateChange}>
        <Animated.View
          style={{
            transform: [
              {
                scale: this.animatedScale
              }
            ]
          }}
        >
          {children}
        </Animated.View>
      </TapGestureHandler>
    );
  }
}

export default ReAnimatedTouchableScale;
