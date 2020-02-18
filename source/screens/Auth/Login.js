import React, { Component } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView
} from "react-native";
import Ionicon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { LIGHT_PURPLE } from "../../../src/config/Colors";
import { DeviceWidth } from "../../../src/config/Device";
import CloseButton from "../../components/Auth/Close.Button";
import BoldText from "../../components/Texts/BoldText";
import MediumText from "../../components/Texts/MediumText";
import RegularText from "../../components/Texts/RegularText";
import HorizontalGradientView from "../../components/Views/HorizontalGradientView";
import RowView from "../../components/Views/RowView";
import {
  FONT_GREY,
  greyTheme,
  PURPLE,
  FONT_BLACK,
  BACKGROUND_GREY
} from "../../config/Colors";
import { storeData } from "../../config/Storage";
import * as AuthActions from "../../network/auth";
import * as userActions from "../../redux/actions/user.info";
import { DeviceHeight } from "../../config/Device";
import { USER_STATES } from "../../config/Constants";
import { setUserState } from "../../redux/actions/userstate";
import { CachedImage } from "react-native-img-cache";

class Login extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      password: "",
      error: false,
      errorText: "Some Text",
      mobile_number: "",
      secureTextEntry: true,
      isModalVisible: false,
      isNextLoading: false,
      isSendingOtp: false,
      newPassword: "",
      newPasswordTwo: ""
    };
    this.scrollRef = React.createRef();
  }

  componentDidMount = () => {
    // firebase.logEvent("login2_login_did_mount");

    const {
      userInfo: { mobile_number }
    } = this.props;
    this.setState({ mobile_number });
  };

  showError = err => {
    this.setState({
      error: true,
      errorText: err
    });
  };

  resetPass = () => {
    const { newPassword, mobile_number } = this.state;
    console.log("user_id, password", mobile_number, newPassword);

    AuthActions.resetPassword(
      {
        user_id: mobile_number,
        new_password: newPassword
      },
      resetCb => {
        console.log("resetCb ", resetCb);
        if (resetCb.success) {
          this.login(true);
        }
      }
    );
  };

  loginViaEmail = () => {
    const { userInfo } = this.props;

    const { password } = this.state;

    let data = {
      id: userInfo.email,
      password
    };
    this.callLoginAPI(data);
  };

  login = afterReset => {
    const {
      navigation: {
        state: {
          params: { purpose }
        }
      }
    } = this.props;
    if (purpose === "LOGIN_VIA_EMAIL") {
      this.loginViaEmail();
    } else {
      const { password, mobile_number, newPassword } = this.state;
      let data = {
        id: mobile_number,
        password: afterReset ? newPassword : password
      };
      this.callLoginAPI(data);
    }
  };

  callLoginAPI = data => {
    this.setState({ isNextLoading: true });

    AuthActions.loginMethod(data, loginResponse => {
      this.setState({ isNextLoading: false });
      if (loginResponse.code === 400) {
        this.showError("Wrong password");
      } else if (loginResponse.code === 200) {
        storeData("USER_ID", loginResponse.data.userId);
        storeData("AUTH_TOKEN", loginResponse.data.token);
        storeData("LOGGED_IN", "true");
        console.log("loginResponse: ", loginResponse);
        this.props.setUserState(USER_STATES.OLD_USER);
        this.props.navigation.navigate("splash", {
          type: "SIGNIN"
        });
      } else {
        this.showError("Something went wrong");
      }
    });
  };

  sendOtp = () => {
    this.setState({ isSendingOtp: true });
    const {
      userInfo: { mobile_number }
    } = this.props;
    AuthActions.sendOtp({ mobile_number }, cbData => {
      if (cbData.success) {
        this.setState({ isSendingOtp: false, isModalVisible: false }, () => {
          this.props.navigation.push("verify", {
            purpose: "RESET"
          });
          setTimeout(() => {
            this.scrollRef.scrollTo({ x: DeviceWidth });
          }, 500);
        });
      } else {
        alert("Something went wrong while sending OTP");
      }
    });
  };

  forgotPassword = () => {
    this.setState({ isModalVisible: true });
  };

  render() {
    const {
      password,
      error,
      errorText,
      secureTextEntry,
      isNextLoading,
      isModalVisible,
      isSendingOtp,
      newPasswordTwo,
      newPassword
    } = this.state;

    const {
      navigation: {
        state: {
          params: { purpose }
        }
      }
    } = this.props;

    const colors =
      password.length > 5 ? [PURPLE, LIGHT_PURPLE] : ["#cacaca", "#cacaca"];

    const resetColors =
      newPassword.length > 5 && newPassword === newPasswordTwo
        ? [PURPLE, LIGHT_PURPLE]
        : ["#cacaca", "#cacaca"];
    return (
      <View style={styles.baseLayout}>
        <Modal
          transparent
          visible={isModalVisible}
          animated
          animationType={"slide"}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "#000000B9",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <View
              style={{
                width: DeviceWidth * 0.9,
                borderRadius: 20,
                backgroundColor: "#fff",
                height: DeviceHeight * 0.4,
                justifyContent: "space-evenly"
              }}
            >
              <MediumText
                style={{
                  color: FONT_BLACK,
                  fontSize: 28,
                  textAlign: "center"
                }}
              >
                Forgot Password ?
              </MediumText>
              <RegularText
                style={{
                  color: FONT_BLACK,
                  fontSize: 20,
                  textAlign: "center",
                  paddingHorizontal: 20
                }}
              >
                To reset the password, you will need to verify your number. Send
                an OTP?
              </RegularText>
              <HorizontalGradientView
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: DeviceWidth * 0.7,
                  borderRadius: 30,
                  alignSelf: "center"
                }}
                colors={[PURPLE, LIGHT_PURPLE]}
              >
                <TouchableOpacity
                  disabled={isSendingOtp}
                  onPress={this.sendOtp}
                  style={{ padding: 10 }}
                >
                  {isSendingOtp ? (
                    <ActivityIndicator size={"small"} color={"#fff"} />
                  ) : (
                    <MediumText
                      style={{
                        fontSize: 20,
                        color: "#fff"
                      }}
                    >
                      Send OTP
                    </MediumText>
                  )}
                </TouchableOpacity>
              </HorizontalGradientView>
              <TouchableOpacity
                onPress={() => this.setState({ showOtpModal: false })}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: FONT_GREY,
                  borderRadius: 30,
                  alignSelf: "center",
                  width: DeviceWidth * 0.7
                }}
              >
                <MediumText
                  style={{
                    fontSize: 20,
                    color: FONT_BLACK,
                    padding: 10
                  }}
                >
                  Cancel
                </MediumText>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <CloseButton
          iconName={"ios-arrow-back"}
          action={() => this.props.navigation.goBack()}
        />
        <CachedImage source={require("../../assets/images/Applogo.png")} />
        <ScrollView
          ref={ref => (this.scrollRef = ref)}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          contentOffset={{ x: purpose === "RESET" ? DeviceWidth : 0 }}
        >
          <View
            style={{
              width: DeviceWidth,
              alignItems: "center"
            }}
          >
            <BoldText
              style={{
                color: "#060518",
                textAlign: "center",
                fontSize: 35,
                marginTop: 15
              }}
            >
              Login
            </BoldText>
            <RegularText
              style={{
                color: "#060518",
                textAlign: "center",
                fontSize: 18,
                marginTop: 20,
                paddingHorizontal: 20
              }}
            >
              Welcome back to closer fill out your Password and you’ll be closer
              in no time
            </RegularText>

            <RegularText
              style={{
                color: error ? "#FF0000" : "#fff",
                fontSize: 18,
                marginVertical: 22
              }}
            >
              {errorText}
            </RegularText>

            <RowView
              style={{
                height: 50,
                width: DeviceWidth * 0.9,
                backgroundColor: "#F1F2F6",
                borderRadius: 30,
                alignItems: "center",
                borderWidth: 1,
                borderColor: error ? "#FF0000" : "#0000"
              }}
            >
              <TextInput
                style={styles.inputField}
                secureTextEntry={secureTextEntry}
                value={password}
                placeholder={"Enter password"}
                onChangeText={text =>
                  this.setState({ password: text, error: false })
                }
              />
              <Ionicon
                onPress={() =>
                  this.setState({
                    secureTextEntry: !secureTextEntry
                  })
                }
                style={{
                  marginHorizontal: 20
                }}
                name={secureTextEntry ? "ios-eye" : "ios-eye-off"}
                size={25}
                color={FONT_GREY}
              />
            </RowView>
            <TouchableOpacity
              style={{
                alignSelf: "flex-start",
                marginTop: 20
              }}
              onPress={() => this.forgotPassword()}
            >
              <RegularText
                style={{
                  fontSize: 18,
                  color: "#060518",
                  marginLeft: DeviceWidth * 0.1
                }}
              >
                Forgot Password?
              </RegularText>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={password.length < 6}
              onPress={() => this.login()}
            >
              <HorizontalGradientView
                colors={colors}
                style={styles.nextButtonView}
              >
                {isNextLoading ? (
                  <ActivityIndicator color={"#fff"} size={"small"} />
                ) : (
                  <MediumText style={styles.nextText}>Next</MediumText>
                )}
              </HorizontalGradientView>
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: DeviceWidth,
              alignItems: "center"
            }}
          >
            <BoldText
              style={{
                color: "#060518",
                textAlign: "center",
                fontSize: 35,
                marginTop: 15
              }}
            >
              Reset Password
            </BoldText>
            <View style={styles.resetInputView}>
              <TextInput
                secureTextEntry={true}
                style={styles.input}
                value={newPassword}
                placeholderTextColor={FONT_GREY}
                placeholder={"Enter your new password"}
                onChangeText={newPassword => {
                  this.setState({ newPassword });
                }}
              />
            </View>
            <View style={styles.resetInputView}>
              <TextInput
                secureTextEntry={true}
                style={styles.input}
                value={newPasswordTwo}
                placeholderTextColor={FONT_GREY}
                placeholder={"Re-Enter your new password"}
                onChangeText={newPasswordTwo => {
                  this.setState({ newPasswordTwo });
                }}
              />
            </View>
            <TouchableOpacity
              disabled={
                newPassword.length < 6 || newPassword !== newPasswordTwo
              }
              onPress={() => this.resetPass()}
            >
              <HorizontalGradientView
                colors={resetColors}
                style={styles.nextButtonView}
              >
                {isNextLoading ? (
                  <ActivityIndicator color={"#fff"} size={"small"} />
                ) : (
                  <MediumText style={styles.nextText}>
                    Reset and Login
                  </MediumText>
                )}
              </HorizontalGradientView>
            </TouchableOpacity>
            {newPasswordTwo === "" && newPasswordTwo === newPassword ? (
              <View />
            ) : (
              <RegularText
                style={{
                  color: "#FF0000",
                  fontSize: 18,
                  marginVertical: 22,
                  textAlign: "center"
                }}
              >
                Above passwords do not match
              </RegularText>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  resetInputView: {
    marginVertical: 10,
    height: 48,
    backgroundColor: BACKGROUND_GREY,
    borderRadius: 24,
    marginHorizontal: 26,
    justifyContent: "center",
    width: DeviceWidth * 0.8
  },
  input: {
    fontFamily: "Proxima Nova",
    paddingLeft: 15,
    fontSize: 16,
    textAlign: "left",
    textAlignVertical: "center"
  },
  nextButtonView: {
    height: 50,
    width: DeviceWidth * 0.8,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20
  },
  nextText: {
    fontSize: 20,
    color: "#fff"
  },
  baseLayout: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center"
  },
  loginText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 25,
    color: greyTheme,
    marginTop: 20
  },
  descriptionText: {
    textAlign: "center",
    fontSize: 14,
    color: greyTheme,
    margin: 10
  },
  inputField: {
    fontSize: 20,
    color: "#242E42",
    marginLeft: 20,
    flex: 1
  },
  errorText: {
    textAlign: "center",
    color: "red",
    marginTop: 5
  }
});

const mapStatetoProps = state => {
  return {
    userInfo: state.info.userInfo
  };
};

const mapDispatchToProps = dispatch => ({
  addUserInfo: bindActionCreators(userActions.addUserInfo, dispatch),
  setUserState: bindActionCreators(setUserState, dispatch)
});

export default connect(mapStatetoProps, mapDispatchToProps)(Login);
