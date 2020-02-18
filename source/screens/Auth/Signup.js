import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator
} from "react-native";
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager
} from "react-native-fbsdk";
import Ionicon from "react-native-vector-icons/Ionicons";
import MatComIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  BRIGHT_RED,
  greyTheme,
  NEW_GREY,
  PURPLE,
  LIGHT_PURPLE,
  BLUE,
  FONT_GREY,
  GREEN
} from "../../config/Colors";
import { DeviceWidth, DeviceHeight } from "../../config/Device";
import {
  retrieveData,
  setMultiple,
  storeData,
  deleteData
} from "../../config/Storage";
import * as AuthActions from "./../../network/auth";
import { validateReferralCode } from "../../network/user";
import { FONT_BLACK } from "../../../src/config/Colors";
import MediumText from "../../components/Texts/MediumText";
import RegularText from "../../components/Texts/RegularText";
import CloseButton from "../../components/Auth/Close.Button";
import { LEFT_MARGIN } from "../../config/Constants";
import NoFeedbackTapView from "../../components/Views/NoFeedbackTapView";
import CloserModal from "../../components/Views/Closer.modal";
import ModalCurvedcard from "../../components/Views/Modal.curvedcard";
import HorizontalGradientView from "../../components/Views/HorizontalGradientView";
import { sharedStyles } from "../../styles/Shared";
import BoldText from "../../components/Texts/BoldText";
import { setReferralCode } from "../../redux/actions/tutorials";

let fbAccessToken;

