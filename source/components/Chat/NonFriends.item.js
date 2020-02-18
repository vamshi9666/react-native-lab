import Lodash from "lodash";
import moment from "moment";
import React, { Component } from "react";
import { Text, View } from "react-native";
import { CachedImage } from "react-native-img-cache";
import * as Progress from "react-native-progress";
import TouchableScale from "react-native-touchable-scale";
import Ionicon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import BoldText from "../../components/Texts/BoldText";
import MediumText from "../../components/Texts/MediumText";
import RegularText from "../../components/Texts/RegularText";
import JustifiedCenteredView from "../../components/Views/JustifiedCenteredView";
import RowView from "../../components/Views/RowView";
import { STATIC_URL } from "../../config/Api";
import { BRIGHT_RED, FONT_BLACK, FONT_GREY } from "../../config/Colors";
import { msgTypes } from "../../config/Constants";
import { DeviceHeight, DeviceWidth } from "../../config/Device";
import { namify, userNamify } from "../../config/Utils";
import {
  setCurrentChatScreenIndex,
  setCurrentScreenIndex
} from "../../redux/actions/nav";
import {
  setBellIconDot,
  setChatIconDot,
  setChatTextDot,
  setReceivedTextDot,
  setSentTextDot
} from "../../redux/actions/notification";
import { styles } from "../../styles/Chatfavourites";
import {
  resetUnreadMessageCount,
  selectOneRoom,
  setClient,
  setFriendObj,
  setOnlineStatus,
  setRooms,
  setRoomsArray,
  subscribeToAllRooms,
  subscribeToUserLiveStatus
} from "./../../redux/actions/rooms";

const LIGHT_BORDER_COLOR = "#b44cd5";

moment.locale("en", {
  relativeTime: {
    future: "%s",
    past: "%s",
    s: "now",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1mth",
    MM: "%dmth",
    y: "1y",
    yy: "%dy"
  }
});

class NonFriendsItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      myData,
      allRooms,
      item,
      index,
      fetchChatRoomAndGoToChat,
      inStack = false,
      onStackItemTapped
    } = this.props;
    const { postedBy, answeredBy } = item;
    const targetUser = postedBy._id === myData._id ? answeredBy : postedBy;
    const { age } = targetUser;
    const imageUrl = targetUser.images.length > 0 && targetUser.images[0];
    const _noRooms = Lodash.isEmpty(allRooms);
    var _lastMessage = _noRooms ? {} : allRooms[item._id].messages[0];
    const _lastButPreviousMessage = _noRooms
      ? {}
      : allRooms[item._id].messages[1];
    if (_lastMessage.type === msgTypes.TIMESTAMP) {
      _lastMessage = _lastButPreviousMessage;
    }
    const _sentByMe = _lastMessage.sender && _lastMessage.sender === myData._id;
    const timeDiff = moment(parseInt(item.expiresAt * 1000)).diff(
      moment(),
      "hours"
    );
    const minDiff = moment(parseInt(item.expiresAt * 1000)).diff(
      moment(),
      "minutes"
    );
    const progressValue = timeDiff / 24;
    return (
      <TouchableScale
        activeScale={0.9}
        defaultScale={1}
        tension={300}
        friction={30}
        // onPressIn={() => this.setState({ pressedIn: true })}
        // onPressOut={() => this.setState({ pressedIn: false })}
        key={index}
        style={{
          ...styles.chatItemLayout,
          marginHorizontal: inStack ? 16 : 0,
          marginVertical: DeviceHeight * 0.019,
          marginTop: inStack ? 0 : index === 0 ? DeviceHeight * 0.025 : 0
        }}
        onPress={() => {
          if (inStack) {
            return onStackItemTapped(item);
          }
          fetchChatRoomAndGoToChat(item);
        }}
      >
        <View style={{}}>
          {/* {imageUrl && ( */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "flex-end",
              marginBottom: 10,
              paddingVertical: 3,
              margin: 16,
              paddingLeft: 5
              //   backgroundColor: "green"
            }}
          >
            <JustifiedCenteredView
              style={{
                //   bottom: 30,
                left: 37,
                // opacity: this.props.opacity,
                ...styles.unreadCountContainer,
                borderColor: item.unreadMessagesCount ? "#fff" : "#0000",
                backgroundColor: item.unreadMessagesCount ? BRIGHT_RED : "#0000"
              }}
            >
              <MediumText
                style={{
                  color: item.unreadMessagesCount ? "#fff" : "#0000",
                  fontSize: 12,
                  padding: 3
                }}
              >
                {1}
              </MediumText>
            </JustifiedCenteredView>
            <Progress.Circle
              size={55}
              progress={progressValue}
              direction="counter-clockwise"
              borderColor={"rgba(0,0,0,0.0)"}
              indeterminate={false}
              color={LIGHT_BORDER_COLOR}
              unfilledColor={"rgba(0,0,0,0.1)"}
              style={{
                position: "absolute",
                transform: [{ translateX: -19.5 }, { translateY: 2 }]
              }}
              fill={"#fff"}
              thickness={2.0}
            />
            <CachedImage
              style={{
                // height: 60,
                // width: 60,
                // borderRadius: 30,
                // margin: 16,

                // ...styles.userSlotImage,
                // ...styles.userImage,
                width: 45,
                height: 45,
                borderRadius: 22.5,
                transform: [{ translateX: 0 }],
                borderWidth: 1,
                borderColor: "#cacaca",
                marginRight: 8

                // backgroundColor: "red"
                // opacity: this.props.opacity
              }}
              source={{
                uri: STATIC_URL + imageUrl.split("uploads")[1]
              }}
            />
            <Ionicon
              style={{
                // marginLeft: 10,
                transform: [{ translateX: 5 }, { translateY: -2 }]
              }}
              name={"md-time"}
              color={LIGHT_BORDER_COLOR}
              size={20}
            />
          </View>

          <RegularText
            style={{
              ...styles.timeText,
              fontSize: 12,
              // color: PURPLE,
              fontWeight: "700",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 14,
              marginTop: 3,
              textAlign: "center",
              color: LIGHT_BORDER_COLOR,
              //   backgro

              transform: [{ translateY: -8 }, { translateX: -10 }]
            }}
          >
            {timeDiff === 1
              ? "1 hour left"
              : timeDiff < 1
              ? `${minDiff} min left`
              : `${timeDiff} hours left`}
          </RegularText>
        </View>
        <View
          style={{
            marginLeft: 4,
            justifyContent: "center"
            // backgroundColor: "green"
            // alignItems: ""
          }}
        >
          <BoldText
            style={{
              fontSize: 17,
              color: FONT_BLACK,
              marginTop: 5
            }}
          >
            {userNamify(targetUser)}, {age || 21}
          </BoldText>
          <View
            style={{
              marginVertical: 2,
              flexDirection: "row",
              width: DeviceWidth * 0.75 - 107,
              marginTop: 2
            }}
          >
            <RegularText
              numberOfLines={1}
              style={{
                ...styles.msgText,
                fontSize: 16,
                color: FONT_GREY,
                fontWeight: "700",
                marginTop: 10,
                opacity: 0.8
              }}
            >
              {_lastMessage.type === msgTypes.MESSAGE_SYSTEM_A
                ? _sentByMe
                  ? "Reacted to you"
                  : "You reacted to them"
                : _lastMessage.type === msgTypes.MESSAGE_CARD
                ? !_sentByMe
                  ? "Reacted to you"
                  : "You reacted to them"
                : _lastMessage.type === msgTypes.MESSAGE_CHAT_CARD
                ? _sentByMe
                  ? `You sent a card`
                  : `sent a card`
                : _lastMessage.type === msgTypes.MESSAGE_EMOTICONS
                ? _sentByMe
                  ? `You sent an Emoticon`
                  : `sent an Emoticon`
                : _sentByMe
                ? `You sent a ${
                    _lastMessage.type === msgTypes.MESSAGE_GIF
                      ? _lastMessage.type
                      : namify(_lastMessage.type)
                  }`
                : `sent a ${
                    _lastMessage.type === msgTypes.MESSAGE_GIF
                      ? _lastMessage.type
                      : namify(_lastMessage.type)
                  }`}
            </RegularText>
            <RowView>
              <Text
                style={[
                  styles.separatorDotStyle,
                  { opacity: 0.6, fontSize: 16 }
                ]}
              >
                {" "}
                .{" "}
              </Text>
              <RegularText
                style={{
                  ...styles.msgText,
                  marginTop: 8,
                  opacity: 0.6,
                  fontSize: 16
                }}
              >
                {moment.unix(_lastMessage.createdAt).fromNow()}
              </RegularText>
            </RowView>
          </View>
        </View>
      </TouchableScale>
    );
  }
}

