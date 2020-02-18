import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import ModalCurvedcard from "../Views/Modal.curvedcard";
import { DeviceWidth } from "../../config/Device";
import Swiper from "react-native-swiper";
import CircularImage from "../Views/CircularImage";
import MediumText from "../Texts/MediumText";
import BoldText from "../Texts/BoldText";
import { FONT_BLACK, PURPLE, LIGHT_PURPLE } from "../../config/Colors";
import { gemPlanColors } from "../../config/Constants";
import { DeviceHeight } from "../../../src/config/Device";
import NoFeedbackTapView from "../Views/NoFeedbackTapView";
import VerticalGradientView from "../Views/VerticalGradientView";
import { sharedStyles } from "../../styles/Shared";
import { CachedImage } from "react-native-img-cache";
import SvgUri from "react-native-svg-uri";

const modalContents = {
  Sparks: {
    name: "Spark",
    icon: require("../../../source/assets/svgs/spark.png"),
    content: [
      "Tell them if you find them\n interesting!",
      "Stay on top of their list!",
      "You get 1 free Spark a day!"
    ],
    isImage: true
  },
  Extensions: {
    name: "24 Hours Extension",
    icon: require("../../assets/svgs/GemsFlow/extension.svg"),
    content: [
      "Extend time to get closer!",
      "Increase your chances\n of connecting!",
      "You get 1 free extension a day!"
    ],
    isImage: false
  },
  MoreContent: {
    name: "More Content",
    icon: require("../../assets/svgs/GemsFlow/refresh.svg"),
    content: [
      "Get new content everyday!",
      "Make your profile interesting!",
      "You get 1 free refresh access\n for each game in a day!"
    ],
    isImage: false
  },
  StepBack: {
    name: "Step Back",
    icon: require("../../assets/svgs/GemsFlow/stepback.svg"),
    content: [
      "We encourage you to move\n forward!",
      "This would cost you 5 Gems"
    ],
    isImage: false
  }
};

class OneTimeMonetisationTutorial extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { useNow, useLater, name } = this.props;
    const currentModalContent = modalContents[name];
    return (
      <ModalCurvedcard style={styles.baseLayout}>
        <VerticalGradientView
          style={{
            width: DeviceWidth * 0.8,
            height: DeviceHeight * 0.48,
            borderRadius: 20,
            alignItems: "center",
            paddingTop: 10
          }}
          colors={gemPlanColors[name]}
        >
          <View style={styles.shadowView}>
            <View style={styles.iconView}>
              {currentModalContent.isImage ? (
                <CachedImage
                  style={{ height: 30, width: 30 }}
                  source={currentModalContent.icon}
                />
              ) : (
                <SvgUri
                  height={30}
                  width={30}
                  source={currentModalContent.icon}
                />
              )}
            </View>
            <BoldText style={styles.sparkText}>
              {currentModalContent.name}
            </BoldText>
          </View>

          <Swiper
            width={DeviceWidth}
            activeDotColor={gemPlanColors[name][0]}
            paginEnabled
            showsPagination
            style={styles.wrapper}
            loop={false}
            autoplay
            dotStyle={{
              transform: [{ translateY: -10 }]
            }}
            activeDotStyle={{
              transform: [{ translateY: -10 }]
            }}
          >
            {currentModalContent.content.map(content => (
              <View
                key={content}
                style={{
                  height: 50,
                  width: DeviceWidth,
                  ...sharedStyles.justifiedCenter
                }}
              >
                <MediumText style={styles.textContent}>{content}</MediumText>
              </View>
            ))}
          </Swiper>
          <NoFeedbackTapView
            style={{
              transform: [
                {
                  translateY: -10
                }
              ],
              backgroundColor: gemPlanColors[name][0],
              ...styles.buttonStyle
            }}
            onPress={useNow}
          >
            <MediumText style={{ color: "#fff", ...styles.buttonText }}>
              Use now
            </MediumText>
          </NoFeedbackTapView>
          <NoFeedbackTapView
            style={{ transform: [{ translateY: -8 }] }}
            onPress={useLater}
          >
            <MediumText style={{ color: FONT_BLACK, ...styles.buttonText }}>
              Use later
            </MediumText>
          </NoFeedbackTapView>
        </VerticalGradientView>
      </ModalCurvedcard>
    );
  }
}

const styles = StyleSheet.create({
  textContent: {
    textAlign: "center",
    fontSize: 18,
    color: FONT_BLACK,
    transform: [
      {
        translateY: 30
      }
    ],
    lineHeight: 22
  },
  sparkText: {
    color: "#fff", // FONT_BLACK,
    fontSize: 23,
    textAlign: "center",
    marginBottom: 10
  },
  iconView: {
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 25,
    height: 50,
    alignSelf: "center",
    width: 50,
    ...sharedStyles.justifiedCenter
  },
  shadowView: {
    shadowColor: "#000000A0",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 3
    }
  },
  baseLayout: {
    width: DeviceWidth * 0.8,
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    height: DeviceHeight * 0.48,
    padding: 0
  },
  buttonText: {
    paddingVertical: 10,
    fontSize: 18,
    paddingHorizontal: 20
  },
  buttonStyle: {
    borderRadius: 30,
    height: 40,
    ...sharedStyles.justifiedCenter
  }
});

export default OneTimeMonetisationTutorial;
