import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Navigator from "./src/screens/index";
export default function App() {
  return <Navigator></Navigator>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
