import Lodash from "lodash";
import moment from "moment";
import React, { Component } from "react";
import {
  FlatList,
  ScrollView,
  View,
  Linking,
  Vibration,
  StyleSheet,
  LayoutAnimation
} from "react-native";
import { StackActions } from "react-navigation";
import Animated from "react-native-reanimated";
import SvgUri from "react-native-svg-uri";
import Ionicon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import FriendsItem from "../../components/Chat/Friends.item";
import NonFriendsItem from "../../components/Chat/NonFriends.item";
import BoldText from "../../components/Texts/BoldText";
import MediumText from "../../components/Texts/MediumText";
import RegularText from "../../components/Texts/RegularText";
import CircularImage from "../../components/Views/CircularImage";
import NoFeedbackTapView from "../../components/Views/NoFeedbackTapView";
import RowView from "../../components/Views/RowView";
import firebase from "react-native-firebase";
import NewCloserModal from "../../components/Common/NewCloserModal";
import {
  BRIGHT_RED,
  FONT_BLACK,
  FONT_GREY,
  PURPLE,
  WHITE
} from "../../config/Colors";
import {
  LEFT_MARGIN,
  STACK_TYPES,
  STACK_RELEASE_PROCESSES,
  gemPlanColors,
  VIBRATION_DURATION,
  MONETIZATION_ICONS,
  MONETIZATION_ITEMS
} from "../../config/Constants";
import { DeviceHeight, DeviceWidth } from "../../config/Device";
import * as RoomApi from "../../network/rooms";
import {
  setCurrentChatScreenIndex,
  setCurrentScreenIndex,
  setFirebaseNotification
} from "../../redux/actions/nav";
import {
  setBellIconDot,
  setChatIconDot,
  setChatTextDot,
  setReceivedTextDot,
  setSentTextDot
} from "../../redux/actions/notification";
import {
  resetUnreadMessageCount,
  selectOneRoom,
  setClient,
  setFriendObj,
  setOnlineStatus,
  setRooms,
  setRoomsArray,
  subscribeToAllRooms,
  subscribeToUserLiveStatus,
  setMissedRequests,
  setNewActivity
} from "./../../redux/actions/rooms";
import { styles } from "../../styles/Chatfavourites";
import { userNamify, getTimeStamp, namify } from "../../config/Utils";
import { updateProfile } from "../../network/user";
import {
  purchaseGems,
  consumeAndFulFill,
  purchaseAndFulfill
} from "../../network/pack";
import { updateOwnProfile } from "../../redux/actions/user.info";
import SentReactions from "../../components/Tutorials/SentReactions";
import CloserModal from "../../components/Views/Closer.modal";
import DeleteConversationModal from "../../components/Common/DeleteConversationModal";
import BuyModal from "../../components/Gemsflow/BuyModal";
import BulkPurchaseModal from "../../components/Common/BulkPurchaseModal";
import GemCountModal from "../../components/Gemsflow/GemCountModal";
import StackReleaseModal from "../../components/Chat/StackReleaseModal";
import { STATIC_URL } from "../../config/Api";
import JustifiedCenteredView from "../../components/Views/JustifiedCenteredView";
import { storeData, retrieveData } from "../../config/Storage";
import Notification from "../../components/Common/Notification";
import { runTimingForNavbarNob } from "../../config/Animations";
import {
  setPresetContentModalVisibility,
  setReceivedSectionTutorialVisibility,
  setSentSectionTutorialVisibility,
  setFriendsSectionTutorialVisibility,
  setTopNavTabTutorials,
  deleteOneTopNavTabTutorial
} from "../../redux/actions/tutorials";
import PresetModal from "../../components/Surfing/PresetModal";
import PresetModalTwo from "../../components/Surfing/PresetModalTwo";
import StackTutorialPopup from "../../components/Tutorials/StackTutorialPopup";
import Stack from "../../components/ChatFavourites/Stack";
import GemsAcknowledgement from "../../components/Gemsflow/GemsAcknowledgement";
import CustomTappableScale from "../../components/Common/TouchableScale";

const { Value } = Animated;

const TAB_NAMES = ["SENT", "RECEIVED"];
const stackSneakPeakCount = 2;

