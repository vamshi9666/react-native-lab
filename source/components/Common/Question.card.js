import * as _ from "lodash";
import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity
} from "react-native";
import Ionicon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { greyTheme } from "../../config/Colors";
import { DeviceWidth } from "../../config/Device";
import * as QuestionActions from "../../redux/actions/Question.action";

import { appConstants } from "../../config/Constants";

class QuestionCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAnswer: false,
      answer: false,
      answeredQuestion: null
    };
  }

  render() {
    const {
      posts,
      gameName = "",
      openQuestionCards,
      disabled,
      fromChatWindow,
      showEdit,
      toggleModal
    } = this.props;
    const gameHeader = gameName.split("_").join(" ");
    const bgColor =
      gameHeader === "GUESS MY TRAITS"
        ? "#e85a77"
        : gameHeader === "BLUFF OR TRUTH"
        ? "#a07df3"
        : gameHeader === "SIMILARITIES"
        ? "#918393"
        : gameHeader === "WOULD YOU RATHER"
        ? "#5c87bc"
        : "#1fab89";
    return (
      <View
        style={{
          alignItems: "center"
        }}
      >
        <TouchableOpacity
          disabled={disabled}
          onPress={() => openQuestionCards(posts)}
          style={[
            styles.slide,
            {
              width: fromChatWindow ? DeviceWidth * 0.3 : DeviceWidth * 0.45,
              height: fromChatWindow ? 130 : 180,
              backgroundColor: bgColor
            }
          ]}
        >
          <Ionicon name={"ios-cloud-circle"} size={40} color={"#fff"} />
          <Text
            style={[
              styles.cardHeader,
              {
                fontSize: fromChatWindow ? 15 : 20
              }
            ]}
          >
            {gameHeader}
          </Text>
        </TouchableOpacity>
        {showEdit ? (
          <TouchableWithoutFeedback
            style={styles.editView}
            onPress={() => toggleModal()}
          >
            <Ionicon name={"md-create"} color={greyTheme} size={25} />
          </TouchableWithoutFeedback>
        ) : (
          <View />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  editIcon: {
    textAlign: "center",
    alignSelf: "center"
  },
  editView: {
    height: 40,
    width: 40,
    borderRadius: 25,
    backgroundColor: "#fff",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: greyTheme,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    elevation: 2,
    transform: [{ translateY: 0 }, { translateX: 5 }]
  },
  editText: {
    fontSize: 20,
    color: greyTheme,
    fontWeight: "bold",
    paddingHorizontal: 10
  },
  cardHeader: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    marginTop: 5
  },
  slide: {
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    shadowColor: greyTheme,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5
  }
});

const mapStateToProps = state => {
  return {
    sendResponseResult: state.questions.postResponseData,
    postsByUser: state.user.getPostsData,
    userData: state.user.myData
  };
};

const mapDispatchToProps = dispatch => {
  return {
    sendResponse: bindActionCreators(QuestionActions.postResponse, dispatch),
    getMyResponses: bindActionCreators(QuestionActions.getMyResponses, dispatch)
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuestionCard);
