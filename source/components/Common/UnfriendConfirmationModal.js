import React from "react";
import { Modal, View, StyleSheet, TouchableOpacity } from "react-native";
import MediumText from "../Texts/MediumText";
import RegularText from "../Texts/RegularText";

export default ({ visible }) => {
  return (
    <Modal visible={visible}>
      <View style={styles.content}>
        <MediumText
          style={{
            marginHorizontal: 10,
            marginBottom: 10
          }}
        >
          Are you sure you want to Unfriend This person
        </MediumText>
        <View style={styles.btnCon}>
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: "center"
            }}
          >
            <RegularText>Yes</RegularText>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: "center"
            }}
          >
            <RegularText>Cancel</RegularText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "column"
  },
  btnCon: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center"
  }
});
