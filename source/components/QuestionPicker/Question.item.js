import Lodash from "lodash";
import React, { Component } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicon from "react-native-vector-icons/Ionicons";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { BlurView } from "@react-native-community/blur";
import {
  CORRECT_RESPONSE_GREEN,
  LIGHT_PURPLE,
  PURPLE,
  FONT_BLACK,
  FONT_GREY
} from "../../config/Colors";
import { appConstants, msgTypes, LEFT_MARGIN } from "../../config/Constants";
import { DeviceHeight, DeviceWidth } from "../../config/Device";
import { retrieveData } from "../../config/Storage";
import {
  addFavourites,
  addPostMethod,
  deletePostMethod,
  editPostMethod
} from "../../network/question";
import { getPosts } from "../../network/user";
import * as QuestionActions from "../../redux/actions/questions";
import * as QuestionsApi from "../../network/question";
import * as UserActions from "../../redux/actions/user.info";
import MediumText from "../../components/Texts/MediumText";
import * as ContentActions from "../../redux/actions/content";
import _sortBy from "lodash/sortBy";
import _find from "lodash/find";
import RegularText from "../Texts/RegularText";
import { sharedStyles } from "../../styles/Shared";
import NoFeedbackTapView from "../Views/NoFeedbackTapView";
import { pushAndSendMessage } from "../../redux/actions/chat";
import { shareContent } from "../../redux/actions/nav";
import SvgUri from "react-native-svg-uri";
class QuestionItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pickedOption: null,
      userId: "",
      postEditMode: false
    };
    // this.makeReplaceViewFalse = this.makeReplaceViewFalse.bind(this);
  }

  showOverRideAlert = question => {
    this.props.onFavExeeced(question);
    // const { adminProps } = this.props;
    // const { favouritesLimit } = adminProps;
    // Alert.alert(
    //   "Favourite limit exeeced ",
    //   "To add this favourite , you need to delete your oldest favourite ",
    //   //
    //   [
    //     {
    //       onPress: () => this.addNewFavOverRiding(question),
    //       text: "DELETE OLDEST"
    //     },
    //     {
    //       text: "CANCEL",
    //       onPress: () => console.log("Ask me later pressed")
    //     }
    //   ],
    //
    // [
    //   { text: "Confirm", onPress: () => this.addNewFavOverRiding(question) },{        {
    //     text: "Cancel",
    //     onPress: () => console.log("Cancel Pressed"),
    //     style: "cancel"
    //   })
    // ],
    // { cancelable: false }
    // );
  };
  addNewFavOverRiding = question => {
    const currentGameQuestions = this.props.contentQuestions[
      question.gameId._id
    ];
    const currentFavQuestions = currentGameQuestions.filter(q => {
      if (q.favId && q.favCreatedAt) {
        return true;
      } else {
        return false;
      }
    });
    const sortedFavQuestions = _sortBy(currentFavQuestions, "favCreatedAt");
    // const oldestFavourite = this.props
    // return;
    QuestionsApi.deleteFavourites(
      { favouriteId: sortedFavQuestions[0].favId },
      deleteResponse => {
        if (deleteResponse.success) {
          this.props.removeFromFavourites(
            sortedFavQuestions[0]._id,
            sortedFavQuestions[0].gameId._id,
            sortedFavQuestions[0].favId
          );
          addFavourites(
            { questionId: question._id, category: question.category },
            cbData => {
              if (cbData.success) {
                this.props.addNewFav(
                  question._id,
                  question.gameId._id,
                  cbData.data._id,
                  cbData.data.createdAt
                );
              } else {
                alert(" error in addding new favourite");
              }
            }
          );
        }
      }
    );
  };
  addToFavouries = question => {
    const { userId } = this.state;
    const {
      setSingleFavouriteQuestion,
      adminProps,
      myData,
      setPosts
    } = this.props;
    const { favouritesLimit } = adminProps;
    const { _id, category, name, gameId } = question;
    const prevFavourites = this.props.allFavourites[gameId] || [];
    const currentFavLength = this.props.contentQuestions[gameId._id].filter(
      q => {
        if (q.favId) {
          return true;
        } else {
          return false;
        }
      }
    ).length;
    if (currentFavLength >= favouritesLimit) {
      this.showOverRideAlert(question);
      return;
    } else {
      addFavourites({ questionId: _id, category }, cbData => {
        console.log(" added favourite result is ", cbData);
        if (cbData.success) {
          this.props.addNewFav(
            _id,
            gameId._id,
            cbData.data._id,
            cbData.data.createdAt
          );
          // show acknowledgment if success or Revert animation if API call fails
        } else {
          //
        }
      });
    }
  };

  postQuestion = questionId => {
    const { fromChatWindow, posts, question } = this.props;
    const postsLength =
      !Lodash.isEmpty(posts) &&
      !Lodash.isEmpty(posts[question.name]) &&
      posts[question.name].length;

    const { userId, pickedOption } = this.state;
    const postObj = {
      userId,
      questionId,
      option: pickedOption,
      type: fromChatWindow
        ? appConstants.POST_TO_CHAT
        : appConstants.POST_TO_PROFILE
    };

    if (postsLength === false) {
      if (fromChatWindow) {
        this.postQuestionCall(postObj);
      } else {
        this.replaceGame(postObj);
      }
    } else {
      if (postsLength === 2) {
        this.props.setReplaceQuestionMode(true);
        // this.setState({
        //   showReplaceableQuestions: true
        // });
      } else {
        // add one more from the same game
        this.postQuestionCall(postObj);
      }
    }
  };

  postQuestionCall = postObj => {
    const {
      fromChatWindow,
      setPosts,
      myData,
      closeOptionViewMode
    } = this.props;
    addPostMethod(postObj, cbData => {
      console.log(" add post result is ", cbData);
      if (fromChatWindow) {
        // send as message
      } else {
        getPosts(myData._id, cbData => {
          closeOptionViewMode(true);
          setPosts(cbData.data);
        });
        const {
          _id: postId,
          questionId: {
            _id: question_id,
            gameId: { _id: gameId }
          },
          option,
          postOrder
        } = cbData.data;
        closeOptionViewMode(true);
        setTimeout(() => {
          this.props.addNewPost(question_id, gameId, postId, option, postOrder);
        }, 400);

        // getPosts(myData._id, cbData => {
        //   setPosts(cbData.data);
        // });
        // show profile card posted acknowledgment
      }
    });
  };

  removeFromFavourites = question => {
    console.log(" questions to be delted is ", question);

    const gameId = question.gameId._id ? question.gameId._id : question.gameId;
    const { setPosts, myData, removeOneFavourite } = this.props;

    QuestionsApi.deleteFavourites(
      { favouriteId: question.favId },
      deleteResponse => {
        console.log(" delete reponse ", deleteResponse);
        if (deleteResponse.success) {
          // removeOneFavourite(gameId, question._id, question.category, question);
          this.props.removeFromFavourites(question._id, gameId, question.favId);
          // this.props.onFavRemoved(question.gameId.key)
          // this.props.closerModalRef.)
          // getPosts(myData._id, dbPosts => {
          //   if (dbPosts.success) {
          //     setPosts(dbPosts.data);
          //   }
          // });
        } else {
          alert(" error in deleting one response ");
        }
      }
    );
  };

  deletePostCall = question => {
    const { myData, setPosts, gameId, contentQuestions } = this.props;
    const { postId, _id: questionId, gameId: _ } = question;
    console.log(" question to be deleted is ", question);
    // return;
    const otherPost = contentQuestions[gameId].filter(post => {
      if (post.postId && post.postId !== postId) {
        return true;
      } else {
        return false;
      }
    });
    console.log(" other post is ", otherPost);
    deletePostMethod({ id: postId }, res => {
      console.log(" delete one question res  ", postId, res);

      if (res.success) {
        editPostMethod({ postOrder: 1 }, otherPost[0].postId, editCb => {
          if (editCb.success) {
            this.props.udpatePostOrder(
              otherPost[0].postId,
              gameId,
              otherPost[0]._id,
              1
            );
            this.props.removeFromPosts(questionId, gameId, postId);
            this.props.removeInfoPostInGame(gameId, postId);
          }
        });
        // getPosts(myData._id, cbData => {
        //   if (cbData.success) {
        //     setPosts(cbData.data);
        //   }
        // });
      } else {
        console.log(" error in deleting one post ");
      }
    });
  };
  removePost = question => {};

  deletePost = question => {
    Alert.alert(
      "Confirm delete",
      "Are you sure you want to delete this from your profile?",
      [
        {
          text: "yes",
          onPress: async () => {
            this.deletePostCall(question);
          }
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        }
      ],
      { cancelable: false }
    );
  };

  renderQuestion = question => {
    return (
      <>
        {question.name === "WOULD_YOU_RATHER" ||
        (question.name === "SIMILARITIES" &&
          question.question === "SIMILARITIES") ? (
          <MediumText style={styles.optionTextOnly}>
            {question.options[0]} {"\n"}
            <MediumText style={styles.orText}>OR</MediumText>
            {"\n"}
            {question.options[1]}
          </MediumText>
        ) : (
          <MediumText style={styles.questionText}>
            {question.question}
          </MediumText>
        )}
      </>
    );
  };

  renderPick = (pick, incomingQuestion) => {
    const {
      pickQuestion,
      postId,
      postObj,
      contentQuestions,
      gameId,
      question,
      showFavWarning
    } = this.props;

    return (
      <TouchableOpacity
        onPress={() => {
          if (pick) {
            if (showFavWarning) {
              return Alert.alert(
                "this is intimate question ",
                " You cant pick this question ",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      //show action
                      console.log(" con");
                    }
                  }
                ]
              );
            }
            pickQuestion(incomingQuestion, false);
          } else {
            deletePostMethod({ id: postId }, async cb => {
              if (cb.success) {
                const { myData, setPosts, gameId } = this.props;
                const { postId, _id: questionId, gameId: _ } = incomingQuestion;
                this.props.removeFromPosts(questionId, gameId, postId);
                const oldPost = _find(contentQuestions[gameId], { postId });
                // this.props.replacePost({questionId, gameId , postId})
                this.postQuestionCall({
                  ...postObj,
                  postOrder: question.postOrder || 1
                });
              }
            });
          }
        }}
        style={[
          styles.pickButtonView,
          {
            backgroundColor: pick ? "#fff" : "#FF2D552A",
            marginTop: pick ? 0 : 25
          }
        ]}
      >
        <Text style={styles.pickText}>{pick ? "PICK" : "REPLACE"}</Text>
      </TouchableOpacity>
    );
  };

  editPost = () => {
    const { pickedQuestion, setOptionViewMode } = this.props;
    const { pickedOption } = this.state;
    editPostMethod({ option: pickedOption }, pickedQuestion.postId, cbData => {
      setOptionViewMode(false);
    });
  };

  buildMessageAndSend = question => {
    const { pushAndSendMessage } = this.props;
    let msgBody = {
      text: JSON.stringify(question),
      type: msgTypes.MESSAGE_QUESTION_CARD
    };
    pushAndSendMessage(msgBody);
  };

  handleShare = () => {
    const { shareContent, question, currentScreenIndex } = this.props;
    const { options, gameId } = question;

    let shareObj;
    if (currentScreenIndex < 3) {
      shareObj = {
        options,
        gameId,
        question: question.question,
        openIn: "MyProfile"
      };
    } else {
      shareObj = {
        options,
        gameId,
        question: question.question,
        openIn: "ChatWindow"
      };
    }
    shareContent(shareObj);

    setTimeout(() => {
      shareContent(undefined);
    }, 200);
  };

  renderIconsRow = () => {
    const {
      question,
      showActive,
      postedOption,
      postId,
      showDeleteIcon,
      pickOption,
      redHeart
    } = this.props;
    const inFav = question.favId !== undefined;
    if (question.favId) {
    }
    return (
      <View style={styles.iconViewRow}>
        <TouchableOpacity
          onPress={() => {
            redHeart
              ? this.removeFromFavourites(question)
              : this.addToFavouries(question);
          }}
          style={styles.favIconFilledView}
        >
          {!redHeart ? (
            <SvgUri
              height={22}
              width={22}
              source={require("../../assets/svgs/MyProfile/heartoutline.svg")}
            />
          ) : (
            <SvgUri
              height={22}
              width={22}
              source={require("../../assets/svgs/MyProfile/heartfilled.svg")}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.handleShare}
          style={styles.shareIconView}
        >
          <EvilIcons name={"share-google"} size={30} color={"#454545"} />
        </TouchableOpacity>
        {showActive ? (
          <>
            <TouchableOpacity
              onPress={() => {
                pickOption(parseInt(postedOption), true, question, postId);
              }}
              style={styles.shareIconView}
            >
              <SvgUri
                height={18}
                width={18}
                source={require("../../assets/svgs/MyProfile/pencil.svg")}
              />
            </TouchableOpacity>
            {showDeleteIcon ? (
              <TouchableOpacity
                onPress={() => {
                  this.deletePost(question);
                }}
                style={styles.shareIconView}
              >
                <SvgUri
                  height={20}
                  width={20}
                  source={require("../../assets/svgs/MyProfile/trash.svg")}
                />
              </TouchableOpacity>
            ) : (
              <View />
            )}
          </>
        ) : (
          <View />
        )}
      </View>
    );
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    const { props } = this;
    return (
      props.showFavWarning !== nextProps.showFavWarning ||
      props.redHeart !== nextProps.redHeart ||
      props.showActive !== nextProps.showActive ||
      props.showDeleteIcon !== nextProps.showDeleteIcon ||
      props.showIconRow !== nextProps.showIconRow ||
      props.showReplaceButton !== nextProps.showReplaceButton
    );
  };

  render() {
    const {
      question,
      pickQuestion,
      fromChatWindow,
      showActive,
      showIconRow,
      showReplaceButton,
      currentChatScreenIndex,
      currentScreenIndex,
      isFriend,
      showFavWarning
    } = this.props;

    const isEmpty = Lodash.isEmpty(question);

    if (isEmpty) {
      return <View />;
    } else {
      // const isFriend = currentChatScreenIndex === 0;
      const questionIntemate = question.category === "2";
      return (
        <>
          <View style={styles.questionLayout}>
            {this.renderQuestion(question)}
            {showFavWarning ? (
              <NoFeedbackTapView
                style={{
                  ...styles.questionLayout,
                  ...StyleSheet.absoluteFillObject,
                  ...sharedStyles.justifiedCenter,
                  zIndex: 99,
                  // backgroundColor: "#fff",
                  backgroundColor: "#0000",
                  // backgroundColor: question.gameId.colors[1] + "Ff",
                  marginVertical: 0,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 1,
                    height: 3
                  },
                  shadowOpacity: 0.2
                }}
              >
                <BlurView
                  style={{
                    ...styles.questionLayout,
                    ...StyleSheet.absoluteFillObject,
                    ...sharedStyles.justifiedCenter,
                    zIndex: 99,
                    marginVertical: 0,
                    backgroundColor: "#0000"
                  }}
                  blurType="dark"
                  blurAmount={5}
                >
                  <MediumText
                    style={{
                      color: "#fff",
                      textAlign: "center",
                      fontSize: 17,
                      paddingHorizontal: LEFT_MARGIN
                    }}
                  >
                    This card might be sensitive to be posted here!
                  </MediumText>
                </BlurView>
              </NoFeedbackTapView>
            ) : null}
            <View style={styles.belowQuestionRow}>
              {showIconRow ? this.renderIconsRow() : <View />}
              {fromChatWindow ? (
                <TouchableOpacity
                  style={styles.sendLayout}
                  onPress={() => {
                    question.name === "VIBE"
                      ? this.buildMessageAndSend(question)
                      : pickQuestion(question, false);
                  }}
                >
                  <LinearGradient
                    colors={[PURPLE, LIGHT_PURPLE]}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style={styles.sendIconView}
                  >
                    <Image
                      style={styles.sendIcon}
                      source={require("../../assets/images/sendIcon.png")}
                    />
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <View />
              )}
            </View>

            {!fromChatWindow && !showActive ? (
              this.renderPick(!showReplaceButton, question)
            ) : (
              <View />
            )}

            {!fromChatWindow && showActive ? (
              <View style={styles.activeBadge}>
                <RegularText style={styles.activeText}>Active</RegularText>
              </View>
            ) : (
              <View />
            )}
          </View>
        </>
      );
    }

    /**
     * fromChatWindow
     * 1: normal card with question and icons
     * 2: Big card with question and options
     *
     * fromMyProfile:
     * 1: normal card with question, 2 icons and PICK text
     * 2: normal card with question, 3 icons and active badge.
     * 3: normal card with question, 4 icons and active badge.
     * 4: normal card with question and REPLACE text.
     * 5: Big card with question and options
     */
  }
}

