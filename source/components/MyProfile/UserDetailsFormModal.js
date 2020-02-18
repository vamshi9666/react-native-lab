import React, { Component } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { Bar as ProgressBar } from "react-native-progress";
import AntIcon from "react-native-vector-icons/AntDesign";
import Octicons from "react-native-vector-icons/Octicons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { FONT_GREY, PURPLE } from "../../config/Colors";
import { ALL_INPUTS, LEFT_MARGIN } from "../../config/Constants";
import { DeviceHeight, DeviceWidth } from "../../config/Device";
import { checkNullAndUndefined } from "../../config/Utils";
import { addUserInfo, deleteUserInfo } from "../../redux/actions/user.info";
import { sharedStyles } from "../../styles/Shared";
import MediumText from "../Texts/MediumText";
import RowView from "../Views/RowView";
import BasicInfoHeight from "./Basic.info.height";
import BasicInfoOptions from "./Basic.info.options";
import BasicInfoTextinput from "./Basic.info.textinput";
import { deleteContent } from "../../redux/actions/nav";

class UserDetailsFormModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unfilledIndexes: [],
      currentItemIndex: 0,
      toFill: null,
      form: {},
      placeText: "",
      user: null,
      showDeleteIcon: false,
      itemsToRender: []
    };
  }

  deleteCurrentField = () => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this?", [
      {
        text: "Cancel",
        onPress: () => {}
      },
      {
        text: "Delete",
        onPress: () => {
          const { toFill, deleteUserInfo, deleteContent } = this.props;
          const item = ALL_INPUTS[toFill];
          if (toFill === 0) {
            deleteUserInfo("jobTitle");
            deleteUserInfo("organization");
            deleteContent(["jobTitle", "organization"]);
          } else if (toFill === 1) {
            deleteUserInfo("education");
            deleteUserInfo("graduatedYear");
            deleteContent(["education", "graduatedYear"]);
          } else {
            deleteUserInfo(item.data_key);
            deleteContent([item.data_key]);
          }
          this.setState({ showDeleteIcon: false });
        }
      }
    ]);
  };

  componentDidMount = () => {
    const { toFill, myData, showDeleteIcon } = this.props;
    const unFilledFields = [];
    let form = {};
    let itemsToRender = [];

    if (toFill === 0 || toFill === 1) {
      itemsToRender.push(
        <BasicInfoTextinput
          showDeleteIcon={showDeleteIcon}
          scrollToNext={this.scrollToNext}
          displayName={ALL_INPUTS[toFill].displayName}
          childrenProps={ALL_INPUTS[toFill].children}
          iconPath={ALL_INPUTS[toFill].iconPath}
        />
      );
    } else if (toFill === 7) {
      itemsToRender.push(
        <BasicInfoHeight
          showDeleteIcon={showDeleteIcon}
          scrollToNext={this.scrollToNext}
          iconPath={ALL_INPUTS[toFill].iconPath}
        />
      );
    } else {
      itemsToRender.push(
        <BasicInfoOptions
          scrollToNext={this.scrollToNext}
          toFill={toFill}
          showDeleteIcon={showDeleteIcon}
          iconPath={ALL_INPUTS[toFill].iconPath}
        />
      );
    }

    ALL_INPUTS.map((item, itemId) => {
      if (itemId < 2) {
        const { children } = item;
        var count = 0;
        children.map(child => {
          const { data_key } = child;
          if (myData[data_key] && checkNullAndUndefined(myData[data_key])) {
            form[data_key] = myData[data_key];
          } else {
            ++count;
          }
        });
        if (count > 0 && toFill !== itemId) {
          itemsToRender.push(
            <BasicInfoTextinput
              showDeleteIcon={showDeleteIcon}
              scrollToNext={this.scrollToNext}
              displayName={ALL_INPUTS[itemId].displayName}
              childrenProps={ALL_INPUTS[itemId].children}
              iconPath={ALL_INPUTS[itemId].iconPath}
            />
          );
        }
      } else {
        const { data_key } = item;
        if (myData[data_key]) {
          form[data_key] = myData[data_key];
        } else {
          unFilledFields.push(itemId);
          if (itemId === 7 && toFill !== 7) {
            itemsToRender.push(
              <BasicInfoHeight
                showDeleteIcon={showDeleteIcon}
                scrollToNext={this.scrollToNext}
                iconPath={ALL_INPUTS[itemId].iconPath}
              />
            );
          } else if (toFill !== itemId) {
            itemsToRender.push(
              <BasicInfoOptions
                scrollToNext={this.scrollToNext}
                toFill={itemId}
                showDeleteIcon={showDeleteIcon}
                iconPath={ALL_INPUTS[itemId].iconPath}
              />
            );
          }
        }
      }
    });

    this.setState({
      unfilledIndexes: unFilledFields,
      toFill,
      user: myData,
      form,
      itemsToRender,
      showDeleteIcon
    });
  };

  scrollToNext = () => {
    const { currentItemIndex, itemsToRender } = this.state;
    const totalItemsInList = itemsToRender.length;
    if (currentItemIndex < totalItemsInList - 1) {
      const nextIndex = currentItemIndex + 1;
      this.scrollView.scrollTo({ x: nextIndex * DeviceWidth });
      this.setState({ showDeleteIcon: false, currentItemIndex: nextIndex });
    } else {
      this.closeUserDetailsFormModel();
    }
  };

  calculatePercentage = () => {
    const { myData } = this.props;
    let _perentage = 0;
    ALL_INPUTS.map((item, itemId) => {
      if (itemId < 2) {
        const { children } = item;
        var count = 0;
        children.map(child => {
          const { data_key } = child;
          if (myData[data_key] && checkNullAndUndefined(myData[data_key])) {
            ++count;
          }
        });
        if (count > 0) {
          ++_perentage;
        }
      } else {
        const { data_key } = item;
        if (myData[data_key]) {
          ++_perentage;
        }
      }
    });
    return _perentage / 11;
  };

  closeUserDetailsFormModel = () => {
    const { currentItemIndex, itemsToRender } = this.state;
    const { setModalVisible } = this.props;
    if (itemsToRender.length === 1) {
      setModalVisible(false);
    } else {
      if (currentItemIndex === itemsToRender.length) {
        setModalVisible(false);
      } else {
        Alert.alert(
          "Exit?",
          "Are you sure you want to fill these details later?",
          [
            {
              text: "Yes, let me fill later",
              onPress: () => {
                setModalVisible(false);
              }
            },
            {
              text: "Cancel",
              onPress: () => {}
            }
          ]
        );
      }
    }
  };

  render() {
    const { setModalVisible, visible } = this.props;
    const { showDeleteIcon } = this.state;
    const percentage = this.calculatePercentage();

    return (
      <View style={styles.baseLayout}>
        <View style={styles.cardView}>
          <View style={styles.progressLayout}>
            <ProgressBar
              animationType={"timing"}
              animationConfig={{
                duration: 500
              }}
              animated
              borderWidth={0}
              borderColor={"#0000"}
              unfilledColor={"rgb(220,220,220)"}
              color={PURPLE}
              progress={percentage}
              width={DeviceWidth * 0.92}
              height={4}
            />
          </View>
          <RowView style={styles.headerView}>
            <TouchableOpacity
              style={styles.closeButtonView}
              onPress={() => this.closeUserDetailsFormModel()}
            >
              <AntIcon size={25} name="close" color={"rgb(77,75,75)"} />
            </TouchableOpacity>
            <RowView>
              {this.state.showDeleteIcon ? (
                <TouchableOpacity
                  onPress={() => {
                    this.deleteCurrentField();
                  }}
                  style={{
                    ...styles.deleteIconView,
                    ...sharedStyles.justifiedCenter
                  }}
                >
                  <Octicons
                    name={"trashcan"}
                    color={"rgba(32,46,117,0.4)"}
                    size={18}
                  />
                </TouchableOpacity>
              ) : (
                <View />
              )}
              <TouchableOpacity
                style={styles.skipButtonView}
                onPress={this.scrollToNext}
              >
                <MediumText style={styles.skipText}>
                  {showDeleteIcon ? "Next" : "Skip"}
                </MediumText>
              </TouchableOpacity>
            </RowView>
          </RowView>

          <ScrollView
            pagingEnabled
            ref={ref => (this.scrollView = ref)}
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            horizontal
          >
            {this.state.itemsToRender.map((item, itemId) => {
              return <View key={itemId}>{item}</View>;
            })}
          </ScrollView>
        </View>
      </View>
    );
  }
}

