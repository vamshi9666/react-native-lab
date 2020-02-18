import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
  ActivityIndicator
} from "react-native";
import { LEFT_MARGIN } from "../../config/Constants";
import Ionicon from "react-native-vector-icons/Ionicons";
import BoldText from "../../components/Texts/BoldText";
import RegularText from "../../components/Texts/RegularText";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  FONT_GREY,
  NEW_GREY,
  PURPLE,
  LIGHT_PURPLE,
  BRIGHT_RED
} from "../../config/Colors";
import { DeviceWidth } from "../../config/Device";
import NoFeedbackTapView from "../../components/Views/NoFeedbackTapView";
import VerticalGradientView from "../../components/Views/VerticalGradientView";
import MediumText from "../../components/Texts/MediumText";
import { sharedStyles } from "../../styles/Shared";
import { validateEmail } from "../../config/Utils";
import * as userActions from "../../redux/actions/user.info";
import {
  helpCheckViaEmail,
  sendResetPasswordLinkToEmail
} from "../../network/auth";
import CloserModal from "../../components/Views/Closer.modal";
import ModalCurvedcard from "../../components/Views/Modal.curvedcard";

const codes = {
  200: "Please Check your Email Inbox",
  201: "User Email is not verified but mobile number is verified",
  202: "User has both email and mobile verified",
  203: "Email is not verified",
  204: "Email does not Exist"
};

class TroubleLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      errorText: "",
      attemptsCount: 0,
      isNextLoading: false,
      isModalVisible: false,
      halfMobileNumber: "",
      showHelpViaEmail: false
    };
  }

  goBack = () => {
    this.props.navigation.goBack();
  };

  checkUserExistance = () => {
    const { email } = this.state;

    this.setState({ isNextLoading: true });
    helpCheckViaEmail({ email: email.toLowerCase() }, cbData => {
      this.setState({ isNextLoading: false });
      if (cbData.success) {
        switch (cbData.code) {
          case 201:
            this.setState(
              {
                halfMobileNumber: cbData.data.mobile_number,
                showHelpViaEmail: false
              },
              () => {
                this.openCloserModal();
              }
            );
            break;

          case 202:
            this.setState(
              {
                halfMobileNumber: cbData.data.mobile_number,
                showHelpViaEmail: true
              },
              () => {
                this.openCloserModal();
              }
            );
            break;

          default:
            this.setState({
              errorText: codes[cbData.code]
            });
            break;
        }
      } else {
        // Handle error
      }
    });
  };

  openCloserModal = () => {
    this.setState({ isModalVisible: true });
    this.refs["modalRef"].toggleBg(true);
  };

  closeCloserModal = () => {
    this.setState({ isModalVisible: false });
    this.refs["modalRef"].startAnimation(false);
    setTimeout(() => {
      this.refs["modalRef"].toggleBg(false);
    }, 300);
  };

  takeToPasswordScreen = () => {
    this.closeCloserModal();
    this.props.addUserInfo("email", this.state.email);
    setTimeout(() => {
      this.props.navigation.push("login", {
        purpose: "LOGIN_VIA_EMAIL"
      });
    }, 300);
  };

  callAPItoGetEmail = () => {
    this.setState({ sendingEmail: true });
    sendResetPasswordLinkToEmail(
      {
        email: this.state.email
      },
      cbSentEmail => {
        this.setState({ sendingEmail: false });
        this.closeCloserModal();
      }
    );
  };

  render() {
    const {
      email,
      errorText,
      attemptsCount,
      isNextLoading,
      isModalVisible,
      halfMobileNumber,
      showHelpViaEmail
    } = this.state;
    const disabled = email === "" || !validateEmail(email);
    const hideError = errorText === "";
    const showOurEmail = attemptsCount === 3;

    return (
      <View style={styles.baseLayout}>
        <TouchableOpacity onPress={this.goBack} style={styles.backButtonStyle}>
          <Ionicon name={"ios-arrow-back"} size={30} color={"#000"} />
        </TouchableOpacity>
        <BoldText style={styles.headerText}>Trouble Signing In?</BoldText>
        <RegularText style={styles.topDesc}>
          We can assist you to recover your account, if you have verified your
          email with Closerapp.
        </RegularText>

        <TextInput
          value={email}
          keyboardType={"email-address"}
          style={styles.inputField}
          placeholder={"Email"}
          onChangeText={email => this.setState({ email, errorText: "" })}
        />

        <RegularText
          style={{
            opacity: hideError ? 0 : 1,
            ...styles.errorText
          }}
        >
          {errorText}
        </RegularText>

        <NoFeedbackTapView
          disabled={disabled}
          onPress={this.checkUserExistance}
          style={{ ...styles.buttonStyle, marginTop: 20 }}
        >
          <VerticalGradientView
            style={styles.buttonStyle}
            colors={disabled ? [NEW_GREY, NEW_GREY] : [PURPLE, LIGHT_PURPLE]}
          >
            {isNextLoading ? (
              <ActivityIndicator color={"#fff"} size={"small"} />
            ) : (
              <MediumText style={styles.buttonText}>Find my account</MediumText>
            )}
          </VerticalGradientView>
        </NoFeedbackTapView>

        <NoFeedbackTapView
          style={styles.ourEmailButton}
          onPress={this.takeToEmail}
        >
          {showOurEmail ? (
            <RegularText style={styles.ourEmailLeft}>
              Still Facing any issues?{" "}
              <RegularText style={styles.ourEmailRight}>
                Write to us.
              </RegularText>
            </RegularText>
          ) : (
            <View />
          )}
        </NoFeedbackTapView>
        <CloserModal isModalVisible={isModalVisible} ref={"modalRef"}>
          <ModalCurvedcard
            style={{
              padding: 20,
              width: DeviceWidth * 0.9
            }}
          >
            <View
              style={{
                alignItems: "flex-start"
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.closeCloserModal();
                }}
              >
                <Ionicon name={"ios-arrow-back"} size={30} color={FONT_GREY} />
              </TouchableOpacity>
              <MediumText
                style={{
                  textAlign: "center",
                  color: FONT_GREY,
                  fontSize: 17,
                  marginVertical: 10
                }}
              >
                You can try signing in with xxxxxx{halfMobileNumber}
              </MediumText>
              <NoFeedbackTapView
                disabled={disabled}
                onPress={this.takeToPasswordScreen}
                style={{ ...styles.buttonStyle, marginTop: 20 }}
              >
                <VerticalGradientView
                  style={styles.buttonStyle}
                  colors={[PURPLE, LIGHT_PURPLE]}
                >
                  <MediumText style={styles.buttonText}>
                    Tap to Login
                  </MediumText>
                </VerticalGradientView>
              </NoFeedbackTapView>

              {showHelpViaEmail ? (
                <NoFeedbackTapView
                  onPress={this.callAPItoGetEmail}
                  style={styles.buttonStyle}
                >
                  <MediumText
                    style={{
                      textAlign: "center",
                      color: FONT_GREY,
                      fontSize: 17,
                      marginVertical: 10
                    }}
                  >
                    Get Help via Email Anyways
                  </MediumText>
                </NoFeedbackTapView>
              ) : (
                <View />
              )}
            </View>
          </ModalCurvedcard>
        </CloserModal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  topDesc: {
    textAlign: "center",
    color: FONT_GREY,
    fontSize: 14
  },
  errorText: {
    color: BRIGHT_RED,
    textAlign: "center",
    marginVertical: 5
  },
  ourEmailButton: {
    height: 50,
    ...sharedStyles.justifiedCenter
  },
  ourEmailLeft: {
    color: FONT_GREY,
    fontSize: 15,
    textAlign: "center"
  },
  ourEmailRight: {
    textDecorationStyle: "solid",
    textDecorationColor: FONT_GREY,
    textDecorationLine: "underline"
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 17,
    paddingVertical: 12
  },
  buttonStyle: {
    height: 50,
    width: DeviceWidth * 0.8,
    borderRadius: 30,
    alignSelf: "center",
    ...sharedStyles.justifiedCenter
  },
  inputField: {
    padding: LEFT_MARGIN / 1.5,
    fontSize: 17,
    color: "#242E42",
    fontFamily: "Proxima Nova",
    borderWidth: 1,
    borderRadius: 30,
    alignSelf: "center",
    borderColor: "#00000020",
    marginTop: LEFT_MARGIN,
    width: DeviceWidth * 0.8
  },
  baseLayout: {
    flex: 1
  },
  backButtonStyle: {
    marginTop: Platform.OS === "ios" ? 40 : 20,
    alignSelf: "flex-start",
    marginLeft: LEFT_MARGIN,
    marginBottom: LEFT_MARGIN
  },
  headerText: {
    fontSize: 35,
    color: "#1E2432",
    fontWeight: "700",
    marginBottom: 15,
    marginLeft: LEFT_MARGIN
  }
});

const mapStateToProps = state => {
  return {
    userInfo: state.info.userInfo
  };
};

const mapDispatchToProps = dispatch => ({
  addUserInfo: bindActionCreators(userActions.addUserInfo, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(TroubleLogin);
