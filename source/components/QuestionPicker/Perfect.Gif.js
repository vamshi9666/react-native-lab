import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Image
} from "react-native";
import { DeviceWidth, DeviceHeight } from "../../config/Device";
import { BlurView } from "@react-native-community/blur";

import { sharedStyles } from "../../styles/Shared";
import Ionicon from "react-native-vector-icons/Ionicons";
import { FONT_GREY, FONT_BLACK } from "../../config/Colors";
import RegularText from "../Texts/RegularText";
import { LEFT_MARGIN } from "../../config/Constants";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import MediumText from "../Texts/MediumText";
import { shareContent } from "../../redux/actions/nav";

const PLACE_HOLDER_GIF_HEIGHT = DeviceHeight * 0.5;
const PLACE_HOLDER_GIF_WIDTH = DeviceWidth * 0.8;

class ThePerfectGif extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameId: "",
      gameObj: {}
    };
  }

  componentDidMount = () => {
    // const { gameNames, posts } = this.props;
    // if (gameNames && gameNames.length > 0) {
    //   const gameObj = gameNames.find(
    //     gameName => gameName.value === "THE_PERFECT_GIF"
    //   );
    //   this.setState({ gameId: gameObj._id, gameObj });
    // }
  };

  toggleGiphyPicker = () => {
    if (this.giphyPickerRef) {
      this.giphyPickerRef.snapTo(1);
    }
  };

  renderSelectedGif = selectedGif => {
    const h = parseInt(selectedGif.height);
    const w = parseInt(selectedGif.width);
    const { toggleGifPicker } = this.props;

    return (
      <View
        style={{
          justifyContent: "center"
        }}
      >
        <View
          style={{
            aspectRatio: w / h,
            width: DeviceWidth * 0.8,
            alignSelf: "center",
            backgroundColor: "#00000010",
            borderRadius: 10
          }}
        >
          <Image
            source={{ uri: selectedGif.originalUrl }}
            style={{
              aspectRatio: w / h,
              width: DeviceWidth * 0.8,
              alignSelf: "center",
              backgroundColor: "#00000010",
              borderRadius: 10
            }}
          />
        </View>
        <TouchableOpacity onPress={toggleGifPicker} style={styles.editIconView}>
          <Ionicon name={"md-create"} color={FONT_BLACK} size={28} />
        </TouchableOpacity>
      </View>
    );
  };

  shouldComponentUpdate = () => {
    return false;
  };

  handleShare = selectedGif => {
    const { gameObj } = this.state;
    const { shareContent, currentScreenIndex } = this.props;

    let shareObj;
    if (currentScreenIndex < 3) {
      shareObj = {
        options: [],
        gameId: gameObj,
        question: selectedGif,
        openIn: "MyProfile"
      };
    } else {
      shareObj = {
        options: [],
        gameId: gameObj,
        question: selectedGif,
        openIn: "ChatWindow"
      };
    }
    shareContent(shareObj);

    setTimeout(() => {
      shareContent(undefined);
    }, 200);
  };

  renderPlaceHolderGif = () => {
    const { toggleGifPicker } = this.props;

    return (
      <ImageBackground
        style={styles.placeHolderGIF}
        source={require("../../assets/gifs/giphy.gif")}
      >
        <BlurView style={styles.blurViewStyle} blurType="dark" blurAmount={5} />

        <TouchableOpacity style={styles.addIconView} onPress={toggleGifPicker}>
          <Ionicon name={"md-add"} size={30} color={FONT_GREY} />
        </TouchableOpacity>
      </ImageBackground>
    );
  };

  render() {
    const { posts } = this.props;
    const { gameId } = this.state;
    const selectedGif =
      posts &&
      posts[gameId] &&
      posts[gameId].length > 0 &&
      posts[gameId][0].questionId &&
      JSON.parse(posts[gameId][0].questionId.question);
    return (
      <View style={{ flex: 1 }}>
        <RegularText style={styles.topDescText}>
          {selectedGif
            ? "GIF that describes your current situation"
            : "Add a perfect GIF Which describes your current situation"}
        </RegularText>
        {selectedGif ? (
          <View style={styles.liveGifContainer}>
            {this.renderSelectedGif(selectedGif)}

            <TouchableOpacity
              onPress={() => this.handleShare(selectedGif)}
              style={{
                backgroundColor: "#fff",
                bottom: DeviceHeight * 0.1,
                position: "absolute",
                height: 30,
                alignSelf: "center",
                width: 30,
                borderRadius: 15,
                shadowColor: `#000`,
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.2,
                ...sharedStyles.justifiedCenter
              }}
            >
              <Ionicon name={"ios-share-alt"} color={FONT_BLACK} size={25} />
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            {this.renderPlaceHolderGif()}
            <View style={styles.bottomTutorialView}>
              <RegularText style={styles.bottomTutorialText}>
                Let people react to this throught their GIF'S
              </RegularText>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  addIconView: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    zIndex: 2,
    ...sharedStyles.justifiedCenter
  },
  blurViewStyle: {
    position: "absolute",
    width: PLACE_HOLDER_GIF_WIDTH,
    height: PLACE_HOLDER_GIF_HEIGHT,
    alignSelf: "center",
    borderRadius: 10,
    zIndex: 1
  },
  placeHolderGIF: {
    width: PLACE_HOLDER_GIF_WIDTH,
    height: PLACE_HOLDER_GIF_HEIGHT,
    borderRadius: 10,
    alignSelf: "center",
    overflow: "hidden",
    ...sharedStyles.justifiedCenter
  },
  liveGifContainer: {
    width: DeviceWidth * 0.8,
    height: DeviceHeight * 0.8,
    alignSelf: "center",
    justifyContent: "space-between"
  },
  topDescText: {
    color: "#fff",
    fontSize: 18,
    margin: LEFT_MARGIN,
    marginTop: 0
  },
  bottomTutorialView: {
    ...sharedStyles.justifiedCenter,
    height: 40,
    width: DeviceWidth,
    backgroundColor: "rgb(48,32,57)",
    marginTop: LEFT_MARGIN
  },
  bottomTutorialText: {
    color: "#fff",
    fontSize: 14
  },
  editIconView: {
    ...sharedStyles.justifiedCenter,
    backgroundColor: "#fff",
    height: 40,
    width: 40,
    bottom: 20,
    borderRadius: 20,
    shadowColor: `#000`,
    shadowOffset: { width: 1, height: 5 },
    shadowOpacity: 0.2,
    alignSelf: "flex-end"
  }
});

const mapState = state => {
  return {
    selectedGif: state.nav.selectedGif,
    posts: state.info.posts,
    gameNames: state.questions.gameNames,
    currentScreenIndex: state.nav.currentScreenIndex
  };
};

const mapDispatch = dispatch => {
  return {
    shareContent: bindActionCreators(shareContent, dispatch)
  };
};
export default connect(mapState, mapDispatch)(ThePerfectGif);
