//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { WHITE } from "../../config/Colors";
import SvgUri from "react-native-svg-uri";
import RegularText from "../Texts/RegularText";
import BoldText from "../Texts/BoldText";
import AntIcon from "react-native-vector-icons/AntDesign";
// create a component
class StarPopUp extends Component {
  render() {
    const { isFriends = true } = this.props;
    const triangleTranslate = -6;
    return (
      <View
        style={[
          styles.container,
          {
            paddingBottom: isFriends ? 20 : 4,
            paddingHorizontal: isFriends ? 28 : 20
          }
        ]}
      >
        <View
          style={{
            width: 20,
            height: 20,
            backgroundColor: "#fff",
            position: "absolute",
            borderRadius: 3,

            top: 0,
            right: 40,
            transform: [
              { rotate: "45deg" },
              { translateY: triangleTranslate },
              { translateX: -5 }
            ]
          }}
        />
        <SvgUri
          width={48}
          style={{
            marginBottom: 10
            // marginTop: 24
          }}
          height={48}
          source={require("../../assets/svgs/Chat/star.svg")}
        />
        <RegularText
          style={{
            fontSize: 20,
            textAlign: "center",
            marginBottom: 10
          }}
        >
          Level 3{" "}
        </RegularText>
        {isFriends ? (
          <>
            <View
              style={{
                marginBottom: 10,
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <AntIcon
                style={{ marginRight: 6 }}
                size={16}
                color={"#6074f9"}
                name={"clockcircleo"}
              />
              <RegularText>3hr 45 min</RegularText>
            </View>
            <BoldText
              style={{
                textAlign: "center",
                color: "#6074f9",
                marginBottom: 2,
                fontWeight: "600"
              }}
            >
              Common time spent
            </BoldText>
          </>
        ) : (
          <View
            style={{
              marginBottom: 10,
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: 3
              //   marginHorizontal: 16
            }}
          >
            <RegularText
              style={{ textAlign: "center", color: "#6074f9", maxWidth: 150 }}
            >
              Based on common time {"\n"}spent on chat
            </RegularText>
          </View>
        )}
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 50,

    top: 85,
    // height: 130,
    // width: 180,
    zIndex: 21,
    backgroundColor: WHITE,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",

    paddingVertical: 16
  }
});

//make this component available to the app
export default StarPopUp;
