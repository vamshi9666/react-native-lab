import MaskedView from "@react-native-community/masked-view";
import Lodash from "lodash";
import React, { Component } from "react";
import {
  Keyboard,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  View
} from "react-native";
import {
  createAnimatableComponent,
  View as AnimatableView
} from "react-native-animatable";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { CachedImage } from "react-native-img-cache";
import InstagramLogin from "react-native-instagram-login";
import LinearGradient from "react-native-linear-gradient";
import RazorpayCheckout from "react-native-razorpay";
import Animated from "react-native-reanimated";
import { onScroll } from "react-native-redash";
import SvgUri from "react-native-svg-uri";
import TouchableScale from "react-native-touchable-scale";
import AntIcon from "react-native-vector-icons/AntDesign";
import {
  default as FontAwesomeIcon,
  default as Icon
} from "react-native-vector-icons/FontAwesome";
import Ionicon from "react-native-vector-icons/Ionicons";
import MatIcon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";
import BottomSheet from "reanimated-bottom-sheet";
import { bindActionCreators } from "redux";
import GiphyPicker from "../../components/ChatWindow/Giphy.picker";
import BulkPurchaseModal from "../../components/Common/BulkPurchaseModal";
import GameContainer from "../../components/Common/Game.container";
import NewCloserModal from "../../components/Common/NewCloserModal";
import Notification from "../../components/Common/Notification";
import BuygemsModal from "../../components/Gemsflow/Buygems";
import BuyPackModal from "../../components/Gemsflow/BuyModal";
import GemCountModal from "../../components/Gemsflow/GemCountModal";
import EditImageGrid from "../../components/MyProfile/EditImage.grid";
import EmptyInstaPlaceHolders from "../../components/MyProfile/EmptyInstaPlaceHolders";
import InstaSwiper from "../../components/MyProfile/Insta.swiper";
import InstaDisconnectConfirmModal from "../../components/MyProfile/InstaDisconnectConfirmModal";
import MyimagesGrid from "../../components/MyProfile/Myimages.grid";
import MyInfoChunks from "../../components/MyProfile/MyInfoChunks";
import MyProfilePreview from "../../components/MyProfile/MyProfile.preview";
import StickyProgressbar from "../../components/MyProfile/Sticky.progressbar";
import UserDetailsFormModal from "../../components/MyProfile/UserDetailsFormModal";
import VerificationStatus from "../../components/MyProfile/Verification.status";
import Response from "../../components/Profile.Modal/Response";
import FavouriteOverridingModal from "../../components/QuestionPicker/FavLimitConfirmationModal";
import GameOverridingModal from "../../components/QuestionPicker/GameOverridingModal";
// import QuestionPicker from "../../components/QuestionPicker/Main.screen";
import RemovedFavModal from "../../components/QuestionPicker/RemovedFavModal";
import ReplaceNonContentGamesModal from "../../components/QuestionPicker/ReplaceNonContentGamesModal";
import BoldText from "../../components/Texts/BoldText";
import MediumText from "../../components/Texts/MediumText";
import RegularText from "../../components/Texts/RegularText";
import OneTimeMonetisationTutorial from "../../components/Tutorials/OneTimeMonetisationTutorial";
import SharePreview from "../../components/Utility/Share.preview";
import CloserModal from "../../components/Views/Closer.modal";
import CurvedBackground from "../../components/Views/Curved.background";
import JustifiedCenteredView from "../../components/Views/JustifiedCenteredView";
import NoFeedbackTapView from "../../components/Views/NoFeedbackTapView";
import RowView from "../../components/Views/RowView";
import VerticalGradientView from "../../components/Views/VerticalGradientView";
import { runRepeatedTiming } from "../../config/Animations";
import { STATIC_URL } from "../../config/Api";
import {
  FONT_BLACK,
  FONT_GREY,
  LIGHT_PURPLE,
  PURPLE
} from "../../config/Colors";
import { DeviceHeight, DeviceWidth } from "../../config/Device";
import { FIELDS_CONFIG } from "../../config/MyProfile.fields";
import { checkNullAndUndefined, namify, userNamify } from "../../config/Utils";
import { getRooms } from "../../network/rooms";
import * as UserApi from "../../network/user";
import {
  scrollQuestionCardsAction,
  setCurrentChatScreenIndex,
  setCurrentScreenIndex,
  setFirebaseNotification
} from "../../redux/actions/nav";
import {
  setChatIconDot,
  setChatTextDot,
  setReceivedTextDot,
  setSentTextDot
} from "../../redux/actions/notification";
import {
  selectOneRoom,
  setFriendObj,
  setNewActivity
} from "../../redux/actions/rooms";
import * as UserActions from "../../redux/actions/user.info";
import { styles } from "../../styles/MyProfile";
import { sharedStyles } from "../../styles/Shared";
import * as constants from "./../../config/Constants";
import Settings from "./Settings";
import VerifyAccount from "./Verify.account";
import CustomTappableScale from "../../components/Common/TouchableScale";
let QuestionPicker;
const {
  Value,
  interpolate,
  Extrapolate,
  concat,
  debug,
  cond,
  block,
  greaterThan,
  lessThan,
  eq
} = Animated;
const AnimatedNoFeedbackTapView = Animated.createAnimatedComponent(
  NoFeedbackTapView
);
const { chunk } = Lodash;
const AnimatedRowView = createAnimatableComponent(RowView);

