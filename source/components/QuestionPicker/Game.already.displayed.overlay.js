import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import VerticalGradientView from "../Views/VerticalGradientView";
import SvgUri from "react-native-svg-uri";
import MediumText from "../Texts/MediumText";
import { GAME_LOGOS_COLORFUL } from "../../config/Constants";
import { FONT_BLACK } from "../../config/Colors";
import MaskedView from "@react-native-community/masked-view";
import RegularText from "../Texts/RegularText";
import { connect } from "react-redux";
import Animated from "react-native-reanimated";
import { DeviceHeight, DeviceWidth } from "../../config/Device";
import { sharedStyles } from "../../styles/Shared";

class GameAlreadyDisplayedOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    const { props } = this;
    return (
      props.selectedGame !== nextProps.selectedGame ||
      props.myData.posts !== nextProps.myData.posts
    );
  };

  render() {
    const {
      item,
      selectedGame,
      myData,
      closeAndOpenQuestionPicker
    } = this.props;
    let cardIndex = undefined;
    if (myData.posts && myData.posts.length > 0) {
      cardIndex = myData.posts.indexOf(item._id);
    }

    var showOpacity = cardIndex > -1 && selectedGame !== item.value;

    return (
      <>
        {showOpacity ? (
          <VerticalGradientView
            colors={[item.colors[0] + "f0", item.colors[1] + "f0"]}
            style={{
              position: "absolute",
              zIndex: 10,
              backgroundColor: "#0000",
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              height: DeviceHeight * 0.9,
              width: DeviceWidth * 0.9,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <View
              style={{
                width: DeviceWidth * 0.85,
                paddingVertical: 25,
                ...sharedStyles.justifiedCenter,
                backgroundColor: "#fff",
                borderRadius: 20
              }}
            >
              <View
                style={{
                  transform: [
                    {
                      translateY: -10
                    }
                  ]
                }}
              >
                <SvgUri
                  height={
                    item.value === "WOULD_YOU_RATHER"
                      ? 60
                      : item.value === "NEVER_HAVE_I_EVER"
                      ? 90
                      : 75
                  }
                  width={
                    item.value === "WOULD_YOU_RATHER"
                      ? 60
                      : item.value === "NEVER_HAVE_I_EVER"
                      ? 90
                      : 75
                  }
                  source={GAME_LOGOS_COLORFUL[item.value]}
                />
              </View>
              <MediumText
                style={{
                  color: FONT_BLACK,
                  fontSize: 20,
                  textAlign: "center"
                }}
              >
                {item.key}
              </MediumText>
              <MaskedView
                style={{
                  width: "100%"
                }}
                maskElement={
                  <RegularText
                    style={{
                      ...styles.fadingText,
                      transform: [
                        {
                          translateY: 10
                        }
                      ]
                    }}
                  >
                    Already being displayed as CARD {cardIndex + 1}
                  </RegularText>
                }
              >
                <Animated.View
                  style={{
                    width: Animated.concat(this.animatedBackGroundWidth, "%"),
                    backgroundColor: FONT_BLACK,
                    height: 30
                  }}
                />
              </MaskedView>

              <TouchableOpacity
                onPress={() => closeAndOpenQuestionPicker(cardIndex)}
                style={{
                  height: 40,
                  width: 100,
                  borderRadius: 30,
                  borderWidth: 1,
                  marginBottom: 10,
                  transform: [
                    {
                      translateY: 15
                    }
                  ],
                  borderColor: item.colors[1],
                  backgroundColor: "#0000",
                  marginTop: 20,
                  ...sharedStyles.justifiedCenter
                }}
              >
                <MediumText style={{ color: item.colors[1], fontSize: 16 }}>
                  View
                </MediumText>
              </TouchableOpacity>
              <View style={styles.activeBadge}>
                <RegularText style={styles.activeText}>Active</RegularText>
              </View>
            </View>
          </VerticalGradientView>
        ) : (
          <View />
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  activeText: {
    color: "#fff",
    fontSize: 14,
    paddingHorizontal: 10
  },
  activeBadge: {
    paddingVertical: 5,

    backgroundColor: "#FF2D55",
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 15,
    top: 0,
    left: 0,
    position: "absolute",
    ...sharedStyles.justifiedCenter
  },
  fadingText: {
    color: FONT_BLACK,
    fontSize: 15,
    paddingHorizontal: 5,
    textAlign: "center",
    fontFamily: "Proxima Nova",
    transform: [
      {
        translateY: 20
      }
    ]
  }
});

const mapState = state => {
  return {
    myData: state.info.userInfo || {}
  };
};

const mapDispatch = dispatch => {
  return {};
};
export default connect(mapState, mapDispatch)(GameAlreadyDisplayedOverlay);
