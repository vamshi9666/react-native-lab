import React from "react";
import { View, StyleSheet } from "react-native";
import RegularText from "../Texts/RegularText";
import { FONT_GREY } from "../../config/Colors";
import AntIcon from "react-native-vector-icons/AntDesign";
import { DeviceWidth } from "../../config/Device";
export default ({}) => {
  return (
    <View style={styles.mainCon}>
      <View style={styles.cardsCon}>
        <View style={styles.card}>
          <AntIcon name="plus" size={32} color={FONT_GREY} />
        </View>
        <View style={styles.card}>
          <AntIcon name="plus" size={32} color={FONT_GREY} />
        </View>
        <View style={[styles.card, { marginRight: 0 }]}>
          <AntIcon name="plus" size={32} color={FONT_GREY} />
        </View>
      </View>
      <RegularText style={styles.content}>
        Connecting your Instagram will add your latest posts to your profile.
        Your username won’t be visible.
      </RegularText>
    </View>
  );
};
const styles = StyleSheet.create({
  mainCon: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
    flex: 1,
    alignSelf: "center",

    // backgroundColor: "red",
    width: DeviceWidth * 0.8,
    justifyContent: "space-between"
  },
  cardsCon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    flex: 1
  },
  content: {
    fontSize: 14,
    color: FONT_GREY,
    textAlign: "center"
  },
  card: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    // width: DeviceWidth * 0.2,
    flex: 1,
    borderRadius: 15,

    aspectRatio: 1,
    backgroundColor: "rgb(242,243,246)"
    // backgroundColor: "green"
  }
});
