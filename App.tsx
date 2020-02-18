import React, { useState } from "react";
import { StyleSheet, Text, View, Button, Dimensions } from "react-native";
import ReModal from "./components/ReModal";
import Animated from "react-native-reanimated";
import ReCaurosel from "./components/ReCaurosel";
const { Value, Extrapolate, block, eq, debug, cond, interpolate } = Animated;

const { height } = Dimensions.get("window");
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
        <ReCaurosel
          data={new Array(20).fill(1)}
          onItemSnapped={(index, direction) => {
            console.log(" snapped to ", index, direction);
          }}
          renderItem={(_, itemIndex) => (
            <View
              style={{
                width: 250,
                height: height * 0.8,
                backgroundColor: "red"
              }}
            />
          )}
        />
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
  }
});
