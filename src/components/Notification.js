import React, { useRef, useEffect, Component } from "react";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { View, Dimensions } from "react-native";
import Interactable from "../../lib/Interactable";
import Animated from "react-native-reanimated";
// import Interactable from "react-native-interactable";
import { Button } from "react-native";
const {
  set,
  cond,
  eq,
  add,
  multiply,
  lessThan,
  spring,
  startClock,
  stopClock,
  clockRunning,
  sub,
  defined,
  Value,
  Clock,
  event,
  debug
} = Animated;

const { width: sWidth } = Dimensions.get("window");

export default class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidUpdate = prevProps => {
    if (prevProps.show !== this.props.show) {
      if (this.props.show === true) {
        this.refs["notif"].snapTo({ index: 1 });

        this.timing = setTimeout(() => {
          this.refs["notif"].snapTo({ index: 0 });
          // this.props
          clearInterval(this.timing);
        }, 4000);
      }
    }
  };

  render() {
    const { show } = this.props;
    return (
      <Interactable.View
        ref={"notif"}
        // initialPosition={{ y: -180 }}
        verticalOnly={true}
        style={{ position: "absolute", top: -120 }}
        snapPoints={[{ y: -120 }, { y: 120 }]}
        onSnap={(...rest) => {
          // rest.
          if (this.props.show === true) {
            this.props.setModalVisible(false);
            clearInterval(this.timing);
          }
          console.log(" this.props.", this.props.show);
          // this.props.setModalVisible(!show);
        }}
      >
        <View
          style={{
            width: sWidth - 16,
            height: 100,
            margin: 16,
            backgroundColor: "blue"
          }}
        />
      </Interactable.View>
    );
  }
}
