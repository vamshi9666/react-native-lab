import React, { Component } from "react";

import { Modal, View, StyleSheet, TouchableOpacity } from "react-native";
import MediumText from "../Texts/MediumText";
import { DeviceHeight, DeviceWidth } from "../../config/Device";
import RegularText from "../Texts/RegularText";
import { connect } from "react-redux";
import * as QuestionsApi from "../../network/question";
import _sortBy from "lodash/sortBy";
import { WHITE, BLUE_PRIMARY, FONT_GREY } from "../../config/Colors";
import {
  sendQuestionToFav,
  removeOneFavourite,
  adddNewFavOverriding
} from "../../redux/actions/questions";
import {
  deletePost,
  addPost,
  removeFav,
  makeOneQuestionFav
} from "../../redux/actions/content";
import { bindActionCreators } from "redux";
import { removePostInGame, setPosts } from "../../redux/actions/user.info";
class FavLimitOverrideModal extends Component {
  constructor(props) {
    super(props);
  }
  addNewFavOverRiding = question => {
    const { closeModal } = this.props;
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
          QuestionsApi.addFavourites(
            { questionId: question._id, category: question.category },
            cbData => {
              if (cbData.success) {
                this.props.addNewFav(
                  question._id,
                  question.gameId._id,
                  cbData.data._id,
                  cbData.data.createdAt
                );
                closeModal();
              } else {
                alert(" error in addding new favourite");
              }
            }
          );
        }
      }
    );
  };
  render() {
    const { question } = this.props;
    return (
      <View style={styles.modalContent}>
        <View style={styles.modalHead}>
          <RegularText style={styles.modalContentText}>
            Your favourites section is already full, {"\n"}
            Do you want to replace oldest ones with new ones ?
          </RegularText>
        </View>
        <View style={styles.btnCon}>
          <TouchableOpacity
            onPress={() => {
              console.log(" question is ", this.props);

              this.addNewFavOverRiding(question);
            }}
            activeOpacity={0.6}
            style={[
              styles.btn,
              {
                backgroundColor: BLUE_PRIMARY,
                marginBottom: 16
              }
            ]}
          >
            <RegularText style={{ ...styles.btnText, color: "#fff" }}>
              Okay
            </RegularText>
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
  modalContentText: {
    fontSize: 16,
    textAlign: "center",
    marginHorizontal: 24,
    lineHeight: 20
  },
  modalContent: {
    // marginHorizontal: 100,
    // marginVertical: 200,
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 10,
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: DeviceHeight * 0.3,
    paddingVertical: 12
    // borderColor: BLUE_PRIMARY,
    // borderWidth: 0.5
    // paddingHorizontal: 24
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
    marginVertical: 16

    // width: DeviceWidth - 100,
  },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    width: DeviceWidth * 0.6
  },
  btnText: {
    // color:
    fontSize: 16
  }
});

const mapState = state => {
  return {
    myData: state.info.userInfo || {},
    posts: state.info.posts,
    adminProps: state.app.adminProps,
    allFavourites: state.questions.favourites,
    contentQuestions: state.content.questions
  };
};

const mapDispatch = dispatch => {
  return {
    setSingleFavouriteQuestion: bindActionCreators(sendQuestionToFav, dispatch),
    removeOneFavourite: bindActionCreators(removeOneFavourite, dispatch),
    adddNewFavOverriding: bindActionCreators(adddNewFavOverriding, dispatch),
    setPosts: bindActionCreators(setPosts, dispatch),
    //
    addNewFav: bindActionCreators(makeOneQuestionFav, dispatch),
    removeFromFavourites: bindActionCreators(removeFav, dispatch),
    addNewPost: bindActionCreators(addPost, dispatch),
    removeFromPosts: bindActionCreators(deletePost, dispatch),
    removeInfoPostInGame: bindActionCreators(removePostInGame, dispatch)
  };
};
export default connect(mapState, mapDispatch)(FavLimitOverrideModal);
