import React, { Component } from "react";
import Animated from "react-native-reanimated";
import { DeviceHeight, DeviceWidth } from "../../../src/config/Device";

class BlackOverlay extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { opacity } = this.props;

    return (
      <Animated.View
        style={{
          zIndex: 1,
          position: "absolute",
          height: DeviceHeight,
          width: DeviceWidth,
          backgroundColor: Animated.color(0, 0, 0, opacity)
        }}
      />
    );
  }
}

export default BlackOverlay;
// const mapStateToProps = state => {
//   return {
//     bgOpacity: state.app.bgOpacity
//   };
// };

// const mapDispatchToProps = dispatch => ({});

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(BlackOverlay);
