import React, { Component } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { FONT_BLACK, LIGHT_PURPLE, PURPLE } from "../../config/Colors";
import { LEFT_MARGIN } from "../../config/Constants";
import { DeviceWidth } from "../../config/Device";
import {
  addQuestionPostbyUser,
  deletePostMethod
} from "../../network/question";
import { updateProfile } from "../../network/user";
import { deleteOneGamePosts } from "../../redux/actions/content";
import {
  addNewPostIntoGame,
  setPostsOrder
} from "../../redux/actions/user.info";
import { sharedStyles } from "../../styles/Shared";
import MediumText from "../Texts/MediumText";
import VerticalGradientView from "../Views/VerticalGradientView";

class ReplaceNonContentGamesModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      replaceLoading: false
    };
  }

  replaceGame = () => {
    const { selectedGame, gameNames } = this.props;
    const oldGameId = gameNames.find(
      gameName => gameName.value === selectedGame
    )._id;
    this.setState({ replaceLoading: true });
    this.deleteOldGamePosts(oldGameId);
    this.createNewPost(oldGameId);
  };

  createNewPost = oldGameId => {
    const {
      postObj,
      myData,
      addNewInfoPost,
      updatePostsOrder,
      deleteAllPostsOfGame,
      hideModal,
      closeQuestionPicker,
      setSelectedGame
    } = this.props;
    const newgameId = postObj.gameId;

    addQuestionPostbyUser(postObj, cbData => {
      const postsOrder = myData.posts.map(gameId => {
        return gameId === oldGameId ? newgameId : gameId;
      });
      addNewInfoPost(newgameId, cbData.data);

      updateProfile(
        { posts: postsOrder, hasEditedPosts: true },
        async cbData => {
          if (cbData.success) {
            this.props.updateOwnProfile({ hasEditedPosts: true });
            updatePostsOrder(oldGameId, newgameId);
            await deleteAllPostsOfGame(oldGameId);
            this.setState({
              replaceLoading: false
            });
            hideModal();
            closeQuestionPicker();
            setSelectedGame(newgameId);
          }
        }
      );
    });
  };

  deleteOldGamePosts = oldGameId => {
    const { posts } = this.props;
    posts[oldGameId].map(id => {
      deletePostMethod({ id }, res => {
        if (res.success) {
          console.log("Successfully deleted post");
        }
      });
    });
  };

  render() {
    const { hideModal } = this.props;
    const { replaceLoading } = this.state;

    return (
      <View style={styles.baseLayout}>
        <View style={styles.cardView}>
          <MediumText style={styles.descText}>
            Are you sure you want to replace this game with previous game?
          </MediumText>
          <VerticalGradientView
            style={styles.buttonStyle}
            colors={[PURPLE, LIGHT_PURPLE]}
          >
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={this.replaceGame}
            >
              {replaceLoading ? (
                <ActivityIndicator size={"small"} color={"#fff"} />
              ) : (
                <MediumText style={styles.buttonText}>Replace</MediumText>
              )}
            </TouchableOpacity>
          </VerticalGradientView>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => hideModal(false)}
          >
            <MediumText>Cancel</MediumText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonText: {
    color: "#fff",
    fontSize: 17
  },
  descText: {
    textAlign: "center",
    color: FONT_BLACK,
    fontSize: 18,
    padding: LEFT_MARGIN
  },
  baseLayout: {
    flex: 1,
    backgroundColor: "#0000",
    ...sharedStyles.justifiedCenter
  },
  cardView: {
    width: DeviceWidth * 0.8,
    paddingVertical: LEFT_MARGIN,
    backgroundColor: "#fff",
    ...sharedStyles.justifiedCenter,
    borderRadius: 20
  },
  buttonStyle: {
    height: 40,
    width: DeviceWidth * 0.5,
    borderRadius: 30,
    ...sharedStyles.justifiedCenter,
    alignSelf: "center"
  }
});

const mapState = state => {
  return {
    myData: state.info.userInfo || {},
    posts: state.info.posts,
    gameNames: state.questions.gameNames
  };
};

const mapDispatch = dispatch => {
  return {
    addNewInfoPost: bindActionCreators(addNewPostIntoGame, dispatch),
    deleteAllPostsOfGame: bindActionCreators(deleteOneGamePosts, dispatch),
    updatePostsOrder: bindActionCreators(setPostsOrder, dispatch)
  };
};
export default connect(mapState, mapDispatch)(ReplaceNonContentGamesModal);
