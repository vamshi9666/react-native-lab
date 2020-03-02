import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  StatusBar,
  Dimensions,
  Alert
} from "react-native";
import ReModal from "./components/ReModal";
import Animated from "react-native-reanimated";
import ReOneStepCaurosel from "./components/ReOneStepCaurosel";
import CloneCaurosel from "./components/CloneCaurousel";
import VirtualCaurosel from "./components/VirtualCaurosel";

const { Value, Extrapolate, block, eq, debug, cond, interpolate } = Animated;
const { height, width: w } = Dimensions.get("window");
const width = w * 0.7;
const arr = new Array(30).fill(1).map((i, index) => index + 1);
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
        <StatusBar hidden />
        <ReOneStepCaurosel
          startIndex={2}
          data={arr}
          onItemSnapped={({ newIndex: index, direction, goBack }) => {
            // console.log(" snapped to ", index, direction);
            // alert(" snapped to " + index + " " + direction);
          }}
          availablePrevCard={1}
          lazyLoad={true}
          renderItem={({ item, index: i }) => (
            <View
              style={{
                width: width - 32,
                height: height * 0.8,
                marginHorizontal: 16,
                backgroundColor: "#E6172E",
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
                ...styles.showdowStyles
              }}
            >
              <Text
                style={{
                  fontSize: 40,
                  textAlign: "center"
                }}
              >
                {item}
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
  },
  showdowStyles: {
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 20
  }
});
