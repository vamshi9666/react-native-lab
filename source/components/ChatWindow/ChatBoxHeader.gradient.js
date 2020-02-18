import { connectActionSheet } from "@expo/react-native-action-sheet";
import moment from "moment";
import React, { Component } from "react";
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback
} from "react-native";
import { Text as AnimatedText } from "react-native-animatable";
import * as Progress from "react-native-progress";
import SvgUri from "react-native-svg-uri";
import Ionicon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MediumText from "../../components/Texts/MediumText";
import { STATIC_URL } from "../../config/Api";
import { BRIGHT_RED, FONT_BLACK, FONT_GREY, PURPLE } from "../../config/Colors";
import {
  LEFT_MARGIN,
  LEVELS_INTERVAL_IN_MINUTES
} from "../../config/Constants";
import { DeviceHeight, DeviceWidth } from "../../config/Device";
import { namify, userNamify } from "../../config/Utils";
import { getRoomObj } from "../../network/rooms";
import { getLiveStatus } from "../../network/user";
import { userLiveStatusSub } from "../../queries/Chat.query";
import { setCurrentScreenIndex } from "../../redux/actions/nav";
import CircularImage from "../Views/CircularImage";
import RowView from "../Views/RowView";
class HeaderGradient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLive: false,
      roomLevel: null,
      commonTime: null
    };
    this.sub = null;
  }
  // showGameUnlockModal = () => {
  //   const { isFriend } = this.props;
  //   // if (isFriend) {
  //   const { roomLevel } = this.state;
  //   console.log(" roomlevel is ", roomLevel);
  //   if (roomLevel >= 5) {
  //     this.props.showGameUnlockModal("VIBE");
  //   } else if (roomLevel >= 10) {
  //     this.props.showGameUnlockModal("CONFESSIONS");
  //     // }
  //   }
  // };
  fetchAndSetLevel = () => {
    const { selectedRoomId } = this.props;
    getRoomObj(selectedRoomId, roomObjRes => {
      console.log(" room Obj is ", roomObjRes);
      if (roomObjRes.success) {
        const {
          postedUserActiveTime,
          answeredUserActiveTime
        } = roomObjRes.data;
        const finalTime =
          postedUserActiveTime > answeredUserActiveTime
            ? answeredUserActiveTime
            : postedUserActiveTime;

        // const
        const interval = LEVELS_INTERVAL_IN_MINUTES * 60;
        const roomLevel = Math.round(Math.floor(finalTime / interval));
        this.setState(
          {
            commonTime: finalTime,
            roomLevel
          },
          this.showGameUnlockModal
        );
      }
    });
  };
  componentDidMount = () => {
    const {
      showOnlineStatus,
      targetUser,
      apolloClient,
      enableLevels
    } = this.props;

    const changeState = val => {
      this.setState({
        isLive: val
      });
    };
    if (showOnlineStatus) {
      getLiveStatus(targetUser._id, res => {
        // console.log(" get live status result is ", res);
        if (res.success) {
          this.setState({
            isLive: res.data.isLive
          });
        }
      });
      this.sub = apolloClient
        .subscribe({
          query: userLiveStatusSub,
          variables: {
            userId: targetUser._id
          },
          fetchPolicy: "network-only"
        })
        .subscribe({
          next({ data, errors, context }) {
            // console.log(" data is ", data.userLiveStatusChanged.isLive);
            changeState(data.userLiveStatusChanged.isLive);
          },
          error(err) {
            changeState(false);
            console.log(" live status :::: error is ", err);
          }
        });
    }
    // console.log(" header props are", this.props);
    const { selectedRoomId } = this.props;
    if (selectedRoomId) {
      // if (enableLevels) {
      // this.fetchAndSetLevel();
      // this.uptimeInterval = setInterval(() => {
      //   this.fetchAndSetLevel();
      // }, 3000);
      // }
      // }
    }
    // if (selectedRoomId) {
  };

  openProfile = () => {
    this.props.openOtherProfileModal(-1);
  };
  unfriend = () => {
    Alert.alert(
      "Unfriend",
      "Are you sure you want to unfriend  " + this.props.targetUser.name + "?",
      [
        {
          text: "CONFIRM",
          onPress: () => this.props.onUnfriend()
        },
        {
          text: "CANCEL",
          onPress: () => console.log(" cancel tapped ")
        }
      ]
    );
  };

  componentWillUnmount = () => {
    // console.log(" unmounted ");
    clearInterval(this.uptimeInterval);
    // alert("unmount");
    this.sub.unsubscribe();
    // clearInterval(this.uptimeInterva)
  };
  blockAndReport = () => {
    this.props.showBlockReasons();
  };
  showMenu = () => {
    const { isFriend } = this.props;
    const options = isFriend
      ? [
          "View Profile",
          "Delete Conversation",
          "Unfriend",
          "Block and Report",
          "Cancel"
        ]
      : ["Block and Report", "Cancel"];
    // const destructiveButtonIndex = 3;
    const cancelButtonIndex = options.length - 1;

    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex

        // destructiveButtonIndex: options.length - 1
      },
      buttonIndex => {
        if (isFriend) {
          if (buttonIndex === 0) {
            this.openProfile();
          } else if (buttonIndex === 1) {
            this.showDeleteConversationConfirmation();
          } else if (buttonIndex === 2) {
            this.unfriend();
          } else if (buttonIndex === 3) {
            this.blockAndReport();
          }
        } else {
          if (buttonIndex === 0) {
            this.blockAndReport();
          }
        }
        // if (buttonIndex === 0) {
        //   this.openProfile();
        // } else if (buttonIndex === 1) {
        //   this.showDeleteConversationConfirmation();
        // } else if (buttonIndex === 2) {
        //   this.unfriend();
        // } else if (buttonIndex === 3) {
        //   this.blockAndReport();
        // }
        // Do something here depending on the button index selected
      }
    );
  };
  showDeleteConversationConfirmation = () => {
    this.props.onDeleteConversationClicked();
  };
  renderImage = () => {
    let { targetUser, expiresAt, showProgress } = this.props;
    const { isLive } = this.state;
    const timeDiff = moment(parseInt(expiresAt * 1000)).diff(moment(), "hours");
    const progressValue = timeDiff / 24;
    return (
      <View>
        {targetUser && targetUser.images && targetUser.images.length > 0 && (
          <>
            {showProgress ? (
              <Progress.Circle
                size={45}
                progress={progressValue}
                direction="counter-clockwise"
                borderColor={"rgba(0,0,0,0.0)"}
                indeterminate={false}
                color={PURPLE}
                unfilledColor={"rgba(0,0,0,0.1)"}
                style={{
                  position: "absolute",
                  top: -5,
                  left: -5
                }}
                fill={"#fff"}
                thickness={2.5}
              />
            ) : (
              <View />
            )}
            <CircularImage
              height={35}
              source={{
                uri: STATIC_URL + targetUser.images[0].split("uploads")[1]
              }}
            />

            {isLive ? (
              <View
                style={{
                  position: "absolute",
                  height: 10,
                  width: 10,
                  borderRadius: 5,
                  backgroundColor: BRIGHT_RED,
                  zIndex: 2,
                  right: 0,
                  bottom: 0,
                  borderWidth: 1,
                  borderColor: "#fff"
                }}
              />
            ) : (
              <View />
            )}
          </>
        )}
      </View>
    );
  };
  shouldComponentUpdate = nextProps => {
    const { isFriend, roomLevel, targetUser, targetUserTyping } = this.props;
    const isFriendPropDifferent = nextProps.isFriend !== isFriend;
    const isRoomLevelPropDifferent = nextProps.roomLevel !== roomLevel;
    const isTargetUserPropDifferent = nextProps.targetUser !== targetUser;
    const isTargetUserTypingPropDifferent =
      nextProps.targetUserTyping !== targetUserTyping;

    if (
      isFriendPropDifferent ||
      isRoomLevelPropDifferent ||
      isTargetUserPropDifferent ||
      isTargetUserTypingPropDifferent
    ) {
      return true;
    } else {
      return false;
    }
  };
  render() {
    let {
      targetUser,
      targetUserTyping,
      isFriend,
      roomLevel,
      onLevelStarTapped,
      popUpOpen
    } = this.props;
    // const { roomLevel, commonTime } = this.state;

    return (
      <View style={styles.baseLayout}>
        <RowView style={{ height: DeviceHeight * 0.1 }}>
          <View
            style={{
              width: "12%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <TouchableOpacity
              style={styles.moreIconView}
              onPress={this.showMenu}
            >
              <Ionicon
                style={styles.moreIcon}
                name={"md-more"}
                color={"rgb(112,112,112)"}
                size={30}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => this.openProfile()}
            style={{
              width: "53%",
              height: "100%",
              alignItems: "center",
              justifyContent: "flex-start",
              flexDirection: "row"
            }}
          >
            {this.renderImage()}
            <View>
              <AnimatedText
                transition={["marginBottom"]}
                style={{
                  marginBottom: targetUserTyping ? 10 : 0,
                  ...styles.userName
                }}
              >
                {isFriend ? namify(targetUser.name) : userNamify(targetUser)}
                {"\n"}
                <AnimatedText
                  transition={"opacity"}
                  style={{
                    opacity: targetUserTyping ? 1 : 0,
                    ...styles.typingText
                  }}
                >
                  typing...
                </AnimatedText>
              </AnimatedText>
            </View>
          </TouchableOpacity>

          <RowView
            style={{
              width: "35%",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: DeviceHeight * 0.025
              // zIndex: popUpOpen ? 122 : 1
            }}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                onLevelStarTapped();
              }}
              style={{
                marginTop: (DeviceHeight * 0.1) / 3,
                backgroundColor: "rgb(242,242,242)",
                paddingHorizontal: 20,
                borderRadius: 10,
                height: 37.5,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <SvgUri
                width={25}
                height={25}
                source={require("../../assets/svgs/Chat/star.svg")}
              />
              {/* <FontAwesome5 name="star" size={26} color={BRIGHT_RED} /> */}
              <MediumText
                style={{
                  fontSize: 11,
                  color: "#fff",
                  textAlign: "center",
                  position: "absolute",
                  zIndex: 1,
                  top: (DeviceHeight * 0.1) / 3 - 7.5
                }}
              >
                {roomLevel}
              </MediumText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.backIcon}
              onPress={async () => {
                const {
                  navigation,
                  setCurrentScreenIndex,
                  navParams
                } = this.props;
                await setCurrentScreenIndex(
                  navParams.from === "Surfing" ? 0 : 3
                );
                await navigation.pop();
              }}
            >
              <Ionicon
                name={"ios-arrow-forward"}
                size={30}
                color={"rgb(112,112,112)"}
              />
            </TouchableOpacity>
          </RowView>
        </RowView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backIcon: {
    alignSelf: "center",
    marginTop: 20,
    height: 30,
    width: 30,
    marginLeft: 5
  },
  nameImageView: {
    flexDirection: "row",
    width: DeviceWidth / 2,
    justifyContent: "space-evenly",
    alignItems: "flex-end",
    height: DeviceHeight * 0.13,
    marginTop: 0
  },
  subLayout: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  baseLayout: {
    height: DeviceHeight * 0.13,
    width: DeviceWidth,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    backgroundColor: "#fff"
  },
  userView: {
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  userImage: {
    height: 40,
    width: 40,
    borderRadius: 25
  },
  userName: {
    color: FONT_BLACK,
    fontSize: 22,
    fontWeight: "500",
    fontFamily: "Proxima Nova",
    transform: [{ translateX: 12.5 }, { translateY: 10 }]
  },
  typingText: {
    color: FONT_GREY,
    fontSize: 14,
    fontFamily: "Proxima Nova"
  },
  moreIconView: {
    height: 30,
    width: 30,
    marginLeft: LEFT_MARGIN
  }
});

const mapState = state => {
  return {
    targetUserTyping: state.rooms.isTargetUserTyping,
    apolloClient: state.apollo.client
  };
};

const mapDispatch = dispatch => {
  return {
    setCurrentScreenIndex: bindActionCreators(setCurrentScreenIndex, dispatch)
  };
};
const container = connect(mapState, mapDispatch)(HeaderGradient);
export default connectActionSheet(container);
