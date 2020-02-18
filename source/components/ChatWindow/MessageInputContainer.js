import React, { Component } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import ImagePicker from "react-native-image-picker";
import Animated from "react-native-reanimated";
import SvgUri from "react-native-svg-uri";
import TextTicker from "react-native-text-ticker";
import Ionicon from "react-native-vector-icons/Ionicons";
import MatIcon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { runTiming } from "../../config/Animations";
import { FONT_BLACK } from "../../config/Colors";
import { msgTypes } from "../../config/Constants";
import { DeviceHeight, DeviceWidth } from "../../config/Device";
import { userNamify } from "../../config/Utils";
import { setCloserPopoverVisibility } from "../../redux/actions/nav";
import { setMessage } from "../../redux/actions/rooms";
import {
  setChatBoxPickerVisibility,
  setHasSeenCloserPopup
} from "../../redux/actions/tutorials";
import { sharedStyles } from "../../styles/Shared";
import MediumText from "../Texts/MediumText";

const {
  Value,
  cond,
  eq,
  onChange,
  call,
  block,
  and,
  set,
  interpolate,
  Extrapolate
} = Animated;

class MessageInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messageValue: "",
      status: "",
      input: "",
      showPopover: false,
      showCloserPopover: false
    };
    this.textInputState = new Value(0);
    this.animProgress = new Value(0);
    this.imageBtnShown = new Value(0);
  }

  onSendHandler = () => {
    let msg = this.state.messageValue.trim();
    if (msg != "") {
      const noLinesMsg = msg.replace(/[\r\n]+/gm, "");
      this.props.onSend({ message: noLinesMsg });
      this.setState({ messageValue: "" });
    } else {
      // invalid msg
    }
  };

  isPostedBy = () => {
    const { currentChatScreenIndex } = this.props;
    return currentChatScreenIndex === 1;
  };

  currentRoom = () => {
    const { selectedRoomId, allRooms } = this.props;
    const currentRoom = allRooms[selectedRoomId];
    return currentRoom;
  };

  isPickerEnabled = () => {
    const { selectedRoomId, allRooms, isChatBoxPickersDisabled } = this.props;
    const currentRoom = allRooms[selectedRoomId];

    let enabled = false;
    if (this.isPostedBy()) {
      const { postedByPickersEnabled } = currentRoom;
      enabled = postedByPickersEnabled && isChatBoxPickersDisabled < 1;
    } else {
      const { answeredByPickersEnabled } = currentRoom;
      enabled = answeredByPickersEnabled && isChatBoxPickersDisabled < 1;
    }
    return enabled;
  };

  renderQuestionPickerIcon = () => {
    const { toggleQuestionPicker } = this.props;

    return (
      <TouchableOpacity
        disabled={!this.msgCountSatisfied()}
        style={styles.iconHolderView}
        onPress={() => {
          if (this.isPickerEnabled()) {
            toggleQuestionPicker(true, true);
          } else if (this.msgCountSatisfied()) {
            this.setState({ showPopover: true });
            setTimeout(() => {
              this.setState({ showPopover: false });
            }, 2000);
          }
        }}
      >
        {this.isPickerEnabled() ? (
          <View>
            <View
              style={{
                height: 22,
                width: 16,
                backgroundColor: "pink",
                borderRadius: 2
              }}
            />
            <View
              style={{
                height: 22,
                width: 16,
                position: "absolute",
                zIndex: 3,
                backgroundColor: "skyblue",
                borderRadius: 2,
                borderWidth: 1,
                borderColor: "#fff",
                transform: [
                  {
                    rotate: "-10deg"
                  },
                  {
                    translateY: -1
                  },
                  {
                    translateX: -2
                  }
                ]
              }}
            />
          </View>
        ) : (
          <SvgUri
            height={25}
            width={25}
            source={require("../../assets/svgs/Chat/inactiveCardPicker.svg")}
          />
        )}
      </TouchableOpacity>
    );
  };

  msgCountSatisfied = () => {
    const { selectedRoomId, allRooms } = this.props;
    const room = allRooms[selectedRoomId];
    const currentRoomMessages = room.messages;
    if (currentRoomMessages.length > 0) {
      if (currentRoomMessages[0].type === msgTypes.MESSAGE_SYSTEM_A) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  };

  renderCloserButton = () => {
    const {
      myData,
      selectedRoomId,
      allRooms,
      targetUser,
      closerBtnLoading
    } = this.props;
    const room = allRooms[selectedRoomId];
    const showCloserButton = room.status !== "FRIENDS";

    const friendObj = room.friendObj
      ? room.friendObj.length > 0
        ? room.friendObj[0]
        : null
      : null;
    const enableCloserButton =
      (this.msgCountSatisfied() && friendObj === null) ||
      (friendObj && friendObj.user !== myData._id);
    const showCloserText =
      friendObj === null || (friendObj && friendObj.user !== myData._id);
    const closerText = showCloserText
      ? "One step closer"
      : `Waiting for ${userNamify(targetUser)} to get closer`;

    return (
      <View>
        {showCloserButton ? (
          <TouchableOpacity
            disabled={!enableCloserButton || closerBtnLoading}
            style={[
              styles.closerButtonView,
              {
                backgroundColor: enableCloserButton ? "#FF2D55" : "#fff"
              }
            ]}
            onPress={() => this.props.onClickCloser(friendObj ? false : true)}
          >
            {closerBtnLoading ? (
              <ActivityIndicator size="small" color={"#fff"} />
            ) : showCloserText ? (
              <Text
                style={[
                  styles.closerText,
                  {
                    color: enableCloserButton ? "#fff" : "#9B9B9B",
                    paddingVertical: showCloserText ? 10 : 0
                  }
                ]}
              >
                {closerText}
              </Text>
            ) : (
              <TextTicker
                style={styles.closerText}
                duration={3000}
                // loop={false}
                repeatSpacer={0}
                marqueeDelay={500}
              >
                {closerText}...
              </TextTicker>
            )}
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>
    );
  };

  renderTextInput = () => {
    const { myData, selectedRoomId, allRooms, targetUser } = this.props;
    const room = allRooms[selectedRoomId];

    const hideTextInput = room.status !== "FRIENDS" && false;
    return (
      <>
        {hideTextInput ? (
          <View />
        ) : (
          <TextInput
            placeholder={"Type your message.."}
            returnKeyType="done"
            value={this.state.messageValue}
            multiline
            onEndEditing={() =>
              this.props.changeTypingStatus(selectedRoomId, false)
            }
            onBlur={() => {
              this.textInputState.setValue(2);
            }}
            onFocus={() => {
              // this.textInputState.setValue(1);

              this.props.changeTypingStatus(selectedRoomId, true);
            }}
            onChangeText={text => {
              this.setState({ messageValue: text }, () => {
                this.textInputState.setValue(
                  this.state.messageValue.length > 0 ? 1 : 0
                );
              });
            }}
            style={{
              backgroundColor: "#fff",
              width: DeviceWidth * 0.5,
              borderRadius: 15,
              height: 45,
              paddingLeft: 10,
              paddingTop: 15
            }}
          />
        )}
      </>
    );
  };

  componentWillReceiveProps = nextProps => {
    const {
      showCloserPopover,
      setCloserPopoverVisibility,
      setHasSeenCloserPopup,
      hasSeenCloserPopup
    } = nextProps;
    console.log("hasSeenCloserPopup si :", hasSeenCloserPopup);

    if (
      showCloserPopover &&
      !hasSeenCloserPopup //********** IMPORTANT TO UNCOMMENT AFTER Checking
    ) {
      setCloserPopoverVisibility(undefined);
      setHasSeenCloserPopup();
      this.setState({ showCloserPopover: true });
      setTimeout(() => {
        this.setState({ showCloserPopover: false });
      }, 2500);
    }
  };

  renderGifPicker = () => {
    let { toggleGiphyPicker } = this.props;

    return (
      <TouchableOpacity
        disabled={!this.msgCountSatisfied()}
        style={styles.iconHolderView}
        onPress={() => {
          if (this.isPickerEnabled()) {
            toggleGiphyPicker(true);
          } else if (this.msgCountSatisfied()) {
            this.setState({ showPopover: true });
            setTimeout(() => {
              this.setState({ showPopover: false });
            }, 2000);
          }
        }}
      >
        {this.isPickerEnabled() ? (
          <SvgUri
            height={22}
            width={22}
            source={require("../../assets/svgs/Chat/activeGifPicker.svg")}
          />
        ) : (
          <SvgUri
            height={18}
            width={18}
            source={require("../../assets/svgs/Chat/inactiveGifPicker.svg")}
          />
        )}
      </TouchableOpacity>
    );
  };
  handleImageSend = () => {
    const options = {
      title: "Select Image",
      takePhotoButtonTitle: "Camera",
      chooseFromLibraryButtonTitle: "Camera Roll",
      allowsEditing: false,
      noData: true
    };
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        const { sendImage } = this.props;
        sendImage(response.uri, msgTypes.IMAGE);
      }
    });
  };

  renderImageOrSendIcon = () => {
    const { myData, selectedRoomId, allRooms, targetUser } = this.props;
    const room = selectedRoomId ? allRooms[selectedRoomId] : null;
    if (!room) {
      return;
    }
    const hideImageIcon = room.status !== "FRIENDS" && false;
    const imageBtnOpacity = interpolate(this.animProgress, {
      inputRange: [0, 1],
      outputRange: [1, 0],
      extrapolate: Extrapolate.CLAMP
    });
    const sendBtnOpacity = interpolate(this.animProgress, {
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: Extrapolate.CLAMP
    });
    return (
      <>
        <Animated.Code>
          {() =>
            block([
              cond(eq(this.textInputState, 1), [
                set(
                  this.animProgress,
                  runTiming({
                    value: this.animProgress,
                    duration: 300,
                    dest: 1,
                    completeNode: this.imageBtnShown,
                    completeValue: 1,
                    onComplete: () => ({})
                  })
                )
              ]),
              cond(eq(this.textInputState, 0), [
                set(
                  this.animProgress,
                  runTiming({
                    duration: 300,
                    value: this.animProgress,
                    dest: 0,
                    completeNode: this.imageBtnShown,
                    completeValue: 0,
                    onComplete: () => ({})
                  })
                )
              ])
            ])
          }
        </Animated.Code>
        <View
          style={{
            // position: "absolute",
            // right: 0,
            // bottom: 10,
            // backgroundColor: "red",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {hideImageIcon ? (
            <View />
          ) : (
            <View
              style={{
                // position: "absolute",
                // right: 0,
                // bottom: 0
                width: 50,
                height: 50,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              {/* {this.state.messageValue !== "" ? ( */}
              <Animated.View
                style={{
                  position: "absolute",
                  opacity: sendBtnOpacity
                  // right: 0
                  // bottom: 0
                  // width: 50,
                  // height: 50
                  // backgroundColor: "green"
                }}
              >
                <TouchableOpacity
                  style={{
                    padding: 10,
                    backgroundColor: "#774CD5",
                    borderRadius: 20
                  }}
                  onPress={this.onSendHandler}
                >
                  <MatIcon size={20} color={"white"} name="send" />
                </TouchableOpacity>
              </Animated.View>
              {/* ) : ( */}

              <Animated.View
                style={{
                  position: "absolute",
                  opacity: imageBtnOpacity

                  // right: 0
                  // bottom: 0
                  // width: 50,
                  // height: 50
                }}
              >
                <TouchableOpacity
                  style={styles.iconHolderView}
                  onPress={() => this.handleImageSend()}
                >
                  <SvgUri
                    height={20}
                    width={20}
                    source={require("../../assets/svgs/Chat/gallery.svg")}
                  />
                </TouchableOpacity>
              </Animated.View>
              {/* )} */}
            </View>
          )}
        </View>
      </>
    );
  };

  renderPickerPopover = () => {
    return (
      <View
        style={{
          shadowOffset: { width: 2, height: 2 },
          shadowColor: "#00000029",
          shadowOpacity: 0.9,
          shadowRadius: 10
        }}
      >
        <View
          style={{
            position: "absolute",
            bottom: 70,
            height: 50,
            width: DeviceWidth * 0.6,
            backgroundColor: "#fff",
            borderRadius: 10,
            left: 20,
            elevation: 2,
            ...sharedStyles.justifiedCenter
          }}
        >
          <MediumText style={{ fontSize: 14, color: FONT_BLACK }}>
            Let's wait for them to respond
          </MediumText>
        </View>
        <Ionicon
          style={{
            position: "absolute",
            bottom: 35,
            left: DeviceWidth * 0.125,
            zIndex: 99
          }}
          name={"md-arrow-dropdown"}
          size={50}
          color={"#fff"}
        />
      </View>
    );
  };

  renderCloserPopover = () => {
    return (
      <View
        style={{
          backgroundColor: "#00000050",
          zIndex: 7,
          width: DeviceWidth,
          height: DeviceHeight,
          position: "absolute"
        }}
      >
        <View
          style={{
            shadowOffset: { width: 2, height: 2 },
            shadowColor: "#00000029",
            shadowOpacity: 0.9,
            shadowRadius: 15,
            elevation: 2,
            position: "absolute",
            bottom: 0,
            right: DeviceWidth * 0.1,
            zIndex: 8
          }}
        >
          <View
            style={{
              height: 50,
              width: DeviceWidth * 0.6,
              backgroundColor: "#fff",
              borderRadius: 10,
              ...sharedStyles.justifiedCenter
            }}
          >
            <MediumText style={{ fontSize: 14, color: FONT_BLACK }}>
              Tap here to become friends!
            </MediumText>
          </View>
          <Ionicon
            style={{
              zIndex: 9,
              alignSelf: "center",
              transform: [{ translateY: -20 }]
            }}
            name={"md-arrow-dropdown"}
            size={50}
            color={"#fff"}
          />
        </View>
      </View>
    );
  };

  render() {
    const { showPopover, showCloserPopover } = this.state;

    return (
      <>
        {showPopover ? (
          this.renderPickerPopover()
        ) : showCloserPopover ? (
          this.renderCloserPopover()
        ) : (
          <View />
        )}

        <View style={styles.baseLayout}>
          {this.renderQuestionPickerIcon()}
          {this.renderGifPicker()}
          {/* {this.renderCloserButton()} */}
          {this.renderTextInput()}
          {this.renderImageOrSendIcon()}
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  cardIcon: {
    height: 30,
    width: 30
  },
  smileyIcon: {
    height: 23,
    width: 23
  },
  iconHolderView: {
    height: 40,
    width: 40,
    borderRadius: 15,
    padding: 2,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(0,0,0,1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1
  },
  RightBottomView: {
    flex: 5
  },
  waitText: {
    fontSize: 11,
    color: "rgba(0,0,0,0.5)"
  },
  pickerButtonText: {
    fontWeight: "bold",
    fontSize: 25,
    paddingVertical: 0
  },
  pickerButtonView: {
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 5,
    height: 35,
    width: 35
  },
  closerText: {
    fontSize: 16,
    fontFamily: "Proxima Nova"
    // marginHorizontal: 10
  },
  closerButtonView: {
    height: 40,
    width: DeviceWidth * 0.6,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(0,0,0,1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    flex: 4,
    borderRadius: 10,
    paddingLeft: 15,
    marginHorizontal: 5
  },
  sendButtonView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10
  },
  baseLayout: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    shadowColor: "rgba(0,0,0,0.3)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    elevation: 3,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    marginHorizontal: 5,
    height: 55,
    width: DeviceWidth
  }
});

const mapStateToProps = state => {
  return {
    myData: state.info.userInfo,
    allRooms: state.rooms.rooms,
    selectedRoomId: state.rooms.selected_room_id,
    isChatBoxPickersDisabled: state.tutorial.isChatBoxPickersDisabled,
    currentChatScreenIndex: state.nav.currentChatScreenIndex,
    showCloserPopover: state.nav.showCloserPopover,
    hasSeenCloserPopup: state.tutorial.hasSeenCloserPopup
  };
};
const mapDispatchToProps = dispatch => {
  return {
    setMessage: bindActionCreators(setMessage, dispatch),
    setChatBoxPickerVisibility: bindActionCreators(
      setChatBoxPickerVisibility,
      dispatch
    ),
    setCloserPopoverVisibility: bindActionCreators(
      setCloserPopoverVisibility,
      dispatch
    ),
    setHasSeenCloserPopup: bindActionCreators(setHasSeenCloserPopup, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MessageInput);
