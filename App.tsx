import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Alert,
  FlatList,
  UIManager
} from "react-native";
import Animated from "react-native-reanimated";
import Highlighter from "./components/Highlighter";
import { TapGestureHandler } from "react-native-gesture-handler";
const { Value, Extrapolate, block, eq, debug, cond, interpolate } = Animated;
const { height, width } = Dimensions.get("window");
const arr = new Array(10).fill(1).map((i, index) => index + 1);
export default class App extends React.Component {
  // const [modalVisible, setModalVisible] = useState(false);
  state = {
    modalVisible: false,
    layouts: [],
    selectedIndex: null,
    selectedLayout: {
      x: 0,
      y: 0
    }
  };

  masterTranslateX = new Value(0);
  modalVisible = new Value(0);
  progress = new Value(0);
  render() {
    const { selectedIndex, layouts, selectedLayout } = this.state;
    // const selectedLayout = layouts[selectedIndex];
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <Highlighter layout={selectedLayout} />
        <TapGestureHandler
          onHandlerStateChange={e => {
            this.setState({
              selectedLayout: {
                x: e.nativeEvent.x,
                y: e.nativeEvent.y
              }
            });
          }}
        >
          <FlatList
            numColumns={3}
            contentContainerStyle={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center"
            }}
            data={arr}
            renderItem={({ index, item }) => {
              console.log(" tem is ", index);
              return (
                // onPress={e =>
                //   this.setState(
                //     {
                //       selectedIndex: index
                //     },
                //     () => {
                //       console.log(
                //         " layotus and selectedIndex is ",
                //         layouts,
                //         selectedIndex
                //       );
                //     }
                //   )
                // }

                <View
                  style={{
                    width: 200,
                    height: 200,
                    marginBottom: 20,
                    marginLeft: 16,
                    backgroundColor: "red",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Text>{index}</Text>
                </View>
              );
            }}
          />
        </TapGestureHandler>
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
    paddingVertical: 16
    // paddingBottom: 50
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
