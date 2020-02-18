import React, { PureComponent } from "react";
import { View, StyleSheet } from "react-native";
import { DeviceWidth, DeviceHeight } from "../../config/Device";
import SvgUri from "react-native-svg-uri";

class BackgroundIcon extends PureComponent {
  render() {
    const { bgIcon } = this.props;
    return (
      <View style={styles.bgIconsView}>
        <SvgUri height={DeviceHeight} width={DeviceHeight} source={bgIcon} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bgIconsView: {
    position: "absolute",
    opacity: 0.3,
    zIndex: -1,
    left: -DeviceWidth * 0.4,
    top: 20
  }
});

export default BackgroundIcon;
