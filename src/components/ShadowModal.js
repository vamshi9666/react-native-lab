import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { Modal, View, StyleSheet, Dimensions, Text } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Interactable from "react-native-reanimated/";
import Animated, { Easing } from "react-native-reanimated";
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
  const opacity = new Value(0);
  const modalY = new Value(-sHeight);
  const show = new Value(visible ? 1 : 0);
  const gState = new Value(-1);
  const dragY = new Value(0);
  const up = new Value(0);
  const {
    gestureEvent,
    state,
    translationY,
    velocityY
  } = verticalPanGestureHandler();

  const translateY = cond(gState, State.ACTIVE, [translationY], 200);
  useCode(
    block([
      cond(
        visible,
        [
          set(
            opacity,
            timing({
              from: 0,
              to: 0.8,
              duration,
              easing
            })
          ),
          set(
            modalY,
            timing({
              from: sHeight,
              to: 0,
              duration,
              easing
            })
          )
        ],

        [
          set(
            opacity,
            timing({
              from: 0.8,
              to: 0,
              duration,
              easing
            })
          ),
          set(
            modalY,
            timing({
              from: 0,
              to: sHeight,
              duration,
              easing
            })
          )
          //   ],
          //   [debug("up value is ", up)]
          // )
        ]
      )
      // []
      // )
    ]),
    [visible]
  );
  return (
    <>
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: "#000",
          opacity
        }}
      >
        <PanGestureHandler {...gestureEvent}>
          <Animated.View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: "white",
              flex: 1,
              top: 100,
              bottom: 100,
              right: 30,
              left: 30,
              padding: 64,
              justifyContent: "center",
              alignItems: "center",
              transform: [{ translateY: modalY }]
            }}
          >
            <Text>hey show me on top </Text>

            <TouchableOpacity
              style={{
                backgroundColor: "#B51CBA",
                paddingHorizontal: 20,
                paddingVertical: 16
              }}
              onPress={() => setModalVisible(false)}
            >
              <Text>Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </>
  );
};
