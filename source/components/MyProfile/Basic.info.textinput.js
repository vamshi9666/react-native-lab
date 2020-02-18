import React, { Component } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  StyleSheet
} from "react-native";
import MatComIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { LIGHT_PURPLE, PURPLE, FONT_BLACK } from "../../config/Colors";
import { LEFT_MARGIN } from "../../config/Constants";
import { DeviceWidth } from "../../config/Device";
import * as UserApi from "../../network/user";
import SvgUri from "react-native-svg-uri";
import * as UserActions from "../../redux/actions/user.info";
import { addUserInfo } from "../../redux/actions/user.info";
import MediumText from "../Texts/MediumText";
import HorizontalGradientView from "../Views/HorizontalGradientView";
import { styles } from "./UserDetailsFormModal";
import { Dropdown } from "react-native-material-dropdown";
import { checkNullAndUndefined } from "../../config/Utils";
import { View as AnimatableView } from "react-native-animatable";
import RegularText from "../Texts/RegularText";
import Lodash from "lodash";
import { sharedStyles } from "../../styles/Shared";
import { deleteContent } from "../../redux/actions/nav";

const thisYear = new Date().getFullYear();

class BasicInfoTextinput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputOne: "",
      inputTwo: "",
      disabled: false,
      oldInputOne: "",
      oldInputTwo: "",
      tappedYear: null,
      isDeleted: false,
      isLoading: false
    };
  }

  componentDidMount = () => {
    const { childrenProps, myData, showDeleteIcon } = this.props;
    const requiredFields = childrenProps.map(({ data_key }) => data_key);

    if (showDeleteIcon) {
      this.setState({
        inputOne: myData[requiredFields[0]],
        inputTwo: myData[requiredFields[1]],
        oldInputOne: myData[requiredFields[0]],
        oldInputTwo: myData[requiredFields[1]],
        tappedYear:
          showDeleteIcon && requiredFields[0] === "education"
            ? myData[requiredFields[1]]
            : null
      });
    } else {
      //
    }
  };

  deleteItems = () => {
    this.setState({
      inputOne: "",
      inputTwo: "",
      isDeleted: true,
      tappedYear: null
    });
  };

  componentWillReceiveProps = nextProps => {
    const { deleteContent, deleteContentMethod } = nextProps;
    if (deleteContent !== undefined && deleteContent.length > 0) {
      this.deleteItems();
      deleteContentMethod(undefined);
    }
  };

  checkDisableStatus = () => {
    const {
      oldInputOne,
      oldInputTwo,
      inputOne,
      inputTwo,
      isDeleted
    } = this.state;
    const { showDeleteIcon } = this.props;
    if (showDeleteIcon && !isDeleted) {
      return inputOne !== oldInputOne || inputTwo !== oldInputTwo;
    } else {
      return checkNullAndUndefined(inputOne) && checkNullAndUndefined(inputTwo);
    }
  };

  modalUpdateProfile = async obj => {
    UserApi.updateProfile(obj, updateResponse => {
      if (updateResponse.success) {
        this.props.scrollToNext();
      } else {
        alert("Error while updating User" + updateResponse.message);
      }
    });
  };

  handleSavePressed = () => {
    const { childrenProps, myData } = this.props;
    const { inputOne, inputTwo } = this.state;
    const requiredFields = childrenProps.map(({ data_key }) => data_key);
    const newObj = {
      [requiredFields[0]]: inputOne.trim(),
      [requiredFields[1]]:
        requiredFields[1] === "graduatedYear" ? inputTwo : inputTwo.trim()
    };
    this.modalUpdateProfile(newObj);
    this.props.updateProfile({ ...myData, ...newObj });
  };

  render() {
    const { inputOne, inputTwo, isDeleted } = this.state;
    const { displayName, childrenProps, showDeleteIcon, iconPath } = this.props;

    return (
      <View
        style={{
          flex: 1,
          width: DeviceWidth,
          alignItems: "center",
          marginBottom: 24
        }}
      >
        <View style={{ alignItems: "center" }}>
          <SvgUri
            width={DeviceWidth * 0.25}
            height={DeviceWidth * 0.25}
            source={iconPath}
          />
          <Text
            style={{
              fontSize: 24,
              fontWeight: "600",
              color: "#1E2432",
              padding: 2,
              marginTop: 10
            }}
          >
            {displayName}
          </Text>
        </View>
        <View
          style={{
            minWidth: DeviceWidth,
            marginBottom: LEFT_MARGIN
          }}
        >
          {childrenProps.map(({ placeholderText, data_key }, childIndex) => {
            if (data_key !== "graduatedYear") {
              return (
                <TextInput
                  key={childIndex}
                  style={{
                    color: "#000000",
                    borderRadius: 26,
                    marginHorizontal: 40,
                    marginVertical: 24,
                    borderWidth: 1,
                    borderColor: "#9B9B9B",
                    paddingHorizontal: 30,
                    paddingVertical: 14,
                    fontSize: 17,
                    fontFamily: "Proxima Nova"
                  }}
                  value={childIndex === 0 ? inputOne : inputTwo}
                  placeholder={placeholderText}
                  onChangeText={text => {
                    if (childIndex === 0) this.setState({ inputOne: text });
                    else this.setState({ inputTwo: text });
                  }}
                />
              );
            } else {
              const { showPicker, tappedYear } = this.state;

              return (
                <View key={childIndex}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ showPicker: true });
                    }}
                    style={newStyles.customYearContainer}
                  >
                    <RegularText
                      style={{
                        fontSize: tappedYear ? 20 : 16,
                        color: tappedYear ? FONT_BLACK : "#00000040"
                      }}
                    >
                      {tappedYear ? tappedYear : "Select year"}
                    </RegularText>
                  </TouchableOpacity>
                  {showPicker ? (
                    <AnimatableView
                      style={newStyles.customDropDownContainer}
                      animation={"fadeIn"}
                      duration={500}
                    >
                      <FlatList
                        showsVerticalScrollIndicator={false}
                        extraData={this.state}
                        data={Lodash.range(thisYear + 3, thisYear - 60)}
                        keyExtractor={item => item.toString()}
                        renderItem={({ item, index }) => {
                          return (
                            <TouchableOpacity
                              style={newStyles.customYearPicker}
                              onPress={() =>
                                this.setState({
                                  showPicker: false,
                                  tappedYear: item,
                                  inputTwo: item
                                })
                              }
                            >
                              <RegularText
                                style={{
                                  fontSize: 18,
                                  color: FONT_BLACK
                                }}
                              >
                                {item}
                              </RegularText>
                            </TouchableOpacity>
                          );
                        }}
                      />
                    </AnimatableView>
                  ) : (
                    <View />
                  )}
                </View>
              );
            }
          })}
        </View>

        <HorizontalGradientView
          colors={
            this.checkDisableStatus()
              ? [PURPLE, LIGHT_PURPLE]
              : ["#cacaca", "#cacaca"]
          }
          style={styles.saveButtonView}
        >
          <TouchableOpacity
            disabled={!this.checkDisableStatus()}
            style={styles.saveButtonView}
            onPress={this.handleSavePressed}
          >
            <MediumText style={{ color: "#fff", fontSize: 18 }}>
              {showDeleteIcon && !isDeleted ? "Update" : "Save"}
            </MediumText>
          </TouchableOpacity>
        </HorizontalGradientView>
      </View>
    );
  }
}

const newStyles = StyleSheet.create({
  customYearPicker: {
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: LEFT_MARGIN / 2,
    borderBottomColor: "#cacaca40",
    borderBottomWidth: 1
  },
  customYearContainer: {
    width: DeviceWidth * 0.8,
    alignSelf: "center",
    height: 50,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgb(160,160,160)",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingHorizontal: 30
  },
  customDropDownContainer: {
    width: DeviceWidth * 0.4,
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 1,
    // padding: LEFT_MARGIN,
    shadowOpacity: 0.1,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 3
    },
    marginTop: 10
  }
});

const mapState = state => {
  return {
    myData: state.info.userInfo,
    deleteContent: state.nav.deleteContent
  };
};

const mapDispatches = dispatch => {
  return {
    addUserInfo: bindActionCreators(addUserInfo, dispatch),
    updateProfile: bindActionCreators(UserActions.updateOwnProfile, dispatch),
    deleteContentMethod: bindActionCreators(deleteContent, dispatch)
  };
};
export default connect(mapState, mapDispatches)(BasicInfoTextinput);