const initialNotificationObj = {
  notificationText: "",
  notificationTitle: "",
  notificationImage: "",
  notificationRoomId: "",
  openChatWindow: false,
  showName: false
};
class ChatFavourites extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: ["Friends", "Received", "Sent"],
      rooms: [],
      pressedIn: false,
      showStackList: false,
      showTopNavbarTutorial: false,
      //close modal
      isCloserModalVisible: false,
      //delete conversation
      isDeleteConversationModalVisible: false,
      deleteConversation: null,
      deleteConversationLoading: false,
      //buy power
      isBuyPowerModalVisible: false,
      buyPower: null,
      //bulk purchase
      isBulkPurchaseModalVisible: false,
      bulkPurchase: null,
      //gem count modal
      isGemCountModalVisible: false,
      gemsConsumption: null,
      //stack release modal
      isStackReleaseModalVisible: false,
      stackRelease: null,
      //missed request required boolean
      missedRequestsAvailable: false,
      // permissionGranted: true,

      notification: initialNotificationObj,
      isPresetModalVisible: false,
      isPresetModalTwoVisible: false,
      isStackTutorialVisibile: false,
      isStackTutorialFirstTime: false,
      stackTutorialType: null,
      isNewCloserModalVisible: false
    };
    this.showGemsCountAnimation = new Value(0);
    this.gemsFromCount = 0;
    this.gemsToCount = 0;
  }

  checkAndVibrate = () => {
    const { myData } = this.props;
    const { vibrationsEnabled = true } = myData;

    if (vibrationsEnabled) {
      Vibration.vibrate(VIBRATION_DURATION);
    }
  };
  componentWillReceiveProps = nextProps => {
    if (nextProps.newActivity !== null) {
      const { newActivity, allRooms } = nextProps;
      const {
        roomId,
        body,
        sender,
        type,
        senderShowName,
        inAppNotificationEnabled = true
      } = newActivity;
      console.log(" type is ", type);

      const { postedBy, answeredBy, status } = allRooms[roomId];
      this.checkAndVibrate();
      if (inAppNotificationEnabled) {
        this.setState(
          {
            notification: {
              notificationTitle: namify(postedBy.name || ""),
              notificationText: `Sent you ${namify(type)}`,
              notificationImage:
                (postedBy && postedBy.images && postedBy.images[0]) || "",
              notificationRoomId: roomId,
              openChatWindow: status === "SLOT" ? false : true,
              showName: senderShowName
            }
          },
          () => {
            this.showInappNotification();
          }
        );
      }
      this.props.setNewActivity(null);
    }
    if (nextProps.firebaseNotification !== null) {
      const { firebaseNotification } = nextProps;
      this.fetchDataAndSetDots(firebaseNotification);
      this.props.setFirebaseNotification(null);
    }
  };

  showInappNotification = () => {
    this.setState({
      notificationVisible: true
    });
  };
  handleFirbaseNotification = () => {
    firebase
      .messaging()
      .hasPermission()
      .then(permissionGranted => {
        this.setState({
          permissionGranted
        });
      });
  };
  handleStackTutorials = () => {
    const {
      topNavTabTutorialsSeen,
      sentStackTutorialSeen,
      receivedStackTutorialSeen,
      currentChatScreenIndex,
      deleteOneTopNavTabTutorial
    } = this.props;

    if (currentChatScreenIndex === 0) {
      //ignore if user in friends tab
      return;
    }
    let stackTutorialType;
    let isStackTutorialVisibile;
    let isStackTutorialFirstTime = false;
    console.log("new chat screen index is  ", currentChatScreenIndex);

    if (currentChatScreenIndex === 2) {
      //sent tab
      stackTutorialType = TAB_NAMES[0];
      if (topNavTabTutorialsSeen.includes(TAB_NAMES[0])) {
        isStackTutorialVisibile = true;
        deleteOneTopNavTabTutorial(TAB_NAMES[0]);
      }
      if (sentStackTutorialSeen === false) {
        isStackTutorialFirstTime = true;
      }
    }
    if (currentChatScreenIndex === 1) {
      // received tab
      stackTutorialType = TAB_NAMES[1];

      if (topNavTabTutorialsSeen.includes(TAB_NAMES[1])) {
        isStackTutorialVisibile = true;
        deleteOneTopNavTabTutorial(TAB_NAMES[1]);
      }
      if (receivedStackTutorialSeen === false) {
        isStackTutorialFirstTime = true;
      }
    }
    if (isStackTutorialVisibile) {
      this.setState({
        isStackTutorialVisibile: true,
        isStackTutorialFirstTime,
        stackTutorialType
      });
    }
  };
  // componentDidUpdate = (prevProps, prevState) => {
  //   if (
  //     prevProps.currentChatScreenIndex !== this.props.currentChatScreenIndex
  //   ) {
  //     timing(this.state.animatedBottomBar, {
  //       toValue: (this.props.currentChatScreenIndex - 1) * DeviceWidth * 0.29,
  //       duration: 130,
  //       easing: Easing.linear // Easing.elastic()
  //     }).start();
  //     // this.switchTab(this.props.currentChatScreenIndex - 1);
  //   }
  // };

  getNobPosition = () => {
    const { currentChatScreenIndex } = this.props;
    if (currentChatScreenIndex === 0) {
      return new Value(-DeviceWidth * 0.29);
    } else if (currentChatScreenIndex === 1) {
      return new Value(0);
    } else {
      return new Value(DeviceWidth * 0.29);
    }
  };

  animation = this.getNobPosition();
  initialValue = new Value(0);
  animatedBottomBar = runTimingForNavbarNob(
    this.initialValue,
    this.animation,
    200
  );
  fetchRoomsData = async () => {
    const { setRooms, setRoomsArray } = this.props;
    RoomApi.getRooms(cbRooms => {
      if (cbRooms.success) {
        setRooms(cbRooms.data);
        setRoomsArray(cbRooms.data);
        return true;
      }
    });
  };

  handleResponseNotifications = (parsedData, inAppNotificationEnabled) => {
    const {
      setSentTextDot,
      setReceivedTextDot,
      currentChatScreenIndex
    } = this.props;
    const { type, name, image, showName = false } = parsedData;
    let targetChatIndex;
    console.log(" all parsed data is ", parsedData);
    if (type === appConstants.POST_TO_PROFILE) {
      if (currentChatScreenIndex !== 1) {
        setReceivedTextDot(true);
        targetChatIndex = 1;
      }
    } else {
      if (currentChatScreenIndex !== 2) {
        targetChatIndex = 2;
        setSentTextDot(true);
      }
    }
    // this.props.setCurrentChatScreenIndex(targetChatIndex);
    console.log(" in app notification enabled is ", inAppNotificationEnabled);
    if (inAppNotificationEnabled) {
      this.setState({
        notificationVisible: true,
        notification: {
          notificationText: `Reacted to you`,
          notificationTitle: name,
          notificationImage: image,
          openChatWindow: false,
          showName
        }
        // targetChatIndex
      });
    }
  };

  handleFriendsNotifications = (parsedData, inAppNotificationEnabled) => {
    const {
      currentScreenIndex,
      currentChatScreenIndex,
      setChatTextDot,
      myData,
      setReceivedTextDot,
      setSentTextDot,
      setFriendObj
    } = this.props;
    const {
      type,
      postedBy,
      _id: friendObjId,
      createdAt,
      name,
      image,
      roomId
    } = parsedData;
    if (type === constants.appConstants.PENDING_FRIEND_REQUEST) {
      if (currentScreenIndex !== 4) {
        let friendObj = {
          user: parsedData.user,
          createdAt,
          friend: myData._id,
          _id: friendObjId,
          status: constants.appConstants.PENDING_FRIEND_REQUEST
        };
        setFriendObj(friendObj);
      } else {
        this.fetchRoomsData();
      }
      if (postedBy === myData._id) {
        if (currentChatScreenIndex !== 1) {
          setReceivedTextDot(true);
        }
      } else {
        if (currentChatScreenIndex !== 2) {
          setSentTextDot(true);
        }
      }
    } else {
      if (currentScreenIndex === 4) {
        let friendObj = {
          friend: parsedData.friend,
          createdAt,
          user: myData._id,
          _id: friendObjId,
          status: appConstants.BECAME_FRIEND
        };
        setFriendObj(friendObj);
      } else {
        this.fetchRoomsData();
        if (inAppNotificationEnabled) {
          this.setState({
            notificationVisible: true,
            notitication: {
              notificationTitle: namify(name),
              notificationText: `Got closer`,
              notificationImage: image,
              notificationRoomId: roomId,
              openChatWindow: true
            }
          });
        }
      }
      if (currentChatScreenIndex !== 0) {
        setChatTextDot(true);
      }
    }
  };
  handleSparkNotification = (type, parsedData, inAppNotificationEnabled) => {
    const { myData } = this.props;
    const { name, showName, image, postedBy, answeredBy, roomId } = parsedData;
    if (postedBy === myData._id) {
      // this.props.setCurrentChatScreenIndex(1);
    } else if (answeredBy === myData._id) {
      // this.props.setCurrentChatScreenIndex(2);
    }
    if (inAppNotificationEnabled) {
      this.setState(
        {
          notificationVisible: true,
          notification: {
            notificationTitle: userNamify({ name, showName }),
            notificationText: `Sent you ${namify(type)}`,
            notificationImage: image,
            notificationRoomId: roomId,
            openChatWindow: false
          }
        },
        () => {
          this.fetchRoomsData();
          // this.showInappNotification();
        }
      );
    }
  };
  handleMessageNotifications = (parsedData, inAppNotificationEnabled) => {
    const { currentScreenIndex, allRooms, myData } = this.props;
    if (currentScreenIndex < 3) {
      const { name, type, image, roomId } = parsedData;
      const room = allRooms[roomId];
      const { postedBy } = allRooms[roomId];
      if (!postedBy) {
        console.log(" posted by is null ", roomId, allRooms[roomId]);
        return;
      }
      if (postedBy._id === myData._id) {
        // this.props.setCurrentChatScreenIndex(1);
      } else if (answeredBy._id === myData._id) {
        // this.props.setCurrentChatScreenIndex(2);
      }
      if (inAppNotificationEnabled) {
        this.setState({
          notificationVisible: true,
          notitication: {
            notificationTitle: namify(name),
            notificationText: `Sent you ${namify(type)}`,
            notificationImage: image,
            notificationRoomId: roomId,
            openChatWindow: room.status === "SLOT" ? false : true
          }
        });
      }
    }
  };
  fetchDataAndSetDots = payload => {
    console.log("Incoming message notifications 11", payload);
    const { currentScreenIndex, setChatIconDot } = this.props;
    if (currentScreenIndex < 3) {
      setChatIconDot(true);
    }
    if (payload && payload.data) {
      const { type, data, inAppNotificationEnabled = true } = payload.data;

      if (data) {
        const parsedData = JSON.parse(data);
        if (type === NOTIFICATION_TYPES.RESPONSE) {
          this.fetchRoomsData();
          this.handleResponseNotifications(
            parsedData,
            inAppNotificationEnabled
          );
        } else if (type === NOTIFICATION_TYPES.FRIEND_REQUEST) {
          this.handleFriendsNotifications(parsedData, inAppNotificationEnabled);
        } else if (type === NOTIFICATION_TYPES.SPARK) {
          this.handleSparkNotification(
            type,
            parsedData,
            inAppNotificationEnabled
          );
        } else {
          this.handleMessageNotifications(parsedData, inAppNotificationEnabled);
        }
        x;
      }
    }
  };
  moveNavBarNob = to => {
    switch (to) {
      case 0:
        this.animation.setValue(-DeviceWidth * 0.29);
        break;

      case 1:
        this.animation.setValue(0);
        break;

      case 2:
        this.animation.setValue(DeviceWidth * 0.29);
        break;

      default:
        break;
    }
  };

  componentDidMount = () => {
    this.handleOneTimeTutorials();
    this.handleFirbaseNotification();
    this.handleStackTutorials();
  };

  handleOneTimeTutorials = () => {
    const {
      currentChatScreenIndex,
      friendsSectionTutorialSeen,
      sentReactionsTutorialSeen,
      receivedReactionsTutorialSeen
    } = this.props;

    setTimeout(() => {
      switch (currentChatScreenIndex) {
        case 0:
          if (!friendsSectionTutorialSeen) {
            this.handleFriendsSectionTutorial();
          }
          break;

        case 1:
          if (!receivedReactionsTutorialSeen) {
            this.handleReceivedSectionTutorial();
          }
          break;

        case 2:
          if (!sentReactionsTutorialSeen) {
            this.handleSentSectionTutorial();
          }
          break;

        default:
          break;
      }
    }, 1000);
  };

  showPresetModal = () => {
    this.setState({ isPresetModalVisible: true });
    this.openCloserModal();
  };

  getReceivedRequestsCount = () => {
    return this.props.roomsArray.filter(({ status, answeredBy }) => {
      if (status === "SLOT" && answeredBy._id !== this.props.myData._id) {
        return true;
      }
    }).length;
  };

  getSentRequestsCount = () => {
    return this.props.roomsArray.filter(({ status, answeredBy }) => {
      if (status === "SLOT" && answeredBy._id === this.props.myData._id) {
        return true;
      }
    }).length;
  };

  getFriendsCount = () => {
    return this.props.roomsArray.filter(({ status }) => {
      if (status !== "SLOT") {
        return true;
      }
    }).length;
  };

  handlePresetModalTutorial = () => {
    const {
      roomsArray,
      presetContentSeen,
      myData,
      setPresetContentModalVisibility
    } = this.props;
    if (!presetContentSeen) {
      const myReceivedRequets = roomsArray.filter(({ status, answeredBy }) => {
        if (status === "SLOT" && answeredBy._id !== myData._id) {
          return true;
        }
      });
      if (myReceivedRequets.length === 1) {
        setTimeout(() => {
          setPresetContentModalVisibility();
          this.showPresetModal();
        }, 500);
      }
    }
  };

  handleFriendsSectionTutorial = () => {
    const { setFriendsSectionTutorialVisibility } = this.props;
    if (this.getFriendsCount() > 0) {
      this.setState({ showTopNavbarTutorial: true });
      setFriendsSectionTutorialVisibility();
    }
  };

  handleReceivedSectionTutorial = () => {
    const { setReceivedSectionTutorialVisibility } = this.props;
    if (this.getReceivedRequestsCount() > 0) {
      this.setState({ showTopNavbarTutorial: true });
      setReceivedSectionTutorialVisibility();
    }
  };

  handleSentSectionTutorial = () => {
    const { setSentSectionTutorialVisibility } = this.props;
    if (this.getSentRequestsCount() > 0) {
      this.setState({ showTopNavbarTutorial: true });
      setSentSectionTutorialVisibility();
    }
  };

  fetchRoomsData = () => {
    const { setRooms, setRoomsArray } = this.props;
    RoomApi.getRooms(cbData => {
      if (cbData.success) {
        setRooms(cbData.data);
        setRoomsArray(cbData.data);
      }
    });
  };

  unlockMissedRequests = () => {
    const { missedRequests, myData, packPrices } = this.props;
    const allMissedRoomIds = missedRequests.map(i => i._id);
    const finalCall = () => {
      RoomApi.makeSomeRoomsSeen(allMissedRoomIds, result => {
        console.log(" result is ", result);
        if (result.success) {
          this.fetchRoomsData();
        }
      });
    };
    const exactPack = packPrices.find(pack => pack.value === "MISSED_REQUESTS");
    const requiredGems = exactPack.price * allMissedRoomIds.length;
    const isGemsEnough = myData.gems_count >= requiredGems;
    const purchaseCall = () => {
      this.startGemsCountAnimation(myData.gems_count, myData.requiredGems);
      purchaseAndFulfill({
        roomIds: allMissedRoomIds
      })
        .then(resp => {
          this.fetchRoomsData();
        })
        .catch(err => console.log("missed rooms err is ", err));
    };
    const consumeCall = () => {
      consumeAndFulFill({
        roomIds
      })
        .then(resp => {
          this.fetchRoomsData();
        })
        .catch(err => console.log("missed rooms err is ", err));
    };
    console.log(" this pack is ", exactPack);
    if (isGemsEnough) {
      this.setState({
        isGemCountModalVisible: true,
        gemsConsumption: {
          successCallback: () => {
            consumeCall();
            // purchaseGems(-requiredGems, purchaseResult => {
            //   if (purchaseResult.success) {
            //     this.props.updateOwnProfile({
            //       gems_count: purchaseResult.data.gems_count
            //     });
            //     finalCall();
            //   }
            // });
          },
          failureCallback: () => {
            console.log(" failed ");
          },
          count: requiredGems
        }
      });
      this.openCloserModal();
    } else {
      this.setState(
        {
          isCloserModalVisible: true,
          isBulkPurchaseModalVisible: false,
          // isBuyPowerModalVisible: true,
          buyPower: {
            colors: gemPlanColors["MissedRequests"],
            powerName: exactPack.key,
            hasOffers: false,
            cost: exactPack.price,
            successCallback: () => {
              purchaseCall();
            },
            failureCallback: () => {
              console.log(" didnt buy ");
            }
          }
        },
        () => {
          this.openCloserModal();
        }
      );
    }
    return;
  };
  renderNotificationPermission = () => {
    return (
      <JustifiedCenteredView>
        <RegularText
          style={{
            color: FONT_GREY,
            fontSize: 18,
            marginTop: 16
          }}
        >
          Get notified when people arrived
        </RegularText>
        <NoFeedbackTapView
          style={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: PURPLE,
            width: DeviceWidth * 0.7,
            paddingVertical: 16,
            borderRadius: 25,
            marginTop: 16
          }}
          onPress={() => {
            Linking.openURL("app-settings:")
              .then(res => {
                console.log(" res is ", res);
              })
              .catch(err => {
                console.log(" err is ", err);
              });
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
      </JustifiedCenteredView>
    );
  };
  enablePermissionAsPerScreen = fromChat => {
    const notificationsToProhibit = fromChat
      ? ["teamCloser", "awesomeStuff"]
      : ["teamCloser"];
    const state = store.getState();
    const {
      info: { userInfo }
    } = state;
    const { notificationPermission } = userInfo;
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
    const { notificationPermission: notificationPermissionArr } = myData;
    const isInSent = currentChatScreenIndex === 2;
    if(notificationPermissionArr === null  ||notificationPermissionArr === undefined  ){
      return 
    }
    const isRequiredPermissionGranted =
      notificationPermissionArr[isInSent ? 0 : 1]["children"][1]["isActive"];

    if (!notificationPermissionGranted || !isRequiredPermissionGranted) {
      await storeData(
        "FOR_NOTIFICATION",
        isInSent ? "SENT" : "RECEIVED"
        // String(true)
      );
      const two = await retrieveData("FOR_NOTIFICATION");
      console.log("appstate two is ", two);
    }
    if (notificationPermissionGranted) {
      this.enablePermissionAsPerScreen(true);
    } else {
      await Linking.openURL("app-settings:");
    }
  };
  renderFlatList = () => {
    const {
      myData,
      roomsArray,
      currentChatScreenIndex,
      missedRequests = [],
      sentStack,
      recievedStack,
      notificationPermissionGranted
    } = this.props;
    // const { permissionGranted } = this.state;
    const stackToBeShown =
      currentChatScreenIndex === 2 ? sentStack : recievedStack;
    const { notificationPermission: notificationPermissionArr } = myData;
    const isInSent = currentChatScreenIndex === 2;
    const isRequiredPermissionGranted =
      notificationPermissionArr[isInSent ? 0 : 1]["children"][1]["isActive"];

    const showStack = currentChatScreenIndex !== 0;
    const permissionGranted =
      notificationPermissionGranted && isRequiredPermissionGranted;
    const missedRequestsAvailable = missedRequests.length > 0;
    let rooms = [];
    if (currentChatScreenIndex === 2) {
      rooms = roomsArray.filter(({ status, answeredBy }) => {
        if (status === "SLOT" && answeredBy._id === myData._id) {
          return true;
        }
      });
    } else if (currentChatScreenIndex === 1) {
      rooms = roomsArray.filter(({ postedBy, status }) => {
        return status === "SLOT" && postedBy._id === myData._id;
      });
    } else {
      rooms = roomsArray.filter(({ status }) => status !== "SLOT");
    }
    if (rooms.length > 0 || (showStack && stackToBeShown.length > 0)) {
      return (
        <FlatList
          numColumns={1}
          data={rooms}
          renderItem={this.renderListItem}
          keyExtractor={item => item._id}
        />
      );
    } else {
      return (
        <>
          {currentChatScreenIndex === 0 ? (
            <View style={styles.emptyStateStyle}>
              <View style={{ right: -10 }}>
                <SvgUri
                  s
                  width={DeviceWidth * 0.6}
                  height={DeviceWidth * 0.6}
                  // source={require("../../assets/finalSvgs/undraw.svg")}
                  source={require("../../assets/svgs/Chat/friendsEmpty.svg")}
                />
              </View>
            </View>
          ) : currentChatScreenIndex === 1 ? (
            <View
              style={[
                styles.emptyStateStyle,
                {
                  justifyContent: "center",
                  alignItems: "center"
                  // backgroundColor: "red"
                }
              ]}
            >
              {missedRequestsAvailable ? (
                <>
                  <MediumText
                    style={{
                      textAlign: "center",
                      fontSize: 16,
                      color: FONT_GREY,
                      marginVertical: 20,
                      paddingHorizontal: LEFT_MARGIN
                    }}
                  >
                    There are no Reactions received. Show{" "}
                    {missedRequests.length} Previously Received Reactions?
                  </MediumText>
                  <RowView
                    style={[
                      styles.stackedRow,
                      { transform: [{ translateX: 0 }] }
                    ]}
                  >
                    {missedRequests.map((roomObj, roomIndex) => {
                      const imageUrl =
                        STATIC_URL +
                        roomObj.answeredBy.images[0].split("uploads")[1];
                      return (
                        <View
                          key={roomIndex}
                          style={{
                            transform: [{ translateX: -25 * roomIndex }],
                            zIndex: roomIndex,
                            alignSelf: "center",
                            justifyContent: "center"
                          }}
                        >
                          <CircularImage
                            blurRadius={6}
                            style={{
                              borderWidth: 1,
                              borderColor: "#fff"
                            }}
                            height={50}
                            source={{ uri: imageUrl }}
                          />
                        </View>
                      );
                    })}
                  </RowView>

                  <NoFeedbackTapView
                    onPress={() => this.unlockMissedRequests()}
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#00BCD4",
                      width: DeviceWidth * 0.7,
                      paddingVertical: 16,
                      borderRadius: 25,
                      marginTop: 16
                    }}
                  >
                    <BoldText style={{ color: WHITE, fontSize: 18 }}>
                      SHOW
                    </BoldText>
                  </NoFeedbackTapView>
                </>
              ) : (
                <>
                  {!permissionGranted ? (
                    <>
                      <RegularText
                        style={{
                          color: FONT_GREY,
                          fontSize: 18,
                          marginTop: 16
                        }}
                      >
                        Get notified when people arrived
                      </RegularText>
                      <NoFeedbackTapView
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: PURPLE,
                          width: DeviceWidth * 0.7,
                          paddingVertical: 16,
                          borderRadius: 25,
                          marginTop: 16
                        }}
                        onPress={() => {
                          this.enableRequiredNotifications();
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
                    <SvgUri
                      width={DeviceWidth * 0.15}
                      height={DeviceWidth * 0.15}
                      source={require("../../assets/svgs/Chat/chatReceivedEmpty.svg")}
                    />
                  )}
                </>
              )}
            </View>
          ) : currentChatScreenIndex === 2 ? (
            <>
              <View style={styles.emptyStateStyle}>
                <SvgUri
                  width={DeviceWidth * 0.15}
                  height={DeviceWidth * 0.15}
                  source={require("../../assets/svgs/Chat/chatSentEmpty.svg")}
                />
              </View>
            </>
          ) : (
            <View />
          )}

          <MediumText
            style={{
              textAlign: "center",
              fontSize: 16,
              color: FONT_GREY,
              marginTop: 20,
              paddingHorizontal: LEFT_MARGIN
            }}
          >
            {currentChatScreenIndex === 0
              ? "You have not yet made any friends. React to people on home page to make them friends!"
              : currentChatScreenIndex === 2
              ? "There are no Reactions sent. React to people on home page to make more friends."
              : missedRequestsAvailable
              ? ""
              : "There are no Reactions received.\n Be seen by more people?"
            // `No ${this.state.items[currentChatScreenIndex]} requests found`}
            }
          </MediumText>
        </>
      );
    }
  };
  checkAndMakeRoomsSeen = () => {
    const { roomsArray } = this.props;
    const recievedRooms = roomsArray.filter(({ status }) => {
      return status === "SLOT";
      //  && postedBy._id === myData._id;
    });

    console.log(" recieved rooms are ", recievedRooms);
    const isEveryRoomSeen = Lodash.every(recievedRooms, roomObj => {
      console.log(" each of room is ", roomObj);
      return roomObj.postedBySeen === true;
    });
    console.log(" roomObj is ", isEveryRoomSeen);
    if (!isEveryRoomSeen) {
      RoomApi.makeAllRoomsSeen(makeSeenResult => {
        console.log(" make seen all result is rooms are ", makeSeenResult);
      });
    }
  };

  getMissedRequestsPreviewContent = () => {
    const { missedRequests, setMissedRequests } = this.props;
    if (missedRequests === undefined) {
      RoomApi.getMissedRequests(missedRequestsResponse => {
        console.log(" missed requests are ", missedRequestsResponse);
        if (missedRequestsResponse.success) {
          const { result } = missedRequestsResponse.data;
          setMissedRequests(result);
        }
      });
    }
  };
  switchTab = i => {
    // LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    const {
      setCurrentChatScreenIndex,
      setChatTextDot,
      setSentTextDot,
      setReceivedTextDot
    } = this.props;
    setCurrentChatScreenIndex(i);
    this.moveNavBarNob(i);
    if (i === 0) {
      setChatTextDot(false);
    } else if (i === 1) {
      this.checkAndMakeRoomsSeen();
      this.getMissedRequestsPreviewContent();
      setReceivedTextDot(false);
    } else {
      this.checkAndMakeRoomsSeen();
      setSentTextDot(false);
    }
    setTimeout(() => {
      this.handleStackTutorials();
    }, 800);
    setTimeout(() => {
      this.handleOneTimeTutorials();
    }, 300);
  };

  resetUnreadMessageCount = roomId => {
    const oldRooms = Object.assign([], this.state.rooms);
    const newROoms = oldRooms.map(room => {
      return {
        ...room,
        unreadMessagesCount: room._id === roomId ? 0 : room.unreadMessagesCount
      };
    });
    this.setState({
      rooms: newROoms
    });
  };

  fetchChatRoomAndGoToChat = room => {
    const { setCurrentScreenIndex, openOneRoom } = this.props;
    setCurrentScreenIndex(3);
    RoomApi.readAllMessagesInRoom(room._id, result => {
      if (result.success) {
        // resetUnreadMessageCount(room._id);
        // this.resetUnreadMessageCount(room._id);
      } else {
        alert(" Error in reading all messages once  ");
      }
    });
    openOneRoom(room._id);
    const pushAction = StackActions.push({
      routeName: "chatWindow",
      params: {
        from: "ChatFavourites"
      }
    });
    this.props.navigation.dispatch(pushAction);
    // push("chatWindow", {
    //   from: "ChatFavourites"
    // });
  };

  renderListItem = ({ item, index }) => {
    const { myData, currentChatScreenIndex, allRooms } = this.props;
    const { postedBy, answeredBy } = item;
    const targetUser = postedBy._id === myData._id ? answeredBy : postedBy;
    const _noRooms = Lodash.isEmpty(allRooms);
    const _lastMessage = _noRooms
      ? {}
      : allRooms[item._id].messages.length > 0 &&
        allRooms[item._id].messages[0];
    const timeDiff = moment(parseInt(item.expiresAt * 1000)).diff(
      moment(),
      "hours"
    );
    if (currentChatScreenIndex !== 0) {
      if (item.postedBy || item.answeredBy) {
        user =
          item.postedBy._id === myData._id ? item.answeredBy : item.postedBy;
        return (
          <NonFriendsItem
            item={item}
            index={index}
            fetchChatRoomAndGoToChat={this.fetchChatRoomAndGoToChat}
          />
        );
      }
    } else {
      const { postedBy, answeredBy } = item;
      const targetUser = postedBy._id === myData._id ? answeredBy : postedBy;

      return (
        <FriendsItem
          // onDeleteConversationClicked={this.props.onDeleteConversationClicked}
          onDeleteConversationClicked={(roomId, callback) => {
            this.setState({
              deleteConversation: {
                roomId,
                callback
              }
            });
            this.openCloserModal();
          }}
          item={item}
          index={index}
          fetchChatRoomAndGoToChat={this.fetchChatRoomAndGoToChat}
        />
      );
    }
  };

  getRightBorderWidth = (itemId, currentChatScreenIndex) => {
    return itemId === 2 || currentChatScreenIndex === 1
      ? 0
      : itemId === 0 && currentChatScreenIndex === 0
      ? 0
      : itemId === 1 && currentChatScreenIndex === 2
      ? 0
      : 1;
  };

  renderTopNavigatorItems = () => {
    const { items } = this.state;
    const { animatedBottomBar } = this;
    const {
      currentChatScreenIndex,
      showSentTextDot,
      showReceivedTextDot,
      showChatsTextDot
    } = this.props;

    return (
      <View style={styles.topNavContainer}>
        <RowView style={styles.topItemsContainer}>
          <Animated.View
            style={{
              ...styles.swipeTabLayout,
              transform: [{ translateX: animatedBottomBar }]
            }}
          />
          {items.map((item, tabIndex) => {
            const _isCurrentTab = currentChatScreenIndex === tabIndex;

            return (
              <NoFeedbackTapView
                onPress={() => {
                  // this.moveNavBarNob(tabIndex);
                  this.switchTab(tabIndex);
                }}
                key={tabIndex}
                style={{
                  ...styles.tabTappableView,
                  borderRightWidth: this.getRightBorderWidth(
                    tabIndex,
                    currentChatScreenIndex
                  )
                }}
              >
                <View
                  style={{
                    height: 6,
                    width: 6,
                    borderRadius: 3,
                    backgroundColor:
                      tabIndex === 0 && showChatsTextDot
                        ? BRIGHT_RED
                        : tabIndex === 1 && showReceivedTextDot
                        ? BRIGHT_RED
                        : tabIndex === 2 && showSentTextDot
                        ? BRIGHT_RED
                        : "#0000",
                    transform: [{ translateX: -3 }]
                  }}
                />
                <RegularText
                  style={{
                    color: _isCurrentTab ? PURPLE : FONT_BLACK,
                    fontWeight: _isCurrentTab ? "500" : "normal",
                    ...styles.tabText
                  }}
                >
                  {item}
                </RegularText>
              </NoFeedbackTapView>
            );
          })}
        </RowView>
      </View>
    );
  };

  renderBottomIcons = () => {
    return (
      <NoFeedbackTapView
        style={{
          position: "absolute",
          bottom: DeviceHeight * 0.02,
          right: DeviceWidth * 0.05,
          backgroundColor: "#fff",
          borderRadius: 25,
          height: 50,
          width: 50,
          alignItems: "center",
          justifyContent: "center",
          elevation: 2,
          shadowColor: "rgba(0,0,0,0.4)",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.7,
          shadowRadius: 20,
          paddingLeft: 2.5
        }}
        onPress={() => {
          this.props.navigation.pop();
          this.props.setCurrentScreenIndex(0);
        }}
        // onPress
        minScale={0.8}
        maxScale={1}
      >
        <SvgUri
          width={20}
          height={20}
          source={require("../../assets/icons/a-rightnew.svg")}
        />
      </NoFeedbackTapView>
    );
  };
  openBuyGemsModal = ({
    powerName,
    cost,
    colors,
    successCallback,
    failureCallback,
    hasOffers,
    requiredTotalGems,
    afterPurchase,
    extradata
    // ...rest
    //
    // afterPurchase
    // hasOffers=false
  }) => {
    console.log(" new colors are ", colors);
    this.closeCloserModal();
    this.setState({
      isStackReleaseModalVisible: false,
      isNewCloserModalVisible: true,
      isBulkPurchaseModalVisible: false,
      isBuyPowerModalVisible: true,

      buyPower: {
        successCallback: newGemsCount => {
          console.log("new count is  onw is ", newGemsCount);
          successCallback(newGemsCount);
        },
        failureCallback: () => {
          failureCallback();
          // this._carousel.snapToNext();
        },
        powerName,
        cost,
        colors,
        hasOffers,
        requiredTotalGems,
        afterPurchase,
        extradata
        // ...rest
      }
    });
    // this.openCloserModal();
  };
  onStackItemTapped = item => {
    console.log(" item is ", item);
    // return;
    const {
      currentChatScreenIndex,
      packPrices,
      updateOwnProfile,
      sentStack,
      recievedStack
    } = this.props;
    const timestamp = getTimeStamp();
    const isInSent = currentChatScreenIndex === 2;
    const pack = packPrices.find(p => {
      const val = isInSent ? "REACTIONS_SENT" : "REACTIONS_RECEIVED";
      return p.value === val;
    });
    const { myData } = this.props;
    const userName = userNamify(isInSent ? item.postedBy : item.answeredBy);
    const userImage = isInSent
      ? item.postedBy.images[0]
      : item.answeredBy.images[0];
    const isGemsEnough = myData.gems_count >= pack.price;
    const monetization_item = isInSent
      ? MONETIZATION_ITEMS.RELEASE_SENT_ROOM
      : MONETIZATION_ITEMS.RELEASE_RECEIVED_ROOM;
    const purchaseCall = newGemsCount => {
      // return;
      const toCount = newGemsCount - pack.price;
      this.startGemsCountAnimation(newGemsCount, toCount);
      purchaseAndFulfill({
        isPack: false,
        contentId: item._id,
        countToBeAdded: newGemsCount,
        deductCount: pack.price,
        item: monetization_item
      })
        .then(resp => {
          this.fetchRoomsData();
          updateOwnProfile({
            gems_count: toCount
          });
        })
        .catch(err => console.log(" err in purchase way is ", err));
    };
    const consumeCall = () => {
      // let updates = {};
      // if (!isInSent) {
      //   updates = {
      //     postedByStack: {
      //       ...item.postedByStack,
      //       status: STACK_TYPES.INACTIVE,
      //       updatedAt: timestamp,
      //       process: STACK_RELEASE_PROCESSES.PAYMENT
      //     }
      //   };
      // } else {
      //   updates = {
      //     answeredByStack: {
      //       ...item.answeredByStack,
      //       status: STACK_TYPES.INACTIVE,
      //       updatedAt: timestamp,
      //       process: STACK_RELEASE_PROCESSES.PAYMENT
      //     }
      //   };
      // }
      // setTimeout(() => {
      // console.log(" new count is ", myData.gems_count);
      this.startGemsCountAnimation(
        myData.gems_count,
        myData.gems_count - pack.price
      );
      // }, 500);
      // return;
      consumeAndFulFill({
        contentId: item._id,
        deductCount: pack.price,
        deductFrom: "gems",
        item: monetization_item
      })
        .then(result => {
          updateOwnProfile({
            gems_count: myData.gems_count - pack.price
          });
          console.log(result);
          this.fetchRoomsData();
        })
        .catch(console.log);
      // purchaseGems(-pack.price, purchaseResult => {
      //   if (purchaseResult.success) {
      //     updateOwnProfile({
      //       gems_count: purchaseResult.data.gems_count
      //     });
      //     console.log(" result of consuming gems ", purchaseResult);
      //     RoomApi.releaseAStackItem(item._id, updates, result => {
      //       console.log(" result of releasing ", result);
      //       if (result.success) {
      //         this.fetchRoomsData();
      //       }
      //     });
      //   }
      // });
    };
    const failureCallback = () => {};

    const currentStack = isInSent ? sentStack : recievedStack;
    const stackLength = currentStack.length;

    if (isGemsEnough) {
      this.showStackReleaseModal(
        pack.price,
        userName,
        stackLength,
        consumeCall,
        failureCallback,
        pack,
        userImage
      );
    } else {
      const powerName = isInSent ? "Reactions sent" : "Reactions Recieved";
      const { backgroundColors: colors } = pack;
      const icon = isInSent
        ? MONETIZATION_ICONS["REACTIONS_SENT"]
        : MONETIZATION_ICONS["REACTIONS_RECEIVED"];
      console.log("openign buy gems modal 444", pack);
      this.openBuyGemsModal({
        powerName,
        extradata: {
          icon
        },
        cost: pack.price,
        colors,
        successCallback: purchaseCall,
        failureCallback
      });
    }
  };
  showStackReleaseModal = (
    price,
    userName,
    stackLength,
    successCallback,
    failureCallback,
    pack,
    userImage
  ) => {
    console.log(" calling one ");
    this.setState({
      isStackReleaseModalVisible: true,
      stackRelease: {
        userName,
        userImage,
        stackLength,
        price,
        successCallback,
        failureCallback,
        pack
      }
    });
    this.openCloserModal();
  };
  openCloserModal = () => {
    this.setState({ isCloserModalVisible: true });
    this.refs["closerModal"].toggleBg(true);
  };
  closeCloserModal = () => {
    this.setState({ isCloserModalVisible: false });
    this.refs["closerModal"].startAnimation(false);
    setTimeout(() => {
      this.refs["closerModal"].toggleBg(false);
    }, 300);
  };
  renderBuyPowerModal = () => {
    const { buyPower } = this.state;
    return (
      <BuyModal
        powerName={"Step Back"}
        colors={gemPlanColors.StepBack}
        {...buyPower}
        hasOffers={buyPower.hasOffers || false}
        // subHeader={`Don't lose ${activeProfile && activeProfile.name}`}
        goBack={(confirmed, newGemsCount) => {
          this.setState({
            isStepBackModalVisible: false,
            isNewCloserModalVisible: false
          });
          if (confirmed) {
            if (buyPower.afterPurchase) {
              // buyPower.afterPurchase(newGemsCount);
              if (newGemsCount >= buyPower.requiredTotalGems) {
                buyPower.afterPurchase(newGemsCount);
              } else {
              }
            }
            setTimeout(() => {
              buyPower.successCallback(newGemsCount);
            }, 300);
          } else {
            setTimeout(() => {
              buyPower.failureCallback();
            }, 300);
          }

          // this.closeCloserModal();
        }}
        showOffersModal={() => {
          this.closeCloserModal();
          this.setState(
            {
              isNewCloserModalVisible: false,
              isBuyPowerModalVisible: false
            },
            () => {
              setTimeout(() => {
                this.setState({
                  isNewCloserModalVisible: true,
                  isBulkPurchaseModalVisible: true
                });
                // this.openCloserModal();
              }, 300);
            }
          );
        }}
      />
    );
  };
  renderBulkPurchaseModal = () => {
    const { bulkPurchase } = this.state;
    return (
      <BulkPurchaseModal
        bulkItemName={bulkPurchase.bulkItemName}
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
        goBack={purchased => {
          if (purchased) {
            bulkPurchase.successCallback();
          } else {
            bulkPurchase.failureCallback();
          }
          this.setState({
            // isBulkPurchaseModalVisible: false,
            isNewCloserModalVisible: false
          });
          // this.closeCloserModal();
        }}
      />
    );
  };

  renderCloserModal = () => {
    const {
      isCloserModalVisible,
      isDeleteConversationModalVisible,
      deleteConversation,
      isBuyPowerModalVisible,
      buyPower,
      bulkPurchase,
      isBulkPurchaseModalVisible,
      gemsConsumption,
      isGemCountModalVisible,
      isStackReleaseModalVisible,
      stackRelease,
      isPresetModalVisible,
      isPresetModalTwoVisible
    } = this.state;
    return (
      <CloserModal isModalVisible={isCloserModalVisible} ref={"closerModal"}>
        {isDeleteConversationModalVisible ? (
          <DeleteConversationModal
            roomId={deleteConversation && deleteConversation.roomId}
            callback={deleteConversation.callback}
            loading={deleteConversationLoading}
            onCancel={() => {
              this.setState({
                deleteConversation: null
              });
              this.closeCloserModal();
            }}
            onConfirm={() => {
              this.deleteConversation(
                deleteConversation && deleteConversation.roomId
              );
            }}
          />
        ) : isGemCountModalVisible ? (
          <GemCountModal
            count={gemsConsumption.count}
            goBack={confirmed => {
              if (confirmed) {
                if (gemsConsumption.successCallback) {
                  gemsConsumption.successCallback();
                }
              } else {
                if (gemsConsumption.failureCallback) {
                  gemsConsumption.failureCallback();
                }
              }
              this.setState({ isGemCountModalVisible: false });
              this.closeCloserModal();
            }}
          />
        ) : isStackReleaseModalVisible ? (
          <StackReleaseModal
            userName={(stackRelease && stackRelease.userName) || ""}
            userImage={(stackRelease && stackRelease.userImage) || ""}
            price={stackRelease && stackRelease.price}
            pack={(stackRelease && stackRelease.pack) || null}
            stackLength={stackRelease && stackRelease.stackLength}
            openBuyGemsModal={this.openBuyGemsModal}
            refetchRooms={this.fetchRoomsData}
            goBack={confirmed => {
              if (confirmed) {
                stackRelease.successCallback();
              } else {
                stackRelease.failureCallback();
              }
              this.setState({
                isStackReleaseModalVisible: false
              });
              this.closeCloserModal();
            }}
          />
        ) : isPresetModalVisible ? (
          <PresetModal
            openResponseScreen={this.openResponseScreen}
            dismissModal={bool => {
              this.closeCloserModal();
              this.setState({ isPresetModalVisible: false }, () => {
                if (bool === true) {
                  setTimeout(() => {
                    this.props.navigation.push("myProfile");
                    // this.bottomNavScrollHandler("PROFILE");
                  }, 500);
                } else {
                  this.setState({ isPresetModalTwoVisible: true }, () => {
                    setTimeout(() => {
                      this.openCloserModal();
                    }, 500);
                  });
                }
              });
            }}
          />
        ) : isPresetModalTwoVisible ? (
          <PresetModalTwo
            dismissModal={bool => {
              this.closeCloserModal();
              this.setState({ isPresetModalTwoVisible: false }, () => {
                if (bool === true) {
                  setTimeout(() => {
                    // this.bottomNavScrollHandler("PROFILE");
                    this.props.navigation.push("myProfile");
                  }, 500);
                  setTimeout(() => {
                    // this.refs["myProfileRef"].scrollToCards();
                    this.setState({ scrollTillCards: true });
                  }, 1000);
                }
              });
            }}
          />
        ) : (
          <View />
        )}
      </CloserModal>
    );
  };
  renderStackTutorial = () => {
    const { isStackTutorialFirstTime, stackTutorialType } = this.state;

    return (
      <>
        <StackTutorialPopup
          close={() => {
            this.setState({
              isStackTutorialVisibile: false
            });
          }}
          isFirstTime={isStackTutorialFirstTime}
          stackType={stackTutorialType}
        />
        <NoFeedbackTapView
          onPress={() => this.setState({ isStackTutorialVisibile: false })}
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: "#000",
            opacity: 0.7,
            zIndex: 3
          }}
        ></NoFeedbackTapView>
      </>
    );
  };

  renderNewCloserModal = () => {
    const {
      isNewCloserModalVisible,
      isBuyPowerModalVisible,
      isBulkPurchaseModalVisible
    } = this.state;
    return (
      <View style={{ zIndex: 111 }}>
        <NewCloserModal inThirdLevel={true} visible={isNewCloserModalVisible}>
          {isBuyPowerModalVisible && this.renderBuyPowerModal()}
          {isBulkPurchaseModalVisible && this.renderBulkPurchaseModal()}
        </NewCloserModal>
      </View>
    );
  };
  startGemsCountAnimation = (fromCount, toCount) => {
    this.gemsFromCount = fromCount;
    this.gemsToCount = toCount;
    setTimeout(() => {
      this.showGemsCountAnimation.setValue(1);
    }, 500);
  };
  renderGemsCountAnimation = () => {
    return (
      <GemsAcknowledgement
        show={this.showGemsCountAnimation}
        fromCount={this.gemsFromCount}
        toCount={this.gemsToCount}
      />
    );
  };
  render() {
    const {
      showStackList,
      items,
      showTopNavbarTutorial,
      notificationVisible,
      isStackTutorialVisibile,
      notification: {
        notificationText = "",
        notificationTitle = "",
        notificationImage = "",
        notificationRoomId = "",
        openChatWindow = false,
        showName = false
      }
    } = this.state;
    const { currentChatScreenIndex, sentStack, recievedStack } = this.props;
    const inSent = currentChatScreenIndex === 2;
    const stackHiddedRooms = inSent ? sentStack.length : recievedStack.length;
    const stackHidden = stackHiddedRooms === 0 || currentChatScreenIndex === 0;
    // const stackData = currentChatScreenIndex === 2 ? sentStack : recievedStack;
    return (
      <>
        <Notification
          show={notificationVisible}
          setModalVisible={val =>
            this.setState({
              notificationVisible: val,
              notification: initialNotificationObj
            })
          }
          onTap={() => {
            if (openChatWindow) {
              const {
                openOneRoom,
                setChatIconDot,
                setChatTextDot,
                navigation: { push }
              } = this.props;
              setChatIconDot(false);
              setChatTextDot(false);
              openOneRoom(notificationRoomId);
              push("chatWindow");
            }
          }}
          height={120}
          userImageUrl={STATIC_URL + notificationImage.split("uploads")[1]}
          notificationTitle={
            userNamify({ name: notificationTitle, showName })
            // showName ? notificationTitle[0] : notificationTi/tle
          }
          notificationText={notificationText}
        />
        {this.renderGemsCountAnimation()}
        {this.renderNewCloserModal()}
        {isStackTutorialVisibile && this.renderStackTutorial()}
        <View style={styles.baseLayout}>
          <View style={styles.selfClosingView} />
          {this.renderTopNavigatorItems()}
          {showTopNavbarTutorial ? (
            <SentReactions
              currentChatScreenIndex={currentChatScreenIndex}
              dismissOverlay={() => {
                this.setState({ showTopNavbarTutorial: false }, () => {
                  if (currentChatScreenIndex === 2) {
                    if (this.getReceivedRequestsCount() > 0) {
                      this.switchTab(1);
                      this.handleReceivedSectionTutorial();
                    }
                  } else if (currentChatScreenIndex === 1) {
                    this.handlePresetModalTutorial();
                  }
                });
              }}
              items={items}
            />
          ) : (
            <View />
          )}

          <ScrollView showsVerticalScrollIndicator={false}>
            {!stackHidden && (
              <Stack
                inSent={inSent}
                onStackItemTapped={this.onStackItemTapped}
                fetchChatRoomAndGoToChat={this.fetchChatRoomAndGoToChat}
              />

              // <View
              //   style={[
              //     styles.stackedContainer,
              //     {
              //       //temp fix for stack items box color
              //       backgroundColor:
              //         currentChatScreenIndex === 1 ? "#b74cd5" : "#00bcd4"
              //     }
              //   ]}
              // >
              //   <NoFeedbackTapView
              //     onPress={() => {
              //       this.setState(prevState => ({
              //         showStackList: !prevState.showStackList
              //       }));
              //     }}
              //     style={styles.tappableRow}
              //   >
              //     <RowView style={styles.stackedRow}>
              //       {stackData.map((stackObj, stackItemIndex) => {
              //         if (stackItemIndex > stackSneakPeakCount) {
              //           return null;
              //         }
              //         return (
              //           <View
              //             key={stackItemIndex}
              //             style={{
              //               transform: [{ translateX: -25 * stackItemIndex }],
              //               zIndex: stackItemIndex,
              //               alignSelf: "center",
              //               justifyContent: "center"
              //             }}
              //           >
              //             <CircularImage
              //               style={{
              //                 borderWidth: 1,
              //                 borderColor: "#fff"
              //               }}
              //               height={50}
              //               source={require("../../assets/images/riya.png")}
              //             />
              //           </View>
              //         );
              //       })}
              //     </RowView>
              //     <BoldText style={styles.showPeopleText}>
              //       Show {stackHiddedRooms} More People
              //     </BoldText>
              //     <Ionicon
              //       name={"ios-arrow-forward"}
              //       size={25}
              //       color={"#fff"}
              //     />
              //   </NoFeedbackTapView>
              //   {showStackList && this.renderStackList()}
              // </View>
            )}

            {this.renderFlatList()}
          </ScrollView>

          {this.renderBottomIcons()}
          {this.renderCloserModal()}
        </View>
      </>
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
    apoloClient: state.apollo.client,
    sentStack: state.rooms.sentStack,
    recievedStack: state.rooms.recievedStack,
    packPrices: state.app.packPrices,
    missedRequests: state.rooms.missedRequests,
    notificationPermissionGranted: state.nav.notificationPermissionGranted,
    newActivity: state.rooms.newActivity,
    presetContentSeen: state.tutorial.presetContentSeen,
    sentReactionsTutorialSeen: state.tutorial.sentReactionsTutorialSeen,
    receivedReactionsTutorialSeen: state.tutorial.receivedReactionsTutorialSeen,
    friendsSectionTutorialSeen: state.tutorial.friendsSectionTutorialSeen,
    firebaseNotification: state.nav.firebaseNotification,
    sentStackTutorialSeen: state.tutorial.sentStackTutorialSeen,
    receivedStackTutorialSeen: state.tutorial.receivedStackTutorialSeen,
    topNavTabTutorialsSeen: state.tutorial.topNavTabTutorialsSeen
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
    setLiveStatus: bindActionCreators(setOnlineStatus, dispatch),
    updateOwnProfile: bindActionCreators(updateOwnProfile, dispatch),
    setMissedRequests: bindActionCreators(setMissedRequests, dispatch),
    setPresetContentModalVisibility: bindActionCreators(
      setPresetContentModalVisibility,
      dispatch
    ),
    setReceivedSectionTutorialVisibility: bindActionCreators(
      setReceivedSectionTutorialVisibility,
      dispatch
    ),
    setSentSectionTutorialVisibility: bindActionCreators(
      setSentSectionTutorialVisibility,
      dispatch
    ),
    setFriendsSectionTutorialVisibility: bindActionCreators(
      setFriendsSectionTutorialVisibility,
      dispatch
    ),
    setNewActivity: bindActionCreators(setNewActivity, dispatch),

    setFirebaseNotification: bindActionCreators(
      setFirebaseNotification,
      dispatch
    ),
    setCurrentChatScreenIndex: bindActionCreators(
      setCurrentChatScreenIndex,
      dispatch
    ),
    setSentTextDot: bindActionCreators(setSentTextDot, dispatch),
    setFriendObj: bindActionCreators(setFriendObj, dispatch),
    setReceivedTextDot: bindActionCreators(setReceivedTextDot, dispatch),
    setTopNavTabTutorials: bindActionCreators(setTopNavTabTutorials, dispatch),
    deleteOneTopNavTabTutorial: bindActionCreators(
      deleteOneTopNavTabTutorial,
      dispatch
    )
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ChatFavourites);
