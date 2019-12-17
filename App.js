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
import BottomSheet from "reanimated-bottom-sheet";
import { data } from "./data";
const { width: wWidth, height: wHeight } = Dimensions.get("window");
import ShadowModal from "./src/components/ShadowModal";
export default function App() {
  const [modalVisible, setModalVisible] = useState(0);
  // const clock = new Clock(/)
  return (
    <View style={styles.container}>
      <ShadowModal visible={modalVisible} setModalVisible={setModalVisible} />
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
