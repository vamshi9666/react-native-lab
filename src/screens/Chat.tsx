import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>this is chat window</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e84b56",
    justifyContent: "space-evenly",
    alignItems: "center"
  }
});
