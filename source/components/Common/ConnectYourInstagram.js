import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  FONT_BLACK,
  FONT_GREY,
  WHITE,
  PURPLE,
  INSTA_GRAD_0,
  INSTA_GRAD_1,
  INSTA_GRAD_2
} from "../../config/Colors";
import MediumText from "../Texts/MediumText";
import HorizontalGradiant from "../Views/HorizontalGradientView";
import RegularText from "../Texts/RegularText";
import { LEFT_MARGIN } from "../../config/Constants";
// import {  } from "../Texts/";
export default ({ onClick, ...props }) => {
  return (
    <View style={styles.mainCon}>
      <HorizontalGradiant
        style={styles.btn}
        colors={[INSTA_GRAD_0, INSTA_GRAD_1, INSTA_GRAD_2]}
      >
        <TouchableOpacity
          onPress={onClick}
          style={{ justifyContent: "center", alignItems: "center" }}
          activeOpacity={0.7}
        >
          <MediumText style={styles.btnText}>Connect your Instagram</MediumText>
        </TouchableOpacity>
      </HorizontalGradiant>
      {/* <RegularText style={styles.mainText}>
        Connect Your Instagram to check
      </RegularText> */}
    </View>
  );
};

const styles = StyleSheet.create({
  mainCon: {
    backgroundColor: "#fff",
    alignItems: "center",
    marginTop: LEFT_MARGIN
  },
  mainText: {
    color: FONT_GREY,
    fontSize: 16,
    paddingHorizontal: 10,
    textAlign: "center",
    marginBottom: 10
  },
  btn: {
    marginBottom: 10,
    borderRadius: 25,
    backgroundColor: PURPLE,
    justifyContent: "center",
    alignItems: "center"
  },
  btnText: {
    fontSize: 18,
    color: WHITE,
    paddingVertical: 12,
    paddingHorizontal: 32
  }
});
