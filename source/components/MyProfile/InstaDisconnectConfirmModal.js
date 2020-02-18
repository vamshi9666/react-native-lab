import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FONT_BLACK, PURPLE, FONT_GREY, greyTheme } from "../../config/Colors";
import { withDecay } from "react-native-redash";
import { DeviceWidth } from "../../config/Device";
import BoldText from "../Texts/BoldText";

export default ({ onOk, onCancel, ...props }) => {
  return (
    <View style={styles.mainCon}>
      <BoldText style={styles.headingText}>Disconnect instagram?</BoldText>
      <View style={styles.textCon}>
        <Text style={styles.contentTxt}>
          Your profile gets more responses when {"\n"} your Instagram pictures
          are displayed.
        </Text>
      </View>
      <View style={styles.btnsCon}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "rgb(56,143,255)" }]}
          onPress={onCancel}
        >
          <Text style={styles.btnText}>Keep it </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.btn,
            { backgroundColor: "#fff", borderWidth: 1, borderColor: FONT_GREY }
          ]}
          onPress={onOk}
        >
          <Text style={[styles.btnText, { color: "#000" }]}>
            Disconnect anyway
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainCon: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    paddingTop: 16,
    margin: 16,
    borderRadius: 15
    // paddingHorizontal
    // backgroundColor
  },
  textCon: {
    paddingHorizontal: 10
  },
  headingText: {
    fontSize: 20,
    // textAlign: "center",
    color: FONT_BLACK,
    marginBottom: 16
  },
  contentTxt: {
    fontSize: 14,
    // marginHorizontal: 20,
    textAlign: "center",

    // color: FONT_GREY,
    color: FONT_BLACK,
    marginBottom: 24
  },
  btnsCon: {
    flexDirection: "column",
    alignItems: "center",
    // width: DeviceWidth - 100,
    justifyContent: "center",
    marginBottom: 6
    // height: 100
    // flex: 1
    // width: "100%",

    // backgroundColor: "red"
    // flex: 1
  },
  btnText: {
    color: "#fff",
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // paddingHorizontal: 10,
    textAlign: "center",
    fontSize: 16,
    textAlignVertical: "center"
  },
  btn: {
    borderRadius: 35,
    // flex: 1,
    width: DeviceWidth * 0.7,

    height: 50,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
    // borderWidth: 15,

    backgroundColor: PURPLE
  }
});
