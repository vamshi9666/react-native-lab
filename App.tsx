import React, { useState } from "react";
import { StyleSheet, Text, View, Button, Dimensions } from "react-native";
import ReModal, { Effect } from "./components/ReModal";
import Animated from "react-native-reanimated";
const { Value, Extrapolate, block, eq, debug, cond, interpolate } = Animated;

const { height, width } = Dimensions.get("window");
export default class App extends React.Component {
  // const [modalVisible, setModalVisible] = useState(false);
  state = {
    modalVisible: false
  };
  private modalVisible: Animated.Value<any> = new Value(0);
  progress = new Value(0);
  render() {
    const { modalVisible } = this;
    // const { modalVisible } = this.state;
    const { progress } = this;
    return (
      <View style={styles.container}>
        <ReModal
          effect={Effect.GEENIE}
          showModal={modalVisible}
          callbackNode={progress}
        >
          <View
            style={{
              // flex: 1,
              width,
              height,

              // maxHeight,
              backgroundColor: "green"
            }}
          />
        </ReModal>

        <Button
          title={"open"}
          onPress={() => {
            this.modalVisible.setValue(cond(eq(this.modalVisible, 1), 2, 1));
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
