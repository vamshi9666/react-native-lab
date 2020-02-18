import Lodash from "lodash";
import _find from "lodash/find";
import moment from "moment";
import React, { Component } from "react";
import {
  Alert,
  Clipboard,
  Image,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  View
} from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import Animated from "react-native-reanimated";
import SvgUri from "react-native-svg-uri";
import Ionicon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import BottomSheet from "reanimated-bottom-sheet";
import { bindActionCreators } from "redux";
import RoundedEdgeButton from "../../components/Buttons/RoundedEdgeButton";
import GiphyPicker from "../../components/ChatWindow/Giphy.picker";
import MessageContainer from "../../components/ChatWindow/Message.container";
import MessageInputContainer from "../../components/ChatWindow/MessageInputContainer";
import PermissionWidget from "../../components/ChatWindow/PermissionWidget";
import StarPopUp from "../../components/ChatWindow/StarPopUp";
import WaitingBar from "../../components/ChatWindow/Waiting.bar";
import BulkPurchaseModal from "../../components/Common/BulkPurchaseModal";
import BundleConfirmationModal from "../../components/Common/BundleConfirmationModal";
import DeleteConversationModal from "../../components/Common/DeleteConversationModal";
import NewCloserModal from "../../components/Common/NewCloserModal";
import AnimateCountModal from "../../components/Gemsflow/AnimateCount.modal";
import BuyModal from "../../components/Gemsflow/BuyModal";
import GemCountModal from "../../components/Gemsflow/GemCountModal";
import BlockAndReportReasonsModal from "../../components/Profile.Modal/BlockAndReportReasonsModal";
import Response from "../../components/Profile.Modal/Response";
import QuestionPicker from "../../components/QuestionPicker/Main.screen";
import GradientHeader from "../../components/Surfing/Gradient.header";
import BoldText from "../../components/Texts/BoldText";
import MediumText from "../../components/Texts/MediumText";
import RegularText from "../../components/Texts/RegularText";
import OneTimeMonetisationTutorial from "../../components/Tutorials/OneTimeMonetisationTutorial";
import SharePreview from "../../components/Utility/Share.preview";
import CloserModal from "../../components/Views/Closer.modal";
import ModalCurvedcard from "../../components/Views/Modal.curvedcard";
import NoFeedbackTapView from "../../components/Views/NoFeedbackTapView";
import RowView from "../../components/Views/RowView";
import VerticalGradientView from "../../components/Views/VerticalGradientView";
import {
  FONT_BLACK,
  FONT_GREY,
  LIGHT_PURPLE,
  PURPLE
} from "../../config/Colors";
import {
  appConstants,
  CRON_TASKS,
  EXPENSE_THRESHOLD_COUNT,
  gemPlanColors,
  IMAGE_UPLOADING_STATUS,
  LEVELS_INTERVAL_IN_MINUTES,
  msgTypes
} from "../../config/Constants";
import { DeviceHeight, DeviceWidth } from "../../config/Device";
import { getTimeStamp, userNamify } from "../../config/Utils";
import { uploadImage } from "../../network/chat";
import * as PackApi from "../../network/pack";
import * as QuestionApi from "../../network/question";
import * as RoomApi from "../../network/rooms";
import { getRooms } from "../../network/rooms";
import {
  getUserPacks,
  sendSpark,
  useFreeSpark,
  usePurchasedPack
} from "../../network/spark";
import * as UserApi from "../../network/user";
import * as appActions from "../../redux/actions/app";
import * as msgActions from "../../redux/actions/chat";
import {
  addNewResponse,
  pushUploadingImageMsgId,
  resetResponses,
  setCloserPopoverVisibility,
  setFirebaseNotification,
  setQuestionCardVisibility,
  updateUploadingImageStatus
} from "../../redux/actions/nav";
import { setChatTextDot } from "../../redux/actions/notification";
import * as ChatActions from "../../redux/actions/rooms";
import {
  addSparkToRoom,
  removeOneRoom,
  resetCurrentRoomId
} from "../../redux/actions/rooms";
import {
  addExpenseTutorialCount,
  setTutorialRoom
} from "../../redux/actions/tutorials";
import * as infoActions from "../../redux/actions/user.info";
import { sharedStyles } from "../../styles/Shared";
import ChatBoxHeaderGradient from "./../../components/ChatWindow/ChatBoxHeader.gradient";
import ProfileModal from "./../../components/Surfing/ProfileModal";
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

// export const states = {
//   NOT_FRIEND: "NOT_FRIEND",
//   WAITING_FOR_OTHER: "WAITING_FOR_OTHER",
//   CLICKED_BY_ME: "CLICKED_BY_ME",
//   CLICKED_BY_OTHER: "CLICKED_BY_OTHER",
//   CLICKED_ON_BOTH_SIDES: "CLICKED_ON_BOTH_SIDES"
// };

class ChatWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      isModalVisible: false,
      hideQuestionCards: false,
      newQuestions: [],
      friends_id: "",
      typingMessage: "",
      showCloserButton: true,
      showModal: false,
      messagingEnabled: false,
      showCloserButton: true,
      showBlackBg: false,
      closerEnabled: false,
      showCards: false,
      modalVisible: false,
      fromHandTouchIcon: false,
      showQuestionPicker: false,
      translateProfileModal: new Animated.Value(DeviceHeight),
      translateQuestionPickerModal: new Animated.Value(DeviceHeight),
      translateGiphyPickerModal: new Animated.Value(DeviceHeight),
      enableLoadEarlierButton: false,
      showBlockReasonsModal: false,
      blockReasons: [],
      targetUser: {},
      activeProfilePosts: {},
      extendBtnLoading: false,
      closerBtnLoading: false,
      celebrationModalVisible: false,
      extensionPack: null,
      isPurchaseConfirmationVisible: false,
      disabledLoadEarlier: false,
      senderMsgId: "",
      imagePath: null,
      currentMessage: null,
      deleteConversation: null,
      // msgIdToBeUpdated: [],
      pickersEnabled: false,
      roomLevel: null,
      buyPower: null,
      consumptionConfirmation: null,
      showCloserPopupAfterClosingOthersProfile: false,
      btmSheetOpened: false,
      hideProfileCards: false,
      isBundlePurchaseModalVisible: false,
      bulkPurchase: null,
      isAnimatedCountVisilble: false,
      // animatedCount: null,
      itemIcon: null,
      fromCount: null,
      toCount: null,
      showSharePreview: false,
      shareableContent: {},
      showImagePreview: false,
      showCopyOverlay: false,
      showPermissionWidget: true,
      responseModalPosts: {},
      isGameUnlockModalVisible: false,
      unlockedGameName: "",
      isBuyGemsModalVisible: false,
      bundleConfirmation: null,
      isBundleConfirmationModalVisible: false,
      showOneTimeMonetisationTutorialSlides: false,
      monetisationTutorialName: "",
      onCountAnimated: null,
      isNewCloserModalVisible: false,
      starPopupVisible: false
    };
    this.btmSheetY = new Animated.Value(1);
    this.toggleProfileModal = this.toggleProfileModal.bind(this);
    this.profileModalRef = React.createRef();
    // this.questionPicker = React.createRef();
  }

  setShowCloserpopup = () => {
    this.setState({ showCloserPopupAfterClosingOthersProfile: true });
  };

  toggleProfileModal(toValue, fromHandTouchIcon) {
    this.btmSheetRef.snapTo(1);
    this.setState({
      modalVisible: toValue === -1 ? true : false,
      fromHandTouchIcon: toValue === -1 && fromHandTouchIcon ? true : false
    });
  }

  fetchNewQuestions = (name, category, index) => {
    this.props.getLatestQuestions(name, category, index).then(() => {
      const { latestQuestionsResponse } = this.props;
      if (latestQuestionsResponse.success) {
        const { data } = latestQuestionsResponse;
        if (data.data.length > 0) {
          this.setState({
            newQuestions: data.data
          });
        }
      }
    });
  };
  fetchPosts = async () => {
    let { myData } = this.props;
    this.props.getProfilePosts(myData._id).then(() => {
      const { getPostsOnProfileResponse } = this.props;
      console.log("getPostsOnProfileResponse ", getPostsOnProfileResponse);
      if (
        getPostsOnProfileResponse.success &&
        getPostsOnProfileResponse.data.length > 0
      ) {
        const games = {};
        getPostsOnProfileResponse.data.forEach(question => {
          const questionName = question.question.name;
          if (games[questionName]) {
            games[questionName].push(question);
          } else {
            games[questionName] = [];
            games[questionName].push(question);
          }
        });
        console.log("result after games ", games);
        this.setState({
          posts: games,
          pickedQuestions: getPostsOnProfileResponse.data
        });
      }
    });
  };

  initiateMessages = async setInitialCronSchedule => {
    const { selectedRoomId, allRooms, cronState } = this.props;
    const messages = allRooms[selectedRoomId].messages;
    let renderMessages = [];
    if (messages.length > 0) {
      //check
      let pickersEnabled = true;
      // if ( currentChatScreenIndex === 1){

      //   const allMessages = Object.assign([], messages);
      //   const fourMessages = allMessages.slice(0, 4);
      //   const isMyMessages = fourMessages.every(msg => msg.sender === myData._id);
      //   console.log(" is my messages are ", fourMessages, isMyMessages);
      //   if (isMyMessages) {
      //     fourMessages.forEach(msg => {
      //       switch (msg.type) {
      //         case msgTypes.MESSAGE_CARD: {
      //           pickersEnabled = pickersEnabled && hasMsgResponse(msg.body);
      //         }
      //         default:
      //           pickersEnabled = false;
      //       }
      //     });
      //   }
      // }
      // this.setState({
      //   pickersEnabled
      // });

      //check
      messages.map((msg, msgId) => {
        renderMessages.push({
          _id: msgId,
          type: msg.type,
          text: msg.body,
          msgId: msg.msgId,
          objId: msg._id,
          createdAt: msg.createdAt,
          // isLastFromUser,
          user: {
            _id: msg.sender
          }
        });
      });
      console.log(" rendermessages are ", renderMessages);

      this.setState(
        {
          messages: renderMessages
          // pickersEnabled
        },
        () => {
          if (cronState && setInitialCronSchedule) {
            this.setInitialCronJobSchedule();
          }
        }
      );
    }
    if (messages.length > 7) {
      const messagesLength = messages.length - 1;
      if (messages[messagesLength - 1].type === msgTypes.MESSAGE_SYSTEM_A) {
        this.setState({ enableLoadEarlierButton: false });
      } else {
        this.setState({ enableLoadEarlierButton: true });
      }
    } else {
      this.setState({ enableLoadEarlierButton: false });
    }
  };

  loadEarlierMessages = () => {
    const { selectedRoomId } = this.props;
    this.props
      .getMessages(selectedRoomId, 1, 25)
      .then(async () => {
        const { messages } = this.props;
        console.log("now messages from graphQL:", messages);
        if (messages && messages.messages) {
          let renderMessages = [];
          messages.messages.map((msg, msgId) => {
            renderMessages.push({
              _id: this.state.messages.length + msgId,
              type: msg.type,
              text: msg.body,
              objId: msg._id,
              msgId: msg.msgId,
              createdAt: msg.createdAt,
              user: {
                _id: msg.sender
              }
            });
          });
          this.setState(previousState => ({
            messages: GiftedChat.prepend(
              previousState.messages,
              renderMessages
            ),
            enableLoadEarlierButton: false
          }));
        }
      })
      .catch(err => {
        alert("Error while loading earlier messages " + err);
      });
  };

  getMessages = () => {
    this.props
      .getMessages(targetRoomId)
      .then(async () => {
        const { messages } = this.props;
        if (messages.error) {
          // alert("Something went wrong");
        } else {
          let renderMessages = [];
          console.log(" messages .messgaes :", messages.messages);
          let dbMessages = messages.messages;
          if (dbMessages.length > 0) {
            dbMessages.map((msg, msgId) => {
              console.log(" each message ", msg);
              renderMessages.push({
                _id: msgId,
                type: msg.type,
                text: msg.body,
                msgId: msg._id,
                createdAt: moment(parseInt(msg.createdAt) * 1000).format(),
                user: {
                  _id: msg.sender
                }
              });
            });
            await this.setState({
              messages: renderMessages
            });
            // this.props
            //   .subscribeToRoom(targetRoomId)
            //   .then(() => {
            //     console.log("subscribed successfully");
            //   })
            //   .catch(err => {
            //     console.log("subscription failed");
            //   });
            console.log("after setState ", this.state);
          }
        }
      })
      .catch(err => {
        console.log("Erro while");
      });
  };
  fetchUserPosts = userId => {
    UserApi.getPosts(userId, postsResponse => {
      if (postsResponse.success) {
        let processedPosts = {};

        postsResponse.data.forEach(post => {
          const questionName = post.questionId.gameId._id;
          if (processedPosts[questionName]) {
            processedPosts[questionName].push(post);
          } else {
            processedPosts[questionName] = [post];
            // processedPosts[questionName].push(post);
          }
        });
        this.setState({
          activeProfilePosts: processedPosts
        });
      } else {
        alert(" error in fetching this user posts");
      }
    });
  };

  showGameUnlockModal = gameName => {
    const { isFriend, allRooms, selectedRoomId, myData } = this.props;
    const { roomLevel } = this.state;
    const room = allRooms[selectedRoomId];

    this.setState(
      {
        unlockedGameName: gameName,
        isGameUnlockModalVisible: true
      },
      () => this.openCloserModal()
    );
  };
  updateGameUnlocks = (gameId, isPostedBy) => {
    const { allRooms, selectedRoomId, myData, allGameNames } = this.props;

    const room = allRooms[selectedRoomId];
    const updateField = isPostedBy ? "postedBy" : "answeredBy";
    const newGameIds = room.gameUnlocksSeen[updateField];
    console.log(" 111 before push is ", room.gameUnlocksSeen, newGameIds);
    newGameIds.push(gameId);
    const updates = {
      gameUnlocksSeen: {
        ...room.gameUnlocksSeen,
        [updateField]: newGameIds
      }
    };
    console.log(" updates are ", room._id, selectedRoomId, updates);
    RoomApi.updateRommObj(room._id, updates, updateResult => {
      console.log(" update result is ", updateResult);
      if (updateResult.success) {
        this.fetchRoomsData();
      }
    });
  };
  checkAndVibrate = () => {
    const { myData } = this.props;
    const { vibrationsEnabled = true } = myData;

    if (vibrationsEnabled) {
      Vibration.vibrate(VIBRATION_DURATION);
    }
  };
  checkLevelForGameUnlocks = () => {
    const { roomLevel, isGameUnlockModalVisible } = this.state;
    const { allRooms, selectedRoomId, myData, allGameNames } = this.props;

    const room = allRooms[selectedRoomId];
    console.log(" room is ", room);
    const { postedBy, gameUnlocksSeen } = room;
    const isPostedBy = postedBy._id === myData._id;

    const userSeenGameUnlocks =
      gameUnlocksSeen[isPostedBy ? "postedBy" : "answeredBy"];

    console.log(" user seen unlocks are ", userSeenGameUnlocks);
    if (roomLevel >= 2) {
      const gameObj = allGameNames.find(game => game.value === "VIBE");
      if (!userSeenGameUnlocks.includes(gameObj._id)) {
        this.updateGameUnlocks(gameObj._id, isPostedBy);
        this.showGameUnlockModal("VIBE");
        this.checkAndVibrate();
      }
    }
    if (roomLevel >= 7) {
      if (!isGameUnlockModalVisible) {
        const gameObj = allGameNames.find(game => game.value === "CONFESSIONS");
        if (!userSeenGameUnlocks.includes(gameObj._id)) {
          this.updateGameUnlocks(gameObj._id, isPostedBy);
          this.showGameUnlockModal("CONFESSIONS");
          this.checkAndVibrate();
        }
      }
    }
  };
  fetchAndSetLevel = () => {
    const { selectedRoomId } = this.props;
    RoomApi.getRoomObj(selectedRoomId, roomObjRes => {
      console.log(" room Obj is ", roomObjRes);
      if (roomObjRes.success) {
        const {
          postedUserActiveTime,
          answeredUserActiveTime,
          status
        } = roomObjRes.data;

        const finalTime =
          postedUserActiveTime > answeredUserActiveTime
            ? answeredUserActiveTime
            : postedUserActiveTime;

        // const
        const interval = LEVELS_INTERVAL_IN_MINUTES * 60;
        const roomLevel = Math.round(Math.floor(finalTime / interval));
        console.log(" roomlevel is ", roomLevel, finalTime);
        this.setState(
          {
            // commonTime: finalTime,
            roomLevel
          },
          () => {
            if (status !== "SLOT") {
              console.log(
                " before check debugger One 000",
                status,
                status !== "SLOT"
              );
              this.checkLevelForGameUnlocks();
            }
          }
        );
      }
    });
  };
  componentDidMount = () => {
    const {
      allReasons,
      selectedRoomId,
      gemPacks,
      allRooms,
      myData,
      setCloserPopoverVisibility,
      currentChatScreenIndex,
      cronState
    } = this.props;
    const room = allRooms[selectedRoomId];
    let blockReasons = allReasons.filter(({ text, type, _id }) => {
      if (type === "FRIENDS") {
        return true;
      }
    });
    const pack = _find(gemPacks, { key: "EXTENSIONS" });
    const targetUser =
      room.postedBy._id === this.props.myData._id
        ? room.answeredBy
        : room.postedBy;
    const { messages = [] } = room;
    const unread_messages = messages.filter(message => {
      return !message.read;
    });
    let isFoundMessageC = false;
    let isFoundMessageSpark = false;
    let isFoundMessageCard = false;
    this.fetchAndSetLevel();
    this.uptimeInterval = setInterval(() => {
      this.fetchAndSetLevel();
    }, 30000);
    console.log(" unread messages are 1 ", unread_messages);
    unread_messages.forEach(message => {
      isFoundMessageC =
        isFoundMessageC ||
        (!message.read && message.type === msgTypes.MESSAGE_SYSTEM_C);
    });
    /**
     *
     * If user is in cronState
     * If currentRoom is not in tutorialsArray
     * If opponentUnreadMsg === msgCard or Spark
     *
     */

    if (currentChatScreenIndex === 2) {
      unread_messages.forEach(message => {
        if (!message.read && message.type === msgTypes.MESSAGE_CARD) {
          if (message.sender !== myData._id) {
            const msgIdFactor = parseInt(message.msgId.substring(1));
            if (msgIdFactor === 2) {
              console.log(" unread messages are 2 ", message.msgId);
              isFoundMessageCard = true;
            }
          }
        }

        if (!message.read && message.type === msgTypes.SPARK) {
          if (message.sender !== myData._id) {
            const msgIdFactor = parseInt(message.msgId.substring(1));
            if (msgIdFactor === 2) {
              console.log(" unread messages are 3 ", message.msgId);
              isFoundMessageSpark = true;
            }
          }
        }
      });
    }

    if (messages.length > 0) {
      messages.forEach(message => {
        if (
          message.sender === myData._id &&
          message.type === msgTypes.MESSAGE_CARD
        ) {
          this.setState({ hideProfileCards: true });
        }
      });
    }

    setTimeout(() => {
      if (isFoundMessageC) {
        this.showGotCloserModal();
      }
      if (isFoundMessageSpark || isFoundMessageCard) {
        setCloserPopoverVisibility(true);
        if (cronState) {
          this.setInitialCronJobSchedule();
        }
      }
    }, 500);
    this.setState({
      targetUser,
      blockReasons,
      extensionPack: pack,
      senderMsgId: room.postedBy._id === this.props.myData._id ? "p" : "a"
    });
    this.fetchUserPosts(targetUser._id);
    this.initiateMessages();
    this.subcribeToTypingStatus(selectedRoomId);
    this.props.resetUnreadMessages(selectedRoomId);
    setTimeout(() => {
      this.setState({ showQuestionPicker: true });
    }, 700);
    // this.props
    //   .subscribeToRoom(room._id)
    //   .then(() => {
    //     console.log("subscribed successfully");
    //   })
    //   .catch(err => {
    //     console.log("subscription failed");
    //   });
  };

  subcribeToTypingStatus = roomId => {
    console.log(" subcribing to typing status is ", roomId);
    this.props.subcribeToTypingStatus(roomId);
  };

  enableCloser = bool => {
    console.log("closer enabled ", bool);
    if (bool) {
      this.getMessages();
    }
    this.setState({
      closerEnabled: bool
    });
  };
  openOtherProfileModal = () => {
    this.setState({ modalVisible: true });
  };
  retryImageUpload = (msgId, imageUri) => {
    const {
      setMessage,
      updateUploadingImageStatus,
      selectedRoomId
    } = this.props;

    const msg = imageUri;
    const type = msgTypes.IMAGE;
    const newMsgId = msgId;

    updateUploadingImageStatus(
      selectedRoomId,
      newMsgId,
      IMAGE_UPLOADING_STATUS.UPLOADING
    );
    this.uploadImageMethod(newMsgId, msg);
    setMessage(msg, type, String(getTimeStamp()))
      .then(val => {
        //
      })
      .catch(err => {
        console.log("Error while setting msg:", err);
      });
  };
  renderCopyOverlay = () => {
    const { msgTextToBeCopied, position } = this.state;
    return (
      <NoFeedbackTapView
        onPress={() =>
          this.setState({ showCopyOverlay: false, msgIdTobeCopied: null })
        }
        style={{
          position: "absolute",
          zIndex: 100,
          backgroundColor: "#0000",
          height: DeviceHeight,
          width: DeviceWidth
        }}
      >
        <NoFeedbackTapView
          onPress={() => {
            Clipboard.setString(msgTextToBeCopied);
            this.setState({ showCopyOverlay: false, msgIdTobeCopied: null });
          }}
          style={{
            position: "absolute",
            left: position.x - 20,
            top:
              position.y > DeviceHeight * 0.15
                ? position.y - 60
                : position.y + position.height + 50,
            marginHorizontal: 20,
            backgroundColor: "#000",
            borderRadius: 10,
            padding: 15,
            ...sharedStyles.justifiedCenter
          }}
        >
          <RegularText style={{ ...styles.msgText, color: "#fff" }}>
            Copy
          </RegularText>
        </NoFeedbackTapView>
        <View
          style={{
            position: "absolute",
            height: 20,
            width: 20,
            borderRadius: 4,
            backgroundColor: "#000",
            transform: [
              {
                rotateZ: "45deg"
              }
            ],
            left: position.x + 20,
            top: position.y - 27
          }}
        />
      </NoFeedbackTapView>
    );
  };
  showCopyOverlay = (position, msgTextToBeCopied, msgIdTobeCopied) => {
    this.setState({
      showCopyOverlay: true,
      position,
      msgTextToBeCopied,
      msgIdTobeCopied
    });
  };
  setCurrentMessage = currentMessage => {
    this.setState({ currentMessage });
  };
  renderMessage = props => {
    const { targetUser, msgIdTobeCopied } = this.state;
    const { navigation, allRooms, selectedRoomId } = this.props;
    const room = selectedRoomId && allRooms[selectedRoomId];
    return (
      <MessageContainer
        targetUser={targetUser}
        enableCloser={this.enableCloser}
        isFriend={room.status !== "SLOT"}
        navigation={navigation}
        setCardVisiblity={this.setCardVisiblity}
        openOtherProfileModal={this.toggleProfileModal}
        openFirstProfileCard={this.openFirstProfileCard}
        retryImageUpload={this.retryImageUpload}
        showCopyOverlay={this.showCopyOverlay}
        openResponseScreen={this.openResponseScreen}
        setCurrentMessage={this.setCurrentMessage}
        msgIdTobeCopied={msgIdTobeCopied}
        {...props}
      />
    );
  };
  sendSystemMessage = (type, cb) => {
    let { myData } = this.props;
    const { targetUser } = this.state;

    let message = JSON.stringify({
      postedBy: myData._id,
      answeredBy: targetUser._id
    });
    this.props
      .setMessage(message, type, String(getTimeStamp()))
      .then(val => {
        this.sendMessagetoDb(message, type, val).then(() => {
          cb(true);
        });
      })
      .catch(err => {
        console.log("failed to set message: ", err);
      });
  };
  pushMessage = (text, type, sender, msgId, createdAt, objId) => {
    let { messages } = this.state;
    const { selectedRoomId, setPickerDisability, myData } = this.props;
    if (
      !this.checkPreviousMessage() &&
      sender === myData._id &&
      (type === msgTypes.MESSAGE_GIF ||
        type === msgTypes.MESSAGE_STICKERS ||
        type === msgTypes.MESSAGE_EMOTICONS ||
        type === msgTypes.MESSAGE_SYSTEM_B)
    ) {
      if (this.isPostedBy()) {
        setPickerDisability(true, false);
        RoomApi.releaseAStackItem(
          selectedRoomId,
          {
            postedByPickersEnabled: false
          },
          cbUpdated => {
            console.log("cbUpdate is: ", cbUpdated);
          }
        );
      } else {
        setPickerDisability(false, false);
        RoomApi.releaseAStackItem(
          selectedRoomId,
          {
            answeredByPickersEnabled: false
          },
          cbUpdated => {
            console.log("cbUpdate is: ", cbUpdated);
          }
        );
      }
    }

    if (sender !== myData._id && !this.checkPreviousMessage()) {
      if (this.isPostedBy()) {
        setPickerDisability(true, true);
        RoomApi.releaseAStackItem(
          selectedRoomId,
          {
            postedByPickersEnabled: true
          },
          cbUpdated => {
            console.log("cbUpdate is: ", cbUpdated);
          }
        );
      } else {
        setPickerDisability(false, true);
        RoomApi.releaseAStackItem(
          selectedRoomId,
          {
            answeredByPickersEnabled: true
          },
          cbUpdated => {
            console.log("cbUpdate is: ", cbUpdated);
          }
        );
      }
    }

    let msgObj = {
      text,
      type,
      _id: messages.length,
      sender,
      msgId,
      objId,
      createdAt,
      user: {
        _id: sender
      }
    };
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, msgObj)
    }));
  };

  isPostedBy = () => {
    const { currentChatScreenIndex } = this.props;
    return currentChatScreenIndex === 1;
  };

  isPreviousMessageMine = () => {
    const { myData } = this.props;
    const { messages } = this.state;
    if (messages.length > 0) {
      return messages[0].sender === myData._id;
    }
  };

  checkPreviousMessage = () => {
    let { selectedRoomId, allRooms, myData } = this.props;
    let { messages } = this.state;
    let quotaLeft = true;
    if (allRooms[selectedRoomId].status === "SLOT") {
      if (messages.length > 0 && messages[0].user._id === myData._id) {
        const msg = messages[0];

        if (msg.type !== msgTypes.MESSAGE_CARD && msg.type !== msgTypes.SPARK) {
          // Analysis starts now
          if (msg.type === msgTypes.MESSAGE_CHAT_CARD) {
            const msgBody = JSON.parse(msg.text);
            if (msgBody[0].response) {
              return true;
            } else {
              return false;
            }
          } else {
            // Might be GIF or Emoticon or Sticker
            return false;
          }
        } else {
          return true;
        }
      } else {
        return true;
      }
    } else {
      return true;
    }
    return quotaLeft;
  };

  sendMessagetoDb = async (message, type, msgId) => {
    let { sendMessage, myData, selectedRoomId } = this.props;

    await sendMessage({
      roomId: selectedRoomId,
      senderId: myData._id,
      message,
      type,
      createdAt: String(getTimeStamp()),
      msgId
    });
    return true;
  };

  onSend(messages = []) {
    console.log(" messages are ", messages);
    // check previous message data and push additional message if needed
    const { messages: _messages } = this.state;
    if (
      _messages[0] &&
      _messages[0].type !== msgTypes.TIMESTAMP &&
      moment(parseInt(_messages[0].createdAt) * 1000).calendar() !== "Today"
    ) {
      this.props
        .setMessage(
          messages[0].message,
          msgTypes.TIMESTAMP,
          String(getTimeStamp())
        )
        .then(val => {
          this.sendMessagetoDb(messages[0].message, msgTypes.TIMESTAMP, val);
        })
        .catch(err => {
          alert(err);
          console.log("failed to set message: ", err);
        });
    }

    this.props
      .setMessage(
        messages[0].message,
        msgTypes.MESSAGE_TEXT,
        String(getTimeStamp())
      )
      .then(val => {
        this.sendMessagetoDb(messages[0].message, msgTypes.MESSAGE_TEXT, val);
      })
      .catch(err => {
        alert(err);
        console.log("failed to set message: ", err);
      });
  }

  updateFriendStatus = () => {
    const {
      selectedRoomId,
      allRooms,
      sendMessage,
      myData,
      setFriendObj
    } = this.props;
    const { targetUser } = this.state;
    const friendObj = allRooms[selectedRoomId].friendObj[0];
    let updateObj = {
      id: friendObj._id,
      status: appConstants.BECAME_FRIEND,
      roomId: selectedRoomId
    };
    this.setState({
      closerBtnLoading: true
    });
    UserApi.updateFriend(updateObj, cbData => {
      console.log("updateObjupdateObj is ", cbData);

      setFriendObj({
        friend: targetUser._id,
        createdAt: friendObj.createdAt,
        user: myData._id,
        _id: updateObj._id,
        status: appConstants.BECAME_FRIEND
      });

      this.setState({
        closerBtnLoading: false
      });

      const closerMsgOne = {
        roomId: selectedRoomId,
        senderId: targetUser._id,
        message: `${targetUser.name} got closer |${targetUser._id}`,
        type: msgTypes.MESSAGE_SYSTEM_C,
        createdAt: String(friendObj.createdAt)
      };
      const closerMsgTwo = {
        roomId: selectedRoomId,
        senderId: myData._id,
        message: `You got closer |${myData._id}`,
        type: msgTypes.MESSAGE_SYSTEM_C,
        createdAt: String(getTimeStamp())
      };

      this.props
        .setMessage(
          closerMsgOne.message,
          closerMsgOne.type,
          closerMsgOne.createdAt
        )
        .then(val => {
          sendMessage({ ...closerMsgOne, msgId: val })
            .then(bool => {
              this.props
                .setMessage(
                  closerMsgTwo.message,
                  closerMsgTwo.type,
                  closerMsgTwo.createdAt
                )
                .then(valTwo => {
                  sendMessage({ ...closerMsgTwo, msgId: valTwo });
                  this.showGotCloserModal();
                  this.props.setChatTextDot(true);
                })
                .catch(err => {
                  console.log("failed to set message: ", err);
                });
            })
            .catch(err => {
              console.log("failed to set message in graphQL: ", err);
            });
        })
        .catch(err => {
          console.log("failed to set message: ", err);
        });
    });
  };

  fetchRoomsData = bool => {
    const { setRooms, setRoomsArray } = this.props;
    getRooms(cbData => {
      if (cbData.success) {
        console.log(" 222 result is ", cbData.data);
        setRooms(cbData.data);
        setRoomsArray(cbData.data);
        setTimeout(() => {
          this.initiateMessages(bool);
        }, 500);
      }
    });
  };

  addFriend = () => {
    const { myData, selectedRoomId, setFriendObj } = this.props;
    const { targetUser } = this.state;
    console.log("new friend status: ", {
      friend: targetUser._id,
      roomId: selectedRoomId
    });
    this.setState({
      closerBtnLoading: true
    });
    UserApi.addFriend(
      {
        friend: targetUser._id,
        roomId: selectedRoomId
      },
      addFriendResult => {
        console.log("new friend status: ", addFriendResult);
        if (addFriendResult.success) {
          setFriendObj({
            user: myData._id,
            createdAt: getTimeStamp(),
            friend: targetUser._id,
            _id: "friendObjId",
            status: appConstants.PENDING_FRIEND_REQUEST
          });
        } else {
          alert(" error in adding new friend ");
        }
        this.setState({
          closerBtnLoading: false
        });
      }
    );
  };

  closerClicked = friendStatusIsEmpty => {
    // alert(friendStatusIsEmpty);
    if (friendStatusIsEmpty) {
      this.addFriend();
    } else {
      this.updateFriendStatus();
    }
  };

  gamesClicked = async () => {
    await this.fetchNewQuestions("GUESS_MY_TRAITS", 2, 0);
    this.setState({
      showModal: true
    });
  };
  renderShadow = () => {
    const opacity = Animated.interpolate(this.btmSheetY, {
      inputRange: [0, 0.5, 1],
      outputRange: [0.8, 0.2, 0]
    });
    return (
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: "#000",
          opacity,
          zIndex: 20
        }}
        pointerEvents={"none"}
      />
    );
  };

  uploadImageMethod = (newMsgId, msg) => {
    const {
      updateUploadingImageStatus,
      selectedRoomId,
      myData,
      sendMessage
    } = this.props;
    const { messages } = this.state;

    const data = new FormData();
    data.append("image", {
      uri: msg,
      type: "image/png",
      name: "MESSAGE"
    });

    uploadImage(data, uploadResponse => {
      if (uploadResponse.success) {
        const { image } = uploadResponse.data;
        if (image && image.path) {
          sendMessage({
            roomId: selectedRoomId,
            senderId: myData._id,
            message: image.path,
            type: msgTypes.IMAGE,
            createdAt: String(getTimeStamp()),
            msgId: newMsgId
          })
            .then(() => {
              updateUploadingImageStatus(
                selectedRoomId,
                newMsgId,
                IMAGE_UPLOADING_STATUS.SUCCESS
              );
            })
            .catch(err => {
              updateUploadingImageStatus(
                selectedRoomId,
                newMsgId,
                IMAGE_UPLOADING_STATUS.FAILED
              );
            });
        }
      } else {
        updateUploadingImageStatus(
          selectedRoomId,
          newMsgId,
          IMAGE_UPLOADING_STATUS.FAILED
        );
      }
    });
  };

  sendImage = (imageUri, type) => {
    Image.getSize(imageUri, (ImageWidth, ImageHeight) => {
      if (ImageHeight > DeviceHeight || ImageWidth > DeviceWidth) {
        let heightIncrease = DeviceHeight / ImageHeight;
        let widthIncrease = DeviceWidth / ImageWidth;
        if (heightIncrease < 0) {
          this.setState({
            showImagePreview: true,
            imageUri,
            ImageWidth: ImageWidth * heightIncrease * 0.6,
            ImageHeight: ImageHeight * heightIncrease * 0.6
          });
        } else {
          this.setState({
            showImagePreview: true,
            imageUri,
            ImageWidth: ImageWidth * widthIncrease * 0.7,
            ImageHeight: ImageHeight * widthIncrease * 0.7
          });
        }
      } else {
        this.setState({
          showImagePreview: true,
          imageUri,
          ImageWidth,
          ImageHeight
        });
      }
    });
  };

  sendImageNew = () => {
    this.setState({ showImagePreview: false });
    const {
      setMessage,
      updateUploadingImageStatus,
      pushUploadingImageMsgId,
      msgsToBeUpdated,
      selectedRoomId
    } = this.props;
    const { messages, imageUri } = this.state;
    const msg = imageUri;
    const type = msgTypes.IMAGE;
    const parsedMsgCount = parseInt(messages[0].msgId.substring(1));
    const newMsgId = `${messages[0].msgId[0]}${parsedMsgCount + 1}`;

    pushUploadingImageMsgId(
      selectedRoomId,
      newMsgId,
      IMAGE_UPLOADING_STATUS.UPLOADING
    );
    this.uploadImageMethod(newMsgId, msg);
    setMessage(msg, type, String(getTimeStamp()))
      .then(val => {
        //
      })
      .catch(err => {
        console.log("Error while setting msg:", err);
      });
  };

  sendImagee = (msg, type) => {
    const {
      setMessage,
      updateUploadingImageStatus,
      pushUploadingImageMsgId
    } = this.props;
    const { msgIdToBeUpdated, messages } = this.state;
    let _msgIdToBeUpdated = Object.assign([], msgIdToBeUpdated);
    const parsedMsgCount = parseInt(messages[0].msgId.substring(1));
    const newMsgId = `${messages[0].msgId[0]}${parsedMsgCount + 1}`;
    _msgIdToBeUpdated.push({
      msgId: newMsgId,
      status: IMAGE_UPLOADING_STATUS.UPLOADING
    });
    this.setState({ msgIdToBeUpdated: _msgIdToBeUpdated });
    this.uploadImageMethod(newMsgId, msg);

    setMessage(msg, type, String(getTimeStamp()))
      .then(val => {
        //
      })
      .catch(err => {
        console.log("Error while setting msg:", err);
      });
  };

  renderImagePreview = () => {
    const { imageUri, ImageWidth, ImageHeight } = this.state;
    return (
      <View
        style={{
          position: "absolute",
          zIndex: 100,
          backgroundColor: "#000",
          height: DeviceHeight,
          width: DeviceWidth,
          ...sharedStyles.justifiedCenter
        }}
      >
        <RowView
          style={{
            height: 70,
            width: DeviceWidth,
            backgroundColor: "#fff",
            justifyContent: "space-between",
            position: "absolute",
            top: 0,
            paddingTop: 24
          }}
        >
          <NoFeedbackTapView
            onPress={() => this.setState({ showImagePreview: false })}
            style={{
              height: 50,
              width: 50,
              ...sharedStyles.justifiedCenter
            }}
          >
            <Ionicon name={"md-close"} size={35} color={FONT_GREY} />
          </NoFeedbackTapView>

          <TouchableOpacity
            style={{
              height: 50,
              width: 70,
              ...sharedStyles.justifiedCenter
            }}
            onPress={this.sendImageNew}
          >
            <MediumText
              style={{ color: PURPLE, fontSize: 17, marginRight: 15 }}
            >
              Send
            </MediumText>
          </TouchableOpacity>
        </RowView>
        <Image
          resizeMode={"center"}
          source={{ uri: imageUri }}
          style={{
            width: ImageWidth,
            height: ImageHeight
          }}
        />
      </View>
    );
  };

  renderInputContainer = props => {
    const { targetUser, pickersEnabled } = this.state;

    return (
      <MessageInputContainer
        pickersEnabled={pickersEnabled}
        targetUser={targetUser}
        closerEnabled={this.state.closerEnabled}
        showCloserButton={this.state.showCloserButton}
        onClickCloser={this.closerClicked}
        onGamesClicked={this.gamesClicked}
        closerBtnLoading={this.state.closerBtnLoading}
        toggleQuestionPicker={this.toggleQuestionPicker}
        toggleGiphyPicker={() => this.toggleGiphyPicker(1)}
        changeTypingStatus={(roomId, toValue) =>
          this.props.changeTypingStatus(roomId, toValue)
        }
        onSend={props.onSend}
        sendImage={this.sendImage}
        onSelectImage={path => {
          console.log(" image path is ", path);
          // this.pushMessage()

          this.setState({
            imagePath: path
          });
        }}
      />
    );
  };

  renderScrollToBottomIcon = () => {
    return <Ionicon name={"ios-arrow-down"} color={LIGHT_PURPLE} size={18} />;
  };

  renderLoadEarlier = () => {
    const { disabledLoadEarlier } = this.state;

    return (
      <TouchableOpacity
        disabled={disabledLoadEarlier}
        style={{
          alignSelf: "center",
          height: 30,
          width: DeviceWidth * 0.7,
          borderRadius: 30,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgb(242,242,242)",
          marginVertical: 20
        }}
        onPressIn={() => {
          this.setState({ disabledLoadEarlier: true });
        }}
        onPress={() => {
          this.loadEarlierMessages();
          setTimeout(() => {
            this.setState({ disabledLoadEarlier: false });
          }, 5000);
        }}
      >
        <MediumText>Load earlier chats...</MediumText>
      </TouchableOpacity>
    );
  };

  setInitialCronJobSchedule = () => {
    const {
      myData,
      setTutorialRoom,
      selectedRoomId,
      tutorialRooms
    } = this.props;
    const { targetUser } = this.state;
    let executesAt = Lodash.random(getTimeStamp() + 60, getTimeStamp() + 180);

    const jobData = {
      userId: myData._id,
      executesAt,
      task: CRON_TASKS.SCHEDULE_CHAT_JOB,
      platformProfileId: targetUser._id
    };
    if (tutorialRooms.indexOf(selectedRoomId) === -1) {
      setTutorialRoom(selectedRoomId);
    }
    UserApi.scheduleCronJob(jobData, cbData => {});
  };

  setResponseCronJob = (task, msgId) => {
    const { myData, currentChatScreenIndex } = this.props;
    const { targetUser } = this.state;
    const isCurrentRoomFromSentSection = currentChatScreenIndex === 2;
    let executesAt;
    if (isCurrentRoomFromSentSection) {
      executesAt = Lodash.random(getTimeStamp() + 60, getTimeStamp() + 180);
    } else {
      executesAt = Lodash.random(getTimeStamp() + 30, getTimeStamp() + 100);
    }

    const jobData = {
      userId: myData._id,
      executesAt,
      task,
      platformProfileId: targetUser._id,
      msgId
    };

    UserApi.scheduleCronJob(jobData, cbData => {});
  };

  showGotCloserModal = () => {
    this.setState({ isCloserModalVisible: true });
    this.openCloserModal();
  };

  dismissGotCloserModal = () => {
    this.setState({ isCloserModalVisible: false });
    this.closeCloserModal();
  };

  setCardVisiblity = () => {
    this.setState({ showCards: true });
  };
  componentDidCatch(err, info) {
    console.log(" err is >>.", err);
    console.log(" info is >>.", info);
  }

  componentWillReceiveProps = (nextProps, prevProps) => {
    const {
      allRooms,
      selectedRoomId,
      myData,
      shareableContent,
      currentScreenIndex
    } = nextProps;
    if (shareableContent) {
      if (shareableContent.openIn === "ChatWindow") {
        this.setState({ showSharePreview: true, shareableContent });
        this.openCloserModal();
      }
    }
    if (!selectedRoomId) {
      return;
    }
    const _lastRoomMessage = allRooms[selectedRoomId].messages[0];
    const _lastStateMessage = this.state.messages[0];
    var _isLastMessage =
      _lastStateMessage && _lastRoomMessage.msgId === _lastStateMessage.msgId;

    var objId;
    if (_lastRoomMessage.sender !== myData._id) {
      objId = _lastRoomMessage._id;
    } else {
      objId = this.state.messages.length;
    }
    if (!_isLastMessage && !nextProps.pushAndSendMsg) {
      this.pushMessage(
        _lastRoomMessage.body,
        _lastRoomMessage.type,
        _lastRoomMessage.sender,
        _lastRoomMessage.msgId,
        _lastRoomMessage.createdAt,
        objId
      );
    }
    if (nextProps.pushAndSendMsg) {
      this.handleOtherComponentPushMessages(nextProps.pushAndSendMsg);
    }
    if (nextProps.newEditedMessage) {
      console.log(" recieved edited message ", nextProps.newEditedMessage);
      this.udpateMessageCard(nextProps.newEditedMessage);
    }
    if (_lastRoomMessage.type === msgTypes.MESSAGE_SYSTEM_C) {
      if (_lastRoomMessage.sender !== myData._id) {
        this.showGotCloserModal();
        this.props.resetUnreadMessages(selectedRoomId);
      }
    }
    const isInThisScreen = currentScreenIndex === 3;
    if (nextProps.firebaseNotification !== null && isInThisScreen) {
      this.checkAndVibrate();
      this.props.setFirebaseNotification(null);
    }
  };
  udpateMessageCard = newCardWithResp => {
    const { setPickerDisability, selectedRoomId } = this.props;

    if (this.isPostedBy()) {
      setPickerDisability(true, true);
      RoomApi.releaseAStackItem(
        selectedRoomId,
        {
          postedByPickersEnabled: true
        },
        cbUpdated => {
          console.log("cbUpdate is: ", cbUpdated);
        }
      );
    } else {
      setPickerDisability(false, true);
      RoomApi.releaseAStackItem(
        selectedRoomId,
        {
          answeredByPickersEnabled: true
        },
        cbUpdated => {
          console.log("cbUpdate is: ", cbUpdated);
        }
      );
    }
    const allMessages = Object.assign([], this.state.messages);
    console.log(
      " all messages to be updated is ",
      newCardWithResp,
      allMessages
    );
    const newMessages = allMessages.map(message => {
      if (message.msgId === newCardWithResp.msgId) {
        return {
          ...message,
          text: newCardWithResp.body
        };
      }
      return message;
    });
    console.log("updated messages state array is ", newMessages);
    this.setState(
      {
        messages: newMessages
      },
      () => {
        this.props.setEditedMessage(undefined);
      }
    );
  };

  handleOtherComponentPushMessages = msg => {
    console.log(" push message in willrecieveProps", msg);
    const {
      cronState,
      setMessage,
      pushAndSendMessage,
      selectedRoomId,
      tutorialRooms
    } = this.props;

    if (
      msg.type === msgTypes.MESSAGE_CHAT_CARD ||
      msg.type === msgTypes.MESSAGE_QUESTION_CARD
    ) {
      this.sendSystemMessage(msgTypes.MESSAGE_SYSTEM_B, cbBool => {
        setMessage(msg.text, msg.type, String(getTimeStamp()))
          .then(val => {
            this.sendMessagetoDb(msg.text, msg.type, val);
            if (
              cronState &&
              tutorialRooms.indexOf(selectedRoomId) > -1 &&
              msg.type === msgTypes.MESSAGE_CHAT_CARD
            ) {
              this.setResponseCronJob(
                CRON_TASKS.RESPOND_TO_CHAT_CARD,
                this.state.messages[0].msgId
              );
            }
          })
          .catch(err => {
            console.log("failed to set message: ", err);
          });
      });
    } else {
      setMessage(msg.text, msg.type, String(getTimeStamp()))
        .then(val => {
          this.sendMessagetoDb(msg.text, msg.type, val);
          if (cronState && tutorialRooms.indexOf(selectedRoomId) > -1) {
            switch (msg.type) {
              case msgTypes.MESSAGE_GIF:
                this.setResponseCronJob(CRON_TASKS.SEND_GIF);
                break;

              case msgTypes.MESSAGE_EMOTICONS:
                this.setResponseCronJob(CRON_TASKS.SEND_EMOTICON);
                break;

              case msgTypes.MESSAGE_STICKERS:
                this.setResponseCronJob(CRON_TASKS.SEND_EMOTICON);
                break;

              default:
                break;
            }
          }
        })
        .catch(err => {
          console.log("failed to set message: ", err);
        });
    }
    pushAndSendMessage(undefined);
  };

  toggleGiphyPicker = modeNumber => {
    if (this.giphyPicker) {
      this.giphyPicker.snapTo(modeNumber);
    }
  };

  toggleQuestionPicker = () => {
    if (this.questionPicker) {
      this.questionPicker.snapTo(1);
    }
  };

  renderGiphyPicker = () => {
    return (
      <BottomSheet
        snapPoints={[-20, DeviceHeight * 0.7]}
        ref={ref => (this.giphyPicker = ref)}
        enabledBottomClamp
        callbackNode={this.btmSheetY}
        renderContent={() => {
          return (
            <GiphyPicker
              fromMyProfile={false}
              fromResponse={false}
              fromChatWindow={true}
              toggleGiphyPicker={() => this.toggleGiphyPicker(0)}
            />
          );
        }}
      />
    );
  };

  renderQuestionPicker = () => {
    let { showQuestionPicker, roomLevel } = this.state;

    if (showQuestionPicker) {
      return (
        <BottomSheet
          snapPoints={[-20, DeviceHeight * 0.78]}
          ref={ref => (this.questionPicker = ref)}
          enabledBottomClamp
          callbackNode={this.btmSheetY}
          renderContent={() => {
            const { allRooms, selectedRoomId } = this.props;
            const room = selectedRoomId && allRooms[selectedRoomId];

            return (
              <QuestionPicker
                isFriends={room.status !== "SLOT"}
                roomLevel={roomLevel}
                setAnimatedValue={this.state.translateQuestionPickerModal}
                // fromChatWindow={true}
                fromChatWindow={true}
                afterSend={() => {
                  this.questionPicker.snapTo(0);
                }}
                toggleQuestionPicker={this.toggleQuestionPicker}
              />
            );
          }}
        />
      );
    } else {
      return <View />;
    }
  };

  fetchUserPurchasedPacks = () => {
    getUserPacks(packsResult => {
      console.log(" spark price is result final is ", packsResult);
      if (packsResult.success) {
        this.props.setUserPacks(packsResult.data);
      }
    });
  };

  sendSparkFromChat = (userName, userId) => {
    console.log(" about to start sendign spark ");
    this.setShowCloserpopup();
    const {
      myData,
      addSparkToRoom,
      allRooms,
      selectedRoomId,
      adminProps,
      userPacks,
      gemPacks: packPrices
    } = this.props;
    const selectedRoom = allRooms[selectedRoomId];
    const isUserPostedBy =
      selectedRoom && selectedRoom.postedBy._id === myData._id;
    let sendSparkCall;
    console.log(" before function assign ");

    if (!isUserPostedBy) {
      sendSparkCall = () => {
        sendSpark(myData._id, userId, sparkResult => {
          console.log(" spark result is ", sparkResult, userId, myData._id);
          if (sparkResult.success) {
            addSparkToRoom(sparkResult.data);
            this.fetchRoomsData();
          }
        });
      };
    } else {
      sendSparkCall = () => {
        sendSpark(userId, myData._id, sparkResult => {
          console.log(" spark result is ", sparkResult, userId, myData._id);
          if (sparkResult.success) {
            addSparkToRoom(sparkResult.data);
            this.fetchRoomsData();
          }
        });
      };
    }
    console.log(" crossed function assign ");
    const { dailyFreeSparkLimit } = adminProps;

    const sparkPriceObj = packPrices.find(p => p.key === "SPARK");
    // const bulkPackObj = bulkPlans.find(p => p.itemId === sparkPriceObj._id);
    const userPack =
      userPacks && userPacks.find(p => p.itemId && p.itemId.value === "SPARK");
    const freeUsagecall = () => {
      useFreeSpark(sparkPriceObj._id, sparkResult => {
        console.log(" spark result is ", sparkResult);
        if (sparkResult.success) {
          sendSparkCall();
          const fromCount = 1;
          const toCount = 0;

          this.fetchUserPurchasedPacks();
        }
      });
    };
    const purchasedUsageCall = () => {
      usePurchasedPack(userPack._id, sparkResult => {
        console.log(" spark purchased  result is  ", sparkResult);
        if (sparkResult.success) {
          sendSparkCall();
          this.fetchUserPurchasedPacks();
        }
      });
    };
    const purchaseGemsCall = successCallback => {
      purchaseGems(-sparkPriceObj.price, purchaseResult => {
        console.log(" purchase result is ", purchaseResult);
        console.log(
          " purchase result after props are ",
          this.props.updateProfile
        );
        if (purchaseResult.success) {
          successCallback();

          this.props.updateProfile({
            gems_count: purchaseResult.data.gems_count
          });
          this.fetchUserPurchasedPacks();
        } else {
          //show buy gems modal
        }
      });
    };
    console.log(" usefreespark is ", userPack);
    if (!userPack) {
      freeUsagecall();
    } else {
      const startOfDay = getStartOfDay();
      const isFreeCountCrossed = userPack.freeUsageCount >= dailyFreeSparkLimit;
      const isLastUsedNotToday = userPack.freeUsageUpdatedAt < startOfDay;
      const isHavingPurchasedSparks = userPack.purchasedCount > 0;
      const isLastUsageMonitizedOne =
        !!userPack.monetisedUpdatedAt &&
        userPack.freeUsageUpdatedAt < userPack.monetisedUpdatedAt;
      const hasUsedMonization = userPack.monetisedUsage !== 0;
      const helperText = isLastUsageMonitizedOne
        ? "Out of Sparks"
        : "Done for today";
      const isGemsEnough = myData.gems_count >= sparkPriceObj.price;
      if (isLastUsedNotToday) {
        this.showAnimatedCount({
          itemIcon: MONETIZATION_ICONS["SPARK"],
          fromCount: 1,
          toCount: 0,
          onCountAnimated: () => freeUsagecall()
        });

        // freeUsagecall();
      } else if (!isFreeCountCrossed) {
        this.showAnimatedCount({
          itemIcon: MONETIZATION_ICONS["SPARK"],
          fromCount: userPack.freeUsageCount + 1,
          toCount: userPack.freeUsageCount,
          onCountAnimated: () => freeUsagecall()
        });
        // freeUsagecall();
      } else if (isHavingPurchasedSparks) {
        this.showAnimatedCount({
          itemIcon: MONETIZATION_ICONS["SPARK"],
          fromCount: userPack.purchasedCount,
          toCount: userPack.purchasedCount - 1,
          onCountAnimated: () => purchasedUsageCall()
        });
      } else if (isGemsEnough) {
        const sparkTutorialCount = this.props.expenseTutorials[
          sparkPriceObj._id
        ];
        const hasnotSeenTutorial =
          !sparkTutorialCount || sparkTutorialCount < 1;
        if (hasnotSeenTutorial) {
          this.openSparkConfirmation({
            count: sparkPriceObj.price,
            unit: "sparks",
            successCallback: () => {
              setTimeout(() => {
                //doubt one
                this.showAnimatedCount({
                  itemIcon: MONETIZATION_ICONS["SPARK"],
                  fromCount: userPack.purchasedCount,
                  toCount: userPack.purchasedCount - 1,
                  onCountAnimated: () => {
                    purchaseGemsCall(sendSparkCall);
                  }
                });
              }, 300);
            },
            failureCallback: () => {
              console.log(" didn't buy ");
            }
          });
          this.props.incrimentExpenseTutorial(sparkPriceObj._id);
        } else {
          this.showAnimatedCount({
            itemIcon: MONETIZATION_ICONS["GEMS"],
            fromCount: myData.gems_count,
            toCount: myData.gems_count - userPack.price,
            onCountAnimated: () => {
              purchaseGemsCall(sendSparkCall);
            }
          });
        }
      } else {
        const buyPower = {
          successCallback: async selectedCount => {
            setTimeout(() => {
              this.showAnimatedCount({
                itemIcon: MONETIZATION_ICONS["GEMS"],
                fromCount: myData.gems_count + selectedGemCount,
                toCount:
                  myData.gems_count + selectedGemCount - sparkPriceObj.price,
                onCountAnimated: async () => {
                  await this.purchaseGems(-sparkPriceObj.price);
                  sendSparkCall();
                  this.fetchUserPurchasedPacks();
                }
              });
            }, 300);
          },
          failureCallback: () => {
            console.log(" user did buy ");
          },
          hasOffers: true,
          powerName: "Spark",
          cost: sparkPriceObj.price,
          colors: gemPlanColors["Sparks"],
          showHelperText: true,
          extraData: { extraDescription: helperText }
        };
        const bulkPurchase = {
          bulkItemName: "SPARK",
          extraData: { extraDescription: helperText },
          successCallback: selectedCount => {
            setTimeout(() => {
              this.showAnimatedCount({
                itemIcon: MONETIZATION_ICONS["SPARK"],
                fromCount: selectedCount,
                toCount: selectedCount - 1,
                onCountAnimated: () => {
                  usePurchasedPack(userPack._id, purchaseResult => {
                    if (purchaseResult.success) {
                      sendSparkCall();
                      this.fetchUserPurchasedPacks();
                    }
                  });
                }
              });
            });
          },
          failureCallback: () => {}
        };
        // console.log(" bulkPlanitem is ", bulkPurchase);
        this.setState({
          buyPower,
          bulkPurchase,
          isBuyGemsModalVisible: true,
          isNewCloserModalVisible: true,
          isBundlePurchaseModalVisible: false
        });
      }
    }
  };

  sendResponse = () => {
    const {
      currentResponses,
      setRooms,
      setRoomsArray,
      resetResponses,
      setCloserPopoverVisibility,
      cronState
    } = this.props;
    if (currentResponses.length > 0) {
      QuestionApi.postResponse({ responses: currentResponses }, cbData => {
        resetResponses();
        this.setState({ hideProfileCards: true });
        console.log(" api response is ", cbData);
        if (cbData.success) {
          this.fetchRoomsData(true);
          // getRooms(cbRooms => {
          //   console.log(" rooms response is ", cbRooms);
          //   if (cbRooms.success) {
          //     setRooms(cbRooms.data);
          //     setRoomsArray(cbRooms.data);
          //     setCloserPopoverVisibility(true);
          //     // if (fromChatWindow) {
          //     //   initiateMessages();
          //     // } else {
          //     //   if (currentChatScreenIndex !== 2) {
          //     //     setSentTextDot(true);
          //     //   }
          //     //   setChatIconDot(true);
          //     // }
          //   }
          // });
          console.log("SUCCESSFULLY stored responses", cbData);
        } else {
          alert("Failed to post response ");
        }
      });
    }
  };

  renderGradientHeader = () => {
    const { targetUser } = this.state;
    let { allRooms, selectedRoomId } = this.props;
    const _currentRoom = allRooms[selectedRoomId];

    return (
      <GradientHeader
        fetchRoomsData={this.fetchRoomsData}
        fromChatWindow={true}
        selectedRoomId={selectedRoomId}
        hideSparkButton={_currentRoom.status !== "SLOT"}
        targetUser={targetUser}
        openSparkConfirmation={this.openSparkConfirmation}
        openBuyPowerModal={({ buyPower, bulkPurchase }) => {
          this.setState(
            {
              buyPower,
              bulkPurchase,
              isBuyGemsModalVisible: true,
              isNewCloserModalVisible: true,
              isBundlePurchaseModalVisible: false
            }
            // () => {
            //   this.openCloserModal();
            // }
          );
        }}
        // onSparkTapped={() =>
        //   this.sendSparkFromChat(targetUser.name, targetUser._id)
        // }
        // activeProfile={targetUser}
      />
    );
  };

  openFirstProfileCard = () => {
    const posts = this.state.targetUser.posts;
    if (posts.length > 0) {
      this.btmSheetRef.snapTo(1);
      setTimeout(() => {
        this.openResponseScreen(
          posts[0],
          {
            x: DeviceWidth * 0.075,
            y: DeviceHeight * 0.425,
            height: DeviceWidth * 0.5,
            width: DeviceWidth * 0.37
          },
          0
        );
      }, 100);
    } else {
      alert("This user has no posts in user obj");
    }
  };

  openResponseScreen = (selectedGame, position, selectedGameIndex, posts) => {
    // alert(
    //   selectedGame + ", " + JSON.stringify(position) + ", " + selectedGameIndex
    // );
    const { activeProfilePosts } = this.state;

    this.setState({
      selectedGame,
      position,
      selectedGameIndex,
      responseModalPosts: posts ? posts : activeProfilePosts
    });
  };

  storeResponses = (game, questionIndex, option, postId) => {
    console.log(game, questionIndex, option, postId);

    let { myData } = this.props;
    const activeProfile = this.state.targetUser;

    const { activeProfilePosts } = this.state;

    let localQuestions = Object.assign({}, activeProfilePosts);

    localQuestions[game][questionIndex].response = option;

    let responseDbObject = {
      postedBy: activeProfile._id,
      answeredBy: myData._id,
      response: `${option}`,
      postId: postId,
      location: appConstants.POST_TO_CHAT_PROFILE
    };
    this.props.addNewRespone(responseDbObject);
    this.setState({
      questions: localQuestions
    });
  };

  onClose = () => {
    this.setState({ selectedGame: null, currentMessage: null });
    this.props.setQuestionCardVisibility("closed");
    setTimeout(() => {
      this.props.setQuestionCardVisibility(undefined);
    }, 500);
  };

  directlySendResponse = (game, questionIndex, option, postId) => {
    let { myData } = this.props;
    const { currentMessage, targetUser } = this.state;

    let responseDbObject = {
      msgId: currentMessage.msgId,
      postedBy: targetUser._id,
      answeredBy: myData._id,
      response: `${option}`,
      postId: postId,
      location: appConstants.POST_TO_CHAT_PROFILE
    };

    QuestionApi.addResponseFromChat(responseDbObject, addedResponse => {
      if (addedResponse.success) {
        this.setState({ currentMessage: null });
        const { editMessage, selectedRoomId, allRooms, myData } = this.props;
        const editMsgObj = {
          messageId: currentMessage.objId,
          roomId: selectedRoomId,
          message: JSON.stringify([addedResponse.data]),
          type: msgTypes.MESSAGE_CHAT_CARD
        };
        console.log("editMessage obj is: ", editMsgObj);
        editMessage(editMsgObj);

        if (allRooms[selectedRoomId].postedBy._id === myData._id) {
          RoomApi.releaseAStackItem(
            selectedRoomId,
            {
              answeredByPickersEnabled: true
            },
            () => {}
          );
        } else {
          RoomApi.releaseAStackItem(
            selectedRoomId,
            {
              postedByPickersEnabled: true
            },
            () => {}
          );
        }
        this.setInitialCronJobSchedule();
      }
    });
  };

  renderResponseScreen = () => {
    const {
      position,
      selectedGame,
      selectedGameIndex,
      responseModalPosts,
      targetUser,
      currentMessage
    } = this.state;

    if (selectedGame) {
      return (
        <Response
          position={position}
          onClose={this.onClose}
          fromChatWindow
          fromPresetModal={currentMessage !== null}
          showTutorial={false}
          selectedGame={selectedGame}
          storeResponses={
            currentMessage !== null
              ? this.directlySendResponse
              : this.storeResponses
          }
          selectedGameIndex={selectedGameIndex}
          games={responseModalPosts}
          targetUser={targetUser}
          userName={userNamify(targetUser)}
          userImage={
            targetUser &&
            targetUser.images &&
            targetUser.images.length > 0 &&
            targetUser.images[0]
          }
        />
      );
    } else {
      return <View />;
    }
  };

  renderOthersProfileModal = () => {
    let { activeProfilePosts, targetUser, hideProfileCards } = this.state;
    let { myData, allRooms, selectedRoomId } = this.props;
    const _currentRoom = allRooms[selectedRoomId];

    return (
      <BottomSheet
        snapPoints={[-20, DeviceHeight * 0.96]}
        ref={ref => (this.btmSheetRef = ref)}
        enabledBottomClamp
        callbackNode={this.btmSheetY}
        onOpenEnd={() => {
          this.setState({ btmSheetOpened: true });
        }}
        onCloseEnd={() => {
          const {
            showCloserPopupAfterClosingOthersProfile,
            btmSheetOpened
          } = this.state;
          if (this.state.btmSheetOpened) {
            this.sendResponse();
          }
          if (showCloserPopupAfterClosingOthersProfile && btmSheetOpened) {
            const { setCloserPopoverVisibility } = this.props;
            this.setState({ showCloserPopupAfterClosingOthersProfile: false });
            setTimeout(() => {
              setCloserPopoverVisibility(true);
            }, 1500);
          }
        }}
        renderHeader={this.renderGradientHeader}
        renderContent={() => {
          return (
            <ProfileModal
              initiateMessages={this.initiateMessages}
              onCloseModal={() => this.toggleProfileModal(DeviceHeight)}
              activeProfile={{
                ...targetUser,
                hideProfileCards
              }}
              userInfo={myData}
              fromChatWindow={true}
              navigation={this.props.navigation}
              currentProfilePosts={activeProfilePosts}
              hideCardsContent={_currentRoom.status !== "SLOT"}
              openResponseScreen={this.openResponseScreen}
            />
          );
        }}
      />
    );
  };
  openSparkConfirmation = bundleConfirmation => {
    this.setState({
      bundleConfirmation,
      isBundleConfirmationModalVisible: true,
      isNewCloserModalVisible: true
    });
    // this.openCloserModal();
  };
  renderBlackBackground = () => {
    let {
      showBlackBg,
      translateQuestionPickerModal,
      translateGiphyPickerModal
    } = this.state;
    let colorOpacityA = translateQuestionPickerModal.interpolate({
      inputRange: [-DeviceHeight, 0, DeviceHeight],
      outputRange: [0, 0.8, 0],
      extrapolate: Animated.Extrapolate.CLAMP
    });
    let colorOpacityB = translateGiphyPickerModal.interpolate({
      inputRange: [-DeviceHeight, 0, DeviceHeight],
      outputRange: [0, 0.8, 0],
      extrapolate: Animated.Extrapolate.CLAMP
    });
    return showBlackBg ? (
      <Animated.View
        style={[
          {
            backgroundColor: Animated.color(
              0,
              0,
              0,
              Animated.cond(
                Animated.greaterThan(colorOpacityA, 0),
                colorOpacityA,
                colorOpacityB
              )
            )
          },
          styles.opacityCardView
        ]}
      />
    ) : (
      <View />
    );
  };
  handleReasonSelection = _id => {
    const { targetUser } = this.state;
    const {
      myData: { data }
    } = this.props;

    this.setState(
      {
        showBlockReasonsModal: false
      },
      () => {
        setTimeout(() => {
          this.props.navigation.navigate("BlockAndReport", {
            reasonId: _id,
            victim: targetUser._id
          });
        }, 300);
      }
    );
  };

  openCloserModal = () => {
    this.setState({ isModalVisible: true });
    this.refs["modalRef"].toggleBg(true);
  };

  closeCloserModal = () => {
    this.setState({ isModalVisible: false });
    this.refs["modalRef"].startAnimation(false);
    setTimeout(() => {
      this.refs["modalRef"].toggleBg(false);
    }, 300);
  };
  closeShareModal = () => {
    this.setState({ showSharePreview: false });
    this.closeCloserModal();
  };
  deleteConversation = () => {
    const { selectedRoomId } = this.props;
    RoomApi.deleteConversation(selectedRoomId, async deletionResult => {
      if (deletionResult.success) {
        await this.props.openOneRoom(null);
        await this.props.clearOneRoomMessages(selectedRoomId);
        this.props.navigation.pop();
      }
    });
  };
  renderBulkPurchaseModal = () => {
    const { bulkPurchase } = this.state;
    return (
      <BulkPurchaseModal
        bulkItemName={bulkPurchase.bulkItemName}
        extraData={bulkPurchase.extraData}
        showHelperText={bulkPurchase.showHelperText || false}
        beforeCall={bulkPurchase.beforeCall}
        testProps={() => ({ test: "test" })}
        openConsumptionConfirmation={({ count, successCallback }) => {
          this.setState({
            isGemCountModalVisible: true,
            gemsConsumption: {
              successCallback: () => {
                successCallback();
              },
              failureCallback: () => {
                console.log(" failed ");
              },
              count
            }
          });
        }}
        goBack={(purchased, newItemCount) => {
          if (purchased) {
            bulkPurchase.successCallback(newItemCount);
          } else {
            bulkPurchase.failureCallback();
          }
          this.setState({
            isNewCloserModalVisible: false
          });
          // this.closeCloserModal();
        }}
      />
    );
  };
  renderBuyPowerModal = () => {
    const { buyPower, extensionPack } = this.state;
    return (
      <BuyModal
        hasOffers={buyPower.hasOffers || false}
        afterPurchase={(buyPower && buyPower.afterPurchase) || null}
        colors={buyPower.colors || gemPlanColors["Extensions"]}
        extraData={buyPower.extraData}
        showHelperText={buyPower.showHelperText || false}
        helperText={buyPower.helperTextState}
        beforeCall={buyPower.beforeCall}
        cost={buyPower.cost || (extensionPack && extensionPack.price)}
        powerName={buyPower.powerName || "EXTENSIONS"}
        goBack={(confirmed, newGemsCount) => {
          console.log("before consuption is ...", confirmed);
          if (confirmed) {
            if (buyPower.afterPurchase) {
              if (newGemsCount > buyPower.requiredTotalGem) {
                buyPower.afterPurchase(newGemsCount);
              } else {
                this.setState({
                  // isBuyGemsModalVisible: false,
                  isNewCloserModalVisible: false
                });
              }
            }
            buyPower.successCallback(newGemsCount);
          } else {
            buyPower.failureCallback();
          }
          this.setState({
            //  isBuyGemsModalVisible: false
            isNewCloserModalVisible: false
          });
          // this.closeCloserModal();
          // if (!beforeConsuption) {
          //   this.refs["modalRef"].toggleBg(false);
          // }
          // this.setState({
          //   isBuyGemsModalVisible: false,
          //   isPurchaseConfirmationVisible: beforeConsuption ? true : false
          // });
        }}
        showOffersModal={() => {
          // this.closeCloserModal();
          this.setState(
            {
              // isBuyGemsModalVisible: false,
              isNewCloserModalVisible: false
              // isBundlePurchaseModalVisible: false
            },
            () => {
              setTimeout(() => {
                this.setState({
                  // bulkPurchase: {
                  //   successCallback: () => {},
                  //   failureCallback: () => {},
                  //   count: 5,
                  //   unit: "sparks"
                  // },

                  isBundlePurchaseModalVisible: true,
                  isNewCloserModalVisible: true,
                  isBuyGemsModalVisible: false
                });
                // this.openCloserModal();
              }, 400);
            }
          );
          // this.offersCloserModal()
        }}
      />
    );
  };
  renderCloserModal = () => {
    const {
      isModalVisible,
      isBuyGemsModalVisible,
      isPurchaseConfirmationVisible,
      isCloserModalVisible,
      showBlockReasonsModal,
      blockReasons,
      targetUser,
      buyPower,
      deleteConversation,
      extensionPack,
      consumptionConfirmation,
      isBundlePurchaseModalVisible,
      bulkPurchase,
      isBundleConfirmationModalVisible,
      bundleConfirmation,
      showSharePreview,
      shareableContent,
      isGameUnlockModalVisible,
      unlockedGameName,
      showOneTimeMonetisationTutorialSlides,
      monetisationTutorialName
    } = this.state;
    const { selectedRoomId } = this.props;
    const showDeleteConfirmation = deleteConversation !== null;
    return (
      <CloserModal isModalVisible={isModalVisible} ref={"modalRef"}>
        {isCloserModalVisible ? (
          this.renderYouGotCloser()
        ) : isGameUnlockModalVisible ? (
          this.renderGameUnlockModal(unlockedGameName)
        ) : isPurchaseConfirmationVisible ? (
          <GemCountModal
            count={extensionPack.price}
            {...consumptionConfirmation}
            goBack={confirmed => {
              if (confirmed) {
                consumptionConfirmation.successCallback();
              } else {
                consumptionConfirmation.failureCallback();
              }
              this.setState({
                isPurchaseConfirmationVisible: false
              });
              this.closeCloserModal();
              // this.refs["modalRef"].toggleBg(false);
            }}
          />
        ) : showBlockReasonsModal ? (
          <BlockAndReportReasonsModal
            reasons={blockReasons}
            victimId={targetUser && targetUser._id}
            visible={showBlockReasonsModal}
            roomId={selectedRoomId}
            onClose={async blockedResponse => {
              this.closeCloserModal();
              this.setState({ showBlockReasonsModal: false });
            }}
            // onSelect={_id => this.handleReasonSelection(_id)}
            hideModal={() => {
              this.closeCloserModal();
              this.setState({ showBlockReasonsModal: false });
              // setTimeout(() => {
              //   this.props.navigation.goBack();
              // }, 500);
            }}
          />
        ) : showDeleteConfirmation ? (
          <DeleteConversationModal
            roomId={deleteConversation && deleteConversation.roomId}
            onConfirm={() => {
              this.deleteConversation();
            }}
            onCancel={() => {
              this.setState({
                deleteConversation: null
              });
              this.closeCloserModal();
            }}
          />
        ) : isBundleConfirmationModalVisible ? (
          <BundleConfirmationModal
            // {...bundleConfirmation}
            count={bundleConfirmation.count}
            unit={bundleConfirmation.unit}
            goBack={confirmed => {
              if (confirmed) {
                bundleConfirmation.successCallback();
              } else {
                bundleConfirmation.failureCallback();
              }
              this.setState({
                isBundleConfirmationModalVisible: false,
                bundleConfirmation: null
              });
              this.closeCloserModal();
            }}
          />
        ) : showSharePreview ? (
          <SharePreview
            closeModal={this.closeShareModal}
            content={shareableContent}
          />
        ) : showOneTimeMonetisationTutorialSlides ? (
          <OneTimeMonetisationTutorial
            name={monetisationTutorialName}
            useLater={() => {
              this.dismissOneTimeMonetisationTutorial();
            }}
            useNow={() => {
              this.dismissOneTimeMonetisationTutorial(true);
            }}
          />
        ) : (
          <View />
        )}
      </CloserModal>
    );
  };
  renderYouGotCloser = () => {
    return (
      <ModalCurvedcard>
        <View
          style={{
            alignItems: "center"
          }}
        >
          <SvgUri
            width={DeviceWidth * 0.6}
            height={DeviceWidth * 0.6}
            source={require("../../assets/svgs/Chat/gotCloser.svg")}
          />
        </View>
        <BoldText
          style={{
            textAlign: "center",
            color: FONT_BLACK,
            fontSize: 20,
            marginBottom: 10
          }}
        >
          You just got {"\n"} closer!
        </BoldText>
        <VerticalGradientView
          style={{
            width: DeviceWidth * 0.7,
            height: 40,
            borderRadius: 40
          }}
          colors={[LIGHT_PURPLE, PURPLE]}
        >
          <RoundedEdgeButton
            style={{
              height: 40
            }}
            onPress={() => {
              this.dismissGotCloserModal();
            }}
          >
            <MediumText style={{ color: "#fff", fontSize: 18 }}>
              Continue
            </MediumText>
          </RoundedEdgeButton>
        </VerticalGradientView>
      </ModalCurvedcard>
    );
  };
  updateRoomInStore = response => {};

  showOneTimeMonetisationTutorial = (
    monetisationTutorialName,
    monetisationTutorialCbFunction
  ) => {
    this.setState({
      showOneTimeMonetisationTutorialSlides: true,
      monetisationTutorialName,
      monetisationTutorialCbFunction
    });
    this.openCloserModal();
  };

  dismissOneTimeMonetisationTutorial = tappedUseNow => {
    this.closeCloserModal();
    this.setState({ showOneTimeMonetisationTutorialSlides: false }, () => {
      if (tappedUseNow) {
        setTimeout(() => {
          this.state.monetisationTutorialCbFunction();
        }, 300);
      }
    });
  };

  extend24Hours = async () => {
    const { myData, updateProfile } = this.props;
    if (
      !myData.seenMonetisationTutorials ||
      myData.seenMonetisationTutorials.indexOf("Extensions") === -1
    ) {
      this.showOneTimeMonetisationTutorial("Extensions", () => {
        this.handleExtend24HoursMonetizationCases();
      });
      const seenMonetisationTutorials = myData.seenMonetisationTutorials || [];
      seenMonetisationTutorials.push("Extensions");
      updateProfile({ seenMonetisationTutorials });
      UserApi.updateProfile({ seenMonetisationTutorials }, cbUpdated => {});
    } else {
      this.handleExtend24HoursMonetizationCases();
    }
  };
  handleExtend24HoursMonetizationCases = () => {
    const {
      myData,
      gemPacks: plans,
      extendedCount,
      selectedRoomId,
      expenseTutorials,
      setExpenseTutorial,
      adminProps,
      userPacks
    } = this.props;
    const { dailyFreeExtensionsLimit } = adminProps;
    const { extensionPack: pricePack } = this.state;
    console.log("extensionPack is:", pricePack);

    const pack =
      userPacks &&
      userPacks.find(p => p.itemId && p.itemId.value === "EXTENSIONS");
    const freeUsagecall = () => {
      useFreeQuotaPack(pricePack._id, usageResult => {
        if (usageResult.success) {
          extendApiCall();
          this.fetchUserPurchasedPacks();
        }
      });
    };
    const usePuchasedPackCall = () => {
      usePurchasedPack(pricePack._id, usageResult => {
        if (usageResult.success) {
          extendApiCall();
          this.fetchUserPurchasedPacks();
        }
      });
    };
    const extendApiCall = () => {
      RoomApi.extend24Hours(selectedRoomId, res => {
        console.log(" one %%%%%% ", res);
        if (res.success && res.data) {
          this.fetchRoomsData();
          // PackApi.purchaseGems()
          // this.updateRoomInStore(res.data)
        } else {
          alert("error");
        }
        this.setState({
          extendBtnLoading: false
        });
        this.props.updateExtendedCount(extendedCount + 1);
      });
    };
    const purchaseApiCall = () => {
      PackApi.purchaseGems(-pricePack.price, result => {
        console.log("purchased ", result);
        if (result.success) {
          this.props.updateProfile({
            gems_count: result.data.gems_count
          });
          // extendApiCall()
        } else {
          alert("error");
        }
      });
    };
    if (!pack) {
      // freeUsagecall();
      this.showAnimatedCount({
        fromCount: 1,
        toCount: 0,
        itemIcon: MONETIZATION_ICONS["EXTENSIONS"],
        onCountAnimated: () => freeUsagecall()
      });
    } else {
      const startOfDay = getStartOfDay();
      const isFreeCountCrossed =
        pack.freeUsageCount >= dailyFreeExtensionsLimit;
      const isLastUsedNotToday = pack.freeUsageUpdatedAt < startOfDay;

      const isHavingPurchasedItems = pack.purchasedCount > 0;
      const isGemsEnough = myData.gems_count >= pricePack.price;
      const isLastUsageMonitizedOne =
        !!pack.monetisedUpdatedAt &&
        pack.freeUsageUpdatedAt < userPack.monetisedUpdatedAt;
      const hasUsedMonization = pack.monetisedUsage !== 0;
      const helperText = isLastUsageMonitizedOne
        ? "Out of Extensions"
        : "Done for Today";
      const refreshedAt = isLastUsageMonitizedOne
        ? pack.monetisedUpdatedAt
        : pack.freeUsageUpdatedAt;
      this.setState({
        extendBtnLoading: true
      });
      if (isLastUsedNotToday) {
        // freeUsagecall();
        this.showAnimatedCount({
          fromCount: pack.purchasedCount + 1,
          toCount: pack.purchasedCount,
          itemIcon: MONETIZATION_ICONS["EXTENSIONS"],
          onCountAnimated: () => freeUsageCall()
        });
      } else if (!isFreeCountCrossed) {
        // freeUsagecall();
        this.showAnimatedCount({
          fromCount: pack.freeUsageCount,
          toCount: pack.freeUsageCount - 1,
          itemIcon: MONETIZATION_ICONS["EXTENSIONS"],
          onCountAnimated: () => freeUsageCall()
        });
      } else if (isHavingPurchasedItems) {
        // usePuchasedPackCall();
        this.showAnimatedCount({
          fromCount: pack.purchasedCount,
          toCount: pack.purchasedCount - 1,
          itemIcon: MONETIZATION_ICONS["EXTENSIONS"],
          onCountAnimated: () => usePuchasedPackCall()
        });
      } else if (isGemsEnough) {
        const hasSeenTutorial =
          expenseTutorials[pack._id] &&
          expenseTutorials[pack._id] > EXPENSE_THRESHOLD_COUNT;
        console.log(" has seen one are ", hasSeenTutorial);
        if (hasSeenTutorial) {
          this.setState({
            extendBtnLoading: true
          });
          setTimeout(() => {
            const fromCount = myData.gems_count;
            const toCount = fromCount - pricePack.price;
            this.showAnimatedCount({
              fromCount,
              toCount,
              itemIcon: MONETIZATION_ICONS["GEMS"],
              onCountAnimated: () => {
                console.log(" called purchased one rey");

                this.setState({
                  extendBtnLoading: false
                });
                purchaseApiCall();
                setExpenseTutorial(pack._id);
              }
            });
          }, 300);
        } else {
          this.setState({
            isPurchaseConfirmationVisible: true,
            consumptionConfirmation: {
              successCallback: () => {
                setTimeout(() => {
                  const fromCount = myData.gems_count;
                  const toCount = fromCount - pricePack.price;
                  this.showAnimatedCount({
                    fromCount,
                    toCount,

                    itemIcon: MONETIZATION_ICONS["GEMS"],
                    onCountAnimated: () => {
                      console.log(" called purchased one bobda");

                      this.setState({
                        extendBtnLoading: true
                      });
                      purchaseApiCall();
                    }
                  });
                }, 300);
              },
              failureCallback: () => {
                console.log(" user didnt use those gems ");
              }
            }
          });
          this.openCloserModal();
        }
      } else {
        const buyPower = {
          successCallback: selectedCount => {
            this.setState({
              extendBtnLoading: true
            });
            setTimeout(() => {
              const fromCount = selectedCount;
              const toCount = selectedCount - pricePack.price;
              this.showAnimatedCount({
                fromCount,
                toCount,
                itemIcon: MONETIZATION_ICONS["GEMS"],
                onCountAnimated: () => {
                  console.log(" called purchased one three");

                  purchaseApiCall();
                }
              });
              // setTimeout(() => {
              // }, 1500);
            }, 300);
          },
          failureCallback: () => {
            console.log(" user didn't buy it");
            this.setState({
              extendBtnLoading: false
            });
          },
          extraData: { extraDescription: helperText, refreshedAt },
          hasOffers: true,
          showHelperText: true
        };
        const bulkPurchase = {
          bulkItemName: "EXTENSIONS",
          extraData: { extraDescription: helperText },
          successCallback: newItemCount => {
            setTimeout(async () => {
              this.showAnimatedCount({
                fromCount: newItemCount,
                toCount: newItemCount - 1,
                itemIcon: MONETIZATION_ICONS["EXTENSIONS"],
                onCountAnimated: () => {
                  usePurchasedPack(pack._id, purchaseResult => {
                    if (purchaseResult.success) {
                      extendApiCall();
                      this.fetchUserPurchasedPacks();
                    }
                  });
                }
              });
            }, 300);
          },
          failureCallback: () => {
            this.setState({
              extendBtnLoading: false
            });
          }
        };
        this.setState({
          isBuyGemsModalVisible: true,
          isNewCloserModalVisible: true,
          isBundlePurchaseModalVisible: false,
          buyPower,
          bulkPurchase
        });
      }
    }
  };
  componentWillUnmount = () => {
    clearInterval(this.uptimeInterval);
    this.props.clearCurrentRoomId();
    this.props.unSubscribeToTyping();
  };

  dismisGameUnlockModal = () => {
    this.setState(
      {
        isGameUnlockModalVisible: false,
        unlockedGameName: ""
      },
      this.closeCloserModal
    );
  };
  renderGameUnlockModal = gameName => {
    return (
      <ModalCurvedcard>
        <View
          style={{
            alignItems: "center"
          }}
        >
          <SvgUri
            width={DeviceWidth * 0.6}
            height={DeviceWidth * 0.6}
            source={require("../../assets/svgs/Chat/gotCloser.svg")}
          />
        </View>
        <BoldText
          style={{
            textAlign: "center",
            color: FONT_BLACK,
            fontSize: 20,
            marginBottom: 10
          }}
        >
          {gameName} is just unlocked
        </BoldText>
        <VerticalGradientView
          style={{
            width: DeviceWidth * 0.7,
            height: 40,
            borderRadius: 40
          }}
          colors={[LIGHT_PURPLE, PURPLE]}
        >
          <RoundedEdgeButton
            style={{
              height: 40
            }}
            onPress={() => {
              this.dismisGameUnlockModal();
            }}
          >
            <MediumText style={{ color: "#fff", fontSize: 18 }}>
              Continue
            </MediumText>
          </RoundedEdgeButton>
        </VerticalGradientView>
      </ModalCurvedcard>
    );
  };

  showAnimatedCount = ({ fromCount, toCount, itemIcon, onCountAnimated }) => {
    this.setState({
      itemIcon,
      fromCount,
      toCount,
      isAnimatedCountVisilble: true,
      onCountAnimated
    });
  };

  setModalConditions = (modalName, openingModalOptions) => {
    this.setState({
      isBuyGemsModalVisible: modalName === "isBuyGemsModalVisible",
      buyPower:
        modalName === "isBuyGemsModalVisible" ? openingModalOptions : null,

      isBundlePurchaseModalVisible:
        modalName === "isBundlePurchaseModalVisible",
      bulkPurchase:
        modalName === "isBundlePurchaseModalVisible"
          ? openingModalOptions
          : null,

      isNewCloserModalVisible: true
    });
  };
  renderNewCloserModal = () => {
    const {
      isBuyGemsModalVisible,
      isBundlePurchaseModalVisible,
      isNewCloserModalVisible
    } = this.state;
    return (
      <View style={{ zIndex: 10 }}>
        <NewCloserModal inSecondLevel={true} visible={isNewCloserModalVisible}>
          {isBuyGemsModalVisible && this.renderBuyPowerModal()}
          {isBundlePurchaseModalVisible && this.renderBulkPurchaseModal()}
        </NewCloserModal>
      </View>
    );
  };
  onLevelStarTapped = () => {
    // this.setState({
    //   unlockedGameName: "vibe",
    //   isGameUnlockModalVisible: true
    // });
    // this.openCloserModal();
    this.setState({
      starPopupVisible: true
    });
  };
  renderStarPopup = () => {
    const { starPopupVisible, roomLevel } = this.state;
    if (!starPopupVisible) {
      return null;
    }
    return (
      <>
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            position: "absolute",
            zIndex: 20,
            backgroundColor: "#000",
            opacity: 0.6
          }}
          onTouchStart={() => {
            this.setState({
              starPopupVisible: false
            });
          }}
        ></View>
        <StarPopUp isFriends={true} roomLevel={roomLevel} />
      </>
    );
  };
  render() {
    const {
      targetUser,
      enableLoadEarlierButton,
      messages,
      blockReasons,
      showBlockReasonsModal,
      extendBtnLoading,
      roomLevel,
      isAnimatedCountVisilble,
      animatedCount,
      fromCount,
      toCount,
      itemIcon,
      isBundlePurchaseModalVisible,
      showImagePreview,
      showCopyOverlay,
      isBuyGemsModalVisible,
      starPopupVisible
    } = this.state;
    const {
      myData,
      allRooms,
      selectedRoomId,
      isOpponentLive,
      notificationPermissionGranted,
      navigation: {
        state: { params }
      }
    } = this.props;
    const room = allRooms[selectedRoomId];
    if (!room) {
      return <View />;
    }

    return (
      <>
        {starPopupVisible && this.renderStarPopup()}
        {this.renderNewCloserModal()}
        {targetUser && targetUser._id && myData && (
          <View
            style={{
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 1
              },
              shadowOpacity: 0.2,
              elevation: 1
            }}
          >
            <ChatBoxHeaderGradient
              popUpOpen={starPopupVisible}
              roomLevel={roomLevel}
              onLevelStarTapped={this.onLevelStarTapped}
              onDeleteConversationClicked={() => {
                this.openCloserModal();
                this.setState({
                  deleteConversation: {
                    roomId: selectedRoomId
                  }
                });
              }}
              showBlockReasons={() => {
                this.openCloserModal();
                this.setState({ showBlockReasonsModal: true });
              }}
              showUnFriendConfirmation
              onUnfriend={async blockedResponse => {
                // setTimeout(async () => {
                this.props.navigation.goBack();
                await this.props.removeBlockedUserFromRooms(
                  selectedRoomId,
                  blockedResponse
                );
                // }, 500);
                setTimeout(() => {
                  Alert.alert(
                    "DONE",
                    `Unfriended  ${targetUser && targetUser.name} !  `,
                    [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                    { cancelable: false }
                  );
                }, 750);
              }}
              selectedRoomId={selectedRoomId}
              navParams={params}
              expiresAt={room.expiresAt}
              showProgress={room.status === "SLOT"}
              targetUser={targetUser}
              showOnlineStatus={room.status !== "SLOT"}
              isFriend={room.status !== "SLOT"}
              isUserLive={isOpponentLive}
              myData={myData}
              openOtherProfileModal={this.toggleProfileModal}
              navigation={this.props.navigation}
            />
          </View>
        )}
        {room.status === "SLOT" ? (
          <>
            <WaitingBar
              ref="waiting_bar"
              expiresAt={room.expiresAt}
              extendedCount={room.extendedCount || 0}
              loading={extendBtnLoading}
              updateTime={room.status === "SLOT"}
              onExtend24HoursTapped={this.extend24Hours}
            />
            {!notificationPermissionGranted && (
              <PermissionWidget
                user={targetUser}
                close={() => {
                  this.setState({
                    showPermissionWidget: false
                  });
                }}
              />
            )}
            {isAnimatedCountVisilble && (
              <AnimateCountModal
                fromWaitingBar={true}
                reverse={true}
                fromCount={fromCount}
                toCount={toCount}
                onComplete={this.state.onCountAnimated}
                itemIcon={require("../../assets/svgs/MyProfile/Gem.svg")}
                closeCountModal={() =>
                  this.setState({
                    isAnimatedCountVisilble: false,
                    fromCount: null,
                    toCount: null
                  })
                }
              />
            )}
          </>
        ) : (
          <View />
        )}

        {this.renderCloserModal()}

        {this.renderBlackBackground()}
        {/* {this.renderQuestionPicker()} */}
        {this.renderShadow()}
        {showImagePreview ? this.renderImagePreview() : <View />}
        {showCopyOverlay ? this.renderCopyOverlay() : <View />}

        {/* {this.renderGiphyPicker()} */}
        {this.renderOthersProfileModal()}
        {this.renderResponseScreen()}

        <GiftedChat
          inverted
          alignTop
          showsVerticalScrollIndicator={false}
          extraData={{ ...this.props, ...this.state }}
          scrollToBottom
          loadEarlier={enableLoadEarlierButton}
          renderFooter={() => {
            return <View style={{ height: 30 }} />;
          }}
          renderLoadEarlier={this.renderLoadEarlier}
          scrollToBottomComponent={this.renderScrollToBottomIcon}
          messages={messages}
          renderComposer={this.renderInputContainer}
          onSend={msg => this.onSend(msg)}
          renderMessage={this.renderMessage}
          user={{
            _id: myData._id
          }}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  tickIcon: {
    position: "absolute",
    left: 80,
    top: 12
  },
  topHeader: {
    height: 50,
    width: DeviceWidth,
    flexDirection: "row",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20
  },
  opacityCardView: {
    zIndex: 2,
    position: "absolute",
    height: DeviceHeight,
    width: DeviceWidth
  }
});

