import React, { Component } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import SvgUri from "react-native-svg-uri";
import { DeviceHeight, DeviceWidth } from "../../config/Device";
import { sharedStyles } from "../../styles/Shared";
import MediumText from "../Texts/MediumText";

const { Value, timing, parallel } = Animated;
var countInterval;

class AnimateCountModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemScale: new Value(0),
      itemPosition: new Value(0),
      itemCount: 0
    };
  }

  componentDidMount = () => {
    const { fromCount } = this.props;
    this.setState({ itemCount: fromCount });
    this.startScalingAndTranslating();
  };

  startScalingAndTranslating = () => {
    const { itemScale, itemPosition } = this.state;
    const { reverse } = this.props;

    parallel([
      timing(itemScale, {
        toValue: 1,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: true
      }),
      timing(itemPosition, {
        toValue: reverse ? 75 : -75,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ]).start(() => {
      setTimeout(() => {
        this.startCountAnimation();
      }, 300);
    });
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { toCount } = this.props;
    if (this.state.itemCount === toCount) {
      clearInterval(countInterval);
      setTimeout(() => {
        this.startReverseScaling();
      }, 500);
    }
  };

  startCountAnimation = () => {
    const { fromCount, toCount } = this.props;
    const diff = Math.abs(fromCount - toCount);
    const timeInterval = 250 / diff;
    countInterval = setInterval(() => {
      this.setState(prevState => {
        return {
          itemCount: prevState.itemCount - 1
        };
      });
    }, timeInterval);
  };

  startReverseScaling = () => {
    const { itemScale, itemPosition } = this.state;
    const { closeCountModal, onComplete } = this.props;

    parallel([
      timing(itemScale, {
        toValue: 0,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: true
      }),
      timing(itemPosition, {
        toValue: 0,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ]).start(() => {
      setTimeout(() => {
        console.log(" called purchaed main boss");
        onComplete();
        closeCountModal();
      }, 100);
    });
  };

  getPosition = () => {
    const {
      fromSurfingCard,
      fromBottomSheet = false,
      fromChatWindow,
      fromWaitingBar,
      fromCardsHolder
    } = this.props;
    if (fromWaitingBar) {
      return {
        top: DeviceHeight * 0.23,
        left: DeviceWidth * 0.4,
        position: "absolute"
        // right: DeviceWidth * 0.4
      };
    }
    if (fromCardsHolder) {
      return {
        top: 30,
        right: 0,
        position: "absolute",
        zIndex: 9999
      };
    }
    if (fromBottomSheet) {
      return {
        right: 10,
        top: DeviceHeight * 0.8,
        zIndex: 9999,
        position: "absolute"
      };
    } else {
      return {
        position: "absolute",
        right: fromSurfingCard ? 10 : 0,
        bottom: fromSurfingCard ? DeviceHeight * 0.2 : 0,
        zIndex: 9999
      };
    }
  };

  render() {
    const { itemScale, itemPosition, itemCount } = this.state;
    const { itemIcon } = this.props;

    return (
      <View pointerEvents={"none"} style={this.getPosition()}>
        <Animated.View
          style={[
            styles.itemLayout,
            {
              transform: [
                {
                  scale: itemScale
                },
                {
                  translateY: itemPosition
                }
              ]
            }
          ]}
        >
          <View>
            <MediumText
              style={{
                fontSize: 15,
                marginLeft: 5
              }}
            >
              {itemCount}
            </MediumText>
          </View>
          <View>
            <SvgUri height={20} width={20} source={itemIcon} />
          </View>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  itemLayout: {
    borderRadius: 20,
    backgroundColor: "#eee",
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    flexDirection: "row",
    height: 35,
    paddingHorizontal: 10,
    // width: 60,
    ...sharedStyles.justifiedCenter
  }
});

export default AnimateCountModal;