const mapStateToProps = state => {
  return {
    roomsArray: state.rooms.rooms_array,
    rooms: state.rooms.rooms,
    myData: state.info.userInfo,
    allRooms: state.rooms.rooms,
    currentScreenIndex: state.nav.currentScreenIndex,
    showChatsTextDot: state.notification.showChatsTextDot,
    showSentTextDot: state.notification.showSentTextDot,
    showReceivedTextDot: state.notification.showReceivedTextDot,
    showBellIconDot: state.notification.showBellIconDot,
    currentChatScreenIndex: state.nav.currentChatScreenIndex,
    apoloClient: state.apollo.client
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setRooms: bindActionCreators(setRooms, dispatch),
    setChatIconDot: bindActionCreators(setChatIconDot, dispatch),
    setChatTextDot: bindActionCreators(setChatTextDot, dispatch),
    setSentTextDot: bindActionCreators(setSentTextDot, dispatch),
    setReceivedTextDot: bindActionCreators(setReceivedTextDot, dispatch),
    setBellIconDot: bindActionCreators(setBellIconDot, dispatch),
    setCurrentChatScreenIndex: bindActionCreators(
      setCurrentChatScreenIndex,
      dispatch
    ),
    setCurrentScreenIndex: bindActionCreators(setCurrentScreenIndex, dispatch),
    setRoomsArray: bindActionCreators(setRoomsArray, dispatch),
    subscribeToAllRooms: bindActionCreators(subscribeToAllRooms, dispatch),
    openOneRoom: bindActionCreators(selectOneRoom, dispatch),
    resetUnreadMessageCount: bindActionCreators(
      resetUnreadMessageCount,
      dispatch
    ),
    setFriendObj: bindActionCreators(setFriendObj, dispatch),
    subscribeToUserLiveStatus: bindActionCreators(
      subscribeToUserLiveStatus,
      dispatch
    ),
    setApolloClient: bindActionCreators(setClient, dispatch),
    setLiveStatus: bindActionCreators(setOnlineStatus, dispatch)
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(NonFriendsItem);
