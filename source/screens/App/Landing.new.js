import MaskedView from "@react-native-community/masked-view";
import Lodash from "lodash";
import moment from "moment";
import React, { Component } from "react";
import {
  Alert,
  AppState,
  Linking,
  Platform,
  StatusBar,
  StyleSheet,
  Vibration,
  View
} from "react-native";
import { View as AnimatableView } from "react-native-animatable";
import firebase from "react-native-firebase";
import GetLocation from "react-native-get-location";
import InstagramLogin from "react-native-instagram-login";
import Animated, { Transition, Transitioning } from "react-native-reanimated";
import EntypoIcon from "react-native-vector-icons/Entypo";
import { connect } from "react-redux";
import BottomSheet from "reanimated-bottom-sheet";
import { bindActionCreators } from "redux";
import { DeviceWidth } from "../../../src/config/Device";
import { storeData } from "../../../src/config/Storage";
import BulkPurchaseModal from "../../components/Common/BulkPurchaseModal";
import BundleConfirmationModal from "../../components/Common/BundleConfirmationModal";
import NewCloserModal from "../../components/Common/NewCloserModal";
import Notification from "../../components/Common/Notification";
import BuyModal from "../../components/Gemsflow/BuyModal";
import GemCountModal from "../../components/Gemsflow/GemCountModal";
import GemsAcknowledgement from "../../components/Gemsflow/GemsAcknowledgement";
import BlockAndReportReasonsModal from "../../components/Profile.Modal/BlockAndReportReasonsModal";
import Response from "../../components/Profile.Modal/Response";
import BottomIcons from "../../components/Surfing/Bottom.Icons";
import FbUserWelcomeModal from "../../components/Surfing/FbUser.Welcome.modal";
import GetToKnowNotificationModal from "../../components/Surfing/GetToKnowNotification.modal";
import GradientHeader from "../../components/Surfing/Gradient.header";
import LastCard from "../../components/Surfing/LastCard";
import LottieSearch from "../../components/Surfing/Lottie.search";
import PresetModal from "../../components/Surfing/PresetModal";
import PresetModalTwo from "../../components/Surfing/PresetModalTwo";
import ProfileCardsOverReactButton from "../../components/Surfing/ProfileCardsOverReactButton";
import ProfileModal from "../../components/Surfing/ProfileModal";
import ProfilesList from "../../components/Surfing/ProfilesList";
import SnoozeModeCard from "../../components/Surfing/SnoozeModeCard";
import StepBackModal from "../../components/Surfing/StepBackModal";
import SurfingCard from "../../components/Surfing/Surfing.card";
import BoldText from "../../components/Texts/BoldText";
import MediumText from "../../components/Texts/MediumText";
import OneTimeMonetisationTutorial from "../../components/Tutorials/OneTimeMonetisationTutorial";
import OthersProfileCards from "../../components/Tutorials/Others.profile.cards";
import SurfingScreenTap from "../../components/Tutorials/SurfingScreen.tap";
import CloserModal from "../../components/Views/Closer.modal";
import HorizontalGradientView from "../../components/Views/HorizontalGradientView";
import ModalCurvedcard from "../../components/Views/Modal.curvedcard";
import NoFeedbackTapView from "../../components/Views/NoFeedbackTapView";
import VerticalGradientView from "../../components/Views/VerticalGradientView";
import { STATIC_URL } from "../../config/Api";
import {
  BLUE_PRIMARY,
  FONT_BLACK,
  LIGHT_PURPLE,
  PURPLE,
  WHITE
} from "../../config/Colors";
import {
  appConstants,
  CRON_TASKS,
  EXPENSE_THRESHOLD_COUNT,
  gemPlanColors,
  INSTAGRAM_KEY,
  LEFT_MARGIN,
  MONETIZATION_ITEMS,
  NOTIFICATION_TYPES,
  USER_STATES,
  VIBRATION_DURATION
} from "../../config/Constants";
import { DeviceHeight } from "../../config/Device";
import { retrieveData } from "../../config/Storage";
import { getTimeStamp, namify, userNamify } from "../../config/Utils";
import {
  consumeAndFulFill,
  getPackPrices,
  purchaseAndFulfill,
  purchaseGems
} from "../../network/pack";
import { swipeAProfile } from "../../network/profile";
import * as QuestionApi from "../../network/question";
import * as RoomApi from "../../network/rooms";
import { getUserPacks } from "../../network/spark";
import * as UserApi from "../../network/user";
import { setPackPrices, setUserPacks } from "../../redux/actions/app";
import {
  addNewResponse,
  openFirstCardDirectly,
  resetResponses,
  setCurrentChatScreenIndex,
  setCurrentScreenIndex,
  setFirebaseNotification,
  setLocationPermission,
  setNotificationPermission,
  setQuestionCardTutorialVisibility,
  setQuestionCardVisibility
} from "../../redux/actions/nav";
import {
  setChatIconDot,
  setChatTextDot,
  setReceivedTextDot,
  setSentTextDot
} from "../../redux/actions/notification";
import {
  addExpenseTutorialCount,
  setHasSeenReactOnTheseCardsTutorial,
  setPresetContentModalVisibility,
  setProfileCardsTutorialVisibility,
  setReactButtonTutorialVisibility,
  setRequestCron,
  setResponseCron,
  setTopNavTabTutorials,
  setTutorialStartingTime
} from "../../redux/actions/tutorials";
import * as UserActions from "../../redux/actions/user.info";
import { setCronState, setUserState } from "../../redux/actions/userstate";
import { styles } from "../../styles/Landing";
import { sharedStyles } from "../../styles/Shared";
import * as ProfileActions from "./../../redux/actions/profiles";
import * as ChatActions from "./../../redux/actions/rooms";

const { OS } = Platform;
const { Value, interpolate } = Animated;

const monitizationCard = {
  type: "content",
  style: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  buttonText: "Get More profiles ",
  buttonStyle: {
    backgroundColor: BLUE_PRIMARY
  }
};

class LandingNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animatedIndicatorPosition: new Value(0),
      othersProfilePosition: new Value(-DeviceHeight),
      bottomIconOpacity: new Value(0),
      animatedInappNotificationVal: new Value(-90),
      areProfilesLoading: false,
      showOverlayRight: false,
      userPosts: {},
      showGradient: false,
      currentProfilePosts: {},
      pressedIn: false,
      hideBottomNavBar: false,
      postsLoading: false,
      isModalVisible: false,
      isCloserModalVisible: false,
      isStepBackModalVisible: false,
      isPresetModalVisible: false,
      isPresetModalTwoVisible: false,
      isGemCountModalVisible: false,
      notificationText: "",
      notificationTitle: "",
      notificationImage: "",
      notificationRoomId: "",
      openChatWindow: false,
      targetChatIndex: null,
      showModal: false,
      notificationVisible: false,
      showName: false,
      deleteConversation: null,
      gemsConsumption: null,
      buyPower: null,
      //stack requirements
      isBundleConfirmationModalVisible: false,
      showTapTutorial: false,
      bundleConfirmation: null,
      isBundlePurchaseModalVisible: false,
      bulkPurchase: null,
      currentAppState: AppState.currentState,
      reactButtonPosition: undefined,
      showRewardAnnouncementModal: false,
      showWelcomeScreenForNewFbUserModal: false,
      showCardsCarousal: false,
      isGetMoreProfiesAllowed: false,
      showLastCard: false,
      isNewCloserModalVisible: false,
      showProfileCardsOverReactButton: false,
      showOneTimeMonetisationTutorialSlides: false,
      monetisationTutorialName: "",
      showGetToKnowNotificationModal: false,
      modalUserObj: {},
      isStepbackNotAvailableModalVisible: false,
      isStepbackNotAvailableModal: {
        notAvailableAny: false,
        successCallback: () => ({})
      }
    };

    //animted values
    this.bottomSheetTransY = new Value(1);

    //animted values
    this._carousel = React.createRef();
    this.toggleBottomNavBar = this.toggleBottomNavBar.bind(this);
    this.btmRef = React.createRef();
    this.instagramLogin = React.createRef();
    this.lastCardRef = React.createRef();
    this.showGemsAcknowledgement = new Value(0);
    this.gemsFromCount = 0;
    this.gemsToCount = 0;
    //
  }

  showGemsCountReduction = (fromCount, toCount) => {
    this.gemsFromCount = fromCount;
    this.gemsToCount = toCount;
    this.showGemsAcknowledgement.setValue(1);
  };
  //eslint-disable-next-line
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  setReactButtonPosition = reactButtonPosition => {
    // if (reactButtonPosition && reactButtonPosition.x) {
    // const { x } = reactButtonPosition;
    // if (x > 0 && x < DeviceWidth) {
    this.setState({ reactButtonPosition, showTapTutorial: true });
    // }
    // }
  };
  fetchPosts = cbPosts => {
    const { activeProfile } = this.props;
    const { _id, posts } = activeProfile;
    const { currentProfilePosts } = this.state;

    if (Object.keys(currentProfilePosts)) {
      if (
        posts.length > 0 &&
        currentProfilePosts[posts[0]] &&
        currentProfilePosts[posts[0]].postedBy &&
        currentProfilePosts[posts[0]].postedBy._id === _id
      ) {
        cbPosts(currentProfilePosts);
      } else {
        getPosts(_id, postsResponse => {
          if (postsResponse.success) {
            const resp = {};
            if (postsResponse && postsResponse.data) {
              posts.forEach(gameId => {
                const currentGamePosts = postsResponse.data.filter(post => {
                  if (post.questionId.gameId._id === gameId) {
                    return true;
                  } else {
                    return false;
                  }
                });
                const sortedPosts = currentGamePosts.sort((a, b) => {
                  return a.postOrder - b.postOrder;
                });
                resp[gameId] = sortedPosts;
              });
            }
            cbPosts(resp);
            this.setState({ currentProfilePosts: resp });
          } else {
            alert(postsResponse);
          }
        });
      }
    }
  };

  checkIfUserIsNew = cb => {
    UserApi.checkIfUserHasJustSignedUp(cbData => {
      if (cbData.success) {
        cb(true);
      } else {
        cb(false);
      }
    });
  };

  componentDidMount = () => {
    this.listenForFirbaseNotification();
    const {
      authState,
      setUserState,
      setCronState,
      referralCode,
      setTutorialStartingTime,
      myData,
      setCreatedAt,
      setHasMore,
      setThirtyProfiles,
      setPresetContentModalVisibility
    } = this.props;
    // alert(authState);
    this.getThirtyProfiles();
    switch (authState) {
      case USER_STATES.NEW_USER:
        if (referralCode) {
          this.handleReferralCode();
        } else {
          setUserState(USER_STATES.TUTORIALS_STAGE);
          setTutorialStartingTime();
          setCronState(USER_STATES.CRONS_STAGE);
          this.checkSystemPermissions();
        }
        break;

      case USER_STATES.OLD_USER:
        if (referralCode) {
          /**
           * before starting tutorials and searching screen first show failed referral popup
           *  */
        } else {
          this.checkIfUserIsNew(isNew => {
            if (isNew) {
              setUserState(USER_STATES.TUTORIALS_STAGE);
              setTutorialStartingTime();
              setCronState(USER_STATES.CRONS_STAGE);
            } else {
              setUserState(USER_STATES.TUTORIALS_STAGE);
              setTutorialStartingTime();
              setCronState(USER_STATES.ALL_CRONS_DONE);
              this.checkSystemPermissions();
            }
          });
          if (myData.hasEditedPosts) {
            setPresetContentModalVisibility();
          }
        }
        break;

      case USER_STATES.TUTORIALS_STAGE:
        // this.updateUserLocationEveryTime();
        this.setState({ showCardsCarousal: true });
        /**New User Just closed and opened app, so check for
         * Location change
         * Location Permission
         */
        break;

      case USER_STATES.ALL_TUTORIALS_SEEN:
        // this.updateUserLocationEveryTime();
        this.setState({ showCardsCarousal: true });
        /** Old User Just closed and opened app, so check for
         * Location change
         * Location Permission
         */
        break;

      default:
        break;
    }

    // setTimeout(() => {
    //   this.setState({
    //     isNewCloserModalVisible: true,
    //     isStepbackNotAvailableModalVisible: true,
    //     isStepbackNotAvailableModal: {
    //       notAvailableAny: true,
    //       successCallback: () => {
    //         alert(" set now");
    //       }
    //     }
    //   });
    // }, 5000);
  };

  handleReferralCode = () => {
    const { referralCode } = this.props;
    UserApi.earnRewardViaReferralCode({ referralCode }, cbData => {
      if (cbData.success) {
        this.setState(
          {
            showRewardAnnouncementModal: true,
            isRewardSuccess: true
          },
          () => {
            this.openCloserModal();
          }
        );
      } else {
        this.setState(
          {
            showRewardAnnouncementModal: true,
            isRewardSuccess: false
          },
          () => {
            this.openCloserModal();
          }
        );
      }
    });
  };

  componentDidMountt = () => {
    const { referralCode, fbTokenOfNewUser } = this.props;
    if (referralCode) {
      UserApi.earnRewardViaReferralCode({ referralCode }, cbData => {
        if (cbData.success) {
          this.setState(
            {
              showRewardAnnouncementModal: true,
              isRewardSuccess: true
            },
            () => {
              this.openCloserModal();
            }
          );
        } else {
          this.setState(
            {
              showRewardAnnouncementModal: true,
              isRewardSuccess: false
            },
            () => {
              this.openCloserModal();
            }
          );
        }
      });
    } else if (fbTokenOfNewUser) {
      this.setState({
        showWelcomeScreenForNewFbUserModal: true
      });
    } else {
      this.pageOnInit();
    }
  };

  updateUserLocationEveryTime = () => {
    this.getUserLocation(hasGiven => {
      // alert("coming here");
      if (hasGiven) {
        this.getPermission();
        this.props.setLocationPermission(true);
      } else {
        this.setState({ showLottieSearch: false });
        this.props.setLocationPermission(false);
      }
    });
  };

  checkSystemPermissions = () => {
    this.setState({ showLottieSearch: true }, () => {
      this.getUserLocation(hasGiven => {
        if (hasGiven) {
          this.getPermission();
          this.props.setLocationPermission(true);
        } else {
          this.setState({ showLottieSearch: false });
          this.props.setLocationPermission(false);
        }
      });
    });
  };

  pageOnInit = () => {
    this.checkLocationPermission();
    this.processReasons();
    this.onTokenRefreshHandler();
    this.setCurrentScreenIndex();
    setTimeout(() => {
      const { currentProfileIndex } = this.props;
      if (this._carousel && this._carousel.current) {
        this._carousel.snapToItem(currentProfileIndex, false);
      }
    }, 500);
    this.listenForFirbaseNotification();
  };

  processReasons = () => {
    const { allReasons = [] } = this.props;
    let blockReasons = allReasons.map(({ text, type, _id }) => {
      if (type === "STRANGERS") {
        return { text, type, _id };
      }
    });
    blockReasons = blockReasons.filter(i => i);
    this.setState({ blockReasons });
  };
  fetchRoomsData = async handleCron => {
    const { setRooms, setRoomsArray } = this.props;
    RoomApi.getRooms(cbRooms => {
      if (cbRooms.success) {
        setRooms(cbRooms.data);
        setRoomsArray(cbRooms.data);
        if (handleCron) {
          this.handleTutorialsAfterReactingToAnUser(cbRooms.data);
        }
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
    console.log(" all parsed data is ", parsedData);
    if (type === appConstants.POST_TO_PROFILE) {
      if (currentChatScreenIndex !== 1) {
        setReceivedTextDot(true);
      }
    } else {
      if (currentChatScreenIndex !== 2) {
        setSentTextDot(true);
      }
    }
    // this.props.setCurrentChatScreenIndex(targetChatIndex);
    console.log(" in app notification enabled is ", inAppNotificationEnabled);
    if (inAppNotificationEnabled) {
      this.setState(
        {
          notificationText: `Reacted to you`,
          notificationTitle: name,
          notificationImage: image,
          openChatWindow: false,
          showName
          // targetChatIndex
        },
        () => {
          this.showInappNotification();
        }
      );
    }
  };
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
        type,
        senderShowName,
        inAppNotificationEnabled = true
      } = newActivity;
      const { postedBy, status } = allRooms[roomId];
      if (inAppNotificationEnabled) {
        this.setState(
          {
            notificationTitle: namify(postedBy.name || ""),
            notificationText: `Sent you ${namify(type)}`,
            notificationImage:
              (postedBy && postedBy.images && postedBy.images[0]) || "",
            notificationRoomId: roomId,
            openChatWindow: status === "SLOT" ? false : true,
            showName: senderShowName
          },
          () => {
            this.props.setNewActivity(null);
            this.showInappNotification();
            this.checkAndVibrate();
          }
        );
      }
    }
    const isInSurfingScreen =
      nextProps.currentScreenIndex && nextProps.currentScreenIndex === 0;

    if (nextProps.firebaseNotification !== null && isInSurfingScreen) {
      const { firebaseNotification } = nextProps;
      this.fetchDataAndSetDots(firebaseNotification);
      this.props.setFirebaseNotification(null);
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
    if (type === appConstants.PENDING_FRIEND_REQUEST) {
      if (currentScreenIndex !== 4) {
        let friendObj = {
          user: parsedData.user,
          createdAt,
          friend: myData._id,
          _id: friendObjId,
          status: appConstants.PENDING_FRIEND_REQUEST
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
          this.setState(
            {
              notificationTitle: namify(name),
              notificationText: `Got closer`,
              notificationImage: image,
              notificationRoomId: roomId,
              openChatWindow: true
            },
            () => {
              this.showInappNotification();
            }
          );
        }
      }
      if (currentChatScreenIndex !== 0) {
        setChatTextDot(true);
      }
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
        this.setState(
          {
            notificationTitle: namify(name),
            notificationText: `Sent you ${namify(type)}`,
            notificationImage: image,
            notificationRoomId: roomId,
            openChatWindow: room.status === "SLOT" ? false : true
          },
          () => {
            this.showInappNotification();
          }
        );
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
          notificationTitle: userNamify({ name, showName }),
          notificationText: `Sent you ${namify(type)}`,
          notificationImage: image,
          notificationRoomId: roomId,
          openChatWindow: false
        },
        async () => {
          await this.fetchRoomsData();
          this.showInappNotification();
        }
      );
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
      }
    }
  };

  listenForFirbaseNotification = () => {
    if (OS === "android" || OS === "ios") {
      firebase.notifications().onNotification(notification => {
        // alert(JSON.stringify(notification.data));
        console.log("Notification from firebase is: ", notification);
        this.checkAndSetChatFavouritesTutorials(false);
        this.props.setFirebaseNotification(notification);
        // this.fetchDataAndSetDots(notification);
        this.checkAndVibrate();
      });
    } else {
      // firebase.messaging().onMessage(message => {
      //   alert(" got one notifi");
      //   // alert(JSON.stringify(message.data));
      //   console.log("message from firebase is: ", message);
      //   this.fetchDataAndSetDots(message);
      // });
    }
  };

  setCurrentScreenIndex = () => {
    this.props.setCurrentScreenIndex(0);
  };

  onTokenRefreshHandler = () => {
    firebase.messaging().onTokenRefresh(fcmToken => {
      if (fcmToken) {
        const isIos = OS === "ios";
        storeData(isIos ? "FCM_IOS" : "FCM_ANDROID", fcmToken);
        this.updateProfile(isIos, fcmToken);
      } else {
        // alert("Cannot refresh FCM token");
      }
    });
  };

  checkNotificationPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getFcmToken();
    } else {
      this.getPermission();
    }
  };

  getUserLocation = cb => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000
    })
      .then(location => {
        const { longitude, latitude } = location;

        UserApi.updateProfile(
          {
            location: {
              type: "Point",
              coordinates: [longitude, latitude]
            }
          },
          cbUpdated => {
            cb(true);
            if (cbUpdated.success) {
              // success
            } else {
              alert(
                "Something went wrong while updating user location " + cbUpdated
              );
            }
          }
        );
      })
      .catch(error => {
        // alert("error while fetching location");
        cb(false);
      });
  };

  getPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
      let notificationPermission = await firebase.messaging().hasPermission();
      this.props.setNotificationPermission(notificationPermission);
      this.getFcmToken();
      this.getThirtyProfiles();
    } catch (error) {
      alert("It's recommended to enable Notifications to stay updated");
    }
  };

  getFcmToken = async () => {
    try {
      const fcmToken = await firebase.messaging().getToken();
      console.log(" new token from firebase is ", fcmToken);
      if (fcmToken) {
        const isIos = OS === "ios";
        this.updateProfile(isIos, fcmToken);
      } else {
        alert("Cannot get FCM token");
      }
    } catch (error) {
      // alert(error);
    }
  };

  getTokenFromStorage = async cb => {
    const isIos = OS === "ios";
    let token = await retrieveData(isIos ? "FCM_IOS" : "FCM_ANDROID");
    cb(token);
  };

  updateProfile = (ios, token) => {
    console.log(" token to be updated is ", token);

    UserApi.updateProfile(
      ios
        ? {
            fcm_token_ios: token
          }
        : {
            fcm_token_android: token
          },

      () => {
        console.log("Updated profile successfully with FCM token: ", token);
      }
    );
  };

  fetchPosts = () => {
    this.setState({ postsLoading: true });
    const { thirtyProfiles, currentProfileIndex } = this.props;
    const currentProfile = thirtyProfiles[currentProfileIndex];
    const { posts: gamesOrder = [] } = currentProfile;

    UserApi.getPosts(thirtyProfiles[currentProfileIndex]._id, posts => {
      this.setState({ postsLoading: false });
      if (posts.success) {
        console.log(posts);
        const resp = {};
        if (posts && posts.data) {
          gamesOrder.forEach(gameId => {
            const currentGamePosts = posts.data.filter(post => {
              if (post.questionId.gameId._id === gameId) {
                return true;
              } else {
                return false;
              }
            });
            const sortedPosts = currentGamePosts.sort((a, b) => {
              return a.portOrder - b.portOrder;
            });
            resp[gameId] = sortedPosts;
          });
        }
        // console.log("  new output is  ", resp);
        this.setState({ currentProfilePosts: resp });
      } else {
        alert(posts);
      }
    });
  };
  storeResponses = (game, questionIndex, option, postId) => {
    console.log(game, questionIndex, option, postId);

    let {
      thirtyProfiles,
      fromChatWindow,
      myData,
      currentProfileIndex
    } = this.props;
    const activeProfile = thirtyProfiles[currentProfileIndex];

    const { currentProfilePosts } = this.state;

    let localQuestions = Object.assign({}, currentProfilePosts);
    console.log(
      "localQuestions currentProfilePosts are: ",
      currentProfilePosts[game][0].postedBy
    );

    // let localResponse = Object.assign([], responses);
    localQuestions[game][questionIndex].response = option;

    let responseDbObject = {
      postedBy: activeProfile._id,
      answeredBy: myData._id,
      response: `${option}`,
      postId: postId,
      location: fromChatWindow
        ? appConstants.POST_TO_CHAT_PROFILE
        : appConstants.POST_TO_PROFILE
    };
    // localResponse.push(responseDbObject);
    this.props.addNewRespone(responseDbObject);
    this.setState({
      questions: localQuestions
      // responses:
    });
  };
  checkLocationPermission = () => {
    this.getUserLocation(cbData => {
      if (cbData) {
        this.props.setLocationPermission(true);
      } else {
        this.props.setLocationPermission(false);
      }
      this.getThirtyProfiles();
    });
  };
  getThirtyProfiles = () => {
    this.getUserLocation(cb => {});

    UserApi.getThirtyProfiles(profilesRes => {
      console.log("thirty poriles are: ", profilesRes);

      if (profilesRes.success) {
        const { profiles, hasMore, createdAt } = profilesRes.data;
        console.log("thirty poriles are: ", profiles);
        this.props.setCreatedAt(createdAt);

        this.props.setHasMore(hasMore);
        this.props.setThirtyProfiles(profiles);
        this.setState({ areProfilesLoading: false });
      } else {
        alert("Something went wrong while fetching profiles");
      }
    });
    const {
      locationPermissionGranted,
      thirtyProfiles,
      setCreatedAt,
      setHasMore,
      setThirtyProfiles
    } = this.props;
    // alert(locationPermissionGranted);
    if (locationPermissionGranted) {
      if (thirtyProfiles.length) {
        // data already found
        // alert(thirtyProfiles.length);
      } else {
        // alert("No profiles found in state");
        // this.setState({ areProfilesLoading: true });
        UserApi.getThirtyProfiles(profilesRes => {
          // alert(profilesRes);
          if (profilesRes.success) {
            const { profiles, hasMore, createdAt } = profilesRes.data;
            setCreatedAt(createdAt);
            setHasMore(hasMore);
            setThirtyProfiles(profiles);
            this.setState(
              {
                areProfilesLoading: false,
                showLottieSearch: false,
                showCardsCarousal: true
              }
              // () => {
              //   this.checkNotificationPermission();
              // }
            );
          } else {
            alert(
              "Something went wrong while fetching profiles " +
                JSON.stringify(profilesRes)
            );
          }
        });
      }
    }
  };
  showPresetModal = () => {
    this.setState({ isPresetModalVisible: true });
    this.openCloserModal();
  };
  openSparkConfirmation = bundleConfirmation => {
    this.setState({
      bundleConfirmation,
      isBundleConfirmationModalVisible: true
    });
    this.openCloserModal();
  };
  renderProfiles = ({ item, index }) => {
    const { thirtyProfiles } = this.props;

    if (thirtyProfiles && thirtyProfiles.length > 0) {
      if (item.blank) {
        return <View style={{ flex: 1, backgroundColor: WHITE }} />;
      }
      return (
        <SurfingCard
          item={item}
          setReactButtonPosition={this.setReactButtonPosition}
          index={index}
          onSparkTapped={() => this.onSparkTapped(item.name, item._id, item)}
          othersProfileNav={this.othersProfileNav}
          openSparkConfirmation={this.openSparkConfirmation}
          openFirstProfileCard={this.openFirstProfileCard}
          showOneTimeTutorial={this.showOneTimeMonetisationTutorial}
          fetchRoomsData={this.fetchRoomsData}
          openBuyGemsModal={(buyPower, bulkPurchase) => {
            console.log(" bulkPlanitem is ", bulkPurchase);
            this.setState({
              buyPower,
              bulkPurchase,
              isStepBackModalVisible: true,
              isNewCloserModalVisible: true
            });
            // this.openCloserModal();
          }}
        />
      );
    } else {
      return <MediumText>Thirty profiles length is 0.</MediumText>;
    }
  };
  showInappNotification = () => {
    // Vibration.vibrate(200);
    this.setState({
      notificationVisible: true
    });
  };
  openBuyGemsModal = ({
    powerName,
    cost,
    colors,
    successCallback,
    failureCallback,
    hasOffers,
    requiredTotalGems,
    afterPurchase
  }) => {
    this.setState({
      isNewCloserModalVisible: true,
      isStepBackModalVisible: true,
      buyPower: {
        successCallback: () => {
          successCallback();
        },
        failureCallback: () => {
          failureCallback();
        },
        powerName,
        cost,
        colors,
        hasOffers,
        requiredTotalGems,
        afterPurchase
      }
    });
    // this.openCloserModal();
  };
  fetchUserPurchasedPacks = () => {
    getUserPacks(packsResult => {
      console.log(" spark price is result final is ", packsResult);
      if (packsResult.success) {
        this.props.setUserPacks(packsResult.data);
      }
    });
  };
  othersProfileNav = () => {
    // this.props.setCurrentChatScreenIndex(2);
    this.btmRef.snapTo(1);
  };

  fetchUserPacks = () => {
    getPackPrices("ACTIVE", packsResult => {
      console.log(" spark price is result final is ", packsResult);
      if (packsResult.success) {
        this.props.setPackPrices(packsResult.data);
      }
    });
  };

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

  onSparkTapped = (targetUserName, targetUserId, _targetUser) => {
    const {
      myData,
      setRooms,
      setRoomsArray,
      currentChatScreenIndex,
      addSparkToProfile,
      currentProfileIndex,
      thirtyProfiles
    } = this.props;
    const targetUser = thirtyProfiles[currentProfileIndex];
    addSparkToProfile(targetUser._id);
    // this.setState(
    //   {
    //     notificationText: `sent a  spark to  ${userNamify(targetUser)}`,
    //     notificationTitle: "You",
    //     notificationImage: myData.images[0],
    //     openChatWindow: false
    //   },
    //   () => {

    // this.showInappNotification();
    RoomApi.getRooms(cbRooms => {
      if (cbRooms.success) {
        setRooms(cbRooms.data);
        setRoomsArray(cbRooms.data);
        this.handleTutorialsAfterReactingToAnUser(cbRooms.data);
        if (currentChatScreenIndex !== 2) {
          setSentTextDot(true);
        }
        // setChatIconDot(true);
      }
    });
    //   });
    // }
    // );
    //   }
    // });
  };
  checkAndSetChatFavouritesTutorials = isSent => {
    const {
      sentStack = [],
      adminProps,
      sentRoomsLength,
      recievedStack,
      receivedRoomsLength,
      setTopNavTabTutorials
    } = this.props;
    const { sentStackThreshold, recievingStackThreshold } = adminProps;
    if (isSent) {
      const isPrevStackEmpty = sentStack.length === 0;
      const isSentFilled = sentRoomsLength >= sentStackThreshold;
      console.log(
        " @debug for stack tutorials :::isSentFilled >> ",
        isSentFilled,
        sentRoomsLength,
        sentStackThreshold
      );
      console.log(
        " @debug for stack tutorials :::isPrevStackEmpty >> ",
        isPrevStackEmpty,
        sentStack.length
      );
      if (isSentFilled && isPrevStackEmpty) {
        setTopNavTabTutorials("SENT");
      }
    } else {
      const isPrevStackEmpty = recievedStack.length === 0;
      const isReceivedFilled = receivedRoomsLength >= recievingStackThreshold;
      if (isReceivedFilled && isPrevStackEmpty) {
        setTopNavTabTutorials("RECEIVED");
      }
    }
    // if ( roomsArray sentStackThreshold)
    // if (sentStack){

    // }
  };
  sendResponses = () => {
    const {
      currentResponses = [],
      setRooms,
      setRoomsArray,
      setSentTextDot,
      currentChatScreenIndex,
      resetResponses,
      setCardHideStatus,
      thirtyProfiles,
      currentProfileIndex,
      setHasSeenReactOnTheseCardsTutorial
    } = this.props;

    if (currentResponses.length > 0) {
      console.log(" current responses length is ", currentResponses);
      const { _id, name } = thirtyProfiles[currentProfileIndex];
      const { myData } = this.props;
      QuestionApi.postResponse({ responses: currentResponses }, cbData => {
        resetResponses();
        setHasSeenReactOnTheseCardsTutorial();
        setCardHideStatus(_id);
        this.setState({
          notificationText: `Reacted to ${name}`,
          notificationTitle: "You",
          notificationImage: myData.images[0],
          openChatWindow: false,
          notificationVisible: true
        });
        this.checkAndSetChatFavouritesTutorials(true);
        if (cbData.success) {
          RoomApi.getRooms(cbRooms => {
            if (cbRooms.success) {
              setRooms(cbRooms.data);
              setRoomsArray(cbRooms.data);
              this.handleTutorialsAfterReactingToAnUser(cbRooms.data);
              if (currentChatScreenIndex !== 2) {
                setSentTextDot(true);
              }
              // setChatIconDot(true);
            }
          });
          console.log("SUCCESSFULLY stored responses", cbData);
        } else {
          alert("Failed " + cbData.message);
        }
      });
    }
  };
  renderGradientHeader = () => {
    const { thirtyProfiles, currentProfileIndex, myData } = this.props;
    const activeProfile = thirtyProfiles[currentProfileIndex];
    return (
      <GradientHeader
        showOneTimeTutorial={this.showOneTimeMonetisationTutorial}
        targetUser={activeProfile}
        onSparkTapped={this.onSparkTapped}
        fetchRoomsData={this.fetchRoomsData}
        showNotification={targetUser => {
          this.setState(
            {
              notificationText: `sent a spark to  ${userNamify(targetUser)}`,
              notificationTitle: "You",
              notificationImage: myData.images[0],
              openChatWindow: false
            },
            () => {
              this.showInappNotification();
            }
          );
        }}
        hideSparkButton={activeProfile && activeProfile.sentSpark}
        openSparkConfirmation={this.openSparkConfirmation}
        openBuyPowerModal={({ buyPower, bulkPurchase }) => {
          this.setState(
            {
              buyPower,
              bulkPurchase,
              isStepBackModalVisible: true,
              isNewCloserModalVisible: true
            },
            () => {
              // this.openCloserModal();
            }
          );
        }}
      />
    );
  };
  openBlockAndReportsModal = () => {
    this.setState({ isBlockAndReportModalVisible: true });
    this.openCloserModal();
  };

  openFirstProfileCard = () => {
    this.setState({
      showProfileCardsOverReactButton: true
    });
  };

  openResponseScreen = (selectedGame, position, selectedGameIndex, posts) => {
    this.setState({
      selectedGame,
      position,
      selectedGameIndex,
      currentProfilePosts: posts
    });
  };

  onClose = () => {
    this.setState({ selectedGame: null }, () => {
      this.props.setQuestionCardVisibility("closed");
      setTimeout(() => {
        this.props.setQuestionCardVisibility(undefined);
      }, 500);
    });
  };

  renderResponseScreen = () => {
    const {
      position,
      selectedGame,
      selectedGameIndex,
      currentProfilePosts,
      showProfileCardsOverReactButton
    } = this.state;
    const { currentProfileIndex, thirtyProfiles } = this.props;

    const userData = thirtyProfiles[currentProfileIndex];

    if (selectedGame) {
      return (
        <Response
          position={position}
          onClose={this.onClose}
          fromChatWindow={false}
          storeResponses={this.storeResponses}
          showTutorial={false}
          fromPresetModal={showProfileCardsOverReactButton}
          selectedGame={selectedGame}
          closeLightBoxModal={this.closeLightBoxModal}
          selectedGameIndex={selectedGameIndex}
          games={currentProfilePosts}
          targetUser={userData}
          userName={userNamify(userData)}
          userImage={
            userData &&
            userData.images &&
            userData.images.length > 0 &&
            userData.images[0]
          }
        />
      );
    } else {
      return <View />;
    }
  };
  renderBulkPurchseModal = () => {
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
  renderOthersProfile = () => {
    const { postsLoading, currentProfilePosts } = this.state;
    const {
      currentProfileIndex,
      thirtyProfiles,
      myData,
      setQuestionCardTutorialVisibility
    } = this.props;

    return (
      <BottomSheet
        // enabledHeaderGestureInteraction
        enabledBottomClamp={true}
        ref={ref => (this.btmRef = ref)}
        snapPoints={[-20, DeviceHeight * 0.96]}
        // render
        callbackNode={this.bottomSheetTransY}
        enabledHeaderGestureInteraction
        enabledContentGestureInteraction
        onOpenEnd={() => {
          this.setState({
            btmSheetOpened: true
          });
          if (!this.props.profileCardsTutorialSeen) {
            this.props.setProfileCardsTutorialVisibility();
            setQuestionCardTutorialVisibility(true);
            setTimeout(() => {
              setQuestionCardTutorialVisibility(undefined);
            }, 200);
          }
        }}
        onCloseEnd={() => {
          if (this.state.btmSheetOpened) {
            this.sendResponses();
          }
        }}
        renderHeader={this.renderGradientHeader}
        renderContent={() => {
          return (
            <ProfileModal
              fetchPosts={this.fetchPosts}
              onClose={() => {
                this.btmRef.snapTo(0);
              }}
              navigateToChat={() => {
                this.btmRef.snapTo(0);
                // this.props.setCurrentChatScreenIndex(2);
                setTimeout(() => {
                  // this.bottomNavScrollHandler("CHAT");
                  this.props.navigation.push("chatFavourites");
                  // this.props.navigation.push("")
                }, 500);
              }}
              instagramLoginRef={this.instagramLogin}
              openBlockAndReportsModal={this.openBlockAndReportsModal}
              onInstaConnectionTapped={() => {
                this.btmRef.snapTo(0);
                setTimeout(() => {
                  // this.props.navigation.push("chatFavourites")
                  this.props.navigation.push("myProfile");
                  // this.bottomNavScrollHandler("PROFILE", DeviceWidth * 2);
                }, 500);
              }}
              swipeProfileUp={() => {
                this.othersProfileNav(-DeviceHeight);
                setTimeout(() => {
                  this._carousel.snapToNext();
                }, 300);
              }}
              activeProfile={thirtyProfiles[currentProfileIndex]}
              userInfo={myData}
              fromSurfing={true}
              showCards={true}
              navigation={this.props.navigation}
              postsLoading={postsLoading}
              currentProfilePosts={currentProfilePosts}
              openResponseScreen={this.openResponseScreen}
              showProfileCardsTutorial={this.showProfileCardsTutorial}
            />
          );
        }}
      />
    );
  };
  showProfileCardsTutorial = position => {
    this.setState({
      position,
      showProfileCardsTutorial: true
    });
  };
  toggleBottomNavBar = hideBottomNavBar => {
    this.setState({ hideBottomNavBar });
  };
  renderCloserModal = () => {
    const { thirtyProfiles, currentProfileIndex } = this.props;
    const {
      isCloserModalVisible,
      isGemCountModalVisible,
      isPresetModalVisible,
      isPresetModalTwoVisible,
      isBlockAndReportModalVisible,
      blockReasons,
      gemsConsumption,
      isBundleConfirmationModalVisible,
      bundleConfirmation,
      showRewardAnnouncementModal,
      showWelcomeScreenForNewFbUserModal,
      showOneTimeMonetisationTutorialSlides,
      monetisationTutorialName,
      showGetToKnowNotificationModal,
      modalUserObj
    } = this.state;

    const activeProfile = thirtyProfiles && thirtyProfiles[currentProfileIndex];

    return (
      <CloserModal isModalVisible={isCloserModalVisible} ref={"modalRef"}>
        {isGemCountModalVisible ? (
          <GemCountModal
            // {...gemsConsumption}
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
        ) : isPresetModalVisible ? (
          <PresetModal
            openResponseScreen={this.openResponseScreen}
            dismissModal={bool => {
              this.closeCloserModal();
              this.setState({ isPresetModalVisible: false }, () => {
                if (bool === true) {
                  this.props.navigation.push("myProfile", {
                    scrollTillCards: true
                  });
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
                  this.props.navigation.push("myProfile", {
                    scrollTillCards: true
                  });
                }
              });
            }}
          />
        ) : isBlockAndReportModalVisible ? (
          <BlockAndReportReasonsModal
            reasons={blockReasons}
            hideModal={this.closeCloserModal}
            victimId={activeProfile && activeProfile._id}
            // closeWhole={() => this.closeCloserModal()}
            onClose={async blockedResponse => {
              this.closeCloserModal();
              this.setState({ isBlockAndReportModalVisible: false });
              setTimeout(() => {
                this.props.onClose();
              }, 300);
              setTimeout(async () => {
                await this.props.removeOneBlockedUserFromProfiles(
                  blockedResponse.user
                );
                Alert.alert(
                  `Reported  ${userNamify(activeProfile)} ! `,
                  "You will never come accross this profile again. ",
                  [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                  { cancelable: false }
                );
              }, 600);
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
        ) : showRewardAnnouncementModal ? (
          this.renderRewardAnnouncementModal()
        ) : showWelcomeScreenForNewFbUserModal ? (
          this.renderWelcomeScreenForNewUser()
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
        ) : showGetToKnowNotificationModal ? (
          <GetToKnowNotificationModal
            dismiss={() => {
              this.closeCloserModal();
              this.setState({ showGetToKnowNotificationModal: false });
            }}
            userObj={modalUserObj}
            openSettings={() => {
              Linking.openURL("app-settings:")
                .then(res => {
                  console.log(" res is ", res);
                })
                .catch(err => {
                  console.log(" err is ", err);
                });
              setTimeout(() => {
                this.closeCloserModal();
                this.setState({ showGetToKnowNotificationModal: false });
              }, 300);
            }}
          />
        ) : (
          <View />
        )}
      </CloserModal>
    );
  };

  scrollRef = React.createRef();

  showReferralCodeInput = () => {
    this.scrollRef = this.scrollRef.scrollTo({
      x: DeviceWidth * 0.8,
      animated: true
    });
  };

  scrollBackToWelcome = () => {
    this.scrollRef = this.scrollRef.scrollTo({
      x: DeviceWidth * 0,
      animated: true
    });
  };

  closerRewardsModalAndPageInit = () => {
    this.closeCloserModal();
    this.setState({ showRewardAnnouncementModal: false }, () => {
      setUserState(USER_STATES.TUTORIALS_STAGE);
      setCronState(USER_STATES.CRONS_STAGE);
      this.checkSystemPermissions();
    });
  };

  dismissRewardsModal = param => {
    switch (param) {
      case "success":
        this.closerRewardsModalAndPageInit();
        break;

      case "fake":
        this.closerRewardsModalAndPageInit();
        break;

      case "submitted":
        //
        break;

      default:
        break;
    }
  };

  closeFbUserWelcomeModal = submitted => {
    if (submitted) {
      this.closeCloserModal();
      setTimeout(() => {
        this.setState({ showWelcomeScreenForNewFbUserModal: false }, () => {
          this.setState(
            {
              showRewardAnnouncementModal: true,
              isRewardSuccess: true
            },
            () => {
              this.openCloserModal();
            }
          );
        });
      }, 300);
    } else {
      this.closeCloserModal();
      this.setState({ showWelcomeScreenForNewFbUserModal: false });
      setTimeout(() => {
        this.checkSystemPermissions();
      }, 300);
    }
  };

  renderWelcomeScreenForNewUser = () => {
    return <FbUserWelcomeModal closeModal={this.closeFbUserWelcomeModal} />;
  };

  renderRewardAnnouncementModal = () => {
    const { myData, adminProps } = this.props;
    const { isRewardSuccess } = this.state;

    return (
      <ModalCurvedcard>
        <BoldText style={styles.modalHeader}>
          {isRewardSuccess
            ? `Congratulations ${myData.name}`
            : `Welcome back ${myData.name}`}
        </BoldText>

        <MediumText
          style={{
            marginVertical: 10,
            textAlign: "center",
            fontSize: 16,
            color: FONT_BLACK
          }}
        >
          {isRewardSuccess
            ? `You have earned ${adminProps.inviteRewardsGemCount} Gems`
            : "The referral code you have entered applies only to new users"}
        </MediumText>

        <NoFeedbackTapView onPress={() => this.dismissRewardsModal("success")}>
          <HorizontalGradientView
            colors={[PURPLE, LIGHT_PURPLE]}
            style={styles.submitButton}
          >
            <MediumText
              style={{
                fontSize: 20,
                color: "#fff"
              }}
            >
              Okay
            </MediumText>
          </HorizontalGradientView>
        </NoFeedbackTapView>
      </ModalCurvedcard>
    );
  };
  handleTutorialsAfterReactingToAnUser = roomsArray => {
    const {
      authState,
      setPresetContentModalVisibility,
      presetContentSeen,
      notificationPermissionGranted,
      myData,
      hasGotResponseCron,
      setResponseCron,
      cronState
    } = this.props;
    console.log(
      "cron state and hasGotReponse state: ",
      cronState,
      hasGotResponseCron
    );

    if (cronState === USER_STATES.CRONS_STAGE && !hasGotResponseCron) {
      const mySentRequests = roomsArray.filter(({ status, answeredBy }) => {
        if (status === "SLOT" && answeredBy._id === myData._id) {
          return true;
        }
      });
      const firstSentTime = mySentRequests[0].createdAt;
      let executesAt = firstSentTime + 180;
      let cronJobData = {
        userId: myData._id,
        executesAt,
        task: CRON_TASKS.SCHEDULE_RESPOND_TO_PROFILE_CARD,
        platformProfileId:
          mySentRequests[mySentRequests.length - 1].postedBy._id
      };
      if (mySentRequests.length > 1) {
        if (firstSentTime > getTimeStamp() - 180) {
          UserApi.scheduleCronJob({ ...cronJobData, executed: true }, cb => {
            // alert("further cronJObs are set");
          });
        } else {
          setResponseCron(true);
        }
      } else {
        UserApi.scheduleCronJob({ ...cronJobData, executed: false }, cb => {
          // alert("initial cron job set");
        });
      }
    }
    if (authState === USER_STATES.TUTORIALS_STAGE) {
      const mySentRequests = roomsArray.filter(({ status, answeredBy }) => {
        if (status === "SLOT" && answeredBy._id === myData._id) {
          return true;
        }
      });
      if (mySentRequests.length === 2 && !presetContentSeen) {
        setPresetContentModalVisibility();
        this.showPresetModal();
      }
      if (!notificationPermissionGranted) {
        if (
          myData.gender !== "Man" &&
          myData.gender !== "Woman" &&
          mySentRequests.length === 6
        ) {
          this.showTurnONNotificationAlert(mySentRequests[5].postedBy);
        } else {
          const isMyGenderMan = myData.gender === "Man";
          if (isMyGenderMan) {
            const _womanRequests = mySentRequests.filter(
              req => req.postedBy.gender === "Woman"
            );
            if (_womanRequests.length === 3) {
              this.showTurnONNotificationAlert(_womanRequests[2].postedBy);
            }
          } else {
            const _menRequests = mySentRequests.filter(
              req => req.postedBy.gender === "Man"
            );
            if (_menRequests.length === 3) {
              this.showTurnONNotificationAlert(_menRequests[2].postedBy);
            }
          }
        }
      }
    }
  };

  showTurnONNotificationAlert = modalUserObj => {
    // const _userNameReactedTo = userNamify(userObj);
    this.setState({ showGetToKnowNotificationModal: true, modalUserObj });
    this.openCloserModal();

    // Alert.alert(
    //   null,
    //   `Get to know when ${_userNameReactedTo} reacts back to you`,
    //   [
    //     {
    //       text: "Cancel",
    //       onPress: () => {}
    //     },
    //     {
    //       text: "Go to settings",
    //       onPress: () => {
    //         Linking.openURL("app-settings:")
    //           .then(res => {
    //             console.log(" res is ", res);
    //           })
    //           .catch(err => {
    //             console.log(" err is ", err);
    //           });
    //       }
    //     }
    //   ]
    // );
  };
  handleSurfingCardSequentialTutorial = i => {
    const {
      presetContentSeen,
      roomsArray,
      myData,
      setPresetContentModalVisibility,
      hasGotRequestCron
    } = this.props;

    switch (i) {
      case 1:
        if (!hasGotRequestCron) {
          let executesAt = Lodash.random(
            getTimeStamp() + 60,
            getTimeStamp() + 180
          );
          let cronJobData = {
            userId: myData._id,
            executesAt,
            task: CRON_TASKS.SEND_REQUESTS
          };
          UserApi.scheduleCronJob(cronJobData, () => {
            // alert(JSON.stringify(cbData));
          });
        }
        break;

      case 2:
        if (!presetContentSeen) {
          const mySentRequests = roomsArray.filter(({ status, answeredBy }) => {
            if (status === "SLOT" && answeredBy._id === myData._id) {
              return true;
            }
          });
          if (mySentRequests.length === 2) {
            setPresetContentModalVisibility();
            this.showPresetModal();
          }
        }
        break;

      case 4:
        if (!presetContentSeen) {
          const mySentRequests = roomsArray.filter(({ status, answeredBy }) => {
            if (status === "SLOT" && answeredBy._id === myData._id) {
              return true;
            }
          });
          if (mySentRequests.length === 0) {
            setPresetContentModalVisibility();
            this.showPresetModal();
          }
        }
        break;

      default:
        break;
    }
  };

  onSnapToItemHandler = (i, continueNextAnimation) => {
    const {
      currentProfileIndex,
      myData,
      packPrices,
      allProfiles,
      profileCreatedAt,
      authState,
      thirtyProfiles,
      adminProps,
      updateProfile
    } = this.props;

    console.log(" item snapped to ", i);
    if (i === allProfiles.length) {
      this.setState(
        {
          showCardsCarousal: false
        },
        () => {
          const profilesLength = thirtyProfiles.length;
          const minProfileLength = adminProps["profilesLimit"];
          const allowedCount = adminProps["getMoreProfiesCountAllowed"];
          const maxAllowedCount =
            minProfileLength +
            adminProps["getMoreProfilesOutputCount"] * allowedCount;
          const isGetMoreProfiesAllowed = profilesLength < maxAllowedCount;

          this.lastCardRef.current.animateNextTransition();
          this.setState({
            isGetMoreProfiesAllowed,
            showLastCard: true
          });
        }
      );
      // this.lastCardRef.current.animateNextTransition();
      // this.setState({
      //   isLastCardVisible: true
      // });
      return;
      //last card reached
      const currentProfile = allProfiles[currentProfileIndex];

      const isToday = moment.unix(profileCreatedAt).isSame(moment(), "day");
      console.log("about to call ", isToday);
      if (!isToday) {
        swipeAProfile(currentProfile._id, swipeResult => {
          console.log(" swipe result is ", swipeResult);
          if (swipeResult.success) {
            this.getThirtyProfiles();
            this.props.setCurrentChatScreenIndex(0);
            // const {} = swipeResult.data;
          }
        });
      }
      return;
    }
    const currentProfile = allProfiles[currentProfileIndex];
    if (currentProfile) {
      const userAge = currentProfile.age;
      const calculatedAge = moment().diff(
        moment(currentProfile.date_of_birth, "DD/MM/YYYY"),
        "years"
      );
      console.log(" userage is ", userAge, calculatedAge, currentProfile);
      const isAgeIncorrect = calculatedAge !== userAge;
      console.log(" age correct value is ", isAgeIncorrect);
      if (isAgeIncorrect) {
        UserApi.updateOtherUser(
          currentProfile._id,
          {
            age: calculatedAge
          },
          updateRes => {
            console.log(" update res is ", updateRes);
          }
        );
      }
    }
    console.log(" onsnap item is ", currentProfileIndex, i);
    if (currentProfileIndex < i) {
      // this.props.setCurrentProfileIndex(i);
      if (authState === USER_STATES.TUTORIALS_STAGE) {
        this.handleSurfingCardSequentialTutorial(i);
      }
      if (currentProfile) {
        swipeAProfile(currentProfile._id, swipeResult => {
          console.log(" swipe result is ", swipeResult);
          if (swipeResult.success) {
            const {} = swipeResult.data;
          }
        });
      }
      // animatedIndicatorPosition.setValue(0);
    } else {
      if (
        !myData.seenMonetisationTutorials ||
        myData.seenMonetisationTutorials.indexOf("StepBack") === -1
      ) {
        this.showOneTimeMonetisationTutorial("StepBack", () => {
          this.handleStepBackTutorialCases(continueNextAnimation);
        });
        const seenMonetisationTutorials =
          myData.seenMonetisationTutorials || [];
        seenMonetisationTutorials.push("StepBack");
        updateProfile({ seenMonetisationTutorials });
        UserApi.updateProfile({ seenMonetisationTutorials }, cbUpdated => {});
      } else {
        this.handleStepBackTutorialCases(continueNextAnimation);
        // this.showGemsAcknowledgement.setValue(1);
      }
    }
    console.log(" current profile index is ", i);
    // this.props.setCurrentProfileIndex(i);
  };
  handleStepBackTutorialCases = continueNextAnimation => {
    const {
      myData,
      packPrices,
      allProfiles,
      profileCreatedAt,
      authState,
      thirtyProfiles,
      adminProps
    } = this.props;
    const exactPack = packPrices.find(p => p.value === "STEP_BACK");
    if (exactPack) {
      const requiredGems = exactPack.price;
      const currentGems = myData.gems_count || 0;
      if (currentGems >= requiredGems) {
        console.log(" has requiredgems ");
        this.openCloserModal();
        this.setState({
          isGemCountModalVisible: true,
          gemsConsumption: {
            successCallback: () => {
              console.log(
                " from count is ",
                currentGems,
                " to is ",
                currentGems - requiredGems
              );
              this.gemsFromCount = currentGems;
              this.gemsToCount = currentGems - requiredGems;
              setTimeout(() => {
                this.showGemsAcknowledgement.setValue(1);

                purchaseGems(-requiredGems, purchaseResult => {
                  if (purchaseResult.success) {
                    continueNextAnimation();
                    this.props.updateProfile({
                      gems_count: purchaseResult.data.gems_count
                    });
                  }
                });
              }, 1000);
              // this.purchaseGems(-requiredGems);
            },
            failureCallback: () => {
              // this._carousel.snapToNext();
            },
            count: exactPack.price
          }
        });
      } else {
        this.setState({
          isNewCloserModalVisible: true,

          isStepBackModalVisible: true,
          buyPower: {
            successCallback: selectedGemCount => {
              const newTotal = myData.gems_count + selectedGemCount;
              console.log(
                " gems error is ",
                newTotal,
                myData.gems_count,
                selectedGemCount
              );
              this.gemsFromCount = parseInt(newTotal);
              this.gemsToCount = parseInt(newTotal - requiredGems);
              setTimeout(() => {
                this.showGemsAcknowledgement.setValue(1);
              }, 1000);
              purchaseAndFulfill({
                isPack: false,
                countToBeAdded: selectedGemCount,
                deductCount: requiredGems,
                item: MONETIZATION_ITEMS.STEP_BACK
              })
                .then(result => {
                  continueNextAnimation();
                  this.props.updateProfile({
                    gems_count: newTotal - requiredGems
                  });
                })
                .catch(console.log);
              // this.props.setCurrentProfileIndex();
              // this.purchaseGems(-requiredGems, true);
            },
            failureCallback: () => {},
            powerName: "Step Back",
            cost: exactPack.price
          }
        });
      }
    }
  };
  showGemCountModal = () => {
    this.setState({ isGemCountModalVisible: true });
    this.openCloserModal();
  };
  showBuyGemsModal = () => {
    this.setState({
      isStepBackModalVisible: true,
      isNewCloserModalVisible: true
    });
    this.openCloserModal();
  };
  openCloserModal = () => {
    this.setState({ isCloserModalVisible: true });
    this.refs["modalRef"].toggleBg(true);
  };
  closeCloserModal = () => {
    this.setState({ isCloserModalVisible: false });
    this.refs["modalRef"].startAnimation(false);
    setTimeout(() => {
      this.refs["modalRef"].toggleBg(false);
    }, 300);
  };
  renderShadow = () => {
    const opacity = interpolate(this.bottomSheetTransY, {
      inputRange: [0, 0.5, 1],
      outputRange: [0.8, 0.2, 0]
    });
    return (
      <Animated.View
        pointerEvents="none"
        style={{
          backgroundColor: "#000",
          ...StyleSheet.absoluteFillObject,
          opacity
        }}
      ></Animated.View>
    );
  };
  fetchInstaPhotos = async token => {
    const instaPhotos = await UserApi.getInstaPosts(token);
    console.log(" insta photos response is ", instaPhotos);
    return instaPhotos.data;
    // this.props.updateProfile()
    // this.props.getInstaImages().then(() => {
    //   const { getInstaImagesResult } = this.props;
    //   if (getInstaImagesResult.success) {
    //     this.setState({
    //       instaImages: getInstaImagesResult.data
    //     });
    //   }
    // });
  };
  onInstaLogin = token => {
    UserApi.updateProfile(
      {
        insta_token: token
      },
      async updateUserResult => {
        if (updateUserResult.success) {
          const instaPhotos = await this.fetchInstaPhotos(token);
          this.props.updateInstaPosts(instaPhotos);
          this.props.updateProfile({
            insta_token: token
          });
        }
      }
    );
  };
  purchaseGems = (price, firstTime = false) => {
    purchaseGems(price, purchaseResult => {
      console.log(" purchase result is ", purchaseResult);
      this.props.updateProfile({
        gems_count: purchaseResult.data.gems_count
      });
      if (firstTime) {
        alert(" you just bought gems and used them ");
      } else {
        alert(" your gems deducted ");
      }
    });
  };
  handleMoreProfilesResponse = async (moreProfilesRes, newGemsCount) => {
    await this.props.appendNewProfiles(moreProfilesRes.data.profiles);
    this.props.setHasMore(moreProfilesRes.data.hasMore ? true : false);
    this.props.updateOwnProfile({
      gems_count: newGemsCount
    });
  };
  getMoreProfiles = () => {
    const { myData, packPrices, expenseTutorials } = this.props;

    const exactPlan = packPrices.find(pack => pack.value === "MORE_PROFILES");
    if (!exactPlan) {
      alert(" pack missing in prices ");
      return;
    }
    this.props.setExpenseTutorial(exactPlan._id);
    const isGemsEnough = myData.gems_count >= exactPlan.price;
    const consumeCall = () => {
      this.gemsFromCount = myData.gems_count;
      this.gemsToCount = myData.gems_count - exactPlan.price;
      this.showGemsAcknowledgement.setValue(1);
      consumeAndFulFill({
        item: MONETIZATION_ITEMS.MORE_PROFILES,
        deductCount: exactPlan.price,
        deductFrom: "gems"
      })
        .then(resp => this.handleMoreProfilesResponse(resp, this.gemsToCount))
        .catch(err => console.log(" more profiles err is ", err));
      // getMoreProfiles(async moreProfilesRes => {
      //   if (moreProfilesRes.success) {
      //     await this.props.appendNewProfiles(moreProfilesRes.data.profiles);
      //     this.props.setHasMore(moreProfilesRes.data.hasMore ? true : false);
      //     this.setState({
      //       showLastCard: false,
      //       showCardsCarousal: true
      //     });
      //   }
      // });
    };
    const purchaseCall = newGemsCount => {
      this.gemsFromCount = myData.gems_count + newGemsCount;
      this.gemsToCount = newGemsCount - exactPlan.price;
      this.showGemsAcknowledgement.setValue(1);

      purchaseAndFulfill({
        countToBeAdded: 1,
        deductCount: exactPlan.price,
        item: MONETIZATION_ITEMS.MORE_PROFILES
      })
        .then(resp => this.handleMoreProfilesResponse(resp, this.gemsToCount))
        .catch(err => console.log(" more profiles err is ", err));
      // purchaseGems(-exactPlan.price, async purchaseResult => {
      //   if (purchaseResult.success) {
      //     this.props.updateProfile({
      //       gems_count: purchaseResult.data.gems_count
      //     });
      //     moreProfilesApiCall();
      //   }
      // });
    };
    if (isGemsEnough) {
      if (
        expenseTutorials[exactPlan._id] &&
        expenseTutorials[exactPlan._id] > EXPENSE_THRESHOLD_COUNT
      ) {
        console.log(
          " expense one is  ",
          expenseTutorials,
          exactPlan._id,
          expenseTutorials[exactPlan._id]
        );
        purchaseGems(-exactPlan.price, async purchaseResult => {
          if (purchaseResult.success) {
            this.props.updateProfile({
              gems_count: purchaseResult.data.gems_count
            });
            moreProfilesApiCall();
          }
        });
        return;
      }
      this.openCloserModal();
      this.setState({
        isGemCountModalVisible: true,
        gemsConsumption: {
          successCallback: () => {
            consumeCall();
          },
          failureCallback: () => {
            console.log(" failed ");
          },
          count: exactPlan.price
        }
      });
    } else {
      // this.openCloserModal();
      console.log(" exact plan is ", exactPlan);
      this.setState({
        isNewCloserModalVisible: true,

        isStepBackModalVisible: true,
        buyPower: {
          colors: gemPlanColors["MoreProfiles"],
          powerName: exactPlan.key,
          successCallback: selectedGemsCount => {
            purchaseCall(selectedGemsCount);
          },
          failureCallback: () => {
            console.log(" user didnt buy ");
          },
          cost: exactPlan.price
        }
      });
    }
  };
  onTappingTutorialReactButton = () => {
    this.setState({ showTapTutorial: false }, () => {
      this.openFirstProfileCard();
    });
  };
  renderBuyPowerModal = () => {
    const { buyPower } = this.state;
    const { currentProfileIndex, thirtyProfiles, myData } = this.props;
    const activeProfile = thirtyProfiles && thirtyProfiles[currentProfileIndex];

    return (
      <BuyModal
        powerName={"Step Back"}
        colors={gemPlanColors.StepBack}
        {...buyPower}
        hasOffers={buyPower.hasOffers || false}
        subHeader={`Don't lose ${activeProfile && activeProfile.name}`}
        goBack={(confirmed, selectedGemCount) => {
          const newGemsCount = myData.gems_count + selectedGemCount;
          console.log(" confirmed value is ", confirmed, newGemsCount);
          if (confirmed) {
            if (buyPower.afterPurchase) {
              // buyPower.afterPurchase(newGemsCount);
              if (newGemsCount >= buyPower.requiredTotalGems) {
                buyPower.afterPurchase(newGemsCount);
              } else {
                return this.setState({
                  // isStepBackModalVisible: false,
                  isNewCloserModalVisible: false
                });
              }
            }
            buyPower.successCallback(selectedGemCount);
          } else {
            buyPower.failureCallback();
          }
          this.setState({
            isNewCloserModalVisible: false

            // isStepBackModalVisible: false
          });
          // this.closeCloserModal();
        }}
        showOffersModal={() => {
          // this.closeCloserModal();
          this.setState(
            {
              // isNewCloserModalVisible:false,

              isStepBackModalVisible: false
            },
            () => {
              setTimeout(() => {
                this.setState({
                  isBundlePurchaseModalVisible: true
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
  renders() {
    return (
      <MaskedView
        style={{ flex: 1, flexDirection: "row", height: "100%" }}
        maskElement={
          <View
            style={{
              // Transparent background because mask is based off alpha channel.
              backgroundColor: "transparent",
              flex: 1,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <MediumText
              style={{
                fontSize: 60,
                color: "black",
                fontWeight: "bold"
              }}
            >
              Basic Mask
            </MediumText>
          </View>
        }
      >
        {/* Shows behind the mask, you can put anything here, such as an image */}
        <View style={{ flex: 1, height: "100%", backgroundColor: "#324376" }} />
        <View style={{ flex: 1, height: "100%", backgroundColor: "#F5DD90" }} />
        <View style={{ flex: 1, height: "100%", backgroundColor: "#F76C5E" }} />
        <View style={{ flex: 1, height: "100%", backgroundColor: "#fff" }} />
      </MaskedView>
    );
  }
  renderGemsCount = () => (
    // <View/>
    <GemsAcknowledgement
      show={this.showGemsAcknowledgement}
      fromCount={this.gemsFromCount}
      toCount={this.gemsToCount}
    />
  );

  renderStepBackNotAvailableModal = () => {
    const { isStepbackNotAvailableModal } = this.state;
    return (
      <StepBackModal
        isPrevAnyAvailable={isStepbackNotAvailableModal.notAvailableAny}
        close={confirmed => {
          if (confirmed) {
            isStepbackNotAvailableModal.successCallback();
          } else {
          }
          this.setState({
            isNewCloserModalVisible: false
          });
        }}
      />
    );
  };

  renderNewCloserModal = () => {
    const {
      isNewCloserModalVisible,
      isStepBackModalVisible,
      isBundlePurchaseModalVisible,
      isStepbackNotAvailableModalVisible
    } = this.state;
    return (
      <View style={{ zIndex: 1000 }}>
        <NewCloserModal inSecondLevel={true} visible={isNewCloserModalVisible}>
          {isStepBackModalVisible && this.renderBuyPowerModal()}
          {isBundlePurchaseModalVisible && this.renderBulkPurchseModal()}
          {isStepbackNotAvailableModalVisible &&
            this.renderStepBackNotAvailableModal()}
        </NewCloserModal>
      </View>
    );
  };
  render() {
    const {
      thirtyProfiles,
      hasMore,
      myData,
      navigation,
      locationPermissionGranted,
      currentProfileIndex
    } = this.props;
    const {
      notificationText,
      notificationTitle,
      notificationImage,
      notificationRoomId,
      openChatWindow,
      showName,
      showTapTutorial,
      hideBottomNavBar,
      reactButtonPosition,
      showLottieSearch,
      showCardsCarousal,
      showProfileCardsTutorial,
      position,
      isGetMoreProfiesAllowed,
      showLastCard,
      showProfileCardsOverReactButton
    } = this.state;
    const isInSnoozeMode = myData.private && myData.private === true;
    return (
      <>
        {this.renderNewCloserModal()}
        {this.renderGemsCount()}
        {showProfileCardsOverReactButton ? (
          <ProfileCardsOverReactButton
            activeProfile={thirtyProfiles[currentProfileIndex]}
            close={() => {
              this.setState({ showProfileCardsOverReactButton: false });
              this.sendResponses();
            }}
            navigateToChat={() => {
              this.setState({ showProfileCardsOverReactButton: false });
              this.props.navigation.push("chatFavourites");
            }}
            openResponseScreen={this.openResponseScreen}
          />
        ) : (
          <View />
        )}
        {showTapTutorial ? (
          <SurfingScreenTap
            setTapTutorialVisibility={() => {
              this.setState({ showTapTutorial: false });
            }}
            onTappingTutorialReactButton={this.onTappingTutorialReactButton}
            reactButtonPosition={reactButtonPosition}
          />
        ) : (
          <View />
        )}
        <InstagramLogin
          ref={ref => (this.instagramLogin = ref)}
          clientId={INSTAGRAM_KEY}
          redirectUrl="https://vamshi9666.github.io"
          scopes={["basic"]}
          onLoginSuccess={token => {
            console.log(" insta token is ", token);
            this.onInstaLogin(token);
          }}
          onLoginFailure={data => console.log(data)}
        />
        <StatusBar barStyle={"dark-content"} hidden={false} />
        {isInSnoozeMode ? (
          <SnoozeModeCard />
        ) : showLottieSearch ? (
          <LottieSearch />
        ) : locationPermissionGranted === false ? (
          <View
            style={{
              alignSelf: "center",
              alignItems: "center",
              justifyContent: "center",
              flex: 1
            }}
          >
            <AnimatableView duration={2000} animation={"bounce"}>
              <EntypoIcon size={80} color={PURPLE} name={"location-pin"} />
            </AnimatableView>
            <MediumText
              style={{
                textAlign: "center",
                paddingHorizontal: LEFT_MARGIN * 2,
                fontSize: 16,
                color: FONT_BLACK
              }}
            >
              In order for this to work you need to turn on your location.
            </MediumText>

            <NoFeedbackTapView
              onPress={() => {
                storeData("LOCATION_PERMISSION", "true");
                Linking.openURL("app-settings:")
                  .then(res => {
                    console.log(" res is ", res);
                  })
                  .catch(err => {
                    console.log(" err is ", err);
                  });
              }}
              style={{
                height: 50,
                width: DeviceWidth * 0.9,
                borderRadius: 30,
                alignSelf: "center",
                ...sharedStyles.justifiedCenter,
                marginTop: 20
              }}
            >
              <VerticalGradientView
                style={{
                  height: 50,
                  width: DeviceWidth * 0.9,
                  borderRadius: 30,
                  alignSelf: "center",
                  ...sharedStyles.justifiedCenter
                }}
                colors={[PURPLE, LIGHT_PURPLE]}
              >
                <MediumText
                  style={{
                    color: "#fff",
                    textAlign: "center",
                    fontSize: 17,
                    paddingVertical: 12
                  }}
                >
                  Enable Location
                </MediumText>
              </VerticalGradientView>
            </NoFeedbackTapView>
          </View>
        ) : showCardsCarousal || true ? (
          <>
            <ProfilesList
              showNotAvailableModal={() => {
                this.setState({
                  isNewCloserModalVisible: true,
                  isStepbackNotAvailableModalVisible: true,
                  isStepbackNotAvailableModal: {
                    notAvailableAny: true,
                    successCallback: () => {
                      alert(" set now");
                    }
                  }
                });
              }}
              onItemSnapped={(newIndex, continueNextAnimation) => {
                // moveToProfile()
                this.onSnapToItemHandler(newIndex, continueNextAnimation);

                // alert(JSON.stringify(newIndex));
              }}
              othersProfileNav={this.othersProfileNav}
              setReactButtonPosition={this.setReactButtonPosition}
              onSparkTapped={this.onSparkTapped}
              openSparkConfirmation={this.openSparkConfirmation}
              openFirstProfileCard={this.openFirstProfileCard}
              showOneTimeTutorial={this.showOneTimeMonetisationTutorial}
              fetchRoomsData={this.fetchRoomsData}
              openBuyGemsModal={(buyPower, bulkPurchase) => {
                console.log(" bulkPlanitem is ", bulkPurchase);
                this.setState({
                  buyPower,
                  bulkPurchase,
                  isStepBackModalVisible: true,
                  isNewCloserModalVisible: true
                });
                // this.openCloserModal();
              }}
            />
          </>
        ) : (
          <View />
        )}
        <Transitioning.View
          style={{
            flex: 1
            // backgroundColor: "green"
          }}
          ref={this.lastCardRef}
          transition={
            <Transition.Together>
              <Transition.In type={"scale"} durationMs={200} />
            </Transition.Together>
          }
        >
          {showLastCard && (
            <LastCard
              hasMore={hasMore && isGetMoreProfiesAllowed}
              onClick={() => this.getMoreProfiles()}
              buttonText={
                hasMore && isGetMoreProfiesAllowed
                  ? monitizationCard.buttonText
                  : null
              }
            />
          )}
        </Transitioning.View>
        {this.renderOthersProfile()}
        {this.state.showProfileCardsTutorial ? (
          <OthersProfileCards
            showProfileCardsTutorial={showProfileCardsTutorial}
            position={position}
            activeProfile={thirtyProfiles[currentProfileIndex]}
            hideTutorial={() => {
              this.setState({ showProfileCardsTutorial: false });
            }}
          />
        ) : (
          <View />
        )}

        <BottomIcons
          navigation={navigation}
          hideBottomNavBar={hideBottomNavBar}
        />
        {this.renderShadow()}
        {this.renderResponseScreen()}
        {this.renderCloserModal()}
        <Notification
          show={this.state.notificationVisible}
          setModalVisible={val => this.setState({ notificationVisible: val })}
          onTap={() => {
            if (openChatWindow) {
              const {
                openOneRoom,
                setChatIconDot,
                setChatTextDot,
                navigation: { navigate }
              } = this.props;
              setChatIconDot(false);
              setChatTextDot(false);
              openOneRoom(notificationRoomId);
              navigate("chatWindow");
            } else {
              this.props.navigation.push("chatFavourites");
            }
          }}
          height={140}
          userImageUrl={STATIC_URL + notificationImage.split("uploads")[1]}
          notificationTitle={userNamify({ name: notificationTitle, showName })}
          notificationText={notificationText}
        />
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    thirtyProfiles: state.profiles.thirtyProfiles,
    myData: state.info.userInfo,
    currentProfileIndex: state.profiles.currentProfileIndex,
    showChatIconDot: state.notification.showChatIconDot,
    currentResponses: state.nav.currentResponses,
    currentChatScreenIndex: state.nav.currentChatScreenIndex,
    currentScreenIndex: state.nav.currentScreenIndex,
    allRooms: state.rooms.rooms,
    roomsArray: state.rooms.rooms_array,
    newActivity: state.rooms.newActivity,
    allReasons: state.info.reasons,
    packPrices: state.app.packPrices || [],
    hasMore: state.profiles.hasMore,
    expenseTutorials: state.tutorial.expenses,
    userPacks: state.app.userPacks,
    bulkPlans: state.app.bulkPlans,
    tutorials: state.tutorial.expenses,
    adminProps: state.app.adminProps,
    allProfiles: state.profiles.thirtyProfiles,
    profileCreatedAt: state.profiles.createdAt,
    gameNames: state.questions.gameNames,
    profileCardsTutorialSeen: state.tutorial.profileCardsTutorialSeen,
    locationPermissionGranted: state.nav.locationPermissionGranted,
    notificationPermissionGranted: state.nav.notificationPermissionGranted,
    referralCode: state.tutorial.referralCode,
    authState: state.userstate.authState,
    cronState: state.userstate.cronState,
    tutorialStartedAt: state.tutorial.tutorialStartedAt,
    presetContentSeen: state.tutorial.presetContentSeen,
    firebaseNotification: state.nav.firebaseNotification,
    hasGotRequestCron: state.tutorial.hasGotRequestCron,
    hasGotResponseCron: state.tutorial.hasGotResponseCron,
    sentStack: state.rooms.sentStack,
    recievedStack: state.rooms.recievedStack,
    roomsArray: state.rooms.rooms_array,
    adminProps: state.app.adminProps,
    sentRoomsLength: state.rooms.sentRoomsLength,
    receivedRoomsLength: state.rooms.receivedRoomsLength
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setRooms: bindActionCreators(ChatActions.setRooms, dispatch),
    setRoomsArray: bindActionCreators(ChatActions.setRoomsArray, dispatch),
    setThirtyProfiles: bindActionCreators(
      ProfileActions.setThirtyProfiles,
      dispatch
    ),
    setCurrentProfileIndex: bindActionCreators(
      ProfileActions.setCurrentProfileIndex,
      dispatch
    ),
    setCurrentScreenIndex: bindActionCreators(setCurrentScreenIndex, dispatch),
    setChatIconDot: bindActionCreators(setChatIconDot, dispatch),
    setSentTextDot: bindActionCreators(setSentTextDot, dispatch),
    setReceivedTextDot: bindActionCreators(setReceivedTextDot, dispatch),
    setChatTextDot: bindActionCreators(setChatTextDot, dispatch),
    resetResponses: bindActionCreators(resetResponses, dispatch),
    setCardHideStatus: bindActionCreators(
      ProfileActions.setCardHideStatus,
      dispatch
    ),
    setFriendObj: bindActionCreators(ChatActions.setFriendObj, dispatch),
    openOneRoom: bindActionCreators(ChatActions.selectOneRoom, dispatch),
    updateProfile: bindActionCreators(UserActions.updateOwnProfile, dispatch),
    updateInstaPosts: bindActionCreators(UserActions.setInstaPhotos, dispatch),
    setCurrentChatScreenIndex: bindActionCreators(
      setCurrentChatScreenIndex,
      dispatch
    ),
    setNewActivity: bindActionCreators(ChatActions.setNewActivity, dispatch),
    removeOneBlockedUserFromProfiles: bindActionCreators(
      UserActions.removeUserFromProfiles,
      dispatch
    ),
    resetUnreadMessagesCount: bindActionCreators(
      ChatActions.resetUnreadMessageCount,
      dispatch
    ),
    clearOneRoomMessages: bindActionCreators(
      ChatActions.clearOneRoomMessages,
      dispatch
    ),
    openOneRoom: bindActionCreators(ChatActions.selectOneRoom, dispatch),
    setHasMore: bindActionCreators(ProfileActions.setHasMore, dispatch),
    setExpenseTutorial: bindActionCreators(addExpenseTutorialCount, dispatch),
    addSparkToProfile: bindActionCreators(
      ProfileActions.sendSparkToProfile,
      dispatch
    ),
    setPackPrices: bindActionCreators(setPackPrices, dispatch),
    incrimentExpenseTutorial: bindActionCreators(
      addExpenseTutorialCount,
      dispatch
    ),
    setUserPacks: bindActionCreators(setUserPacks, dispatch),
    openFirstCardDirectly: bindActionCreators(openFirstCardDirectly, dispatch),
    appendNewProfiles: bindActionCreators(
      ProfileActions.appendMoreProfiles,
      dispatch
    ),
    setCreatedAt: bindActionCreators(ProfileActions.setCreatedAt, dispatch),
    addNewRespone: bindActionCreators(addNewResponse, dispatch),
    setNotificationPermission: bindActionCreators(
      setNotificationPermission,
      dispatch
    ),
    setQuestionCardVisibility: bindActionCreators(
      setQuestionCardVisibility,
      dispatch
    ),
    setQuestionCardTutorialVisibility: bindActionCreators(
      setQuestionCardTutorialVisibility,
      dispatch
    ),
    setProfileCardsTutorialVisibility: bindActionCreators(
      setProfileCardsTutorialVisibility,
      dispatch
    ),
    setReactButtonTutorialVisibility: bindActionCreators(
      setReactButtonTutorialVisibility,
      dispatch
    ),
    setLocationPermission: bindActionCreators(setLocationPermission, dispatch),
    setUserState: bindActionCreators(setUserState, dispatch),
    setCronState: bindActionCreators(setCronState, dispatch),
    setTutorialStartingTime: bindActionCreators(
      setTutorialStartingTime,
      dispatch
    ),
    setPresetContentModalVisibility: bindActionCreators(
      setPresetContentModalVisibility,
      dispatch
    ),
    setFirebaseNotification: bindActionCreators(
      setFirebaseNotification,
      dispatch
    ),
    setChatIconDot: bindActionCreators(setChatIconDot, dispatch),
    setRequestCron: bindActionCreators(setRequestCron, dispatch),
    setResponseCron: bindActionCreators(setResponseCron, dispatch),
    setTopNavTabTutorials: bindActionCreators(setTopNavTabTutorials, dispatch),
    setHasSeenReactOnTheseCardsTutorial: bindActionCreators(
      setHasSeenReactOnTheseCardsTutorial,
      dispatch
    )
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LandingNew);
