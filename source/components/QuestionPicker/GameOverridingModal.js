import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import RegularText from "../Texts/RegularText";
import { DeviceHeight, DeviceWidth } from "../../config/Device";
import { WHITE, FONT_GREY, PURPLE, LIGHT_PURPLE } from "../../config/Colors";
import { deletePostMethod, addPostMethod } from "../../network/question";
import _find from "lodash/find";
import {
  deleteOneGamePosts,
  deletePost,
  addPost
} from "../../redux/actions/content";
import {
  removePostInGame,
  replaceWholeOneGameWithNewGame,
  removeOnegame,
  addNewPostIntoGame,
  replacePostInGame,
  setPosts,
  setPostsOrder,
  updateOwnProfile
} from "../../redux/actions/user.info";
import { pushAndSendMessage } from "../../redux/actions/chat";
import { sendQuestionToFav } from "../../redux/actions/questions";
import { bindActionCreators } from "redux";
import { getPosts, updateProfile } from "../../network/user";
import RowView from "../Views/RowView";
import GameContainer from "../Common/Game.container";
import HorizontalGradientView from "../Views/HorizontalGradientView";
class GameOverridingModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      replaceLoading: false
    };
  }
  deletePostCall = id => {
    deletePostMethod({ id }, res => {
      if (res.success) {
        console.log("Successfully deleted post");
      }
    });
  };

  postQuestionCall = (newPost, replacing = false) => {
    const {
      postObj,
      myData,
      setPosts,
      posts: myInfoPosts,
      oldGamekey,
      setSelectedGame
    } = this.props;
    const { fromChatWindow, onReplaceComplete, gameNames } = postObj;
    this.setState({ isSaveLoading: true });
    addPostMethod(newPost, cbData => {
      if (cbData.success) {
        console.log(" game id is ", cbData.data);

        if (fromChatWindow) {
          // send as message
        } else {
          const {
            _id: postId,
            questionId: {
              _id: question_id,
              gameId: { _id: gameId }
            },
            option,
            postsOrder
          } = cbData.data;

          this.props.addNewPost(
            question_id,
            gameId,
            postId,
            option,
            postsOrder || 1
          );
          //this is for updating posts in userinfo ;
          if (replacing) {
            console.log(" replacing protocol initiated ", gameId);
            getPosts(myData._id, dbPosts => {
              if (dbPosts.success) {
                setPosts(dbPosts.data);
              }
            });
          } else {
            this.props.addNewInfoPost(gameId, cbData.data);
            // this.props
          }
          this.props.closeModal(true);

          const newGame = _find(gameNames, { _id: gameId });
          const oldGame = _find(gameNames, { value: oldGamekey });
          setSelectedGame(newGame.value);
          onReplaceComplete();
          this.props.closerQuestionPicker(oldGamekey, newGame);
          setTimeout(() => {
            this.props.updatePostsOrder(oldGame._id, gameId);
          }, 500);

          // if (!replacing) {
          // } else if (replacing === true) {
          //   cb(cbData.data);
          // }

          // this.props.setOneGamePosts()
          // setTimeout(() => {
          //   this.props.setPosts(dbPosts.data);
          // }, 300);
          // getPosts(myData._id, dbPosts => {
          //   if (dbPosts.success) {
          //     console.log(" post success data is ", dbPosts.data);
          //   }
          // });
        }
      }
    });
  };
  replaceGame = () => {
    this.setState({
      replaceLoading: true
    });
    console.log(" cb data is #0  ", this.props);
    const { postObj, posts, myData, oldGamekey, prevGameValue } = this.props;
    const { newGame = "", gameNames, postObj: newPost } = postObj;
    const oldGame = _find(gameNames, { value: oldGamekey });
    console.log("oldgame is ", oldGame, gameNames, oldGamekey);

    const { _id: oldGameId } = oldGame;
    const newgameId = newPost.gameId;
    posts[oldGameId].map(qId => {
      this.deletePostCall(qId._id);
    });
    this.postQuestionCall(newPost, true);
    const postsOrder = myData.posts.map(gameId => {
      return gameId === oldGameId ? newgameId : gameId;
    });

    updateProfile({ posts: postsOrder, hasEditedPosts: true }, async cbData => {
      this.props.updateOwnProfile({ hasEditedPosts: true });
      console.log(" cb data is ", cbData);
      if (cbData.success) {
        await this.props.deleteAllPostsOfGame(oldGameId);
        this.setState({
          replaceLoading: false
        });
      }
    });
  };
  render() {
    const { postObj, posts, myData } = this.props;
    const { replaceLoading } = this.state;
    const { newGame = "", oldGame = "", gameNames, postObj: newPost } = postObj;
    const oldGameObj = _find(gameNames, { value: oldGame });
    const newGameObj = _find(gameNames, { value: newGame });
    return (
      <View style={styles.modalContent}>
        <View style={styles.modalHead}>
          <RegularText style={styles.modalContentText}>
            Are you sure you want to replace?
          </RegularText>
        </View>
        <RowView
          style={{
            height: DeviceWidth * 0.5 * 0.55,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10
          }}
        >
          <GameContainer
            height={DeviceWidth * 0.5 * 0.55}
            width={DeviceWidth * 0.37 * 0.55}
            colors={oldGameObj.colors}
            gameName={oldGameObj.key}
            fromPresetModal={true}
            gameValue={oldGame}
          />
          <RegularText
            style={{
              paddingHorizontal: 10,
              textAlign: "center"
            }}
          >
            With
          </RegularText>
          <GameContainer
            height={DeviceWidth * 0.5 * 0.55}
            width={DeviceWidth * 0.37 * 0.55}
            colors={newGameObj.colors}
            gameName={newGameObj.key}
            fromPresetModal={true}
            gameValue={newGame}
          />
        </RowView>

        <View style={styles.btnCon}>
          <TouchableOpacity
            onPress={() => {
              this.replaceGame();
            }}
            activeOpacity={0.6}
          >
            <HorizontalGradientView
              style={styles.submitButtonView}
              colors={[PURPLE, LIGHT_PURPLE]}
            >
              {replaceLoading ? (
                <ActivityIndicator color={WHITE} size="small" />
              ) : (
                <RegularText style={{ ...styles.btnText, color: "#fff" }}>
                  Replace
                </RegularText>
              )}
            </HorizontalGradientView>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => this.props.closeModal()}
            style={[
              styles.btn,
              {
                backgroundColor: WHITE,
                borderWidth: 1,
                borderColor: FONT_GREY,
                marginBottom: 4
              }
            ]}
          >
            <RegularText style={{ ...styles.btnText, color: "#000" }}>
              Cancel
            </RegularText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  submitButtonView: {
    height: 50,
    width: DeviceWidth * 0.6,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    marginBottom: 10
  },
  modalContentText: {
    fontSize: 18,
    textAlign: "center",
    marginHorizontal: 24,
    lineHeight: 20
  },
  modalContent: {
    backgroundColor: "#fff",
    marginHorizontal: DeviceWidth * 0.1,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: DeviceHeight * 0.3,
    paddingTop: 18,
    paddingBottom: 10,
    paddingHorizontal: 0
  },
  modalHead: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  btnCon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20
    // width: DeviceWidth - 100,
  },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    width: DeviceWidth * 0.6
  },
  btnText: {
    // color:
    fontSize: 20
  }
});

