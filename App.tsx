import React, { useState } from "react";
import { StyleSheet, Text, View, Button, Dimensions } from "react-native";
import ReModal from "./components/ReModal";
import Animated from "react-native-reanimated";
const { Value, Extrapolate, block, eq, debug, cond, interpolate } = Animated;

const { height } = Dimensions.get("window");
export default class App extends React.Component {
  // const [modalVisible, setModalVisible] = useState(false);
  state = {
    modalVisible: false
  };
  modalVisible = new Value(0);
  progress = new Value(0);
  render() {
    const { modalVisible } = this;
    // const { modalVisible } = this.state;
    const { progress } = this;
    return (
      <View style={styles.container}>
        <ReModal
          effect={2}
          showModal={modalVisible}
          callbackNode={progress}
          visible={modalVisible}
        ></ReModal>

        {/*<Animated.View
          pointerEvents={"none"}
          style={{
            zIndex: -1,
            backgroundColor: "#000",
            ...StyleSheet.absoluteFillObject,

            // width: 100,
            // height: 100,
            opacity: interpolate(progress, {
              inputRange: [0, 1],
              outputRange: [0.8, 0],
              extrapolate: Extrapolate.CLAMP
            })
          }}
        />*/}
        <Button
          title={"open"}
          onPress={() => {
            this.modalVisible.setValue(cond(eq(this.modalVisible, 1), 2, 1));
            // alert(" one");

            // this.setState({ modalVisible: !modalVisible });
          }}
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
  }
});
