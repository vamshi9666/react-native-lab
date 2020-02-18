import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch
} from "react-native";
import NoFeedbackTapView from "../Views/NoFeedbackTapView";
import Ionicon from "react-native-vector-icons/Ionicons";
import { FONT_GREY, FONT_BLACK } from "../../config/Colors";
import { LEFT_MARGIN } from "../../config/Constants";
import { DeviceWidth, DeviceHeight } from "../../config/Device";
import MediumText from "../Texts/MediumText";
import RegularText from "../Texts/RegularText";
import RowView from "../Views/RowView";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { addUserInfo, updateOwnProfile } from "../../redux/actions/user.info";
import { updateProfile } from "../../network/user";
const items = [
  "sentSection",
  "receivedSection",
  "messages",
  "awesomeStuff",
  "teamCloser"
];

const obj = {
  sentSection: {
    pushNotification: true,
    inAppNotification: true,
    email: true
  },
  receivedSection: {
    pushNotification: true,
    inAppNotification: true,
    email: true
  },
  messages: {
    pushNotification: true,
    inAppNotification: true,
    email: true
  },
  awesomeStuff: {
    pushNotification: true,
    inAppNotification: true,
    email: true
  },
  teamCloser: {
    pushNotification: true,
    email: true
  }
};

class NotificationPreferenceModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSecondScreen: false,
      selectedItem: null,
      updates: [],
      updated: false,
      selectedIndex: null
    };
  }

  componentDidMount = () => {};

  openSpecificPage = (selectedItem, selectedIndex) => {
    console.log(" selected item si s", selectedItem);
    this.setState({
      selectedItem,
      selectedIndex
    });
    this.moveForward();
  };

  moveBack = () => {
    if (this.state.updated) {
      const { myData } = this.props;
      updateProfile(
        {
          notificationPermission: myData.notificationPermission
        },
        updateResult => {
          console.log("update result is ", updateResult);
          if (updateResult.success) {
            this.props.updateOwnProfile({
              ...updateResult.data
            });
          }
        }
      );
    }
    this.scrollRef.scrollTo({ x: 0 });
    this.setState({ showSecondScreen: false });
  };

  moveForward = () => {
    this.scrollRef.scrollTo({ x: DeviceWidth });
    this.setState({ showSecondScreen: true });
  };

  handleTopBarTap = () => {
    const { showSecondScreen } = this.state;
    if (showSecondScreen) {
      this.moveBack();
    } else {
      this.props.dismissNotificationPreferenceModal();
    }
  };

  handleSwitch = (optionIndex, dataKey, val) => {
    if (!this.state.updated) {
      this.setState({
        updated: true
      });
    }
    const { selectedIndex } = this.state;
    const {
      myData: { notificationPermission = [] }
    } = this.props;
    const newNotificationPermission = Object.assign([], notificationPermission);
    // const newNotificationPermission = notificationPermission.map(
    //   (obj, index) => {
    //     if (index === selectedIndex) {
    //       const options = obj.children.map((option, optIndex) => {
    //         if (optIndex === optionIndex) {
    //           return {
    //             ...option,
    //             isActive: val
    //           };
    //         }
    //         return option;
    //       });
    //       return {
    //         ...obj,
    //         children: options
    //       };
    //     }
    //     return obj;
    //   }
    // );
    newNotificationPermission[selectedIndex].children[
      optionIndex
    ].isActive = val;
    console.log(" new one are ", newNotificationPermission);
    this.props.addUserInfo("notificationPermission", newNotificationPermission);

    // let updates = Object.assign([],this.state.updates)
    // updates[]

    // updateProfile()
  };

  render() {
    const { myData } = this.props;
    const { notificationPermission = [] } = myData;
    const { showSecondScreen, selectedItem } = this.state;

    return (
      <View style={styles.baseLayout}>
        <NoFeedbackTapView
          onPress={this.handleTopBarTap}
          style={{
            ...styles.topRowView,
            flexDirection: showSecondScreen ? "row-reverse" : "row",
            justifyContent: showSecondScreen ? "flex-end" : "space-between"
          }}
        >
          <Text style={styles.headerText}>
            {showSecondScreen ? selectedItem.label : "Notification Preferences"}
          </Text>
          <Ionicon
            style={{
              marginTop: showSecondScreen ? 0 : -5,
              marginRight: showSecondScreen ? 10 : 0
            }}
            name={showSecondScreen ? "ios-arrow-back" : "ios-close"}
            color={"#707070"}
            size={showSecondScreen ? 30 : 35}
          />
        </NoFeedbackTapView>
        <ScrollView
          scrollEnabled={false}
          ref={ref => (this.scrollRef = ref)}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <View
            style={{
              width: DeviceWidth
            }}
          >
            <MediumText style={styles.topDesc}>
              Choose what activity matters to you to keep in touch with.
            </MediumText>
            <RegularText style={styles.labelText}>Notifications</RegularText>
            {notificationPermission.map((item, itemId) => (
              <View key={itemId}>
                <TouchableOpacity
                  onPress={() => this.openSpecificPage(item, itemId)}
                >
                  <RowView style={styles.buttonView}>
                    <MediumText style={styles.buttonText}>
                      {item.label}
                    </MediumText>
                    <Ionicon
                      name={"ios-arrow-forward"}
                      size={22}
                      color={"#C2C4CA"}
                    />
                  </RowView>
                </TouchableOpacity>
              </View>
            ))}
          </View>
          {/* On Selecting Specific Item */}
          <View
            style={{
              width: DeviceWidth
            }}
          >
            <MediumText style={styles.topDesc}>
              Turning these off might mean you miss alerts from your connections
            </MediumText>
            {selectedItem &&
              Array.isArray(selectedItem.children) &&
              selectedItem.children.map((option, optionIndex) => {
                return (
                  <RowView
                    key={optionIndex}
                    style={{
                      ...styles.buttonView,
                      padding: 10,
                      paddingHorizontal: 10,
                      alignItems: "center"
                    }}
                  >
                    <MediumText style={styles.buttonText}>
                      {option.label}
                    </MediumText>
                    <Switch
                      value={option.isActive}
                      trackColor={{
                        false: "#E4E5EA",
                        true: "#202E75"
                      }}
                      onValueChange={val =>
                        this.handleSwitch(optionIndex, option.dataKey, val)
                      }
                    />
                  </RowView>
                );
              })}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonText: {
    color: FONT_BLACK,
    fontSize: 17,
    alignSelf: "center"
  },
  topDesc: {
    color: FONT_GREY,
    textAlign: "center",
    fontSize: 18,
    paddingHorizontal: 20
  },
  buttonView: {
    borderColor: "#E4E5EA",
    borderWidth: 1,
    borderRadius: 30,
    marginHorizontal: 20,
    backgroundColor: "#fff",
    marginVertical: DeviceWidth * 0.02,
    justifyContent: "space-between",
    padding: 15
  },
  labelText: {
    fontSize: 14,
    color: FONT_GREY,
    marginLeft: LEFT_MARGIN * 2,
    marginTop: LEFT_MARGIN
  },
  inputField: {
    paddingLeft: LEFT_MARGIN / 1.5,
    marginLeft: 0,
    alignSelf: "center",
    fontSize: 20,
    color: "#242E42",
    fontFamily: "Proxima Nova",
    flex: 1
  },
  headerText: {
    fontSize: 23,
    color: "#1E2432",
    fontWeight: "600",
    marginLeft: 0,
    marginBottom: 0
  },
  topRowView: {
    borderBottomColor: "#E4E5EA",
    borderBottomWidth: 0.5,
    paddingHorizontal: 20,
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between"
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
    addUserInfo: bindActionCreators(addUserInfo, dispatch),
    updateOwnProfile: bindActionCreators(updateOwnProfile, dispatch)
  };
};
export default connect(mapStates, mapDispatches)(NotificationPreferenceModal);
