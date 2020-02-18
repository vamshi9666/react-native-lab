import Lodash from "lodash";
import React from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import CloseButton from "../../components/Auth/Close.Button";
import BoldText from "../../components/Texts/BoldText";
import MediumText from "../../components/Texts/MediumText";
import RegularText from "../../components/Texts/RegularText";
import HorizontalGradientView from "../../components/Views/HorizontalGradientView";
import RowView from "../../components/Views/RowView";
import VerticalGradientView from "../../components/Views/VerticalGradientView";
import {
  BACKGROUND_GREY,
  FONT_GREY,
  LIGHT_PURPLE,
  PURPLE
} from "../../config/Colors";
import { LEFT_MARGIN } from "../../config/Constants";
import { DeviceHeight, DeviceWidth } from "../../config/Device";
import { retrieveData, storeData } from "../../config/Storage";
import * as AuthActions from "../../network/auth";
import * as authApi from "../../network/auth";
class VerifyMobile extends React.Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      mobile_number: "",
      error: false,
      errorText: "",
      otp: "",
      currentInput: 0,
      isLoading: false,
      message: "",
      0: "",
      1: "",
      2: "",
      3: "",
      4: "",
      5: "",
      otpInput: ["", "", "", "", "", ""],
      resendCounter: 30
    };
  }

  showError = err => {
    this.setState({
      error: true,
      errorText: err
    });
    setTimeout(() => {
      this.setState({ error: false, errorText: "" });
    }, 2500);
  };

  resendOTP = () => {
    const { mobile_number = "" } = this.props.userInfo;
    if (mobile_number === "") {
      this.props.navigation.goBack();
    } else {
      authApi.sendOtp({ mobile_number }, cb => {
        if (cb.success) {
          this.setState({
            message: "Resent otp to " + mobile_number
          });
        }
      });
    }
  };

  navigationHandler = () => {
    const {
      navigation: {
        state: {
          params: { purpose }
        }
      },
      userInfo: { mobile_number }
    } = this.props;
    if (purpose === "RESET") {
      this.props.navigation.navigate("login", { purpose });
    } else {
      storeData("MOBILE", mobile_number);
      this.props.navigation.navigate("signup");
    }
  };

  verifyOTP = () => {
    const { otpInput } = this.state;
    const otp = otpInput.join("");
    console.log(" otp is ", otp);
    // return;
    const { mobile_number } = this.props.userInfo;
    let data = { otp, mobile_number };
    AuthActions.verifyOtp(data, cbData => {
      console.log("cbData is: ", cbData);
      storeData("MOBILE", mobile_number);
      if (cbData.code === 200) {
        this.navigationHandler();
      } else if (cbData.code === 202) {
        // OTP already verified
        this.navigationHandler();
      } else if (cbData.code === 203) {
        // OTP has expired
        alert("OTP expired");
      } else if (cbData.code === 400) {
        alert("OTP is not matching");
      }
    });
  };

  verifyOTPOld = () => {
    retrieveData("MOBILE").then(mobile_number => {
      if (mobile_number) {
        this.setState({ mobile_number: mobile_number, isLoading: true });
        this.props
          .verifyOTP({ mobile_number: mobile_number, otp: this.state.otp })
          .then(() => {
            this.setState({ isLoading: false });
            const { verifyOTPResponse } = this.props;
            if (verifyOTPResponse.code === 200) {
              // OTP success

              const isResettingPassword = this.props.navigation.getParam(
                "isDuringResetPassword",
                false
              );
              if (isResettingPassword) {
                this.props.navigation.navigate("ResetPassword");
              } else {
                this.props.navigation.navigate("CreateAccount");
              }
            } else if (verifyOTPResponse.code === 202) {
              // OTP already verified
              this.props.navigation.navigate("CreateAccount");
            } else if (verifyOTPResponse.code === 203) {
              // OTP has expired
              this.showError("OTP has expired. Please request a new one.");
            } else if (verifyOTPResponse.code === 400) {
              this.showError("OTP is not matching");
            }
            console.log("this.props: ", this.props.verifyOTPResponse);
          })
          .catch(err => {
            this.showError(err);
          });
      }
    });
    // this.props.navigation.navigate("CreateAccount");
  };

  changeMobileNumber = () => {
    this.props.navigation.goBack();
    // this.props.navigation.navigate("MobileInput");
  };

  componentDidMount = () => {
    this.resendInterval = setInterval(() => {
      if (this.state.resendCounter > 0) {
        this.setState(
          prevState => {
            // console.log(" prev value is ", prevState.resendCounter);
            return {
              resendCounter: prevState.resendCounter - 1
            };
          },
          () => {
            // console.log(" new value is ", this.state.resendCounter);
          }
        );
      }
    }, 1000);
    // firebase.logEvent("login5_otp_verify_did_mount");
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
    console.log(" called this ");
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
  componentWillUnmount = () => {
    clearInterval(this.resendInterval);
  };

  render() {
    const {
      navigation,
      userInfo: { mobile_number, country = "" }
    } = this.props;
    const {
      isLoading,
      error,
      errorText,
      otpInput,
      currentInput,
      message
    } = this.state;
    const otp = [];
    const nextButtonEnabled = otpInput.filter(i => i !== "").length > 5;
    const colors = nextButtonEnabled
      ? [PURPLE, LIGHT_PURPLE]
      : ["#cacaca", "#cacaca"];
    const enableResendBtn = this.state.resendCounter === 0;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          width: DeviceWidth,
          height: DeviceHeight
        }}
      >
        <CloseButton
          action={() => this.props.navigation.goBack()}
          iconName={"ios-arrow-back"}
        />

        <View
          style={{
            marginLeft: LEFT_MARGIN,
            marginTop: LEFT_MARGIN
          }}
        >
          <BoldText style={{ fontSize: 34 }}>Phone Verification</BoldText>
          <RegularText
            style={{ fontSize: 16, marginTop: LEFT_MARGIN, color: FONT_GREY }}
          >
            Enter your OTP code here
          </RegularText>
        </View>

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
                style={{
                  borderRadius: 5,
                  height: 50,
                  width: 50,
                  marginHorizontal: 5,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <TextInput
                  ref={`input_${input}`}
                  // onChange={e => e.nativeEvent.}
                  onChangeText={text => this.handleTextChange(input, text)}
                  style={{
                    fontSize: 23,
                    color: "#fff",
                    fontWeight: "700",
                    height: 50,
                    width: 30,
                    alignSelf: "center",
                    textAlign: "center"
                  }}
                  onKeyPress={evt => {
                    if (evt.nativeEvent.key === "Backspace") {
                      this.handleBackspacePress();
                    }
                  }}
                  keyboardType={"number-pad"}
                  maxLength={1}
                  // autoFocus={input === 0}
                />
              </VerticalGradientView>
            );
          })}
        </RowView>

        <View style={{ alignItems: "center" }}>
          <RegularText
            style={{
              marginTop: 0,
              fontSize: 16,
              marginHorizontal: 20,
              textAlign: "center",
              lineHeight: 22
            }}
          >
            Text to +{country.code} {mobile_number} should arrive{"\n"} within
            30 sec.
          </RegularText>
          <TouchableOpacity
            style={{
              height: 40,
              marginTop: 10
            }}
            onPress={() => {
              this.changeMobileNumber();
              // console.log(" this.state is ", this.state);
            }}
          >
            <MediumText style={{ color: "#F86430", fontSize: 18 }}>
              Change Number
            </MediumText>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              height: 40,
              marginTop: 10
            }}
            disabled={!enableResendBtn}
            onPress={() => {
              this.resendOTP();
              // console.log(" this.state is ", this.state);
            }}
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
            <RegularText
              style={{
                marginTop: 10,
                fontSize: 16,
                marginHorizontal: 20,
                textAlign: "center",
                lineHeight: 22
              }}
            >
              Wait for {this.state.resendCounter} seconds to resend the otp.
            </RegularText>
          )}
        </View>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={"position"}
        >
          <TouchableOpacity
            // disabled={!nextButtonEnabled}
            onPress={() => {
              // console.log(" otp result is ", otpInput);
              this.verifyOTP();
            }}
          >
            <HorizontalGradientView
              colors={colors}
              style={styles.nextButtonView}
            >
              <MediumText style={styles.nextText}>Next</MediumText>
            </HorizontalGradientView>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputsRowView: {
    alignSelf: "center",
    marginBottom: 20,
    marginTop: LEFT_MARGIN * 2.5
  },
  keyboardAvoidingView: {
    position: "absolute",
    bottom: 0
  },
  nextButtonView: {
    height: 50,
    width: DeviceWidth,
    alignItems: "center",
    justifyContent: "center"
  },
  nextText: {
    fontSize: 20,
    color: "#fff"
  }
});

const mapStateToProps = state => {
  return {
    userInfo: state.info.userInfo
  };
};

const mapDispatchToProps = dispatch => ({
  checkUser: bindActionCreators(AuthActions.checkUserExistanceMethod, dispatch),
  verifyOTP: bindActionCreators(AuthActions.verifyOtp, dispatch),
  confirmedToSendOtp: bindActionCreators(AuthActions.sendOtp, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(VerifyMobile);
