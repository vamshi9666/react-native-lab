import React, { Component } from "react";
import { Image, Picker, TouchableOpacity, View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { DeviceWidth } from "../../config/Device";
import * as UserApi from "../../network/user";
import * as UserActions from "../../redux/actions/user.info";
import { addUserInfo } from "../../redux/actions/user.info";
import MediumText from "../Texts/MediumText";
import RowView from "../Views/RowView";
import { styles } from "./UserDetailsFormModal";
import { PURPLE } from "../../config/Colors";
import { deleteContent } from "../../redux/actions/nav";

class BasicInfoHeight extends Component {
  constructor(props) {
    super(props);
    this.state = {
      heights: [],
      selectedHeight: `161 cm (5'3'')`,
      previousHeight: null,
      isDeleted: false
    };
  }

  componentDidMount() {
    let heights = [];
    for (let cm = 90; cm < 221; cm++) {
      let inch = cm / 2.54;
      heights.push({ inch, cm });
      this.setState({ heights });
    }
    const { showDeleteIcon, myData } = this.props;
    if (showDeleteIcon) {
      this.setState({
        previousHeight: myData["height"],
        selectedHeight: myData["height"]
      });
    }
  }

  handelSavePressed = () => {
    const { selectedHeight: height } = this.state;
    this.modalUpdateProfile({ height });
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

  deleteItems = () => {
    this.setState({ selectedHeight: `161 cm (5'3'')`, isDeleted: true });
  };

  componentWillReceiveProps = nextProps => {
    const { deleteContent, deleteContentMethod } = nextProps;
    if (deleteContent !== undefined && deleteContent.length > 0) {
      this.deleteItems();
      deleteContentMethod(undefined);
    }
  };

  render() {
    const { selectedHeight, heights, previousHeight, isDeleted } = this.state;
    const { myData, showDeleteIcon } = this.props;

    const heightVal = myData.height ? myData.height : selectedHeight;

    return (
      <View style={styles.heightInputLayout}>
        <Image
          style={{
            height: 35,
            width: 35
          }}
          source={require("../../assets/images/height.png")}
        />
        <MediumText style={styles.selectedHeightText}>{heightVal}</MediumText>
        <RowView style={styles.heightButtonsRow}>
          <TouchableOpacity
            onPress={this.scrollToNext}
            style={styles.cancelButtonView}
          >
            <MediumText style={styles.cancelButtonText}>Cancel</MediumText>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={
              showDeleteIcon && !isDeleted
                ? previousHeight === selectedHeight
                  ? true
                  : false
                : false
            }
            onPress={this.handelSavePressed}
            style={styles.heightSaveButtonView}
          >
            <MediumText
              style={{
                ...styles.heightButtonText,
                color:
                  showDeleteIcon && !isDeleted
                    ? previousHeight === selectedHeight
                      ? "#cacaca"
                      : PURPLE
                    : PURPLE
              }}
            >
              {showDeleteIcon && !isDeleted ? "Update" : "Save"}
            </MediumText>
          </TouchableOpacity>
        </RowView>
        <Picker
          selectedValue={heightVal}
          style={{ width: DeviceWidth, height: 100 }}
          onValueChange={(itemValue, itemIndex) => {
            this.setState({
              selectedHeight: itemValue
            });
            this.props.addUserInfo("height", itemValue);
          }}
        >
          {heights.map((heightValue, i) => {
            let _inch = parseInt(heightValue.inch);
            let ft = parseInt(heightValue.inch / 12);
            let _prevInch =
              i > 0
                ? parseInt(heights[i - 1].inch)
                : parseInt(heightValue.inch);
            let val =
              _inch === _prevInch
                ? `${heightValue.cm} cm`
                : `${heightValue.cm} cm (${ft}'${_inch % 12}'')`;
            if (i === 0) {
              val = "<90 cm(<3'0'')";
            }
            if (heightValue.cm === 220) {
              val = ">220 cm(>7'3'')";
            }
            return <Picker.Item key={i} label={val} value={val} />;
          })}
        </Picker>
      </View>
    );
  }
}

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
export default connect(mapState, mapDispatches)(BasicInfoHeight);
