import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar
} from "react-native";
import { DeviceWidth, DeviceHeight } from "../../config/Device";
import { connect } from "react-redux";
import { View as AnimatableView } from "react-native-animatable";
import MediumText from "../Texts/MediumText";
import Toast from "react-native-simple-toast";
import {
  FONT_BLACK,
  FONT_GREY,
  CORRECT_RESPONSE_GREEN,
  PURPLE,
  LIGHT_PURPLE
} from "../../config/Colors";
import DoubletapEditor from "./Doubletap.editor";
import RegularText from "../Texts/RegularText";
import {
  GAME_LOGOS_COLORFUL,
  LEFT_MARGIN,
  GamesWhichHasGreenRedResponses
} from "../../config/Constants";
import { isEmpty } from "lodash";
import SvgUri from "react-native-svg-uri";
import HorizontalGradientView from "../Views/HorizontalGradientView";
import { bindActionCreators } from "redux";
import { setOptionFadeAnimation } from "../../redux/actions/nav";
import { ScrollView } from "react-native-gesture-handler";

const GAME_LOGO_RADIUS = 40;

class PickedQuestionview extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onSubmitEditingHandler = () => {
    this.setState({ editMode: false });
    Keyboard.dismiss();
  };

  pickOption = pickedOption => {
    this.setState({ pickedOption });
  };

  _onSingleTap = index => {
    const { optionA, optionB, optionC, optionD, questionText } = this.state;

    switch (index) {
      case 0:
        if (optionA !== "") {
          this.pickOption(index);
        } else {
          alert("Option cannot be empty");
        }
        break;

      case 1:
        if (optionB !== "") {
          this.pickOption(index);
        } else {
          alert("Option cannot be empty");
        }
        break;

      case 2:
        if (optionC === "") {
          this._onDoubleTap(index);
        } else {
          this.pickOption(index);
        }
        break;

      case 3:
        if (optionD === "") {
          this._onDoubleTap(index);
        } else {
          this.pickOption(index);
        }
        break;

      case 4:
        if (questionText === "") {
          this._onDoubleTap(index);
        }

      default:
        break;
    }
  };

  _onDoubleTap = index => {
    const { fromChatWindow, selectedRoomId, rooms } = this.props;
    if (fromChatWindow && rooms[selectedRoomId].status === "SLOT") {
      Toast.show(`Cannot edit content before you become friends`);
      switch (index) {
        case 0:
          this.refs.optionOneRef.shake(200);
          break;

        case 1:
          this.refs.optionTwoRef.shake(200);
          break;

        case 2:
          this.refs.optionThreeRef.shake(200);
          break;

        case 3:
          this.refs.optionFourRef.shake(200);
          break;

        case 4:
          // Do not show shake animation for question
          break;

        default:
          break;
      }
    } else {
      const { gameId } = this.props.pickedQuestion;
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
          Toast.show(`Cannot edit options for this game`);
        }
      }
    }
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    const { props, state } = this;

    const isPickedQuestionDifferent =
      props.pickedQuestion !== nextProps.pickedQuestion;
    const isPickedOptionDifferent =
      state.pickedOption !== nextState.pickedOption;
    const showChangeOptionTutorialDifferent =
      state.showChangeOptionTutorial !== nextState.showChangeOptionTutorial;
    const isEditmodeDifferent = state.editMode !== nextState.editMode;
    return (
      isPickedQuestionDifferent ||
      isPickedOptionDifferent ||
      showChangeOptionTutorialDifferent ||
      isEditmodeDifferent
    );
  };

  componentWillReceiveProps = nextProps => {
    const { props } = this;
    if (
      props.pickedQuestion !== nextProps.pickedQuestion &&
      !isEmpty(nextProps.pickedQuestion)
    ) {
      const { options, question, postedOption } = nextProps.pickedQuestion;
      // const pickedOption = nextProps.pickedOption;
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
          originalOptionD: options[3] ? options[3] : "",
          // pickedQuestion: ,
          hideAddNewOption: false
        });
      } else {
        this.setState({
          questionText: question,
          originalText: question,
          // pickedQuestion,
          hideAddNewOption: false
        });
      }

      setTimeout(() => {
        this.setState(
          {
            pickedOption: postedOption === 0 || postedOption ? postedOption : 1,
            showChangeOptionTutorial: true
          },
          () => {
            setTimeout(() => {
              this.setState({ showChangeOptionTutorial: false });
            }, 2000);
          }
        );
      }, 1000);
    }
  };

  renderOptions = () => {
    const {
      pickedOption,
      optionA,
      optionB,
      optionC,
      optionD,
      currentlyEditingItem,
      editMode,
      showChangeOptionTutorial,
      hideAddNewOption
    } = this.state;
    const {
      fromChatWindow,
      rooms,
      selectedRoomId,
      pickedQuestion
    } = this.props;

    const { value, colors } = pickedQuestion.gameId;

    const showImage = GamesWhichHasGreenRedResponses.indexOf(value) === -1;

    return (
      <>
        {showChangeOptionTutorial ? (
          <AnimatableView
            animation={"zoomIn"}
            duration={200}
            style={{
              position: "absolute",
              zIndex: 9999,
              elevation: 2,
              shadowColor: "rgba(0,0,0,0.8)",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.4,
              shadowRadius: 10,
              marginTop: 5
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 10,
                marginTop: -40,
                height: 40,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <MediumText style={{ color: FONT_BLACK, padding: 10 }}>
                Tap to change your option
              </MediumText>
            </View>
            <View
              style={{
                position: "absolute",
                height: 20,
                width: 20,
                borderRadius: 4,
                // backgroundColor: colors[0],
                backgroundColor: "#fff",
                marginLeft: DeviceWidth * 0.1,
                marginTop: -12.5,
                transform: [
                  {
                    rotateZ: "45deg"
                  }
                ]
              }}
            />
          </AnimatableView>
        ) : (
          <View />
        )}
        <AnimatableView ref={"optionOneRef"}>
          <DoubletapEditor
            editable={
              value !== "NEVER_HAVE_I_EVER" && value !== "BLUFF_OR_TRUTH"
            }
            onSingleTap={this._onSingleTap}
            onDoubleTap={this._onDoubleTap}
            onChangeText={optionA => this.setState({ optionA })}
            editMode={editMode}
            index={0}
            currentlyEditingItem={currentlyEditingItem}
            text={optionA}
            pickedOption={pickedOption}
            onSubmitEditingHandler={this.onSubmitEditingHandler}
            showImage={showImage}
            // bgColor={animatedColor}
            bgColor={showImage ? colors[0] : CORRECT_RESPONSE_GREEN}
          />
        </AnimatableView>

        <AnimatableView ref={"optionTwoRef"}>
          <DoubletapEditor
            editable={
              value !== "NEVER_HAVE_I_EVER" && value !== "BLUFF_OR_TRUTH"
            }
            onSingleTap={this._onSingleTap}
            onDoubleTap={this._onDoubleTap}
            onChangeText={optionB => this.setState({ optionB })}
            editMode={editMode}
            index={1}
            currentlyEditingItem={currentlyEditingItem}
            text={optionB}
            pickedOption={pickedOption}
            onSubmitEditingHandler={this.onSubmitEditingHandler}
            showImage={showImage}
            bgColor={showImage ? colors[0] : CORRECT_RESPONSE_GREEN}
          />
        </AnimatableView>

        {(fromChatWindow && rooms[selectedRoomId].status === "SLOT") ||
        optionB === "" ||
        value === "NEVER_HAVE_I_EVER" ||
        value === "BLUFF_OR_TRUTH" ||
        hideAddNewOption ? (
          <View />
        ) : (
          <AnimatableView ref={"optionThreeRef"}>
            <DoubletapEditor
              editable={
                value !== "NEVER_HAVE_I_EVER" && value !== "BLUFF_OR_TRUTH"
              }
              isNewOption={optionC === ""}
              onSingleTap={this._onSingleTap}
              onDoubleTap={this._onDoubleTap}
              onChangeText={optionC => this.setState({ optionC })}
              editMode={editMode}
              index={2}
              currentlyEditingItem={currentlyEditingItem}
              text={optionC}
              pickedOption={pickedOption}
              onSubmitEditingHandler={this.onSubmitEditingHandler}
              showImage={showImage}
              bgColor={showImage ? colors[0] : CORRECT_RESPONSE_GREEN}
            />
          </AnimatableView>
        )}

        {(fromChatWindow && rooms[selectedRoomId].status === "SLOT") ||
        optionC === "" ||
        hideAddNewOption ? (
          <View />
        ) : (
          <AnimatableView ref={"optionFourRef"}>
            <DoubletapEditor
              editable={
                value !== "NEVER_HAVE_I_EVER" && value !== "BLUFF_OR_TRUTH"
              }
              isNewOption={optionD === ""}
              onSingleTap={this._onSingleTap}
              onDoubleTap={this._onDoubleTap}
              onChangeText={optionD => this.setState({ optionD })}
              editMode={editMode}
              index={3}
              currentlyEditingItem={currentlyEditingItem}
              text={optionD}
              pickedOption={pickedOption}
              onSubmitEditingHandler={this.onSubmitEditingHandler}
              showImage={showImage}
              bgColor={showImage ? colors[0] : CORRECT_RESPONSE_GREEN}
            />
          </AnimatableView>
        )}

        <RegularText
          style={{
            color: hideAddNewOption || editMode ? "#fff" : FONT_GREY,
            textAlign: "center",
            marginVertical: 10
          }}
        >
          Double tap on the text to edit
        </RegularText>
      </>
    );
  };

  render() {
    const {
      item,
      fromChatWindow,
      pickedQuestion,
      saveQuestion,
      sendQuestion
    } = this.props;
    const {
      pickedOption,
      isSaveLoading,
      fromPost,
      postedOption,
      questionText,
      currentlyEditingItem,
      editMode
    } = this.state;

    return (
      <View
        style={{
          width: DeviceWidth * 1.2,
          alignItems: "center",
          alignSelf: "center"
        }}
      >
        <StatusBar animated hidden={editMode} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={"always"}
          style={{
            paddingTop: GAME_LOGO_RADIUS + 10
          }}
        >
          <View
            style={{
              height: !editMode ? 0 : DeviceHeight * 0.25
            }}
          />
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 20,
              paddingHorizontal: 10,
              shadowColor: `#000`,
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.1,
              width: DeviceWidth * 0.85,
              alignSelf: "center",
              minWidth: DeviceWidth * 0.85
            }}
          >
            <View style={styles.avatarImage}>
              <SvgUri
                height={40}
                width={40}
                source={GAME_LOGOS_COLORFUL[item.value]}
              />
            </View>
            {item.value === "WOULD_YOU_RATHER" ? (
              <View />
            ) : (
              <DoubletapEditor
                onSingleTap={this._onSingleTap}
                onDoubleTap={this._onDoubleTap}
                onChangeText={questionText => this.setState({ questionText })}
                editMode={editMode}
                index={4}
                currentlyEditingItem={currentlyEditingItem}
                text={questionText === "SIMILARITIES" ? "" : questionText}
                onSubmitEditingHandler={this.onSubmitEditingHandler}
                isQuestion
              />
            )}

            <View>
              {isEmpty(pickedQuestion) ? <View /> : this.renderOptions()}
            </View>
          </View>
          <View
            style={{
              height: editMode ? DeviceHeight * 0.1 : DeviceHeight * 0.25
            }}
          />
        </ScrollView>
        {editMode ? (
          <View />
        ) : (
          <TouchableOpacity
            disabled={
              pickedOption === null ||
              isSaveLoading ||
              (fromPost &&
                pickedOption === postedOption &&
                this.isQuestionOriginal(true))
            }
            style={{
              ...styles.submitButtonView,
              position: "absolute",
              bottom: LEFT_MARGIN,
              alignSelf: "center",
              elevation: 2,
              shadowColor: "rgba(0,0,0,0.8)",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.2,
              shadowRadius: 10
            }}
            onPress={() => {
              this.setState(
                {
                  hideAddNewOption: true
                },
                () => {
                  this.props.setOptionFadeAnimation(true);
                  setTimeout(() => {
                    fromChatWindow ? sendQuestion() : saveQuestion();
                  }, 500);
                }
              );
            }}
          >
            <HorizontalGradientView
              style={styles.submitButtonView}
              colors={
                fromPost
                  ? pickedOption !== postedOption ||
                    !this.isQuestionOriginal(true)
                    ? [PURPLE, LIGHT_PURPLE]
                    : ["#cacaca", "#cacaca"]
                  : pickedOption === null
                  ? ["#cacaca", "#cacaca"]
                  : [PURPLE, LIGHT_PURPLE]
              }
            >
              {isSaveLoading ? (
                <ActivityIndicator color={"#fff"} size={"small"} />
              ) : (
                <MediumText
                  style={{
                    fontSize: 22,
                    color: "#fff"
                  }}
                >
                  {fromPost ? "UPDATE" : fromChatWindow ? "SEND" : "SAVE"}
                </MediumText>
              )}
            </HorizontalGradientView>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  submitButtonView: {
    height: 50,
    width: DeviceWidth * 0.4,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30
  },
  avatarImage: {
    height: GAME_LOGO_RADIUS * 2,
    width: GAME_LOGO_RADIUS * 2,
    borderRadius: GAME_LOGO_RADIUS,
    marginTop: -GAME_LOGO_RADIUS,
    alignSelf: "center",
    backgroundColor: "#fff",
    shadowColor: `#000`,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    alignItems: "center",
    justifyContent: "center"
  }
});

const mapState = state => {
  return {
    rooms: state.rooms.rooms,
    gameNames: state.questions.gameNames,
    selectedRoomId: state.rooms.selected_room_id
  };
};

const mapDispatch = dispatch => {
  return {
    setOptionFadeAnimation: bindActionCreators(setOptionFadeAnimation, dispatch)
  };
};
export default connect(mapState, mapDispatch)(PickedQuestionview);
