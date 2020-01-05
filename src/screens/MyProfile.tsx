import React, { useEffect, useState } from "react";
import { useInterval } from "./../Hooks";
import { StyleSheet, View, Text, Button } from "react-native";

export default ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text> this is Myprofile screen</Text>
      <Button
        title="Go to Settings"
        onPress={() => navigation.push("Settings")}
      />
      <Button title="Go back" onPress={() => navigation.pop()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0c1713",
    alignItems: "center",
    justifyContent: "center"
  }
});
