import React, { Component } from "react";
import { Text, TextInput, View, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { FONT_GREY } from "../../../src/config/Colors";
import { DeviceHeight, DeviceWidth } from "../../../src/config/Device";
import { getMultiple, storeData } from "../../../src/config/Storage";
import * as userActions from "../../redux/actions/user.info";
import styles from "../../../src/styles/College.input";
import BoldText from "../Texts/BoldText";
import MediumText from "../Texts/MediumText";
import RegularText from "../Texts/RegularText";
import { checkNullAndUndefined } from "../../config/Utils";

const LEFT_MARGIN = DeviceWidth * 0.05;
class College extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = async () => {
    // firebase.logEvent("login10_college_input_did_mount");
  };

  render() {
    const {
      addUserInfo,
      handleNext,
      userInfo: { college }
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
          University
        </BoldText>
        <View style={styles.inputCon}>
          <TextInput
            value={college}
            style={{
              paddingLeft: 15,
              fontSize: 18,
              textAlign: "left",
              textAlignVertical: "center",
              fontFamily: "Proxima Nova"
            }}
            placeholderTextColor={FONT_GREY}
            placeholder={"University (Optional)"}
            onChangeText={text => addUserInfo("college", text)}
          />
        </View>
        <TouchableOpacity
          disabled={checkNullAndUndefined(college)}
          style={{
            alignItems: "center",
            height: 40,
            marginTop: DeviceHeight * 0.1,
            opacity: checkNullAndUndefined(college) ? 0 : 1
          }}
          onPress={() => handleNext()}
        >
          <RegularText
            style={{
              fontSize: 20,
              color: "#FFA800"
            }}
          >
            Skip
          </RegularText>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStatetoProps = state => {
  return {
    userInfo: state.info.userInfo
  };
};

const mapDispatchToProps = dispatch => ({
  addUserInfo: bindActionCreators(userActions.addUserInfo, dispatch)
});
export default connect(mapStatetoProps, mapDispatchToProps)(College);
