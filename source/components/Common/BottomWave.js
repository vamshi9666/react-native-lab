import React from "react";

import { Image, View } from "react-native";
import { DeviceWidth } from "../../config/Device";

export default ({ source, renderRight }) => {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        height: 200,
        width: DeviceWidth,
        justifyContent: "center"
      }}
    >
      <Image
        style={{
          position: "absolute",

          transform: [
            {
              translateX: -40
            },
            {
              translateY: 80
            }
          ]
        }}
        source={source}
        resizeMode="contain"
      />
      {renderRight()}
    </View>
  );
};
