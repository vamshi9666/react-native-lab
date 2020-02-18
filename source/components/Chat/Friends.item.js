import Lodash from "lodash";
import moment from "moment";
import React, { Component } from "react";
import {
  Image,
  Platform,
  Text,
  View,
  StyleSheet,
  Animated as RNAnimated
} from "react-native";
import TouchableScale from "react-native-touchable-scale";
import Animated from "react-native-reanimated";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import BoldText from "../../components/Texts/BoldText";
import MediumText from "../../components/Texts/MediumText";
import RegularText from "../../components/Texts/RegularText";
import JustifiedCenteredView from "../../components/Views/JustifiedCenteredView";
import NoFeedbackTapView from "../../components/Views/NoFeedbackTapView";
import RowView from "../../components/Views/RowView";
import { STATIC_URL } from "../../config/Api";
import { BRIGHT_RED, WHITE, BLACK, FONT_GREY } from "../../config/Colors";
import { msgTypes } from "../../config/Constants";
import { DeviceHeight } from "../../config/Device";
import { namify } from "../../config/Utils";
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
import Swipeable from "react-native-gesture-handler/Swipeable";
import {
  RectButton,
  TouchableWithoutFeedback
} from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Octicons";
import MatComIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Reanimated from "react-native-reanimated";
import { sharedStyles } from "../../styles/Shared";
import { CachedImage } from "react-native-img-cache";

const { interpolate, Extrapolate } = Reanimated;
moment.locale("en", {
  relativeTime: {
    future: "in %s",
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

const AnimatedNoFeedbackTapView = RNAnimated.createAnimatedComponent(
  NoFeedbackTapView
);
class FriendsItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this._swipeable = React.createRef();
  }
  deleteConversation = cb => {
    const { item } = this.props;
    this.props.onDeleteConversationClicked(item._id, () => {
      cb();
      // this._swipeable.close();
    });
  };
  renderRightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [0, 80],
      outputRange: [0.8, 0]
    });

    return (
      <AnimatedNoFeedbackTapView
        onPress={() => {
          this.deleteConversation(() => {
            this._swipeable.close();
          });
        }}
        style={{
          transform: [{ scale }],
          height: 40,
          width: 40,
          borderRadius: 10,
          marginTop: DeviceHeight * 0.065,
          marginRight: DeviceHeight * 0.025,
          backgroundColor: "#fff",
          shadowColor: "rgba(0,0,0,0.2)",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.35,
          shadowRadius: 10,
          ...sharedStyles.justifiedCenter
        }}
      >
        <Icon name="trashcan" size={15} color={BRIGHT_RED} />
      </AnimatedNoFeedbackTapView>
    );
  };

  render() {
    const {
      myData,
      currentChatScreenIndex,
      allRooms,
      item,
      index,
      fetchChatRoomAndGoToChat
    } = this.props;
    const { postedBy, answeredBy } = item;
    const targetUser = postedBy._id === myData._id ? answeredBy : postedBy;
    const { name } = targetUser;
    const imageUrl = targetUser.images.length > 0 && targetUser.images[0];
    const _noRooms = Lodash.isEmpty(allRooms);
    var _lastMessage = _noRooms
      ? {}
      : allRooms[item._id].messages.length > 0 &&
        allRooms[item._id].messages[0];
    const _lastButPreviousMessage = _noRooms
      ? {}
      : allRooms[item._id].messages[1];

    if (_lastMessage && _lastMessage.type === msgTypes.TIMESTAMP) {
      _lastMessage = _lastButPreviousMessage;
    }
    const _sentByMe =
      _lastMessage && _lastMessage.sender && _lastMessage.sender === myData._id;
    return (
      <Swipeable
        ref={ref => (this._swipeable = ref)}
        overshootLeft={false}
        overshootRight={false}
        renderRightActions={this.renderRightActions}
      >
        <TouchableScale
          activeScale={0.9}
          defaultScale={1}
          tension={300}
          friction={30}
          key={index}
          style={{
            ...styles.chatItemLayout,
            marginVertical: DeviceHeight * 0.019,
            marginTop: index === 0 ? DeviceHeight * 0.025 : 0
          }}
          onPress={() => {
            this.props.fetchChatRoomAndGoToChat(item);
          }}
        >
          <JustifiedCenteredView
            style={{
              bottom: 10,
              left: 58,
              borderColor: item.unreadMessagesCount ? "#fff" : "#0000",
              ...styles.unreadCountContainer,
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
              {item.unreadMessagesCount}
            </MediumText>
          </JustifiedCenteredView>
          {imageUrl && (
            <CachedImage
              style={styles.userImage}
              source={{
                uri: STATIC_URL + imageUrl.split("uploads")[1]
              }}
            />
          )}
          <View
            style={{
              ...styles.textColumnView,
              marginLeft: 8
            }}
          >
            <View style={styles.nameTimeRowView}>
              <BoldText style={styles.userName}>{namify(name)}</BoldText>
              {/* <Text style={styles.timeStamp}>
            {moment.unix(_lastMessage.createdAt).fromNow()}
          </Text> */}
            </View>
            <RowView>
              <RegularText style={styles.msgText}>
                {_lastMessage
                  ? _lastMessage.type === msgTypes.MESSAGE_SYSTEM_C
                    ? "You got closer!"
                    : _lastMessage.type === msgTypes.MESSAGE_CHAT_CARD ||
                      _lastMessage.type === msgTypes.MESSAGE_QUESTION_CARD
                    ? _sentByMe
                      ? `You sent a card`
                      : `sent a card`
                    : _sentByMe
                    ? `You sent a ${
                        _lastMessage.type === msgTypes.MESSAGE_GIF
                          ? _lastMessage.type
                          : _lastMessage.type.toLowerCase()
                      }`
                    : `sent a ${
                        _lastMessage.type === msgTypes.MESSAGE_GIF
                          ? _lastMessage.type
                          : _lastMessage.type.toLowerCase()
                      }`
                  : null}
              </RegularText>
              <RowView>
                {_lastMessage ? (
                  <>
                    <Text
                      style={{
                        ...styles.separatorDotStyle,
                        transform: [{ translateY: -13 }]
                      }}
                    >
                      {" "}
                      .{" "}
                    </Text>
                    <RegularText
                      style={{
                        ...styles.msgText,
                        marginTop: 0
                      }}
                    >
                      {moment.unix(_lastMessage.createdAt).fromNow()}
                    </RegularText>
                  </>
                ) : (
                  <RegularText
                    style={{
                      ...styles.msgText,
                      marginTop: 0
                    }}
                  >
                    Tap to chat
                  </RegularText>
                )}
              </RowView>
            </RowView>
          </View>
        </TouchableScale>
      </Swipeable>
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

const localStyles = StyleSheet.create({
  leftAction: {
    flex: 1,
    backgroundColor: "#388e3c",
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row"
  },
  actionIcon: {
    width: 30,
    marginHorizontal: 10
  }
});

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
export default connect(mapStateToProps, mapDispatchToProps)(FriendsItem);
