import React, { Component } from "react";
import {
  TouchableWithoutFeedback,
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
  TextInput,
  FlatList
} from "react-native";
import CheckBox from "react-native-check-box";
import Ionicon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { DeviceHeight, DeviceWidth } from "../../../src/config/Device";
import * as userActions from "../../redux/actions/user.info";
import BoldText from "../Texts/BoldText";
import RegularText from "../Texts/RegularText";
import RowView from "../Views/RowView";
import MediumText from "../Texts/MediumText";
import Genders from "../../config/Genders";
import { FONT_BLACK, greyTheme, FONT_GREY, PURPLE } from "../../config/Colors";
import { namify } from "../../config/Utils";
import NoFeedbackTapView from "../Views/NoFeedbackTapView";
import GenderPickerModal from "../MyProfile/Gender.picker.modal";
import { TOP_BAR_WIDTH } from "../../config/Constants";
const { OS } = Platform;
const LEFT_MARGIN = DeviceWidth * 0.05;

class Gender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      cQuery: "",
      showInputModal: false,
      genders: Genders
    };
  }

  handleSearch = cQuery => {
    let queryText = cQuery.toLowerCase().replace(/,|\.|-/g, " ");
    const queryWords = queryText.split(" ").filter(w => !!w.trim().length);
    console.log(queryWords);
    let searchedGender = [];
    Genders.forEach(gender => {
      queryWords.forEach(queryWord => {
        if (gender.toLowerCase().indexOf(queryWord) > -1) {
          searchedGender.push(gender);
        }
      });
    });
    this.setState({
      cQuery,
      genders: cQuery ? searchedGender : Genders
    });
  };

  handleGenderTap = g => {
    this.props.addUserInfo("gender", namify(g));
    if (g === "other") {
      this.setState({ showInputModal: true });
    }
    setTimeout(() => {
      this.setState({ showModal: false });
    }, 800);
  };

  toggleGenderModal = showModal => {
    this.setState({ showModal });
  };

  render() {
    const {
      addUserInfo,
      userInfo: { gender, showGender }
    } = this.props;

    const { showModal, cQuery, showInputModal, genders } = this.state;

    return (
      <View>
        <GenderPickerModal
          showModal={showModal}
          selectedGender={gender}
          handleGenderTap={this.handleGenderTap}
          toggleGenderModal={this.toggleGenderModal}
        />
        <View
          style={{
            marginHorizontal: 27,
            marginTop: TOP_BAR_WIDTH
          }}
        >
          <BoldText style={styles.headerText}>I am a</BoldText>
        </View>
        <View style={styles.optionsCon}>
          <TouchableWithoutFeedback
            onPress={() => addUserInfo("gender", "Man")}
          >
            <View style={styles.gendeOptionButton}>
              <RegularText style={styles.genderOptionText}>Man</RegularText>
              {gender === "Man" ? (
                <Ionicon
                  name={"ios-checkmark-circle"}
                  color={"#FF2D55"}
                  size={22}
                />
              ) : (
                <View />
              )}
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => addUserInfo("gender", "Woman")}
          >
            <View style={styles.gendeOptionButton}>
              <RegularText style={styles.genderOptionText}> Woman </RegularText>
              {gender === "Woman" ? (
                <Ionicon
                  name={"ios-checkmark-circle"}
                  color={"#FF2D55"}
                  size={22}
                />
              ) : (
                <View />
              )}
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => this.setState({ showModal: true })}
          >
            <View style={styles.gendeOptionButton}>
              <RegularText style={styles.genderOptionText}>
                {gender !== null && gender !== "Man" && gender !== "Woman"
                  ? gender
                  : "Other"}
              </RegularText>
              {gender !== null && gender !== "Man" && gender !== "Woman" ? (
                <Ionicon
                  name={"ios-checkmark-circle"}
                  color={"#FF2D55"}
                  size={22}
                />
              ) : (
                <View />
              )}
            </View>
          </TouchableWithoutFeedback>
          <View>
            <CheckBox
              style={styles.checkBoxCon}
              checkBoxColor={!showGender ? "#FF2D55" : "#cacaca"}
              rightTextStyle={styles.rightTextStyle}
              onClick={() => {
                addUserInfo("showGender", !showGender);
              }}
              isChecked={!showGender}
              rightText={"Dont show gender on my profile"}
            />
          </View>
        </View>
        <Modal
          animationType={"slide"}
          animated
          transparent
          visible={showInputModal}
        >
          <View style={[styles.modalLayout, { marginTop: DeviceHeight * 0.4 }]}>
            <NoFeedbackTapView
              onPress={() => this.setState({ showInputModal: false })}
            >
              <Ionicon name={"md-close"} size={30} color={FONT_BLACK} />
            </NoFeedbackTapView>
            <MediumText
              style={{
                fontSize: 24,
                textAlign: "center",
                color: FONT_BLACK
              }}
            >
              Help us improve.
            </MediumText>
            <RegularText
              style={{
                fontSize: 18,
                textAlign: "center",
                color: FONT_GREY
              }}
            >
              Tell us what we missed, if we find your input valuable we will add
              it to the above list in the future and let you know. Thank you for
              your efforts.
            </RegularText>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchLayout: {
    height: 40,
    width: DeviceWidth * 0.98,
    backgroundColor: "#F1F2F6",
    borderRadius: 30,
    alignSelf: "center",
    marginVertical: 10
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

  modalLayout: { flex: 1, backgroundColor: "#fff", borderRadius: 10 },
  selectGenderText: { color: FONT_BLACK, fontSize: 25, paddingLeft: 10 },
  cancelText: { color: FONT_GREY, fontSize: 18, paddingRight: 10 },
  modalTopRow: {
    justifyContent: "space-between",
    borderBottomColor: "#00000016",
    borderBottomWidth: 1,
    marginTop: OS === "android" ? 15 : 30,
    paddingBottom: 10
  },
  otherGenderItemsContainer: {
    borderWidth: 0.5,
    borderColor: "#00000017",
    paddingVertical: 10,
    paddingLeft: DeviceWidth * 0.05,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 10
  },
  otherGenderItems: { color: FONT_BLACK, fontSize: 22 },
  headerText: {
    color: "#1E2432",
    fontSize: 34,
    marginVertical: DeviceHeight * 0.05,
    marginLeft: LEFT_MARGIN
  },
  gendeOptionButton: {
    width: DeviceWidth * 0.8,
    height: 50,
    borderWidth: 0,
    marginTop: 16,
    borderColor: greyTheme,
    backgroundColor: "#F1F3F7",
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20
  },
  genderOptionText: {
    fontSize: 16,
    color: "#4E586E"
  },
  optionsCon: {
    alignItems: "center",
    paddingBottom: 20
  },
  checkBoxCon: {
    width: DeviceWidth * 0.8,
    marginTop: 16
  },
  rightTextStyle: {
    color: "#1E2432",
    fontSize: 15
  }
});

const mapStatetoProps = state => {
  return {
    userInfo: state.info.userInfo
  };
};

const mapDispatchToProps = dispatch => ({
  addUserInfo: bindActionCreators(userActions.addUserInfo, dispatch)
});
export default connect(mapStatetoProps, mapDispatchToProps)(Gender);
