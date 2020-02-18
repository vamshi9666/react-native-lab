import Lodash from "lodash";
import React, { Component } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Ionicon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import { DeviceHeight, DeviceWidth } from "../../../src/config/Device";
import {
  BACKGROUND_GREY,
  FONT_GREY,
  LIGHT_PURPLE,
  NEW_GREY,
  PURPLE,
  BRIGHT_RED
} from "../../config/Colors";
import {
  LEFT_MARGIN,
  UserAccountVerificationStatus
} from "../../config/Constants";
import Countries from "../../config/Countries";
import { checkNullAndUndefined } from "../../config/Utils";
import {
  checkUserExistanceMethod,
  sendOtp,
  verifyOtp,
  updateProfile,
  temporaryLoginMethod
} from "../../network/auth";
import { sharedStyles } from "../../styles/Shared";
import CountryPickerModal from "../Auth/Country.picker.modal";
import MediumText from "../Texts/MediumText";
import RegularText from "../Texts/RegularText";
import NoFeedbackTapView from "../Views/NoFeedbackTapView";
import RowView from "../Views/RowView";
import VerticalGradientView from "../Views/VerticalGradientView";
import { storeData } from "../../config/Storage";
import { addUserInfo } from "../../redux/actions/user.info";
import { bindActionCreators } from "redux";

class VerifyMobileModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showOtpScreen: false,
      currentMobileInput: "",
      isLoading: "",
      showModal: false,
      countries: Countries,
      0: "",
      1: "",
      2: "",
      3: "",
      4: "",
      5: "",
      otpInput: ["", "", "", "", "", ""],
      resendCounter: 30,
      selectedCountry: "91",
      submitLoading: false,
      isNextLoading: false
    };
    this.scrollRef = React.createRef();
  }

  componentDidMount = () => {
    const { fromLoginScreen } = this.props;

    this.setState({
      currentMobileInput: fromLoginScreen ? "" : this.props.myData.mobile_number
    });
  };

  goToCountryForm = () => {
    this.setState({
      isLoading: true
    });
    setTimeout(() => {
      this.setState({
        showModal: true
      });
    }, 500);
  };

  moveBack = () => {
    this.scrollRef.scrollTo({ x: 0 });
    this.setState({ showOtpScreen: false, isNextLoading: false });
  };

  moveForward = () => {
    this.scrollRef.scrollTo({ x: DeviceWidth });
    this.setState({ showOtpScreen: true });
  };

  sendOtp = () => {
    this.resendInterval = setInterval(() => {
      if (this.state.resendCounter > 0) {
        this.setState(prevState => {
          return {
            resendCounter: prevState.resendCounter - 1
          };
        });
      } else {
        clearInterval(this.resendInterval);
      }
    }, 1000);
    const { addUserInfo, fromLoginScreen } = this.props;
    const { currentMobileInput } = this.state;
    if (fromLoginScreen) {
      let data = {
        mobile_number: currentMobileInput
      };
      sendOtp(data, cb => {
        if (cb.success) {
          this.moveForward();
        }
      });
    } else {
      addUserInfo("isMobileNumberVerfied", "IN_PROGRESS");
      updateProfile(
        {
          isMobileNumberVerfied: "IN_PROGRESS"
        },
        cb => {
          let data = {
            mobile_number: currentMobileInput
          };
          this.setState({ isSendingOtp: true });
          sendOtp(data, cb => {
            if (cb.success) {
              this.moveForward();
            }
          });
        }
      );
    }
  };

  verifyOtp = () => {
    const { otpInput, currentMobileInput: mobile_number } = this.state;
    this.setState({ submitLoading: true });
    const otp = otpInput.join("");
    let data = { otp, mobile_number };
    console.log("cbData  is: 1:: ", data);
    verifyOtp(data, cbData => {
      console.log("cbData  is: 2:: ", cbData);
      storeData("MOBILE", mobile_number);
      if (cbData.code === 200) {
        const {
          addUserInfo,
          fromLoginScreen,
          oldLoginID,
          dismissVerifyMobileModal
        } = this.props;
        if (fromLoginScreen) {
          console.log("cbData  is: 3:: ", oldLoginID);
          temporaryLoginMethod(
            {
              oldLoginID,
              newLoginID: mobile_number
            },
            loginResponse => {
              console.log("cbData  is: 4:: ", loginResponse);
              storeData("USER_ID", loginResponse.data.userId);
              storeData("AUTH_TOKEN", loginResponse.data.token);
              storeData("LOGGED_IN", "true");
              console.log("loginResponse: ", loginResponse);
              dismissVerifyMobileModal(true);
            }
          );
        } else {
          console.log("cbData  is: 5:: ");
          addUserInfo("isMobileNumberVerfied", "DONE");
          addUserInfo("mobile_number", mobile_number);
          updateProfile(
            {
              isMobileNumberVerfied: "DONE",
              mobile_number
            },
            cb => {
              this.moveBack();
            }
          );
        }
      } else if (cbData.code === 202 || cbData.code === 203) {
      } else if (cbData.code === 203) {
        // OTP has expired
        alert("OTP expired");
      } else if (cbData.code === 400) {
        alert("OTP is not matching");
      }
    });
  };

  fetchAccountUsingPhoneNumber = () => {
    const { currentMobileInput } = this.state;
    this.setState({ isNextLoading: true });

    checkUserExistanceMethod(currentMobileInput, cbData => {
      if (cbData.success) {
        if (cbData.code === 200) {
          this.setState({ isNextLoading: false });
          alert(
            "Account already exists with this number. Please enter a different mobile number."
          );
        } else {
          this.sendOtp();
        }
      } else {
        // Handle error
      }
    });
  };

  dismissCountryPickerModal = () => {
    this.setState({ showModal: false, isLoading: false });
  };

  handleTopBarTap = () => {
    const { showOtpScreen } = this.state;
    if (showOtpScreen) {
      this.moveBack();
    } else {
      this.props.dismissVerifyMobileModal();
    }
  };

  handleTextChange = (index, text) => {
    // this.setState({ [input]: text, currentInput: input + 1 });
    this.setState(prevState => {
      const otpInput = Object.assign([], prevState.otpInput);
      otpInput[index] = text;
      return {
        otpInput,
        currentInput: index + 1
      };
    });
    if (index < 5) {
      this.refs[`input_${index + 1}`].focus();
    }
  };

  handleBackspacePress = () => {
    const { currentInput } = this.state;

    if (currentInput > 0) {
      this.setState(
        prevState => {
          let otpInput = Object.assign([], prevState.otpInput);

          otpInput[currentInput] = "";
          console.log(
            " new backspace handled otp input is ",
            otpInput,
            currentInput
          );
          return { otpInput, currentInput: currentInput - 1 };
        },
        () => {
          this.refs[`input_${currentInput - 1}`].focus();
        }
      );
    }
  };

  render() {
    const { myData, fromLoginScreen } = this.props;
    const {
      showOtpScreen,
      currentMobileInput,
      isLoading,
      showModal,
      resendCounter,
      selectedCountry,
      submitLoading,
      isNextLoading,
      otpInput
    } = this.state;
    const enableResendBtn = resendCounter === 0;
    const enabledOtpSubmit = otpInput.filter(i => i !== "").length > 5;

    const hasVerified =
      myData.isMobileNumberVerfied === UserAccountVerificationStatus.DONE;
    const isPending =
      myData.isMobileNumberVerfied ===
      UserAccountVerificationStatus.IN_PROGRESS;

    const disabled =
      checkNullAndUndefined(myData.mobile_number) &&
      myData.mobile_number === currentMobileInput &&
      hasVerified;

    return (
      <View style={styles.baseLayout}>
        <NoFeedbackTapView
          onPress={this.handleTopBarTap}
          style={{
            flexDirection: showOtpScreen ? "row-reverse" : "row",
            justifyContent: showOtpScreen ? "flex-end" : "space-between",
            ...styles.topRowView
          }}
        >
          <Text
            style={{
              ...styles.headerText,
              marginLeft: showOtpScreen ? 10 : 0,
              marginBottom: showOtpScreen ? 10 : 0
            }}
          >
            {fromLoginScreen
              ? "Identified Temporary LoginID"
              : showOtpScreen
              ? "Enter OTP"
              : "Secure Your Account"}
          </Text>
          <Ionicon
            style={{
              marginTop: showOtpScreen ? 0 : -5,
              marginLeft: fromLoginScreen ? 5 : 0
            }}
            name={showOtpScreen ? "ios-arrow-back" : "ios-close"}
            color={"#707070"}
            size={showOtpScreen ? 30 : 35}
          />
        </NoFeedbackTapView>
        <ScrollView
          scrollEnabled={false}
          ref={ref => (this.scrollRef = ref)}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <View style={{ width: DeviceWidth, height: 100 }}>
            <RegularText style={styles.phoneLabel}>
              {fromLoginScreen ? "Your New Mobile Number" : "Phone Number"}
            </RegularText>
            <RowView style={styles.mobileNumberLayout}>
              <TouchableOpacity
                activeOpacity={0.4}
                onPress={() => this.goToCountryForm()}
                style={styles.countryCodeButton}
              >
                <Image
                  style={{ width: 24 }}
                  resizeMode={"contain"}
                  source={require("../../assets/images/india.png")}
                />
                {isLoading ? (
                  <ActivityIndicator
                    style={{
                      paddingHorizontal: 5
                    }}
                    color={PURPLE}
                    size={"small"}
                  />
                ) : (
                  <RegularText style={styles.countryCodeText}>
                    {" "}
                    +{selectedCountry}
                  </RegularText>
                )}
                <Ionicon
                  style={styles.dropArrowIcon}
                  color={FONT_GREY}
                  size={25}
                  name={"md-arrow-dropdown"}
                />
              </TouchableOpacity>
              <TextInput
                autoFocus={true}
                keyboardType={"number-pad"}
                style={styles.textInput}
                value={currentMobileInput}
                onChangeText={text =>
                  this.setState({ currentMobileInput: text })
                }
                maxLength={10}
                placeholder={"1234567890"}
              />
            </RowView>
            <RegularText
              style={{
                color: hasVerified || fromLoginScreen ? FONT_GREY : BRIGHT_RED,
                marginLeft: 20,
                marginTop: 10,
                textAlign: fromLoginScreen ? "center" : "left"
              }}
            >
              {fromLoginScreen
                ? "You need to add and verify your mobile number to continue using closerapp."
                : hasVerified
                ? "Verified phone number"
                : "To Keep your account secured, you need to verify your phone number."}
            </RegularText>
            <NoFeedbackTapView
              disabled={disabled}
              onPress={this.fetchAccountUsingPhoneNumber}
              style={{ ...styles.buttonStyle, marginTop: 20 }}
            >
              <VerticalGradientView
                style={styles.buttonStyle}
                colors={
                  disabled ? [NEW_GREY, NEW_GREY] : [PURPLE, LIGHT_PURPLE]
                }
              >
                {isNextLoading ? (
                  <ActivityIndicator color={"#fff"} size={"small"} />
                ) : (
                  <MediumText style={styles.buttonText}>
                    {hasVerified
                      ? "Update Phone Number"
                      : isPending
                      ? "Verification Under Progress"
                      : "Verify Phone Number"}
                  </MediumText>
                )}
              </VerticalGradientView>
            </NoFeedbackTapView>
          </View>
          <View
            style={{
              width: DeviceWidth
            }}
          >
            <RegularText style={styles.phoneLabel}>
              Enter your OTP code here
            </RegularText>

            <RowView style={styles.inputsRowView}>
              {Lodash.range(6).map(input => {
                return (
                  <VerticalGradientView
                    colors={
                      this.state.otpInput[input] === ""
                        ? [BACKGROUND_GREY, BACKGROUND_GREY]
                        : [PURPLE, LIGHT_PURPLE]
                    }
                    key={input}
                    style={styles.otpBoxGradient}
                  >
                    <TextInput
                      ref={`input_${input}`}
                      onChangeText={text => this.handleTextChange(input, text)}
                      style={styles.otpInput}
                      onKeyPress={evt => {
                        if (evt.nativeEvent.key === "Backspace") {
                          this.handleBackspacePress();
                        }
                      }}
                      keyboardType={"number-pad"}
                      maxLength={1}
                      autoFocus={input === 0}
                    />
                  </VerticalGradientView>
                );
              })}
            </RowView>

            <View style={{ alignItems: "center" }}>
              <RegularText style={styles.waitText}>
                Text to +{selectedCountry}
                {currentMobileInput} should arrive
                {"\n"} within 30 sec.
              </RegularText>
              <TouchableOpacity
                style={{
                  height: 40,
                  marginVertical: 20
                }}
                onPress={this.moveBack}
              >
                <MediumText style={{ color: "#F86430", fontSize: 18 }}>
                  Change Number
                </MediumText>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  height: 40
                }}
                disabled={!enableResendBtn}
                onPress={this.sendOtp}
              >
                <MediumText
                  style={{
                    color: enableResendBtn ? "#F86430" : FONT_GREY,
                    fontSize: 18
                  }}
                >
                  Resend OTP
                </MediumText>
              </TouchableOpacity>
              {!enableResendBtn && (
                <RegularText style={styles.waitText}>
                  Wait for {this.state.resendCounter} seconds to resend the otp.
                </RegularText>
              )}
              <NoFeedbackTapView
                onPress={this.verifyOtp}
                disabled={!enabledOtpSubmit}
                style={styles.buttonStyle}
              >
                <VerticalGradientView
                  style={styles.buttonStyle}
                  colors={
                    enabledOtpSubmit
                      ? [PURPLE, LIGHT_PURPLE]
                      : ["#cacaca", "#cacaca"]
                  }
                >
                  {submitLoading ? (
                    <ActivityIndicator
                      style={{
                        paddingHorizontal: 5
                      }}
                      color={"#fff"}
                      size={"small"}
                    />
                  ) : (
                    <Text style={styles.buttonText}>Submit</Text>
                  )}
                </VerticalGradientView>
              </NoFeedbackTapView>
            </View>
          </View>
        </ScrollView>
        <CountryPickerModal
          setCurrentCountryCode={selectedCountry => {
            this.setState({ selectedCountry });
          }}
          selectedCountry={selectedCountry}
          dismissCountryPickerModal={this.dismissCountryPickerModal}
          showModal={showModal}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  otpInput: {
    fontSize: 17,
    color: "#fff",
    fontWeight: "700",
    height: 40,
    // width: 30,
    alignSelf: "center",
    textAlign: "center"
  },
  otpBoxGradient: {
    borderRadius: 5,
    height: 40,
    width: 40,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 17,
    paddingVertical: 12
  },
  buttonStyle: {
    height: 50,
    width: DeviceWidth * 0.9,
    borderRadius: 30,
    alignSelf: "center",
    ...sharedStyles.justifiedCenter
  },
  phoneLabel: {
    fontSize: 14,
    color: FONT_GREY,
    marginLeft: LEFT_MARGIN * 1.25,
    marginVertical: LEFT_MARGIN / 2
  },
  waitText: {
    marginTop: 10,
    fontSize: 16,
    marginHorizontal: 20,
    textAlign: "center",
    lineHeight: 22
  },
  inputsRowView: {
    alignSelf: "center",
    marginBottom: 20
  },
  headerText: {
    fontSize: 23,
    color: "#1E2432",
    fontWeight: "600"
  },
  topRowView: {
    borderBottomColor: "#E4E5EA",
    borderBottomWidth: 0.5,
    paddingHorizontal: 20,
    marginVertical: 10
  },
  baseLayout: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    width: DeviceWidth,
    flex: 1,
    marginTop: DeviceHeight / 6
  },
  mobileNumberLayout: {
    height: 50,
    width: DeviceWidth * 0.9,
    backgroundColor: "#F1F2F6",
    borderRadius: 30,
    alignSelf: "center"
  },
  countryCodeButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: LEFT_MARGIN,
    borderRightColor: "#D2D5DBA0",
    borderRightWidth: 1
  },
  countryCodeText: {
    fontSize: 20,
    color: "#242E42"
  },
  dropArrowIcon: {
    marginHorizontal: 10,
    transform: [{ translateY: 2 }]
  },
  textInput: {
    paddingLeft: LEFT_MARGIN / 1.5,
    marginLeft: 0,
    alignSelf: "center",
    fontSize: 20,
    color: "#242E42",
    fontFamily: "Proxima Nova",
    flex: 1
  }
});

mapStates = state => {
  return {
    myData: state.info.userInfo
  };
};

const mapDispatches = dispatch => {
  return {
    addUserInfo: bindActionCreators(addUserInfo, dispatch)
  };
};
export default connect(mapStates, mapDispatches)(VerifyMobileModal);
