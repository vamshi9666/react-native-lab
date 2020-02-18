import React, { Component } from "react";
import { View, Modal, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { runTimingForNavbarNob } from "../../config/Animations";

const { Value } = Animated;

class CloserModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showBg: false,
      bgOpacity: new Value(0)
    };
  }

  toggleBg = showBg => {
    this.setState({ showBg }, () => {
      if (showBg) {
        this.startAnimation(true);
      }
    });
  };

  animation = new Value(0);
  initialValue = new Value(0);
  animatedOpacity = runTimingForNavbarNob(
    this.initialValue,
    this.animation,
    400
  );

  startAnimation = cond => {
    this.animation.setValue(cond ? 0.8 : 0);
  };

  render() {
    const { showBg } = this.state;
    const { children, isModalVisible } = this.props;

    return (
      <>
        {showBg ? (
          <Animated.View
            style={{
              backgroundColor: "#000",
              opacity: this.animatedOpacity,
              position: "absolute",
              zIndex: 100,
              ...StyleSheet.absoluteFillObject
            }}
          />
        ) : (
          <View />
        )}
        <Modal
          animated
          animationType={"slide"}
          transparent
          visible={isModalVisible}
        >
          {children}
        </Modal>
      </>
    );
  }
}

export default CloserModal;
