import React, { Component } from "react";
import { ActivityIndicator, View } from "react-native";
import { View as AnimatableView } from "react-native-animatable";
import SvgUri from "react-native-svg-uri";
import { GAME_LOGOS } from "../../config/Constants";
import MediumText from "../Texts/MediumText";
import VerticalGradientView from "../Views/VerticalGradientView";

const animationConfig = {
  0: {
    transform: [
      {
        scale: 1
      }
    ]
  },
  0.25: {
    transform: [
      {
        scale: 1.0125
      }
    ]
  },
  0.5: {
    transform: [
      {
        scale: 1.025
      }
    ]
  },
  0.75: {
    transform: [
      {
        scale: 1.0125
      }
    ]
  },
  1: {
    transform: [
      {
        scale: 1
      }
    ]
  }
};

class GameContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  cardRef = React.createRef();

  measure = async () =>
    new Promise(resolve =>
      this.cardRef.current.measureInWindow((x, y, width, height) => {
        resolve({ x, y, width, height });
      })
    );

  render() {
    let {
      colors,
      height,
      width,
      gameName,
      gameValue,
      fromMyProfile,
      style,
      showLoading,
      fromPresetModal
    } = this.props;

    const isNHIE = gameValue === "NEVER_HAVE_I_EVER";

    return (
      // <AnimatableView
      //   // iterationCount={"infinite"}
      //   animation={animationConfig}
      //   duration={1800}
      // >
      <View
        ref={this.cardRef}
        style={{
          height: height,
          width: width,
          borderRadius: 9,
          alignItems: "center",
          justifyContent: "space-evenly",
          margin: 5,
          ...style
        }}
      >
        {showLoading ? (
          <View
            style={{
              height: height,
              width: width,
              borderRadius: 9,
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              zIndex: 2,
              opacity: 0.2,
              backgroundColor: "#000"
            }}
            colors={colors}
          >
            <ActivityIndicator color={"#fff"} siz={"large"} />
          </View>
        ) : null}
        <VerticalGradientView
          style={{
            height: height,
            width: width,
            borderRadius: 9,
            alignItems: "center",
            justifyContent: "space-evenly"
          }}
          colors={colors}
        >
          <View
            style={{
              transform: [
                {
                  translateY: 0
                }
              ]
            }}
          >
            <SvgUri
              height={isNHIE ? height / 1.85 : height / 2.25}
              width={isNHIE ? height / 1.85 : height / 2.25}
              source={GAME_LOGOS[gameValue]}
            />
          </View>

          <MediumText
            style={{
              color: "#fff",
              paddingHorizontal: 5,
              fontSize: fromPresetModal ? 10 : 14,
              transform: [
                {
                  translateY: fromMyProfile
                    ? isNHIE
                      ? -5
                      : 0
                    : isNHIE
                    ? height * 0.075 - 6
                    : height * 0.075
                }
              ]
            }}
          >
            {gameName}
          </MediumText>
        </VerticalGradientView>
      </View>
      // </AnimatableView>
    );
  }
}

export default GameContainer;
