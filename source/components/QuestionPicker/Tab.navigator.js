import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import { DeviceWidth } from "../../config/Device";

class TabNavigator extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { switchList, selectedList, currentGame } = this.props;

    return (
      <View
        style={{
          width: DeviceWidth * 0.6,
          alignSelf: "center",
          flexDirection: "row",
          backgroundColor: "rgba(255,255,255,0.3)",
          borderRadius: 15,
          height: 35,
          marginVertical: 10
        }}
      >
        <TouchableHighlight
          underlayColor={"#0000"}
          style={[
            styles.headerView,
            {
              backgroundColor:
                selectedList === 0
                  ? "rgba(255,255,255,1)"
                  : "rgba(255,255,255,0.0)",
              margin: selectedList === 0 ? 0 : 0
            }
          ]}
          onPress={() => switchList(1, currentGame)}
        >
          <Text
            style={{
              color: selectedList === 0 ? "#000" : "#fff",
              fontWeight: selectedList === 0 ? "700" : "500"
            }}
          >
            New
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={"#0000"}
          style={[
            styles.headerView,
            {
              backgroundColor:
                selectedList === 1
                  ? "rgba(255,255,255,1)"
                  : "rgba(255,255,255,0.0)",
              margin: selectedList === 1 ? 0 : 0
            }
          ]}
          onPress={() => switchList(0, currentGame)}
        >
          <Text
            style={{
              color: selectedList === 1 ? "#000" : "#fff",
              fontWeight: selectedList === 1 ? "700" : "500"
            }}
          >
            Favourites
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerView: {
    width: DeviceWidth * 0.3,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15
  }
});

export default TabNavigator;