const initialNotificationObj = {
  notificationText: "",
  notificationTitle: "",
  notificationImage: "",
  notificationRoomId: "",
  openChatWindow: false,
  showName: false
};
class MyProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formModalVisible: false,
      selectedCard: null,
      position: {},
      unFilledFields: [],
      isModalVisible: false,
      isVerifyModalVisible: false,
      showReplaceNonContentGameModal: false,
      isGemsModalVisible: false,
      nonContentGamePostObj: {},
      showBulkPurchaseModal: false,
      shareableContent: {},
      showSharePreview: false,
      showGifPickerModal: false,
      isWellDoneModalVisible: false,
      isVerificationDoneModalVisible: false,
      isVerificationFailedModalVisible: false,
      isPackModalVisible: false,
      toFill: "",
      processedPosts: {},
      translateQuestionPickerModal: new Animated.Value(DeviceHeight),
      showBlackBg: false,
      isGemCountVisible: false,
      postGames: [],
      isInstaConfirmationModalVisible: false,
      isVerified: null,
      hideProfileCards: false,
      showSettingsModal: false,
      isShuffleModalVisible: false,
      imageToBeEdited: 0,
      removedGame: null,
      overridingQuestion: null,
      isRemoveFavModalVisible: false,
      isFavOveridingModalVisible: false,
      replacing: null,
      isReplacingModalVisible: false,
      selectedGame: null,
      bioText: "",
      showKeyBoardAttachedButton: false,
      enabledGestureInteraction: true,
      hideStatusbar: false,
      gemConsumption: null,
      buyGems: {
        successCallback: () => ({}),
        failureCallback: () => ({})
      },
      buyPower: null,
      bulkPurchase: null,
      isBulkPurchaseModalVisible: false,
      showResponseModal: false,
      gameCardTobeShaked: 0,
      isResponseScreenOpened: false,
      notification: initialNotificationObj,
      isNewCloserModalVisible: false,
      showOneTimeMonetisationTutorialSlides: false,
      monetisationTutorialName: "",
      questionPickerNeeded: false
    };
    this.btmRef = React.createRef();
    this._fields_config = FIELDS_CONFIG;
    this.scrollRef = React.createRef();
    this.profileCardRef = React.createRef();
    this.bottomSheetTransY = new Value(0);
    this.giphyPickerRef = React.createRef();
    this.profilePreviewRef = React.createRef();

    this.cards = [0, 1, 2].map(() => React.createRef());
    this.scrollY = new Value(0);
    this.stickyHeaderAnimState = new Value(0);
  }

  componentDidMount = () => {
    const { navigation, makeReady } = this.props;
    const { params } = navigation.state;
    if (params) {
      const { scrollTillCards = false } = params;
      if (scrollTillCards) {
        setTimeout(() => {
          this.scrollRef.scrollTo({ y: DeviceHeight * 0.5 });
          // setTimeout(() => {
          //   this.setState({ gameCardTobeShaked: 0 }, () => {
          //     this.view.tada(300).then(endState => {});
          //     setTimeout(() => {
          //       this.setState({ gameCardTobeShaked: 1 }, () => {
          //         this.view.tada(300).then(endState => {});
          //       });
          //     }, 150);
          //   });
          // }, 1000);
        }, 1000);
      }
    }
    console.log(" params after push are ", params);
    setTimeout(() => {
      this.setState({ showFullOpacityPatchWork: true });
    }, 1000);
  };

  modalUpdateProfile = async obj => {
    console.log("coming here 2", obj);
    UserApi.updateProfile(obj, updateResponse => {
      if (updateResponse.success) {
        console.log(" tobe udpated values area ", updateResponse);
        this.props.updateProfile(updateResponse.data);
        this.onInit();
      } else {
        alert(" error in updating user");
      }
    });
  };

  onInit = async () => {
    await this.listenToKeyboardEvents();
  };

  fetchMyData = async () => {
    this.props
      .getMyData()
      .then(() => {
        const { myDataResponse } = this.props;
        console.log("userInfo 0 is: ", myDataResponse.data);
        if (myDataResponse.success) {
          const { data } = myDataResponse;
          const { _fields_config } = this;
          let _unFilledFields = [];
          Object.keys(_fields_config).forEach(chunkName => {
            _fields_config[chunkName]["children"].forEach(
              ({ data_key, index }) => {
                console.log(
                  "each in unfilled check ",
                  data[data_key],
                  data_key
                );
                if (data[data_key] === null || data[data_key] === undefined) {
                  _unFilledFields.push(index);
                }
              }
            );
          });
          console.log(" unfilled fields result is ", _unFilledFields);
          // this.setState({ unFilledFields: _unFilledFields });
          this.setState({
            userInfo: data,
            unFilledFields: _unFilledFields
          });
        } else {
          console.log(" server message ", myDataResponse.message);
        }
      })
      .catch(err => {
        console.log("Error while fetching my data: ", err);
      });
  };

  listenToKeyboardEvents = () => {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );
  };

  handleInstaLogin = token => {
    UserApi.updateProfile(
      {
        insta_token: token
      },
      data => {
        console.log("updated user instgram reponse ");

        this.props.addUserInfo("insta_token", token);
      }
    );
  };
  fetchRoomsData = async () => {
    const { setRooms, setRoomsArray } = this.props;
    getRooms(cbRooms => {
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
  //notification

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
      }
    }
  };
  closeLightBoxModal = () => {
    this.setState({ showResponseModal: false });
  };

  handleViewRef = ref => (this.view = ref);

  onClose = () => {
    console.log("onclose is called now");

    this.setState({ selectedCard: null });
  };

  _renderGameCards = (item, index) => {
    const { myPosts } = this.props;
    const { gameCardTobeShaked, selectedCard } = this.state;

    if (
      !Lodash.isEmpty(myPosts) &&
      !Lodash.isEmpty(myPosts[item]) &&
      myPosts[item].length > 0
    ) {
      const { colors, key, value } = myPosts[item][0].questionId.gameId;
      return (
        <View key={index}>
          <TouchableScale
            activeScale={0.96}
            defaultScale={1}
            tension={300}
            friction={10}
            onPress={async () => {
              const position = await this.cards[index].current.measure();
              this.setState({
                selectedCard: item,
                position,
                selectedGame: item,
                selectedGameIndex: index
              });
            }}
            style={{
              shadowRadius: 5,
              shadowColor: "#000000f1",
              shadowOffset: {
                width: 0,
                height: 5
              },
              shadowOpacity: 0.1,
              opacity: selectedCard === item ? 0 : 1,
              marginLeft: index === 0 ? constants.LEFT_MARGIN : 0
            }}
          >
            <GameContainer
              ref={this.cards[index]}
              height={DeviceWidth * 0.5}
              width={DeviceWidth * 0.37}
              colors={colors}
              fromMyProfile={true}
              gameName={key}
              gameValue={value}
            />
            {gameCardTobeShaked === index ? (
              <AnimatableView ref={this.handleViewRef}>
                <TouchableScale
                  activeScale={0.96}
                  defaultScale={1}
                  tension={300}
                  friction={10}
                  onPress={() => {
                    if (QuestionPicker == null) {
                      QuestionPicker = require("../../components/QuestionPicker/Main.screen")
                        .default;
                    }
                    this.setState(() => ({
                      questionPickerNeeded: true
                    }));
                    this.toggleQuestionPicker(true, value, index);

                    // this.props.scrollQuestionCardsAction(value);
                    // setTimeout(() => {
                    //   this.toggleQuestionPicker(true, value, index);
                    // }, 250);
                  }}
                  style={styles.editPostIcon}
                >
                  <Ionicon name={"md-create"} size={25} color={colors[1]} />
                </TouchableScale>
              </AnimatableView>
            ) : (
              <TouchableScale
                activeScale={0.96}
                defaultScale={1}
                tension={300}
                friction={10}
                onPress={() => {
                  this.props.scrollQuestionCardsAction(value);
                  setTimeout(() => {
                    this.toggleQuestionPicker(true, value, index);
                  }, 250);
                }}
                style={styles.editPostIcon}
              >
                <Ionicon name={"md-create"} size={25} color={colors[1]} />
              </TouchableScale>
            )}
          </TouchableScale>
        </View>
      );
    } else {
      return <View key={index} />;
    }
  };

  changeSelectedGame = selectedGameIndex => {
    let { myPosts } = this.props;

    this.setState({
      selectedGame: Object.keys(myPosts)[selectedGameIndex],
      selectedGameIndex
    });
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

  toggleGifPicker = () => {
    this.setState({ showGifPickerModal: true, isModalVisible: true });
    this.openCloserModal();
  };

  closeGiphyPicker = () => {
    this.setState({ showGifPickerModal: false });
    this.closeCloserModal();
  };

  openCloseQuestionPicker = (newgameName, newgamePosition) => {
    this.setState({ gameCardTobeShaked: newgamePosition }, () => {
      this.btmRef.snapTo(0);
      setTimeout(() => {
        this.profileCardRef.scrollTo({
          x: newgamePosition * DeviceWidth * 0.25,
          animated: true
        });
        setTimeout(() => {
          this.view.tada(500).then(endState => {
            this.toggleQuestionPicker(true, newgameName, newgamePosition);
          });
        }, 300);
      }, 300);
    });
  };

  closeAndScrollToEdit = () => {
    this.profilePreviewRef.snapTo(0);
    setTimeout(() => {
      this.scrollRef.scrollTo({ y: DeviceHeight * 1.3 });
    }, 200);
  };

  setResponseScreenOpenState = isResponseScreenOpened => {
    this.setState({ isResponseScreenOpened });
  };

  renderProfilePreview = () => {
    const { isResponseScreenOpened, hideStatusbar } = this.state;

    return (
      <BottomSheet
        enabledBottomClamp={true}
        ref={ref => (this.profilePreviewRef = ref)}
        snapPoints={[-20, DeviceHeight]}
        callbackNode={this.bottomSheetTransY}
        enabledHeaderGestureInteraction
        enabledContentGestureInteraction={!isResponseScreenOpened}
        onOpenEnd={() =>
          this.setState({
            hideStatusbar: true
          })
        }
        onCloseEnd={() => this.setState({ hideStatusbar: false })}
        renderContent={() => {
          return (
            <MyProfilePreview
              hideOthersProfile={!hideStatusbar}
              closeAndScrollToEdit={this.closeAndScrollToEdit}
              setResponseScreenOpenState={this.setResponseScreenOpenState}
            />
          );
        }}
      />
    );
  };

  enableBottomSheetGesture = enabledGestureInteraction => {
    this.setState({ enabledGestureInteraction });
  };

  renderQuestionPicker = () => {
    const {
      selectedGame,
      enabledGestureInteraction,
      questionPickerNeeded
    } = this.state;

    const { myPosts } = this.props;
    return (
      <BottomSheet
        enabledContentTapInteraction
        enabledInnerScrolling
        enabledGestureInteraction={enabledGestureInteraction}
        enabledBottomClamp={true}
        ref={ref => (this.btmRef = ref)}
        snapPoints={[-20, DeviceHeight]}
        callbackNode={this.bottomSheetTransY}
        enabledHeaderGestureInteraction
        enabledContentGestureInteraction
        onOpenEnd={() => {
          this.props.navigation.setParams({ enableGestures: false });
        }}
        onCloseEnd={() => {
          this.props.navigation.setParams({ enableGestures: true });
        }}
        renderContent={() => <View />}
        renderContentt={() => {
          return (
            <>
              {questionPickerNeeded ? (
                <QuestionPicker
                  openCloseQuestionPicker={this.openCloseQuestionPicker}
                  selectedGameIndex={this.state.selectedGameIndex}
                  toggleGifPicker={this.toggleGifPicker}
                  enableBottomSheetGesture={this.enableBottomSheetGesture}
                  setAnimatedValue={this.state.translateQuestionPickerModal}
                  fromChatWindow={false}
                  showOneTimeTutorial={this.showOneTimeMonetisationTutorial}
                  openBuyGemsModal={({
                    successCallback,
                    failureCallback,
                    count,
                    extraData
                  }) => {
                    const colors = constants.gemPlanColors["MoreContent"];

                    this.setModalConditions("isPackModalVisible", {
                      successCallback,
                      failureCallback,
                      colors,
                      powerName: "More Content",
                      cost: count,
                      extraData
                    });
                  }}
                  openConsumptionModal={props => {
                    this.setState({
                      isModalVisible: true,
                      isGemCountVisible: true,
                      gemConsumption: {
                        count: props.count,
                        successCallback: props.successCallback,
                        failureCallback: props.failureCallback,
                        extraData: props.extraData
                      }
                    });
                    this.openCloserModal();
                  }}
                  toggleQuestionPicker={this.toggleQuestionPicker}
                  selectedGame={selectedGame}
                  onFavExeeced={question => {
                    this.openCloserModal();
                    this.setState({
                      isModalVisible: true,
                      overridingQuestion: question,
                      isFavOveridingModalVisible: true
                    });
                  }}
                  onFavRemoved={gameKey => {
                    this.openCloserModal();
                    this.setState({
                      isModalVisible: true,
                      isRemoveFavModalVisible: true,
                      removedGame: gameKey
                    });
                  }}
                  onReplaceGame={(
                    postObj,
                    oldGame,
                    newGame,
                    fromChatWindow,
                    gameNames,
                    onReplaceComplete
                  ) => {
                    console.log("all gamenames are ", gameNames);

                    this.openCloserModal();
                    this.setState({
                      replacing: {
                        postObj,
                        oldGame,
                        newGame,
                        fromChatWindow,
                        gameNames,
                        onReplaceComplete
                      },
                      isModalVisible: true,
                      isReplacingModalVisible: true
                    });
                  }}
                />
              ) : (
                <View />
              )}
            </>
          );
        }}
      />
    );
  };

  renderBlackBackground = () => {
    let opacity = interpolate(this.bottomSheetTransY, {
      inputRange: [0, 0.5, 1],
      outputRange: [this.state.showFullOpacityPatchWork ? 0.9 : 0, 0.5, 0],
      extrapolate: Extrapolate.CLAMP
    });

    return (
      <Animated.View
        pointerEvents={"none"}
        style={{
          zIndex: 3,
          position: "absolute",
          height: DeviceHeight,
          width: DeviceWidth,
          backgroundColor: "#000",
          opacity,
          ...StyleSheet.absoluteFillObject
        }}
      />
    );
  };

  toggleQuestionPicker = (open, selectedGame = "GUESS_MY_TRAITS", index) => {
    this.setState(
      {
        selectedGame,
        selectedGameIndex: index
      },
      () => {
        console.log(" just set state to ", selectedGame, index);
        this.btmRef.snapTo(open ? 1 : 0);
      }
    );
  };

  renderBotomNavLeft = () => {
    const { shadowLevel } = this.props;
    const { hideProfileCards } = this.state;

    if (hideProfileCards) {
      return <View />;
    } else {
      return (
        <NoFeedbackTapView
          // animation={"rubberBand"}
          // iterationCount="infinite"
          // direction="reverse"
          style={{
            position: "absolute",
            bottom: DeviceHeight * 0.02,
            left: DeviceWidth * 0.05,
            backgroundColor: "#fff",
            borderRadius: 25,
            height: 50,
            width: 50,
            alignItems: "center",
            justifyContent: "center",
            elevation: 2,
            shadowColor: "rgba(0,0,0,0.8)",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.5,
            shadowRadius: 20,
            zIndex: 2,
            paddingLeft: 2
          }}
          onPress={() => {
            this.props.setCurrentScreenIndex(0);

            this.props.navigation.pop();
          }}
          // onPress={() => this.bottomNavScrollHandler("RIGHT", DeviceWidth)}
        >
          <FontAwesomeIcon
            style={{
              marginLeft: -5
            }}
            name={"angle-left"}
            color={PURPLE}
            size={35}
          />
        </NoFeedbackTapView>
      );
    }
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
    }, 3000);
  };

  handleNonContentGameModalClose = isReplaced => {
    console.log(" called one closed or opened", isReplaced);
    this.setState({
      showReplaceNonContentGameModal: false,
      showGifPickerModal: !isReplaced
    });
    if (isReplaced) {
      this.closeCloserModal();
    }
    console.log(
      " called one after operation ",
      this.state.showReplaceNonContentGameModal,
      this.state.showGifPickerModal
    );
  };

  dismissVerifyAccountModal = isSubmitted => {
    this.setState({ isVerifyModalVisible: false });
    this.closeCloserModal();
    if (isSubmitted) {
      setTimeout(() => {
        this.setState({ isWellDoneModalVisible: true, isModalVisible: true });
        this.openCloserModal();
      }, 500);
    }
  };
  disconnectInsta = () => {
    UserApi.disconnectInstagram(cbDisconnected => {
      if (cbDisconnected.success) {
        UserApi.updateProfile(
          {
            insta_token: null
          },
          udpateResult => {
            if (udpateResult.success) {
              this.props.updateInstaPosts([]);
              this.props.updateProfile({
                insta_token: null
              });
              this.setState({
                isInstaConfirmationModalVisible: false
              });
              this.closeCloserModal();
            }
          }
        );
      } else {
        alert("Unable to disconnect");
      }
    });
  };

  hideInstaDisconnectModal = () => {
    this.setState({
      isInstaConfirmationModalVisible: false
    });
    this.closeCloserModal();
  };
  dismissBuyGemsModal = success => {
    const { buyGems } = this.state;
    this.setState({ isNewCloserModalVisible: false });
    if (buyGems) {
      if (success) {
        buyGems.successCallback();
      } else {
        buyGems.failureCallback();
      }
    }
    // this.closeCloserModal();
    // setTimeout(() => {
    // }, 200);
  };
  openInstaConfirmation = () => {
    this.setState({
      isInstaConfirmationModalVisible: true,
      isModalVisible: true
    });
    this.openCloserModal();
  };

  storeUploadResponse = isVerified => {
    if (this.state.isWellDoneModalVisible) {
      this.setState({ isVerified });
    } else {
      this.declareVerificationStatus(isVerified);
    }
  };

  declareVerificationStatus = isVerified => {
    let updates = { isModalVisible: true };
    if (isVerified) {
      this.props.updateProfile({
        account_verification: constants.UserAccountVerificationStatus.DONE
      });
      updates = { isVerificationDoneModalVisible: true };
      // this.setState({ isVerificationDoneModalVisible: true });
      this.openCloserModal();
    } else {
      updates = { isVerificationFailedModalVisible: true };
      // this.setState({ isVerificationFailedModalVisible: true });
      this.openCloserModal();
    }
    this.setState({ isVerified: null, ...updates });
  };

  dismissWellDoneModal = () => {
    const { isVerified } = this.state;
    this.setState({ isWellDoneModalVisible: false });
    this.closeCloserModal();
    if (isVerified === null) {
      return;
    } else {
      setTimeout(() => {
        this.declareVerificationStatus(isVerified);
      }, 1000);
    }
  };

  dismissSettingsModal = () => {
    this.setState({
      showSettingsModal: false,
      hideProfileCards: false
    });
  };

  dismissEditImageModal = () => {
    this.setState({ isShuffleModalVisible: false });
    this.closeCloserModal();
  };

  openShuffleUI = imageToBeEdited => {
    this.setState({ isShuffleModalVisible: true, imageToBeEdited });
  };

  onScrollHandler = evt => {
    let currentOffset = evt.nativeEvent.contentOffset.y;
    if (currentOffset > DeviceHeight * 0.5) {
      this.setState({ hideStatusbar: true });
    } else {
      this.setState({ hideStatusbar: false });
    }
  };

  scrollToCards = () => {
    this.scrollRef.scrollTo({ y: DeviceHeight * 0.55, animated: true });
  };

  calculatePercentage = () => {
    const { myData } = this.props;
    let percentage = 22; // PROFILE CARDS 20 + GENDER 2
    if (myData) {
      const {
        images,
        insta_images,
        bio,
        jobTitle,
        organization,
        education,
        graduatedYear,
        zodiac,
        education_level,
        living_in,
        native_place,
        height,
        workout_preference,
        smoking,
        drinking
      } = myData;

      if (images && images.length) {
        percentage = percentage + (images.length / 6) * 20; // IMAGES 20
      }
      if (insta_images && insta_images.length) {
        percentage = percentage + 20; // INSTA 20
      }
      if (bio && bio.length > 0) {
        percentage = percentage + 10; // BIO 10
      }
      if (
        jobTitle &&
        checkNullAndUndefined(jobTitle) &&
        organization &&
        checkNullAndUndefined(organization)
      ) {
        percentage = percentage + 5; // WORK 5
      }
      if (
        education &&
        checkNullAndUndefined(education) &&
        graduatedYear &&
        checkNullAndUndefined(graduatedYear)
      ) {
        percentage = percentage + 5; // EDUCATION 5
      }
      if (zodiac && checkNullAndUndefined(zodiac)) {
        percentage = percentage + 2;
      }
      if (education_level && checkNullAndUndefined(education_level)) {
        percentage = percentage + 2;
      }
      if (living_in && checkNullAndUndefined(living_in)) {
        percentage = percentage + 2;
      }
      if (native_place && checkNullAndUndefined(native_place)) {
        percentage = percentage + 2;
      }

      if (height && checkNullAndUndefined(height)) {
        percentage = percentage + 2.5;
      }
      if (workout_preference && checkNullAndUndefined(workout_preference)) {
        percentage = percentage + 2.5;
      }
      if (smoking && checkNullAndUndefined(smoking)) {
        percentage = percentage + 2.5;
      }
      if (drinking && checkNullAndUndefined(drinking)) {
        percentage = percentage + 2.5;
      }
    }
    return percentage / 100;
  };
  openPackmodal = packValue => {
    const { bulkPlans } = this.props;
    const colors =
      packValue === "EXTENSIONS"
        ? constants.gemPlanColors["Extensions"]
        : constants.gemPlanColors["Sparks"];
    console.log(" imp value is ", packValue === "EXTENSIONS", colors);
    this.setModalConditions("isBulkPurchaseModalVisible", {
      successCallback: () => {
        console.log(" iam being called on success");
        this.setState({
          isNewCloserModalVisible: false
        });
      },
      failureCallback: () => {
        console.log(" iam being called on failure");
        this.setState({
          isNewCloserModalVisible: false
        });
      },
      colors,
      bulkItemName: packValue
      // cost: count
    });
    // this.setState({
    //   isBulkPurchaseModalVisible: true,
    //   isNewCloserModalVisible: true,
    //   isGemsModalVisible: false,
    //   bulkPurchase: {
    //     successCallback: () => ({}),
    //     failureCallback: () => ({}),
    //     colors,
    //     bulkItemName: packValue
    //     // cost: count
    //   }
    // });
  };

  closeShareModal = () => {
    this.setState({ showSharePreview: false });
    this.closeCloserModal();
  };

  checkAndVibrate = () => {
    const { myData } = this.props;
    const { vibrationsEnabled = true } = myData;

    if (vibrationsEnabled) {
      Vibration.vibrate(VIBRATION_DURATION);
    }
  };

  componentWillReceiveProps = nextProps => {
    const { shareableContent, userQuestionPost } = nextProps;
    if (shareableContent) {
      if (shareableContent.openIn === "MyProfile") {
        this.setState({
          shareableContent,
          showSharePreview: true,
          isModalVisible: true
        });
        this.openCloserModal();
      }
    }
    if (userQuestionPost) {
      this.setState({
        nonContentGamePostObj: userQuestionPost,
        showReplaceNonContentGameModal: true,
        isModalVisible: true
      });
      this.openCloserModal();
    }
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

      const { postedBy, answeredBy, status } = allRooms[roomId];
      this.checkAndVibrate();
      if (inAppNotificationEnabled) {
        console.log(" type is ", inAppNotificationEnabled);
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

            this.props.setNewActivity(null);
          }
        );
      }
    }
    if (nextProps.firebaseNotification !== null) {
      const { firebaseNotification } = nextProps;
      this.fetchDataAndSetDots(firebaseNotification);
      this.props.setFirebaseNotification(null);
    }
  };
  showInappNotification = () => {
    this.setState(
      {
        notificationVisible: true
      },
      () => {
        console.log(" notification is ", this.state.notificationVisible);
      }
    );
  };

  animation = new Value(100);
  initialValue = new Value(0);
  animatedBackGroundWidth = runRepeatedTiming(
    this.initialValue,
    this.animation,
    2500
  );

  renders() {
    return <View />;
  }
  renderBulkPurchaseModal = () => {
    const { bulkPurchase } = this.state;
    console.log(" new bulkPurchase one is ", bulkPurchase.bulkItemName);
    return (
      <BulkPurchaseModal
        bulkItemName={bulkPurchase.bulkItemName}
        openConsumptionConfirmation={({ count, successCallback }) => {
          this.setState({
            isGemCountVisible: true,
            gemConsumption: {
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
        testProp={() => ({ name: "test" })}
        goBack={success => {
          if (success) {
            bulkPurchase.successCallback();
          } else {
            bulkPurchase.failureCallback();
          }
          // this.setState({
          //   // isBulkPurchaseModalVisible: false,
          //   isNewCloserModalVisible: false
          // });
          // this.closeCloserModal();
        }}
      />
    );
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

  setModalConditions = (modalName, openingModalOptions) => {
    this.setState({
      isPackModalVisible: modalName === "isPackModalVisible",
      buyPower: modalName === "isPackModalVisible" ? openingModalOptions : null,

      isBulkPurchaseModalVisible: modalName === "isBulkPurchaseModalVisible",
      bulkPurchase:
        modalName === "isBulkPurchaseModalVisible" ? openingModalOptions : null,

      isGemsModalVisible: modalName === "isGemsModalVisible",
      buyGems:
        modalName === "isGemsModalVisible"
          ? openingModalOptions
          : {
              successCallback: () => {},
              failureCallback: () => {}
            },
      formModalVisible: modalName === "formModalVisible",

      isNewCloserModalVisible: true
    });
  };
  instaLoginRef = React.createRef();
  renders() {
    return this.renderBotomNavLeft();
  }
  render() {
    const {
      myData,
      navigation,
      myPosts,
      postsOrder,
      contentQuestions,
      scrollTillCards,
      shadowLevel
    } = this.props;
    const {
      isVerifyModalVisible,
      isWellDoneModalVisible,
      isVerificationDoneModalVisible,
      isVerificationFailedModalVisible,
      isModalVisible,
      isGemsModalVisible,
      isGemCountVisible,
      isPackModalVisible,
      isInstaConfirmationModalVisible,
      postGames,
      showSettingsModal,
      isShuffleModalVisible,
      imageToBeEdited,
      formModalVisible,
      unFilledFields,
      toFill,
      showDeleteIcon,
      isRemoveFavModalVisible,
      isFavOveridingModalVisible,
      isReplacingModalVisible,
      showGifPickerModal,
      showReplaceNonContentGameModal,
      nonContentGamePostObj,
      selectedGame,
      selectedGameIndex,
      showBulkPurchaseModal,
      showKeyBoardAttachedButton,
      hideStatusbar,
      gemConsumption,
      buyGems,
      buyPower,
      bulkPurchase,
      isBulkPurchaseModalVisible,
      showSharePreview,
      shareableContent,
      selectedCard,
      position,
      notificationVisible,
      isNewCloserModalVisible,
      showOneTimeMonetisationTutorialSlides,

      monetisationTutorialName,
      questionPickerNeeded,
      notification: {
        notificationText = "",
        notificationTitle = "",
        notificationImage = "",
        notificationRoomId = "",
        openChatWindow = false,
        showName = false
      }
    } = this.state;
    const _isMyInstaImagesFound =
      myData && myData.insta_images && myData.insta_images.length > 0;

    const _isMyImagesFound =
      myData && myData.images && myData.images.length > 0;

    const percentage = this.calculatePercentage();
    const isPrivate = myData.private && myData.private === true;
    return (
      <>
        <InstagramLogin
          ref={ref => (this.instagramLogin = ref)}
          clientId={constants.INSTAGRAM_KEY}
          redirectUrl="https://vamshi9666.github.io"
          scopes={["basic"]}
          onLoginSuccess={token => {
            console.log(" insta token is ", token);
            this.onInstaLogin(token);
          }}
          onLoginFailure={data => console.log(data)}
        />
        {/* {isBulkPurchaseModalVisible && this.renderBulkPurchaseModal()} */}
        <View
          style={{
            zIndex: 10
          }}
        >
          <NewCloserModal visible={isNewCloserModalVisible}>
            {isGemsModalVisible ? (
              <BuygemsModal
                visible={isGemsModalVisible}
                navigation={this.props.navigation}
                successCallback={buyGems.successCallback}
                failureCallback={buyGems.failureCallback}
                goBack={this.dismissBuyGemsModal}
              />
            ) : isBulkPurchaseModalVisible ? (
              this.renderBulkPurchaseModal()
            ) : isPackModalVisible ? (
              <BuyPackModal
                {...buyPower}
                // powerName={"Extensions"}
                goBack={(confirmed, newGemsCount) => {
                  if (confirmed) {
                    buyPower.successCallback(newGemsCount);
                  } else {
                    buyPower.failureCallback();
                  }
                  this.setState({ isNewCloserModalVisible: false });
                  // this.closeCloserModal();
                }}
              />
            ) : formModalVisible ? (
              <UserDetailsFormModal
                user={myData}
                unFilledFields={unFilledFields}
                updateProfile={this.modalUpdateProfile}
                toFill={toFill}
                showDeleteIcon={showDeleteIcon}
                setModalVisible={() => {
                  this.setState({
                    formModalVisible: false,
                    hideStatusbar: true,
                    isNewCloserModalVisible: false
                    // testPercentage: 0.5
                  });
                  this.stickyHeaderAnimState.setValue(1);
                }}
              />
            ) : (
              <View />
            )}
          </NewCloserModal>
        </View>
        <View
          style={{
            flex: 1
          }}
        >
          <StickyProgressbar
            percentage={percentage}
            animState={this.stickyHeaderAnimState}
            parentScrollY={this.scrollY}
          />

          {this.renderQuestionPicker()}

          {/* {this.renderBlackBackground()} */}
          {this.renderBotomNavLeft()}
          {this.renderProfilePreview()}

          {selectedCard ? (
            <Response
              position={position}
              onClose={this.onClose}
              fromChatWindow={false}
              showTutorial={false}
              fromMyProfile={true}
              selectedGame={selectedGame}
              closeLightBoxModal={this.closeLightBoxModal}
              selectedGameIndex={selectedGameIndex}
              games={myPosts}
              targetUser={myData}
              userName={userNamify(myData)}
              userImage={
                myData &&
                myData.images &&
                myData.images.length > 0 &&
                myData.images[0]
              }
            />
          ) : (
            <View />
          )}

          <StatusBar hidden={true} animated />

          <Settings
            navigation={navigation}
            goBack={this.dismissSettingsModal}
            showSettingsModal={showSettingsModal}
          />
          <CloserModal isModalVisible={isModalVisible} ref={"modalRef"}>
            {isVerifyModalVisible ? (
              <VerifyAccount
                goBack={this.dismissVerifyAccountModal}
                storeUploadResponse={this.storeUploadResponse}
              />
            ) : isWellDoneModalVisible ? (
              <VerificationStatus
                content={"Well Done"}
                Desc={`We have received your verification Request. We’ll let you know when it’s Finished`}
                type={"wellDone"}
                goBack={this.dismissWellDoneModal}
              />
            ) : isPackModalVisible ? (
              <BuyPackModal
                {...buyPower}
                goBack={(confirmed, newGemsCount) => {
                  if (confirmed) {
                    buyPower.successCallback(newGemsCount);
                  } else {
                    buyPower.failureCallback();
                  }
                  this.setState({ isPackModalVisible: false });
                  this.closeCloserModal();
                }}
              />
            ) : isVerificationDoneModalVisible ? (
              <VerificationStatus
                content={"Verification Completed"}
                Desc={`Congratulations! Your photo verification was successful`}
                type={"verified"}
                goBack={this.dismissWellDoneModal}
              />
            ) : isVerificationFailedModalVisible ? (
              <VerificationStatus
                content={"Verification Failed"}
                Desc={`Please try again with proper Image`}
                type={"failed"}
                goBack={this.dismissWellDoneModal}
              />
            ) : isGemCountVisible ? (
              <GemCountModal
                {...gemConsumption}
                goBack={confirmed => {
                  if (confirmed) {
                    if (gemConsumption.successCallback) {
                      gemConsumption.successCallback();
                    }
                    //confirm  fallback
                  } else {
                    if (gemConsumption.failureCallback) {
                      gemConsumption.failureCallback();
                    }

                    //cancel fallback
                  }
                  this.setState({
                    isGemCountVisible: false
                  });
                  this.closeCloserModal();
                }}
              />
            ) : isInstaConfirmationModalVisible ? (
              <View
                style={{
                  alignItems: "center",
                  flex: 1,
                  justifyContent: "center"
                }}
              >
                <InstaDisconnectConfirmModal
                  onOk={this.disconnectInsta}
                  onCancel={this.hideInstaDisconnectModal}
                />
              </View>
            ) : // formModalVisible ? (
            //   <UserDetailsFormModal
            //     user={myData}
            //     unFilledFields={unFilledFields}
            //     updateProfile={this.modalUpdateProfile}
            //     toFill={toFill}
            //     showDeleteIcon={showDeleteIcon}
            //     setModalVisible={() => {
            //       this.setState({
            //         formModalVisible: false,
            //         hideStatusbar: true,
            //         isNewCloserModalVisible: false
            //         // testPercentage: 0.5
            //       });
            //       this.stickyHeaderAnimState.setValue(1);

            //       // this.closeCloserModal();
            //     }}
            //   />
            // ) :
            isRemoveFavModalVisible ? (
              <RemovedFavModal
                game={this.state.removedGame}
                closeModal={() => {
                  this.closeCloserModal();
                  this.setState({
                    isRemoveFavModalVisible: false,
                    removedGame: null
                  });
                }}
              />
            ) : isFavOveridingModalVisible ? (
              <FavouriteOverridingModal
                question={this.state.overridingQuestion}
                closeModal={() => {
                  this.closeCloserModal();
                  this.setState({
                    isFavOveridingModalVisible: false,
                    overridingQuestion: null
                  });
                }}
              />
            ) : isReplacingModalVisible ? (
              <GameOverridingModal
                postObj={this.state.replacing}
                oldGamekey={selectedGame}
                setSelectedGame={gameValue => {
                  this.setState({
                    selectedGame: gameValue
                  });
                }}
                closerQuestionPicker={() => {
                  console.log(" called to close picker ");
                  this.btmRef.snapTo(0);
                  //this.toggleQuestionPicker(false);
                }}
                closeModal={() => {
                  this.closeCloserModal();
                  this.setState({
                    isReplacingModalVisible: false,
                    replacing: null
                  });
                }}
              />
            ) : isBulkPurchaseModalVisible ? (
              <BulkPurchaseModal
                bulkItemName={bulkPurchase.bulkItemName}
                openConsumptionConfirmation={({ count, successCallback }) => {
                  this.setState({
                    isGemCountVisible: true,
                    gemConsumption: {
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
                testProp={() => ({ name: "test" })}
                goBack={() => {
                  this.setState({
                    isBulkPurchaseModalVisible: false
                  });
                  this.closeCloserModal();
                }}
              />
            ) : showGifPickerModal && false ? (
              <GiphyPicker
                selectedGame={selectedGame}
                fromMyProfile={true}
                closeGiphyPicker={this.closeGiphyPicker}
                openReplaceModal={nonContentGamePostObj => {
                  this.setState({
                    showReplaceNonContentGameModal: true,
                    showGifPickerModal: false,
                    nonContentGamePostObj,
                    isModalVisible: true
                  });
                  this.openCloserModal();
                }}
              />
            ) : showReplaceNonContentGameModal ? (
              <ReplaceNonContentGamesModal
                hideModal={this.handleNonContentGameModalClose}
                selectedGame={selectedGame}
                postObj={nonContentGamePostObj}
                closeQuestionPicker={() => {
                  console.log(" called to close picker");
                  this.btmRef.snapTo(0);
                }}
                setSelectedGame={gameValue => {
                  this.btmRef.snapTo(0);
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

          {isShuffleModalVisible ? (
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                zIndex: 3,
                backgroundColor: "rgba(0,0,0,0.7)"
              }}
            >
              <EditImageGrid
                imageToBeEdited={imageToBeEdited}
                dismissModal={this.dismissEditImageModal}
              />
            </View>
          ) : (
            <View />
          )}

          <Animated.ScrollView
            ref={ref => (this.scrollRef = ref)}
            bounces={true}
            onScroll={onScroll({ y: this.scrollY })}
            scrollEventThrottle={1}
            keyboardShouldPersistTaps={"always"}
            // scrollEventThrottle={1}
            showsVerticalScrollIndicator={false}
            // onScroll={this.onScrollHandler}
          >
            <View style={{ height: constants.LEFT_MARGIN }} />
            <CurvedBackground
              radius={20}
              style={{
                paddingHorizontal: 0
              }}
            >
              <View style={styles.topHeaderMainView}>
                <TouchableOpacity
                  disabled
                  onPress={() => {
                    var options = {
                      description: "Credits towards consultation",
                      image: "https://i.imgur.com/3g7nmJC.png",
                      currency: "INR",
                      key: "rzp_test_1DP5mmOlF5G5ag",
                      amount: "5000",
                      name: "Acme Corp",
                      order: "order_DslnoIgkIDL8Zt",
                      prefill: {
                        email: "gaurav.kumar@example.com",
                        contact: "9191919191",
                        name: "Gaurav Kumar"
                      },
                      theme: { color: PURPLE }
                    };
                    RazorpayCheckout.open({ ...options })
                      .then(data => {
                        // handle success
                        alert(`Success: ${data.razorpay_payment_id}`);
                      })
                      .catch(error => {
                        // handle failure
                        alert(`Error: ${error.code} | ${error.description}`);
                      });
                  }}
                  style={styles.topHeaderSubView}
                >
                  <BoldText
                    style={{
                      ...styles.headerText,
                      color: "#000",
                      marginLeft: 10
                    }}
                  >
                    My Profile
                  </BoldText>
                </TouchableOpacity>
                <View style={styles.rightTopIconView}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        hideProfileCards: true,
                        showSettingsModal: true
                      });
                    }}
                    style={styles.settingsIcon}
                  >
                    <View
                      style={{
                        backgroundColor: "#4E586E",
                        height: 32,
                        width: 32,
                        borderRadius: 16
                      }}
                    >
                      <SvgUri
                        height={32}
                        width={32}
                        source={require("../../assets/svgs/MyProfile/settings.svg")}
                      />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.gemView}
                    onPress={() => {
                      console.log(" clicked to open new one");
                      this.setModalConditions("isGemsModalVisible", {
                        successCallback: () => {
                          this.setState({
                            isNewCloserModalVisible: false
                          });
                        },
                        failureCallback: () => {
                          this.setState({
                            isNewCloserModalVisible: false
                          });
                        }
                      });
                    }}
                  >
                    <SvgUri
                      width={20}
                      height={20}
                      source={require("../../assets/svgs/MyProfile/Gem.svg")}
                    />
                    <BoldText style={styles.gemCount}>
                      {myData.gems_count || "0"}
                    </BoldText>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.topCard}>
                <View style={styles.userImageMainView}>
                  <TouchableOpacity
                    onPress={() => {
                      if (isPrivate) {
                        alert(" you cant edit in private mode");
                        return;
                      }
                      this.scrollRef.scrollTo({ y: DeviceHeight * 1.3 });
                    }}
                    style={styles.userImageView}
                  >
                    <MatIcon name="edit" color={"#4E586E"} size={20} />
                  </TouchableOpacity>
                  {myData.images && myData.images.length > 0 && (
                    <TouchableOpacity
                      onPress={() => {
                        if (isPrivate) {
                          alert(" you cant edit in private mode");
                          return;
                        }

                        this.profilePreviewRef.snapTo(1);
                      }}
                      style={{
                        ...styles.userImage,
                        borderWidth: 4,
                        borderColor: "#fff",
                        shadowColor: "rgba(0,0,0,0.8)",
                        shadowOffset: { width: 0, height: 3 },
                        shadowOpacity: 0.2,
                        shadowRadius: 5,
                        alignItems: "center",
                        borderRadius: 22.5
                      }}
                    >
                      <CachedImage
                        style={styles.userImage}
                        source={{
                          uri: STATIC_URL + myData.images[0].split("uploads")[1]
                        }}
                      />
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.ProgressBarViewStack}>
                  <MediumText style={styles.nameText}>
                    {myData && myData.name && namify(myData.name)}
                  </MediumText>
                  <View style={styles.placeTextView}>
                    <Icon name="map-marker" color={"blue"} size={15} />
                    <RegularText style={styles.placeText}>
                      Hyderabad
                    </RegularText>
                  </View>
                  {percentage === 1 ? (
                    <View />
                  ) : (
                    <>
                      <RowView
                        style={{
                          alignSelf: "center",
                          alignItems: "center"
                        }}
                      >
                        <View
                          style={{
                            height: 10,
                            width: DeviceWidth * 0.6,
                            backgroundColor: "rgb(242,242,242)",
                            borderRadius: 20,
                            marginRight: 15
                          }}
                        >
                          <VerticalGradientView
                            colors={[LIGHT_PURPLE, PURPLE]}
                            style={{
                              height: 10,
                              width: DeviceWidth * 0.6 * percentage,
                              borderRadius: 20
                            }}
                          />
                        </View>
                        <RegularText
                          style={{
                            color: PURPLE,
                            fontSize: 14,
                            marginLeft: 0
                          }}
                        >
                          {(percentage * 100).toFixed(0)}%
                        </RegularText>
                      </RowView>
                      <RegularText style={styles.completeProfileText}>
                        Complete your profile for better {"\n"} responses from
                        other people
                      </RegularText>
                    </>
                  )}
                </View>
              </View>

              {percentage === 1 ? (
                <View />
              ) : (
                <View style={{ marginBottom: 15 }}>
                  <MediumText
                    style={{
                      ...styles.completeProfileText,
                      color: FONT_BLACK,
                      marginTop: 30,
                      marginBottom: 20
                    }}
                  >
                    Get Exclusive Offers
                  </MediumText>
                  <RowView
                    style={{
                      width: DeviceWidth * 0.8,
                      justifyContent: "space-evenly"
                    }}
                  >
                    <NoFeedbackTapView
                      onPress={() => this.openPackmodal("EXTENSIONS")}
                    >
                      <JustifiedCenteredView
                        style={{
                          marginTop: 5
                        }}
                      >
                        <View
                          style={{
                            height: 55,
                            width: 55,
                            shadowRadius: 10,
                            shadowColor: "#000000d1",
                            shadowOffset: {
                              width: 2,
                              height: 10
                            },
                            shadowOpacity: 0.15,
                            backgroundColor: "#fff",
                            borderRadius: 15,
                            ...sharedStyles.justifiedCenter
                          }}
                        >
                          <SvgUri
                            height={25}
                            width={25}
                            source={constants.MONETIZATION_ICONS["EXTENSIONS"]}
                          />
                        </View>
                        <MediumText
                          style={{
                            transform: [{ translateY: 11.5 }],
                            color: "#000",
                            fontSize: 12
                          }}
                        >
                          24 Hours Extensions
                        </MediumText>
                      </JustifiedCenteredView>
                    </NoFeedbackTapView>

                    <NoFeedbackTapView
                      onPress={() => this.openPackmodal("SPARK")}
                    >
                      <JustifiedCenteredView
                        style={{
                          marginTop: 5
                        }}
                      >
                        <View
                          style={{
                            height: 55,
                            width: 55,
                            shadowRadius: 10,
                            shadowColor: "#000000d1",
                            shadowOffset: {
                              width: 2,
                              height: 10
                            },
                            shadowOpacity: 0.15,
                            backgroundColor: "#fff",
                            borderRadius: 15,
                            ...sharedStyles.justifiedCenter
                          }}
                        >
                          <SvgUri
                            height={30}
                            width={30}
                            source={constants.MONETIZATION_ICONS["SPARK"]}
                          />
                        </View>
                        <MediumText
                          style={{
                            transform: [{ translateY: 11.5 }],
                            color: "#000",
                            fontSize: 12
                          }}
                        >
                          Sparks
                        </MediumText>
                      </JustifiedCenteredView>
                    </NoFeedbackTapView>
                  </RowView>
                </View>
              )}
            </CurvedBackground>
            <CurvedBackground
              radius={20}
              style={{
                width: DeviceWidth * 0.9,
                paddingHorizontal: 0,
                paddingBottom: DeviceWidth * 0.06
              }}
            >
              <View
                style={{
                  marginTop: 0
                }}
              >
                <BoldText
                  style={{
                    ...styles.cardsHeaderText,
                    marginLeft: 22.5
                  }}
                >
                  Profile Cards
                </BoldText>
                <ScrollView
                  decelerationRate="fast"
                  ref={ref => (this.profileCardRef = ref)}
                  contentContainerStyle={{
                    width: DeviceWidth * 1.4
                  }}
                  style={{
                    width: DeviceWidth,
                    marginTop: 2.5
                  }}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                >
                  {this.state.hideProfileCards ? (
                    <View />
                  ) : (
                    postsOrder &&
                    postsOrder.length > 0 &&
                    postsOrder.map((gameId, index) => {
                      return this._renderGameCards(gameId, index);
                    })
                  )}
                </ScrollView>
                {myData.hasEditedPosts ? (
                  <RegularText
                    style={{
                      ...styles.cardDescText,
                      color: FONT_GREY
                    }}
                  >
                    Make your cards interesting and{"\n"} let other people react
                    to them.
                  </RegularText>
                ) : (
                  <MaskedView
                    style={{
                      width: "100%"
                    }}
                    maskElement={
                      <RegularText
                        style={{
                          ...styles.cardDescText,
                          color: FONT_GREY,
                          fontWeight: "100"
                        }}
                      >
                        Currently displaying preset content...
                      </RegularText>
                    }
                  >
                    <Animated.View
                      style={{
                        width: concat(this.animatedBackGroundWidth, "%"),
                        backgroundColor: FONT_GREY,
                        height: 30
                      }}
                    />
                  </MaskedView>
                )}
              </View>
            </CurvedBackground>
            {percentage === 1 ? (
              <CurvedBackground
                radius={20}
                style={{
                  paddingHorizontal: 0
                }}
              >
                <MediumText
                  style={{
                    ...styles.completeProfileText,
                    color: FONT_BLACK,
                    marginTop: -10,
                    marginBottom: 20
                  }}
                >
                  Get Exclusive Offers
                </MediumText>
                <RowView
                  style={{
                    width: DeviceWidth * 0.8,
                    justifyContent: "space-evenly",
                    marginBottom: 15
                  }}
                >
                  <NoFeedbackTapView
                    onPress={() => this.openPackmodal("EXTENSIONS")}
                  >
                    <JustifiedCenteredView
                      style={{
                        marginTop: 5
                      }}
                    >
                      <View
                        style={{
                          height: 55,
                          width: 55,
                          shadowRadius: 10,
                          shadowColor: "#000000d1",
                          shadowOffset: {
                            width: 2,
                            height: 10
                          },
                          shadowOpacity: 0.15,
                          backgroundColor: "#fff",
                          borderRadius: 15,
                          ...sharedStyles.justifiedCenter
                        }}
                      >
                        <SvgUri
                          height={25}
                          width={25}
                          source={constants.MONETIZATION_ICONS["EXTENSIONS"]}
                        />
                      </View>
                      <MediumText
                        style={{
                          transform: [{ translateY: 11.5 }],
                          color: "#000",
                          fontSize: 12
                        }}
                      >
                        24 Hours Extensions
                      </MediumText>
                    </JustifiedCenteredView>
                  </NoFeedbackTapView>

                  <NoFeedbackTapView
                    onPress={() => this.openPackmodal("SPARK")}
                  >
                    <JustifiedCenteredView
                      style={{
                        marginTop: 5
                      }}
                    >
                      <View
                        style={{
                          height: 55,
                          width: 55,
                          shadowRadius: 10,
                          shadowColor: "#000000d1",
                          shadowOffset: {
                            width: 2,
                            height: 10
                          },
                          shadowOpacity: 0.15,
                          backgroundColor: "#fff",
                          borderRadius: 15,
                          ...sharedStyles.justifiedCenter
                        }}
                      >
                        <SvgUri
                          height={30}
                          width={30}
                          source={constants.MONETIZATION_ICONS["SPARK"]}
                        />
                      </View>
                      <MediumText
                        style={{
                          transform: [{ translateY: 11.5 }],
                          color: "#000",
                          fontSize: 12
                        }}
                      >
                        Sparks
                      </MediumText>
                    </JustifiedCenteredView>
                  </NoFeedbackTapView>
                </RowView>
              </CurvedBackground>
            ) : (
              <View />
            )}
            {_isMyImagesFound ? (
              <CurvedBackground radius={20}>
                <BoldText style={styles.cardsHeaderText}> My Pictures</BoldText>
                <MyimagesGrid
                  data={myData.images}
                  openShuffleUI={this.openShuffleUI}
                />
              </CurvedBackground>
            ) : (
              <View />
            )}

            <CurvedBackground
              radius={20}
              style={{
                paddingHorizontal: 0
              }}
            >
              <View
                style={[
                  styles.instagramView,
                  {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-end"
                  }
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center"
                  }}
                >
                  <SvgUri
                    width={20}
                    height={20}
                    source={require("../../assets/icons/instagram3.svg")}
                  />
                  <Text style={styles.instagramText}>Instagram</Text>
                </View>
                <View
                  style={
                    {
                      // position: "absolute",
                      // right: 0
                    }
                  }
                >
                  {myData.insta_token && (
                    <TouchableWithoutFeedback
                      style={{
                        marginBottom: 4
                        // position: "absolute",
                        // right: 0,
                        // top: 0
                      }}
                      onPress={this.openInstaConfirmation}
                    >
                      <SvgUri
                        width={15}
                        height={15}
                        source={require("../../assets/icons/minus-circle.svg")}
                      />
                    </TouchableWithoutFeedback>
                  )}
                </View>
              </View>
              <View
                style={{
                  marginBottom: 20,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                {_isMyInstaImagesFound ? (
                  <InstaSwiper
                    fromMyProfile={true}
                    allImages={myData.insta_images}
                    data={chunk(myData.insta_images, 6)}
                  />
                ) : (
                  <>
                    <TouchableOpacity
                      style={styles.instaButtonView}
                      onPress={() => {
                        // this.props.instaLoginRef.show();
                        this.instagramLogin.show();
                        // this.instagramLogin.show();
                      }}
                    >
                      <LinearGradient
                        style={styles.instaView}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        colors={["rgb(235,0,195)", "rgb(255,135,0)"]}
                      >
                        <Text style={styles.instaText}>CONNECT INSTAGRAM </Text>
                        <AntIcon
                          name="arrowright"
                          size={20}
                          color={"#ffffff"}
                        />
                      </LinearGradient>
                    </TouchableOpacity>
                    <EmptyInstaPlaceHolders />
                  </>
                )}
              </View>
            </CurvedBackground>
            <CurvedBackground radius={20}>
              <BoldText style={styles.headerText}> About Me</BoldText>
              <View>
                <TextInput
                  style={styles.userInput}
                  onChangeText={text => {
                    this.setState({
                      bioText: text
                    });
                    this.props.updateProfile({ bio: text });
                  }}
                  value={myData.bio}
                  placeholder="Tell them about yourself..."
                  placeholderTextColor={FONT_GREY}
                  multiline={true}
                  editable={!isPrivate}
                  maxLength={300}
                  returnKeyLabel={"SAVE"}
                  returnKeyType={"done"}
                  onSubmitEditing={() => {
                    UserApi.updateProfile(
                      { bio: this.state.bioText },
                      cbUpdatedProfile => {}
                    );
                  }}
                  onEndEditing={() => {
                    this.setState({ showKeyBoardAttachedButton: false });
                  }}
                  onFocus={() => {
                    this.setState({ showKeyBoardAttachedButton: true });
                    this.scrollRef.scrollTo({ y: DeviceHeight * 2.8 });
                  }}
                />
                <MediumText
                  style={{
                    position: "absolute",
                    right: 10,
                    bottom: 10,
                    color: showKeyBoardAttachedButton ? FONT_GREY : "#fff"
                  }}
                >
                  {myData.bio ? 300 - myData.bio.length : 300}
                </MediumText>
              </View>
            </CurvedBackground>
            <MyInfoChunks
              config={this._fields_config}
              onItemTapped={({
                toFill,
                formModalVisible,
                showDeleteIcon,
                hideStatusbar
              }) => {
                this.setModalConditions("formModalVisible");
                this.setState(
                  {
                    toFill,
                    // formModalVisible,
                    showDeleteIcon,
                    hideStatusbar
                    // isNewCloserModalVisible: true
                    // isModalVisible: true
                  },
                  () => {
                    this.stickyHeaderAnimState.setValue(2);
                    // this.openCloserModal();
                  }
                );
              }}
            />

            <View
              style={{
                height: 100
              }}
            />
          </Animated.ScrollView>
        </View>
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
                navigation: { navigate, push }
              } = this.props;
              setChatIconDot(false);
              setChatTextDot(false);
              openOneRoom(notificationRoomId);
              push("chatWindow");
            }
          }}
          height={120}
          userImageUrl={STATIC_URL + notificationImage.split("uploads")[1]}
          notificationTitle={userNamify({ name: notificationTitle, showName })}
          notificationText={notificationText}
        />
      </>
    );
  }
}

const mapState = state => {
  return {
    myData: state.info.userInfo || {},
    myPosts: state.info.posts,
    contentQuestions: state.content.questions,
    instaPhotos: state.info.instaPhotos,
    postsOrder: state.info.userInfo.posts,
    bulkPlans: state.app.bulkPlans,
    shareableContent: state.nav.shareableContent,
    userQuestionPost: state.nav.userQuestionPost,
    newActivity: state.rooms.newActivity,
    allRooms: state.rooms.rooms,
    firebaseNotification: state.nav.firebaseNotification,
    currentChatScreenIndex: state.nav.currentChatScreenIndex,
    allRooms: state.rooms.rooms
  };
};

const mapDispatch = dispatch => {
  return {
    setMyPosts: bindActionCreators(UserActions.setPosts, dispatch),
    updateProfile: bindActionCreators(UserActions.updateOwnProfile, dispatch),
    updateInstaPosts: bindActionCreators(UserActions.setInstaPhotos, dispatch),
    scrollQuestionCardsAction: bindActionCreators(
      scrollQuestionCardsAction,
      dispatch
    ),
    openOneRoom: bindActionCreators(selectOneRoom, dispatch),
    setChatIconDot: bindActionCreators(setChatIconDot, dispatch),
    setChatTextDot: bindActionCreators(setChatTextDot, dispatch),
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
    setCurrentScreenIndex: bindActionCreators(setCurrentScreenIndex, dispatch)
  };
};
export default connect(mapState, mapDispatch)(MyProfile);
