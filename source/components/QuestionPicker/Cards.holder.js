import Lodash from "lodash";
import moment from "moment";
import React, { Component } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import SvgUri from "react-native-svg-uri";
import Ionicon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PostsList from "../../components/QuestionPicker/PostsList";
import VerticalGradientView from "../../components/Views/VerticalGradientView";
import {
  runRepeatedTiming,
  runTimingForNavbarNob
} from "../../config/Animations";
import { FONT_GREY, WHITE } from "../../config/Colors";
import {
  appConstants,
  GAME_LOGOS,
  LEFT_MARGIN,
  MONETIZATION_ICONS,
  MONETIZATION_ITEMS,
  msgTypes,
  REFRESH_ICONS
} from "../../config/Constants";
import { DeviceHeight, DeviceWidth } from "../../config/Device";
import { BACKGROUND_ICONS } from "../../config/files";
import { consumeAndFulFill, purchaseAndFulfill } from "../../network/pack";
import {
  addPostMethod,
  addQuestionPostbyUser,
  deletePostMethod
} from "../../network/question";
import { getPosts, updateProfile } from "../../network/user";
import * as ChatActions from "../../redux/actions/chat";
import * as ContentActions from "../../redux/actions/content";
import * as QuestionActions from "../../redux/actions/questions";
import { addExpenseTutorialCount } from "../../redux/actions/tutorials";
import * as UserActions from "../../redux/actions/user.info";
import { sharedStyles } from "../../styles/Shared";
import AnimateCountModal from "../Gemsflow/AnimateCount.modal";
import BoldText from "../Texts/BoldText";
import MediumText from "../Texts/MediumText";
import RegularText from "../Texts/RegularText";
import NoFeedbackTapView from "../Views/NoFeedbackTapView";
import RowView from "../Views/RowView";
import BackgroundIcon from "./BackgroundIcons";
import GameAlreadyDisplayedOverlay from "./Game.already.displayed.overlay";
import GameTutorialOverlay from "./Game.tutorial.overlay";
import ThePerfectGif from "./Perfect.Gif";
import PickedQuestionview from "./Picked.questionview";
import PickerHeader from "./Picker.header";
import QuestionItem from "./Question.item";
import TwoTruthsAndlie from "./Truths.lie";
const { isEmpty } = Lodash;
const { Value, timing } = Animated;

