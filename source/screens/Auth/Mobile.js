import React, { Component } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Modal,
  ActivityIndicator,
  FlatList
} from "react-native";
import Ionicon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import BoldText from "../../components/Texts/BoldText";
import MediumText from "../../components/Texts/MediumText";
import RegularText from "../../components/Texts/RegularText";
import HorizontalGradientView from "../../components/Views/HorizontalGradientView";
import {
  FONT_GREY,
  LIGHT_PURPLE,
  PURPLE,
  FONT_BLACK
} from "../../config/Colors";
import { LEFT_MARGIN, USER_STATES } from "../../config/Constants";
import { DeviceWidth, DeviceHeight } from "../../config/Device";
import * as authApi from "../../network/auth";
import * as userActions from "../../redux/actions/user.info";
import RowView from "../../components/Views/RowView";
import Countries from "../../config/Countries";
import CountryPickerModal from "../../components/Auth/Country.picker.modal";
import { sharedStyles } from "../../styles/Shared";
import VerifyMobileModal from "../../components/Settings/VerifyMobile.modal";
import CloserModal from "../../components/Views/Closer.modal";
import ModalCurvedcard from "../../components/Views/Modal.curvedcard";
import { setUserState } from "../../redux/actions/userstate";
import { storeData } from "../../config/Storage";
const { OS } = Platform;

