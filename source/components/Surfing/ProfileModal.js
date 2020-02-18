import { connectActionSheet } from "@expo/react-native-action-sheet";
import Lodash from "lodash";
import React, { Component } from "react";
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import Animated from "react-native-reanimated";
import SvgUri from "react-native-svg-uri";
import MaskedView from "@react-native-community/masked-view";
import TouchableScale from "react-native-touchable-scale";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { BRIGHT_RED, FONT_GREY, PURPLE, FONT_BLACK } from "../../config/Colors";
import {
  appConstants,
  CARD_WIDTH,
  IMAGE_HEIGHT,
  LEFT_MARGIN
} from "../../config/Constants";
import { DeviceWidth } from "../../config/Device";
import {
  checkNullAndUndefined,
  userNamify,
  namify,
  getDistanceText
} from "../../config/Utils";
import { getPosts } from "../../network/user";
import * as NavActions from "../../redux/actions/nav";
import * as NotificationActions from "../../redux/actions/notification";
import * as RoomActions from "../../redux/actions/rooms";
import { removeUserFromProfiles } from "../../redux/actions/user.info";
import { sharedStyles } from "../../styles/Shared";
import ConnectYourInstagram from "../Common/ConnectYourInstagram";
import GameContainer from "../Common/Game.container";
import InstaSwiper from "../MyProfile/Insta.swiper";
import BasicInfo from "../Profile.Modal/Basic.info";
import BlockAndReportReasonsModal from "../Profile.Modal/BlockAndReportReasonsModal";
import OtherusersImageGrid from "../Profile.Modal/Otheruser.images.grid";
import BoldText from "../Texts/BoldText";
import MediumText from "../Texts/MediumText";
import RegularText from "../Texts/RegularText";
import CloserModal from "../Views/Closer.modal";
import CurvedBackground from "../Views/Curved.background";
import JustifiedCenteredView from "../Views/JustifiedCenteredView";
import Ionicon from "react-native-vector-icons/Ionicons";
import RowView from "../Views/RowView";
import { runRepeatedTiming } from "../../config/Animations";
const { chunk, round } = Lodash;
const { Value, color } = Animated;

const items = [
  { name: "education_level", iconName: "EDUCATION_LEVEL" },
  { name: "zodiac", iconName: "ZODIAC" },
  { name: "workout_preference", iconName: "WORKOUT_PREFERENCE" },
  { name: "height", iconName: "HEIGHT" },
  { name: "drinking", iconName: "DRINKING" },
  { name: "smoking", iconName: "SMOKING" },
  { name: "gender", iconName: "WOMAN" }
];

class ProfileModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      games: {},
      loadingCards: true,
      responses: [],
      blockReasons: [],
      showBlockReasonModal: false,
      showLightBox: false,
      lightBoxImageIndex: 0,
      selectedGame: {},
      selectedGameIndex: 1,
      isModalVisible: false,
      showBg: false,
      bgOpacity: new Value(0),
      postsLoading: false,
      currentProfilePosts: {}
    };
    this.translatedY = new Animated.Value(0);
    this.cards = [0, 1, 2].map(() => React.createRef());
  }

  storeResponses = (game, questionIndex, option, postId) => {
    console.log(game, questionIndex, option, postId);

    let { responses } = this.state;
    let { activeProfile, fromChatWindow, myData } = this.props;

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

  closeLightBoxModal = () => {
    this.setState({ showResponseModal: false });
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

  componentWillReceiveProps = async nextProps => {
    const {
      openFirstCardDirectly,
      activeProfile,
      questionCardAfterResponseScreenClose,
      showQuestionCardTutorial,
      showProfileCardsTutorial
    } = nextProps;
    if (openFirstCardDirectly) {
      if (
        activeProfile &&
        activeProfile.posts &&
        activeProfile.posts.length > 0
      ) {
        if (openFirstCardDirectly === "one") {
          const position = await this.cards[0].current.measure();
          this.setState({
            postsLoading: true,
            selectedGame: activeProfile.posts[0]
          });
          this.fetchPosts(posts => {
            if (Object.keys(posts)) {
              this.setState(
                {
                  postsLoading: false
                },
                () => {
                  this.props.openResponseScreen(
                    activeProfile.posts[0],
                    position,
                    0,
                    posts
                  );
                }
              );
            }
          });
        } else {
          const position = await this.cards[
            openFirstCardDirectly
          ].current.measure();
          this.setState({
            postsLoading: true,
            selectedGame: activeProfile.posts[openFirstCardDirectly]
          });
          this.fetchPosts(posts => {
            if (Object.keys(posts)) {
              this.setState(
                {
                  postsLoading: false
                },
                () => {
                  this.props.openResponseScreen(
                    activeProfile.posts[openFirstCardDirectly],
                    position,
                    openFirstCardDirectly,
                    posts
                  );
                }
              );
            }
          });
        }
      }
    }
    if (questionCardAfterResponseScreenClose) {
      this.setState({ selectedGame: null });
    }
    if (showQuestionCardTutorial) {
      const position = await this.measure();
      showProfileCardsTutorial(position);
    }
  };

  _renderGameCards = (item, index) => {
    const { gameNames, fromMyProfile } = this.props;
    const { postsLoading, selectedGame } = this.state;

    if (gameNames && gameNames.length > 0) {
      const { colors, key, value } = gameNames.find(game => game._id === item);
      return (
        <TouchableScale
          activeScale={0.96}
          defaultScale={1}
          tension={300}
          friction={10}
          key={index}
          onPress={async () => {
            const position = await this.cards[index].current.measure();
            if (fromMyProfile) {
              this.props.openResponseScreen(item, position, index);
            } else {
              this.setState({
                postsLoading: true,
                selectedGame: item
              });
              this.fetchPosts(posts => {
                if (Object.keys(posts)) {
                  this.setState(
                    {
                      postsLoading: false
                    },
                    () => {
                      this.props.openResponseScreen(
                        item,
                        position,
                        index,
                        posts
                      );
                    }
                  );
                }
              });
            }
          }}
          style={{
            shadowRadius: 5,
            shadowColor: "#000000f1",
            shadowOffset: {
              width: 0,
              height: 5
            },
            shadowOpacity: 0.1,
            opacity: selectedGame === item && !postsLoading ? 0 : 1,
            marginLeft: index === 0 ? LEFT_MARGIN : 0,
            marginRight: LEFT_MARGIN / 3.75
          }}
        >
          <GameContainer
            key={index}
            ref={this.cards[index]}
            height={DeviceWidth * 0.5}
            width={DeviceWidth * 0.37}
            colors={colors}
            gameName={key}
            gameValue={value}
            showLoading={postsLoading && selectedGame === item}
          />
        </TouchableScale>
      );
    } else {
      return (
        <View key={index}>
          <MediumText>User Obj has posts but gameNames length is 0.</MediumText>
        </View>
      );
    }
  };

  connectInstagram = () => {
    const { instagramLoginRef } = this.props;
    instagramLoginRef.show();
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

  cardRef = React.createRef();

  measure = async () =>
    new Promise(resolve =>
      this.cardRef.current.measureInWindow((x, y, width, height) => {
        resolve({ x, y, width, height });
      })
    );

  animation = new Value(100);
  initialValue = new Value(0);
  animatedBackGroundWidth = runRepeatedTiming(
    this.initialValue,
    this.animation,
    2500
  );

  render = () => {
    const {
      showBlockReasonModal,
      blockReasons,
      isModalVisible,
      showBg,
      bgOpacity
    } = this.state;
    let {
      activeProfile,
      currentProfilePosts,
      myData,
      openBlockAndReportsModal,
      hideCardsContent,
      fromChatWindow,
      hasSeenReactOnTheseCardsTutorial
    } = this.props;
    let userName = userNamify(activeProfile);
    let basicInfoItems = [];

    if (checkNullAndUndefined(activeProfile)) {
      items.map((item, itemId) => {
        if (activeProfile[item.name]) {
          if (item.name === "gender") {
            if (activeProfile.showGender) {
              basicInfoItems.push(item);
            }
          } else {
            basicInfoItems.push(item);
          }
        }
      });
    }

    const _isOthersInstaImagesFound =
      activeProfile &&
      activeProfile.insta_images &&
      activeProfile.insta_images.length > 0;

    const _isMyInstaImagesFound =
      myData && myData.insta_images && myData.insta_images.length > 0;

    const _isUserImagesFound =
      activeProfile && activeProfile.images && activeProfile.images.length > 0;

    return (
      <View
        style={{
          width: DeviceWidth,
          backgroundColor: "rgb(242,242,242)"
        }}
      >
        {showBg ? (
          <Animated.View
            style={{
              backgroundColor: color(0, 0, 0, bgOpacity),
              position: "absolute",
              zIndex: 9,
              ...StyleSheet.absoluteFillObject
            }}
          />
        ) : (
          <View />
        )}

        <CloserModal isModalVisible={isModalVisible} ref={"modalRef"}>
          <BlockAndReportReasonsModal
            reasons={blockReasons}
            hideModal={this.closeCloserModal}
            victimId={this.props.activeProfile && this.props.activeProfile._id}
            // closeWhole={() => this.closeCloserModal()}
            onClose={async blockedResponse => {
              console.log(" blocked response is ", blockedResponse);

              console.log(" about to close step 0");
              this.closeCloserModal();
              setTimeout(() => {
                this.props.onClose();
              }, 300);
              setTimeout(async () => {
                Alert.alert(
                  `Reported  ${
                    this.props.activeProfile &&
                    this.props.activeProfile.name &&
                    this.props.activeProfile.showName
                      ? this.props.activeProfile.name[0]
                      : this.props.activeProfile.name
                  } ! `,
                  "You will never come accross this profile again. ",
                  [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                  { cancelable: false }
                );
                await this.props.removeOneBlockedUserFromProfiles(
                  blockedResponse.user
                );
              }, 600);
            }}
          />
        </CloserModal>

        {_isUserImagesFound ? (
          <OtherusersImageGrid images={activeProfile.images} />
        ) : (
          <View />
        )}

        {/* Profile Sparks */}
        {hideCardsContent ? (
          <View />
        ) : (
          <View ref={this.cardRef} style={styles.curvedBackground}>
            {activeProfile && activeProfile.hideProfileCards ? (
              <View>
                <MediumText style={styles.itemHeader}>Profile Cards</MediumText>
                <JustifiedCenteredView style={styles.reactedTextView}>
                  <RegularText
                    style={{
                      ...styles.reactedText,
                      marginTop: fromChatWindow ? -20 : 0,
                      fontSize: fromChatWindow ? 17 : 15
                    }}
                  >
                    You reacted to {userNamify(activeProfile)}
                  </RegularText>
                  {fromChatWindow ? (
                    <View />
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigateToChat();
                      }}
                      style={{
                        height: 35,
                        width: DeviceWidth * 0.25,
                        borderRadius: 30,
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: 1,
                        borderColor: PURPLE,
                        marginVertical: 10
                      }}
                    >
                      <RegularText
                        style={{
                          color: PURPLE,
                          textAlign: "center"
                        }}
                      >
                        View
                      </RegularText>
                    </TouchableOpacity>
                  )}
                </JustifiedCenteredView>
              </View>
            ) : (
              <View
                style={{
                  zIndex: 9999,
                  marginVertical: 10,
                  elevation: 3,
                  flex: 1
                }}
              >
                <MediumText
                  style={{
                    fontSize: 20,
                    color: "#1E2432",
                    marginLeft: DeviceWidth * 0.06,
                    fontWeight: "bold",
                    marginTop: -12,
                    marginBottom: 2
                  }}
                >
                  Profile Cards
                </MediumText>
                {activeProfile &&
                activeProfile.posts &&
                activeProfile.posts.length === 3 ? (
                  <View
                    style={{
                      flex: 1
                    }}
                  >
                    <ScrollView
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
                      {activeProfile.posts.map(this._renderGameCards)}
                    </ScrollView>
                    {hasSeenReactOnTheseCardsTutorial ? (
                      <View />
                    ) : (
                      <MaskedView
                        style={{
                          width: "100%"
                        }}
                        maskElement={
                          <RegularText
                            style={{
                              alignSelf: "center",
                              transform: [{ translateY: 15 }],
                              fontSize: 16,
                              paddingHorizontal: 20,
                              textAlign: "center",
                              color: FONT_GREY
                            }}
                          >
                            React on these cards to become friends!
                          </RegularText>
                        }
                      >
                        <Animated.View
                          style={{
                            width: Animated.concat(
                              this.animatedBackGroundWidth,
                              "%"
                            ),
                            backgroundColor: FONT_GREY,
                            height: 30
                          }}
                        />
                      </MaskedView>
                    )}
                  </View>
                ) : (
                  <View
                    style={{
                      height: DeviceWidth * 0.6,
                      justifyContent: "center"
                    }}
                  >
                    <MediumText
                      style={{
                        fontSize: 20,
                        textAlign: "center",
                        paddingHorizontal: 20
                      }}
                    >
                      This user does not contain profile cards.
                    </MediumText>
                  </View>
                )}
              </View>
            )}
          </View>
        )}
        {/* Facebook friends */}
        <CurvedBackground radius={15} style={{ paddingTop: LEFT_MARGIN / 2 }}>
          <View style={{ flexDirection: "row" }}>
            <Image
              source={require("../../assets/images/fb.png")}
              style={{
                height: 25,
                width: 25,
                alignSelf: "center",
                marginTop: 0
              }}
            />
            <MediumText
              style={{
                ...styles.cardHeader,
                marginTop: LEFT_MARGIN / 1.5,
                marginLeft: 5
              }}
            >
              Facebook
            </MediumText>
            <RegularText
              style={{
                fontSize: 17,
                color: "#1E2432",
                marginVertical: 12,
                marginLeft: 42
              }}
            >
              4 mutual friends
            </RegularText>
          </View>

          <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
            <View style={styles.fbImageView}>
              <Image
                style={styles.fbImageStyle}
                source={require("../../assets/images/riya.png")}
              />
              <RegularText style={styles.fbNameText}>Meghna</RegularText>
            </View>
            <View style={styles.fbImageView}>
              <Image
                style={styles.fbImageStyle}
                source={require("../../assets/images/riya.png")}
              />
              <RegularText style={styles.fbNameText}>Riya</RegularText>
            </View>
            <View style={styles.fbImageView}>
              <Image
                style={styles.fbImageStyle}
                source={require("../../assets/images/riya.png")}
              />
              <RegularText style={styles.fbNameText}>Divya</RegularText>
            </View>
            <View style={styles.fbImageView}>
              <Image
                style={styles.fbImageStyle}
                source={require("../../assets/images/riya.png")}
              />
              <RegularText style={styles.fbNameText}>Vidya</RegularText>
            </View>
          </ScrollView>
        </CurvedBackground>
        {/* Instagram images */}
        {!_isOthersInstaImagesFound ? (
          <View />
        ) : (
          <CurvedBackground
            radius={15}
            style={{
              paddingHorizontal: 0
            }}
          >
            <View style={{ flexDirection: "row", marginLeft: LEFT_MARGIN }}>
              <Image
                source={require("../../assets/images/insta.png")}
                style={{
                  height: 25,
                  width: 25,
                  alignSelf: "center",
                  marginTop: 0
                }}
              />
              <BoldText style={styles.cardHeader}>Instagram</BoldText>
            </View>
            <InstaSwiper
              fromMyProfile={_isMyInstaImagesFound}
              allImages={activeProfile.insta_images}
              data={chunk(activeProfile.insta_images, 6)}
            />
            {!_isMyInstaImagesFound ? (
              <ConnectYourInstagram
                onClick={() => {
                  this.connectInstagram();
                }}
              />
            ) : (
              <View />
            )}
          </CurvedBackground>
        )}

        {/* Bio */}
        {activeProfile &&
        activeProfile.bio &&
        checkNullAndUndefined(activeProfile.bio) ? (
          <CurvedBackground radius={15}>
            <MediumText style={styles.cardHeader}>About</MediumText>
            <RegularText style={styles.bioText}>
              {activeProfile && activeProfile.bio}
            </RegularText>
          </CurvedBackground>
        ) : (
          <View />
        )}

        {/* Education  & work */}
        {(activeProfile &&
          activeProfile.education &&
          checkNullAndUndefined(activeProfile.education)) ||
        (activeProfile &&
          activeProfile.organization &&
          checkNullAndUndefined(activeProfile.organization)) ? (
          <CurvedBackground radius={15}>
            <MediumText style={styles.cardHeader}>Education & work</MediumText>
            {activeProfile &&
              activeProfile.education &&
              checkNullAndUndefined(activeProfile.education) && (
                <View style={styles.iconTextRow}>
                  <SvgUri
                    width={22}
                    height={22}
                    source={require("../../assets/svgs/Surfing/education.svg")}
                  />
                  <RegularText style={styles.workName}>
                    {activeProfile.education}{" "}
                  </RegularText>
                  {activeProfile.graduatedYear && (
                    <RegularText style={styles.workName}>
                      {activeProfile.graduatedYear}
                    </RegularText>
                  )}
                </View>
              )}
            {activeProfile &&
              activeProfile.organization &&
              checkNullAndUndefined(activeProfile.organization) && (
                <View style={styles.iconTextRow}>
                  <SvgUri
                    width={22}
                    height={22}
                    source={require("../../assets/svgs/Surfing/work.svg")}
                  />
                  <RegularText style={styles.workName}>
                    {activeProfile && activeProfile.organization}
                  </RegularText>
                </View>
              )}
          </CurvedBackground>
        ) : (
          <View />
        )}
        {/* Basic Info */}
        {basicInfoItems.length > 0 ? (
          <CurvedBackground radius={15}>
            <MediumText style={styles.cardHeader}>Basic Info</MediumText>
            <FlatList
              scrollEnabled={false}
              data={basicInfoItems}
              numColumns={2}
              keyExtractor={item => item.name}
              renderItem={({ item, index }) => {
                if (item.name === "gender") {
                  if (
                    activeProfile[item.name] !== "Man" &&
                    activeProfile[item.name] !== "Woman"
                  ) {
                    return (
                      <BasicInfo
                        value={activeProfile[item.name]}
                        itemKey={"TRANSGENDER"}
                      />
                    );
                  } else {
                    return (
                      <BasicInfo
                        size={activeProfile[item.name] === "Man" ? 16 : 18}
                        value={activeProfile[item.name]}
                        itemKey={activeProfile[item.name].toUpperCase()}
                      />
                    );
                  }
                } else {
                  return (
                    <BasicInfo
                      value={activeProfile[item.name]}
                      itemKey={item.iconName}
                    />
                  );
                }
              }}
            />
          </CurvedBackground>
        ) : (
          <View />
        )}
        {/* Location */}
        <CurvedBackground radius={15}>
          <MediumText style={{ ...styles.cardHeader, marginBottom: 6 }}>
            {userName}'s Location
          </MediumText>
          <View style={{ marginTop: 10, marginBottom: 10 }}>
            <View
              style={{
                alignItems: "flex-start",
                justifyContent: "center",
                marginBottom: 12
              }}
            >
              {activeProfile && activeProfile.place ? (
                <RowView>
                  <Ionicon
                    style={{ marginLeft: 4, marginTop: 1 }}
                    name={"ios-pin"}
                    color={"rgb(58,77,227)"}
                    size={22}
                  />

                  <MediumText
                    style={{
                      fontSize: 20,
                      marginLeft: 10,
                      marginBottom: 6,
                      color: FONT_BLACK
                    }}
                  >
                    {namify(activeProfile.place)}
                  </MediumText>
                </RowView>
              ) : (
                <View />
              )}
              {activeProfile &&
              activeProfile.dist &&
              activeProfile.dist.distance &&
              activeProfile.dist.distance <= 100 ? (
                <MediumText
                  style={{
                    fontSize: 16,
                    marginLeft: 26,

                    // : 10,
                    color: FONT_GREY
                  }}
                >
                  {getDistanceText(
                    activeProfile &&
                      activeProfile.dist & activeProfile.dist.distance,
                    activeProfile.place
                  )}
                </MediumText>
              ) : null}
            </View>
            {["living_in", "native_place"].map((location, locationIndex) => {
              if (activeProfile && activeProfile[location]) {
                const prePhrase = locationIndex === 0 ? "Living in " : "From ";
                return (
                  <View
                    key={locationIndex}
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: locationIndex === 0 ? 16 : 0
                    }}
                  >
                    <View style={{ marginTop: -3 }}>
                      <SvgUri
                        width={18}
                        height={18}
                        source={
                          locationIndex === 0
                            ? require("../../assets/svgs/Surfing/LivingIn.svg")
                            : require("../../assets/svgs/Surfing/ImFrom.svg")
                        }
                      />
                    </View>
                    <MediumText
                      style={{
                        fontSize: 16,
                        color: FONT_BLACK,
                        // fontWeight: "400",
                        // textAlign: "flex-st"
                        marginLeft: 9
                      }}
                    >
                      {prePhrase}
                      {activeProfile && activeProfile[location]}
                    </MediumText>
                  </View>
                );
              }
            })}
          </View>
        </CurvedBackground>

        <TouchableOpacity
          onPress={() => openBlockAndReportsModal()}
          style={styles.blockAndReportView}
        >
          <RegularText style={styles.blockAndReportText}>
            Block and Report
          </RegularText>
        </TouchableOpacity>
        <View
          style={{
            height: 100
          }}
        />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  curvedBackground: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginHorizontal: DeviceWidth * 0.05,
    marginVertical: DeviceWidth * 0.025,
    padding: DeviceWidth * 0.05,
    shadowColor: "#000000A0",
    shadowOpacity: 0,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2
    },
    elevation: 2,
    paddingHorizontal: 0,
    width: DeviceWidth * 0.9,
    height: DeviceWidth * 0.8,
    // height: DeviceWidth * 0.715,

    marginLeft: DeviceWidth * 0.05
  },
  itemHeader: {
    fontSize: 20,
    color: "#1E2432",
    marginLeft: DeviceWidth * 0.06,
    marginBottom: 2
  },
  blockAndReportView: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: DeviceWidth * 0.9,
    alignSelf: "center",
    marginTop: LEFT_MARGIN / 2,
    ...sharedStyles.justifiedCenter
  },
  blockAndReportText: {
    fontSize: 18,
    color: BRIGHT_RED,
    paddingVertical: 15
  },
  reactedTextView: {
    zIndex: 9999,
    height: DeviceWidth * 0.6,
    alignItems: "center",
    justifyContent: "center"
  },
  reactedText: {
    textAlign: "center",
    fontSize: 15,
    color: FONT_GREY
  },
  infoText: {
    paddingHorizontal: 20,
    textAlign: "center",
    paddingVertical: 5,
    fontSize: 17,
    color: PURPLE
  },
  workName: {
    marginTop: 5,
    fontSize: 16,
    color: "rgba(0,0,0,0.8)",
    marginLeft: 10
  },
  workIcon: {
    marginHorizontal: LEFT_MARGIN / 2
  },
  iconTextRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10
  },
  bioText: {
    fontSize: 17,
    padding: 10,
    fontWeight: "200",
    color: "#1E2432"
  },
  fbImageView: {
    flexDirection: "column",
    alignItems: "center"
  },
  fbImageStyle: {
    height: 60,
    width: 60,
    borderRadius: 30,
    margin: 10
  },
  cardFbHeader: {
    fontSize: 20,
    color: "#3b5998",
    marginVertical: 10,
    fontWeight: "bold",
    marginLeft: 10
  },
  cardHeader: {
    fontSize: 20,
    color: "#1E2432"
  },
  userName: {
    color: "#fff",
    fontSize: 20,
    marginLeft: 20,
    marginTop: 10,
    fontWeight: "bold"
  },
  userImage: {
    width: DeviceWidth * 0.27,
    aspectRatio: CARD_WIDTH / IMAGE_HEIGHT,
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 8
  },
  instaImage: {
    height: DeviceWidth * 0.25,
    width: DeviceWidth * 0.25,
    borderRadius: 8,
    marginHorizontal: 6,
    marginBottom: 6
  },
  fbNameText: {
    color: "#1E2432"
  }
});