moment.locale("en", {
  relativeTime: {
    future: "%s",
    past: "%s",
    s: "now",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1mth",
    MM: "%dmth",
    y: "1y",
    yy: "%dy"
  }
});
const GAME_LOGO_RADIUS = 40;
const INTERVAL = 86400;
class CardsHolder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedList: 0,
      selectedOn: "",
      pickedQuestion: {},
      showReplaceableQuestions: false,
      showChangeOptionTutorial: false,
      hideAddNewOption: false,
      pickedOption: null,
      isSaveLoading: false,
      postedOption: null,
      postId: null,
      fromPost: false,
      postObj: {},
      isFavoritesEmpty: false,
      refreshEnabled: true,
      init: false,
      refreshedAt: null,
      tappedCount: null,
      refreshRevealed: false,
      showTextCondition: "",
      items: ["New", "Favourites"],
      animatedBottomBar: new Value(-DeviceWidth * 0.19),
      questionText: "",
      originalText: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      originalOptionA: "",
      originalOptionB: "",
      originalOptionC: "",
      originalOptionD: "",
      editMode: false,
      currentlyEditingItem: 0,
      onCountAnimationComplete: null
    };
    this.questionItemRef = React.createRef();
    this.horizontalScrollRef = React.createRef();
    this.verticalScrollRef = React.createRef();
  }

  checkForRefresh = props => {
    // console.log(" start initiation check refresh ", props.fromChatWindow);
    const {
      fromChatWindow,
      seenQuestions = [],
      item,
      currentChatScreenIndex
    } = props;

    const currentTime = Math.round(Date.now() / 1000);
    let targetCat = fromChatWindow ? "2" : "1";
    if (currentChatScreenIndex !== 0) {
      targetCat = "1";
    }
    const seenQuestionObj = seenQuestions.find(sQ => {
      if (sQ.gameId === item._id && sQ.category === targetCat) {
        return true;
      }
    });
    if (seenQuestionObj) {
      const refreshEnabled =
        seenQuestionObj.qIndex === 0 ||
        seenQuestionObj.updatedAt + 86400 < currentTime;

      if (
        this.state.refreshedAt !== seenQuestionObj.updatedAt ||
        this.state.tappedCount !== seenQuestionObj.tappedCount
      ) {
        this.setState({
          refreshEnabled,
          refreshedAt: seenQuestionObj.updatedAt,
          init: true,
          tappedCount: seenQuestionObj.tappedCount
        });
      }
    }
  };
  componentWillReceiveProps = nextProps => {
    if (this.props.refreshLoading !== nextProps.refreshLoading) {
      if (nextProps.refreshLoading) {
        // start Aniamtion
        this.startRefreshAnimation(true);
      } else {
        // stop Animation
        this.startRefreshAnimation(false);
      }
    }

    // const currentGameQuestions =
    //   nextProps.contentQuestions[nextProps.item._id] || [];
    // const currentGameFavs = currentGameQuestions.filter(question => {
    //   if (question.favId) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // });

    // const prevCurrentGameQuestions =
    //   this.props.contentQuestions[this.props.item._id] || [];

    // if (this.state.isFavoritesEmpty !== (currentGameFavs.length === 0)) {
    //   this.setState({
    //     isFavoritesEmpty: currentGameFavs.length === 0 ? true : false
    //   });
    // }

    if (
      !Lodash.isEqual(this.props.seenQuestions, nextProps.seenQuestions) ||
      this.state.init === false
    ) {
      this.checkForRefresh(nextProps);
    }
  };

  postQuestionCall = (postObj, replacing = false) => {
    const { myData, setPosts } = this.props;
    this.setState({ isSaveLoading: true });
    if (!myData.hasEditedPosts) {
      updateProfile({ hasEditedPosts: true }, () => {
        this.props.updateOwnProfile({ hasEditedPosts: true });
      });
    }
    if (!this.isQuestionOriginal()) {
      addQuestionPostbyUser(this.createPostObj(), cbData => {
        if (cbData.success) {
          const {
            _id: postId,
            questionId,
            option,
            postOrder,
            favId
          } = cbData.data;
          if (favId) {
            const { _id, gameId, favId: oldFavId } = this.state.pickedQuestion;

            this.props.removeFromFavourites(_id, gameId._id, oldFavId);
            this.props.addNewFav(
              questionId._id,
              gameId._id,
              cbData.data.favId,
              cbData.data.createdAt
            );
          }
          this.props.addEditedPost(
            { ...questionId, option, postOrder, postId },
            questionId.gameId._id
          );
          this.setState({ isSaveLoading: false });
          this.closeOptionViewMode(true);
          getPosts(myData._id, dbPosts => {
            if (dbPosts.success) {
              setPosts(dbPosts.data);
            }
          });
          if (replacing) {
            getPosts(myData._id, dbPosts => {
              if (dbPosts.success) {
                setPosts(dbPosts.data);
              }
            });
          } else {
            this.props.addNewInfoPost(questionId.gameId._id, cbData.data);
          }
        }
      });
    } else {
      addPostMethod(postObj, cbData => {
        if (cbData.success) {
          const {
            _id: postId,
            questionId: {
              _id: question_id,
              gameId: { _id: gameId }
            },
            option,
            postOrder
          } = cbData.data;

          this.props.addNewPost(question_id, gameId, postId, option, postOrder);
          //this is for updating posts in userinfo ;
          this.setState({ isSaveLoading: false });
          this.closeOptionViewMode(true);
          if (replacing) {
            console.log(" replacing protocol initiated ", gameId);
            getPosts(myData._id, dbPosts => {
              if (dbPosts.success) {
                setPosts(dbPosts.data);
              }
            });
          } else {
            this.props.addNewInfoPost(gameId, cbData.data);
          }
        }
      });
    }
  };
  pickOption = (pickedOption, fromPost, pickedQuestion, postId) => {
    if (fromPost) {
      let customPickedQuestion = {
        ...pickedQuestion,
        postedOption: pickedOption,
        postId,
        fromPost
      };
      this.pickQuestion(customPickedQuestion);
    }
    // this.setState({ pickedOption });
    // if (fromPost) {
    //   this.pickQuestion(pickedQuestion, pickedOption);
    //   this.setState({
    //     // pickedQuestion,
    //     fromPost,
    //     postedOption: pickedOption,
    //     postId
    //   });
    //   this.props.setOptionViewMode(true);
    //   this.horizontalScrollRef.scrollTo({ x: DeviceWidth });
    // }
  };

  switchList = item => {
    this.setState({
      selectedList: item
    });
  };

  refreshQuestions = (gameId, didPurchase, selectedGemsCount) => {
    const {
      seenQuestions,
      fromChatWindow,
      roomLevel,
      adminProps,
      isFriends,
      planPrices
    } = this.props;
    const { roomLevelThresholdForThirdCatQuestions = 10 } = adminProps;
    const category =
      fromChatWindow && isFriends
        ? roomLevel < roomLevelThresholdForThirdCatQuestions
          ? "3"
          : "2"
        : "1";
    const exactSeenQuestion = seenQuestions.find(seenQObj => {
      console.log(" each of find is ", seenQObj);
      if (seenQObj.gameId === gameId && seenQObj.category === category) {
        return true;
      }
    });
    if (!exactSeenQuestion) {
      alert(" error ");
      this.setState({
        refreshLoading: false
      });
      return;
    }

    const {
      gameId: game_id,
      category: _cat,
      qIndex,
      tappedCount
    } = exactSeenQuestion;
    const exactPlan = planPrices.find(plan => plan.value === "MORE_CONTENT");

    const purchaseCall = () => {
      purchaseAndFulfill({
        item: MONETIZATION_ITEMS.MORE_CONTENT,
        category: _cat,
        countToBeAdded: selectedGemsCount,
        deductCount: exactPlan.price,
        gameId: game_id,
        qIndex,
        tappedCount
      })
        .then(resp => {
          this.handleRefreshQuestionsResp(resp, selectedGemsCount);
        })
        .catch(err => {
          console.log(" refresh questions err s ", err);
        });
    };

    const consumeCall = () => {
      consumeAndFulFill({
        item: MONETIZATION_ITEMS.MORE_CONTENT,
        category: _cat,
        countToBeAdded: selectedGemsCount,
        deductCount: exactPlan.price,
        gameId: game_id,
        qIndex,
        tappedCount
      })
        .then(resp => {
          this.handleRefreshQuestionsResp(resp, selectedGemsCount);
        })
        .catch(err => {
          console.log(" refresh questions err s ", err);
        });
    };
    if (didPurchase) {
      purchaseCall(selectedGemsCount);
    } else {
      consumeCall();
    }
  };
  handleRefreshQuestionsResp = (resp, selectedGemsCount) => {
    const { updateOwnProfile, updateContentQuestions, myData } = this.props;
    updateOwnProfile({
      gems_count: myData.gems_count + selectedGemsCount
    });
    updateContentQuestions(resp.data.data);
  };
  pickQuestion = pickedQuestion => {
    if (pickedQuestion.postedOption) {
      this.horizontalScrollRef.scrollTo({ x: DeviceWidth });
      this.props.setOptionViewMode(true);
      this.setState({
        pickedQuestion,
        fromPost: true,
        postId: pickedQuestion.postId,
        postedOption: pickedQuestion.postedOption
      });
    } else {
      this.horizontalScrollRef.scrollTo({ x: DeviceWidth });
      this.props.setOptionViewMode(true);
      this.setState({ pickedQuestion });
    }
  };

  animation = new Value(-DeviceWidth * 0.19);
  initialValue = new Value(0);
  animatedBottomBar = runTimingForNavbarNob(
    this.initialValue,
    this.animation,
    130
  );

  renderTabNavigator = () => {
    const { item, posts } = this.props;
    const { items, selectedList } = this.state;
    const postGames = Object.keys(posts);
    const addTopMargin = postGames.indexOf(item._id) > -1;

    return (
      <RowView
        style={{
          ...styles.topItemsContainer,
          marginTop: addTopMargin ? 10 : 0
        }}
      >
        <Animated.View
          style={{
            ...styles.swipeTabLayout,
            transform: [{ translateX: this.animatedBottomBar }]
          }}
        />
        {items.map((navItem, itemId) => {
          const _isCurrentTab = selectedList === itemId;

          return (
            <NoFeedbackTapView
              onPress={() => {
                this.switchList(itemId);
                this.animation.setValue(
                  itemId === 0 ? -DeviceWidth * 0.19 : DeviceWidth * 0.19
                );
              }}
              key={itemId}
              style={{
                ...styles.tabTappableView
              }}
            >
              <RegularText
                style={{
                  color: _isCurrentTab ? item.colors[0] : "#1e243280",
                  fontWeight: _isCurrentTab ? "500" : "500",
                  ...styles.tabText
                }}
              >
                {navItem}
              </RegularText>
            </NoFeedbackTapView>
          );
        })}
      </RowView>
    );
  };
  renderQuestionItems = () => {
    let {
      item,
      fromChatWindow,
      posts,
      contentQuestions,
      rooms,
      refreshLoading,
      selectedRoomId
    } = this.props;
    let { selectedList, isFavoritesEmpty } = this.state;
    if (selectedList === 0) {
      if (refreshLoading) {
        return (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 48
            }}
          >
            <ActivityIndicator
              style={{
                marginBottom: 24
              }}
              size="large"
              color={WHITE}
            />
            <RegularText style={{ color: WHITE, fontSize: 16 }}>
              Getting new Questions
            </RegularText>
          </View>
        );
      } else {
        return (
          !isEmpty(contentQuestions) &&
          !isEmpty(contentQuestions[item._id]) &&
          contentQuestions[item._id].map((question, questionIndex) => {
            if (
              question.postId ||
              question.favId ||
              !question.new ||
              question.byContentTeam === "false"
            ) {
              return null;
            }
            if (fromChatWindow) {
              if (rooms[selectedRoomId].status === "SLOT") {
                if (question.category === "2" || question.category === "3") {
                  return null;
                }
              } else {
                if (question.category === "1") {
                  return null;
                }
              }
            }
            if (!fromChatWindow) {
              if (question.category === "2" || question.category === "3") {
                return null;
              }
            }

            return (
              <QuestionItem
                onFavExeeced={this.props.onFavExeeced}
                pickQuestion={this.pickQuestion}
                onReplaceGame={this.props.onReplaceGame}
                key={questionIndex}
                question={question}
                fromChatWindow={fromChatWindow}
                showIconRow={true}
                posts={posts}
                // isFriend={rooms[selectedRoomId].status !== "SLOT"}
                onFavRemoved={key => {
                  console.log(" key from removing is ", key);
                  this.props.onFavRemoved(key);
                }}
              />
            );
          })
        );
      }
    } else {
      return !isEmpty(contentQuestions) &&
        !isEmpty(contentQuestions[item._id]) &&
        !isFavoritesEmpty ? (
        contentQuestions[item._id].map((question, questionIndex) => {
          if (!question.favId || question.postId) {
            return null;
          }
          const isFriend =
            selectedRoomId &&
            rooms[selectedRoomId] &&
            rooms[selectedRoomId].status !== "SLOT";
          const questionIntimate = question.category === "2";
          const showFavWarning = !isFriend && questionIntimate;
          return (
            <QuestionItem
              pickQuestion={this.pickQuestion}
              key={questionIndex}
              favId={question.favId}
              question={question}
              redHeart={true}
              showFavWarning={showFavWarning}
              onFavRemoved={key => {
                console.log(" key for removing ", key);
                this.props.onFavRemoved(key);
              }}
              onFavExeeced={this.props.onFavExeeced}
              onReplaceGame={this.props.onReplaceGame}
              favouriteId={question.favId}
              fromChatWindow={fromChatWindow}
              showIconRow={true}
            />
          );
        })
      ) : (
        <Text
          style={{
            fontSize: 18,
            textAlign: "center",
            color: "#fff",
            fontWeight: "600",
            padding: 30
          }}
        >
          You haven't added a {item.key} favourite yet.
        </Text>
      );
    }
  };
  getDynamicCardStyle = (_first, _last) => {
    const { optionViewMode, item, selectedGame, currentGame } = this.props;
    const showOptions = item._id === currentGame && optionViewMode;
    return {
      width: showOptions ? DeviceWidth : DeviceWidth * 0.9,
      marginLeft: showOptions
        ? _first
          ? 0
          : -DeviceWidth * 0.05
        : _first
        ? DeviceWidth * 0.05
        : DeviceWidth * 0.01,
      marginRight: showOptions
        ? 0
        : _last
        ? DeviceWidth * 0.05
        : DeviceWidth * 0.01
    };
  };
  animation = new Value(100);
  initialValue = new Value(0);
  animatedBackGroundWidth = runRepeatedTiming(
    this.initialValue,
    this.animation,
    2500
  );

  deletePostCall = id => {
    deletePostMethod({ id }, res => {
      if (res.success) {
        console.log("Successfully deleted post");
      }
    });
  };

  postQuestionFromOtherGame = (postObj, newGame, cb) => {
    const {
      gameNames,
      fromChatWindow,
      selectedGame,
      onReplaceGame
    } = this.props;
    const oldGame = selectedGame;
    onReplaceGame(postObj, oldGame, newGame, fromChatWindow, gameNames, () => {
      cb(true);
    });
  };

  replaceGame = postObj => {
    const { gameNames, fromChatWindow, selectedGame } = this.props;
    const { pickedQuestion } = this.state;

    const oldGame = selectedGame;
    const newGame = pickedQuestion.gameId.value;
    this.props.onReplaceGame(
      postObj,
      oldGame,
      newGame,
      fromChatWindow,
      gameNames,
      () => {
        this.closeOptionViewMode(false);
      }
    );
  };
  updateExistingPost = () => {
    alert("check post object issue");
    return;
    const { pickedOption, postId, pickedQuestion } = this.state;
    const { myData } = this.props;
    console.log(" picked question is ", pickedQuestion);
    const {
      _id: questionId,
      gameId: { _id: gameId },
      postOrder
    } = pickedQuestion;
    this.setState({ isSaveLoading: true });
    if (!myData.hasEditedPosts) {
      updateProfile({ hasEditedPosts: true }, () => {
        this.props.updateOwnProfile({ hasEditedPosts: true });
      });
    }
    // **** Here we dont need to update the option of the exising post.
    // *** Instead delete this post and create another post with new option.
    // *** as per the discussion

    deletePostMethod({ id: postId }, deleteResponse => {
      if (deleteResponse.success) {
        this.props.removeInfoPostInGame(gameId, postId);
        this.postQuestionCall(postObj);
        if (this.isQuestionOriginal()) {
          this.props.removeFromPosts(questionId, gameId, postId);
          const postObj = {
            userId: myData._id,
            questionId: pickedQuestion._id,
            option: pickedOption,
            type: appConstants.POST_TO_PROFILE,
            postOrder
          };
          this.setState({ isSaveLoading: false });
        } else {
          this.props.deleteEditedPost(
            questionId,
            gameId,
            pickedQuestion.favId !== undefined
          );
        }
      }
    });
  };
  replaceQuestion = postObj => {
    this.setState({
      showReplaceableQuestions: true,
      postObj
    });
    this.props.setOptionViewMode(false);
    this.horizontalScrollRef.scrollTo({ x: 0 });
  };
  showIntimateWarning = () => {};
  sendQuestion = () => {
    const { pickedQuestion, pickedOption } = this.state;
    const { myData, pushAndSendMessage } = this.props;
    console.log(" room level is ");
    // if (roomLevel < LEVEL_THREE_THRESHOLD){
    //   Alert.alert("Warning"," This question might be too intimate in this time", )
    // }
    this.setState({ isSaveLoading: true });

    if (this.isQuestionOriginal()) {
      const postObj = {
        userId: myData._id,
        questionId: pickedQuestion._id,
        option: pickedOption,
        type: appConstants.POST_TO_CHAT,
        postOrder: 0
      };

      addPostMethod(postObj, cbData => {
        this.props.toggleQuestionPicker(false);
        this.closeOptionViewMode(false);
        this.setState({ isSaveLoading: false });
        pushAndSendMessage({
          type: msgTypes.MESSAGE_CHAT_CARD,
          text: JSON.stringify([cbData.data])
        });
      });
    } else {
      addQuestionPostbyUser(this.createPostObj(), cbData => {
        this.props.toggleQuestionPicker(false);
        this.closeOptionViewMode(false);
        this.setState({ isSaveLoading: false });
        pushAndSendMessage({
          type: msgTypes.MESSAGE_CHAT_CARD,
          text: JSON.stringify([cbData.data])
        });
      });
    }
  };

  createPostObj = () => {
    const {
      pickedQuestion,
      pickedOption,
      questionText,
      optionA,
      optionB,
      optionC,
      optionD
    } = this.state;

    const { gameId, favId } = pickedQuestion;

    let options = [];
    if (optionA.trim() !== "") {
      options.push(optionA);
    }
    if (optionB.trim() !== "") {
      options.push(optionB);
    }
    if (optionC.trim() !== "") {
      options.push(optionC);
    }
    if (optionD.trim() !== "") {
      options.push(optionD);
    }

    const posts = this.props.contentQuestions[pickedQuestion.gameId._id].filter(
      i => i.postId
    );

    post = {
      name: gameId.value,
      question: questionText,
      option: pickedOption,
      options,
      type: appConstants.POST_TO_PROFILE,
      gameId,
      category: "1",
      postOrder: (posts.length || 0) + 1,
      favId
    };

    return post;
  };

  isQuestionOriginal = ignoreContentTeamCheck => {
    const {
      questionText,
      originalText,
      optionA,
      optionB,
      optionC,
      optionD,
      originalOptionA,
      originalOptionB,
      originalOptionC,
      originalOptionD,
      pickedQuestion
    } = this.state;

    if (ignoreContentTeamCheck) {
      return (
        questionText.trim() === originalText.trim() &&
        optionA.trim() === originalOptionA.trim() &&
        optionB.trim() === originalOptionB.trim() &&
        optionC.trim() === originalOptionC.trim() &&
        optionD.trim() === originalOptionD.trim()
      );
    }

    return (
      questionText.trim() === originalText.trim() &&
      optionA.trim() === originalOptionA.trim() &&
      optionB.trim() === originalOptionB.trim() &&
      optionC.trim() === originalOptionC.trim() &&
      optionD.trim() === originalOptionD.trim() &&
      pickedQuestion.byContentTeam === "true"
    );
  };

  saveQuestion = () => {
    const { pickedQuestion, pickedOption, fromPost } = this.state;
    const { fromChatWindow, myData, contentQuestions } = this.props;
    // addQuestionPostbyUser
    if (fromPost) {
      this.updateExistingPost();
    } else {
      const posts = contentQuestions[pickedQuestion.gameId._id].filter(
        i => i.postId
      );
      const postObj = {
        userId: myData._id,
        questionId: pickedQuestion._id,
        option: pickedOption,
        type: appConstants.POST_TO_PROFILE,
        gameId: pickedQuestion.gameId._id,
        postOrder: (posts.length || 0) + 1
      };
      console.log("saved question is ", pickedQuestion, posts);
      const existingPostsLength = !isEmpty(posts) && posts.length;

      if (existingPostsLength === false) {
        if (fromChatWindow) {
          this.postQuestionCall(postObj);
        } else {
          this.replaceGame(postObj);
        }
      } else {
        if (existingPostsLength === 2) {
          this.replaceQuestion(postObj);
        } else {
          this.postQuestionCall(postObj);
        }
      }
    }
  };

  toggleAnimatedCountMOdal = (
    isAnimatedCountVisilble,
    fromCount,
    toCount,
    onComplete
  ) => {
    this.setState({
      isAnimatedCountVisilble,
      fromCount,
      toCount,
      onCountAnimationComplete: onComplete
    });
  };

  getQuestionWordsCount = post => {
    return post.questionId.question.split(" ").length;
  };

  startRefreshAnimation = () => {
    const { item, posts } = this.props;
    const postGames = Object.keys(posts);
    const showAnimation = postGames.indexOf(item._id) > -1;
    if (showAnimation) {
      if (posts[item._id].length === 1) {
        if (this.getQuestionWordsCount(posts[item._id][0]) > 3) {
          const questionWordsCount =
            this.getQuestionWordsCount(posts[item._id][0]) - 2;
          this.verticalScrollRef.scrollTo({
            y: questionWordsCount * 19,
            animated: true
          });
        } else {
          this.verticalScrollRef.scrollTo({
            y: DeviceHeight * 0.25,
            animated: true
          });
        }
      } else {
        if (this.getQuestionWordsCount(posts[item._id][0]) > 3) {
          const questionWordsCount =
            this.getQuestionWordsCount(posts[item._id][0]) +
            this.getQuestionWordsCount(posts[item._id][1]) -
            3;
          this.verticalScrollRef.scrollTo({
            y: questionWordsCount * 19,
            animated: true
          });
        } else {
          this.verticalScrollRef.scrollTo({
            y: DeviceHeight * 0.5,
            animated: true
          });
        }
      }
    }
    // this.verticalScrollRef.scrollTo({ y: bool ? -DeviceHeight : DeviceHeight });
  };

  closeOptionViewMode = scrollToTop => {
    const { setOptionViewMode } = this.props;
    setOptionViewMode(false);
    this.horizontalScrollRef.scrollTo({ x: 0 });
    if (scrollToTop) {
      this.verticalScrollRef.scrollTo({ y: 0 });
    }
    setTimeout(() => {
      this.setState({
        pickedQuestion: {},
        pickedOption: null,
        fromPost: false,
        postedOption: null,
        showReplaceableQuestions: false
      });
    }, 250);
  };
  showRefreshMonitizationModal = (gameId, refreshedAt) => {
    const { myData, planPrices, setExpenseTutorial } = this.props;
    if (
      !myData.seenMonetisationTutorials ||
      myData.seenMonetisationTutorials.indexOf("MoreContent") === -1
    ) {
      this.props.showOneTimeTutorial("MoreContent", () => {
        this.showRefreshMonitizationModal();
      });
      const seenMonetisationTutorials = myData.seenMonetisationTutorials || [];
      seenMonetisationTutorials.push("MoreContent");
      this.props.updateOwnProfile({ seenMonetisationTutorials });
      updateProfile({ seenMonetisationTutorials }, cbUpdated => {});
    } else {
      const exactPlan = planPrices.find(plan => plan.value === "MORE_CONTENT");
      console.log(" requreid gems are ", planPrices);
      if (exactPlan) {
        setExpenseTutorial(exactPlan._id);
        const requiredGems = exactPlan.price;
        console.log(" price to be checked is ", requiredGems);
        const isGemsEnough = myData.gems_count >= requiredGems;

        this.setState(
          {
            refreshRevealed: true
          },
          () => {
            if (isGemsEnough) {
              // if (
              //   expenseTutorials[exactPlan._id] &&
              //   expenseTutorials[exactPlan._id] > EXPENSE_THRESHOLD_COUNT
              // ) {
              //   return purchaseGems(-requiredGems, cbRes => {
              //     if (cbRes.success) {
              //       this.props.updateOwnProfile({
              //         gems_count: cbRes.data.gems_count
              //       });
              //       this.props.refreshQuestions(gameId);
              //     }
              //   });
              // }
              this.props.openConsumptionModal({
                successCallback: () => {
                  // purchaseGems(-requiredGems, cbRes => {
                  // if (cbRes.success) {
                  // const toggleAnimation = () => {
                  this.toggleAnimatedCountMOdal(
                    true,
                    myData.gems_count,
                    myData.gems_count - requiredGems,
                    () => {
                      this.refreshQuestions(gameId, false);
                    }
                  );
                  // };
                  // this.props.refreshQuestions(gameId, toggleAnimation);
                  // }
                  // });
                },
                failureCallback: () => {
                  console.log(" fail");
                },
                count: requiredGems,
                extraData: {
                  icon: require("../../assets/svgs/MyProfile/refresh.svg"),
                  itemName: "More Content",
                  description: "Done for today",
                  refreshedAt: refreshedAt + INTERVAL
                }
              });
            } else {
              this.props.openBuyGemsModal({
                successCallback: selectedGemsCount => {
                  // purchaseGems(-requiredGems, cbRes => {
                  //   console.log(" purchase res is ", cbRes);
                  //   if (cbRes.success) {
                  //     this.props.updateOwnProfile({
                  //       gems_count: cbRes.data.gems_count
                  //     });

                  //   }
                  // });
                  // const toggleAnimation = () => {
                  const fromCount = myData.gems_count + selectedGemsCount;
                  const toCount = fromCount - exactPlan.price;
                  setTimeout(() => {
                    this.toggleAnimatedCountMOdal(
                      true,
                      fromCount,
                      toCount,
                      () => {
                        this.refreshQuestions(gameId, true, selectedGemsCount);
                      }
                    );
                  }, 500);
                  // };
                  // this.props.purchaseAndRefreshQuestions(
                  //   gameId,
                  //   toggleAnimation
                  // );
                },
                failureCallback: () => {
                  console.log(" didn't buy");
                },
                count: requiredGems,
                extraData: {
                  icon: MONETIZATION_ICONS["MORE_CONTENT"],
                  itemName: "More Content",
                  description: "Done for today",
                  refreshedAt: refreshedAt + INTERVAL,
                  extraDescription: "Get Access to more content"
                }
              });
            }
          }
        );
      }
    }
  };

  closeAndOpenQuestionPicker = position => {
    const { openCloseQuestionPicker, item } = this.props;
    openCloseQuestionPicker(item.value, position);
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    const { props, state } = this;

    const areUserObjPostsDifferent =
      nextProps.myData.posts !== props.myData.posts;
    const isModeDifferent = nextProps.optionViewMode !== props.optionViewMode;
    const areContentQuestionsDifferent =
      nextProps.contentQuestions !== props.contentQuestions &&
      props.item.content;
    const isSelectedGameDifferent =
      props.selectedGame !== nextProps.selectedGame;
    const isCurrentGameDifferent = props.currentGame !== nextProps.currentGame;
    const pickedOptionIsDifferent =
      state.pickedOption !== nextState.pickedOption;
    const isSelectedListDifferent =
      state.selectedList !== nextState.selectedList;

    return (
      areUserObjPostsDifferent ||
      isModeDifferent ||
      areContentQuestionsDifferent ||
      isSelectedGameDifferent ||
      isCurrentGameDifferent ||
      pickedOptionIsDifferent ||
      isSelectedListDifferent
    );
  };

  renderTopHeader = showRefresh => {
    let {
      item,
      optionViewMode,
      currentChatScreenIndex,
      refreshLoading
    } = this.props;

    const {
      refreshedAt,
      tappedCount,
      refreshRevealed,
      showReplaceableQuestions
    } = this.state;
    const currentTime = Math.round(Date.now() / 1000);

    let refreshEnabled = false;
    const timeValid = refreshedAt + INTERVAL < currentTime;
    if (currentChatScreenIndex === 0) {
      if (tappedCount === 0 || timeValid) {
        refreshEnabled = true;
      }
    } else {
      if (
        tappedCount === 0 ||
        tappedCount === 1 ||
        timeValid
        // refreshRevealed
      ) {
        refreshEnabled = true;
      }
    }
    if (refreshRevealed) {
      refreshEnabled = false;
    }

    const showBigIcon =
      item.value === "BLUFF_OR_TRUTH" ||
      item.value === "SIMILARITIES" ||
      item.value === "GUESS_THE_CELEB" ||
      item.value === "THE_PERFECT_GIF" ||
      item.value === "TWO_TRUTHS_AND_A_LIE";
    const showVeryBigIcon =
      item.value === "KISS_MARRY_KILL" || item.value === "NEVER_HAVE_I_EVER";

    const hasMoreTopMargin = item.value === "KISS_MARRY_KILL";

    return (
      <>
        {optionViewMode ? (
          <RowView
            style={{
              justifyContent: "space-between"
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.closeOptionViewMode(false);
              }}
              style={{ width: 60 }}
            >
              <Ionicon
                style={styles.cloudIcon}
                name={"ios-arrow-dropleft-circle"}
                size={40}
                color={"#fff"}
              />
            </TouchableOpacity>
            <View
              style={{
                height: DeviceHeight * 0.125,
                alignItems: "flex-start",
                justifyContent: "center"
              }}
            >
              <BoldText
                style={{
                  ...styles.gameName
                }}
              >
                {" "}
                {item.key}
              </BoldText>
            </View>
            <TouchableOpacity
              onPress={() => {
                this.props.toggleQuestionPicker();
                setTimeout(() => {
                  this.closeOptionViewMode(false);
                }, 200);
                // this.closeOptionViewMode(false);
              }}
              style={{ width: 60 }}
            >
              <Ionicon
                style={styles.cloudIcon}
                name={"ios-close-circle"}
                size={40}
                color={"#fff"}
              />
            </TouchableOpacity>
          </RowView>
        ) : (
          <View style={styles.topItemRow}>
            <RowView style={styles.nameIconView}>
              <View
                style={{
                  marginTop: hasMoreTopMargin ? 15 : 0,
                  opacity: showRefresh ? 1 : 0
                }}
              >
                <SvgUri
                  height={showVeryBigIcon ? 55 : showBigIcon ? 45 : 35}
                  width={showVeryBigIcon ? 55 : showBigIcon ? 45 : 35}
                  source={GAME_LOGOS[item.value]}
                />
              </View>
              <BoldText
                style={{
                  ...styles.gameName,
                  transform: [
                    { translateY: 2 },
                    { translateX: item.value === "BLUFF_OR_TRUTH" ? -5 : 5 }
                  ],
                  opacity: showRefresh ? 1 : 0
                }}
              >
                {" "}
                {item.key}
              </BoldText>
            </RowView>

            {item.content ? (
              <View
                style={{
                  ...sharedStyles.justifiedCenter
                }}
              >
                {!showReplaceableQuestions && (
                  <TouchableOpacity
                    style={{
                      opacity: showRefresh ? 1 : 0
                    }}
                    onPress={() => {
                      if (!refreshEnabled) {
                        return this.showRefreshMonitizationModal(
                          item._id,
                          refreshedAt
                        );
                      }
                      if (tappedCount === 1 && !timeValid) {
                        return this.showRefreshMonitizationModal(
                          undefined,
                          refreshedAt
                        );
                      }
                      if (refreshEnabled) {
                        //old api itself just get new questions
                        this.props.refreshQuestions(item._id, () => {});
                      }
                    }}
                  >
                    {refreshLoading ? (
                      <View
                        style={{
                          height: 30,
                          width: 30,
                          borderRadius: 15,
                          backgroundColor: refreshEnabled ? "#fff" : "#fff",
                          ...sharedStyles.justifiedCenter
                        }}
                      >
                        <ActivityIndicator size={"small"} color={"#cacaca"} />
                      </View>
                    ) : (
                      <View
                        style={{
                          height: 30,
                          width: 30,
                          borderRadius: 15,
                          shadowColor: "#000",
                          shadowOffset: { width: 1, height: 2 },
                          shadowOpacity: refreshEnabled ? 0.2 : 0.2,
                          elevation: refreshEnabled ? 1 : 1,
                          backgroundColor: refreshEnabled ? "#fff" : "#fff",
                          ...sharedStyles.justifiedCenter
                        }}
                      >
                        <SvgUri
                          height={19}
                          width={19}
                          source={REFRESH_ICONS[item.value]}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View />
            )}
          </View>
        )}
      </>
    );
  };

  renderTutorialText = () => {
    const { item, contentQuestions } = this.props;
    const isColliding = item.value === "KISS_MARRY_KILL";
    if (!isEmpty(contentQuestions) && !isEmpty(contentQuestions[item._id])) {
    }

    return (
      <RegularText
        style={{
          textAlign: "center",
          color: "#ffffff",
          paddingHorizontal: LEFT_MARGIN,
          fontSize: 16,
          transform: [
            {
              translateY: isColliding ? 0 : -10
            }
          ]
        }}
      >
        {item.pickerDescription}
      </RegularText>
    );
  };

  renderPickCount = () => {
    const { fromChatWindow, optionViewMode, item } = this.props;
    return (
      <>
        {fromChatWindow || !item.content ? (
          <View />
        ) : (
          <Text
            style={[
              styles.pickLimitText,
              {
                opacity: optionViewMode ? 0 : 1
              }
            ]}
          >
            You can pick upto 2 questions only.{"\n"} which one do you want to
            replace?
          </Text>
        )}
      </>
    );
  };

  render() {
    let {
      gameNames,
      item,
      index,
      toggleQuestionPicker,
      optionViewMode,
      fromChatWindow,
      posts,
      contentQuestions,
      toggleGifPicker,
      selectedGame,
      refreshLoading
    } = this.props;
    const {
      selectedList,
      showReplaceableQuestions,
      postObj,
      fromCount,
      toCount,
      isAnimatedCountVisilble,
      onCountAnimationComplete,
      pickedQuestion,
      pickedOption
    } = this.state;
    const _first = index === 0;

    const _last = index === gameNames.length - 1;

    const postGames = Object.keys(posts);
    const isHavingPost = postGames.indexOf(item._id) > -1;
    const showLightBgColor =
      item.lightColor && isHavingPost && !showReplaceableQuestions;

    return (
      <VerticalGradientView
        colors={item.colors}
        style={[
          styles.gameCardView,
          this.getDynamicCardStyle(_first, _last),
          {
            height: fromChatWindow ? DeviceHeight * 0.78 : DeviceHeight * 0.9
          }
        ]}
      >
        {fromChatWindow ? (
          <View />
        ) : (
          <GameAlreadyDisplayedOverlay
            item={item}
            selectedGame={selectedGame}
            closeAndOpenQuestionPicker={this.closeAndOpenQuestionPicker}
          />
        )}
        <BackgroundIcon bgIcon={BACKGROUND_ICONS[item.value]} />
        <PickerHeader
          item={item}
          optionViewMode={optionViewMode}
          refreshLoading={refreshLoading}
          showRefreshMonitizationModal={this.showRefreshMonitizationModal}
          showReplaceableQuestions={showReplaceableQuestions}
          closeOptionViewMode={this.closeOptionViewMode}
          toggleQuestionPicker={toggleQuestionPicker}
        />
        <GameTutorialOverlay item={item} />

        {showReplaceableQuestions ? (
          this.renderPickCount()
        ) : optionViewMode ? (
          <View />
        ) : (
          this.renderTutorialText()
        )}

        {isAnimatedCountVisilble && (
          <AnimateCountModal
            fromCardsHolder={true}
            reverse={true}
            fromCount={fromCount}
            toCount={toCount}
            onComplete={onCountAnimationComplete}
            itemIcon={require("../../assets/svgs/MyProfile/Gem.svg")}
            closeCountModal={() => this.toggleAnimatedCountMOdal(false)}
          />
        )}

        <ScrollView
          ref={ref => (this.horizontalScrollRef = ref)}
          horizontal
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          // keyboardDismissMode={"none"}
          keyboardShouldPersistTaps={"always"}
        >
          <ScrollView
            ref={ref => (this.verticalScrollRef = ref)}
            scrollEnabled={!optionViewMode}
            showsVerticalScrollIndicator={false}
            // keyboardDismissMode={"none"}
            keyboardShouldPersistTaps={"always"}
            bounces={false}
            style={{
              width: DeviceWidth * 0.9
            }}
          >
            {fromChatWindow ? (
              <View />
            ) : (
              <>
                {!isEmpty(contentQuestions) &&
                  !isEmpty(contentQuestions[item._id]) && (
                    <PostsList
                      // questions={contentQuestions[item._id]}
                      pickQuestion={this.pickQuestion}
                      postObj={postObj}
                      // isFavourite={inFav}
                      onReplaceGame={this.props.onReplaceGame}
                      onFavRemoved={key => {
                        console.log(" key for removing ", key);
                        this.props.onFavRemoved(key);
                      }}
                      onFavExeeced={this.props.onFavExeeced}
                      closeOptionViewMode={this.closeOptionViewMode}
                      // question={question}
                      selectedList={selectedList}
                      fromChatWindow={fromChatWindow}
                      // postId={postId}
                      gameId={item._id}
                      // redHeart={favId ? true : false}
                      pickOption={this.pickOption}
                      // postedOption={question.option}
                      showActive={!showReplaceableQuestions}
                      showIconRow={!showReplaceableQuestions}
                      showReplaceButton={showReplaceableQuestions}
                      showDeleteIcon={
                        posts[item._id] && posts[item._id].length > 1
                          ? true
                          : false
                      }
                    />
                  )}

                {showReplaceableQuestions && (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                      marginTop: 32,
                      borderRadius: 20,
                      marginHorizontal: 64,
                      paddingVertical: 12,
                      backgroundColor: WHITE
                    }}
                    onPress={() => {
                      this.closeOptionViewMode(true);
                    }}
                  >
                    <MediumText
                      style={{
                        textAlign: "center",
                        color: FONT_GREY,
                        fontSize: 15,
                        marginVertical: 2,
                        fontWeight: "600"
                      }}
                    >
                      {"Cancel"}
                    </MediumText>
                  </TouchableOpacity>
                )}
              </>
            )}
            <View
              style={{
                backgroundColor: showLightBgColor ? item.lightColor : "#0000",
                paddingTop: showLightBgColor ? 10 : 0,
                marginTop: showLightBgColor ? 10 : 0,
                paddingBottom: showLightBgColor ? 20 : 0
              }}
            >
              {item.content && !showReplaceableQuestions ? (
                this.renderTabNavigator()
              ) : (
                <View />
              )}

              {item.content && !showReplaceableQuestions ? (
                this.renderQuestionItems()
              ) : item.value === "TWO_TRUTHS_AND_A_LIE" ? (
                <TwoTruthsAndlie
                  fromChatWindow={fromChatWindow}
                  toggleQuestionPicker={toggleQuestionPicker}
                  postQuestionFromOtherGame={this.postQuestionFromOtherGame}
                />
              ) : item.value === "THE_PERFECT_GIF" ? (
                <ThePerfectGif
                  toggleQuestionPicker={toggleQuestionPicker}
                  postQuestionFromOtherGame={this.postQuestionFromOtherGame}
                  toggleGifPicker={toggleGifPicker}
                />
              ) : (
                <View />
              )}
            </View>
          </ScrollView>
          <PickedQuestionview
            setOptionViewMode={this.props.setOptionViewMode}
            item={item}
            pickedQuestion={pickedQuestion}
            saveQuestion={this.saveQuestion}
            sendQuestion={this.sendQuestion}
          />
        </ScrollView>
      </VerticalGradientView>
    );
  }
}

const styles = StyleSheet.create({
  tabText: {
    fontSize: 18,
    textAlign: "center"
  },
  tabTappableView: {
    height: 30,
    width: DeviceWidth * 0.39,
    justifyContent: "center",
    borderRightColor: "#cfcfcf",
    marginTop: 3,
    flexDirection: "row",
    alignItems: "center"
  },
  topItemsContainer: {
    height: 35,
    width: DeviceWidth * 0.8,
    alignSelf: "center",
    borderRadius: 8,
    backgroundColor: "rgb(238,238,238)",
    justifyContent: "center",
    marginBottom: 10
  },
  swipeTabLayout: {
    width: DeviceWidth * 0.408,
    height: 30,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: DeviceWidth * 0.005,
    position: "absolute",
    zIndex: -1,
    shadowColor: "rgba(0,0,0,0.5)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3
  },
  submitButtonView: {
    height: 50,
    width: DeviceWidth * 0.4,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30
  },
  avatarImage: {
    height: GAME_LOGO_RADIUS * 2,
    width: GAME_LOGO_RADIUS * 2,
    borderRadius: GAME_LOGO_RADIUS,
    marginTop: -GAME_LOGO_RADIUS,
    alignSelf: "center",
    backgroundColor: "#fff",
    shadowColor: `#000`,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    alignItems: "center",
    justifyContent: "center"
  },
  pickLimitText: {
    textAlign: "center",
    color: "#FFFFFF",
    fontWeight: "500",
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  topItemRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginHorizontal: 20,
    marginTop: 2.5
  },
  nameIconView: {
    width: DeviceWidth * 0.7,
    justifyContent: "flex-start",
    alignItems: "center",
    height: DeviceHeight * 0.125
  },
  cloudIcon: {
    marginTop: 20,
    marginLeft: 15
  },
  refreshIcon: {
    marginTop: 25,
    marginRight: 15
  },
  gameName: {
    textAlign: "center",
    color: "#fff",
    fontSize: 23
  },
  gameCardView: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  },
  optionView: {
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    marginVertical: 15,
    marginHorizontal: 20,
    fontWeight: "200"
  }
});