class SignUp extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      hasSubmitedCode: false,
      isModalVisible: false,
      isLoading: false
    };
  }
  componentDidMount = () => {
    // firebase.logEvent("login6_create_account_did_mount");
  };

  createAccount = () => {
    this.props.navigation.navigate("userinfo");
  };

  _responseInfoCallback = async (error, result) => {
    if (error) {
      console.log("Error fetching data: ", error);
    } else {
      this.props
        .facebookLogin({ ...result, fb_token: fbAccessToken })
        .then(async () => {
          const { facebookLoginResult } = this.props;
          console.log(" facebook login result is :::", facebookLoginResult);
          storeData("AUTH_TOKEN", facebookLoginResult.data.token);
          if (facebookLoginResult.success) {
            const mobile_number = await retrieveData("MOBILE");
            this.props.updateUser({ mobile_number }).then(() => {
              const { updateUserResult } = this.props;
              console.log(" update user result is ::::", updateUserResult);

              setMultiple([
                ["AUTH_TOKEN", facebookLoginResult.data.token],
                ["USER_ID", facebookLoginResult.data.userId]
              ]).then(() => {
                this.props.navigation.navigate("Landing");
              });
            });
          }
        });

      console.log("Success fetching data: ", result);
    }
  };

  facebookSignin = () => {
    LoginManager.logInWithReadPermissions([
      "public_profile",
      "email",
      "user_birthday",
      "user_friends",
      "user_gender"
    ]).then(async result => {
      if (result.isCancelled) {
      } else {
        AccessToken.getCurrentAccessToken().then(data => {
          fbAccessToken = data.accessToken;
          const infoRequest = new GraphRequest(
            "/me?",
            {
              accessToken: fbAccessToken,
              parameters: {
                fields: {
                  string: "id,gender,birthday,first_name,email"
                }
              }
            },

            this._responseInfoCallback
          );

          new GraphRequestManager().addRequest(infoRequest).start();
        });
      }
    });
  };

  goBack = () => {
    deleteData("MOBILE");
    this.props.navigation.navigate("slides");
  };

  showReferralCodeInput = () => {
    this.openCloserModal();
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

  submitReferralCode = () => {
    this.setState({ isLoading: true });
    const { code } = this.state;
    validateReferralCode(code, cbData => {
      this.setState({ isLoading: false });
      if (cbData.success) {
        this.setState({ hasSubmitedCode: true }, () => {
          this.props.setReferralCode(code);
          this.closeCloserModal();
        });
      } else {
        alert(cbData.message);
      }
    });
  };

  renderCloserModal = () => {
    const { isModalVisible, code, isLoading } = this.state;

    return (
      <CloserModal isModalVisible={isModalVisible} ref={"modalRef"}>
        <ModalCurvedcard>
          <BoldText style={styles.modalHeader}>
            Enter your Referral Code
          </BoldText>
          <TextInput
            value={code}
            onChangeText={code => this.setState({ code })}
            placeholder={"Referral code"}
            style={styles.textInput}
          />
          <NoFeedbackTapView
            disabled={code === ""}
            onPress={this.submitReferralCode}
          >
            <HorizontalGradientView
              colors={
                code === "" ? ["#cacaca", "#cacaca"] : [PURPLE, LIGHT_PURPLE]
              }
              style={styles.submitButton}
            >
              {isLoading ? (
                <ActivityIndicator size={"small"} color={"#fff"} />
              ) : (
                <MediumText
                  style={{
                    fontSize: 20,
                    color: "#fff"
                  }}
                >
                  Submit
                </MediumText>
              )}
            </HorizontalGradientView>
          </NoFeedbackTapView>

          <NoFeedbackTapView
            style={{
              height: 50,
              ...sharedStyles.justifiedCenter
            }}
            onPress={() => this.closeCloserModal()}
          >
            <MediumText
              style={{
                fontSize: 20,
                color: FONT_BLACK
              }}
            >
              Cancel
            </MediumText>
          </NoFeedbackTapView>
        </ModalCurvedcard>
      </CloserModal>
    );
  };

  render() {
    const { hasSubmitedCode } = this.state;

    return (
      <View style={styles.baseLayout}>
        {this.renderCloserModal()}
        <CloseButton iconName={"md-close"} action={this.goBack} />
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: DeviceHeight * 0.05,
            marginBottom: 50
          }}
        >
          <Ionicon name={"ios-color-filter"} size={120} color={"#000"} />

          <MediumText style={styles.headerText}>
            Let'S Create Your {"\n"} New Account
          </MediumText>
        </View>
        <TouchableOpacity
          onPress={this.createAccount}
          style={{
            height: 48,
            width: DeviceWidth * 0.8,
            backgroundColor: BRIGHT_RED,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 24
          }}
        >
          <RegularText
            style={{
              // flex: 1,
              fontSize: 18,
              fontWeight: "600",
              color: "#fff"
            }}
          >
            Get Started
          </RegularText>
        </TouchableOpacity>

        {/* <Button action={() => this.createAccount()} text={"GET STARTED"} /> */}
        <View style={styles.line}>
          <Text style={styles.or}>OR</Text>
        </View>
        <RegularText
          style={{
            fontSize: 18,
            color: "#1E2432",
            marginVertical: 8
          }}
        >
          Already have an account
        </RegularText>
        <TouchableOpacity
          style={{
            height: 48,
            width: DeviceWidth * 0.8,
            backgroundColor: "rgb(81,33,248)",
            justifyContent: "center",
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 24
          }}
        >
          <MatComIcon name="facebook" size={24} color={"#fff"} />
          <RegularText
            style={{
              color: "#fff",
              fontSize: 16,
              fontWeight: "500",
              marginLeft: 20
            }}
          >
            {" "}
            Login With Facebook{" "}
          </RegularText>
        </TouchableOpacity>

        <NoFeedbackTapView
          disabled={hasSubmitedCode}
          onPress={this.showReferralCodeInput}
          style={{
            position: "absolute",
            bottom: LEFT_MARGIN
          }}
        >
          <BoldText
            style={{
              color: hasSubmitedCode ? FONT_GREY : BLUE,
              fontSize: 15,
              textAlign: "center"
            }}
          >
            Have a Referral Code?
          </BoldText>
          {hasSubmitedCode ? (
            <MediumText style={styles.appliedText}>Applied!</MediumText>
          ) : (
            <View />
          )}
        </NoFeedbackTapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalHeader: {
    color: FONT_BLACK,
    fontSize: 20,
    textAlign: "center",
    marginRight: 10,
    marginBottom: 10
  },
  textInput: {
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#00000010",
    borderRadius: 30,
    height: 40,
    width: "90%",
    alignSelf: "center"
  },
  submitButton: {
    height: 50,
    width: DeviceWidth * 0.6,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: LEFT_MARGIN,
    borderRadius: 30
  },
  appliedText: {
    color: GREEN,
    fontSize: 14,
    textAlign: "center",
    marginTop: 5
  },
  headerText: {
    textAlign: "center",
    fontWeight: "500",
    marginHorizontal: 20,
    fontSize: 30,
    color: FONT_BLACK,
    marginTop: 20,
    marginBottom: 10
  },
  baseLayout: {
    height: DeviceHeight,
    width: DeviceWidth,
    alignSelf: "center",
    alignItems: "center"
  },
  dontWorryText: {
    textAlign: "center",
    color: greyTheme
  },
  bodyHeight: {
    height: DeviceHeight * 0.3
  },
  line: {
    borderBottomColor: "rgba(0,0,0,0.5)",
    marginVertical: 16,
    borderBottomWidth: 1,
    alignItems: "center",
    width: DeviceWidth * 0.85
  },
  or: {
    backgroundColor: "white",
    marginBottom: -15,
    paddingHorizontal: 20,
    color: "#202E75",
    fontWeight: "500",
    fontSize: 18
  }
});

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    checkUser: bindActionCreators(
      AuthActions.checkUserExistanceMethod,
      dispatch
    ),
    facebookLogin: bindActionCreators(AuthActions.facebookLogin, dispatch),
    updateUser: bindActionCreators(AuthActions.updateProfile, dispatch),
    setReferralCode: bindActionCreators(setReferralCode, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
