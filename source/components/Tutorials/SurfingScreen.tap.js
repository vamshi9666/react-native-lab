import React, { Component } from "react";
import { View, StyleSheet, Image } from "react-native";
import { DeviceWidth, DeviceHeight } from "../../../src/config/Device";
import { LEFT_MARGIN } from "../../config/Constants";
import RowView from "../Views/RowView";
import SvgUri from "react-native-svg-uri";
import NoFeedbackTapView from "../Views/NoFeedbackTapView";
import JustifiedCenteredView from "../Views/JustifiedCenteredView";
import RegularText from "../Texts/RegularText";
import VerticalGradientView from "../Views/VerticalGradientView";
import { LIGHT_PURPLE, PURPLE } from "../../config/Colors";
import { sharedStyles } from "../../styles/Shared";
import MediumText from "../Texts/MediumText";
import Animated from "react-native-reanimated";
import { runRepeatedTiming } from "../../config/Animations";

class SurfingScreenTap extends Component {
  animation = new Animated.Value(20);
  initialValue = new Animated.Value(0);

  render() {
    const {
      reactButtonPosition,
      setTapTutorialVisibility,
      onTappingTutorialReactButton
    } = this.props;

    return (
      <NoFeedbackTapView
        onPressIn={setTapTutorialVisibility}
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.8)",
          zIndex: 2,
          ...StyleSheet.absoluteFillObject
        }}
      >
        <View
          style={{
            position: "absolute",
            position: "absolute",
            right: DeviceWidth * 0.2,
            bottom: DeviceHeight * 0.4,
            ...sharedStyles.justifiedCenter
          }}
        >
          <MediumText
            style={{
              color: "#fff",
              fontSize: 16,
              textAlign: "center",
              marginVertical: 7.5
            }}
          >
            Tap to react
          </MediumText>
        </View>

        <View
          style={{
            position: "absolute",
            right: DeviceWidth * 0.2,
            bottom: DeviceHeight * 0.265
          }}
        >
          <Animated.View
            style={{
              transform: [
                { rotate: "180deg" },
                {
                  translateY: Animated.sub(
                    0,
                    runRepeatedTiming(this.initialValue, this.animation, 1000)
                  )
                }
              ]
            }}
          >
            <SvgUri
              height={70}
              width={70}
              source={require("../../assets/svgs/Tutorials/clicking.svg")}
            />
          </Animated.View>
        </View>

        <NoFeedbackTapView
          onPress={onTappingTutorialReactButton}
          style={{
            position: "absolute",
            right: DeviceWidth * 0.15,
            bottom: DeviceHeight * 0.18
          }}
        >
          <VerticalGradientView
            colors={[LIGHT_PURPLE, PURPLE]}
            style={{
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              flexDirection: "row"
            }}
          >
            <View
              style={{
                paddingLeft: 25
              }}
            >
              <SvgUri
                width={15}
                height={15}
                source={require("../../assets/finalSvgs/paperPlane.svg")}
              />
            </View>
            <RegularText style={styles.reactButtonText}>React</RegularText>
          </VerticalGradientView>
        </NoFeedbackTapView>
      </NoFeedbackTapView>
    );
  }
}

const styles = StyleSheet.create({
  reactButtonText: {
    color: "#fff",
    paddingVertical: 8,
    paddingLeft: 10,
    paddingRight: 30,
    fontSize: 18
  }
});

export default SurfingScreenTap;
