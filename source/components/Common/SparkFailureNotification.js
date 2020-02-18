import React from "react";
import { View, StyleSheet, Dimensions, Text, StatusBar } from "react-native";
import Animated from "react-native-reanimated";
import Interactable from "../../../src/lib/Interactable";
import { TouchableOpacity } from "react-native-gesture-handler";
import MediumText from "../Texts/MediumText";
import { styles as landingStyles } from "../../styles/Landing";
import { connect } from "react-redux";
import CircularImage from "../Views/CircularImage";
import { CachedImage } from "react-native-img-cache";
import { WHITE, PURPLE } from "../../config/Colors";
import { bindActionCreators } from "redux";
import { removeOnefailure, setUserPacks } from "../../redux/actions/app";
import {} from "../../network/pack";
import { DeviceWidth } from "../../config/Device";
import { sendSpark } from "../../network/spark";
import { updateOwnProfile } from "../../redux/actions/user.info";
const { width } = Dimensions.get("window");

const { cond, block, eq, Value, call, debug } = Animated;

const height = 120;
const SHOW_INTERVAL = 7000;
class SparkFailureNotification extends React.Component {
  state = {
    allowRetry: true
  };
  show = () => {
    const { allowRetry } = this.state;
    this.refs["notif"].snapTo({ index: 1 });
    this.refundTimeout = setTimeout(() => {
      const { visible, failure } = this.props;
      if (!failure) {
        return;
      }
      const { fromGems, consumedCount, showSparkAgain } = failure;
      this.refs["notif"].snapTo({ index: 0 });

      this.props.visible.setValue(0);
      this.refund(fromGems, consumedCount);
      showSparkAgain();
      this.props.removeOnefailure();
      if (!allowRetry) {
        this.setState({
          allowRetry: true
        });
      }
    }, SHOW_INTERVAL);
    // setTimeout(() => {
    // }, SHOW_INTERVAL + 2000);
  };

  retry = () => {
    const { failure: sparkFailure, myData } = this.props;
    const { userId, consumedCount, fromGems, showSparkAgain } = sparkFailure;

    sendSpark(userId, myData._id)
      .then(res => {
        console.log(" ");
      })
      .catch(err => {
        showSparkAgain();
        this.setState(
          {
            allowRetry: false
          },
          () => {
            // clearTimeout(this.refundTimeout);
            // this.props.removeOnefailure();
            this.show();
            this.refund(fromGems, consumedCount);
          }
        );
      });
  };

  refund = (fromGems, consumedCount) => {
    const { myData, userPacks, updateOwnProfile, setUserPacks } = this.props;
    if (fromGems) {
      updateOwnProfile({
        gemsCount: myData.gemsCount + consumedCount
      });
    } else {
      const sparkUserPack =
        userPacks &&
        userPacks.find(p => p.itemId && p.itemId.value === "SPARK");
      const newUserPacks = userPacks.map(p => {
        if (p.itemId.value === "SPARK") {
          return {
            ...p,
            purchasedCount: p.purchasedCount + 1
          };
        }
        return p;
      });
      setUserPacks(newUserPacks);
    }
  };
  renderNotification = () => {
    const { visible, failure } = this.props;
    const { allowRetry } = this.state;
    // const allowRetry = false;
    const userName = failure && failure.userName ? failure.userName : "";
    const userImage = failure && failure.userName ? failure.userImage : "";
    const notificationTitle =
      "Sending Spark to " + "'" + userName + "'" + " failed!";
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={{
          flexDirection: "row",
          // backgroundColor: "green",
          // width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          flex: 1,
          margin: 10,
          right: 0
        }}
        disabled={!allowRetry}
        onPress={() => {
          this.refs["notif"].snapTo({ index: 0 });
          this.props.visible.setValue(0);
          this.retry();
        }}
      >
        <CircularImage
          height={45}
          source={{
            uri: userImage
          }}
          style={{
            marginRight: 10,
            marginLeft: 4
          }}
        />
        {/* <View style={styles.imageContainer}>
              <CachedImage
                style={{ height: 15, width: 15, backgroundColor: WHITE }}
                source={require("../../../source/assets/svgs/spark.png")}
              />
            </View> */}
        <View
          style={{
            // backgroundColor: "red",
            transform: [{ translateY: 4 }],

            // alignSelf: "center",
            right: 0,
            marginLeft: 8,
            marginTop: 4
          }}
        >
          <MediumText
            style={{ ...landingStyles.notificationTitle, fontSize: 16 }}
          >
            {notificationTitle}
          </MediumText>
          {allowRetry && (
            <MediumText
              style={{
                color: PURPLE,
                fontSize: 12,
                textAlign: "left",
                transform: [{ translateX: -18 }],
                borderRadius: 10,
                paddingHorizontal: 18,
                paddingVertical: 2,
                marginTop: 6
              }}
            >
              TAP TO RETRY
            </MediumText>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { visible, failure } = this.props;
    return (
      <>
        <Animated.Code>
          {() => block([cond(eq(visible, 1), [call([], this.show)])])}
        </Animated.Code>
        <Interactable.View
          ref={"notif"}
          initialPosition={{ y: -height }}
          boundaries={{ bottom: height }}
          verticalOnly={true}
          style={{
            position: "absolute",
            zIndex: 1000,

            marginHorizontal: 10,
            top: -height * 0.8,
            backgroundColor: "#fff",
            backgroundColor: "red",
            ...styles.container,
            width: DeviceWidth - 20,
            // justifyContent: "center",
            alignItems: "center",
            paddingVertical: 2,
            left: 0,
            flex: 1,
            right: 0
          }}
          snapPoints={[{ y: -height }, { y: height }]}
        >
          {failure && this.renderNotification()}
        </Interactable.View>
      </>
    );
  }
}

const mapState = state => {
  return {
    failure: state.app.sparkFailure,
    myData: state.info.userInfo,
    userPacks: state.app.userPacks
  };
};

const mapDispatch = dispatch => {
  return {
    removeOnefailure: bindActionCreators(removeOnefailure, dispatch),
    updateOwnProfile: bindActionCreators(updateOwnProfile, dispatch),
    setUserPacks: bindActionCreators(setUserPacks, dispatch)
  };
};
export default connect(mapState, mapDispatch)(SparkFailureNotification);

const styles = StyleSheet.create({
  container: {
    // marginLeft: width * 0.025,
    // justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    // width: width * 0.95,
    borderRadius: 10,
    // alignSelf: "center",

    backgroundColor: "rgb(255,255,255)",
    // position: "absolute",
    zIndex: 100,
    // top: 0,
    // backgroundColor: "red",
    elevation: 10,
    shadowColor: "#000000A0",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2
    }
    // height: 70
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 25,
    width: 25,
    borderRadius: 12.5,
    top: 38,
    left: 45
  }
});
