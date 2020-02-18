import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import RowView from "../Views/RowView";
import { sharedStyles } from "../../styles/Shared";
import RegularText from "../Texts/RegularText";
import { FONT_BLACK, PURPLE } from "../../config/Colors";
import { DeviceWidth, DeviceHeight } from "../../config/Device";
import Ionicon from "react-native-vector-icons/Ionicons";
import NoFeedbackTapView from "../Views/NoFeedbackTapView";

class SentReactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemLocation: null
    };
  }

  componentDidMount = () => {
    setTimeout(() => {
      this.measure();
    }, 100);
  };

  cardRef = React.createRef();

  measure = async () => {
    this.setState(
      {
        itemLocation: await new Promise(resolve =>
          this.cardRef.current.measureInWindow((x, y, width, height) => {
            resolve({ x, y, width, height });
          })
        )
      },
      () => {
        console.log("dfkdsfsdsf,f ", this.state.itemLocation);
      }
    );
  };

  render() {
    const { items, currentChatScreenIndex, dismissOverlay } = this.props;

    return (
      <NoFeedbackTapView
        onPress={dismissOverlay}
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: "#000000C0",
          zIndex: 3
        }}
      >
        <RowView style={{ ...styles.topItemsContainer, marginTop: 36 }}>
          <View
            style={{
              ...styles.swipeTabLayout,
              transform: [
                {
                  translateX:
                    currentChatScreenIndex === 0
                      ? -DeviceWidth * 0.29
                      : currentChatScreenIndex === 1
                      ? 0
                      : DeviceWidth * 0.29
                }
              ]
            }}
          />
          {items.map((item, itemId) => {
            const _isCurrentTab = itemId === currentChatScreenIndex;

            return (
              <View
                onPress={() => {
                  //
                }}
                key={itemId}
                style={{
                  ...styles.tabTappableView,
                  borderRightWidth: itemId === 0 ? 1 : 0,
                  opacity: _isCurrentTab ? 1 : 0
                }}
              >
                <RegularText
                  style={{
                    color: _isCurrentTab ? PURPLE : FONT_BLACK,
                    fontWeight: _isCurrentTab ? "500" : "normal",
                    ...styles.tabText
                  }}
                >
                  {item}
                </RegularText>
              </View>
            );
          })}
        </RowView>
        {this.state.itemLocation ? (
          <View
            style={{
              position: "absolute",
              height: 20,
              width: 20,
              borderRadius: 4,
              backgroundColor: "#fff",
              transform: [
                {
                  rotateZ: "45deg"
                }
              ],
              right:
                currentChatScreenIndex === 0
                  ? DeviceWidth * 0.75
                  : currentChatScreenIndex === 1
                  ? DeviceWidth * 0.45
                  : DeviceWidth * 0.165,
              top: this.state.itemLocation.y - 8
            }}
          />
        ) : (
          <View />
        )}

        <View
          style={{
            height: 55,
            width: DeviceWidth * 0.8,
            backgroundColor: "#fff",
            transform: [{ translateY: 15 }],
            alignSelf: "center",
            borderRadius: 10,
            ...sharedStyles.justifiedCenter
          }}
          ref={this.cardRef}
        >
          <RegularText
            style={{ color: FONT_BLACK, fontSize: 16, textAlign: "center" }}
          >
            {currentChatScreenIndex === 0
              ? "All your friends will be here!"
              : currentChatScreenIndex === 1
              ? "All your received reactions will be here!"
              : " All your sent reactions will be here!"}
          </RegularText>
        </View>
      </NoFeedbackTapView>
    );
  }
}

const styles = StyleSheet.create({
  tabText: {
    fontSize: 18,
    textAlign: "center"
  },
  topItemsContainer: {
    height: 35,
    width: DeviceWidth * 0.9,
    alignSelf: "center",
    borderRadius: 8,
    marginTop: DeviceHeight > 700 ? 30 : 20,
    backgroundColor: "rgba(238,238,238,0)",
    justifyContent: "center"
  },
  swipeTabLayout: {
    width: DeviceWidth * 0.308,
    height: 30,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: DeviceWidth * 0.005,
    position: "absolute",
    zIndex: -1,
    shadowColor: "rgba(0,0,0,0.5)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3
  },
  tabTappableView: {
    height: 30,
    width: DeviceWidth * 0.29,
    justifyContent: "center",
    borderRightColor: "#cfcfcf",
    marginTop: 3,
    flexDirection: "row",
    alignItems: "center"
  }
});

export default SentReactions;
