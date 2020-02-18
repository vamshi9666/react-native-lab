import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet
} from "react-native";
import Ionicon from "react-native-vector-icons/Ionicons";
import { DeviceHeight, DeviceWidth } from "../../config/Device";
import moment from "moment";
import HorizontalGradientView from "../Views/HorizontalGradientView";
import { PURPLE, LIGHT_PURPLE, greyTheme } from "../../config/Colors";

class WaitingBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      extendsDisabled: false
    };
  }

  componentDidMount = () => {
    if (this.props.updateTime) {
      this.timeInterval = setInterval(() => {
        this.setState({ updatingTimeStamp: true });
      }, 45000);
    }
  };

  componentWillUnmount() {
    clearInterval(this.timeInterval);
  }

  render() {
    let { expiresAt, loading, extendedCount } = this.props;
    const { extendsDisabled } = this.state;
    if (expiresAt) {
      const timeDiff = moment(parseInt(expiresAt * 1000)).diff(
        moment(),
        "hours"
      );
      const minDiff = moment(parseInt(expiresAt * 1000)).diff(
        moment(),
        "minutes"
      );
      const extendingAllowed = extendedCount < 2;
      return (
        <View
          style={{
            height: DeviceHeight * 0.16,
            width: DeviceWidth,
            backgroundColor: "#F2F4F6",
            alignItems: "center"
          }}
        >
          <Text
            style={{
              color: "#8E8C8C",
              fontSize: 16,
              textAlign: "center",
              marginVertical: 10
            }}
          >
            You only have{" "}
            {timeDiff === 1
              ? "1 hour"
              : timeDiff < 1
              ? `${minDiff} min`
              : `${timeDiff} hours`}{" "}
            to become friends{"\n"} before this connection expires forever
          </Text>
          <HorizontalGradientView
            style={styles.buttonStyle}
            colors={
              extendsDisabled ? [greyTheme, greyTheme] : [PURPLE, LIGHT_PURPLE]
            }
          >
            <TouchableOpacity
              disabled={loading || extendsDisabled}
              onPress={() => {
                if (!extendingAllowed) {
                  alert("Extend limit has exceeded ");
                  this.setState({
                    extendsDisabled: true
                  });
                } else {
                  this.props.onExtend24HoursTapped();
                }
              }}
              style={styles.buttonStyle}
            >
              {loading ? (
                <ActivityIndicator
                  style={{ marginHorizontal: 20 }}
                  size="small"
                  color={"#fff"}
                />
              ) : (
                <>
                  <Ionicon name={"md-time"} color={"#fff"} size={25} />
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 14,
                      fontWeight: "500"
                    }}
                  >
                    {" "}
                    Extend For 24 Hours
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </HorizontalGradientView>
        </View>
      );
    } else {
      return <View />;
    }
  }
}

const styles = StyleSheet.create({
  buttonStyle: {
    height: 35,
    borderRadius: 30,
    justifyContent: "center",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    width: DeviceWidth * 0.5
  }
});

export default WaitingBar;
