import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  FlatList
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
// import MultilineInput from "../../components/MyProfile/Multiline.input";
import {
  PURPLE,
  LIGHT_PURPLE,
  FONT_GREY,
  NEW_GREY,
  FONT_BLACK
} from "../../config/Colors";
import firebase from "react-native-firebase";

import { DeviceHeight, DeviceWidth } from "../../config/Device";
import Ionicon from "react-native-vector-icons/Ionicons";
import Slider from "react-native-slider";
import Modal from "react-native-modal";
import ContactUs from "../../components/Settings/Contact";
import SignOutModal from "../../components/Settings/Signout.modal";
import OutlinedButton from "../Common/Outlined.button";
import MediumText from "../Texts/MediumText";
import BoldText from "../Texts/BoldText";
import NoFeedbackTapView from "../Views/NoFeedbackTapView";
import { LEFT_MARGIN, softDeletionStatuses } from "../../config/Constants";
import HorizontalGradientView from "../Views/HorizontalGradientView";
import RegularText from "../Texts/RegularText";
import { connect } from "react-redux";
import * as UserApi from "../../network/user";
import { setOnlineStatus } from "../../redux/actions/rooms";
import { clearAsyncStorage } from "../../config/Storage";
import { bindActionCreators } from "redux";

const PAGE_PADDING = DeviceWidth * 0.05;

const deleteReasons = [
  {
    text: "Found awesome people already",
    image: require("../../assets/images/purpleHeart.png"),
    bgColor: "#3F38DD20"
  },
  {
    text: "Billing Issue",
    image: require("../../assets/images/moneybag.png"),
    bgColor: "#FFAA0020"
  },
  {
    text: "Dissatisfied With closer App",
    image: require("../../assets/images/unhappy.png"),
    bgColor: "#FF415B30"
  },
  {
    text: "Other",
    image: require("../../assets/images/pencil.png"),
    bgColor: "#48081620"
  }
];

class DeleteAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pickedItem: null,
      showTypingWindow: false,
      showConfirmModal: false,
      deleteText: "",
      issue: ""
    };
    this.scrollRef = React.createRef();
  }

  moveToNext = () => {
    this.scrollRef.scrollTo({ x: DeviceWidth });
    this.setState({ showTypingWindow: true });
  };

  softDeleteUser = async () => {
    alert("Logout");

    // UserApi.updateProfile(
    //   {
    //     softDeletedStatus: softDeletionStatuses.SOFT_DELETED,
    //     reason: this.state.pickedItem,
    //     reasonBody: this.state.issue
    //   },
    //   async cbResponse => {
    //     if (cbResponse.success) {
    //       const {
    //         reset,
    //         dismissDeleteAccountModal,
    //         goBack,
    //         navigation,
    //         setOnlineStatus
    //       } = this.props;
    //       firebase.messaging().deleteToken();
    //       await setOnlineStatus(false);
    //       reset();
    //       dismissDeleteAccountModal();
    //       await clearAsyncStorage();
    //       setTimeout(() => {
    //         goBack();
    //       }, 1000);
    //       setTimeout(() => {
    //         navigation.navigate("splash");
    //       }, 2500);
    //     }
    //   }
    // );
  };
  moveBackward = () => {
    this.scrollRef.scrollTo({ x: 0 });
    this.setState({ showTypingWindow: false });
  };

  render() {
    const { dismissDeleteAccountModal } = this.props;
    const {
      pickedItem,
      showTypingWindow,
      showConfirmModal,
      deleteText,
      issue
    } = this.state;

    return (
      <View style={styles.baseLayout}>
        <Modal isVisible={showConfirmModal}>
          <View
            style={{
              width: DeviceWidth * 0.95,
              borderRadius: 20,
              backgroundColor: "#fff",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center"
            }}
          >
            <RegularText
              style={{
                color: "#1E2432",
                fontSize: 18,
                textAlign: "center",
                padding: DeviceWidth * 0.04
              }}
            >
              Are you sure you? Deleting your account to create a new account
              may effect Who you see on the platform, and we want you to have
              the best experience possible. Confirm your action by typing
              ‘DELETE’
            </RegularText>
            <TextInput
              style={{
                height: 40,
                width: DeviceWidth * 0.75,
                backgroundColor: "rgb(240,240,240)",
                borderRadius: 10,
                paddingHorizontal: LEFT_MARGIN
              }}
              onChangeText={deleteText => this.setState({ deleteText })}
              value={deleteText}
            />
            <TouchableOpacity
              disabled={deleteText !== "DELETE"}
              onPress={() => this.softDeleteUser()}
              style={{
                height: 40,
                width: DeviceWidth * 0.75,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 30,
                backgroundColor:
                  deleteText === "DELETE" ? "#FF415B" : "#cacaca",
                alignSelf: "center",
                marginTop: LEFT_MARGIN
              }}
            >
              <MediumText
                style={{
                  color: "#fff"
                }}
              >
                Delete your account
              </MediumText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.setState({ showConfirmModal: false })}
              style={{
                height: 40,
                width: DeviceWidth * 0.75,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 30,
                backgroundColor: "#fff",
                alignSelf: "center",
                borderWidth: 1,
                borderColor: "#774CD5",
                marginTop: 10,
                marginBottom: LEFT_MARGIN
              }}
            >
              <MediumText
                style={{
                  color: "#774CD5"
                }}
              >
                Cancel
              </MediumText>
            </TouchableOpacity>
          </View>
        </Modal>
        <TouchableWithoutFeedback
          onPress={() => {
            showTypingWindow
              ? this.moveBackward()
              : dismissDeleteAccountModal();
          }}
        >
          <View
            style={[
              styles.SettingsHeaderView,
              {
                flexDirection: !showTypingWindow ? "row" : "row-reverse",
                justifyContent: !showTypingWindow ? "space-between" : "flex-end"
              }
            ]}
          >
            <BoldText
              style={{
                marginLeft: showTypingWindow ? 10 : 0,
                marginTop: showTypingWindow ? 0 : 0,
                ...styles.SettingsHeaderText
              }}
            >
              {!showTypingWindow ? "Delete Account" : "Tell us your concern"}
            </BoldText>
            <Ionicon
              style={{
                transform: [{ translateY: -5 }]
              }}
              name={showTypingWindow ? "ios-arrow-back" : "ios-close"}
              color={"#707070"}
              size={showTypingWindow ? 30 : 35}
            />
          </View>
        </TouchableWithoutFeedback>
        <ScrollView
          contentOffset={{ x: 0 }}
          horizontal
          pagingEnabled
          ref={ref => {
            this.scrollRef = ref;
          }}
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
        >
          <View
            style={{
              width: DeviceWidth
            }}
          >
            <MediumText style={styles.descText}>
              Are you sure you want to Delete your account? Please let us know
              the reason Why you are Leaving
            </MediumText>
            <FlatList
              scrollEnabled={false}
              keyExtractor={item => item.text}
              numColumns={2}
              data={deleteReasons}
              extraData={this.state}
              renderItem={({ item, index }) => {
                return (
                  <View style={{ width: DeviceWidth * 0.5 }}>
                    <NoFeedbackTapView
                      style={[
                        styles.imageTextHolder,
                        {
                          borderColor:
                            pickedItem === item.text ? "#8A4CD6" : "#fff",
                          marginLeft: index % 2 === 0 ? LEFT_MARGIN : 0,
                          marginRight: index % 2 === 0 ? 0 : LEFT_MARGIN
                        }
                      ]}
                      onPress={() => {
                        this.setState({ pickedItem: item.text });
                      }}
                    >
                      <View
                        style={[
                          {
                            backgroundColor: item.bgColor
                          },
                          styles.imageView
                        ]}
                      >
                        <Image
                          source={item.image}
                          style={styles.imageIconStyle}
                        />
                      </View>
                      <Text style={styles.itemText}>{item.text}</Text>
                    </NoFeedbackTapView>
                  </View>
                );
              }}
            />
            <HorizontalGradientView
              style={{
                ...styles.nextButton,
                transform: [{ translateY: -20 }]
              }}
              colors={
                pickedItem === null
                  ? ["#cacaca", "#cacaca"]
                  : [PURPLE, LIGHT_PURPLE]
              }
            >
              <TouchableOpacity
                style={styles.nextButton}
                disabled={pickedItem === null}
                onPress={() => {
                  if (pickedItem === "Found awesome people already") {
                    this.setState({ showConfirmModal: true });
                  } else {
                    this.moveToNext();
                  }
                }}
              >
                <Text style={styles.nextText}>NEXT</Text>
              </TouchableOpacity>
            </HorizontalGradientView>
          </View>
          <View
            style={{
              width: DeviceWidth,
              alignItems: "center"

              // backgroundColor: "red",
              // justifyContent: "center"
            }}
          >
            <View style={{ width: DeviceWidth * 0.8, alignItems: "center" }}>
              <TextInput
                placeholder={"Type here..."}
                multiline
                value={issue}
                maxLength={300}
                numberOfLines={4}
                onChangeText={issue => this.setState({ issue })}
                style={{
                  backgroundColor: "#F0F0F0",
                  padding: LEFT_MARGIN,
                  borderRadius: 20,
                  color: FONT_GREY,
                  width: DeviceWidth * 0.8,
                  margin: LEFT_MARGIN / 2,
                  height: 150
                }}
              />
            </View>
            <TouchableOpacity
              disabled={issue === ""}
              onPress={() => this.setState({ showConfirmModal: true })}
              style={{
                height: 40,
                width: DeviceWidth * 0.8,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 30,
                backgroundColor: issue === "" ? "#cacaca" : "#FF415B",
                alignSelf: "center"
              }}
            >
              <Text
                style={{
                  color: "#fff"
                }}
              >
                Delete your account
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  nextText: {
    color: "#fff",
    fontSize: 17
  },
  nextButton: {
    height: 45,
    width: DeviceWidth * 0.8,
    alignSelf: "center",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  baseLayout: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: DeviceHeight * 0.1,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    paddingTop: DeviceWidth * 0.05
  },
  descText: {
    color: "rgb(80,80,80)",
    fontSize: 18,
    textAlign: "center",
    paddingHorizontal: DeviceWidth * 0.05
  },
  imageTextHolder: {
    width: DeviceWidth * 0.4,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: {
      height: 1,
      width: 1
    },
    shadowOpacity: 0.15,
    alignItems: "center",
    justifyContent: "center",
    height: DeviceWidth * 0.48,
    marginVertical: 10,
    alignSelf: "center"
  },
  imageView: {
    alignItems: "center",
    justifyContent: "center",
    height: 70,
    width: 70,
    borderRadius: 35
  },
  imageIconStyle: {
    height: 30,
    width: 32
  },
  itemText: {
    textAlign: "center",
    fontSize: 17,
    color: "#4E586E",
    marginTop: 10,
    paddingHorizontal: 10
  },
  SettingsHeaderText: {
    fontSize: 22,
    color: "#1E2432",
    fontWeight: "600"
  },
  SettingsHeaderView: {
    borderBottomColor: "#E4E5EA",
    borderBottomWidth: 0.5,
    paddingHorizontal: PAGE_PADDING,
    marginBottom: DeviceWidth * 0.02
  }
});

const mapState = state => {
  return {};
};

const mapDispatch = dispatch => {
  return {
    setOnlineStatus: bindActionCreators(setOnlineStatus, dispatch),
    reset: () => {
      return dispatch({
        type: "RESET"
      });
    }
  };
};

export default connect(mapState, mapDispatch)(DeleteAccount);
