import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator
} from "react-native";
import NoFeedbackTapView from "../Views/NoFeedbackTapView";
import Ionicon from "react-native-vector-icons/Ionicons";
import {
  LEFT_MARGIN,
  UserAccountVerificationStatus
} from "../../config/Constants";
import { DeviceWidth, DeviceHeight } from "../../config/Device";
import { addUserInfo } from "../../redux/actions/user.info";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import RegularText from "../Texts/RegularText";
import {
  FONT_GREY,
  NEW_GREY,
  PURPLE,
  LIGHT_PURPLE,
  BRIGHT_RED,
  FONT_BLACK
} from "../../config/Colors";
import { validateEmail, checkNullAndUndefined } from "../../config/Utils";
import VerticalGradientView from "../Views/VerticalGradientView";
import { sharedStyles } from "../../styles/Shared";
import MediumText from "../Texts/MediumText";
import { sendEmailVerificationLink, updateProfile } from "../../network/auth";

class VerifyEmailModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      isNextLoading: false
    };
  }

  componentDidMount = () => {
    const { myData } = this.props;
    this.setState({
      email: checkNullAndUndefined(myData.email) ? myData.email : ""
    });
  };

  resendLink = () => {
    this.setState({
      isNextLoading: true
    });
    sendEmailVerificationLink(
      {
        email: this.state.email
      },
      cbLink => {
        this.setState({
          isNextLoading: false
        });
      }
    );
  };

  requestEmailVerificationLink = () => {
    this.setState({
      isNextLoading: true
    });
    const { addUserInfo } = this.props;
    const { email } = this.state;
    addUserInfo("email", email);
    addUserInfo("isEmailVeried", UserAccountVerificationStatus.IN_PROGRESS);
    let apiBody = {
      email,
      isEmailVeried: UserAccountVerificationStatus.IN_PROGRESS
    };
    updateProfile(apiBody, cbUpdate => {
      sendEmailVerificationLink(apiBody, cbLink => {
        this.setState({
          isNextLoading: false
        });
      });
    });
  };

  render() {
    const { dismissVerifyEmailModal, myData } = this.props;
    const { email, isNextLoading } = this.state;

    const hasVerified =
      myData.isEmailVeried === UserAccountVerificationStatus.DONE;
    const isPending =
      myData.isEmailVeried === UserAccountVerificationStatus.IN_PROGRESS;

    const disabled = !hasVerified
      ? email === "" || !validateEmail(email) || isPending
      : email === myData.email;

    return (
      <View style={styles.baseLayout}>
        <NoFeedbackTapView
          onPress={dismissVerifyEmailModal}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            ...styles.topRowView
          }}
        >
          <Text
            style={{
              ...styles.headerText,
              marginLeft: 0,
              marginBottom: 0
            }}
          >
            Secure Your Account
          </Text>
          <Ionicon name={"ios-close"} color={"#707070"} size={35} />
        </NoFeedbackTapView>
        <RegularText
          style={{
            fontSize: 14,
            color: FONT_GREY,
            marginLeft: LEFT_MARGIN * 1.25,
            marginVertical: LEFT_MARGIN / 2
          }}
        >
          Email Address
        </RegularText>
        <TextInput
          value={email}
          style={styles.inputField}
          placeholder={"Email address"}
          onChangeText={email => this.setState({ email })}
        />
        <NoFeedbackTapView
          disabled={disabled}
          onPress={this.requestEmailVerificationLink}
          style={{ ...styles.buttonStyle, marginTop: 20 }}
        >
          <VerticalGradientView
            style={styles.buttonStyle}
            colors={disabled ? [NEW_GREY, NEW_GREY] : [PURPLE, LIGHT_PURPLE]}
          >
            {isNextLoading ? (
              <ActivityIndicator color={"#fff"} size={"small"} />
            ) : (
              <MediumText style={styles.buttonText}>
                {hasVerified
                  ? "Update Your Email"
                  : isPending
                  ? email !== myData.email
                    ? "Update Your Email"
                    : "Verification Under Progress"
                  : "Verify Email Address"}
              </MediumText>
            )}
          </VerticalGradientView>
        </NoFeedbackTapView>

        <RegularText
          style={{
            color: hasVerified ? FONT_GREY : BRIGHT_RED,
            marginLeft: 20,
            marginTop: 10,
            textAlign: "left"
          }}
        >
          {hasVerified
            ? "Verified Email Address"
            : isPending
            ? "Tap on the link which you received to your email. If that link is expired you can request a new Link by tapping below"
            : "To Keep your account secured, you need to verify your email Address."}
        </RegularText>

        {isPending && myData.email === email ? (
          <NoFeedbackTapView
            style={styles.buttonStyle}
            onPress={this.resendLink}
          >
            <MediumText
              style={{
                ...styles.buttonText,
                color: FONT_BLACK
              }}
            >
              Resend Link
            </MediumText>
          </NoFeedbackTapView>
        ) : (
          <View />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  inputField: {
    paddingLeft: LEFT_MARGIN / 1.5,
    marginLeft: 0,
    alignSelf: "center",
    fontSize: 20,
    color: "#242E42",
    fontFamily: "Proxima Nova",
    backgroundColor: "#F1F2F6",
    width: DeviceWidth * 0.9,
    height: 50,
    borderRadius: 30
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
export default connect(mapStates, mapDispatches)(VerifyEmailModal);
