import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import { DeviceWidth } from "../../config/Device";

class GifTabNavigator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keywords: ["Trending", "New", "Fun"]
    };
  }

  render() {
    let { switchList, selectedList } = this.props;
    let { keywords } = this.state;

    return (
      <View
        style={{
          width: DeviceWidth * 0.84,
          alignSelf: "center",
          flexDirection: "row",
          backgroundColor: "rgba(255,255,255,0.3)",
          borderRadius: 15,
          height: 35,
          marginVertical: 10
        }}
      >
        {keywords.map((keyName, key) => (
          <TouchableHighlight
            key={key}
            underlayColor={"#0000"}
            style={[
              styles.headerView,
              {
                backgroundColor:
                  selectedList === key
                    ? "rgba(255,255,255,1)"
                    : "rgba(255,255,255,0.0)"
              }
            ]}
            onPress={() => switchList(key)}
          >
            <Text
              style={{
                color: selectedList === key ? "#000" : "#fff",
                fontWeight: selectedList === key ? "700" : "200"
              }}
            >
              {keyName}
            </Text>
          </TouchableHighlight>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerView: {
    width: DeviceWidth * 0.28333,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15
  }
});

export default GifTabNavigator;
