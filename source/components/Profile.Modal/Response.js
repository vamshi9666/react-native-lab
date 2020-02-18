import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Text,
  ScrollView
} from "react-native";
import Ionicon from "react-native-vector-icons/Ionicons";
import BottomSheet from "reanimated-bottom-sheet";
import Animated from "react-native-reanimated";
import {
  View as AnimatableView,
  Text as AnimatableText
} from "react-native-animatable";
import { DeviceHeight, DeviceWidth } from "../../../src/config/Device";
import { connect } from "react-redux";
import { userNamify } from "../../config/Utils";
import BoldText from "../Texts/BoldText";
import RegularText from "../Texts/RegularText";
import MediumText from "../Texts/MediumText";
import VerticalGradientView from "../Views/VerticalGradientView";
import {
  CORRECT_RESPONSE_GREEN,
  WRONG_RESPONSE_RED
} from "../../../src/config/Colors";
import { STATIC_URL } from "../../config/Api";
import {
  GamesWhichHasGreenRedResponses,
  LEFT_MARGIN,
  Emojis,
  GAME_LOGOS,
  GAME_LOGOS_COLORFUL
} from "../../config/Constants";
import { bindActionCreators } from "redux";
import {
  setMyCardsSeenCount,
  setOtherCardsSeenCount
} from "../../redux/actions/tutorials";
import { CachedImage } from "react-native-img-cache";
import CloserModal from "../Views/Closer.modal";
import SharePreview from "../Utility/Share.preview";
import { sharedStyles } from "../../styles/Shared";
import GiphyPicker from "../ChatWindow/Giphy.picker";
import RowView from "../Views/RowView";
import SvgUri from "react-native-svg-uri";
import { BACKGROUND_ICONS } from "../../config/files";
import BackgroundIcon from "../QuestionPicker/BackgroundIcons";
import { runSpringForModal } from "../../config/Animations";
import {
  PanGestureHandler,
  State,
  LongPressGestureHandler,
  TapGestureHandler
} from "react-native-gesture-handler";
import GameContainer from "../Common/Game.container";
import CircularImage from "../Views/CircularImage";
import ProgressResponse from "./Progress.Response";
var interval;
const {
  set,
  cond,
  eq,
  lessOrEq,
  Value,
  block,
  and,
  greaterThan,
  call,
  interpolate,
  createAnimatedComponent,
  Extrapolate,
  or,
  event,
  divide
} = Animated;

const AnimatedVerticalGradient = createAnimatedComponent(VerticalGradientView);

