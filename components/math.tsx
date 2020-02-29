import * as React from "react";
import { View, Button, StyleSheet, Text, Dimensions } from "react-native";
import A from "react-native-reanimated";
const arr = [1, 2, 3, 4];
const { Value, add, sub } = A;

const { useState, useEffect } = React;
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  btn: {
    marginRight: 46
  },
  container: {
    flex: 1,
    ...StyleSheet.absoluteFillObject
    // backgroundColor: "green",
    // justifyContent: "center",
    // alignItems: "center"
  },

  itemsList: {
    width: width,
    height: height * 0.8,
    // ...StyleSheet.absoluteFillObject,
    left: 62,
    padding: 4,
    flexDirection: "row",
    // backgroundColor: "red",
    // justifyContent: "center",
    alignItems: "center"
  },
  box: {
    position: "absolute",
    width: 58,
    height: 58,
    borderRadius: 8,
    // marginRight: 16,
    backgroundColor: "#f18f01",
    // justifyContent: "center",
    alignItems: "center"
  },
  dataText: {
    fontSize: 24,
    fontWeight: "bold"
  },
  btnContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row"
  }
});
// const firstposition =
export default ({}) => {
  const [firstObj, setFirstObj] = useState(1);
  const [secondObj, setSecondObj] = useState(2);
  const [thirdObj, setThirdObj] = useState(3);
  const [fourthObj, setFourthObj] = useState(4);
  const [fifthObj, setFifthObj] = useState(5);
  const gap = 62;
  const firstX = new Value(0 * gap);
  const secondX = new Value(1 * gap);
  const thirdX = new Value(2 * gap);
  const fourthX = new Value(3 * gap);
  const fifthX = new Value(4 * gap);
  const [currentObj, setCurrentObj] = useState(2);

  const [currentInView, setCurrentInView] = useState(2);
  const goLeft = () => {
    if (currentObj === 0) {
      return;
    }
    const incrimentStep = currentObj + 1 - 3;

    if (currentInView === 2) {
      // firstX.setValue(100);
      // secondX.setValue(add(secondX, gap));
      // thirdX.setValue(add(thirdX, gap));
      // fourthX.setValue(add(fourthX, gap));
      // fifthX.setValue(0);
      setFifthObj(incrimentStep);
    }
    if (currentInView === 3) {
      setFirstObj(incrimentStep);
    }
    if (currentInView === 4) {
      setSecondObj(incrimentStep);
    }
    if (currentInView === 0) {
      // alert(incrimentStep);
      setThirdObj(incrimentStep);
    }
    if (currentInView === 1) {
      setFourthObj(incrimentStep);
    }
    const nextValue = currentInView <= 0 ? 4 : currentInView - 1;
    setCurrentInView(nextValue);
    setCurrentObj(currentObj - 1);
    // if (currentInView === 4)
    // const nextValue = currentInView <= 0 ? 4 : currentInView - 1;
    // setCurrentInView(nextValue);
  };
  const goRight = () => {
    // alert(currentInView);
    if (currentObj === 19) {
      return;
    }
    const incrimentStep = currentObj + 1 + 3;
    if (currentInView === 2) {
      setFirstObj(incrimentStep);
    }
    if (currentInView === 3) {
      setSecondObj(incrimentStep);
    }
    if (currentInView === 4) {
      setThirdObj(incrimentStep);
    }
    if (currentInView === 0) {
      // alert(incrimentStep);
      setFourthObj(incrimentStep);
    }
    if (currentInView === 1) {
      setFifthObj(incrimentStep);
    }
    const nextValue = currentInView >= 4 ? 0 : currentInView + 1;
    setCurrentInView(nextValue);
    setCurrentObj(currentObj + 1);
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          width,
          height: height * 0.7,
          backgroundColor: "green"
          // alignItems: "center"
        }}
      >
        <A.View
          style={{
            ...styles.box,
            alignItems: "center",
            // justifyContent: "center",
            marginLeft: 16,
            marginTop: 16,
            backgroundColor: currentInView === 0 ? "red" : "blue",
            transform: [{ translateX: firstX }]
          }}
        >
          <Text
            style={{
              marginBottom: 8
            }}
          >
            0
          </Text>

          <Text style={{ fontSize: 24 }}>{firstObj}</Text>
        </A.View>
        <A.View
          style={{
            ...styles.box,
            alignItems: "center",
            // justifyContent: "center",
            marginLeft: 16,
            marginTop: 16,
            backgroundColor: currentInView === 1 ? "red" : "blue",
            transform: [{ translateX: secondX }]
          }}
        >
          <Text
            style={{
              marginBottom: 8
            }}
          >
            {" "}
            1
          </Text>

          <Text style={{ fontSize: 24 }}>{secondObj}</Text>
        </A.View>
        <A.View
          style={{
            ...styles.box,
            alignItems: "center",
            // justifyContent: "center",
            marginLeft: 16,
            marginTop: 16,
            backgroundColor: currentInView === 2 ? "red" : "blue",
            transform: [{ translateX: thirdX }]
          }}
        >
          <Text
            style={{
              marginBottom: 8
            }}
          >
            2
          </Text>

          <Text style={{ fontSize: 24 }}>{thirdObj}</Text>
        </A.View>
        <A.View
          style={{
            ...styles.box,
            alignItems: "center",
            // justifyContent: "center",
            marginLeft: 16,
            marginTop: 16,
            backgroundColor: currentInView === 3 ? "red" : "blue",
            transform: [{ translateX: fourthX }]
          }}
        >
          <Text
            style={{
              marginBottom: 8
            }}
          >
            3
          </Text>

          <Text style={{ fontSize: 24 }}>{fourthObj}</Text>
        </A.View>
        <A.View
          style={{
            ...styles.box,
            alignItems: "center",
            // justifyContent: "center",
            marginLeft: 16,
            marginTop: 16,
            backgroundColor: currentInView === 4 ? "red" : "blue",
            transform: [{ translateX: fifthX }]
          }}
        >
          <Text
            style={{
              marginBottom: 8
            }}
          >
            4
          </Text>

          <Text style={{ fontSize: 24 }}>{fifthObj}</Text>
        </A.View>
      </View>
      <Text>{currentInView}</Text>
      <View style={styles.btnContainer}>
        <Button
          style={styles.btn}
          title={"no left"}
          onPress={goLeft}
          color={"red"}
        />
        <Button style={styles.btn} title={"no right"} onPress={goRight} />
      </View>
    </View>
  );
};
