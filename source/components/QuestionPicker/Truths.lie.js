import { isEmpty } from "lodash";
import React, { Component, createRef } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator
} from "react-native";
import { Transition, Transitioning } from "react-native-reanimated";
import Ionicon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  FONT_BLACK,
  LIGHT_PURPLE,
  PALE_ORANGE,
  PURPLE,
  NEW_GREY
} from "../../config/Colors";
import { appConstants, LEFT_MARGIN, msgTypes } from "../../config/Constants";
import { DeviceWidth } from "../../config/Device";
import {
  addQuestionPostbyUser,
  deletePostMethod
} from "../../network/question";
import * as ContentActions from "../../redux/actions/content";
import * as UserActions from "../../redux/actions/user.info";
import { sharedStyles } from "../../styles/Shared";
import MediumText from "../Texts/MediumText";
import RegularText from "../Texts/RegularText";
import RowView from "../Views/RowView";
import VerticalGradientView from "../Views/VerticalGradientView";
import { shareContent, postUserQuestionContent } from "../../redux/actions/nav";
import { pushAndSendMessage } from "../../redux/actions/chat";

class TwoTruthsAndlie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      truthList: [
        {
          key: "a_truth",
          placeholder: "Looking for you",
          label: "Truth",
          value: ""
        },
        {
          key: "another_truth",
          placeholder: "Meet you once",
          label: "Truth",
          value: ""
        },
        {
          key: "a_lie",
          placeholder: "I have 11 fingers",
          label: "Lie",
          value: ""
        }
      ],
      gameId: "",
      postId: "",
      questionId: "",
      currentlyTypingIndex: 0,
      isPostFound: false,
      editMode: false,
      isLoading: false,
      truthListFromPost: [],
      gameObj: {}
    };
    this.shuffleRef = createRef();
  }

  shuffle(array) {
    array.sort(() => Math.random() - 0.5);
  }

  transition = () => (
    <Transition.Together>
      <Transition.Change interpolation={"easeInOut"} />
    </Transition.Together>
  );

  handlePostSetting = currentPost => {
    const {
      option,
      questionId: { options, _id: questionId },
      _id: postId
    } = currentPost;

    let localOptions = [];
    let _localArray = [];

    options.map((opt, optId) => {
      if (optId === Number(option)) {
        _localArray.push(opt);
        localOptions.push({
          key: "a_lie",
          placeholder: "Looking for you",
          label: "Lie",
          value: opt
        });
      } else {
        if (
          localOptions.length > 0 &&
          localOptions.some(oldOpt => oldOpt.key === "a_truth")
        ) {
          _localArray.push(opt);
          localOptions.push({
            key: "another_truth",
            placeholder: "Looking for you",
            label: "Truth",
            value: opt
          });
        } else {
          _localArray.push(opt);
          localOptions.push({
            key: "a_truth",
            placeholder: "Looking for you",
            label: "Truth",
            value: opt
          });
        }
      }
    });
    this.setState({
      truthList: localOptions,
      truthListFromPost: _localArray,
      isPostFound: true,
      questionId,
      postId
    });
  };

  componentDidMount = async () => {
    // const { gameNames, myPosts, fromChatWindow } = this.props;
    // const gameObj = gameNames.find(
    //   game => game.value === "TWO_TRUTHS_AND_A_LIE"
    // );
    // this.setState({ gameId: gameObj._id, gameObj });
    // if (!isEmpty(myPosts[gameObj._id]) && !fromChatWindow) {
    //   this.handlePostSetting(myPosts[gameObj._id][0]);
    // } else {
    //   this.setState({ editMode: true });
    // }
  };

  share = () => {
    const { shareContent, currentScreenIndex } = this.props;
    const { truthList, gameObj } = this.state;
    const options = truthList.map(truth => truth.value);
    let shareObj;
    if (currentScreenIndex < 3) {
      shareObj = {
        options,
        question: "Spot the lie",
        gameId: gameObj,
        openIn: "MyProfile"
      };
    } else {
      shareObj = {
        options,
        question: "Spot the lie",
        gameId: gameObj,
        openIn: "ChatWindow"
      };
    }
    shareContent(shareObj);

    setTimeout(() => {
      shareContent(undefined);
    }, 200);
  };

  editOldPost = () => {
    const { gameId, truthList } = this.state;

    const {
      selectedGame,
      openReplaceModal,
      myPosts: posts,
      replacePostInGame,
      fromResponse,
      reactToGif
    } = this.props;
    addQuestionPostbyUser(this.createQuestionAndPost(), cbData => {
      if (cbData.success) {
        const postId =
          posts &&
          posts[gameId] &&
          posts[gameId].length > 0 &&
          posts[gameId][0].questionId &&
          posts[gameId][0]._id;
        deletePostMethod({ id: postId }, cbDeleteData => {
          this.setState({
            isLoading: false,
            editMode: false
            // truthListFromPost: [truthList[0].value ,[truthList[1].value ,[truthList[2].value  ]
          });
          if (cbDeleteData.success) {
            replacePostInGame(gameId, postId, cbData.data);
          } else {
            alert("Something went wrong while deleting old post");
          }
        });
      } else {
        this.setState({ isLoading: false });
        alert("Something went wrong while adding post&Question");
      }
    });
  };

  createQuestionAndPost = () => {
    let { truthList, gameId } = this.state;
    let { fromChatWindow } = this.props;

    const option = truthList.findIndex(truths => truths.key === "a_lie");

    return {
      name: "TWO_TRUTHS_AND_A_LIE",
      question: "TWO_TRUTHS_AND_A_LIE",
      option,
      options: [truthList[0].value, truthList[1].value, truthList[2].value],
      type: fromChatWindow
        ? appConstants.POST_TO_CHAT
        : appConstants.POST_TO_PROFILE,
      gameId,
      category: "1",
      postOrder: 1
    };
  };

  send = () => {
    let { truthList, isPostFound, truthListFromPost } = this.state;
    let {
      postUserQuestionContent,
      fromChatWindow,
      pushAndSendMessage
    } = this.props;
    if (fromChatWindow) {
      // alert("now send as message");
      addQuestionPostbyUser(this.createQuestionAndPost(), cbPostObj => {
        if (cbPostObj.success) {
          let msgObj = {
            text: JSON.stringify([cbPostObj.data]),
            type: msgTypes.MESSAGE_CHAT_CARD
          };
          pushAndSendMessage(msgObj);
        } else {
          alert("Something went wrong while posting this card");
        }
      });
    } else {
      if (isPostFound) {
        if (
          truthList[0].value === truthListFromPost[0] &&
          truthList[1].value === truthListFromPost[1] &&
          truthList[2].value === truthListFromPost[2]
        ) {
          this.setState({ editMode: false });
        } else {
          this.setState({ isLoading: true });
          this.editOldPost();
        }
      } else {
        postUserQuestionContent(this.createQuestionAndPost());
        setTimeout(() => {
          postUserQuestionContent(undefined);
        }, 500);
      }
    }
  };

  shouldComponentUpdate = () => {
    return false;
  };

  onChangeTextHandler = value => {
    const { truthList, currentlyTypingIndex } = this.state;
    let editableTruthList = [...truthList];
    editableTruthList[currentlyTypingIndex].value = value;
    console.log(
      "lodahs check again here :",
      truthList,
      this.state.truthListFromPost
    );
    this.setState({ truthList: editableTruthList }, () => {
      console.log(
        "lodahs check again here :",
        truthList,
        this.state.truthListFromPost
      );
    });
  };

  onFocusHandler = key => {
    const { truthList } = this.state;
    const currentlyTypingIndex = truthList.findIndex(
      truth => truth.key === key
    );
    this.setState({ currentlyTypingIndex });
  };

  render() {
    let { truthList, isPostFound, editMode, isLoading } = this.state;
    const { fromChatWindow } = this.props;

    let disabled = truthList.some(element => element.value === "");

    return (
      <View style={styles.baseLayout}>
        <Transitioning.View
          ref={this.shuffleRef}
          // transition={this.transition()}
          style={styles.multilineInputsView}
        >
          <MediumText
            style={{
              color: FONT_BLACK,
              fontSize: 23,
              textAlign: "center",
              marginVertical: 5
            }}
          >
            Let other spot the Lie
          </MediumText>
          {truthList.map((item, itemId) => (
            <View
              style={{
                justifyContent: "center"
              }}
              key={itemId}
            >
              <RegularText
                style={{
                  fontSize: 18,
                  color: FONT_BLACK,
                  textAlign: "left",
                  marginVertical: 5,
                  marginLeft: LEFT_MARGIN / 2
                }}
              >
                {item.label}
              </RegularText>
              <TextInput
                editable={!isPostFound || (isPostFound && editMode)}
                style={styles.multilineInput}
                maxLength={200}
                onFocus={() => this.onFocusHandler(item.key)}
                placeholder={item.placeholder}
                multiline
                onChangeText={text => this.onChangeTextHandler(text)}
                value={item.value}
              />
            </View>
          ))}

          {!isPostFound || (isPostFound && editMode) ? (
            <TouchableOpacity
              disabled={disabled}
              onPress={() => {
                this.shuffleRef.current.animateNextTransition();
                const shuffled = this.state.truthList.slice();
                this.shuffle(shuffled);
                this.setState({ truthList: shuffled });
              }}
              style={{
                ...styles.iconButtonView,
                ...styles.shareIconView,
                backgroundColor: disabled ? "#cacaca80" : "#fff"
              }}
            >
              <Ionicon
                name={"ios-shuffle"}
                size={25}
                color={disabled ? "#fff" : PALE_ORANGE}
              />
            </TouchableOpacity>
          ) : (
            <View
              style={{
                height: LEFT_MARGIN
              }}
            />
          )}
        </Transitioning.View>

        <VerticalGradientView
          colors={
            disabled ? ["#cacaca80", "#cacaca80"] : [PURPLE, LIGHT_PURPLE]
          }
          style={{
            ...styles.saveButton,
            marginVertical: LEFT_MARGIN
          }}
        >
          <TouchableOpacity
            disabled={disabled}
            onPress={() => {
              if (isPostFound && !editMode) {
                this.setState({ editMode: true });
              } else {
                this.send();
              }
            }}
            style={{
              ...styles.saveButton,
              width:
                isPostFound && !editMode ? DeviceWidth * 0.6 : DeviceWidth * 0.5
            }}
          >
            {isLoading ? (
              <ActivityIndicator color={"#fff"} size={"small"} />
            ) : (
              <MediumText
                style={{
                  color: "#fff"
                }}
              >
                {fromChatWindow
                  ? "SEND"
                  : isPostFound
                  ? editMode
                    ? "SAVE AND DISPLAY"
                    : "EDIT"
                  : "SAVE AND DISPLAY"}
              </MediumText>
            )}
          </TouchableOpacity>
        </VerticalGradientView>

        {isPostFound && !editMode ? (
          <TouchableOpacity
            style={{
              ...styles.iconButtonView,
              backgroundColor: disabled ? "#cacaca80" : "#fff"
            }}
            disabled={disabled}
            onPress={this.share}
          >
            <Ionicon
              name={"md-share-alt"}
              size={25}
              color={disabled ? "#fff" : PALE_ORANGE}
            />
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  shareIconView: {
    borderWidth: 1,
    borderColor: NEW_GREY,
    marginVertical: LEFT_MARGIN
  },
  iconButtonView: {
    ...sharedStyles.justifiedCenter,
    height: 40,
    width: 40,
    borderRadius: 20,
    alignSelf: "center"
  },
  saveButton: {
    ...sharedStyles.justifiedCenter,
    height: 40,
    width: DeviceWidth * 0.75,
    borderRadius: 30,
    alignSelf: "center"
  },
  baseLayout: {
    alignSelf: "center",
    width: DeviceWidth * 0.8,
    flexDirection: "column"
  },
  multilineInputsView: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingTop: 20
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  truthButton: {
    height: 40,
    width: DeviceWidth * 0.23,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center"
  },
  multilineInput: {
    width: DeviceWidth * 0.7,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    height: 50,
    borderRadius: 20,
    color: FONT_BLACK,
    fontSize: 18,
    paddingLeft: 5,
    backgroundColor: "#0000000D",
    paddingTop: 15,
    paddingLeft: 10,
    fontFamily: "Proxima Nova"
  },
  sendButtonText: {
    fontWeight: "bold",
    fontSize: 20
  }
});

const mapStateToProps = state => {
  return {
    addUserPostQuestionRes: state.questions.addUserPostQuestion,
    gameNames: state.questions.gameNames,
    myData: state.info.userInfo,
    myPosts: state.info.posts,
    currentScreenIndex: state.nav.currentScreenIndex
  };
};

const mapDispatchToProps = dispatch => ({
  addNewPost: bindActionCreators(ContentActions.addPost, dispatch),
  removeFromPosts: bindActionCreators(ContentActions.deletePost, dispatch),
  removeInfoPostInGame: bindActionCreators(
    UserActions.removePostInGame,
    dispatch
  ),
  shareContent: bindActionCreators(shareContent, dispatch),
  replacePostInGame: bindActionCreators(
    UserActions.replacePostInGame,
    dispatch
  ),
  postUserQuestionContent: bindActionCreators(
    postUserQuestionContent,
    dispatch
  ),
  pushAndSendMessage: bindActionCreators(pushAndSendMessage, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(TwoTruthsAndlie);
