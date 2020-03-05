import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Transition, Transitioning } from "react-native-reanimated";
import { shuffle, random } from "lodash";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
const transition = (
  <Transition.Sequence>
    <Transition.Change durationMs={500} interpolation={"easeInOut"} />
    <Transition.Together>
      <Transition.Out
        durationMs={500}
        interpolation={"easeInOut"}
        type={"scale"}
      />
    </Transition.Together>
    <Transition.In
      durationMs={500}
      interpolation={"easeInOut"}
      type={"scale"}
    />
  </Transition.Sequence>
);

const data = new Array(3).fill(1).map((_, i) => i);

export default ({}) => {
  const ref = useRef();
  const [list, setList] = useState(data);
  return (
    <View style={styles.container}>
      <Transitioning.View
        ref={ref}
        transition={transition}
        style={{ flexDirection: "row" }}
      >
        {list.map((i, index) => (
          <View
            key={i}
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: 110,
              height: 180,
              borderRadius: 20,
              marginLeft: index === 0 ? 16 : 0,
              marginRight: 16,
              backgroundColor:
                i % 2 === 0 ? "red" : i % 3 === 0 ? "green" : "yellow"
            }}
          >
            <Text>{i}</Text>
          </View>
        ))}
      </Transitioning.View>
      <Button
        title={"shuffle"}
        onPress={() => {
          const newList = shuffle(list);
          ref.current.animateNextTransition();
          setList(newList);
        }}
      />
      <Button
        title={"exchange"}
        onPress={() => {
          const newList = Object.assign([], list);
          newList.pop();
          newList.push(Math.round(Math.random() * 10));

          ref.current.animateNextTransition();
          setList(newList);
        }}
      />
    </View>
  );
};
