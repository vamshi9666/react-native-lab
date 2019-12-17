import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity } from "react-native";
import {
  Modal,
  View,
  StyleSheet,
  Dimensions,
  Text,
  Button
} from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Interactable from "../../Interactable";
import Animated, {
  Easing,
  Transitioning,
  Transition
} from "react-native-reanimated";
import { timing, verticalPanGestureHandler } from "react-native-redash";
const { width: hWidth, height: sHeight } = Dimensions.get("window");
const easing = Easing.inOut(Easing.ease);
const duration = 400;
const {
  Value,
  set,
  block,
  cond,
  eq,
  debug,
  event,
  Clock,
  useCode,
  and,
  clockRunning,
  startClock,
  stopClock
} = Animated;
export default ({ visible, children, setModalVisible }) => {
  const ref = useRef();
  const [showText, setShowText] = useState(true);
  const transition = (
    <Transition.Sequence>
      <Transition.Out type="scale" />
      <Transition.Change interpolation="easeInOut" />
      <Transition.In type="fade" />
    </Transition.Sequence>
  );
  return (
    <View
      style={{
        flex: 1,

        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Transitioning.View
        ref={ref}
        transition={transition}
        style={{
          flex: 1,

          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Button
          title="show or hide"
          color="#FF5252"
          onPress={() => {
            ref.current.animateNextTransition();
            setShowText(!showText);
          }}
        />
        {showText && (
          <Text style={{ fontSize: 16, margin: 10 }}>
            Tap the above button to hide me
          </Text>
        )}
      </Transitioning.View>
    </View>
  );
};
