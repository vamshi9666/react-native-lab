import moment from "moment";
import React, { Component } from "react";
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Clipboard
} from "react-native";
import { DotsLoader } from "react-native-indicator";
import Lightbox from "react-native-lightbox";
import Reanimated from "react-native-reanimated";
import Ionicon from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";
import { STATIC_URL } from "../../config/Api";
import {
  msgTypes,
  LEFT_MARGIN,
  months,
  IMAGE_UPLOADING_STATUS,
  GAME_LOGOS
} from "../../config/Constants";
import { DeviceWidth } from "../../config/Device";
import { namify, userNamify } from "../../config/Utils";
import QCard from "./QCard";
import RegularText from "../../components/Texts/RegularText";
import NoFeedbackTapView from "../../components/Views/NoFeedbackTapView";
import JustifiedCenteredView from "../../components/Views/JustifiedCenteredView";
import { BRIGHT_RED, FONT_GREY, FONT_BLACK } from "../../config/Colors";
import CircularImage from "../Views/CircularImage";
import { sharedStyles } from "../../styles/Shared";
import MediumText from "../Texts/MediumText";
import DoubleCircleLoader from "react-native-indicator/lib/loader/DoubleCircleLoader";
import SvgUri from "react-native-svg-uri";
import { shareContent } from "../../redux/actions/nav";
import VerticalGradientView from "../Views/VerticalGradientView";
import RowView from "../Views/RowView";
import { bindActionCreators } from "redux";
import MaskedView from "@react-native-community/masked-view";
import { runRepeatedTiming } from "../../config/Animations";
import Emoji from "react-native-emoji";

moment.locale("en", {
  calendar: {
    lastDay: "[Yesterday]",
    sameDay: "[Today]",
    nextDay: "[Tomorrow]",
    lastWeek: "dddd",
    nextWeek: "dddd",
    sameElse: "L"
  }
});

const { Value, concat } = Reanimated;

class MessageContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animatedHandTouch: new Animated.Value(1),
      lightBoxItem: null,
      showLightBox: false,
      playGif: false,
      isLoading: false
    };
    this.textRef = React.createRef();
  }
  startTappingAnimation = () => {
    const { selectedRoomId, allRooms } = this.props;
    const { animatedHandTouch } = this.state;
    const currentRoom = allRooms[selectedRoomId];

    if (currentRoom.messages && currentRoom.messages.length > 3) {
      return null;
    } else {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedHandTouch, {
            toValue: 0.8,
            duration: 1000,
            easing: Easing.linear()
          }),
          Animated.timing(animatedHandTouch, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear()
          })
        ])
      ).start();
    }
  };

  parseSystemMessageB = () => {
    let { nextMessage } = this.props;
    let parsedNextMessage = JSON.parse(nextMessage.text);

    if (
      parsedNextMessage &&
      parsedNextMessage.length !== 0 &&
      parsedNextMessage[0].response
    ) {
      return true;
    } else {
      return false;
    }
  };

  parseSystemMessageA = () => {
    let { nextMessage } = this.props;
    if (nextMessage.type) {
      if (nextMessage._id === 3) {
        this.props.enableCloser(true);
      }
      return true;
    } else {
      // this.props.setCardVisiblity();
      return false;
    }
  };

  renderSystemMSGCContent = currentMessage => {
    const { myData, targetUser } = this.props;
    const timestamp = new Date(
      currentMessage.createdAt * 1000
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
    const self = currentMessage.text.split("|")[1] === myData._id;
    console.log("mydata and targetuser is: ", myData, targetUser);

    return (
      <>
        <View
          style={{
            width: 35,
            // alignItems: "center",
            marginBottom: -15,
            zIndex: 1,
            alignSelf: "center",
            height: 35,
            marginTop: 10
          }}
        >
          <CircularImage
            height={35}
            source={{
              uri: self
                ? STATIC_URL + myData.images[0].split("uploads")[1]
                : STATIC_URL + targetUser.images[0].split("uploads")[1]
            }}
          />
        </View>
        <View
          style={{
            borderBottomRightRadius: self ? 2.5 : 10,
            borderBottomLeftRadius: self ? 10 : 2.5,
            zIndex: 0,
            alignSelf: "center",
            height: 38,
            width: DeviceWidth * 0.5,
            borderRadius: 10,
            borderColor: BRIGHT_RED,
            borderWidth: 1,
            marginVertical: 5,
            justifyContent: "center"
          }}
        >
          <RegularText
            style={{
              color: BRIGHT_RED,
              fontSize: 16,
              textAlign: "center"
            }}
          >
            {self ? "You got closer" : `${namify(targetUser.name)} got closer`}
          </RegularText>
        </View>
        <RegularText style={{ textAlign: "center" }}>{timestamp}</RegularText>
      </>
    );
  };

  renderSystemMSGBContent = currentMsg => {
    let parsedMsg = JSON.parse(currentMsg.text);
    let { myData, targetUser, isFriend } = this.props;
    let _postedByLoggedInUser = parsedMsg.postedBy === myData._id;
    return (
      <View
        style={{
          flexDirection: _postedByLoggedInUser ? "row-reverse" : "row",
          marginTop: 10
        }}
      >
        <Image
          style={{
            ...styles.userImageSmall,
            marginLeft: _postedByLoggedInUser ? 0 : 30,
            marginRight: _postedByLoggedInUser ? 30 : 0
          }}
          source={{
            uri: _postedByLoggedInUser
              ? STATIC_URL + myData.images[0].split("uploads")[1]
              : STATIC_URL + targetUser.images[0].split("uploads")[1]
          }}
        />
        <Text style={styles.systemMsgBText}>
          {_postedByLoggedInUser
            ? `You sent a card!`
            : `${
                isFriend ? namify(targetUser.name) : userNamify(targetUser)
              } sent you a card!`}
        </Text>
      </View>
    );
  };

  animation = new Value(100);
  initialValue = new Value(0);
  animatedBackGroundWidth = runRepeatedTiming(
    this.initialValue,
    this.animation,
    2500
  );

  renderSystemMSGAContent = currentMsg => {
    let { animatedHandTouch } = this.state;
    let { myData, targetUser, nextMessage, isFriend } = this.props;
    let parsedMsg = JSON.parse(currentMsg.text);
    let _postedByLoggedInUser = parsedMsg.postedBy === myData._id;
    let msg;
    let gotResponse = false;
    if (nextMessage && nextMessage.type) {
      let parsedNextMsg = JSON.parse(nextMessage.text);
      gotResponse = parsedNextMsg.length > 0 && parsedNextMsg[0].response;
    }
    if (gotResponse) {
      msg = _postedByLoggedInUser
        ? `${
            isFriend ? namify(targetUser.name) : userNamify(targetUser)
          } reacted on your profile`
        : `You reacted on ${
            isFriend ? namify(targetUser.name) : userNamify(targetUser)
          }'s profile`;
    } else {
      msg = _postedByLoggedInUser
        ? `Waiting for ${
            isFriend ? namify(targetUser.name) : userNamify(targetUser)
          } to react...`
        : `TAP_TO_REACT`;
    }

    if (msg === "TAP_TO_REACT") {
      return (
        <View style={styles.tapToReactLayout}>
          <TouchableOpacity
            onPress={() => {
              this.props.openFirstProfileCard();
            }}
            style={styles.handTouchView}
          >
            <Animated.View
              style={{
                transform: [{ scale: animatedHandTouch }],
                ...sharedStyles.justifiedCenter
              }}
            >
              <SvgUri
                height={60}
                width={60}
                source={require("../../assets/svgs/Chat/touchFinger.svg")}
              />
            </Animated.View>
          </TouchableOpacity>
          <Text
            style={{
              color: "#FF2D55",
              textAlign: "center",
              fontSize: 16,
              marginTop: 10
            }}
          >
            Tap to react
          </Text>
          <Text style={styles.reactText}>
            React to {userNamify(targetUser)} to become friends{" "}
          </Text>
        </View>
      );
    } else if (msg === `Waiting for ${userNamify(targetUser)} to react...`) {
      return (
        <View
          style={{
            flexDirection: _postedByLoggedInUser ? "row" : "row-reverse",
            marginVertical: 10,
            marginHorizontal: _postedByLoggedInUser ? 0 : LEFT_MARGIN / 2
          }}
        >
          <Image
            style={styles.userImageSmall}
            source={{
              uri: _postedByLoggedInUser
                ? STATIC_URL + targetUser.images[0].split("uploads")[1]
                : STATIC_URL + myData.images[0].split("uploads")[1]
            }}
          />
          <MaskedView
            style={{
              height: 40,
              width: "100%"
            }}
            maskElement={
              <RegularText style={styles.systemMsgBText}>{msg}</RegularText>
            }
          >
            <Reanimated.View
              style={{
                flex: 1,
                height: 40,
                width: concat(this.animatedBackGroundWidth, "%"),
                backgroundColor: FONT_BLACK
              }}
            />
          </MaskedView>
        </View>
      );
    } else
      return (
        <View
          style={{
            flexDirection: _postedByLoggedInUser ? "row" : "row-reverse",
            marginVertical: 10,
            marginHorizontal: _postedByLoggedInUser ? 0 : LEFT_MARGIN / 2
          }}
        >
          <Image
            style={styles.userImageSmall}
            source={{
              uri: _postedByLoggedInUser
                ? STATIC_URL + targetUser.images[0].split("uploads")[1]
                : STATIC_URL + myData.images[0].split("uploads")[1]
            }}
          />
          <Text style={styles.systemMsgBText}>{msg}</Text>
        </View>
      );
  };

  measure = async () =>
    new Promise(resolve =>
      this.textRef.current.measureInWindow((x, y, width, height) => {
        resolve({ x, y, width, height });
      })
    );

  renderTextMessage = self => {
    const {
      currentMessage,
      myData,
      previousMessage,
      showCopyOverlay,
      msgIdTobeCopied
    } = this.props;
    const showDarkBg = msgIdTobeCopied === currentMessage.msgId;

    const isPreviousMessageIsText =
      previousMessage &&
      previousMessage.type &&
      previousMessage.type === msgTypes.MESSAGE_TEXT;
    const isPreviousMessageIsMine =
      previousMessage &&
      previousMessage.user &&
      previousMessage.user._id === myData._id;

    let timestamp = new Date(
      currentMessage.createdAt * 1000
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

    return (
      <NoFeedbackTapView
        onLongPress={async () => {
          let position = await this.measure();
          showCopyOverlay(position, currentMessage.text, currentMessage.msgId);
        }}
        style={[
          {
            marginTop: 5,
            marginRight: 0,
            alignSelf: self ? "flex-end" : "flex-start"
          }
        ]}
      >
        <View
          ref={this.textRef}
          style={[
            {
              // Bumble Pattern
              borderTopRightRadius: self
                ? !isPreviousMessageIsMine || !isPreviousMessageIsText
                  ? 15
                  : 15
                : 15,
              borderTopLeftRadius: !self
                ? !isPreviousMessageIsText || isPreviousMessageIsMine
                  ? 15
                  : 15
                : 15,
              borderBottomLeftRadius: self ? 15 : 5,
              borderBottomRightRadius: self ? 5 : 15,
              backgroundColor: showDarkBg
                ? self
                  ? "#cacaca"
                  : "#774CD5"
                : self
                ? "#f1f2f4"
                : "#774CD5A0"
            },
            styles.msgTextView
          ]}
        >
          <RegularText
            style={{ ...styles.msgText, color: self ? "#4d4b4b" : "#fff" }}
          >
            {currentMessage.text}
          </RegularText>
        </View>
        <RegularText
          style={{
            ...styles.timestampText,
            alignSelf: self ? "flex-start" : "flex-end",
            paddingHorizontal: LEFT_MARGIN * 1.75,
            paddingTop: 2.5
          }}
        >
          {timestamp}
        </RegularText>
      </NoFeedbackTapView>
    );

    return (
      <View
        style={[
          {
            alignItems: "center",
            marginTop: 5,
            marginRight: 0,
            alignSelf: self ? "flex-end" : "flex-start"
          }
        ]}
      >
        <View
          style={[
            {
              // Bumble Pattern
              borderTopRightRadius: self
                ? !isPreviousMessageIsMine || !isPreviousMessageIsText
                  ? 15
                  : 15
                : 15,
              borderTopLeftRadius: !self
                ? !isPreviousMessageIsText || isPreviousMessageIsMine
                  ? 15
                  : 15
                : 15,
              borderBottomLeftRadius: self ? 15 : 5,
              borderBottomRightRadius: self ? 5 : 15,
              backgroundColor: self ? "#f1f2f4" : "#774CD5A0"
            },
            styles.msgTextView
          ]}
        >
          <RegularText
            style={{ ...styles.msgText, color: self ? "#4d4b4b" : "#fff" }}
          >
            {currentMessage.text}
          </RegularText>
        </View>
        <RegularText
          style={{
            ...styles.timestampText,
            alignSelf: self ? "flex-start" : "flex-end",
            paddingHorizontal: LEFT_MARGIN * 1.75,
            paddingTop: 2.5
          }}
        >
          {timestamp}
        </RegularText>
        {/* <Image
          style={styles.userImageBig}
          source={{
            uri: self
              ? STATIC_URL + myData.images[0].split("uploads")[1]
              : STATIC_URL + targetUser.images[0].split("uploads")[1]
          }}
        /> */}
      </View>
    );
  };

  copy = () => {
    const { currentMessage } = this.props;
    Clipboard.setString(currentMessage.text);
  };

  share = () => {
    const { shareContent, currentMessage } = this.props;
    const { question, gameId } = JSON.parse(currentMessage.text);

    let shareObj = {
      options: [],
      question,
      gameId,
      openIn: "ChatWindow"
    };
    shareContent(shareObj);

    setTimeout(() => {
      shareContent(undefined);
    }, 200);
  };

  renderQuestionCard = self => {
    const { currentMessage } = this.props;
    const parsedText = JSON.parse(currentMessage.text);

    return (
      <View
        style={[
          {
            alignSelf: self ? "flex-end" : "flex-start",
            marginRight: self ? 35 : 0,
            marginLeft: self ? 0 : 35,
            marginTop: 10
          },
          styles.questionCardLayout
        ]}
      >
        <VerticalGradientView
          colors={parsedText.gameId.colors}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10
          }}
        >
          <RowView
            style={{
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <SvgUri
              height={30}
              width={30}
              source={GAME_LOGOS[parsedText.gameId.value]}
            />
            <Text style={styles.questionCardGameName}>
              {parsedText.gameId.key}
            </Text>
          </RowView>
          <TouchableOpacity
            style={{
              ...sharedStyles.justifiedCenter,
              height: 40,
              width: 40
            }}
            onPress={this.share}
          >
            <Ionicon name={"ios-share-alt"} size={25} color={"#fff"} />
          </TouchableOpacity>
        </VerticalGradientView>
        <Text style={styles.questionCardGameQuestion}>
          {parsedText.question}
        </Text>
      </View>
    );
  };

  renderTimeStamp = () => {
    const {
      currentMessage: { createdAt }
    } = this.props;
    return (
      <View
        style={{
          ...sharedStyles.justifiedCenter,
          alignSelf: "center",
          height: 22.5,
          paddingHorizontal: LEFT_MARGIN / 2,
          backgroundColor: "rgba(242, 243, 246,0.5)",
          borderRadius: 5,
          marginVertical: 5
        }}
      >
        <MediumText
          style={{
            color: FONT_BLACK
          }}
        >
          {this.formatTimeStamp(moment(parseInt(createdAt) * 1000).calendar())}
        </MediumText>
      </View>
    );
  };

  formatTimeStamp = timestamp => {
    if (timestamp.includes("/")) {
      const date = timestamp.split("/");
      const currentYear = new Date().getFullYear();
      if (Number(date[2]) === currentYear) {
        return `${date[1]} ${months[Number(date[0]) - 1]}`;
      } else {
        return `${date[1]} ${months[Number(date[0]) - 1]} ${date[2]}`;
      }
    } else {
      return timestamp;
    }
  };

  renderTapToRetry = () => {
    const {
      currentMessage: { msgId, text },
      retryImageUpload
    } = this.props;

    return (
      <NoFeedbackTapView
        onPress={() => retryImageUpload(msgId, text)}
        style={{
          ...sharedStyles.justifiedCenter,
          width: DeviceWidth * 0.6,
          height: DeviceWidth * 0.4,
          borderRadius: 10,
          position: "absolute",
          zIndex: 2,
          backgroundColor: "rgba(0,0,0,0.5)"
        }}
      >
        <MaterialIcons name={"file-upload"} color={"#fff"} size={30} />
        <MediumText
          style={{
            color: "#fff",
            textAlign: "center",
            marginTop: 0
          }}
        >
          Tap to retry
        </MediumText>
      </NoFeedbackTapView>
    );
  };

  renderUploadingUI = () => {
    return (
      <View
        style={{
          ...sharedStyles.justifiedCenter,
          width: DeviceWidth * 0.6,
          height: DeviceWidth * 0.4,
          borderRadius: 10,
          position: "absolute",
          zIndex: 2,
          backgroundColor: "rgba(0,0,0,0.5)"
        }}
      >
        <DotsLoader size={10} color={"#fff"} betweenSpace={5} />
      </View>
    );
  };

  renderImage = self => {
    const {
      currentMessage: { text, createdAt, msgId },
      msgsToBeUpdated,
      selectedRoomId
    } = this.props;
    const timestamp = new Date(createdAt * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

    var imageUrl;
    var showLoading = false;
    var showTapToRetry = false;

    if (text.includes("uploads/images/chat_images")) {
      imageUrl = STATIC_URL + text.split("uploads")[1];
      showLoading = false;
    } else {
      imageUrl = text;
      let _currentMsgIndex = msgsToBeUpdated.findIndex(
        item => item.msgId === msgId && item.roomId === selectedRoomId
      );
      if (_currentMsgIndex > -1) {
        let _currentMsgStatus = msgsToBeUpdated[_currentMsgIndex].status;
        if (_currentMsgStatus === IMAGE_UPLOADING_STATUS.UPLOADING) {
          showLoading = true;
        } else if (_currentMsgStatus === IMAGE_UPLOADING_STATUS.SUCCESS) {
          showLoading = false;
          showTapToRetry = false;
        } else if (_currentMsgStatus === IMAGE_UPLOADING_STATUS.FAILED) {
          showTapToRetry = true;
        } else {
          showTapToRetry = false;
          showLoading = false;
        }
      }
    }
    console.log("props got changed: 44", showLoading, msgId);
    return (
      <View
        style={{
          marginTop: 15,
          alignSelf: self ? "flex-end" : "flex-start"
        }}
      >
        {showLoading ? (
          this.renderUploadingUI()
        ) : showTapToRetry ? (
          this.renderTapToRetry()
        ) : (
          <View />
        )}
        <Image
          onLoadEnd={() => this.setState({ isLoading: false })}
          style={{
            width: DeviceWidth * 0.6,
            height: DeviceWidth * 0.4,
            borderRadius: 10,
            marginRight: self ? 15 : 0,
            marginLeft: !self ? 15 : 0,
            backgroundColor: "#f1f2f4",
            borderWidth: 0,
            borderColor: self ? "#f1f2f4" : "#774CD5A0",
            shadowColor: "#000",
            shadowOffset: {
              width: 1,
              height: 1
            },
            shadowOpacity: 0.5
          }}
          resizeMode="center"
          //check here for local or server imag
          source={{
            uri: imageUrl
          }}
        />
        <View
          style={{
            flexDirection: self ? "row" : "row-reverse",
            justifyContent: "space-between",
            marginRight: self ? 10 : 0,
            marginLeft: self ? 0 : 10
          }}
        >
          <Text
            style={{
              ...styles.timestampText,
              marginTop: 2.5,
              paddingLeft: self ? 6 : 0
            }}
          >
            {timestamp}
          </Text>
        </View>
      </View>
    );
  };
  renderStickerMessage = self => {
    const { currentMessage } = this.props;
    const timestamp = new Date(
      currentMessage.createdAt * 1000
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

    const { downsized_still } = JSON.parse(currentMessage.text.replace("", ""));

    const isLargeHeight = parseInt(downsized_still.height) > DeviceWidth * 0.75;

    return (
      <View
        style={{
          marginVertical: 3,
          alignSelf: self ? "flex-end" : "flex-start"
        }}
      >
        <Lightbox
          underlayColor={"#0000"}
          swipeToDismiss={true}
          backgroundColor={"#0000"}
          renderHeader={close => (
            <TouchableOpacity style={[styles.closeIcon]} onPress={close}>
              <Ionicon name={"md-close"} size={30} color={"#fff"} />
            </TouchableOpacity>
          )}
          onOpen={() => this.setState({ showRunningGif: false })}
          willClose={() => this.setState({ showRunningGif: false })}
        >
          <Image
            onLoadStart={() => this.setState({ isLoading: true })}
            onLoadEnd={() => this.setState({ isLoading: false })}
            source={{ uri: downsized_still.url }}
            style={{
              width: DeviceWidth * 0.8,
              height: isLargeHeight
                ? parseInt(downsized_still.height) / 3
                : parseInt(downsized_still.height),
              width:
                parseInt(downsized_still.height) > DeviceWidth
                  ? parseInt(downsized_still.width) / 3
                  : parseInt(downsized_still.width),
              borderRadius: 10,
              marginRight: self ? 15 : 0,
              marginLeft: !self ? 15 : 0
            }}
            resizeMode="contain"
          />
        </Lightbox>
        <RegularText
          style={{
            ...styles.timestampText,
            alignSelf: self ? "flex-start" : "flex-end",
            paddingHorizontal: LEFT_MARGIN / 2
          }}
        >
          {timestamp}
        </RegularText>
      </View>
    );
  };

  renderGifMessage = self => {
    const { currentMessage } = this.props;
    const { playGif, isLoading } = this.state;

    const timestamp = new Date(
      currentMessage.createdAt * 1000
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

    const { original, downsized_still } = JSON.parse(
      currentMessage.text.replace("", "")
    );

    const isLargeHeight = parseInt(downsized_still.height) > DeviceWidth * 0.75;

    return (
      <View
        style={{
          marginVertical: 3,
          alignSelf: self ? "flex-end" : "flex-start"
        }}
      >
        <Lightbox
          underlayColor={"#0000"}
          swipeToDismiss={true}
          backgroundColor={"rgba(0,0,0,0.7)"}
          renderHeader={close => (
            <TouchableOpacity style={[styles.closeIcon]} onPress={close}>
              <Ionicon name={"md-close"} size={30} color={"#fff"} />
            </TouchableOpacity>
          )}
          onOpen={() => this.setState({ showRunningGif: false })}
          willClose={() => this.setState({ showRunningGif: false })}
        >
          <View>
            <NoFeedbackTapView
              onPress={() => {
                this.setState({ playGif: true });
              }}
              style={{
                height: isLargeHeight
                  ? parseInt(downsized_still.height) / 2
                  : parseInt(downsized_still.height),
                width:
                  parseInt(downsized_still.height) > DeviceWidth
                    ? parseInt(downsized_still.width) / 2
                    : parseInt(downsized_still.width),
                position: "absolute",
                backgroundColor:
                  playGif || !isLoading ? "rgba(0,0,0,0)" : "rgba(0,0,0,0.6)",
                maxWidth: DeviceWidth * 0.8,
                borderRadius: 10,
                marginRight: self ? 15 : 0,
                marginLeft: !self ? 15 : 0,
                zIndex: 1,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {isLoading ? (
                <DoubleCircleLoader size={40} color={"#fff"} />
              ) : (
                <JustifiedCenteredView
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 20,
                    backgroundColor: "#fff",
                    opacity: playGif ? 0 : 1
                  }}
                >
                  <RegularText>GIF</RegularText>
                </JustifiedCenteredView>
              )}
            </NoFeedbackTapView>
            <Image
              onLoadStart={() => this.setState({ isLoading: true })}
              onLoadEnd={() => {
                this.setState({ isLoading: false });
                if (this.state.playGif) {
                  setTimeout(() => {
                    this.setState({ playGif: false });
                  }, 12000);
                }
              }}
              source={{ uri: playGif ? original.url : downsized_still.url }}
              style={{
                height: isLargeHeight
                  ? parseInt(downsized_still.height) / 2
                  : parseInt(downsized_still.height),
                width:
                  parseInt(downsized_still.height) > DeviceWidth
                    ? parseInt(downsized_still.width) / 2
                    : parseInt(downsized_still.width),
                maxWidth: DeviceWidth * 0.8,
                borderRadius: 10,
                marginRight: self ? 15 : 0,
                marginLeft: !self ? 15 : 0,
                backgroundColor: "#f1f2f4"
              }}
            />
          </View>
        </Lightbox>
        <RegularText
          style={{
            ...styles.timestampText,
            alignSelf: self ? "flex-start" : "flex-end",
            paddingHorizontal: LEFT_MARGIN / 2,
            paddingTop: 2.5
          }}
        >
          {timestamp}
        </RegularText>
      </View>
    );
  };

  renderSpark = self => {
    const { currentMessage } = this.props;

    const timestamp = new Date(
      currentMessage.createdAt * 1000
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
    return (
      <View
        style={{
          alignItems: "center",
          marginTop: 10,
          marginRight: self ? 30 : 0,
          marginLeft: self ? 0 : 30,
          alignSelf: self ? "flex-end" : "flex-start"
        }}
      >
        <View
          style={{
            padding: 10,
            paddingTop: 14,
            paddingRight: 12,
            backgroundColor: "#fff",
            shadowColor: "#000",
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            height: 70,
            width: 70,
            borderRadius: 35,
            ...sharedStyles.justifiedCenter
          }}
        >
          <SvgUri
            height={50}
            width={50}
            source={require("../../assets/svgs/ProfileModal/activeSpark.svg")}
          />
        </View>
        <RegularText
          style={{
            ...styles.timestampText,
            alignSelf: self ? "flex-start" : "flex-end",
            transform: [
              {
                translateX: self ? -10 : 10
              },
              {
                translateY: 10
              }
            ],
            marginBottom: 10
          }}
        >
          {timestamp}
        </RegularText>
      </View>
    );
  };

  renderSystemMessageDContent = self => {
    const { targetUser, myData, isFriend } = this.props;

    const sparkMessage = self
      ? "You sent a spark!"
      : `${
          isFriend ? namify(targetUser.name) : userNamify(targetUser)
        } sent a spark!`;

    return (
      <View
        style={{
          marginTop: 5,
          marginRight: 0,
          alignSelf: self ? "flex-end" : "flex-start",
          flexDirection: self ? "row-reverse" : "row"
        }}
      >
        <Image
          style={styles.userImageSmall}
          source={{
            uri: self
              ? STATIC_URL + myData.images[0].split("uploads")[1]
              : STATIC_URL + targetUser.images[0].split("uploads")[1]
          }}
        />
        <Text style={styles.systemMsgBText}>{sparkMessage}</Text>
      </View>
    );
  };

  renderEomticon = self => {
    const { currentMessage } = this.props;
    const timestamp = new Date(
      currentMessage.createdAt * 1000
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

    return (
      <View
        style={{
          paddingHorizontal: LEFT_MARGIN / 3,
          alignSelf: self ? "flex-end" : "flex-start"
        }}
      >
        <Emoji
          name={currentMessage.text}
          style={{ fontSize: DeviceWidth * 0.125 * 1.5 }}
        />
        <RegularText
          style={{
            ...styles.timestampText,
            alignSelf: self ? "flex-start" : "flex-end",
            transform: [
              {
                translateX: self ? -10 : 10
              },
              {
                translateY: 10
              }
            ],
            marginBottom: 10
          }}
        >
          {timestamp}
        </RegularText>
      </View>
    );
  };

  render() {
    const {
      currentMessage,
      myData,
      targetUser,
      previousMessage,
      nextMessage,
      openResponseScreen,
      setCurrentMessage
    } = this.props;
    const self = myData._id === currentMessage.user._id;
    // let showImage = false;

    // if (previousMessage.sender ) {
    // console.log("show image result is 1 ");
    if (nextMessage.sender !== currentMessage.sender) {
      console.log("show image result is 2 ");
      // showImage = true;
      // if(nextMessage)
      // if (nextMessage.sender) {
      // console.log("show image result is  3 ");

      if (previousMessage.sender === currentMessage.sender) {
        showImage = true;
        console.log("show image result is this happpedn");
      }
      // } else {
      //   console.log("show image result is  5 ");

      //   showImage = false;
      // }
      // }
    }
    let showImage =
      currentMessage.sender ===
        (previousMessage.sender && previousMessage.sender) &&
      currentMessage.sender !== nextMessage.sender;
    // const _transX = Reanimated.diffClamp(this.selfMessageTransx, -50, 30);
    // console.log(" show image result is ", nextMessage);

    const sentTime = moment(parseInt(currentMessage.createdAt) * 1000);
    const diff = moment().diff(sentTime, "days");
    let formatedTimeText;

    if (diff === 0) {
      //same day
      formatedTimeText = "today";
    } else if (diff === 1) {
      formatedTimeText == "yesterday";
    } else {
      formatedTimeText = sentTime.format();
    }
    return (
      <View
        style={{
          width: DeviceWidth
        }}
      >
        {(currentMessage && currentMessage.type === msgTypes.MESSAGE_CARD) ||
        currentMessage.type === msgTypes.MESSAGE_CHAT_CARD ? (
          <QCard
            openResponseScreen={openResponseScreen}
            setCurrentMessage={setCurrentMessage}
            targetUser={targetUser}
            currentMessage={currentMessage}
            showImage={currentMessage.type === msgTypes.MESSAGE_CHAT_CARD}
            myData={myData}
          />
        ) : currentMessage.type === msgTypes.MESSAGE_SYSTEM_A ? (
          this.renderSystemMSGAContent(
            currentMessage,
            showImage,
            formatedTimeText
          )
        ) : currentMessage.type === msgTypes.MESSAGE_SYSTEM_B ? (
          this.renderSystemMSGBContent(
            currentMessage,
            showImage,
            formatedTimeText
          )
        ) : currentMessage.type === msgTypes.MESSAGE_TEXT ? (
          this.renderTextMessage(self, showImage, formatedTimeText)
        ) : currentMessage.type === msgTypes.MESSAGE_SYSTEM_C ? (
          this.renderSystemMSGCContent(currentMessage, self)
        ) : currentMessage.type === msgTypes.MESSAGE_GIF ? (
          this.renderGifMessage(self, showImage, formatedTimeText)
        ) : currentMessage.type === msgTypes.MESSAGE_STICKERS ? (
          this.renderStickerMessage(self)
        ) : currentMessage.type === msgTypes.MESSAGE_QUESTION_CARD ? (
          this.renderQuestionCard(self, showImage, formatedTimeText)
        ) : currentMessage.type === msgTypes.IMAGE ? (
          this.renderImage(self)
        ) : currentMessage.type == msgTypes.TIMESTAMP ? (
          this.renderTimeStamp()
        ) : currentMessage.type === msgTypes.SPARK ? (
          this.renderSpark(self)
        ) : currentMessage.type === msgTypes.MESSAGE_EMOTICONS ? (
          this.renderEomticon(self)
        ) : currentMessage.type === msgTypes.MESSAGE_SYSTEM_D ? (
          this.renderSystemMessageDContent(self, currentMessage)
        ) : (
          <Text>Msg Type not defined</Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  questionCardGameQuestion: {
    color: "#1E2432",
    fontSize: 16,
    fontWeight: "500",
    padding: 22,
    paddingTop: 10,
    lineHeight: 23,
    fontWeight: "600"
  },
  questionCardGameName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    // transform: [{ translateX: -10 }]
    // marginTop: 10,
    marginLeft: 10
  },
  questionCardGradient: {
    height: 50,
    flexDirection: "row",
    flex: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  questionCardLayout: {
    width: DeviceWidth * 0.72,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.2,
    elevation: 3,
    shadowRadius: 10
  },
  systemMsgBText: {
    color: "#4E586E",
    marginHorizontal: 10,
    marginTop: 5,
    fontSize: 16
  },
  userImageSmall: {
    height: 30,
    width: 30,
    borderRadius: 15,
    marginLeft: 10
  },
  msgText: {
    paddingHorizontal: 20,
    textAlign: "center",
    // color: "#4d4b4b",
    paddingVertical: 15,
    fontSize: 16
  },
  msgTextView: {
    // borderBottomRightRadius: 10,
    height: "auto",
    // borderBottomLeftRadius: 10,
    // backgroundColor: "#f1f2f4",
    flexWrap: "wrap",
    marginHorizontal: 20
  },
  timestampText: {
    fontSize: 11,
    color: FONT_GREY
  },
  userImageBig: {
    height: 30,
    width: 30,
    borderRadius: 15,
    transform: [{ translateY: 10 }],
    marginHorizontal: 5,
    alignSelf: "flex-end"
  },
  closeIcon: {
    position: "absolute",
    right: 20,
    top: 30
  },
  baseLayout: {
    marginVertical: 2
  },
  tapToReactLayout: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    marginVertical: 30
  },
  handTouchView: {
    height: 80,
    width: 80,
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 40
  },
  handTouchIcon: {
    height: 55,
    width: 40,
    marginTop: 10
  },
  reactText: {
    fontSize: 16,
    color: "#4E586E",
    marginHorizontal: 10,
    textAlign: "center",
    marginTop: 20
  },
  cardsListView: {
    height: 140
  }
});

const mapStatetoProps = state => {
  return {
    myData: state.info.userInfo,
    allRooms: state.rooms.rooms,
    selectedRoomId: state.rooms.selected_room_id,
    msgsToBeUpdated: state.nav.msgsToBeUpdated
  };
};

const mapDispatchToProps = dispatch => {
  return {
    shareContent: bindActionCreators(shareContent, dispatch)
  };
};

export default connect(mapStatetoProps, mapDispatchToProps)(MessageContainer);
