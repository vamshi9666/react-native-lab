import React from "react";
import { Image, TouchableOpacity, Text } from "react-native";
import { greyTheme, FONT_GREY } from "../../config/Colors";

export default ({ action }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.4}
      onPress={action}
      style={{ flexDirection: "row", alignItems: "center" }}
    >
      <Image
        style={{ width: 24 }}
        resizeMode={"contain"}
        source={require("../../assets/images/india.png")}
      />
      <Text
        style={{
          fontSize: 20,
          fontWeight: "600",
          color: FONT_GREY,
          marginHorizontal: 10
        }}
      >
        + 91{" "}
      </Text>
    </TouchableOpacity>
  );
};
