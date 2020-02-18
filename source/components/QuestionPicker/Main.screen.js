import Lodash from "lodash";
import React, { Component } from "react";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { LEVEL_THREE_THRESHOLD } from "../../config/Constants";
import { DeviceHeight, DeviceWidth } from "../../config/Device";
import { updateContentQuestions } from "../../redux/actions/content";
import { scrollQuestionCardsAction } from "../../redux/actions/nav";
import { sharedStyles } from "../../styles/Shared";
import MediumText from "../Texts/MediumText";
import * as QuestionApi from "./../../network/question";
import CardsHolder from "./Cards.holder";

const { divide, multiply, createAnimatedComponent, Value } = Animated;

const AnimatedScrollView = createAnimatedComponent(ScrollView);

const SCROLL_HOLDER_WIDTH_FACTOR = 0.2;

class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      optionViewMode: false,
      refreshLoading: false,
      showTutorial: false,
      currentCardIndex: null,
      stateGameNames: []
    };
    this.animatedIndicatorPosition = new Value(0);
    this.scrollRef = React.createRef();
    this.giphyPickerRef = React.createRef();
  }

  // scrollCardsTo = i => {
  //   this.scrollRef.getNode().scrollToIndex({ index: i });
  // };

  scrollTo = i => {
    this.scrollRef.getNode().scrollTo({ x: DeviceWidth * 0.92 * i });
  };

  componentWillReceiveProps = nextProps => {
    const {
      scrollQuestionCards,
      gameNames,
      scrollQuestionCardsAction
    } = nextProps;
    if (scrollQuestionCards) {
      const foundGame = gameNames.find(
        game => game.value === scrollQuestionCards
      );
      const foundGameIndex = gameNames.indexOf(foundGame);
      // this.setState({ firstCardItem: foundGameIndex });
      // this.scrollCardsTo(foundGameIndex);
      this.scrollTo(foundGameIndex);
      scrollQuestionCardsAction(undefined);

      // setTimeout(() => {
      //   this.setState({ showTutorial: true });
      // }, 1600);
    }
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    const { props, state } = this;

    const isOptionViewModeChanged =
      nextState.optionViewMode !== state.optionViewMode;
    const isRefreshLoadingChanged =
      nextState.refreshLoading !== state.refreshLoading;
    const areStateGamesdifferent =
      nextState.stateGameNames !== state.stateGameNames;
    const isShowTutorialChanged = nextState.showTutorial !== state.showTutorial;
    const isCurrentCardIndexChanged =
      nextState.currentCardIndex !== state.currentCardIndex;

    const isUserInfoPostDifferent =
      nextProps.userInfo.posts !== this.props.userInfo.posts;
    const arePostsDifferent = nextProps.posts !== props.posts;
    const isScrollQuestionCardsDifferent =
      nextProps.scrollQuestionCards !== props.scrollQuestionCards;
    const areSeenQuestionsDifferent =
      nextProps.seenQuestions !== props.seenQuestions;
    const isContentDifferent =
      nextProps.contentQuestions !== props.contentQuestions;
    const areRoomsDifferent = nextProps.rooms !== props.rooms;
    const isSelectedRoomDifferent =
      nextProps.selectedRoomId !== props.selectedRoomId;
    const isCurrentChatScreenIndexDifferent =
      nextProps.currentChatScreenIndex !== props.currentChatScreenIndex;
    const arePlanpricesDifferent = nextProps.planPrices !== props.planPrices;
    const areExpenseTutorialsDifferent =
      nextProps.expenseTutorials !== props.expenseTutorials;
    const isQPickerCountDifferent =
      nextProps.questionPickersCount !== props.questionPickersCount;

    if (
      isUserInfoPostDifferent ||
      arePostsDifferent ||
      isScrollQuestionCardsDifferent ||
      areSeenQuestionsDifferent ||
      isContentDifferent ||
      areRoomsDifferent ||
      isSelectedRoomDifferent ||
      isCurrentChatScreenIndexDifferent ||
      arePlanpricesDifferent ||
      areExpenseTutorialsDifferent ||
      isQPickerCountDifferent ||
      isOptionViewModeChanged ||
      isRefreshLoadingChanged ||
      isShowTutorialChanged ||
      areStateGamesdifferent ||
      isCurrentCardIndexChanged
    ) {
      return true;
    } else {
      return false;
    }
  };

  setOptionViewMode = (optionViewMode, selectedGameId) => {
    this.setState({ optionViewMode, selectedGameId });
    this.props.enableBottomSheetGesture(!optionViewMode);
  };

  refetchQuestion = async (category, gameId, showAnimationCb) => {
    this.setState({
      refreshLoading: true
    });
    const { seenQuestions = [], updateContentQuestions } = this.props;
    const exactSeenQuestion = seenQuestions.find(seenQObj => {
      console.log(" each of find is ", seenQObj);
      if (seenQObj.gameId === gameId && seenQObj.category === category) {
        return true;
      }
    });
    console.log(
      " exact one is ",
      gameId,
      category,
      exactSeenQuestion,
      seenQuestions
    );
    if (exactSeenQuestion !== undefined) {
      const {
        gameId: _gameId,
        category: _cat,
        qIndex,
        tappedCount
      } = exactSeenQuestion;
      QuestionApi.getLatestQuestions(
        _gameId,
        _cat,
        qIndex,
        tappedCount,
        newQuestionsRes => {
          console.log(" new questions ", newQuestionsRes);
          if (newQuestionsRes.success) {
            this.setState(
              {
                refreshLoading: false
              },
              () => {
                updateContentQuestions(newQuestionsRes.data.data);
                setTimeout(() => {
                  showAnimationCb(true);
                }, 200);
              }
            );
          }
        }
      );
    } else {
      alert(" error ");
      this.setState({
        refreshLoading: false
      });
    }
  };
  refreshQuestions = (gameId, animationCallback) => {
    const { fromChatWindow, roomLevel, isFriends } = this.props;
    console.log(" room level is ", roomLevel);
    if (fromChatWindow) {
      const requiredQuestionsCat =
        roomLevel > LEVEL_THREE_THRESHOLD ? "3" : "2";
      console.log("requiredQuestionsCat ", requiredQuestionsCat);
      this.refetchQuestion(requiredQuestionsCat, gameId, animationCallback);
    } else {
      this.refetchQuestion("1", gameId, animationCallback);
    }
  };

  closeQuestionPicker = () => {
    // this.props.toggleQuestionPicker(false);
    this.props.afterSend();
  };

  toggleGifPicker = () => {
    this.props.toggleGifPicker();
  };

  componentDidMount = () => {
    let { gameNames, roomLevel, isFriends } = this.props;

    const isConfesionsAllowed = isFriends && roomLevel >= LEVEL_THREE_THRESHOLD;

    let stateGameNames = [];
    gameNames.forEach(element => {
      if (!isConfesionsAllowed && element.value === "CONFESSIONS") {
        return null;
      }
      if (!isFriends && element.value === "21_QUESTIONS") {
        return null;
      } else {
        stateGameNames.push(element);
      }
    });
    this.setState({ stateGameNames });
  };

  setTutorialOverlayCondition = () => {
    this.setState({ showTutorial: false });
  };

  onMomentumScrollEndHandler = evt => {
    let currentOffset = evt.nativeEvent.contentOffset.x;
    let newCardIndex = Math.round(currentOffset / (DeviceWidth * 0.92));
    const { currentCardIndex } = this.state;

    if (currentCardIndex !== newCardIndex) {
      this.setState({ currentCardIndex: newCardIndex });
    }
  };
  // renders() {
  //   return <View />;
  // }

  render() {
    let {
      optionViewMode,
      refreshLoading,
      stateGameNames,
      showTutorial,
      currentCardIndex
    } = this.state;

    let {
      fromChatWindow,
      selectedGame,
      gameNames,
      roomLevel,
      openCloseQuestionPicker,
      toggleQuestionPicker
    } = this.props;

    const onScrollHandler = Animated.event(
      [
        {
          nativeEvent: { contentOffset: { x: this.animatedIndicatorPosition } }
        }
      ],
      { useNativeDriver: true }
    );

    const NOB_WIDTH =
      stateGameNames.length > 0
        ? (DeviceWidth * SCROLL_HOLDER_WIDTH_FACTOR) / stateGameNames.length
        : 1;
    const translateX = this.animatedIndicatorPosition.interpolate({
      inputRange: [0, DeviceWidth * 0.92],
      outputRange: [0, NOB_WIDTH]
    });

    return (
      <KeyboardAvoidingView behavior={"position"}>
        <View
          style={{ height: DeviceHeight * 0.1, justifyContent: "space-evenly" }}
        >
          {fromChatWindow ? (
            <View
              style={{
                height: DeviceHeight * 0.04
              }}
            />
          ) : (
            <View
              style={{
                height: DeviceHeight * 0.04,
                paddingHorizontal: 15,
                backgroundColor: "#000",
                borderRadius: 30,
                transform: [
                  {
                    translateY: -DeviceHeight * 0.0025
                  }
                ],
                alignSelf: "center",
                ...sharedStyles.justifiedCenter
              }}
            >
              <MediumText style={{ color: "#fff" }}>
                Currently Editing : CARD {this.props.selectedGameIndex + 1}
              </MediumText>
            </View>
          )}

          {stateGameNames.length > 0 && !optionViewMode ? (
            <View style={styles.scrollHolder}>
              <Animated.View
                style={{
                  width: divide(
                    multiply(DeviceWidth, SCROLL_HOLDER_WIDTH_FACTOR),
                    stateGameNames.length
                  ),
                  transform: [
                    {
                      translateX
                    }
                  ],
                  backgroundColor: "#00000090",
                  // stateGameNames.length > 0 && currentCardIndex !== null
                  //   ? stateGameNames[currentCardIndex].colors[0]
                  //   : "#fff",
                  ...styles.scrollIndicator
                }}
              />
            </View>
          ) : (
            <View />
          )}
        </View>

        <AnimatedScrollView
          horizontal={true}
          keyboardShouldPersistTaps={"always"}
          scrollEnabled={!optionViewMode && !showTutorial}
          disableIntervalMomentum={true}
          scrollEventThrottle={1}
          onScroll={onScrollHandler}
          decelerationRate={"fast"}
          onMomentumScrollEnd={this.onMomentumScrollEndHandler}
          snapToOffsets={Lodash.range(gameNames.length).map(
            h => DeviceWidth * 0.92 * h
          )}
          ref={ref => (this.scrollRef = ref)}
        >
          {stateGameNames.map((item, index) => (
            <CardsHolder
              roomLevel={roomLevel}
              refreshLoading={refreshLoading}
              showOneTimeTutorial={this.props.showOneTimeTutorial}
              key={index}
              selectedGame={selectedGame}
              refreshQuestions={this.refreshQuestions}
              item={item}
              currentCardIndex={currentCardIndex}
              setTutorialOverlayCondition={this.setTutorialOverlayCondition}
              currentGame={stateGameNames[currentCardIndex || 0]._id}
              index={index}
              fromChatWindow={fromChatWindow}
              toggleQuestionPicker={toggleQuestionPicker}
              openCloseQuestionPicker={openCloseQuestionPicker}
              setOptionViewMode={this.setOptionViewMode}
              optionViewMode={optionViewMode}
              openBuyGemsModal={this.props.openBuyGemsModal}
              openConsumptionModal={this.props.openConsumptionModal}
              onReplaceGame={this.props.onReplaceGame}
              onFavRemoved={key => {
                console.log(" key in parent for removing ");
                this.props.onFavRemoved(key);
              }}
              onFavExeeced={this.props.onFavExeeced}
              toggleGifPicker={this.toggleGifPicker}
            />
          ))}
        </AnimatedScrollView>

        {/* <AnimatedFlatList
          // extraData={{ ...this.state, ...this.props }}
          onScroll={onScrollHandler}
          scrollEnabled={!optionViewMode}
          horizontal
          // onScrollEndDrag={this.onMomentumScrollEndHandler}
          onMomentumScrollEnd={this.onMomentumScrollEndHandler}
          showsHorizontalScrollIndicator={false}
          data={stateGameNames}
          keyExtractor={item => item._id}
          disableIntervalMomentum
          decelerationRate={"fast"}
          snapToOffsets={Lodash.range(stateGameNames.length).map(
            h => DeviceWidth * 0.92 * h
          )}
          ref={ref => (this.scrollRef = ref)}
          renderItem={({ item, index }) => {
            return (
              <CardsHolder
                roomLevel={roomLevel}
                showTutorial={showTutorial}
                refreshLoading={refreshLoading}
                key={index}
                gameNames={gameNames}
                selectedGame={selectedGame}
                refreshQuestions={this.refreshQuestions}
                item={item}
                currentCardIndex={currentCardIndex}
                setTutorialOverlayCondition={this.setTutorialOverlayCondition}
                currentGame={stateGameNames[currentCardIndex || 0]._id}
                index={index}
                fromChatWindow={fromChatWindow}
                toggleQuestionPicker={this.closeQuestionPicker}
                openCloseQuestionPicker={openCloseQuestionPicker}
                setOptionViewMode={this.setOptionViewMode}
                optionViewMode={optionViewMode}
                openBuyGemsModal={props => {
                  this.props.openBuyGemsModal(props);
                }}
                openConsumptionModal={props => {
                  this.props.openConsumptionModal(props);
                }}
                onReplaceGame={this.props.onReplaceGame}
                onFavRemoved={key => {
                  console.log(" key in parent for removing ");
                  this.props.onFavRemoved(key);
                }}
                onFavExeeced={this.props.onFavExeeced}
                toggleGifPicker={this.toggleGifPicker}
              />
            );
          }}
        /> */}
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  closingBar: {
    height: 5,
    borderRadius: 30,
    alignSelf: "center",
    backgroundColor: "#fff",
    width: 50
  },
  scrollIndicator: {
    borderRadius: 20,
    height: 4
  },
  scrollHolder: {
    width: DeviceWidth * SCROLL_HOLDER_WIDTH_FACTOR,
    height: 4,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,1)",
    alignSelf: "center",
    zIndex: 1
  }
});

const mapStateToProps = state => {
  return {
    userInfo: state.info.userInfo,
    gameNames: state.questions.gameNames,
    scrollQuestionCards: state.nav.scrollQuestionCards,
    seenQuestions: state.content.seenQuestions,
    posts: state.info.posts,
    contentQuestions: state.content.questions,
    rooms: state.rooms.rooms,
    selectedRoomId: state.rooms.selected_room_id,
    currentChatScreenIndex: state.nav.currentChatScreenIndex,
    planPrices: state.app.packPrices || [],
    expenseTutorials: state.tutorial.expenses,
    questionPickersCount: state.tutorial.questionPickers
  };
};

const mapDispatchToProps = dispatch => ({
  scrollQuestionCardsAction: bindActionCreators(
    scrollQuestionCardsAction,
    dispatch
  ),
  updateContentQuestions: bindActionCreators(updateContentQuestions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
