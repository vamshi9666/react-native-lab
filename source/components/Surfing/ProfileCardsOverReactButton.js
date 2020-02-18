import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Animated, { Easing } from "react-native-reanimated";
import { DeviceHeight, DeviceWidth } from "../../config/Device";
import NoFeedbackTapView from "../Views/NoFeedbackTapView";
import { connect } from "react-redux";
import TouchableScale from "react-native-touchable-scale";
import GameContainer from "../Common/Game.container";
import MediumText from "../Texts/MediumText";
import MaskedView from "@react-native-community/masked-view";
import { LEFT_MARGIN } from "../../config/Constants";
import RowView from "../Views/RowView";
import Ionicon from "react-native-vector-icons/Ionicons";
import { FONT_BLACK, FONT_GREY, PURPLE } from "../../config/Colors";
import { userNamify } from "../../config/Utils";
import CircularImage from "../Views/CircularImage";
import RegularText from "../Texts/RegularText";
import { STATIC_URL } from "../../config/Api";
import { View as AnimatableView } from "react-native-animatable";
import { getPosts } from "../../network/user";
import JustifiedCenteredView from "../Views/JustifiedCenteredView";
import {
  runRepeatedTiming,
  runTimingForNavbarNob
} from "../../config/Animations";

const { Code, cond, block, eq, Value, Extrapolate } = Animated;
const DURATION = 200;

class ProfileCardsOverReactButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postsLoading: false,
      selectedGame: "",
      currentProfilePosts: {}
    };
    this.cards = [0, 1, 2].map(() => React.createRef());
    this.isOpened = new Value(0);
    this.modalScale = new Value(0.01);
    this.modalTranslateX = new Value(-DeviceWidth * 0.3);
    this.modalTranslateY = new Value(-DeviceHeight * 0.35);
    this.modalOpacity = new Value(0);
  }

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

  _renderGameCards = (item, index) => {
    const { gameNames } = this.props;
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
                    this.props.openResponseScreen(item, position, index, posts);
                  }
                );
              }
            });
          }}
          style={{
            ...styles.gameContainerView,
            opacity: selectedGame === item && !postsLoading ? 0 : 1
            // marginLeft: index === 0 ? LEFT_MARGIN : 0
          }}
        >
          <GameContainer
            ref={this.cards[index]}
            height={DeviceWidth * 0.5 * 0.75}
            width={DeviceWidth * 0.37 * 0.75}
            colors={colors}
            gameName={key}
            fromPresetModal={true}
            gameValue={value}
            showLoading={postsLoading && selectedGame === item}
          />
        </TouchableScale>
      );
    } else {
      return (
        <View>
          <MediumText>User Obj has posts but gameNames length is 0.</MediumText>
        </View>
      );
    }
  };

  componentWillReceiveProps = nextProps => {
    const { questionCardAfterResponseScreenClose } = nextProps;
    if (questionCardAfterResponseScreenClose) {
      this.setState({ selectedGame: null });
    }
  };

  animation = new Animated.Value(100);
  initialValue = new Animated.Value(0);
  animatedBackGroundWidth = runRepeatedTiming(
    this.initialValue,
    this.animation,
    2500
  );

  closeModal = () => {
    this.isOpened.setValue(1);
    setTimeout(() => {
      this.props.close();
    }, DURATION);
  };

  render() {
    const {
      isOpened,
      modalScale,
      modalTranslateX,
      modalTranslateY
      // modalOpacity
    } = this;
    const {
      activeProfile,
      navigateToChat,
      hasSeenReactOnTheseCardsTutorial
    } = this.props;
    const { images, posts, hideProfileCards } = activeProfile;

    const modalOpacity = modalScale.interpolate({
      inputRange: [0, 0.3, 0.5, 1],
      outputRange: [0, 0, 0.3, 1],
      extrapolate: Extrapolate.CLAMP
    });

    return (
      <>
        <Code>
          {() =>
            block([
              cond(
                eq(isOpened, 0),
                [
                  runTimingForNavbarNob(modalScale, new Value(1), DURATION),
                  runTimingForNavbarNob(
                    modalTranslateX,
                    new Value(-DeviceWidth * 0.475),
                    DURATION
                  ),
                  runTimingForNavbarNob(
                    modalTranslateY,
                    new Value(-DeviceHeight * 0.35),
                    DURATION
                  )
                  // runTimingForNavbarNob(modalOpacity, new Value(1), DURATION)
                ],
                [
                  runTimingForNavbarNob(modalScale, new Value(0.01), DURATION),
                  runTimingForNavbarNob(
                    modalTranslateX,
                    new Value(-DeviceWidth * 0.3),
                    DURATION
                  ),
                  runTimingForNavbarNob(
                    modalTranslateY,
                    new Value(-DeviceHeight * 0.35),
                    DURATION
                  )
                  // runTimingForNavbarNob(modalOpacity, new Value(0), DURATION)
                ]
              )
            ])
          }
        </Code>
        <NoFeedbackTapView onPress={this.closeModal} style={styles.baseLayout}>
          <View style={styles.cardTriangleWrapView}>
            <Animated.View
              style={{
                ...styles.bottomCardsRowView,
                transform: [
                  {
                    scale: modalScale
                  },
                  {
                    translateY: -DeviceHeight * 0.25
                  }
                ],
                position: "absolute",
                left: modalTranslateX,
                opacity: modalOpacity
              }}
            >
              <RowView style={styles.imageView}>
                <RowView>
                  <View
                    style={{
                      paddingHorizontal: LEFT_MARGIN / 2
                    }}
                  >
                    <CircularImage
                      height={30}
                      source={{
                        uri: STATIC_URL + images[0].split("uploads")[1]
                      }}
                    />
                  </View>
                  <MediumText style={styles.userNameHeader}>
                    {userNamify(activeProfile)}'s Profile Cards
                  </MediumText>
                </RowView>
                <NoFeedbackTapView onPress={this.closeModal}>
                  <Ionicon
                    name={"ios-close-circle"}
                    size={30}
                    color={FONT_GREY}
                  />
                </NoFeedbackTapView>
              </RowView>
              {hideProfileCards ? (
                <JustifiedCenteredView
                  style={{
                    zIndex: 9999,
                    height: DeviceWidth * 0.4,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <RegularText
                    style={{
                      textAlign: "center",
                      fontSize: 15,
                      color: FONT_GREY,
                      marginTop: 0,
                      fontSize: 15
                    }}
                  >
                    You reacted to {userNamify(activeProfile)}
                  </RegularText>
                  <TouchableOpacity
                    onPress={navigateToChat}
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
                </JustifiedCenteredView>
              ) : (
                <>
                  <RowView style={styles.bottomCardsRow}>
                    {posts.map(this._renderGameCards)}
                  </RowView>
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
                            transform: [{ translateY: 2.5 }],
                            fontSize: 15,
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
                          height: 20
                        }}
                      />
                    </MaskedView>
                  )}
                </>
              )}
              <View style={styles.triangleView} />
            </Animated.View>
          </View>
        </NoFeedbackTapView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  userNameHeader: {
    fontSize: 16,
    color: FONT_BLACK,
    transform: [
      {
        translateY: 5
      }
    ]
  },
  gameContainerView: {
    shadowRadius: 5,
    shadowColor: "#000000f1",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.1
  },
  imageView: {
    alignItems: "flex-start",
    marginTop: -5,
    marginBottom: 10,
    justifyContent: "space-between",
    paddingRight: 10
  },
  baseLayout: {
    ...StyleSheet.absoluteFillObject,
    position: "absolute",
    height: DeviceHeight,
    width: DeviceWidth,
    zIndex: 2,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)"
  },
  cardTriangleWrapView: {
    elevation: 2,
    shadowColor: "rgba(0,0,0,0.8)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    height: DeviceHeight
  },
  triangleView: {
    position: "absolute",
    height: 20,
    width: 20,
    borderRadius: 4,
    backgroundColor: "#fff",
    transform: [
      {
        rotateZ: "45deg"
      }
    ],
    right: DeviceWidth * 0.25,
    bottom: -9
  },
  bottomCardsRow: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center"
  },
  bottomCardsRowView: {
    borderRadius: 15,
    backgroundColor: "#fff",
    width: DeviceWidth * 0.95,
    paddingTop: LEFT_MARGIN,
    paddingBottom: LEFT_MARGIN / 2
  }
});

const mapState = state => {
  return {
    myPosts: state.info.posts,
    myData: state.info.userInfo || {},
    gameNames: state.questions.gameNames,
    questionCardAfterResponseScreenClose:
      state.nav.questionCardAfterResponseScreenClose,
    hasSeenReactOnTheseCardsTutorial:
      state.tutorial.hasSeenReactOnTheseCardsTutorial
  };
};

const mapDispatch = dispatch => {
  return {};
};
export default connect(mapState, mapDispatch)(ProfileCardsOverReactButton);
