import React, { Component } from "react";
import { Switch, TextInput, View, StyleSheet } from "react-native";
import { BACKGROUND_GREY, FONT_GREY } from "../../config/Colors";
import { TOP_BAR_WIDTH } from "../../config/Constants";
import BoldText from "../Texts/BoldText";
import RegularText from "../Texts/RegularText";
import * as userActions from "../../redux/actions/user.info";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class NameInput extends Component {
  render() {
    const { keyboardShown, storeData, userInfo, inputEnabled } = this.props;

    return (
      <View>
        <View style={styles.headerView}>
          <BoldText
            style={{
              marginTop: keyboardShown ? -30 : 0,
              ...styles.headerText
            }}
          >
            My First Name
          </BoldText>
        </View>

        <View
          style={[
            {
              marginTop: keyboardShown ? 10 : 40
            },
            styles.inputView
          ]}
        >
          <TextInput
            editable={inputEnabled}
            autoFocus={false}
            style={styles.input}
            value={userInfo.name}
            placeholderTextColor={FONT_GREY}
            placeholder={"First Name"}
            onChangeText={text => {
              storeData("name", text);
            }}
          />
        </View>
        <RegularText
          style={{
            marginTop: keyboardShown ? 0 : 0,
            color: FONT_GREY,
            fontSize: 15,
            alignSelf: "center"
          }}
        >
          This is how it appears in Closer app
        </RegularText>
        <View style={styles.switchView}>
          <RegularText style={styles.descText}>
            Display name only to your friends
          </RegularText>
          <Switch
            style={styles.switchStyle}
            trackColor={{ false: "#DEDEDE", true: "rgb(0,211,237)" }}
            value={userInfo.showName}
            onValueChange={val => {
              storeData("showName", val);
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerText: {
    fontSize: 34,
    textAlign: "left"
  },
  headerView: {
    marginHorizontal: 27,
    marginTop: TOP_BAR_WIDTH + 30
  },
  inputView: {
    marginBottom: 10,
    height: 48,
    backgroundColor: BACKGROUND_GREY,
    borderRadius: 24,
    marginHorizontal: 26,
    justifyContent: "center"
  },
  input: {
    fontFamily: "Proxima Nova",
    paddingLeft: 15,
    fontSize: 16,
    textAlign: "left",
    textAlignVertical: "center"
  },
  switchView: {
    marginTop: 20,
    flexDirection: "column-reverse",
    alignItems: "center",
    alignSelf: "center"
  },
  descText: {
    marginRight: 10,
    fontSize: 18,
    color: "#4E586E",
    textAlignVertical: "center"
  },
  switchStyle: {
    alignSelf: "center",
    marginVertical: 8
  }
});

const mapStateToProps = state => {
  return {
    userInfo: state.info.userInfo
  };
};

const mapDispatchToProps = dispatch => ({
  storeData: bindActionCreators(userActions.addUserInfo, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NameInput);
