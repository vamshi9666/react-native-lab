import * as React from "react";
import { View, Button, StyleSheet, Text } from "react-native";
const arr = [1, 2, 3, 4];

const { useState, useEffect } = React;
export default ({}) => {
  const [firstObj, setFirstObj] = useState(1);
  const [secondObj, setSecondObj] = useState(2);
  const [thirdObj, setThirdObj] = useState(3);
  const [fourthObj, setFourthObj] = useState(4);
  const [fifthObj, setFifthObj] = useState(5);

  const [currentInView, setCurrentInView] = useState(0);
  const goLeft = () => {
    // if (currentInView === 4)
    const nextValue = currentInView <= 0 ? 4 : currentInView - 1;
    setCurrentInView(nextValue);
  };
  const goRight = () => {
    const nextValue = currentInView >= 4 ? 0 : currentInView + 1;
    setCurrentInView(nextValue);
  };
  return (
    <View style={styles.container}>
      <View style={styles.itemsList}>
        <View
          style={{
            ...styles.box,
            marginLeft: 16,
            backgroundColor: currentInView === 0 ? "red" : "#f18f01"
          }}
        >
          <Text> 0 </Text>
          <Text
            style={{
              ...styles.dataText
            }}
          >
            {" "}
            {firstObj}{" "}
          </Text>
        </View>
        <View
          style={{
            ...styles.box,
            backgroundColor: currentInView === 1 ? "red" : "#f18f01"
          }}
        >
          <Text> 1 </Text>

          <Text style={styles.dataText}> {secondObj} </Text>
        </View>
        <View
          style={{
            ...styles.box,
            backgroundColor: currentInView === 2 ? "red" : "#f18f01"
          }}
        >
          <Text> 2 </Text>

          <Text style={styles.dataText}> {thirdObj} </Text>
        </View>
        <View
          style={{
            ...styles.box,
            backgroundColor: currentInView === 3 ? "red" : "#f18f01"
          }}
        >
          <Text> 3 </Text>

          <Text style={styles.dataText}> {fourthObj} </Text>
        </View>
        <View
          style={{
            ...styles.box,
            backgroundColor: currentInView === 4 ? "red" : "#f18f01"
          }}
        >
          <Text> 4 </Text>

          <Text style={styles.dataText}> {fifthObj} </Text>
        </View>
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

const styles = StyleSheet.create({
  btn: {
    marginRight: 46
  },
  container: {
    flex: 1,
    alignItems: "center"
  },
  itemsList: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  box: {
    width: 58,
    height: 58,
    borderRadius: 8,
    marginRight: 16,
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