const mapStateToProps = state => {
  return {
    allReasons: state.info.reasons,
    myData: state.info.userInfo,
    posts: state.info.posts,
    gameNames: state.questions.gameNames,
    currentChatScreenIndex: state.nav.currentChatScreenIndex,
    othersCardsCount: state.tutorial.othersCards,
    openFirstCardDirectly: state.nav.openFirstCardDirectly,
    questionCardAfterResponseScreenClose:
      state.nav.questionCardAfterResponseScreenClose,
    showQuestionCardTutorial: state.nav.showQuestionCardTutorial,
    hasSeenReactOnTheseCardsTutorial:
      state.tutorial.hasSeenReactOnTheseCardsTutorial
  };
};
const mapDispatchToProps = dispatch => {
  return {
    setRooms: bindActionCreators(RoomActions.setRooms, dispatch),
    setRoomsInArray: bindActionCreators(RoomActions.setRoomsArray, dispatch),
    setChatIconDot: bindActionCreators(
      NotificationActions.setChatIconDot,
      dispatch
    ),
    setSentTextDot: bindActionCreators(
      NotificationActions.setSentTextDot,
      dispatch
    ),
    addNewRespone: bindActionCreators(NavActions.addNewResponse, dispatch),
    removeOneBlockedUserFromProfiles: bindActionCreators(
      removeUserFromProfiles,
      dispatch
    )
  };
};
export default connectActionSheet(
  connect(mapStateToProps, mapDispatchToProps)(ProfileModal)
);
