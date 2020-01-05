import React, { useState } from "react";
import { useInterval } from "../Hooks";

import { StyleSheet, View, Text, Button } from "react-native";

export default ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text> this is home screen</Text>
      <Button
        title="Go to Settings"
        onPress={() => navigation.push("Settings")}
      />
      <Button
        title="Go to Profile"
        onPress={() => navigation.push("MyProfile")}
      />
      <Button title="Go to chat" onPress={() => navigation.push("Chat")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#dddfc4",
    alignItems: "center",
    justifyContent: "space-evenly"
  }
});
