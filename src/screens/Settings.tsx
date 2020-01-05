import React, { useState } from "react";
import { useInterval } from "../Hooks";
import { StyleSheet, View, Text, Button } from "react-native";

export default ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text> this is settings screen</Text>
      <Button title="Go back" onPress={() => navigation.pop()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0a202",
    alignItems: "center",
    justifyContent: "center"
  }
});
