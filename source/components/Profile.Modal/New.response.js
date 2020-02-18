import React, { Component } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Text,
  ScrollView,
  Animated
} from "react-native";
import ViewShot, { captureRef } from "react-native-view-shot";
import Ionicon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import { DeviceHeight, DeviceWidth } from "../../../src/config/Device";
import { Bar as ProgressBar } from "react-native-progress";
import Share from "react-native-share";
import {
  PURPLE,
  LIGHT_PURPLE,
  ORANGE,
  LIGHT_ORANGE,
  GREEN,
  LIGHT_GREEN,
  CORRECT_RESPONSE_GREEN,
  WRONG_RESPONSE_RED,
  colorKeys
} from "../../../src/config/Colors";
import ShareScreenshot from "../../../src/components/Common/SharingScreenShot";
var interval;

class NewResponse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      games: props.games,
      selectedGame: props.selectedGame,
      userName: props.userName,
      selectedGameIndex: Object.keys(props.games).indexOf(props.selectedGame),
      currentQuestionIndex: 0,
      animatedScale: new Animated.Value(0),
      currentValue: 0,
      doNotUpdate: false,
      shareResult: null,
      showShareScreen: false
    };
    this.scrollRef = React.createRef();
  }
  componentDidMount = () => {
    setTimeout(() => {
      Animated.timing(this.state.animatedScale, {
        toValue: 1,
        duration: 200
      }).start(() => {
        // this.startTimer();
      });
    }, 200);
  };

  nextGameExists = () => {
    let { games, selectedGameIndex } = this.state;

    return Object.keys(games).length - 1 > selectedGameIndex;
  };

  prevGameExists = () => {
    let { selectedGameIndex } = this.state;
    return selectedGameIndex !== 0;
  };

  nextQuestionExists = () => {
    let { games, selectedGame, currentQuestionIndex } = this.state;
    return currentQuestionIndex < games[selectedGame].length - 1;
  };

  prevQuestionExists = () => {
    let { currentQuestionIndex } = this.state;
    return currentQuestionIndex !== 0;
  };

  componentDidUpdate = async (prevProps, prevState, snapshot) => {
    let currentValue = parseInt(this.state.currentValue);
    let prevCurrentValue = parseInt(prevState.currentValue);
    if (currentValue > prevCurrentValue && !this.state.doNotUpdate) {
      // Timer ends here
      let { currentQuestionIndex, selectedGameIndex, fromX } = this.state;
      if (this.nextQuestionExists()) {
        this.setState({ currentQuestionIndex: currentQuestionIndex + 1 });
      } else {
        if (this.nextGameExists()) {
          this.scrollRef.getNode().scrollTo({
            x: DeviceWidth * selectedGameIndex
          });
          this.setState(
            {
              currentValue: 0,
              currentQuestionIndex: 0,
              selectedGameIndex: selectedGameIndex + 1,
              fromX: fromX * (selectedGameIndex + 3)
            },
            () => this.props.changeSelectedGame(selectedGameIndex + 1)
          );
        } else {
          alert("No more games");
          // this.startAnimation(false);
        }
      }
    }
  };

  renderOptions = (currentQuestionIndex, games, game) => {
    let { storeResponses, self } = this.props;
    console.log(" self is >>>", self);
    return games[game][0].questionId.options.map((option, optionIndex) => {
      let presetOption = parseInt(games[game][0].option);
      let pickedOption = games[game][0].response;
      let _hasResponse = pickedOption !== undefined;

      return (
        <TouchableOpacity
          key={optionIndex}
          disabled={self || _hasResponse}
          onPress={() =>
            storeResponses(
              game,
              currentQuestionIndex,
              optionIndex,
              games[game][currentQuestionIndex]._id
            )
          }
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
          <Text
            style={[
              styles.optionText,
              {
                color: _hasResponse
                  ? optionIndex !== presetOption && optionIndex !== pickedOption
                    ? "#000"
                    : "#fff"
                  : "#000"
              }
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  clearLocalInterval = () => {
    clearInterval(interval);
  };

  startTimer = () => {
    interval = setInterval(() => {
      this.setState(prevState => {
        return {
          currentValue: prevState.currentValue + 0.01
        };
      });
    }, 50);
  };
  handleShare = async url => {
    alert(" got url check console");

    console.log(" url for screenshot is &&&", url);
    const shareOptions = {
      title: "Share file",
      url,
      failOnCancel: false
    };

    try {
      const ShareResponse = await Share.open(shareOptions);
      this.setState({
        shareResult: JSON.stringify(ShareResponse)
      });
    } catch (error) {
      console.log("Error =>", error);
    }
  };
  handleCapture = gameIndex => {
    this.setState({ showShareScreen: true });
  };
  render() {
    let {
      // games,
      selectedGameIndex,
      userName,
      currentQuestionIndex,
      animatedScale,
      currentValue,
      showShareScreen
    } = this.state;
    let { storeResponses, userId, games, selectedGame } = this.props;
    console.log("games here at new response are; ", games[selectedGame]);

    const currentGameKey = Object.keys(games)[selectedGameIndex];
    return (
      <>
        <ShareScreenshot
          gameName={currentGameKey}
          currentQuestionIndex={currentQuestionIndex}
          onCapture={url => {
            console.log(" urls of result is ", url);
            this.handleShare(url);
          }}
          showModal={showShareScreen}
          hideModal={() =>
            this.setState({
              showShareScreen: false
            })
          }
          renderQuestion={(gameName, questionIndex) => {
            const currentGame = games[gameName];
            return (
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={{}}>
                  {currentGame &&
                    currentGame[questionIndex] &&
                    currentGame[questionIndex].question &&
                    currentGame[questionIndex].question.question}
                </Text>
              </View>
            );
          }}
          renderAnswers={(gameName, questionIndex) => {
            const currentGame = games[gameName];
            return (
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "wrap"
                }}
              >
                {currentGame &&
                  currentGame[questionIndex] &&
                  currentGame[questionIndex].question &&
                  currentGame[questionIndex].question.options &&
                  currentGame[questionIndex].question.options.map(
                    (option, i) => {
                      return (
                        <Text
                          key={i}
                          style={{
                            padding: 10,
                            borderWidth: 2,
                            borderColor: PURPLE
                          }}
                        >
                          {option}
                        </Text>
                      );
                    }
                  )}
              </View>
            );
          }}
        />

        <Animated.ScrollView
          horizontal={true}
          ref={scrollView => (this.scrollRef = scrollView)}
          pagingEnabled={true}
          onScrollBeginDrag={this.clearLocalInterval}
          onScrollEndDrag={this.startTimer}
          style={{
            backgroundColor: "#cacaca",
            transform: [{ scale: animatedScale }]
          }}
          showsHorizontalScrollIndicator={false}
          snapToAlignment={"center"}
          contentOffset={{ x: selectedGameIndex * DeviceWidth }}
        >
          {Object.keys(games).map((game, gameId) => {
            return (
              <View
                key={gameId}
                style={{
                  height: DeviceHeight,
                  width: DeviceWidth
                }}
              >
                <ViewShot ref="question">
                  <LinearGradient
                    style={{
                      alignItems: "center",
                      height: DeviceHeight,
                      width: DeviceWidth
                    }}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    colors={games[game][0].questionId.gameId.colors}
                  >
                    <StatusBar hidden />
                    <View
                      style={{
                        flexDirection: "row",
                        position: "absolute",
                        top: 20,
                        zIndex: 9999
                      }}
                    >
                      {games[game].map((post, id) => {
                        return (
                          <ProgressBar
                            animated={true}
                            style={{
                              marginTop: 0,
                              marginHorizontal: 1.5
                            }}
                            key={id}
                            color="#fff"
                            height={4}
                            progress={
                              selectedGameIndex === gameId
                                ? currentValue - id
                                : 0
                            }
                            width={DeviceWidth / games[game].length - 2}
                            borderRadius={10}
                            unfilledColor={"rgba(0, 0, 0,0.1)"}
                            borderWidth={0}
                          />
                        );
                      })}
                    </View>
                    <View style={styles.nameAndAvtarView}>
                      <Image
                        style={styles.userImage}
                        source={require("../../assets/images/riya.png")}
                      />
                      <Text style={styles.userName}>{userName}</Text>
                    </View>

                    <Text style={styles.contentHeader}>
                      React to '{`${userName}`}' to become friends!
                    </Text>
                    <Text style={styles.gameName}>
                      {games[game][0].questionId.gameId.key}
                    </Text>
                    <View style={styles.questionLayout}>
                      <View style={styles.avatarImage}>
                        <Ionicon
                          name={"ios-cloud-circle"}
                          size={40}
                          color={"#cacaca"}
                        />
                      </View>

                      <Text style={styles.questionText}>
                        {gameId === selectedGameIndex &&
                        games[game][0].questionId.question !==
                          "TWO_TRUTHS_AND_A_LIE"
                          ? games[game][0].questionId.question
                          : games[game][0].questionId.question}
                      </Text>

                      <ScrollView
                        style={{
                          maxHeight: DeviceHeight * 0.33
                        }}
                      >
                        {gameId === selectedGameIndex
                          ? this.renderOptions(
                              currentQuestionIndex,
                              games,
                              game
                            )
                          : this.renderOptions(0, games, game)}
                      </ScrollView>
                    </View>
                    <View style={styles.guessTextView}>
                      <Text style={styles.guessText}>
                        Let's see whether you can guess about them!
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => this.handleCapture()}
                      style={styles.shareView}
                    >
                      <Ionicon
                        name={"md-share-alt"}
                        color={"#cacaca"}
                        size={32}
                      />
                    </TouchableOpacity>
                  </LinearGradient>
                </ViewShot>
              </View>
            );
          })}
        </Animated.ScrollView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  userName: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    alignSelf: "center",
    paddingHorizontal: 10
  },
  userImage: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginLeft: 10
  },
  nameAndAvtarView: {
    flexDirection: "row",
    marginTop: 35,
    alignSelf: "flex-start"
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
    fontWeight: "800",
    marginTop: 20
  },
  shareView: {
    alignItems: "center",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 20,
    borderRadius: 30,
    paddingHorizontal: 11,
    paddingVertical: 5
  },
  guessText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 17
  },
  guessTextView: {
    backgroundColor: "rgba(0,0,0,0.3)",
    height: 40,
    width: DeviceWidth,
    justifyContent: "center",
    marginTop: 85
  },
  optionText: {
    fontSize: 20
  },
  optionView: {
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    marginVertical: 15,
    marginHorizontal: 20,
    fontWeight: "200"
  },
  questionText: {
    fontSize: 26,
    color: "#1E2432",
    fontWeight: "700",
    marginVertical: 10,
    textAlign: "center"
  },
  avatarImage: {
    height: 80,
    width: 80,
    borderRadius: 40,
    marginTop: -40,
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
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    minWidth: DeviceWidth * 0.85,
    maxHeight: DeviceHeight * 0.45
  },
  baseLayout: {
    flex: 1,
    alignItems: "center"
  },
  closeIcon: {
    position: "absolute",
    right: 20,
    top: 30
  }
});

export default NewResponse;
