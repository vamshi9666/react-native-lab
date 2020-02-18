import React, { Component } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { DeviceWidth } from "../../config/Device";
import GameContainer from "../Common/Game.container";
import CircularImage from "../Views/CircularImage";
import Response from "../Profile.Modal/Response";
import Modal from "react-native-modal";
import { FONT_GREY } from "../../config/Colors";
import { msgTypes, appConstants, LEFT_MARGIN } from "../../config/Constants";
import { addResponseFromChat } from "../../network/question";
import * as RoomActions from "../../redux/actions/rooms";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import RegularText from "../Texts/RegularText";
import { releaseAStackItem } from "../../network/rooms";
import TouchableScale from "react-native-touchable-scale";
import { userNamify } from "../../config/Utils";

class QCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeGame: "",
      openGameScreen: false,
      showResponseModal: false
    };
    this.cards = [0, 1, 2].map(() => React.createRef());
  }

  storeResponses = (game, questionIndex, option, postId) => {
    let { myData, targetUser, currentMessage } = this.props;

    let responseDbObject = {
      msgId: currentMessage.msgId,
      postedBy: targetUser._id,
      answeredBy: myData._id,
      response: `${option}`,
      postId: postId,
      location: appConstants.POST_TO_CHAT_PROFILE
    };

    addResponseFromChat(responseDbObject, addedResponse => {
      if (addedResponse.success) {
        const { editMessage, selectedRoomId, allRooms, myData } = this.props;
        const editMsgObj = {
          messageId: currentMessage.objId,
          roomId: selectedRoomId,
          message: JSON.stringify([addedResponse.data]),
          type: msgTypes.MESSAGE_CHAT_CARD
        };
        console.log("editMessage obj is: ", editMsgObj);
        editMessage(editMsgObj);

        if (allRooms[selectedRoomId].postedBy._id === myData._id) {
          releaseAStackItem(
            selectedRoomId,
            {
              answeredByPickersEnabled: true
            },
            () => {}
          );
        } else {
          releaseAStackItem(
            selectedRoomId,
            {
              postedByPickersEnabled: true
            },
            () => {}
          );
        }
      }
    });
  };
  closeLightBoxModal = () => {
    this.setState({ showResponseModal: false });
  };

  renderResponseModal = () => {
    const { selectedGame, selectedGameIndex } = this.state;

    let {
      myData,
      targetUser,
      myCardsCount,
      othersCardsCount,
      currentMessage
    } = this.props;
    let cardObject = JSON.parse(currentMessage.text);
    let questions = cardObject[0].response
      ? this.processResponses(cardObject)
      : this.processPosts(cardObject);

    const _myCard = cardObject[0].postedBy === myData._id;
    const _isLessCountForOthers =
      othersCardsCount[selectedGame] === undefined ||
      othersCardsCount[selectedGame] < 3;

    const _isLessCountForMe =
      myCardsCount[selectedGame] === undefined ||
      myCardsCount[selectedGame] < 1;
    const showTutorial = _myCard ? _isLessCountForMe : _isLessCountForOthers;

    return (
      <Modal
        isVisible={this.state.showResponseModal}
        onSwipeComplete={this.closeLightBoxModal}
        swipeDirection={"down"}
        propagateSwipe
        style={{
          margin: 0
        }}
      >
        <Response
          fromChatWindow={false}
          showTutorial={showTutorial}
          selectedGame={selectedGame}
          closeLightBoxModal={this.closeLightBoxModal}
          selectedGameIndex={selectedGameIndex}
          games={questions}
          storeResponses={this.storeResponses}
          targetUser={targetUser}
          userName={userNamify(targetUser)}
          userImage={
            targetUser &&
            targetUser.images &&
            targetUser.images.length > 0 &&
            targetUser.images[0]
          }
        />
      </Modal>
    );
  };

  renderCards = ({ item, index }) => {
    let { myData, showImage, currentMessage, openResponseScreen,setCurrentMessage } = this.props;
    let cardObject = JSON.parse(currentMessage.text);
    let questions = cardObject[0].response
      ? this.processResponses(cardObject)
      : this.processPosts(cardObject);
    const isResponded = cardObject[0].response ? true : false;

    let self = myData._id === currentMessage.user._id;
    const timestamp = new Date(
      currentMessage.createdAt * 1000
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

    const _myCard = cardObject[0].postedBy === myData._id;
    const { key, value } = questions[item][0].questionId.gameId;
    return (
      <TouchableScale
        activeScale={0.96}
        defaultScale={1}
        tension={300}
        friction={10}
        key={index}
        onPress={async () => {
          const position = await this.cards[index].current.measure();
          openResponseScreen(item, position, index, questions);
          setCurrentMessage(currentMessage)
          // this.setState({
          //   showResponseModal: true,
          //   selectedGame: item,
          //   selectedGameIndex: index,
          //   position
          // });
        }}
        style={{
          shadowRadius: 5,
          shadowColor: "#000000f1",
          shadowOffset: {
            width: 0,
            height: 5
          },
          shadowOpacity: 0.1
        }}
      >
        <View
          style={{
            shadowColor: "#000",
            shadowOffset: {
              width: 1,
              height: 2
            },
            shadowOpacity: 0.1,
            flexDirection: "row"
          }}
        >
          <GameContainer
            ref={this.cards[index]}
            height={DeviceWidth * 0.5 * 0.75}
            width={DeviceWidth * 0.37 * 0.75}
            colors={questions[item][0].questionId.gameId.colors}
            gameName={key}
            gameValue={value}
          />
          {/* <Ionicon name={"ios-cloud-circle"} size={40} color={"#fff"} />
            <Text
              style={{
                fontSize: 15,
                color: "#fff",
                fontWeight: "bold",
                textAlign: "center"
              }}
            >
              {questions[item][0].questionId.gameId.value.split("_").join(" ")}
            </Text>
          </GameContainer> */}
          {isResponded && _myCard && showImage ? (
            <CircularImage
              height={18}
              source={require("../../assets/images/riya.png")}
              style={{
                marginLeft: -1,
                marginTop: 115
              }}
            />
          ) : (
            <View />
          )}
        </View>
        <RegularText
          style={{
            color: FONT_GREY,
            fontSize: 11,
            alignSelf: self ? "flex-start" : "flex-end",
            paddingHorizontal: LEFT_MARGIN / 2
          }}
        >
          {timestamp}
        </RegularText>
      </TouchableScale>
    );
  };

  processResponses = cardObject => {
    let questions = [];
    let { targetUser, myData } = this.props;
    cardObject.map(obj => {
      questions.push({
        ...obj.postId,
        question: obj.postId.questionId,
        postedBy: obj.postId.postedBy === myData._id ? myData : targetUser,
        answeredBy: obj.postId.answeredBy === myData._id ? myData : targetUser,
        response: obj.response
      });
    });

    let finalQuestions = {};
    questions.forEach(question => {
      const questionName = question.questionId.gameId._id;
      if (finalQuestions[questionName]) {
        finalQuestions[questionName].push(question);
      } else {
        finalQuestions[questionName] = [];
        finalQuestions[questionName].push(question);
      }
    });
    return finalQuestions;
  };

  processPosts = cardObject => {
    let questions = [];
    let { targetUser, myData } = this.props;
    cardObject.map(obj => {
      questions.push({
        ...obj,
        postId: obj,
        postedBy: obj.postedBy === myData._id ? myData : targetUser,
        answeredBy: obj.postedBy !== myData._id ? myData : targetUser,
        question: obj.questionId
      });
    });
    let finalQuestions = {};
    questions.forEach(question => {
      const questionName = question.questionId.gameId._id;
      if (finalQuestions[questionName]) {
        finalQuestions[questionName].push(question);
      } else {
        finalQuestions[questionName] = [];
        finalQuestions[questionName].push(question);
      }
    });
    return finalQuestions;
  };

  render() {
    const { myData, currentMessage } = this.props;
    let self = myData._id === currentMessage.user._id;
    let cardObject = JSON.parse(currentMessage.text);
    let questions = {};
    if (cardObject.length > 0) {
      questions = cardObject[0].response
        ? this.processResponses(cardObject)
        : this.processPosts(cardObject);
      console.log("cardObject isssss: ", cardObject[0]);

      return (
        <View
          style={{
            height: 160,
            marginLeft: !self ? 8 : 0,
            alignSelf: !self ? "flex-start" : "flex-end",
            width:
              Object.keys(questions).length > 2
                ? DeviceWidth * 0.9
                : Object.keys(questions).length > 1
                ? DeviceWidth * 0.65
                : DeviceWidth * 0.35
          }}
        >
          {/* {this.renderResponseScreen()} */}
          <FlatList
            keyExtractor={item => item}
            numColumns={3}
            data={Object.keys(questions)}
            renderItem={(item, index) => this.renderCards(item, index, self)}
          />
        </View>
      );
    } else {
      return <Text>Error while processing profile Card</Text>;
    }
  }
}

const mapStateToProps = state => {
  return {
    selectedRoomId: state.rooms.selected_room_id,
    myCardsCount: state.tutorial.myCards,
    othersCardsCount: state.tutorial.othersCards
  };
};
const mapDispatchToProps = dispatch => {
  return {
    editMessage: bindActionCreators(RoomActions.editMessage, dispatch)
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(QCard);
