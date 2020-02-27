import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  StatusBar,
  Dimensions,
  Alert,
  FlatList
} from "react-native";
import Animated from "react-native-reanimated";
import Highlighter from "./components/Highlighter";
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
        <FlatList
          numColumns={3}
          contentContainerStyle={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
          data={arr}
          renderItem={({ index, item }) => {
            console.log(" tem is ", item);
            return <Highlighter content={item} />;
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
    paddingVertical: 16
    // paddingBottom: 50
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