export const styles = StyleSheet.create({
  progressLayout: {
    height: 4,
    width: DeviceWidth * 0.92,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignSelf: "center",
    marginVertical: 0
  },
  deleteIconView: {
    bottom: 5,
    left: LEFT_MARGIN / 2,
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    marginRight: LEFT_MARGIN
  },
  cancelButtonText: {
    color: FONT_GREY,
    fontSize: 16
  },
  heightButtonText: {
    color: PURPLE,
    fontSize: 16
  },
  heightSaveButtonView: {
    height: 30,
    width: DeviceWidth * 0.2,
    ...sharedStyles.justifiedCenter
  },
  cancelButtonView: {
    height: 30,
    width: DeviceWidth * 0.2,
    ...sharedStyles.justifiedCenter
  },
  heightButtonsRow: {
    justifyContent: "space-between",
    width: DeviceWidth,
    marginTop: LEFT_MARGIN,
    borderTopWidth: 1,
    borderBottomColor: "#cacaca50",
    borderBottomWidth: 1,
    borderTopColor: "#cacaca50",
    paddingVertical: LEFT_MARGIN / 3
  },
  selectedHeightText: {
    marginVertical: LEFT_MARGIN * 2,
    color: PURPLE,
    fontSize: 20
  },
  heightInputLayout: {
    width: DeviceWidth,
    alignItems: "center"
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
  baseLayout: {
    // flex: 1,
    height: DeviceHeight,

    alignItems: "flex-end",
    justifyContent: "flex-end"
  },
  cardView: {
    backgroundColor: "#ffffff",
    height: DeviceHeight * 0.75,
    width: DeviceWidth,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  headerView: {
    justifyContent: "space-between",
    padding: LEFT_MARGIN
  },
  closeButtonView: {
    height: 30,
    width: 30,
    ...sharedStyles.justifiedCenter
  },
  skipButtonView: {
    height: 30,
    width: DeviceWidth * 0.125,
    ...sharedStyles.justifiedCenter
  },
  skipText: {
    fontSize: 18,
    color: "rgb(32,46,117)"
  },
  scrollContainer: {
    minWidth: DeviceWidth
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
    deleteUserInfo: bindActionCreators(deleteUserInfo, dispatch),
    deleteContent: bindActionCreators(deleteContent, dispatch)
  };
};
export default connect(mapState, mapDispatches)(UserDetailsFormModal);
