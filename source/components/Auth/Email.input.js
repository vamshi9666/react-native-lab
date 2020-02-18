import React, { Component } from "react";
import { TextInput, View, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { FONT_GREY } from "../../../src/config/Colors";
import { DeviceHeight, DeviceWidth } from "../../../src/config/Device";
import { retrieveData } from "../../../src/config/Storage";
// import * as AuthActions from "../../../src/redux/actions/Auth.action";
import styles from "../../../src/styles/Email.input";
import BoldText from "../Texts/BoldText";
const LEFT_MARGIN = DeviceWidth * 0.05;
import * as userActions from "../../redux/actions/user.info";
import RegularText from "../Texts/RegularText";
import { checkNullAndUndefined } from "../../config/Utils";

class Email extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validEmail: false,
      email: " ",
      error: false,
      errorText: " "
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

  proceedWithEmail = async () => {
    const imagePath = await retrieveData("IMAGE_URL");
    console.log("userdata is:", {
      email: this.state.email,
      images: [imagePath]
    });
    this.props
      .updateUser({
        email: this.state.email,
        images: [imagePath]
      })
      .then(() => {
        this.props.navigation.navigate("Landing");
      })
      .catch(err => {
        console.log(" err in updatinf email ", err);
        this.showError("something went wrong please try again");
      });
  };

  render() {
    const { error, errorText } = this.state;
    const {
      userInfo: { email },
      addUserInfo,
      handleNext
    } = this.props;

    return (
      <View style={styles.baseLayout}>
        <BoldText
          style={{
            color: "#1E2432",
            fontSize: 34,
            marginTop: DeviceHeight * 0.1,
            marginLeft: LEFT_MARGIN,
            fontWeight: "700"
          }}
        >
          Verify your email
        </BoldText>
        <View style={styles.inputCon}>
          <TextInput
            value={email}
            style={styles.inputField}
            placeholderTextColor={FONT_GREY}
            placeholder={"Email address (Optional)"}
            onChangeText={text => addUserInfo("email", text.toLowerCase())}
          />
        </View>
        <TouchableOpacity
          disabled={checkNullAndUndefined(email)}
          style={{
            alignItems: "center",
            height: 40,
            marginTop: DeviceHeight * 0.1,
            opacity: checkNullAndUndefined(email) ? 0 : 1
          }}
          onPress={() => handleNext()}
        >
          <RegularText
            style={{
              fontSize: 17,
              color: "#FF2D55"
            }}
          >
            Skip
          </RegularText>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    userInfo: state.info.userInfo
  };
};
const mapDispatchToProps = dispatch => ({
  addUserInfo: bindActionCreators(userActions.addUserInfo, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Email);
