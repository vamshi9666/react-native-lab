import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView
} from "react-native";
import { sharedStyles } from "../../styles/Shared";
import { connect } from "react-redux";
import RowView from "../Views/RowView";
import ViewShot, { captureRef } from "react-native-view-shot";
import { DeviceWidth, DeviceHeight } from "../../../src/config/Device";
import Ionicon from "react-native-vector-icons/Ionicons";
import { LEFT_MARGIN, GAME_LOGOS_COLORFUL } from "../../config/Constants";
import MediumText from "../Texts/MediumText";
import { FONT_BLACK } from "../../../src/config/Colors";
import BoldText from "../Texts/BoldText";
import VerticalGradientView from "../Views/VerticalGradientView";
import RegularText from "../Texts/RegularText";
import Share from "react-native-share";
import SvgUri from "react-native-svg-uri";
import { namify } from "../../config/Utils";
import { STATIC_URL } from "../../config/Api";
import CircularImage from "../Views/CircularImage";
import BackgroundIcon from "../QuestionPicker/BackgroundIcons";
import { BACKGROUND_ICONS } from "../../config/files";
import { FONT_GREY } from "../../config/Colors";
import Lodash from "lodash";
import { View as AnimatableView } from "react-native-animatable";
import { TapGestureHandler, State } from "react-native-gesture-handler";
import DoubletapEditor from "../QuestionPicker/Doubletap.editor";
import SimpleToast from "react-native-simple-toast";

class SharePreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      currentlyEditingItem: 0
    };
  }

  componentDidMount = () => {
    const { question, options } = this.props.content;

    if (options.length > 1) {
      this.setState({
        questionText: question,
        originalText: question,
        optionA: options[0],
        optionB: options[1],
        optionC: options[2] ? options[2] : "",
        optionD: options[3] ? options[3] : "",
        originalOptionA: options[0],
        originalOptionB: options[1],
        originalOptionC: options[2] ? options[2] : "",
        originalOptionD: options[3] ? options[3] : ""
      });
    } else {
      this.setState({
        questionText: question,
        originalText: question
      });
    }
  };

  closeModal = () => {
    const { closeModal } = this.props;
    closeModal();
  };

  handleError = err => {
    console.log(" error in sharing >>>>", err);
    alert(" error occured in sharing . \n please try again");
  };

  handleShare = async url => {
    console.log(" url for screenshot is &&&", url);
    let shareOptions;
    if (Platform.OS === "android") {
      shareOptions = {
        title: "Share file",
        url,
        failOnCancel: false,
        message: `Here we will get the text content and store links https://google.com`
      };
    } else {
      shareOptions = {
        title: "Share file",
        url,
        failOnCancel: false
      };
    }

    try {
      const ShareResponse = await Share.open(shareOptions);
      this.setState({
        shareResult: JSON.stringify(ShareResponse)
      });
    } catch (error) {
      console.log("Error =>", error);
    }
  };

  captureScreen = () => {
    captureRef(this.refs.question, { result: "data-uri", quality: 0.6 }).then(
      url => {
        this.handleShare(url);
        // this.props.onCapture(url);
      },
      err => {
        this.handleError(err);
      }
    );
  };
  renderSelectedGif = receivedGif => {
    if (Lodash.isEmpty(receivedGif)) {
      return null;
    }

    const selectedGif =
      typeof receivedGif === "string" ? JSON.parse(receivedGif) : receivedGif;

    const h = parseInt(selectedGif.height);
    const w = parseInt(selectedGif.width);

    const isWider = w > DeviceWidth * 0.7;
    const isLonger = h > DeviceHeight * 0.4;

    return (
      <View
        style={{
          height: isWider || isLonger ? h / 2 : h,
          width: isWider || isLonger ? w / 2 : w,
          alignSelf: "center",
          backgroundColor: "#00000010",
          borderRadius: 10
        }}
      >
        <Image
          source={{ uri: selectedGif.originalUrl }}
          style={{
            height: isWider || isLonger ? h / 2 : h,
            width: isWider || isLonger ? w / 2 : w,
            alignSelf: "center",
            backgroundColor: "#00000010",
            borderRadius: 10
          }}
        />
      </View>
    );
  };

  _onSingleTap = index => {
    const { optionC, optionD } = this.state;
    if ((index === 2 && optionC === "") || (index === 3 && optionD === "")) {
      this._onDoubleTap(index);
    }
  };

  _onDoubleTap = index => {
    const {
      content: { gameId }
    } = this.props;
    if (index === 4) {
      this.setState({ currentlyEditingItem: index, editMode: true });
    } else {
      if (
        gameId.value !== "NEVER_HAVE_I_EVER" &&
        gameId.value !== "BLUFF_OR_TRUTH"
      ) {
        this.setState({ currentlyEditingItem: index, editMode: true });
      } else {
        if (index === 0) {
          this.refs.optionOneRef.shake(200);
        } else {
          this.refs.optionTwoRef.shake(200);
        }
        SimpleToast.show(`Cannot edit options for this game`);
      }
    }
  };

  onSubmitEditingHandler = () => {
    this.setState({ editMode: false });
    Keyboard.dismiss();
  };

  renderQuestionBody = (question, options, gameId, showDesc) => {
    let questionText =
      question === "TWO_TRUTHS_AND_A_LIE" ? "Spot the lie" : question;
    const {
      optionA,
      optionB,
      optionC,
      optionD,
      editMode,
      currentlyEditingItem
    } = this.state;

    return (
      <View
        style={{
          alignSelf: "center"
        }}
      >
        {gameId.value === "THE_PERFECT_GIF" ? (
          this.renderSelectedGif(question)
        ) : (
          <>
            <View style={styles.gameLogoView}>
              <SvgUri
                height={40}
                width={40}
                source={GAME_LOGOS_COLORFUL[gameId.value]}
              />
            </View>
            <View style={styles.questionLayout}>
              {question === "SIMILARITIES" ||
              question === "WOULD YOU RATHER" ? (
                <View style={{ height: 35 }} />
              ) : (
                <DoubletapEditor
                  onSingleTap={this._onSingleTap}
                  onDoubleTap={this._onDoubleTap}
                  onChangeText={questionText => this.setState({ questionText })}
                  editMode={editMode}
                  index={4}
                  currentlyEditingItem={currentlyEditingItem}
                  text={questionText}
                  onSubmitEditingHandler={this.onSubmitEditingHandler}
                  isQuestion
                  fromSharePreview
                />
              )}

              {gameId.value === "VIBE" ||
              gameId.value === "CONFESSIONS" ||
              gameId.value === "THE_PERFECT_GIF" ? (
                <View />
              ) : (
                <>
                  <AnimatableView ref={"optionOneRef"}>
                    <DoubletapEditor
                      onSingleTap={this._onSingleTap}
                      onDoubleTap={this._onDoubleTap}
                      onChangeText={optionA => this.setState({ optionA })}
                      editMode={editMode}
                      index={0}
                      currentlyEditingItem={currentlyEditingItem}
                      text={optionA}
                      onSubmitEditingHandler={this.onSubmitEditingHandler}
                    />
                  </AnimatableView>

                  <AnimatableView ref={"optionTwoRef"}>
                    <DoubletapEditor
                      onSingleTap={this._onSingleTap}
                      onDoubleTap={this._onDoubleTap}
                      onChangeText={optionB => this.setState({ optionB })}
                      editMode={editMode}
                      index={1}
                      currentlyEditingItem={currentlyEditingItem}
                      text={optionB}
                      onSubmitEditingHandler={this.onSubmitEditingHandler}
                    />
                  </AnimatableView>

                  {optionB !== "" &&
                  gameId.value !== "NEVER_HAVE_I_EVER" &&
                  gameId.value !== "BLUFF_OR_TRUTH" ? (
                    <DoubletapEditor
                      isNewOption={optionC === ""}
                      onSingleTap={this._onSingleTap}
                      onDoubleTap={this._onDoubleTap}
                      onChangeText={optionC => this.setState({ optionC })}
                      editMode={editMode}
                      index={2}
                      currentlyEditingItem={currentlyEditingItem}
                      text={optionC}
                      onSubmitEditingHandler={this.onSubmitEditingHandler}
                    />
                  ) : (
                    <View />
                  )}

                  {optionC !== "" ? (
                    <DoubletapEditor
                      isNewOption={optionD === ""}
                      onSingleTap={this._onSingleTap}
                      onDoubleTap={this._onDoubleTap}
                      onChangeText={optionD => this.setState({ optionD })}
                      editMode={editMode}
                      index={3}
                      currentlyEditingItem={currentlyEditingItem}
                      text={optionD}
                      onSubmitEditingHandler={this.onSubmitEditingHandler}
                    />
                  ) : (
                    <View />
                  )}
                </>
              )}

              {showDesc ? (
                <RegularText style={{ color: FONT_GREY, textAlign: "center" }}>
                  Double tap on the text to edit
                </RegularText>
              ) : (
                <View />
              )}
            </View>
          </>
        )}
      </View>
    );
  };

  renderViewShot = () => {
    const {
      content: { gameId, options },
      myData
    } = this.props;
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
      originalOptionD
    } = this.state;

    const isOriginal =
      questionText === originalText &&
      optionA.trim() === originalOptionA &&
      optionB.trim() === originalOptionB &&
      optionC.trim() === originalOptionC &&
      optionD.trim() === originalOptionD;

    return (
      <ViewShot style={styles.ViewShotStyle} ref="question">
        <VerticalGradientView
          colors={gameId.colors}
          style={styles.cardViewShotStyle}
        >
          <RowView style={{ ...styles.logoView, marginTop: 10 }}>
            <Image
              style={styles.logoStyle}
              source={require("../../assets/images/Applogo.png")}
            />
            <BoldText style={styles.appName}>Closer</BoldText>
          </RowView>

          <MediumText style={styles.gameName}>{gameId.key}</MediumText>
          {this.renderQuestionBody(questionText, options, gameId)}

          <RegularText
            style={{
              color: "#fff",
              textAlign: "center",
              marginVertical: LEFT_MARGIN
            }}
          >
            {gameId.otherDescription}
          </RegularText>

          {isOriginal ? (
            <View />
          ) : (
            <View>
              <RegularText
                style={{
                  color: "#fff",
                  marginLeft: 10,
                  textAlign: "center"
                }}
              >
                Edited By
              </RegularText>
              <RowView
                style={{
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    height: 35,
                    width: 35,
                    borderRadius: 17.5,
                    backgroundColor: "#fff",
                    ...sharedStyles.justifiedCenter
                  }}
                >
                  <CircularImage
                    height={30}
                    source={{
                      uri: STATIC_URL + myData.images[0].split("uploads")[1]
                    }}
                  />
                </View>

                <MediumText
                  style={{
                    color: "#fff",
                    fontSize: 20,
                    marginLeft: 10
                  }}
                >
                  {namify(myData.name)}
                </MediumText>
              </RowView>
            </View>
          )}
          <BackgroundIcon bgIcon={BACKGROUND_ICONS[gameId.value]} />
        </VerticalGradientView>
      </ViewShot>
    );
  };

  render() {
    const {
      content: { gameId, options },
      myData
    } = this.props;

    const { questionText, editMode } = this.state;

    return (
      <View style={styles.baseLayout}>
        {this.renderViewShot()}
        <KeyboardAvoidingView behavior={"position"}>
          {/* <ScrollView
            style={{
              alignSelf: "flex-end"
            }}
            showsVerticalScrollIndicator={false}
          > */}
          <VerticalGradientView colors={gameId.colors} style={styles.cardView}>
            <RowView
              style={{
                justifyContent: "space-between",
                width: DeviceWidth * 0.9,
                alignSelf: "center"
              }}
            >
              <RowView
                style={{
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    height: 45,
                    width: 45,
                    borderRadius: 22.5,
                    backgroundColor: "#fff",
                    ...sharedStyles.justifiedCenter
                  }}
                >
                  <CircularImage
                    height={40}
                    source={{
                      uri: STATIC_URL + myData.images[0].split("uploads")[1]
                    }}
                  />
                </View>

                <MediumText
                  style={{
                    color: "#fff",
                    fontSize: 20,
                    marginLeft: 10
                  }}
                >
                  {namify(myData.name)}
                </MediumText>
              </RowView>

              <TouchableOpacity
                onPress={() => this.closeModal()}
                style={styles.closeIconView}
              >
                <Ionicon
                  name={"ios-close"}
                  size={35}
                  color={"rgb(112,112,112)"}
                />
              </TouchableOpacity>
            </RowView>
            <MediumText
              style={{
                fontSize: 24,
                color: "#fff",
                textAlign: "center"
              }}
            >
              Share it with your Friends!
            </MediumText>
            {/* <RowView style={styles.logoView}>
              <Image
                style={styles.logoStyle}
                source={require("../../assets/images/Applogo.png")}
              />
              <BoldText style={styles.appName}>Closer</BoldText>
            </RowView> */}
            <MediumText style={styles.gameName}>{gameId.key}</MediumText>
            {this.renderQuestionBody(questionText, options, gameId, true)}
            <MediumText
              style={{
                color: "#fff",
                textAlign: "center",
                marginVertical: LEFT_MARGIN,
                fontSize: 17
              }}
            >
              {gameId.shareDescription}
            </MediumText>
            {editMode ? (
              <View />
            ) : (
              <TouchableOpacity
                style={styles.shareButtonView}
                onPress={this.captureScreen}
              >
                <RegularText style={{ fontSize: 18 }}>Share</RegularText>
              </TouchableOpacity>
            )}

            <BackgroundIcon bgIcon={BACKGROUND_ICONS[gameId.value]} />
          </VerticalGradientView>
          {/* </ScrollView> */}
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bgIconsView: {
    position: "absolute",
    opacity: 0.2,
    zIndex: -1
  },
  cardViewShotStyle: {
    backgroundColor: "#fff",
    borderRadius: 0,
    marginVertical: 0,
    width: DeviceWidth,
    height: DeviceHeight,
    ...sharedStyles.justifiedCenter
  },
  ViewShotStyle: {
    position: "absolute",
    transform: [
      {
        translateY: DeviceHeight
      }
    ],
    height: DeviceHeight,
    width: DeviceWidth,
    ...sharedStyles.justifiedCenter,
    zIndex: 9999999999,
    backgroundColor: "#fff"
  },
  shareButtonView: {
    ...sharedStyles.justifiedCenter,
    height: 40,
    width: DeviceWidth * 0.3,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignSelf: "center",
    marginBottom: LEFT_MARGIN
  },
  questionLayout: {
    width: DeviceWidth * 0.8,
    backgroundColor: "#fff",
    borderRadius: 20,
    zIndex: 1,
    marginTop: -35,
    paddingBottom: LEFT_MARGIN,
    shadowColor: `#000`,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2
    // elevation: 1
  },
  gameLogoView: {
    ...sharedStyles.justifiedCenter,
    height: 70,
    width: 70,
    borderRadius: 35,
    alignSelf: "center",
    backgroundColor: "#fff",
    zIndex: 2,
    shadowColor: `#000`,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 1
  },
  questionText: {
    fontSize: 26,
    color: "#1E2432",
    textAlign: "center",
    paddingHorizontal: LEFT_MARGIN,
    marginTop: 40,
    ...sharedStyles.mediumText
  },
  cardView: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: DeviceWidth
  },
  baseLayout: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end"
  },
  gameName: {
    color: "#fff",
    fontSize: 26,
    marginVertical: LEFT_MARGIN,
    textAlign: "center"
  },
  appName: {
    marginLeft: LEFT_MARGIN / 2,
    color: FONT_BLACK,
    fontSize: 30
  },
  logoStyle: {
    height: 32,
    width: 32,
    borderRadius: 16
  },
  logoView: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -LEFT_MARGIN
  },
  closeIconView: {
    backgroundColor: "rgb(228,229,234)",
    height: 35,
    width: 35,
    marginVertical: LEFT_MARGIN,
    borderRadius: 20,
    ...sharedStyles.justifiedCenter
  }
});

const mapStateToProps = state => {
  return {
    myData: state.info.userInfo
  };
};

const mapDispatchToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(SharePreview);
