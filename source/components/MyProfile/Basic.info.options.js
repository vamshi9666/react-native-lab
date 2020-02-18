import React, { Component } from "react";
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert
} from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";
import FeatherIcon from "react-native-vector-icons/Feather";
import FIcon from "react-native-vector-icons/FontAwesome5";
import Ionicon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { FONT_GREY, PURPLE, FONT_BLACK } from "../../config/Colors";
import { ALL_INPUTS, LEFT_MARGIN, PLACE_OPTIONS } from "../../config/Constants";
import { DeviceHeight, DeviceWidth } from "../../config/Device";
import { getAllPlaces } from "../../network/user";
import { addUserInfo } from "../../redux/actions/user.info";
import { sharedStyles } from "../../styles/Shared";
import MediumText from "../Texts/MediumText";
import RegularText from "../Texts/RegularText";
import RowView from "../Views/RowView";
import * as UserActions from "../../redux/actions/user.info";
import * as UserApi from "../../network/user";
import Genders from "../../config/Genders";
import { namify } from "../../config/Utils";
import GenderPickerModal from "./Gender.picker.modal";
import SvgUri from "react-native-svg-uri";

class BasicInfoOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      placeText: "",
      placeOptions: PLACE_OPTIONS,
      cQuery: "",
      genders: Genders,
      showModal: false
    };
    this.scrollRef = React.createRef();
  }

  handleOptionClicked = async (data_key, value) => {
    this.modalUpdateProfile({ [data_key]: value });
    const { myData } = this.props;
    this.props.updateProfile({ ...myData, [data_key]: value });
  };

  toggleGenderModal = showModal => {
    this.setState({ showModal });
  };

  handleGenderTap = g => {
    this.toggleGenderModal(false);
    this.handleOptionClicked("gender", g);

    // alert(g);
    // this.props.addUserInfo("gender", namify(g));
    // if (g === "other") {
    //   this.setState({ showInputModal: true });
    // }
    // setTimeout(() => {
    //   this.setState({ showModal: false });
    // }, 800);
  };

  resetPlaceList = () => {
    this.setState({ placeOptions: PLACE_OPTIONS });
  };

  modalUpdateProfile = async obj => {
    UserApi.updateProfile(obj, updateResponse => {
      if (updateResponse.success) {
        this.props.updateProfile(updateResponse.data);
        this.props.scrollToNext();
      } else {
        alert("Error while updating User" + updateResponse.message);
      }
    });
  };

  handlePlacesAPI = cbPlaces => {
    if (cbPlaces.success) {
      let placeOptions = [];
      cbPlaces.data.map((place, placeId) =>
        placeOptions.push({ value: `${place.name}, ${place.country}` })
      );
      this.setState({ placeOptions });
    }
  };

  componentDidMount = () => {
    const { showDeleteIcon, myData, toFill } = this.props;
    if (showDeleteIcon) {
      const currentItem = ALL_INPUTS[toFill];
      const { data_key, options } = currentItem;
      const selectedOptionIndex = options.findIndex(
        option => option.value === myData[data_key]
      );
      if (selectedOptionIndex > 2) {
        setTimeout(() => {
          const _toScroll = selectedOptionIndex * 50;
          this.scrollRef.scrollTo({ y: _toScroll + 60 });
        }, 100);
      }
    }
  };

  changeGender = () => {
    Alert.alert(
      "You can only change your gender one more time if you change now and won't be able to change it back. Also, all your connections will be removed. Are you sure?",
      "",
      [
        {
          text: "Cancel",
          onPress: () => {}
        },
        {
          text: "Yes",
          onPress: () => {
            this.setState({ showModal: true });
          }
        }
      ]
    );
  };

  renderGenderPickModal = () => {
    const { showModal } = this.state;
    const {
      myData: { gender }
    } = this.props;

    return (
      <GenderPickerModal
        showModal={showModal}
        selectedGender={gender}
        handleGenderTap={this.handleGenderTap}
        toggleGenderModal={this.toggleGenderModal}
      />
    );
  };

  render() {
    const { toFill, myData: form, iconPath } = this.props;
    const currentItem = ALL_INPUTS[toFill];
    const { data_key, displayName, options, helperText } = currentItem;

    const { placeText, placeOptions } = this.state;

    const renderOptions =
      data_key === "living_in" || data_key === "native_place"
        ? placeOptions
        : options;

    const selectedOption = form[data_key] || "";
    const isOptionIsOther =
      form[data_key] &&
      data_key === "gender" &&
      form.gender !== "Man" &&
      form.gender !== "Woman";

    return (
      <View style={styles.baseLayout}>
        {this.renderGenderPickModal()}
        <View style={styles.definitionContainer}>
          <SvgUri
            width={DeviceWidth * 0.25}
            height={DeviceWidth * 0.25}
            source={iconPath}
          />
          <MediumText style={styles.displayNameText}>{displayName}</MediumText>
          <RegularText style={styles.helperText}>{helperText}</RegularText>
        </View>
        {data_key === "living_in" || data_key === "native_place" ? (
          <RowView style={styles.searchBarRowView}>
            <TextInput
              value={placeText}
              onChangeText={placeText => {
                this.setState({ placeText });
                getAllPlaces(placeText, this.handlePlacesAPI);
              }}
              placeholder={"Search city"}
              style={styles.searchBarInputView}
            />
            {placeText === "" ? (
              <FeatherIcon
                name={"search"}
                color={"rgba(6,5,24, 0.5)"}
                size={25}
              />
            ) : (
              <TouchableOpacity
                disabled={placeText === ""}
                style={{
                  ...styles.searchBarEdgeIconView,
                  backgroundColor:
                    placeText === "" ? "rgb(242, 243, 246)" : "#fff"
                }}
                onPress={() => {
                  this.setState({ placeText: "" });
                  this.resetPlaceList();
                }}
              >
                <Ionicon
                  style={{
                    marginTop: 2.5
                  }}
                  name={"md-close"}
                  color={placeText === "" ? "rgb(242, 243, 246)" : FONT_GREY}
                  size={25}
                />
              </TouchableOpacity>
            )}
          </RowView>
        ) : (
          <View />
        )}

        <ScrollView
          ref={ref => (this.scrollRef = ref)}
          showsVerticalScrollIndicator={false}
          bounces={true}
          style={styles.scrollViewStyle}
        >
          {renderOptions.map(({ value }, optionIndex) => {
            const optionMatched = selectedOption === value;
            return (
              <TouchableOpacity
                onPress={() => this.handleOptionClicked(data_key, value)}
                key={optionIndex}
                style={{
                  borderColor: optionMatched ? "#6074F9" : "#9B9B9B",
                  ...styles.optionView
                }}
              >
                <RegularText
                  style={{
                    color: optionMatched ? "#6074F9" : "#4D4B4B",
                    fontSize: 16
                  }}
                >
                  {value}
                </RegularText>
                {optionMatched && (
                  <AntIcon name="checkcircle" color="#6074F9" size={20} />
                )}
              </TouchableOpacity>
            );
          })}
          {data_key === "gender" ? (
            <TouchableOpacity
              onPress={() => {
                this.changeGender();
              }}
              style={{
                borderColor: isOptionIsOther ? "#6074F9" : "#9B9B9B",
                ...styles.optionView
              }}
            >
              <View
                style={{
                  justifyContent: "center"
                }}
              >
                <RegularText
                  style={{
                    color: isOptionIsOther ? "#6074F9" : "#4D4B4B",
                    fontSize: 15,
                    transform: [{ translateY: -2.5 }]
                  }}
                >
                  Other
                </RegularText>
                {isOptionIsOther ? (
                  <MediumText
                    style={{
                      color: "#6074F9",
                      fontSize: 16
                    }}
                  >
                    {namify(form["gender"])}
                  </MediumText>
                ) : (
                  <View />
                )}
              </View>

              {isOptionIsOther && (
                <AntIcon name="checkcircle" color="#6074F9" size={20} />
              )}
            </TouchableOpacity>
          ) : (
            <View />
          )}

          <View style={{ height: DeviceHeight * 0.3 }} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollViewStyle: {
    width: DeviceWidth,
    marginTop: DeviceHeight * 0.02
  },
  definitionContainer: {
    alignItems: "center",
    marginBottom: 20
  },
  baseLayout: {
    width: DeviceWidth
  },
  searchBarRowView: {
    alignSelf: "center",
    width: DeviceWidth * 0.8,
    backgroundColor: "rgb(242, 243, 246)",
    borderRadius: 30,
    height: 45,
    alignItems: "center",
    justifyContent: "center"
  },
  searchBarInputView: {
    height: 45,
    width: DeviceWidth * 0.65,
    paddingHorizontal: LEFT_MARGIN,
    fontFamily: "Proxima Nova"
  },
  searchBarEdgeIconView: {
    height: 30,
    width: 30,
    borderRadius: 15,
    marginRight: LEFT_MARGIN / 2,
    ...sharedStyles.justifiedCenter
  },
  helperText: {
    fontSize: 18,
    fontWeight: "400",
    color: "#1E2432",
    padding: 2,
    marginTop: 10
  },
  displayNameText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1E2432",
    padding: 2,
    marginTop: 10
  },
  optionView: {
    borderRadius: 26,
    marginHorizontal: LEFT_MARGIN * 2,
    paddingHorizontal: LEFT_MARGIN,
    borderWidth: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    height: 50,
    alignItems: "center",
    marginVertical: LEFT_MARGIN / 2
  }
});

const mapState = state => {
  return {
    myData: state.info.userInfo
  };
};

const mapDispatches = dispatch => {
  return {
    addUserInfo: bindActionCreators(addUserInfo, dispatch),
    updateProfile: bindActionCreators(UserActions.updateOwnProfile, dispatch)
  };
};
export default connect(mapState, mapDispatches)(BasicInfoOptions);