const styles = StyleSheet.create({
  optionTextOnly: {
    color: "#1E2432",
    textAlign: "center",
    fontSize: 16,
    paddingVertical: 20,
    paddingHorizontal: 20
  },
  orText: {
    fontWeight: "900",
    fontSize: 15
  },
  pickButtonView: {
    backgroundColor: "#fff",
    borderTopColor: "rgba(0,0,0,0.1)",
    borderTopWidth: 1,
    justifyContent: "center",
    height: 40,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15
  },
  pickText: {
    textAlign: "center",
    color: "#FF2D55",
    fontSize: 15,
    marginTop: 2,
    fontWeight: "600"
  },
  activeText: {
    color: "#fff",
    fontSize: 15
  },
  activeBadge: {
    height: 30,
    width: 90,
    backgroundColor: "#FF2D55",
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 15,
    alignItems: "center",
    alignSelf: "flex-end",
    justifyContent: "center"
  },
  questionText: {
    color: "#1E2432",
    textAlign: "left",
    fontSize: 16,
    paddingTop: 22,
    fontWeight: "600",
    paddingHorizontal: 18,
    paddingBottom: 12
  },
  questionLayout: {
    width: DeviceWidth * 0.835,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 0,
    alignSelf: "center",
    marginVertical: 7,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    elevation: 1
  },
  belowQuestionRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  iconViewRow: {
    flexDirection: "row",
    width: DeviceWidth * 0.84 * 0.7,
    marginLeft: 15
  },
  heartOutlineImage: {
    height: 20,
    width: 22
  },
  favIconFilledView: {
    height: 35,
    width: 35,
    borderRadius: 17.5,
    backgroundColor: "rgba(0,0,0,0.05)",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    paddingTop: 1
  },
  shareIconView: {
    height: 35,
    width: 35,
    borderRadius: 17.5,
    backgroundColor: "rgba(0,0,0,0.05)",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1
  },
  sendLayout: {
    height: 50,
    width: 50,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1
  },
  sendIconView: {
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center"
  },
  sendIcon: {
    height: 20,
    width: 30,
    marginLeft: 5
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
  }
});