const mapStateToProps = state => {
  return {
    rooms: state.rooms.rooms,
    myData: state.info.userInfo,
    allReasons: state.info.reasons,
    selectedRoomId: state.rooms.selected_room_id,
    allRooms: state.rooms.rooms,
    messages: state.rooms.messages,
    pushAndSendMsg: state.chat.pushAndSendMsg,
    currentResponses: state.nav.currentResponses,
    currentChatScreenIndex: state.nav.currentChatScreenIndex,
    gemPacks: state.app.packPrices,
    extendedCount: state.app.extendedCount,
    newEditedMessage: state.rooms.editedMessage,
    expenseTutorials: state.tutorial.expenses,
    adminProps: state.app.adminProps,
    userPacks: state.app.userPacks,
    shareableContent: state.nav.shareableContent,
    msgsToBeUpdated: state.nav.msgsToBeUpdated,
    notificationPermissionGranted: state.nav.notificationPermissionGranted,
    allGameNames: state.questions.gameNames,
    cronState: state.userstate.cronState,
    tutorialRooms: state.tutorial.tutorialRooms,
    firebaseNotification: state.nav.firebaseNotification,
    currentScreenIndex: state.nav.currentScreenIndex
  };
};

const mapDispatchToProps = dispatch => ({
  getMessages: bindActionCreators(ChatActions.getMessages, dispatch),
  setRooms: bindActionCreators(ChatActions.setRooms, dispatch),
  setRoomsArray: bindActionCreators(ChatActions.setRoomsArray, dispatch),
  sendMessage: bindActionCreators(ChatActions.sendMessage, dispatch),
  unsubscribeMessages: bindActionCreators(
    ChatActions.unSubscribeToMessages,
    dispatch
  ),
  subcribeToTypingStatus: bindActionCreators(
    ChatActions.subscribeToTypingStatus,
    dispatch
  ),
  unSubscribeToTyping: bindActionCreators(ChatActions.unsubscribe, dispatch),
  changeTypingStatus: bindActionCreators(
    ChatActions.changeTypingStatus,
    dispatch
  ),
  subscribeToRoom: bindActionCreators(
    ChatActions.subscribeToMessages,
    dispatch
  ),
  pushAndSendMessage: bindActionCreators(
    msgActions.pushAndSendMessage,
    dispatch
  ),
  clearCurrentRoomId: bindActionCreators(resetCurrentRoomId, dispatch),
  setMessage: bindActionCreators(ChatActions.setMessage, dispatch),
  setFriendObj: bindActionCreators(ChatActions.setFriendObj, dispatch),
  resetResponses: bindActionCreators(resetResponses, dispatch),
  setChatTextDot: bindActionCreators(setChatTextDot, dispatch),
  updateProfile: bindActionCreators(infoActions.updateOwnProfile, dispatch),
  updateExtendedCount: bindActionCreators(
    appActions.incrimentExtendedCount,
    dispatch
  ),
  setEditedMessage: bindActionCreators(ChatActions.setEditedMessage, dispatch),
  removeBlockedUserFromRooms: bindActionCreators(removeOneRoom, dispatch),
  resetUnreadMessages: bindActionCreators(
    ChatActions.resetUnreadMessageCount,
    dispatch
  ),
  clearOneRoomMessages: bindActionCreators(
    ChatActions.clearOneRoomMessages,
    dispatch
  ),
  openOneRoom: bindActionCreators(ChatActions.selectOneRoom, dispatch),
  setExpenseTutorial: bindActionCreators(addExpenseTutorialCount, dispatch),
  addSparkToRoom: bindActionCreators(addSparkToRoom, dispatch),
  setPickerDisability: bindActionCreators(
    ChatActions.setPickerDisability,
    dispatch
  ),
  setCloserPopoverVisibility: bindActionCreators(
    setCloserPopoverVisibility,
    dispatch
  ),
  setPackPrices: bindActionCreators(appActions.setPackPrices, dispatch),
  incrimentExpenseTutorial: bindActionCreators(
    addExpenseTutorialCount,
    dispatch
  ),
  setUserPacks: bindActionCreators(appActions.setUserPacks, dispatch),
  pushUploadingImageMsgId: bindActionCreators(
    pushUploadingImageMsgId,
    dispatch
  ),
  updateUploadingImageStatus: bindActionCreators(
    updateUploadingImageStatus,
    dispatch
  ),
  editMessage: bindActionCreators(ChatActions.editMessage, dispatch),
  setTutorialRoom: bindActionCreators(setTutorialRoom, dispatch),
  setQuestionCardVisibility: bindActionCreators(
    setQuestionCardVisibility,
    dispatch
  ),
  addNewRespone: bindActionCreators(addNewResponse, dispatch),
  setFirebaseNotification: bindActionCreators(setFirebaseNotification, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatWindow);
