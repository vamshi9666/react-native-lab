import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  SafeAreaView,
  StatusBar
  // TouchableOpacity
  // FlatList
} from "react-native";

import { Asset } from "expo-asset";
import { AppLoading } from "expo";
import {
  TouchableOpacity,
  FlatList,
  ScrollView
} from "react-native-gesture-handler";
import BottomSheet from "reanimated-bottom-sheet";
import { data } from "./data";
import ListItem from "./src/components/ListItem";
import LightBox from "./src/components/LightBox";
const { width: wWidth, height: wHeight } = Dimensions.get("window");

export default function App() {
  const [modal, setModal] = useState(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    Promise.all(data.map(obj => Asset.loadAsync(obj.source))).then(() => {
      setReady(true);
    });
  }, []);
  const open = (obj, position) => {
    console.log(" params emitted from inside are ", obj, position);
    setModal({ obj, position });
  };
  const close = () => {
    setModal(null);
  };
  if (!ready) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          marginTop: 16,
          // flex: 1,
          justifyContent: "center",
          backgroundColor: "red"
          // alignItems: "center"
        }}
      >
        {data.map((obj, index) => {
          return <ListItem key={index} {...{ obj, ...obj }} onSelect={open} />;
        })}
      </ScrollView>
      {modal !== null && <LightBox {...close} {...modal} />}
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