const mapStateToProps = state => {
  return {
    myData: state.info.userInfo || {},
    posts: state.info.posts,
    adminProps: state.app.adminProps,
    allFavourites: state.questions.favourites,
    contentQuestions: state.content.questions,
    currentScreenIndex: state.nav.currentScreenIndex
  };
};

const mapDispatchToProps = dispatch => ({
  pushAndSendMessage: bindActionCreators(pushAndSendMessage, dispatch),
  setSingleFavouriteQuestion: bindActionCreators(
    QuestionActions.sendQuestionToFav,
    dispatch
  ),
  removeOneFavourite: bindActionCreators(
    QuestionActions.removeOneFavourite,
    dispatch
  ),
  adddNewFavOverriding: bindActionCreators(
    QuestionActions.adddNewFavOverriding,
    dispatch
  ),
  setPosts: bindActionCreators(UserActions.setPosts, dispatch),
  //
  addNewFav: bindActionCreators(ContentActions.makeOneQuestionFav, dispatch),
  removeFromFavourites: bindActionCreators(ContentActions.removeFav, dispatch),
  addNewPost: bindActionCreators(ContentActions.addPost, dispatch),
  removeFromPosts: bindActionCreators(ContentActions.deletePost, dispatch),
  removeInfoPostInGame: bindActionCreators(
    UserActions.removePostInGame,
    dispatch
  ),
  udpatePostOrder: bindActionCreators(
    ContentActions.updateOnePostOrder,
    dispatch
  ),
  shareContent: bindActionCreators(shareContent, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(QuestionItem);
