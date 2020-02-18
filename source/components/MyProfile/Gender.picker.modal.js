import React, { Component } from "react";
import {
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Ionicon from "react-native-vector-icons/Ionicons";
import {
  FONT_BLACK,
  FONT_GREY,
  LIGHT_PURPLE,
  PURPLE
} from "../../config/Colors";
import { LEFT_MARGIN } from "../../config/Constants";
import { DeviceHeight, DeviceWidth } from "../../config/Device";
import Genders from "../../config/Genders";
import { namify } from "../../config/Utils";
import { sharedStyles } from "../../styles/Shared";
import MediumText from "../Texts/MediumText";
import RegularText from "../Texts/RegularText";
import HorizontalGradientView from "../Views/HorizontalGradientView";
import NoFeedbackTapView from "../Views/NoFeedbackTapView";
import RowView from "../Views/RowView";

class GenderPickerModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cQuery: "",
      genders: Genders,
      showInputModal: false,
      userGender: ""
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

  handleGenderTap = item => {
    const { handleGenderTap } = this.props;
    if (item === "other") {
      this.setState({ showInputModal: true });
    } else {
      handleGenderTap(item);
    }
  };

  handleSubmitPressed = () => {
    const { userGender } = this.state;
    alert("Successfully submitted " + userGender);
  };

  render() {
    const { cQuery, genders, showInputModal, userGender } = this.state;
    const { showModal, selectedGender, toggleGenderModal } = this.props;

    return (
      <Modal
        visible={showModal}
        transparent
        animated={true}
        animationType={"slide"}
      >
        <Modal
          animationType={"slide"}
          animated
          transparent
          visible={showInputModal}
        >
          <View style={styles.genderInputLayout}>
            <View style={styles.genderInputCardView}>
              <NoFeedbackTapView
                style={{ padding: LEFT_MARGIN }}
                onPress={() => this.setState({ showInputModal: false })}
              >
                <Ionicon name={"md-close"} size={30} color={FONT_BLACK} />
              </NoFeedbackTapView>
              <MediumText style={styles.genderInputHeaderText}>
                Help us improve.
              </MediumText>
              <RegularText style={styles.descText}>
                Tell us what we missed, if we find your input valuable we will
                add it to our list in the future and let you know. Thank you for
                your efforts.
              </RegularText>
              <TextInput
                style={styles.genderInputBox}
                value={userGender}
                onChangeText={userGender => this.setState({ userGender })}
                placeholder={"Type here..."}
              />
              <HorizontalGradientView
                colors={
                  userGender !== ""
                    ? [PURPLE, LIGHT_PURPLE]
                    : ["#cacaca", "#cacaca"]
                }
                style={{ ...styles.saveButtonView, marginTop: LEFT_MARGIN }}
              >
                <TouchableOpacity
                  disabled={userGender === ""}
                  style={styles.saveButtonView}
                  onPress={this.handleSubmitPressed}
                >
                  <MediumText style={{ color: "#fff", fontSize: 18 }}>
                    Submit
                  </MediumText>
                </TouchableOpacity>
              </HorizontalGradientView>
            </View>
          </View>
        </Modal>
        <View style={styles.modalLayout}>
          <View style={styles.modalTopRow}>
            <RowView
              style={{
                justifyContent: "space-between"
              }}
            >
              <MediumText style={styles.selectGenderText}>
                Select Your Gender
              </MediumText>
              <TouchableOpacity onPress={() => toggleGenderModal(false)}>
                <MediumText style={styles.cancelText}>Cancel</MediumText>
              </TouchableOpacity>
            </RowView>
            <RowView style={styles.searchLayout}>
              <TextInput
                autoFocus={true}
                style={styles.textInput}
                value={cQuery}
                onChangeText={this.handleSearch}
                placeholder={"Search here..."}
              />
            </RowView>
          </View>
          <FlatList
            extraData={this.props}
            keyExtractor={item => item}
            data={genders}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={styles.otherGenderItemsContainer}
                key={index}
                onPress={() => this.handleGenderTap(item)}
              >
                <RegularText style={styles.otherGenderItems}>
                  {namify(item)}
                </RegularText>
                {namify(item) === selectedGender ? (
                  <Ionicon
                    size={25}
                    color={PURPLE}
                    name={"ios-checkmark-circle"}
                  />
                ) : (
                  <View />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  genderInputLayout: {
    flex: 1,
    backgroundColor: "#000000c0",
    alignItems: "flex-end",
    justifyContent: "flex-end"
  },
  genderInputCardView: {
    height: DeviceHeight * 0.6,
    width: DeviceWidth,
    backgroundColor: "#fff",
    alignSelf: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  genderInputHeaderText: {
    fontSize: 24,
    textAlign: "center",
    color: FONT_BLACK,
    marginTop: -LEFT_MARGIN
  },
  descText: {
    fontSize: 18,
    textAlign: "center",
    color: FONT_GREY,
    paddingHorizontal: LEFT_MARGIN,
    marginVertical: LEFT_MARGIN,
    lineHeight: 24
  },
  genderInputBox: {
    width: DeviceWidth * 0.8,
    height: 40,
    paddingLeft: LEFT_MARGIN,
    backgroundColor: "rgb(242,242,242)",
    borderRadius: 30,
    alignSelf: "center"
  },
  saveButtonView: {
    width: DeviceWidth * 0.3,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#fff",
    height: 35,
    alignSelf: "center",

    ...sharedStyles.justifiedCenter
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
  searchLayout: {
    height: 40,
    width: DeviceWidth * 0.98,
    backgroundColor: "#F1F2F6",
    borderRadius: 30,
    alignSelf: "center",
    marginVertical: 10
  },
  modalLayout: { flex: 1, backgroundColor: "#fff", borderRadius: 10 },
  selectGenderText: { color: FONT_BLACK, fontSize: 25, paddingLeft: 10 },
  cancelText: { color: FONT_GREY, fontSize: 18, paddingRight: 10 },
  modalTopRow: {
    justifyContent: "space-between",
    borderBottomColor: "#00000016",
    borderBottomWidth: 1,
    marginTop: Platform.OS === "android" ? 15 : 30,
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
  otherGenderItems: { color: FONT_BLACK, fontSize: 22 }
});

export default GenderPickerModal;