const mapStateToProps = state => {
  return {
    myData: state.info.userInfo || {},
    posts: state.info.posts,
    contentQuestions: state.content.questions,
    rooms: state.rooms.rooms,
    gameNames: state.questions.gameNames,
    selectedRoomId: state.rooms.selected_room_id,
    seenQuestions: state.content.seenQuestions,
    currentChatScreenIndex: state.nav.currentChatScreenIndex,
    planPrices: state.app.packPrices || [],
    expenseTutorials: state.tutorial.expenses
  };
};

const mapDispatchToProps = dispatch => ({
  setSingleFavouriteQuestion: bindActionCreators(
    QuestionActions.sendQuestionToFav,
    dispatch
  ),
  setPosts: bindActionCreators(UserActions.setPosts, dispatch),
  pushAndSendMessage: bindActionCreators(
    ChatActions.pushAndSendMessage,
    dispatch
  ),
  addNewPost: bindActionCreators(ContentActions.addPost, dispatch),
  addEditedPost: bindActionCreators(ContentActions.addEditedPost, dispatch),
  addNewInfoPost: bindActionCreators(UserActions.addNewPostIntoGame, dispatch),
  addNewFav: bindActionCreators(ContentActions.makeOneQuestionFav, dispatch),
  removeFromFavourites: bindActionCreators(ContentActions.removeFav, dispatch),
  replaceInfoPost: bindActionCreators(UserActions.replacePostInGame, dispatch),
  removeOnegame: bindActionCreators(UserActions.removeOnegame, dispatch),
  replaceOneGame: bindActionCreators(
    UserActions.replaceWholeOneGameWithNewGame,
    dispatch
  ),
  removeFromPosts: bindActionCreators(ContentActions.deletePost, dispatch),
  deleteEditedPost: bindActionCreators(
    ContentActions.deleteEditedPost,
    dispatch
  ),
  removeInfoPostInGame: bindActionCreators(
    UserActions.removePostInGame,
    dispatch
  ),
  updateOwnProfile: bindActionCreators(UserActions.updateOwnProfile, dispatch),
  deleteAllPostsOfGame: bindActionCreators(
    ContentActions.deleteOneGamePosts,
    dispatch
  ),
  setExpenseTutorial: bindActionCreators(addExpenseTutorialCount, dispatch),
  updateContentQuestions: bindActionCreators(
    ContentActions.updateContentQuestions,
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(CardsHolder);
