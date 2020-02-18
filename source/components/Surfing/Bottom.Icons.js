import React, { Component } from "react";
import { Platform, View } from "react-native";
import { CachedImage } from "react-native-img-cache";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { FONT_BLACK } from "../../config/Colors";
import { DeviceHeight, DeviceWidth } from "../../config/Device";
import { setCurrentScreenIndex } from "../../redux/actions/nav";
import { setChatIconDot } from "../../redux/actions/notification";
import { styles } from "../../styles/Landing";
import BoldText from "../Texts/BoldText";
import NoFeedbackTapView from "../Views/NoFeedbackTapView";
import CustomTappableScale from "../Common/TouchableScale";

const { OS } = Platform;

class BottomIcons extends Component {
  goToScreen = screenName => {
    const { setCurrentScreenIndex, navigation } = this.props;
    let targetScreenIndex;
    if (screenName === "myProfile") {
      targetScreenIndex = 1;
    } else {
      targetScreenIndex = 2;
    }
    setCurrentScreenIndex(targetScreenIndex);
    navigation.push(screenName);
  };
  render() {
    const {
      hideBottomNavBar,
      navigation,
      showChatIconDot,
      setChatIconDot
    } = this.props;

    return (
      <View
        style={{
          width: DeviceWidth,
          flexDirection: "row",
          height: 60,
          position: "absolute",
          bottom:
            DeviceHeight > 750 ? DeviceHeight * 0.03 : DeviceHeight * 0.01,
          zIndex: 0,
          transform: [
            {
              translateY: hideBottomNavBar ? 80 : OS === "ios" ? -5 : 0
            }
          ]
        }}
      >
        <View style={styles.iconsView}>
          <CustomTappableScale
            style={styles.chatIconView}
            minScale={0.8}
            maxScale={1}
            onPress={() => {
              this.goToScreen("chatFavourites");
              // navigation.push("chatFavourites");
              if (showChatIconDot) {
                setChatIconDot(false);
              }
            }}
          >
            <View
              style={{
                zIndex: 3,
                height: 8,
                width: 8,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: showChatIconDot ? "#fff" : "#0000",
                backgroundColor: showChatIconDot ? "rgb(237,67,108)" : "#0000",
                transform: [{ translateX: 27.5 }, { translateY: 2.5 }]
              }}
            />
            <CachedImage
              style={{
                transform: [{ translateY: -4 }],
                ...styles.iconStyle
              }}
              source={require("../../assets/images/chat.png")}
            />
          </CustomTappableScale>
        </View>

        <NoFeedbackTapView
          //   onPress={this.showPresetModal}
          style={{
            justifyContent: "center",
            ...styles.iconsView
          }}
        >
          <BoldText
            style={{
              fontSize: 28,
              color: FONT_BLACK,
              textAlign: "center",
              marginTop: 12
            }}
          >
            Closer
          </BoldText>
        </NoFeedbackTapView>

        <View style={styles.iconsView}>
          <CustomTappableScale
            style={styles.userIconView}
            minScale={0.8}
            maxScale={1}
            onPress={() => {
              this.goToScreen("myProfile");
              // navigation.push("myProfile")}
            }}
          >
            <CachedImage
              style={[
                styles.iconStyle,
                {
                  marginTop: -2
                }
              ]}
              source={require("../../assets/images/profile.png")}
            />
          </CustomTappableScale>
        </View>
      </View>
    );
  }
}

const mapState = state => {
  return {
    showChatIconDot: state.notification.showChatIconDot
  };
};

const mapDispatch = dispatch => {
  return {
    setChatIconDot: bindActionCreators(setChatIconDot, dispatch),
    setCurrentScreenIndex: bindActionCreators(setCurrentScreenIndex, dispatch)
  };
};
export default connect(mapState, mapDispatch)(BottomIcons);
