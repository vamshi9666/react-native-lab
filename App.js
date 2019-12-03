import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions
  // TouchableOpacity
  // FlatList
} from "react-native";
import { TouchableOpacity, FlatList } from "react-native-gesture-handler";
import { data } from "./data";
// import Notification from "./src/components/Notification";
import Notification from "./src/components/Notification";
const { width: wWidth, height: wHeight } = Dimensions.get("window");
export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [dragged, setDragged] = useState(false);
  // const clock = new Clock(/)
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          backgroundColor: "white",
          paddingHorizontal: 16,
          paddingVertical: 16
        }}
        onPress={() => {
          setModalVisible(!modalVisible);
          // modal.current.snapTo(1);
        }}
      >
        <Text>SHow notification</Text>
      </TouchableOpacity>
      <Notification show={modalVisible} setModalVisible={setModalVisible} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#71a2b6",
    alignItems: "center",
    justifyContent: "center"
  }
});