class NewResponse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentQuestionIndex: 0,
      currentValue: 0,
      doNotUpdate: false,
      shareResult: null,
      showShareScreen: false,
      isModalVisible: false,
      selectedOption: null,
      showTutorialLocal: true,
      showReactionModal: false,
      myReaction: null,
      renderReactionBottomSheet: false,
      backTapCount: 0
    };
    this.goingBack = new Value(0);
    this.btmSheetY = new Animated.Value(1);
    this.scrollRef = React.createRef();
    this.giphyPickerRef = React.createRef();
    this.selectedQuestion = new Value(0);
    this.animatedBackTapCount = new Value(0);

    const { x, y, width, height } = props.position;
    this.translateX = new Value(x);
    this.translateY = new Value(y);
    this.actualTranslateY = new Value(y);
    this.width = new Value(width);
    this.height = new Value(height);
    this.scale = new Value(width / DeviceWidth);
    this.top = new Value(0);
    this.borderRadius = new Value(10);
    this.opacityResponse = new Value(0);
    this.opacityCard = new Value(0);

    this.velocityY = new Value(0);
    this.pState = new Value(State.UNDETERMINED);
    this.longPressState = new Value(State.UNDETERMINED);

    this._onPanGestureEvent = event(
      [
        {
          nativeEvent: {
            // translationX: this.translateX,
            translationY: this.translateY,
            velocityY: this.velocityY,
            state: this.pState
          }
        }
      ],
      { useNativeDriver: true }
    );
    // this.onStateChange = event([
    //   {
    //     nativeEvent: {
    //       state: this.longPressState
    //     }
    //   }
    // ]);
  }
  componentDidMount = () => {
    setTimeout(() => {
      this.setState({ renderReactionBottomSheet: true }, () => {
        if (this.props.showTutorial) {
          return;
        } else {
          // this.startTimer();
        }
      });
    }, 500);
  };

  renderAnimatedCode = () => {
    const {
      props,
      translateX,
      translateY,
      width,
      height,
      scale,
      pState,
      velocityY,
      opacityResponse,
      opacityCard,
      top,
      borderRadius,
      actualTranslateY
    } = this;
    const { position, onClose } = props;

    return (
      <Animated.Code>
        {() =>
          block([
            cond(
              eq(this.goingBack, 0),
              [
                cond(
                  eq(pState, State.UNDETERMINED),
                  runSpringForModal(translateX, 0),
                  0
                ),
                cond(
                  eq(pState, State.UNDETERMINED),
                  runSpringForModal(actualTranslateY, 0),
                  0
                ),
                cond(
                  eq(pState, State.UNDETERMINED),
                  runSpringForModal(width, DeviceWidth),
                  0
                ),
                cond(
                  eq(pState, State.UNDETERMINED),
                  runSpringForModal(height, DeviceHeight),
                  0
                ),
                cond(
                  eq(pState, State.UNDETERMINED),
                  runSpringForModal(scale, 1),
                  0
                ),

                cond(
                  eq(pState, State.UNDETERMINED),
                  runSpringForModal(borderRadius, 0),
                  0
                ),
                cond(
                  eq(pState, State.UNDETERMINED),
                  runSpringForModal(opacityResponse, 1),
                  0
                )
              ],
              0
            ),
            cond(
              and(eq(pState, State.END), lessOrEq(velocityY, 0)),
              block([
                runSpringForModal(translateX, 0),
                runSpringForModal(actualTranslateY, 0),
                runSpringForModal(width, DeviceWidth),
                runSpringForModal(height, DeviceHeight),
                runSpringForModal(opacityResponse, 1),
                runSpringForModal(opacityCard, 0),
                runSpringForModal(scale, 1),
                runSpringForModal(borderRadius, 0),
                runSpringForModal(top, 0)
              ])
            ),
            cond(
              or(
                eq(this.goingBack, 1),
                and(eq(pState, State.END), greaterThan(velocityY, 0))
              ),
              block([
                runSpringForModal(translateX, position.x),
                runSpringForModal(actualTranslateY, position.y),
                runSpringForModal(width, position.width),
                runSpringForModal(height, position.height),
                runSpringForModal(opacityResponse, 0),
                runSpringForModal(opacityCard, 1),
                runSpringForModal(scale, position.width / DeviceWidth),
                runSpringForModal(borderRadius, 10),
                runSpringForModal(top, -position.height * 1.65),
                cond(eq(height, position.height), call([], onClose))
              ]),
              0
            ),
            cond(
              eq(pState, State.ACTIVE),
              set(
                height,
                interpolate(translateY, {
                  inputRange: [0, DeviceHeight * 0.55],
                  outputRange: [DeviceHeight, DeviceHeight * 0.9],
                  extrapolate: Extrapolate.CLAMP
                })
              ),
              0
            ),
            cond(
              eq(pState, State.ACTIVE),
              set(
                width,
                interpolate(translateY, {
                  inputRange: [0, DeviceHeight * 0.55],
                  outputRange: [DeviceWidth, DeviceWidth * 0.9],
                  extrapolate: Extrapolate.CLAMP
                })
              ),
              0
            ),
            cond(
              eq(pState, State.ACTIVE),
              set(
                actualTranslateY,
                interpolate(translateY, {
                  inputRange: [0, DeviceHeight * 0.55],
                  outputRange: [0, DeviceHeight * 0.1]
                  // extrapolate: Extrapolate.CLAMP
                })
              ),
              0
            ),
            cond(
              eq(pState, State.ACTIVE),
              set(
                translateX,
                interpolate(translateY, {
                  inputRange: [0, DeviceHeight * 0.55],
                  outputRange: [0, DeviceWidth * 0.05],
                  extrapolate: Extrapolate.CLAMP
                })
              ),
              0
            ),
            cond(
              eq(pState, State.ACTIVE),
              set(
                scale,
                interpolate(translateY, {
                  inputRange: [0, DeviceHeight * 0.55],
                  outputRange: [1, 0.9],
                  extrapolate: Extrapolate.CLAMP
                })
              ),
              0
            ),
            cond(
              eq(pState, State.ACTIVE),
              set(
                top,
                interpolate(translateY, {
                  inputRange: [0, DeviceHeight * 0.55],
                  outputRange: [0, -DeviceHeight * 0.04],
                  extrapolate: Extrapolate.CLAMP
                })
              ),
              0
            ),
            cond(
              eq(pState, State.ACTIVE),
              set(
                borderRadius,
                interpolate(translateY, {
                  inputRange: [0, DeviceHeight * 0.55],
                  outputRange: [0, 1],
                  extrapolate: Extrapolate.CLAMP
                })
              ),
              0
            )
          ])
        }
      </Animated.Code>
    );
  };

  toggleGiphyPicker = () => {
    if (this.giphyPickerRef) {
      this.giphyPickerRef.snapTo(1);
      this.setState({ showReactionModal: true });
    }
  };

  nextGameExists = () => {
    return false;
    let { games, selectedGameIndex } = this.props;
    return Object.keys(games).length - 1 > selectedGameIndex;
  };

  prevGameExists = () => {
    return false;
    let { selectedGameIndex } = this.props;
    return selectedGameIndex !== 0;
  };

  nextQuestionExists = () => {
    const { games, selectedGame } = this.props;
    const { currentQuestionIndex } = this.state;
    return currentQuestionIndex < games[selectedGame].length - 1;
  };

  prevQuestionExists = () => {
    let { currentQuestionIndex } = this.state;
    return currentQuestionIndex !== 0;
  };

  componentDidUpdate = async (prevProps, prevState) => {
    const currentValue = parseInt(this.state.currentValue);
    const prevCurrentValue = parseInt(prevState.currentValue);
    if (currentValue > prevCurrentValue && !this.state.doNotUpdate) {
      // Timer ends here
      const { currentQuestionIndex } = this.state;

      if (this.nextQuestionExists()) {
        this.setState({ currentQuestionIndex: currentQuestionIndex + 1 });
      } else {
        this.clearLocalInterval();
        setTimeout(() => {
          // this.props.closeLightBoxModal();
        }, 300);
      }
    }
  };

  moveToNext = () => {
    const { currentQuestionIndex } = this.state;
    this.setState({ pickedOption: null });
    if (this.nextQuestionExists()) {
      this.setState({
        currentQuestionIndex: currentQuestionIndex + 1,
        doNotUpdate: true,
        currentValue: 1
      });
      this.selectedQuestion.setValue(currentQuestionIndex + 1);
      this.refs.questionTextRef.animate({
        0: { opacity: 0 },
        1: { opacity: 1 }
      });
      this.refs.optionViewRef.animate({
        0: { opacity: 0 },
        1: { opacity: 1 }
      });
    } else {
      this.goingBack.setValue(1);
    }
  };

  moveToPrevious = () => {
    const { currentQuestionIndex, backTapCount } = this.state;

    this.setState({ pickedOption: null });
    if (this.prevQuestionExists()) {
      this.setState({
        currentQuestionIndex: currentQuestionIndex - 1
      });
      this.selectedQuestion.setValue(currentQuestionIndex - 1);
      this.refs.questionTextRef.animate({
        0: { opacity: 0 },
        1: { opacity: 1 }
      });
      this.refs.optionViewRef.animate({
        0: { opacity: 0 },
        1: { opacity: 1 }
      });
    } else {
      this.setState({ backTapCount: backTapCount + 1 });
      this.animatedBackTapCount.setValue(backTapCount + 1);
    }
  };

  renderImageOptions = currentQuestionIndex => {
    let { storeResponses, myData, userImage, games, selectedGame } = this.props;
    const game = games[selectedGame];
    const self = game[0].postedBy._id === myData._id;
    return game[currentQuestionIndex].questionId.options.map(
      (option, optionIndex) => {
        let presetOption = parseInt(game[currentQuestionIndex].option);
        let pickedOption = parseInt(game[currentQuestionIndex].response);
        let _hasResponse = isNaN(pickedOption) ? false : true;
        let backgroundColor = "#fff";
        let rightAnswer = null;

        if (_hasResponse) {
          if (presetOption === pickedOption) {
            if (pickedOption === optionIndex) {
              rightAnswer = true;
              backgroundColor = game[0].questionId.gameId.colors
                ? game[0].questionId.gameId.colors[1]
                : "skyblue";
            }
          } else {
            rightAnswer = false;
            if (pickedOption === optionIndex) {
              backgroundColor = game[0].questionId.gameId.colors
                ? game[0].questionId.gameId.colors[1]
                : "skyblue";
            } else if (presetOption === optionIndex) {
              backgroundColor = "#fff";
            } else {
              // No Image No Bg
            }
          }
        } else {
          //
        }

        return (
          <View key={optionIndex}>
            <TouchableOpacity
              disabled={self || _hasResponse}
              onPress={() => {
                this.setState({
                  selectedOption: optionIndex
                });
                storeResponses(
                  selectedGame,
                  currentQuestionIndex,
                  optionIndex,
                  game[currentQuestionIndex]._id
                );
              }}
              style={[
                styles.imageOptionView,
                {
                  borderColor: _hasResponse
                    ? rightAnswer || pickedOption === optionIndex
                      ? "#fff"
                      : game[0].questionId.gameId.colors
                      ? game[0].questionId.gameId.colors[0]
                      : "#cacaca"
                    : game[0].questionId.gameId.colors
                    ? game[0].questionId.gameId.colors[0]
                    : "#cacaca",
                  backgroundColor
                }
              ]}
            >
              <View
                style={{
                  width: DeviceWidth * 0.1,
                  opacity: _hasResponse ? 1 : 0,
                  justifyContent: "center"
                }}
              >
                {rightAnswer === true ? (
                  pickedOption === optionIndex ? (
                    <>
                      <CachedImage
                        style={{
                          height: 25,
                          width: 25,
                          borderWidth: 2,
                          borderColor: "#fff",
                          backgroundColor: "#fff",
                          borderRadius: 12.5,
                          transform: [
                            { translateX: LEFT_MARGIN / 3 },
                            { translateY: -LEFT_MARGIN / 3 }
                          ]
                        }}
                        source={{
                          uri: STATIC_URL + userImage.split("uploads")[1]
                        }}
                      />
                      <CachedImage
                        style={{
                          height: 25,
                          width: 25,
                          borderWidth: 2,
                          borderColor: "#fff",
                          backgroundColor: "#fff",
                          borderRadius: 12.5,
                          transform: [
                            { translateX: LEFT_MARGIN - 3 },
                            { translateY: LEFT_MARGIN / 2 - 3 }
                          ],
                          position: "absolute",
                          zIndex: 1
                        }}
                        source={{
                          uri: STATIC_URL + myData.images[0].split("uploads")[1]
                        }}
                      />
                    </>
                  ) : (
                    <View />
                  )
                ) : pickedOption === optionIndex ? (
                  <CachedImage
                    style={{
                      height: 25,
                      width: 25,
                      borderWidth: 1,
                      borderColor: "#fff",
                      backgroundColor: "#fff",
                      borderRadius: 12.5,
                      transform: [{ translateX: LEFT_MARGIN / 2 }]
                    }}
                    source={{
                      uri: STATIC_URL + myData.images[0].split("uploads")[1]
                    }}
                  />
                ) : presetOption === optionIndex ? (
                  <CachedImage
                    style={{
                      height: 25,
                      width: 25,
                      borderWidth: 1,
                      backgroundColor: "rgb(242,242,242)",
                      borderColor: "rgb(242,242,242)",
                      borderRadius: 12.5,
                      transform: [{ translateX: LEFT_MARGIN / 2 }]
                    }}
                    source={{
                      uri: STATIC_URL + userImage.split("uploads")[1]
                    }}
                  />
                ) : (
                  <View />
                )}
              </View>

              <View
                style={{
                  width: DeviceWidth * 0.5
                }}
              >
                <AnimatableText
                  ref={"imgOptionTextRef"}
                  style={{
                    ...styles.imageOptionText,
                    color: _hasResponse
                      ? rightAnswer || pickedOption === optionIndex
                        ? "#fff"
                        : "#000"
                      : "#000"
                  }}
                >
                  {option}
                </AnimatableText>
              </View>
              <View
                style={{
                  width: DeviceWidth * 0.1
                }}
              />
            </TouchableOpacity>
            {optionIndex <
              game[currentQuestionIndex].questionId.options.length - 1 &&
            game[0].questionId.gameId.value === "WOULD_YOU_RATHER" ? (
              <RegularText
                style={{
                  ...styles.imageOptionText,
                  textAlign: "center"
                }}
              >
                Or
              </RegularText>
            ) : (
              <View />
            )}
          </View>
        );
      }
    );
  };

  // renderOptions = currentQuestionIndex =>{
  //   let {
  //     storeResponses,
  //     myData,
  //     games,
  //     selectedGame,
  //     fromMyProfile
  //   } = this.props;
  //   const game = games[selectedGame];
  //   const self = game[0].postedBy._id === myData._id || fromMyProfile;
  //   const optionsArray = game[currentQuestionIndex].questionId.options;
  //   // option, optionIndex

  // }

  renderOptions = currentQuestionIndex => {
    let {
      storeResponses,
      myData,
      games,
      selectedGame,
      fromMyProfile
    } = this.props;
    const game = games[selectedGame];
    const self = game[0].postedBy._id === myData._id || fromMyProfile;
    return game[currentQuestionIndex].questionId.options.map(
      (option, optionIndex) => {
        let presetOption = parseInt(game[currentQuestionIndex].option);
        let pickedOption = parseInt(game[currentQuestionIndex].response);
        let _hasResponse = isNaN(pickedOption) ? false : true;

        return (
          <TouchableOpacity
            key={optionIndex}
            disabled={self || _hasResponse}
            onPress={() => {
              storeResponses(
                selectedGame,
                currentQuestionIndex,
                optionIndex,
                game[currentQuestionIndex]._id
              );
              this.setState({
                selectedOption: optionIndex
              });
            }}
            style={[
              styles.optionView,
              {
                borderColor: _hasResponse
                  ? optionIndex !== presetOption && optionIndex !== pickedOption
                    ? "#cacaca"
                    : "#0000"
                  : "#cacaca",
                backgroundColor:
                  _hasResponse && optionIndex === presetOption
                    ? CORRECT_RESPONSE_GREEN
                    : _hasResponse && optionIndex === pickedOption
                    ? WRONG_RESPONSE_RED
                    : "#fff"
              }
            ]}
          >
            <AnimatableText
              ref={"optionTextRef"}
              style={[
                styles.optionText,
                {
                  color: _hasResponse
                    ? optionIndex !== presetOption &&
                      optionIndex !== pickedOption
                      ? "#000"
                      : "#fff"
                    : "#000"
                }
              ]}
            >
              {option}
            </AnimatableText>
          </TouchableOpacity>
        );
      }
    );
  };

  clearLocalInterval = () => {
    clearInterval(interval);
  };

  startTimer = () => {
    //** play timer via Animation */
    // interval = setInterval(() => {
    //   this.setState(prevState => {
    //     return {
    //       currentValue: prevState.currentValue + 0.001
    //     };
    //   });
    // }, 10);
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

  handleShare = () => {
    this.clearLocalInterval();
    this.setState({ showShareScreen: true });
    this.openCloserModal();
  };

  reactToGif = (option, type) => {
    const { storeResponses, games, selectedGame } = this.props;
    storeResponses(
      selectedGame,
      0,
      type === "GIF" ? JSON.stringify(option) : `${option}`,
      games[selectedGame][0]._id
    );
    this.giphyPickerRef.snapTo(0);
    console.log("respnse got her eis; 1", option);
  };

  renderGif = () => {
    const { games, selectedGame } = this.props;
    const { renderReactionBottomSheet } = this.state;
    const game = games[selectedGame];

    const parsedQuestion = JSON.parse(game[0].questionId.question);
    const _hasResponse = game[0].response !== undefined;
    const isHavingEmoticon = _hasResponse && game[0].response.length === 1;
    let response;
    if (_hasResponse) {
      response = isHavingEmoticon
        ? parseInt(game[0].response)
        : JSON.parse(game[0].response);
    }
    console.log("respnse got her eis; 2", response);

    const h = parseInt(parsedQuestion.height);
    const w = parseInt(parsedQuestion.width);

    return (
      <>
        <View
          style={{
            flex: 1
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <CachedImage
              source={{ uri: parsedQuestion.originalUrl }}
              style={{
                aspectRatio: w / h,
                width: DeviceWidth * 0.9,
                alignSelf: "center",
                backgroundColor: "#00000010",
                borderRadius: 10
              }}
            />
            {_hasResponse ? (
              isHavingEmoticon ? (
                <AnimatableView
                  animation={"zoomIn"}
                  duration={400}
                  style={{
                    height: 80,
                    width: 80,
                    position: "absolute",
                    zIndex: 2,
                    bottom: -15,
                    left: -15
                  }}
                >
                  <SvgUri height={80} width={80} source={Emojis[response]} />
                </AnimatableView>
              ) : (
                <AnimatableView
                  animation={"zoomIn"}
                  duration={400}
                  style={{
                    width: response.width / 4,
                    height: response.height / 4,
                    borderRadius: 5,
                    position: "absolute",
                    zIndex: 2,
                    bottom: 0
                  }}
                >
                  <CachedImage
                    source={{ uri: response.originalUrl }}
                    style={{
                      width: response.width / 4,
                      height: response.height / 4,
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: "#cacacaa0",
                      backgroundColor: "#cacaca30",
                      alignSelf: "center"
                    }}
                  />
                </AnimatableView>
              )
            ) : (
              <View />
            )}
          </View>
        </View>

        {_hasResponse ? (
          <View />
        ) : (
          <>
            <TouchableOpacity
              onPress={() => {
                this.toggleGiphyPicker();
              }}
              style={{
                ...sharedStyles.justifiedCenter,
                marginTop: 10
              }}
            >
              <Ionicon name={"ios-arrow-up"} color={"#fff"} size={30} />
              <Ionicon
                style={{
                  position: "absolute",
                  top: 12
                }}
                name={"ios-arrow-up"}
                color={"#fff"}
                size={25}
              />
              <RegularText
                style={{
                  color: "#fff",
                  textAlign: "center",
                  marginTop: LEFT_MARGIN / 2
                }}
              >
                Tap to react
              </RegularText>
            </TouchableOpacity>
            {renderReactionBottomSheet ? (
              <BottomSheet
                onCloseEnd={() => {
                  this.setState({ showReactionModal: false });
                }}
                enabledInnerScrolling={false}
                initialSnap={0}
                snapPoints={[-20, DeviceHeight * 0.8]}
                ref={ref => (this.giphyPickerRef = ref)}
                enabledBottomClamp
                renderHeader={this.renderEmoticons}
                callbackNode={this.btmSheetY}
                renderContent={() => {
                  return (
                    <GiphyPicker
                      fromResponse={true}
                      toggleGiphyPicker={this.toggleGiphyPicker}
                      reactToGif={this.reactToGif}
                    />
                  );
                }}
              />
            ) : (
              <View />
            )}
            {this.renderShadow()}
          </>
        )}
      </>
    );
  };

  renderQuestion = () => {
    const { games, selectedGame } = this.props;
    const { currentQuestionIndex } = this.state;
    const game = games[selectedGame];
    const gameId = 0;

    return (
      <View style={styles.questionLayout}>
        <View style={styles.avatarImage}>
          <SvgUri
            height={40}
            width={40}
            source={GAME_LOGOS_COLORFUL[game[0].questionId.gameId.value]}
          />
        </View>
        {game[0].questionId.gameId.key === "WOULD YOU RATHER" ||
        game[0].questionId.gameId.key === "SIMILARITIES" ? (
          <View
            style={{
              height: 15
            }}
          />
        ) : (
          <AnimatableText
            duration={800}
            ref={"questionTextRef"}
            style={{
              ...styles.questionText
            }}
          >
            {gameId === 0 &&
            game[0].questionId.question !== "TWO_TRUTHS_AND_A_LIE"
              ? game[currentQuestionIndex].questionId.question
              : "Spot the lie"}
          </AnimatableText>
        )}

        <AnimatableView ref={"optionViewRef"}>
          <ScrollView>
            {game[0].questionId.gameId.value &&
            GamesWhichHasGreenRedResponses.indexOf(
              game[0].questionId.gameId.value
            ) > -1
              ? gameId === 0
                ? this.renderOptions(currentQuestionIndex)
                : this.renderOptions(0)
              : gameId === 0
              ? this.renderImageOptions(currentQuestionIndex)
              : this.renderImageOptions(0)}
          </ScrollView>
        </AnimatableView>
      </View>
    );
  };

  renderTutorial = () => {
    const { showTutorialLocal } = this.state;
    const {
      showTutorial,
      games,
      fromChatWindow,
      myData,
      selectedGame
    } = this.props;
    const _myCard = games[selectedGame][0].postedBy._id === myData._id;
    if (fromChatWindow) {
      console.log("came inside fromChatWindow");
      if (_myCard) {
        console.log(
          "came inside myCard",
          showTutorialLocal,
          showTutorial,
          games[selectedGame][0].response !== undefined
        );
        if (
          showTutorial &&
          showTutorialLocal &&
          games[selectedGame][0].response !== undefined
        ) {
          console.log("came inside myCard case 1");
          return (
            <VerticalGradientView
              colors={games[selectedGame][0].questionId.gameId.colors}
              style={styles.tutorialLayout}
            >
              <SvgUri
                height={80}
                width={80}
                source={
                  GAME_LOGOS[games[selectedGame][0].questionId.gameId.value]
                }
              />
              <BoldText style={styles.tutorialGameName}>
                {games[selectedGame][0].questionId.gameId.key}
              </BoldText>
              <MediumText
                style={{
                  fontSize:
                    games[selectedGame][0].questionId.gameId.value ===
                    "GUESS_MY_TRAITS"
                      ? 22
                      : 25,
                  ...styles.gameDescText
                }}
              >
                {_myCard
                  ? games[selectedGame][0].questionId.gameId.myDescription
                  : games[selectedGame][0].questionId.gameId.otherDescription}
              </MediumText>
              <TouchableOpacity
                style={styles.tutorialOkayButton}
                onPress={() => {
                  this.setState({ showTutorialLocal: false }, () => {
                    setTimeout(() => {
                      this.startTimer();
                    }, 300);
                  });
                  if (_myCard) {
                    this.props.setMyCardsSeenCount(
                      games[selectedGame][0].questionId.gameId._id
                    );
                  } else {
                    this.props.setOtherCardsSeenCount(
                      games[selectedGame][0].questionId.gameId._id
                    );
                  }
                }}
              >
                <MediumText
                  style={{
                    color: games[selectedGame][0].questionId.gameId.colors[0],
                    paddingVertical: 9,
                    fontSize: 22
                  }}
                >
                  Okay
                </MediumText>
              </TouchableOpacity>
            </VerticalGradientView>
          );
        } else {
          return <View />;
        }
      } else {
        console.log("came inside myCard case 2");
        if (
          showTutorial &&
          showTutorialLocal &&
          games[selectedGame][0].response === undefined
        ) {
          return (
            <VerticalGradientView
              colors={games[selectedGame][0].questionId.gameId.colors}
              style={styles.tutorialLayout}
            >
              <SvgUri
                height={80}
                width={80}
                source={
                  GAME_LOGOS[games[selectedGame][0].questionId.gameId.value]
                }
              />
              <BoldText style={styles.tutorialGameName}>
                {games[selectedGame][0].questionId.gameId.key}
              </BoldText>
              <MediumText
                style={{
                  fontSize:
                    games[selectedGame][0].questionId.gameId.value ===
                    "GUESS_MY_TRAITS"
                      ? 22
                      : 25,
                  ...styles.gameDescText
                }}
              >
                {_myCard
                  ? games[selectedGame][0].questionId.gameId.myDescription
                  : games[selectedGame][0].questionId.gameId.otherDescription}
              </MediumText>
              <TouchableOpacity
                style={styles.tutorialOkayButton}
                onPress={() => {
                  this.setState({ showTutorialLocal: false }, () => {
                    setTimeout(() => {
                      this.startTimer();
                    }, 300);
                  });
                  if (_myCard) {
                    this.props.setMyCardsSeenCount(
                      games[selectedGame][0].questionId.gameId._id
                    );
                  } else {
                    this.props.setOtherCardsSeenCount(
                      games[selectedGame][0].questionId.gameId._id
                    );
                  }
                }}
              >
                <MediumText
                  style={{
                    color: games[selectedGame][0].questionId.gameId.colors[0],
                    paddingVertical: 9,
                    fontSize: 22
                  }}
                >
                  Okay
                </MediumText>
              </TouchableOpacity>
            </VerticalGradientView>
          );
        }
      }
    } else {
      if (
        showTutorial &&
        showTutorialLocal &&
        games[selectedGame][0].response === undefined
      ) {
        return (
          <VerticalGradientView
            colors={games[selectedGame][0].questionId.gameId.colors}
            style={styles.tutorialLayout}
          >
            <SvgUri
              height={80}
              width={80}
              source={
                GAME_LOGOS[games[selectedGame][0].questionId.gameId.value]
              }
            />
            <BoldText style={styles.tutorialGameName}>
              {games[selectedGame][0].questionId.gameId.key}
            </BoldText>
            <MediumText
              style={{
                fontSize:
                  games[selectedGame][0].questionId.gameId.value ===
                  "GUESS_MY_TRAITS"
                    ? 22
                    : 25,
                ...styles.gameDescText
              }}
            >
              {_myCard
                ? games[selectedGame][0].questionId.gameId.myDescription
                : games[selectedGame][0].questionId.gameId.otherDescription}
            </MediumText>
            <TouchableOpacity
              style={styles.tutorialOkayButton}
              onPress={() => {
                this.setState({ showTutorialLocal: false }, () => {
                  setTimeout(() => {
                    this.startTimer();
                  }, 300);
                });
                this.props.setOtherCardsSeenCount(
                  games[selectedGame][0].questionId.gameId._id
                );
              }}
            >
              <MediumText
                style={{
                  color: games[selectedGame][0].questionId.gameId.colors[0],
                  paddingVertical: 9,
                  fontSize: 22
                }}
              >
                Okay
              </MediumText>
            </TouchableOpacity>
          </VerticalGradientView>
        );
      }
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
    }, 300);
  };

  closeShareModal = () => {
    this.setState({ showShareScreen: false });
    this.closeCloserModal();
    this.startTimer();
  };

  renderCloserModal = () => {
    const {
      showShareScreen,
      isModalVisible,
      currentQuestionIndex
    } = this.state;
    const { games, selectedGame } = this.props;

    return (
      <CloserModal isModalVisible={isModalVisible} ref={"modalRef"}>
        {showShareScreen ? (
          <SharePreview
            closeModal={this.closeShareModal}
            content={games[selectedGame][currentQuestionIndex].questionId}
          />
        ) : (
          <View />
        )}
      </CloserModal>
    );
  };

  _onLongPress = ({ nativeEvent }) => {
    if (nativeEvent.state === State.ACTIVE) {
      alert("active");
    }
    if (nativeEvent.state === State.END) {
      // this.startTimer();
    }
  };

  _onSingleTap = ({ nativeEvent }) => {
    const { state, x, y } = nativeEvent;
    if (x < DeviceWidth * 0.3 && state === State.END) {
      this.moveToPrevious();
    } else if (
      x > DeviceWidth * 0.7 &&
      state === State.END &&
      y > DeviceHeight * 0.15
    ) {
      this.moveToNext();
    }
  };

  render() {
    const {
      translateX,
      actualTranslateY,
      width,
      height,
      scale,
      opacityCard,
      opacityResponse,
      top,
      borderRadius,
      longPressState,
      selectedQuestion,
      pState,
      animatedBackTapCount
    } = this;
    let {
      games,
      selectedGame,
      myData,
      targetUser,
      fromMyProfile,
      fromPresetModal
    } = this.props;
    const game = games[selectedGame];
    const _myCard = game[0].postedBy._id === myData._id;
    const gameId = 0;

    return (
      <View
        style={{
          zIndex: 1000,
          position: "absolute"
        }}
      >
        {this.renderAnimatedCode()}
        <PanGestureHandler
          activeOffsetY={10}
          onGestureEvent={this._onPanGestureEvent}
          onHandlerStateChange={this._onPanGestureEvent}
        >
          <AnimatedVerticalGradient
            style={{
              alignItems: "center",
              borderRadius,
              opacity: opacityResponse,
              height,
              width,
              transform: [
                {
                  translateX
                },
                {
                  translateY: actualTranslateY
                }
              ],
              zIndex: 1,
              alignSelf: "center"
            }}
            colors={game[0].questionId.gameId.colors}
          >
            <TapGestureHandler
              numberOfTaps={1}
              enabled
              onHandlerStateChange={this._onSingleTap}
            >
              <LongPressGestureHandler
                onHandlerStateChange={this._onLongPress}
                minDurationMs={500}
              >
                <Animated.View
                  style={{
                    alignItems: "center",
                    transform: [
                      {
                        scale
                      },
                      {
                        translateY: top
                      }
                    ]
                  }}
                >
                  {this.renderTutorial()}

                  <BackgroundIcon
                    bgIcon={BACKGROUND_ICONS[game[0].questionId.gameId.value]}
                  />
                  <StatusBar animated hidden />
                  <RowView
                    style={{
                      position: "absolute",
                      top: 10,
                      zIndex: 99
                    }}
                  >
                    {game.map((post, id) => (
                      <ProgressResponse
                        selectedIndex={selectedQuestion}
                        pState={pState}
                        totalNumber={game.length}
                        index={id}
                        onAnimationEnd={() => {
                          const { currentQuestionIndex } = this.state;
                          if (id === currentQuestionIndex) {
                            this.moveToNext();
                          }
                        }}
                        key={id}
                        longPressState={longPressState}
                        animatedBackTapCount={animatedBackTapCount}
                      />
                    ))}
                  </RowView>
                  <View style={styles.nameAndAvtarView}>
                    <RowView>
                      <View
                        style={{
                          height: 45,
                          width: 45,
                          borderRadius: 22.5,
                          backgroundColor: "#fff",
                          marginLeft: LEFT_MARGIN / 2,
                          ...sharedStyles.justifiedCenter
                        }}
                      >
                        <CircularImage
                          height={40}
                          source={{
                            uri: _myCard
                              ? myData &&
                                myData.images &&
                                myData.images.length > 0 &&
                                STATIC_URL +
                                  myData.images[0].split("uploads")[1]
                              : targetUser &&
                                targetUser.images &&
                                targetUser.images.length > 0 &&
                                STATIC_URL +
                                  targetUser.images[0].split("uploads")[1]
                          }}
                        />
                      </View>

                      <View>
                        <MediumText style={styles.userName}>
                          {fromMyProfile
                            ? "Your Profile Card"
                            : _myCard
                            ? "Your Card"
                            : userNamify(targetUser)}
                        </MediumText>

                        {game[0].questionId.byContentTeam === "false" ? (
                          <RegularText
                            style={{ color: "#fff", paddingLeft: 10 }}
                          >
                            Edited
                          </RegularText>
                        ) : (
                          <View />
                        )}
                      </View>
                    </RowView>
                    <TouchableOpacity
                      onPress={() => {
                        this.goingBack.setValue(1);
                      }}
                      style={{
                        height: 40,
                        width: 40
                      }}
                    >
                      <Ionicon name={"md-close"} size={30} color={"#fff"} />
                    </TouchableOpacity>
                  </View>
                  {this.renderCloserModal(game)}
                  <BoldText style={styles.gameName}>
                    {game[0].questionId.gameId.key}
                  </BoldText>
                  {game[0].questionId.gameId.value === "THE_PERFECT_GIF"
                    ? this.renderGif(game)
                    : this.renderQuestion(game, gameId)}
                </Animated.View>
              </LongPressGestureHandler>
            </TapGestureHandler>
            <TouchableOpacity
              onPress={() => this.handleShare()}
              style={styles.shareView}
            >
              <Ionicon
                name={"md-share-alt"}
                color={
                  game[0].questionId.gameId.colors
                    ? game[0].questionId.gameId.colors[0]
                    : "#cacaca"
                }
                size={32}
              />
            </TouchableOpacity>
          </AnimatedVerticalGradient>
        </PanGestureHandler>
        <Animated.View
          style={{
            opacity: opacityCard,
            zIndex: 0,
            height,
            width,
            transform: [
              {
                translateX
              },
              {
                translateY: actualTranslateY
              }
            ],
            ...StyleSheet.absoluteFillObject
          }}
        >
          <GameContainer
            style={{ margin: -4 }}
            height={
              fromPresetModal ? DeviceWidth * 0.5 * 0.75 : DeviceWidth * 0.5
            }
            width={
              fromPresetModal ? DeviceWidth * 0.37 * 0.75 : DeviceWidth * 0.37
            }
            colors={game[0].questionId.gameId.colors}
            fromMyProfile={fromMyProfile}
            gameName={game[0].questionId.gameId.key}
            gameValue={game[0].questionId.gameId.value}
          />
          {fromMyProfile ? (
            <View
              style={{
                alignSelf: "center",
                backgroundColor: "#fff",
                alignItems: "center",
                shadowColor: "#cacaca00",
                shadowOffset: {
                  height: 0,
                  width: 0
                },
                shadowOpacity: 0.05,
                shadowRadius: 20,
                height: 40,
                width: 40,
                borderRadius: 20,
                marginTop: -30,
                justifyContent: "center",
                borderWidth: 0.5,
                borderColor: "#cacaca",
                marginBottom: 5
              }}
            >
              <Ionicon
                name={"md-create"}
                size={25}
                color={game[0].questionId.gameId.colors[1]}
              />
            </View>
          ) : (
            <View />
          )}
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tutorialGameName: {
    color: "#fff",
    fontSize: 23,
    marginTop: 10
  },
  tutorialLayout: {
    position: "absolute",
    height: DeviceHeight,
    width: DeviceWidth,
    zIndex: 2,
    alignItems: "center",
    justifyContent: "center"
  },
  gameDescText: {
    color: "#fff",
    textAlign: "center",
    paddingHorizontal: DeviceWidth * 0.1,
    marginTop: DeviceHeight * 0.1,
    marginBottom: DeviceHeight * 0.04
  },
  tutorialOkayButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 30,
    width: DeviceWidth * 0.32,
    shadowColor: `#000`,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2
  },
  userName: {
    color: "#fff",
    fontSize: 18,
    alignSelf: "center",
    paddingHorizontal: 10,
    paddingTop: 10
  },
  userImage: {
    height: 35,
    width: 35,
    borderRadius: 17.5,
    marginLeft: 10
  },
  nameAndAvtarView: {
    flexDirection: "row",
    marginTop: 35,
    alignSelf: "flex-start",
    justifyContent: "space-between",
    width: DeviceWidth
  },
  contentHeader: {
    fontSize: 20,
    color: "#59147E",
    textAlign: "center",
    fontWeight: "500",
    marginTop: 20
  },
  gameName: {
    fontSize: 26,
    color: "#fff",
    textAlign: "center",
    marginTop: 25
  },
  shareView: {
    alignItems: "center",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 20,
    borderRadius: 30,
    paddingHorizontal: 11,
    paddingVertical: 5,
    shadowColor: `#000`,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2
  },
  guessText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 17,
    fontWeight: "bold",
    fontFamily: "Proxima Nova"
  },
  guessTextView: {
    backgroundColor: "rgba(0,0,0,0.1)",
    height: 40,
    width: DeviceWidth,
    justifyContent: "center",
    marginTop: 85
  },
  optionText: {
    fontSize: 20
  },
  imageOptionText: {
    fontSize: 18,
    textAlign: "center",
    paddingHorizontal: 7.5
  },
  imageOptionView: {
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: "center",
    marginVertical: 15,
    flexDirection: "row",
    width: DeviceWidth * 0.7
  },
  optionView: {
    padding: 12,
    borderRadius: 30,
    borderWidth: 1,
    alignItems: "center",
    marginVertical: 15,
    marginHorizontal: 20,
    fontWeight: "200"
  },
  questionText: {
    fontSize: 26,
    color: "#1E2432",
    marginVertical: 10,
    textAlign: "center",
    paddingHorizontal: LEFT_MARGIN,
    ...sharedStyles.mediumText
  },
  avatarImage: {
    height: 72,
    width: 72,
    borderRadius: 36,
    marginTop: -36,
    alignSelf: "center",
    backgroundColor: "#fff",
    shadowColor: `#000`,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    alignItems: "center",
    justifyContent: "center"
  },
  avatar: {
    alignItems: "center"
  },
  questionLayout: {
    flexDirection: "column",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 10,
    transform: [{ translateY: DeviceHeight * 0.1 }], // height of the top elementsContainer
    marginHorizontal: 20,
    shadowColor: `#000`,
    shadowRadius: 10,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    minWidth: DeviceWidth * 0.85,
    maxHeight: DeviceHeight * 0.54
  },
  baseLayout: {
    flex: 1,
    alignItems: "center"
  },
  closeIcon: {
    position: "absolute",
    right: 20,
    top: 30
  },
  bgIconsView: {
    position: "absolute",
    opacity: 0.2,
    zIndex: -1
  }
});

const mapStateToProps = state => {
  return {
    myData: state.info.userInfo,
    myCardsCount: state.tutorial.myCards,
    othersCardsCount: state.tutorial.othersCards
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setMyCardsSeenCount: bindActionCreators(setMyCardsSeenCount, dispatch),
    setOtherCardsSeenCount: bindActionCreators(setOtherCardsSeenCount, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewResponse);
