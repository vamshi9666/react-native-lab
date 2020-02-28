import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  StatusBar,
  Dimensions,
  Alert
} from "react-native";
import ReModal from "./components/ReModal";
import Animated from "react-native-reanimated";
import MathProof from "./components/math";
const { Value, Extrapolate, block, eq, debug, cond, interpolate } = Animated;
const { height, width } = Dimensions.get("window");
const arr = new Array(30).fill(1).map((i, index) => index + 1);
export default class App extends React.Component {
  // const [modalVisible, setModalVisible] = useState(false);
  state = {
    modalVisible: false
  };
  masterTranslateX = new Value(0);
  modalVisible = new Value(0);
  progress = new Value(0);
  render() {
    const { modalVisible } = this;
    // const { modalVisible } = this.state;
    const { progress } = this;
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <MathProof />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 50
  },
  scrollContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  showdowStyles: {
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 20
  }
});