const mapState = state => {
  return {
    myData: state.info.userInfo || {},
    posts: state.info.posts,
    categoryOneGames: state.questions.categoryOneGames,
    favouriteQuestions: state.questions.favourites,
    contentQuestions: state.content.questions,
    rooms: state.rooms.rooms,
    selectedRoomId: state.rooms.selected_room_id
    // prevGameValue: state.nav
  };
};

const mapDispatch = dispatch => {
  return {
    setSingleFavouriteQuestion: bindActionCreators(sendQuestionToFav, dispatch),
    setPosts: bindActionCreators(setPosts, dispatch),
    pushAndSendMessage: bindActionCreators(pushAndSendMessage, dispatch),
    //
    addNewPost: bindActionCreators(addPost, dispatch),
    addNewInfoPost: bindActionCreators(addNewPostIntoGame, dispatch),
    replaceInfoPost: bindActionCreators(replacePostInGame, dispatch),
    removeOnegame: bindActionCreators(removeOnegame, dispatch),
    deleteAllPostsOfGame: bindActionCreators(deleteOneGamePosts, dispatch),
    updatePostsOrder: bindActionCreators(setPostsOrder, dispatch),
    updateOwnProfile: bindActionCreators(updateOwnProfile, dispatch)
  };
};
export default connect(mapState, mapDispatch)(GameOverridingModal);
