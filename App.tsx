import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Dimensions,
  Alert
} from "react-native";
import ReModal from "./components/ReModal";
import Animated from "react-native-reanimated";
import ReCaurosel from "./components/ReCaurosel";
const { Value, Extrapolate, block, eq, debug, cond, interpolate } = Animated;

const { height, width } = Dimensions.get("window");
export default class App extends React.Component {
  // const [modalVisible, setModalVisible] = useState(false);
  state = {
    modalVisible: false
  };
  masterTranslateX = new Value(0);
  modalVisible = new Value(0);
  progress = new Value(0);
  render() {
    const { modalVisible } = this;
    // const { modalVisible } = this.state;
    const { progress } = this;
    return (
      <View style={styles.container}>
        <ReCaurosel
          data={new Array(20).fill(1)}
          onItemSnapped={({ newIndex: index, direction, goBack }) => {
            console.log(" snapped to ", index, direction);
            alert(" snapped to " + index + " " + direction);
          }}
          availablePrevCard={1}
          lazyLoad={true}
          renderItem={({ item, index: i }) => (
            <View
              style={{
                width: width - 32,
                height: height * 0.8,
                marginHorizontal: 16,
                backgroundColor: "red",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text
                style={{
                  fontSize: 40,
                  textAlign: "center"
                }}
              >
                {i}{" "}
              </Text>
            </View>
          )}
          callBack={({
            oldIndex,
            newIndex,
            continue: continueAnimation,
            renable
          }) => {
            Alert.alert(
              " Go Back ",
              " Are you sure to go from " +
                String(oldIndex) +
                " to " +
                String(newIndex),
              [
                {
                  text: "yes",
                  onPress: () => {
                    continueAnimation();
                    renable();
                  }
                },
                {
                  text: "No",
                  onPress: () => {
                    alert(" bad luck ");
                    renable();
                  }
                }
              ]
            );
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 50
  },
  scrollContainer: {
    flexDirection: "row",
    alignItems: "center"
  }
});
