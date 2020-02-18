import React, { Component } from "react";
import {
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { LIGHT_PURPLE } from "../../../src/config/Colors";
import { FONT_GREY, PURPLE, WHITE } from "../../config/Colors";
import { DeviceWidth } from "../../config/Device";
import { retrieveData, storeData } from "../../config/Storage";
import { updateProfile } from "../../network/user";
import { updateOwnProfile } from "../../redux/actions/user.info";
import BoldText from "../Texts/BoldText";
import MediumText from "../Texts/MediumText";
import RegularText from "../Texts/RegularText";
import HorizontalGradientView from "../Views/HorizontalGradientView";
import NoFeedbackTapView from "../Views/NoFeedbackTapView";
import SvgUri from "react-native-svg-uri";
const { OS } = Platform;

const AWESOME_STUFF_INDEX = 3;

class LastCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      remainingTime: null,
      snoozeRemainingTime: null
      // permissionGranted: true
    };
  }

  componentDidMount = async () => {
    const { createdAt, myData } = this.props;
    // const permissionGranted = await firebase.messaging().hasPermission();
    // this.setState({
    //   permissionGranted
    // });
    // console.log(" permission granted is ", permissionGranted);
    // // this.interval = setInterval(() => {
    // var eventTime =  ;
    // var currentTime = '1366547400';
    // var leftTime = eventTime - currentTime;//Now i am passing the left time from controller itself which handles timezone stuff (UTC), just to simply question i used harcoded values.
    // var duration = moment.duration(leftTime, 'seconds');
    // var interval = 1000;
    // const currentMoment = momemt();
    // const snoozeEndTme = moment.unix(myData.privateExpiresAt);
    // const snoozeRemainingTimeInDays = snoozeEndTme.diff(currentMoment, "days");
    // if (snoozeRemainingTimeInDays < 1) {
    //   const snoozeRemainingTimeInHours = snoozeEndTme.diff(
    //     currentMoment,
    //     "hours"
    //   );
    //   this.setState({
    //     snoozeRemainingTime: `${snoozeRemainingTimeInHours } hours `
    //   });
    // }
    // if (snoozeRemainingTimeInDays > 7) {
    //   this.setState({
    //     snoozeRemainingTime: ""
    //   });
    // }
    // else {
    //   this.setState({
    //     snoozeRemainingTime: `${snoozeRemainingTimeInDays} days`
    //   })
    // }
    this.setState({ remainingTime: "18:19:27" });

    // }, 1000);
  };
  enablePermissionAsPerScreen = fromChat => {
    const notificationsToProhibit = fromChat
      ? ["teamCloser", "awesomeStuff"]
      : ["teamCloser"];
    const { myData } = this.props;
    const { notificationPermission } = myData;
    const newNotificationPermisionArr = notificationPermission.map(
      notifyObj => {
        if (!notificationsToProhibit.includes(notifyObj.dataKey)) {
          const newChildren = notifyObj.children.map(permission => {
            return {
              ...permission,
              isActive: true
            };
          });
          return {
            ...notifyObj,
            children: newChildren
          };
        }
        return notifyObj;
      }
    );
    updateProfile(
      {
        notificationPermission: newNotificationPermisionArr
      },
      updateResult => {
        console.log("appstate  udpate result is ", updateResult);
        if (updateResult.success) {
          this.props.updateOwnProfile({
            notificationPermission: updateResult.data.notificationPermission
          });
        }
      }
    );
    console.log(
      " appstate new permission in chat one are ",
      newNotificationPermisionArr
    );
  };

  enableRequiredNotifications = async () => {
    const {
      myData,
      currentChatScreenIndex,
      notificationPermissionGranted
    } = this.props;
    const { notificationPermission: notficationPermissionArr } = myData;
    const isInSent = currentChatScreenIndex === 2;
    const isRequiredPermissionGranted =
      notficationPermissionArr[AWESOME_STUFF_INDEX]["children"][0]["isActive"];

    if (!notificationPermissionGranted || !isRequiredPermissionGranted) {
      await storeData(
        "FOR_NOTIFICATION",
        "SURFING"
        // String(true)
      );
      const two = await retrieveData("FOR_NOTIFICATION");
      console.log("appstate two is ", two);
    }
    if (notificationPermissionGranted) {
      this.enablePermissionAsPerScreen(false);
    } else {
      await Linking.openURL("app-settings:");
    }
  };
  // shouldComponentUpdate = (nextProps, nextState) => {
  //   const isPermissionPropSame = isEqual(
  //     this.props.notificationPermissionGranted,
  //     nextProps.notificationPermissionGranted
  //   );
  //   const isEqualMyData = isEqual(this.props.myData, nextProps.myData);
  //   const isHasMorePropSame = isEqual(this.props.hasMore, nextProps.hasMore);
  //   if (!isPermissionPropSame || !isHasMorePropSame || !isEqualMyData) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };
  componentWillUnmount = () => {
    clearInterval(this.interval);
  };
  onEnablePermissionClick = async () => {
    const { myData, notificationPermissionGranted } = this.props;
    const { notificationPermission: notficationPermissionArr } = myData;
    const isRequiredPermissionGranted =
      notficationPermissionArr[AWESOME_STUFF_INDEX]["children"][0]["isActive"];
    if (!notificationPermissionGranted || !isRequiredPermissionGranted) {
      await storeData("FOR_NOTIFICATION", "SURFING");
    }
    if (notificationPermissionGranted) {
      this.enablePermissionAsPerScreen(false);
    } else {
      await Linking.openURL("app-settings:");
    }
  };
  render() {
    const {
      onClick,
      buttonText,
      hasMore = false,
      myData: { notificationPermission = [] },
      notificationPermissionGranted
    } = this.props;
    const permissionGranted =
      notificationPermission &&
      notificationPermission[AWESOME_STUFF_INDEX] &&
      notificationPermission[AWESOME_STUFF_INDEX]["children"][0]["isActive"] &&
      notificationPermissionGranted;

    const hasClickFunction = onClick ? true : false;

    return (
      <View
        style={[
          {
            // height: DeviceHeight * 0.2 + IMAGE_HEIGHT,
            // width: CARD_WIDTH,
            ...StyleSheet.absoluteFillObject,
            borderRadius: 15,
            overflow: OS === "ios" ? "visible" : "hidden",
            elevation: 3,
            shadowColor: "#000000A0",
            shadowOpacity: 0.2,
            shadowRadius: 5,
            shadowOffset: {
              width: 0,
              height: 2
            }
          },
          styles.container
        ]}
      >
        <View style={{ height: 200 }} />
        {hasMore ? (
          <>
            <BoldText
              style={{
                fontSize: 24
              }}
            >
              Done for Today
            </BoldText>
            <RegularText
              style={{
                marginTop: 10,
                fontSize: 22
              }}
            >
              Come back in
            </RegularText>
            <MediumText
              style={{
                fontSize: 18,
                marginTop: 10,
                color: FONT_GREY
              }}
            >
              {`${this.state.remainingTime}`}
            </MediumText>
            {buttonText ? (
              <>
                <MediumText
                  style={{
                    fontSize: 18,
                    marginTop: 16
                  }}
                >
                  Or
                </MediumText>

                <TouchableOpacity
                  style={{
                    width: "100%",
                    backgroundColor: PURPLE,
                    borderRadius: 25,
                    marginTop: 20,
                    display: "flex"
                  }}
                  disabled={!hasClickFunction}
                  onPress={() => {
                    hasClickFunction ? onClick() : () => ({});
                  }}
                >
                  <HorizontalGradientView
                    style={{
                      height: 50,
                      borderRadius: 25,
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                    colors={[LIGHT_PURPLE, PURPLE]}
                  >
                    <RegularText
                      style={{
                        textAlign: "center",
                        marginVertical: 12,
                        color: WHITE,
                        fontSize: 18
                      }}
                    >
                      {buttonText}
                    </RegularText>
                  </HorizontalGradientView>
                </TouchableOpacity>
              </>
            ) : (
              <View />
            )}
          </>
        ) : (
          <>
            <View style={{ flex: 1, alignItems: "center" }}>
              <SvgUri
                source={require("../../assets/svgs/Surfing/noProfiles.svg")}
              />
              <RegularText style={{ color: FONT_GREY, fontSize: 18 }}>
                No people found. Come back again to meet awesome people!
              </RegularText>
            </View>
            {!permissionGranted ? (
              <>
                <RegularText style={{ color: FONT_GREY, fontSize: 18 }}>
                  Get notified when people arrived
                </RegularText>
                <NoFeedbackTapView
                  style={styles.enableNotificationButton}
                  onPress={async () => {
                    this.onEnablePermissionClick();
                  }}
                >
                  <BoldText
                    style={{
                      color: WHITE,
                      fontSize: 18
                    }}
                  >
                    Enable Notification
                  </BoldText>
                </NoFeedbackTapView>
              </>
            ) : (
              <View />
            )}
          </>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  enableNotificationButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: PURPLE,
    width: DeviceWidth * 0.7,
    paddingVertical: 16,
    borderRadius: 25,
    marginTop: 16
  }
});

const mapState = state => {
  return {
    createdAt: state.profiles.createdAt,
    notificationPermissionGranted: state.nav.notificationPermissionGranted,
    myData: state.info.userInfo
  };
};

const mapDispatch = dispatch => {
  return {
    updateOwnProfile: bindActionCreators(updateOwnProfile, dispatch)
  };
};

export default connect(mapState, mapDispatch)(LastCard);
