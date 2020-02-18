import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  // Animated,
  // Easing,
  StyleSheet,
  Platform,
  ActivityIndicator
} from "react-native";
import Animated, { Easing } from "react-native-reanimated";
import { DeviceWidth, DeviceHeight } from "../../../src/config/Device";
import Splash from "react-native-splash-screen";
import ChatFavourites from "./Chat.favourites";
import MyProfile from "./My.Profile";
import Carousel from "react-native-snap-carousel";
import Ionicon from "react-native-vector-icons/Ionicons";
import VerticalGradientView from "../../components/Views/VerticalGradientView";
import BoldText from "../../components/Texts/BoldText";
import JustifiedCenteredView from "../../components/Views/JustifiedCenteredView";
import * as UserApi from "../../network/user";
import * as QuestionApi from "../../network/question";
import { STATIC_URL } from "../../config/Api";
import NoFeedbackTapView from "../../components/Views/NoFeedbackTapView";
import ProfileModal from "../../components/Surfing/ProfileModal";
import MediumText from "../../components/Texts/MediumText";
import RegularText from "../../components/Texts/RegularText";
import RowView from "../../components/Views/JustifiedCenteredView";
import * as UserActions from "./../../redux/actions/user.info";
import * as ProfileActions from "./../../redux/actions/profiles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as QuestionActions from "../../redux/actions/questions";
import { PURPLE } from "../../config/Colors";
const { Value, timing, color, cond, neq, eq } = Animated;
const { OS } = Platform;

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatScreenPosition: new Value(-DeviceWidth),
      profileScreenPosition: new Value(-DeviceWidth),
      profileModalPosition: new Value(-DeviceHeight),
      animatedBottomPosition: new Value(0),
      showOverlayLeft: false,
      showOverlayRight: false,
      showGradient: false,
      users: [],
      loading: false,
      currentImageIndex: 0,
      currentProfileIndex: 0
    };
    this._carousel = React.createRef();
    this.bottomScrollRef = React.createRef();
    this.chatPageNav = this.chatPageNav.bind(this);
    this.myProfileNav = this.myProfileNav.bind(this);
  }

  fetchMyPosts = () => {
    const { myData } = this.props;
    UserApi.getPosts(myData._id, posts => {
      if (posts.success) {
        this.props.setPosts(posts.data);
        this.fetchBlockReasons();
      } else {
        alert("Something went wrong while fetching posts");
      }
    });
  };

  getThirtyProfiles = () => {
    if (this.props.thirtyProfiles.length) {
    } else {
      // alert("No profiles found in state");
      UserApi.getThirtyProfiles(profiles => {
        if (profiles.success) {
          this.props.setThirtyProfiles(profiles.data);
          this.setState({ users: profiles.data, loading: false });
        } else {
          alert("Something went wrong while fetching profiles");
        }
      });
    }
  };

  componentDidMount = () => {
    Splash.hide();
    this.getThirtyProfiles();
  };

  chatPageNav = toValue => {
    const { chatScreenPosition } = this.state;
    const isOpening = toValue === 0;
    if (!isOpening) {
      this.setState({ showGradient: false });
    } else {
      this.setState({ showOverlayLeft: true });
    }
    this.bottomScrollRef.getNode().scrollTo({
      x: isOpening ? -DeviceWidth * 0.85 : DeviceWidth * 0.15
    });
    timing(chatScreenPosition, {
      toValue,
      easing: Easing.linear,
      duration: 400
    }).start(() => {
      if (isOpening) {
        this.setState({ showGradient: true });
      } else {
        this.setState({ showOverlayLeft: false });
      }
    });
  };

  myProfileNav = toValue => {
    this.bottomScrollRef.getNode().scrollTo({ x: DeviceWidth });
    const { profileScreenPosition } = this.state;
    const isOpening = toValue === 0;
    if (!isOpening) {
      this.setState({ showGradient: false });
    } else {
      this.setState({ showOverlayRight: true });
    }
    this.bottomScrollRef.getNode().scrollTo({
      x: isOpening ? DeviceWidth + DeviceWidth * 0.15 : DeviceWidth * 0.15
    });
    timing(profileScreenPosition, {
      toValue,
      easing: Easing.linear,
      duration: 400
    }).start(() => {
      if (isOpening) {
        this.setState({ showGradient: true });
      } else {
        this.setState({ showOverlayRight: false });
      }
    });
  };

  profileModalNav = toValue => {
    const { profileModalPosition } = this.state;
    const isOpening = toValue === 0;
    this.animateBottomNavBar(isOpening ? -50 : 0);
    timing(profileModalPosition, {
      toValue,

      duration: 300,

      easing: Easing.linear
    }).start();
  };

  renderChatFavourite = () => {
    const { chatScreenPosition, showGradient } = this.state;
    return (
      <Animated.View
        style={{
          position: "absolute",
          left: chatScreenPosition,
          zIndex: 2
        }}
      >
        <ChatFavourites
          chatPageNav={this.chatPageNav}
          showGradient={showGradient}
          navigation={this.props.navigation}
        />
      </Animated.View>
    );
  };

  renderMyProfile = () => {
    const { profileScreenPosition, showGradient } = this.state;
    const cardBorderRadius = profileScreenPosition.interpolate({
      inputRange: [-DeviceWidth, 0],
      outputRange: [20, 0]
    });
    return (
      <Animated.View
        style={{
          position: "absolute",
          right: profileScreenPosition,
          zIndex: 2,
          height: DeviceHeight,
          width: DeviceWidth,
          backgroundColor: "#0000"
        }}
      >
        <MyProfile
          navigation={this.props.navigation}
          cardBorderRadius={cardBorderRadius}
          showGradient={showGradient}
          myProfileNav={this.myProfileNav}
          animateBottomNavBar={this.animateBottomNavBar}
        />
      </Animated.View>
    );
  };

  renderLeftOverlay = () => {
    const { chatScreenPosition, showOverlayLeft } = this.state;
    const bgOpacityLeft = chatScreenPosition.interpolate({
      inputRange: [-DeviceWidth, -DeviceWidth * 0.2, 0],
      outputRange: [0, 0.2, 0.8]
      // outputRange: ["rgba(119,76,213,0)", "rgba(119,76,213,0.8)"]
    });
    if (showOverlayLeft) {
      return (
        <Animated.View
          style={{
            position: "absolute",
            zIndex: 1,
            height: DeviceHeight,
            width: DeviceWidth,
            backgroundColor: color(119, 76, 213, bgOpacityLeft) //bgOpacityLeft
          }}
        />
      );
    } else {
      return <View />;
    }
  };

  renderRightOverlay = () => {
    const { showOverlayRight, profileScreenPosition } = this.state;
    const bgOpacityRight = profileScreenPosition.interpolate({
      inputRange: [-DeviceWidth, -DeviceWidth * 0.25, 0],
      outputRange: [0, 0.3, 0.8]
      // outputRange: ["rgba(119,76,213,0)", "rgba(119,76,213,1)"]
    });
    if (showOverlayRight) {
      return (
        <Animated.View
          style={{
            position: "absolute",
            zIndex: 1,
            height: DeviceHeight,
            width: DeviceWidth,
            backgroundColor: color(119, 76, 213, bgOpacityRight) //bgOpacityRight
          }}
        />
      );
    } else {
      return <View />;
    }
  };

  renderSurfingCards = () => {
    const {
      users,
      currentImageIndex,
      chatScreenPosition,
      profileScreenPosition,
      currentProfileIndex
    } = this.state;
    const animatedBlur = chatScreenPosition.interpolate({
      inputRange: [-DeviceWidth, 0],
      outputRange: [0, 10]
    });
    const animatedBlurTwo = profileScreenPosition.interpolate({
      inputRange: [-DeviceWidth, 0],
      outputRange: [0, 10]
    });

    const { loading } = this.state;
    if (loading) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size={"large"} />
        </View>
      );
    }
    return (
      <Carousel
        onSnapToItem={i => this.setState({ currentProfileIndex: i })}
        ref={c => {
          this._carousel = c;
        }}
        firstItem={0}
        data={users}
        renderItem={({ item, index }) => (
          <View
            style={{
              flex: 1
            }}
          >
            <View
              style={{
                flexDirection: "row",
                position: "absolute",
                zIndex: 2,
                bottom: DeviceHeight * 0.05,
                left: DeviceWidth * 0.4
              }}
            >
              {item.images &&
                item.images.map((image, imageIndex) => (
                  <Text
                    key={imageIndex}
                    style={{
                      fontSize: imageIndex === currentImageIndex ? 90 : 70,
                      color:
                        imageIndex === currentImageIndex ? "#fff" : "#B8BBC6",
                      marginTop: imageIndex === currentImageIndex ? -18 : 0,
                      marginHorizontal: -1
                    }}
                  >
                    .
                  </Text>
                ))}
            </View>

            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal
              pagingEnabled
              onMomentumScrollEnd={evt => {
                this.setState({
                  currentImageIndex: Math.round(
                    evt.nativeEvent.contentOffset.x / DeviceWidth
                  )
                });
              }}
            >
              {item.images.map((image, imageId) => (
                <View key={imageId}>
                  <NoFeedbackTapView onPress={() => this.profileModalNav(0)}>
                    <Animated.Image
                      blurRadius={cond(
                        eq(index, currentProfileIndex),
                        cond(
                          neq(animatedBlur, 0),
                          animatedBlur,
                          animatedBlurTwo
                        ),
                        0
                      )}
                      style={styles.userImage}
                      resizeMode={"cover"}
                      source={{
                        uri: STATIC_URL + image.split("uploads")[1]
                      }}
                    />
                  </NoFeedbackTapView>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
        vertical
        itemHeight={DeviceHeight}
        sliderHeight={DeviceHeight}
        snapToAlignment={"center"}
        inactiveSlideScale={1}
      />
    );
  };

  animateBottomNavBar = toValue => {
    const { animatedBottomPosition } = this.state;
    timing(animatedBottomPosition, {
      toValue,
      duration: 200,
      easing: Easing.linear
    }).start();
  };

  render() {
    const {
      showGradient,
      loading,
      profileModalPosition,
      animatedBottomPosition,
      users,
      currentProfileIndex
    } = this.state;

    // const animatedOpacicty = profileModalPosition.interpolate({
    //   inputRange: [-DeviceHeight, 0],
    //   outputRange: [1, 0]
    // });

    // const animatedBottom = profileModalPosition.interpolate({
    //   inputRange: [-DeviceHeight, 0],
    //   outputRange: [OS === "ios" ? 0 : 20, -50]
    // });

    return (
      <View style={styles.baseLayout}>
        <Animated.ScrollView
          ref={ref => (this.bottomScrollRef = ref)}
          contentOffset={{ x: DeviceWidth * 0.15 }}
          horizontal
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          style={{
            position: "absolute",
            height: DeviceHeight * 0.1,
            bottom: 0,
            zIndex: 10,
            // opacity: animatedOpacicty,
            bottom: animatedBottomPosition
          }}
        >
          <View
            style={{
              width: DeviceWidth * 0.15
            }}
          >
            <TouchableOpacity
              onPress={() => this.chatPageNav(-DeviceWidth)}
              style={{
                backgroundColor: "#fff",
                borderRadius: 25,
                height: 50,
                width: 50,
                alignItems: "center",
                justifyContent: "center",
                elevation: 2,
                shadowColor: "rgba(0,0,0,0.3)",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.5
              }}
            >
              <Ionicon
                style={{
                  marginTop: 2
                }}
                name={"ios-arrow-forward"}
                color={PURPLE}
                size={30}
              />
            </TouchableOpacity>
          </View>

          <VerticalGradientView
            style={styles.bottomIconsRow}
            colors={["#0000", "rgba(0,0,0,0.8)"]}
          >
            <View style={styles.iconsView}>
              <TouchableOpacity
                style={styles.chatIconView}
                onPress={() => this.chatPageNav(0)}
              >
                {/* <Image
                  style={{
                    height: 25,
                    width: 25
                  }}
                  source={require("../../assets/svgs/chat.png")}
                /> */}
                <Ionicon name={"ios-chatbubbles"} color={"#fff"} size={30} />
              </TouchableOpacity>
            </View>
            <RegularText style={styles.closerText}>Closer</RegularText>
            <View style={styles.iconsView}>
              <TouchableOpacity
                style={styles.userIconView}
                onPress={() => this.myProfileNav(0)}
              >
                {/* <Image
                  style={{
                    height: 25,
                    width: 25
                  }}
                  source={require("../../assets/svgs/user.png")}
                /> */}
                <Ionicon name={"md-person"} size={32} color={"#fff"} />
              </TouchableOpacity>
            </View>
          </VerticalGradientView>

          <View
            style={{
              width: DeviceWidth * 0.15
            }}
          >
            <TouchableOpacity
              onPress={() => this.myProfileNav(-DeviceWidth)}
              style={{
                backgroundColor: "#fff",
                borderRadius: 25,
                height: 50,
                width: 50,
                alignItems: "center",
                justifyContent: "center",
                elevation: 2,
                shadowColor: "rgba(0,0,0,0.3)",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.5
              }}
            >
              <Ionicon
                style={{
                  marginTop: 2
                }}
                name={"ios-arrow-back"}
                color={PURPLE}
                size={30}
              />
            </TouchableOpacity>
          </View>
        </Animated.ScrollView>

        {loading ? (
          <JustifiedCenteredView
            style={{
              marginTop: DeviceHeight * 0.5
            }}
          >
            <ActivityIndicator size={"large"} color={"#fff"} />
          </JustifiedCenteredView>
        ) : (
          this.renderSurfingCards()
        )}

        <Animated.View
          style={{
            position: "absolute",
            bottom: profileModalPosition
          }}
        >
          <ProfileModal
            onCloseModal={() => this.profileModalNav(-DeviceHeight)}
            swipeProfileUp={() => {
              this.profileModalNav(-DeviceHeight);
              setTimeout(() => {
                this._carousel.snapToNext();
                alert(" you just reported " + users[currentProfileIndex].name);
              }, 300);
            }}
            activeProfile={users[currentProfileIndex]}
            userInfo={users[0]}
            fromSurfing={true}
            showCards={true}
            navigation={this.props.navigation}
          />
        </Animated.View>

        {this.renderMyProfile()}
        {this.renderChatFavourite()}
        {this.renderLeftOverlay()}
        {this.renderRightOverlay()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  closerText: {
    fontSize: 28,
    textAlign: "center",
    color: "#fff",
    alignSelf: "center",
    marginTop: 10
  },
  userImage: {
    height: DeviceHeight,
    width: DeviceWidth
  },
  baseLayout: {
    width: DeviceWidth,
    height: DeviceHeight,
    backgroundColor: "#cacaca"
  },
  bottomIconsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 10,
    width: DeviceWidth
  },
  iconsView: {
    width: DeviceWidth / 3,
    backgroundColor: "#0000",
    marginTop: DeviceHeight > 700 ? -10 : 0,
    alignSelf: "flex-end",
    marginVertical: 10
  },
  chatIconView: {
    backgroundColor: "#0000",
    justifyContent: "center",
    width: 40,
    borderRadius: 30,
    height: 40,
    marginLeft: 20,
    marginTop: 10
  },
  userIconView: {
    backgroundColor: "#0000",
    justifyContent: "center",
    width: 30,
    borderRadius: 25,
    height: 30,
    alignSelf: "flex-end",
    marginRight: 20,
    marginTop: 0
  }
});

const mapStateToProps = state => {
  return {
    myData: state.info.userInfo,
    thirtyProfiles: state.profiles.thirtyProfiles,
    myPosts: state.info.posts
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setMyData: bindActionCreators(UserActions.initDump, dispatch),
    setPosts: bindActionCreators(UserActions.setPosts, dispatch),
    setThirtyProfiles: bindActionCreators(
      ProfileActions.setThirtyProfiles,
      dispatch
    ),
    setReasons: bindActionCreators(UserActions.setReasons, dispatch),
    setGameNames: bindActionCreators(QuestionActions.setGameNames, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Landing);
