import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import JustifiedCenteredView from "../Views/JustifiedCenteredView";
import { DeviceWidth } from "../../config/Device";
import MediumText from "../Texts/MediumText";
import HorizontalGradientView from "../Views/HorizontalGradientView";
import {
  PURPLE,
  LIGHT_PURPLE,
  FONT_BLACK,
  FONT_GREY,
  greyTheme
} from "../../config/Colors";
import { LEFT_MARGIN } from "../../config/Constants";
import NoFeedbackTapView from "../Views/NoFeedbackTapView";
import RegularText from "../Texts/RegularText";
import SvgUri from "react-native-svg-uri";
import RowView from "../Views/RowView";
import { sharedStyles } from "../../styles/Shared";
import { prefixZero } from "../../config/Utils";
import AntIcon from "react-native-vector-icons/AntDesign";
import { connect } from "react-redux";
var timeInterval;

class GemCountModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      min: 0,
      hour: 0,
      second: 0
    };
  }

  componentDidMount = () => {
    const { extraData } = this.props;
    if (extraData) {
      timeInterval = setInterval(() => {
        let currentTime = Math.floor(new Date().getTime() / 1000);
        let dateObj = new Date((extraData.refreshedAt - currentTime) * 1000);
        hour = prefixZero(dateObj.getUTCHours());
        min = prefixZero(dateObj.getUTCMinutes());
        second = prefixZero(dateObj.getSeconds());

        this.setState({ min, hour, second });
      }, 1000);
    }
  };

  componentWillUnmount = () => {
    clearInterval(timeInterval);
  };

  renderCommonElement = () => {
    const { count, goBack, extraData, myData } = this.props;
    return (
      <>
        <View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row"
            }}
          >
            <AntIcon
              onPress={() => goBack(false)}
              size={24}
              name={"closecircleo"}
              color={FONT_GREY}
            />
            <View style={styles.topGemContainer}>
              <RegularText
                style={{
                  fontSize: 16,
                  marginRight: 4
                }}
              >
                {myData.gems_count}
              </RegularText>
              <SvgUri
                width={18}
                height={18}
                source={require("../../assets/svgs/MyProfile/Gem.svg")}
              />
            </View>
          </View>
          <RegularText style={styles.actionText}>
            Taking this action will cost you {count}
          </RegularText>
          <View
            style={{
              alignSelf: "center",
              transform: [
                {
                  translateX: extraData ? 20 : 40
                },
                {
                  translateY: -22
                }
              ]
            }}
          >
            <SvgUri
              width={18}
              height={18}
              source={require("../../assets/svgs/MyProfile/Gem.svg")}
            />
          </View>
        </View>

        <NoFeedbackTapView
          style={{
            marginBottom: 0,
            transform: [
              {
                translateY: -8
              }
            ]
          }}
          onPress={() => goBack(true)}
          // onPress={() => ({})}
        >
          <HorizontalGradientView
            colors={[PURPLE, LIGHT_PURPLE]}
            style={{
              height: 50,
              width: DeviceWidth * 0.6,
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              marginTop: 10,
              borderRadius: 30
            }}
          >
            <MediumText
              style={{
                fontSize: 18,
                color: "#fff"
              }}
            >
              Continue
            </MediumText>
          </HorizontalGradientView>
        </NoFeedbackTapView>
        {/* <NoFeedbackTapView
          onPress={() => goBack(false)}
          style={{
            height: 50,
            width: DeviceWidth * 0.6,
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            marginTop: LEFT_MARGIN,
            borderRadius: 30,
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "#00000050"
          }}
        >
          <MediumText
            style={{
              fontSize: 20,
              color: FONT_BLACK
            }}
          >
            Cancel
          </MediumText>
        </NoFeedbackTapView> */}
      </>
    );
  };

  render() {
    const { count, goBack, extraData } = this.props;
    const { min, hour, second } = this.state;

    if (extraData) {
      return (
        <JustifiedCenteredView
          style={{
            flex: 1,
            backgroundColor: "#0000"
          }}
        >
          <View
            style={{
              borderRadius: 15,
              backgroundColor: "#fff",
              paddingVertical: 20,
              paddingHorizontal: 10,
              width: DeviceWidth * 0.9,
              justifyContent: "space-evenly",
              alignItems: "center"
            }}
          >
            <View
              style={{
                padding: 5, // 15,
                ...sharedStyles.justifiedCenter,
                borderRadius: 22,
                borderWidth: 0,
                borderColor: "#00000050"
              }}
            >
              <SvgUri height={50} width={50} source={extraData.icon} />
            </View>
            <MediumText
              style={{
                fontSize: 20,
                color: FONT_BLACK,
                textAlign: "center",
                marginVertical: 10
              }}
            >
              {extraData.itemName}
            </MediumText>

            <MediumText
              style={{ fontSize: 16, color: FONT_BLACK, textAlign: "center" }}
            >
              {extraData.description}
            </MediumText>

            <MediumText
              style={{
                fontSize: 16,
                color: FONT_BLACK,
                textAlign: "center",
                marginVertical: 10
              }}
            >
              {`${hour}:${min}:${second}`}
            </MediumText>
            {this.renderCommonElement()}
          </View>
        </JustifiedCenteredView>
      );
    } else {
      return (
        <JustifiedCenteredView
          style={{
            flex: 1,
            backgroundColor: "#0000"
          }}
        >
          <View style={styles.cardView}>{this.renderCommonElement()}</View>
        </JustifiedCenteredView>
      );
    }
  }
}

const styles = StyleSheet.create({
  cardView: {
    borderRadius: 15,
    backgroundColor: "#fff",
    padding: 10,
    width: DeviceWidth * 0.8,
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  topGemContainer: {
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 15,
    backgroundColor: "#ebebed",
    paddingHorizontal: 8,
    paddingVertical: 6
  },
  actionText: {
    fontSize: 20,
    textAlign: "center",
    paddingHorizontal: 16,
    marginTop: 30,
    lineHeight: 28
  }
});

const mapState = state => {
  return {
    myData: state.info.userInfo
  };
};

export default connect(mapState, {})(GemCountModal);