class Mobile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile_number: "",
      showModal: false,
      isLoading: false,
      cQuery: "",
      countries: Countries,
      isNextLoading: false,
      showOtpModal: false,
      isSendingOtp: false,
      isModalVisible: false
    };
  }

  sendOtp = () => {
    const { mobile_number } = this.state;
    let data = {
      mobile_number
    };
    this.setState({ isSendingOtp: true });
    authApi.sendOtp(data, cb => {
      if (cb.success) {
        this.closeCloserModal();
        this.setState({ isSendingOtp: false, showOtpModal: false }, () => {
          setTimeout(() => {
            this.props.navigation.navigate("verify", {
              purpose: "SIGNUP"
            });
          }, 400);
        });
      }
    });
  };

  checkUserExistance = () => {
    const { mobile_number } = this.state;
    let data = {
      mobile_number
    };
    this.setState({ isNextLoading: true });
    this.props.addUserInfo("mobile_number", mobile_number);
    authApi.checkUserExistanceMethod(mobile_number, cbData => {
      this.setState({ isNextLoading: false });
      if (cbData.success) {
        switch (cbData.code) {
          case 200:
            this.props.navigation.navigate("login", {
              purpose: "LOGIN"
            });
            break;

          case 201:
            this.setState({ showVerifyMobileModal: true });
            this.openCloserModal();
            break;

          case 202:
            alert(cbData.message);
            break;

          case 203:
            alert(cbData.message);
            break;

          case 204:
            this.setState({ showOtpModal: true });
            this.openCloserModal();
            break;

          default:
            break;
        }
      } else {
        // Handle error
      }
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

  goBack = () => {
    this.props.navigation.goBack();
  };

  handleSearch = cQuery => {
    // console.log(isNaN(cQuery));
    let queryText;
    if (isNaN(cQuery)) {
      queryText = cQuery.toLowerCase().replace(/,|\.|-/g, " ");
    } else {
      queryText = cQuery.replace(/,|\.|-/g, " ");
    }

    const queryWords = queryText.split(" ").filter(w => !!w.trim().length);
    let searchedCountries = [];
    Countries.forEach(cntry => {
      queryWords.forEach(queryWord => {
        if (isNaN(cQuery)) {
          if (cntry.name.toLowerCase().indexOf(queryWord) > -1) {
            searchedCountries.push(cntry);
          }
        } else {
          if (cntry.code.toString().indexOf(queryWord) > -1) {
            searchedCountries.push(cntry);
          }
        }
      });
    });
    this.setState({
      cQuery,
      countries: cQuery ? searchedCountries : Countries
    });
  };

  dismissCountryPickerModal = () => {
    this.setState({ showModal: false, isLoading: false });
  };

  navigateToTroublePage = () => {
    this.props.navigation.push("troubleLogin");
  };

  dismissVerifyMobileModal = loggedIn => {
    this.closeCloserModal();
    this.setState({ showVerifyMobileModal: false }, () => {
      if (loggedIn) {
        this.props.setUserState(USER_STATES.OLD_USER);
        this.props.navigation.navigate("splash", {
          type: "SIGNIN"
        });
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

  render() {
    const {
      mobile_number,
      showModal,
      isLoading,
      cQuery,
      countries,
      isNextLoading,
      showOtpModal,
      isSendingOtp,
      isModalVisible,
      showVerifyMobileModal
    } = this.state;
    const nextButtonEnabled = mobile_number.length > 9;
    const colors = nextButtonEnabled
      ? [PURPLE, LIGHT_PURPLE]
      : ["#cacaca", "#cacaca"];
    const {
      addUserInfo,
      userInfo: { country }
    } = this.props;

    return (
      <View style={styles.baseLayout}>
        <TouchableOpacity onPress={this.goBack} style={styles.backButtonStyle}>
          <Ionicon name={"ios-arrow-back"} size={30} color={"#000"} />
        </TouchableOpacity>
        <BoldText style={styles.headerText}>What's your phone number?</BoldText>
        <RegularText style={styles.descText}>
          Whether you’re creating an account or signing back in, let’s start
          with your number
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
              <RegularText style={styles.countryCodeText}> +{91}</RegularText>
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
            value={mobile_number}
            onChangeText={text => this.setState({ mobile_number: text })}
            maxLength={10}
            placeholder={"1234567890"}
          />
        </RowView>
        <TouchableOpacity
          style={{
            width: DeviceWidth * 0.4,
            ...sharedStyles.justifiedCenter,
            height: 50,
            marginLeft: 10
          }}
          onPress={this.navigateToTroublePage}
        >
          <RegularText style={{ color: FONT_GREY }}>
            Trouble signing in?
          </RegularText>
        </TouchableOpacity>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={"position"}
        >
          <TouchableOpacity
            style={styles.nextButtonView}
            disabled={!nextButtonEnabled}
            onPress={() => this.checkUserExistance()}
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
        </KeyboardAvoidingView>

        <CountryPickerModal
          dismissCountryPickerModal={this.dismissCountryPickerModal}
          showModal={showModal}
        />
        <CloserModal isModalVisible={isModalVisible} ref={"modalRef"}>
          {showOtpModal ? (
            <ModalCurvedcard
              style={{
                width: DeviceWidth * 0.9
              }}
            >
              <MediumText
                style={{
                  ...styles.btnTextStyle,
                  textAlign: "center"
                }}
              >
                Verify your Number
              </MediumText>
              <RegularText
                style={{
                  ...styles.btnTextStyle,
                  textAlign: "center",
                  padding: 20
                }}
              >
                To create an account, you will receive an OTP to this number.
                Send an OTP?
              </RegularText>
              <HorizontalGradientView
                style={styles.buttonStyle}
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
                onPress={() => {
                  this.closeCloserModal();
                  this.setState({ showOtpModal: false });
                }}
                style={{
                  ...styles.buttonStyle,
                  borderWidth: 1,
                  borderColor: FONT_GREY,
                  padding: 15
                }}
              >
                <MediumText style={styles.btnTextStyle}>Cancel</MediumText>
              </TouchableOpacity>
            </ModalCurvedcard>
          ) : showVerifyMobileModal ? (
            <VerifyMobileModal
              oldLoginID={this.state.mobile_number}
              fromLoginScreen={true}
              dismissVerifyMobileModal={this.dismissVerifyMobileModal}
            />
          ) : (
            <View />
          )}
        </CloserModal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonStyle: {
    alignItems: "center",
    justifyContent: "center",
    width: DeviceWidth * 0.7,
    borderRadius: 30,
    alignSelf: "center",
    marginVertical: 10,
    padding: 5
  },
  btnTextStyle: {
    fontSize: 20,
    color: FONT_BLACK
  },
  searchLayout: {
    height: 40,
    width: DeviceWidth * 0.98,
    backgroundColor: "#F1F2F6",
    borderRadius: 30,
    alignSelf: "center",
    marginVertical: 10
  },
  baseLayout: { flex: 1 },
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
  },
  descText: {
    color: "#1E2432",
    fontSize: 20,
    marginHorizontal: LEFT_MARGIN,
    marginVertical: LEFT_MARGIN
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
  addUserInfo: bindActionCreators(userActions.addUserInfo, dispatch),
  setUserState: bindActionCreators(setUserState, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Mobile);
