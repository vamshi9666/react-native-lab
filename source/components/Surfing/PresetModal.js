import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import NoFeedbackTapView from "../Views/NoFeedbackTapView";
import BoldText from "../Texts/BoldText";
import {
  FONT_BLACK,
  FONT_GREY,
  PURPLE,
  LIGHT_PURPLE
} from "../../config/Colors";
import Modal from "react-native-modal";
import { connect } from "react-redux";
import { LEFT_MARGIN } from "../../config/Constants";
import Ionicon from "react-native-vector-icons/Ionicons";
import RegularText from "../Texts/RegularText";
import RowView from "../Views/RowView";
import CircularImage from "../Views/CircularImage";
import HorizontalGradientView from "../Views/HorizontalGradientView";
import Lightbox from "react-native-lightbox";
import { DeviceWidth, DeviceHeight } from "../../../src/config/Device";
import GameContainer from "../Common/Game.container";
import MediumText from "../Texts/MediumText";
import Response from "../Profile.Modal/Response";
import TouchableScale from "react-native-touchable-scale";
import { userNamify } from "../../config/Utils";
import { STATIC_URL } from "../../config/Api";

class PresetModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showResponseModal: false
    };
    this.cards = [0, 1, 2].map(() => React.createRef());
  }

  changeSelectedGame = selectedGameIndex => {
    let { myPosts } = this.props;

    this.setState({
      selectedGame: Object.keys(myPosts)[selectedGameIndex],
      selectedGameIndex
    });
  };

  onClose = () => {
    this.setState({ selectedGame: null });
  };

  renderResponseModal = () => {
    const { selectedGame, selectedGameIndex, position } = this.state;
    const { myData, myPosts } = this.props;

    if (selectedGame) {
      return (
        <Response
          position={position}
          onClose={this.onClose}
          fromChatWindow={false}
          showTutorial={false}
          fromMyProfile={false}
          selectedGame={selectedGame}
          selectedGameIndex={selectedGameIndex}
          games={myPosts}
          targetUser={myData}
          userName={userNamify(myData)}
          fromPresetModal={true}
          userImage={
            myData &&
            myData.images &&
            myData.images.length > 0 &&
            myData.images[0]
          }
        />
      );
    } else {
      return <View />;
    }
  };

  _renderGameCards = (item, index) => {
    const { myPosts, myData } = this.props;
    const thisGameQuestions = myPosts[item] || [];
    if (thisGameQuestions.length === 0) {
      return null;
    }
    const { colors, key, value } = thisGameQuestions[0].questionId.gameId;
    const { selectedGame, selectedGameIndex } = this.state;
    return (
      <TouchableScale
        activeScale={0.96}
        defaultScale={1}
        tension={300}
        friction={10}
        key={index}
        onPress={async () => {
          const position = await this.cards[index].current.measure();
          this.setState({
            position,
            selectedGame: item,
            selectedGameIndex: index
          });
        }}
      >
        <View
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
          <GameContainer
            ref={this.cards[index]}
            height={DeviceWidth * 0.5 * 0.75}
            width={DeviceWidth * 0.37 * 0.75}
            colors={colors}
            gameName={key}
            fromPresetModal={true}
            gameValue={value}
          />
        </View>
      </TouchableScale>
    );
  };

  render() {
    const {
      dismissModal,
      myPosts,
      myData: { images }
    } = this.props;
    return (
      <View style={styles.baseLayout}>
        {this.renderResponseModal()}
        <View style={styles.cardView}>
          <BoldText style={styles.helloText}>Hello!</BoldText>
          <RegularText style={styles.darkText}>
            We’ve already picked few profile cards for you.
          </RegularText>
          <RegularText style={styles.darkText}>
            You can edit them now.
          </RegularText>
          <RowView style={styles.imageView}>
            <CircularImage
              height={30}
              source={{ uri: STATIC_URL + images[0].split("uploads")[1] }}
            />
            <RegularText style={styles.textStyle}>
              Your profile cards
            </RegularText>
          </RowView>
          <RowView
            style={{
              height: DeviceWidth * 0.45,
              width: "100%",
              alignItems: "center",
              marginBottom: -LEFT_MARGIN,
              // marginLeft: LEFT_MARGIN,
              justifyContent: "center"
            }}
          >
            {Object.keys(myPosts).map(this._renderGameCards)}
          </RowView>
          <RegularText style={styles.textStyle}>
            {"\n"}Other people view these on your profile.
          </RegularText>
          <HorizontalGradientView
            colors={[PURPLE, LIGHT_PURPLE]}
            style={styles.gradientView}
          >
            <NoFeedbackTapView
              onPress={() => dismissModal(true)}
              style={{
                height: 45,
                width: "80%",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <RegularText style={styles.buttonText}>Edit now</RegularText>
            </NoFeedbackTapView>
          </HorizontalGradientView>
          <NoFeedbackTapView
            style={{
              height: "10%",
              width: "40%",
              alignItems: "center",
              justifyContent: "center"
            }}
            onPress={dismissModal}
          >
            <RegularText style={styles.textStyle}>Later</RegularText>
          </NoFeedbackTapView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 16,
    color: "#fff"
  },
  gradientView: {
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    borderRadius: 30,
    alignSelf: "center",
    marginTop: LEFT_MARGIN
  },
  darkText: {
    fontSize: 16,
    color: "rgb(30, 36, 50)",
    marginVertical: 2.5
  },
  imageView: {
    marginVertical: LEFT_MARGIN,
    alignItems: "center",
    width: "50%",
    justifyContent: "space-evenly",
    alignSelf: "center"
  },
  cardView: {
    width: "100%",
    height: "72%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center"
  },
  baseLayout: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end"
  },
  textStyle: {
    fontSize: 16,
    color: FONT_GREY
  },
  helloText: {
    fontSize: 30,
    color: FONT_BLACK,
    textAlign: "center",
    marginVertical: LEFT_MARGIN
  }
});

const mapState = state => {
  return {
    myPosts: state.info.posts,
    myData: state.info.userInfo || {}
  };
};

const mapDispatch = dispatch => {
  return {};
};
export default connect(mapState, mapDispatch)(PresetModal);
