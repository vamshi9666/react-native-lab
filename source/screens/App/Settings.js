import { connectActionSheet } from "@expo/react-native-action-sheet";
import React, { Component } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Modal
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Share from "react-native-share";
import Slider from "react-native-slider";
import SvgUri from "react-native-svg-uri";
import Ionicon from "react-native-vector-icons/Ionicons";
import ViewShot, { captureRef } from "react-native-view-shot";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { FONT_BLACK, LIGHT_PURPLE, PURPLE } from "../../../src/config/Colors";
import { DeviceHeight, DeviceWidth } from "../../../src/config/Device";
import ContactUs from "../../components/Settings/Contact";
import DeleteAccount from "../../components/Settings/Delete.account";
import License from "../../components/Settings/License";
import NotificationPreferenceModal from "../../components/Settings/Notification.settings";
import SignOutModal from "../../components/Settings/Signout.modal";
import SnoozeConfirmationModal from "../../components/Settings/SnoozeConfirmationModal";
import VerifyEmailModal from "../../components/Settings/VerifyEmail.modal";
import VerifyMobileModal from "../../components/Settings/VerifyMobile.modal";
import MediumText from "../../components/Texts/MediumText";
import CloserModal from "../../components/Views/Closer.modal";
import RowView from "../../components/Views/RowView";
import {
  BLUE,
  BRIGHT_RED,
  CORRECT_RESPONSE_GREEN,
  YELLOW
} from "../../config/Colors";
import { LEFT_MARGIN } from "../../config/Constants";
import { getTimeStamp } from "../../config/Utils";
import { getRooms, removeAllRooms } from "../../network/rooms";
import { getMyData, updateProfile } from "../../network/user";
import { setRooms, setRoomsArray } from "../../redux/actions/rooms";
import * as UserActions from "../../redux/actions/user.info";
import { sharedStyles } from "../../styles/Shared";
const PAGE_PADDING = DeviceWidth * 0.05;
const ONE_YEAR = 100 * 365 * 24 * 60 * 60;
const SNOOZE_TIME_OPTIONS = [
  {
    displayValue: "24  Hours",
    value: 24 * 60 * 60
  },
  {
    displayValue: "2 Days",
    value: 2 * 24 * 60 * 60
  },
  {
    displayValue: "A Week",
    value: 7 * 24 * 60 * 60
  },
  {
    displayValue: "Indefinite",
    value: ONE_YEAR
  }
];
const bottomItems = [
  {
    name: "FAQ",
    icon: require("../../assets/svgs/Settings/faq.svg"),
    bgColor: "#000"
  },
  {
    name: "Contact us",
    icon: require("../../assets/svgs/Settings/contact.svg"),
    bgColor: BRIGHT_RED
  },
  {
    name: "Privacy policy",
    icon: require("../../assets/svgs/Settings/privacy.svg"),
    bgColor: CORRECT_RESPONSE_GREEN
  },
  {
    name: "Terms of service",
    icon: require("../../assets/svgs/Settings/terms.svg"),
    bgColor: BLUE
  },
  {
    name: "Licenses",
    icon: require("../../assets/svgs/Settings/licenses.svg"),
    bgColor: YELLOW
  }
];

const genders = [
  {
    name: "Women",
    image: require("../../assets/images/female.png"),
    bgColor: "#6C63FF40"
  },
  {
    name: "Men",
    image: require("../../assets/images/male.png"),

    bgColor: "#F19E3C40"
  },
  {
    name: "Both",
    image: require("../../assets/images/trans.png"),
    bgColor: "#E4E5EA80"
  }
];

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: true,
      snoozeMode: false,
      displayName: true,
      vibrations: true,
      sounds: true,
      contactUsOpen: false,
      isModalVisible: false,
      signOutOpen: false,
      deleteAccountOpen: false,
      licenseOpen: false,
      updated: false,
      showVerifyMobileModal: false,
      showVerifyEmailModal: false,
      updatedFields: [],
      isNotificationSettingsModalVisible: false,

      //snooze
      isSnoozeConfirmationModalVisible: false,
      snoozeConfirmation: null
    };
  }
  onModalDidMount = () => {
    getMyData(cbUserData => {
      if (cbUserData.success) {
        this.props.setMyData(cbUserData.data);
      }
    });
  };

  handleBottomItemPress = itemId => {
    switch (itemId) {
      case 0:
        alert("Open Faq");
        break;

      case 1:
        this.setState({ contactUsOpen: true });
        this.openCloserModal();
        break;

      case 2:
        alert("Open Privacy Policy");
        break;

      case 3:
        alert("Open Terms of services");
        break;

      case 4:
        this.setState({ licenseOpen: true });
        this.openCloserModal();
        break;

      default:
        break;
    }
  };
  openCloserModal = () => {
    this.setState({ isModalVisible: true });
    this.refs["modalRef"].toggleBg(true);
  };
  closeCloserModal = () => {
    this.setState({ isModalVisible: false });
    this.refs["modalRef"].startAnimation(false);
    setTimeout(() => {
      this.refs["modalRef"].toggleBg(false);
    }, 300);
  };
  dismissContactUsModal = () => {
    this.setState({ contactUsOpen: false });
    this.closeCloserModal();
  };
  dismissSignOutModal = () => {
    this.setState({ signOutOpen: false });
    this.closeCloserModal();
  };
  dismissLicenseModal = () => {
    this.setState({ licenseOpen: false });
    this.closeCloserModal();
  };
  dismissDeleteAccountModal = () => {
    this.setState({ deleteAccountOpen: false });
    this.closeCloserModal();
  };

  dismissVerifyMobileModal = () => {
    this.closeCloserModal();
    this.setState({ showVerifyMobileModal: false });
  };

  verifyMobile = () => {
    this.setState({ showVerifyMobileModal: true }, () => {
      this.openCloserModal();
    });
  };

  dismissVerifyEmailModal = () => {
    this.closeCloserModal();
    this.setState({ showVerifyEmailModal: false });
  };

  verifyEmail = () => {
    this.setState({ showVerifyEmailModal: true }, () => {
      this.openCloserModal();
    });
  };

  shareApp = async () => {
    if (Platform.OS === "ios") {
      let shareOptions = {
        title: "Share App",
        // url,
        failOnCancel: false,
        message: `Here we will get the text content and store links https://google.com`
      };

      try {
        await Share.open(shareOptions);
      } catch (error) {
        console.log("Error =>", error);
        alert("Error while sharing " + error);
      }
    } else {
      captureRef(this.refs.poster, { result: "data-uri", quality: 0.6 }).then(
        async url => {
          let shareOptions = {
            title: "Share App",
            url,
            failOnCancel: false,
            message: `Here we will get the text content and store links https://google.com`
          };

          try {
            await Share.open(shareOptions);
          } catch (error) {
            console.log("Error =>", error);
            alert("Error while sharing " + error);
          }
          // this.props.onCapture(url);
        },
        err => {
          alert("error while capturing, " + err);
        }
      );
    }
  };
  handleSave = () => {
    const { updated, updatedFields } = this.state;
    const { myData, goBack } = this.props;

    if (updatedFields.length > 0) {
      let updates = {};
      updatedFields.forEach(fieldKey => {
        updates = {
          ...updates,
          [fieldKey]: myData[fieldKey]
        };
      });

      updateProfile(updates, updateRes => {
        console.log(" update res is ", updateRes);
        if (updateRes.success) {
          this.props.updateUser({
            ...updateRes.data
          });
        }
      });
    }

    goBack();
    //handle update
    // if (!updated) {
    //   this.props.navigation.goBack();
    // } else {
    //   const req = delete myData.password;
    //   UserApi.updateProfile({ ...myData }, updateResponse => {
    //     console.log("updateResponse", updateResponse);
    //     if (updateResponse.success) {
    //       // this.setState({updated: false})
    //       this.props.navigation.goBack();
    //       //getting old values instead of updated values , so not updating
    //       // this.props.updateUser(updateResponse.data);
    //     } else {
    //       alert(" error in updaating fields ");
    //     }
    //   });
    // }
  };
  handleSwitch = (key, val) => {
    const updatedFields = Object.assign([], this.state.updatedFields);
    if (key === "private" && val === true) {
      const afterConfirmation = () => {
        const optionDisplayValues = SNOOZE_TIME_OPTIONS.map(
          i => i.displayValue
        );
        console.log(" all options", optionDisplayValues);
        this.props.showActionSheetWithOptions(
          {
            options: [...optionDisplayValues, "Cancel"],
            cancelButtonIndex: optionDisplayValues.length,
            textStyle: {
              textAlign: "flex-start"
              // fontSize: 14
            }
            // destructiveButtonIndex: optionDisplayValues.length
          },
          optionIndex => {
            const isTappedCancel = optionIndex === optionDisplayValues.length;
            if (isTappedCancel) {
              console.log(" cancelled ");
              this.props.updateUserInfo("private", false);
              return;
            }
            removeAllRooms("PRIVATE", removeResult => {
              console.log(" remove resultis ", removeResult);
              if (removeResult.success) {
                getRooms(rooms => {
                  console.log(" all rooms response is ", rooms);
                  if (rooms.success) {
                    this.props.setRooms(rooms.data);
                    this.props.setRoomsArray(rooms.data);
                  }
                });
              }
            });
            const selectedOption = SNOOZE_TIME_OPTIONS[optionIndex];
            const privateExpiresAt = getTimeStamp() + selectedOption.value;
            this.props.updateUserInfo("privateExpiresAt", privateExpiresAt);
            if (!updatedFields.includes("privateExpiresAt")) {
              updatedFields.push("privateExpiresAt");
            }
          }
        );
      };
      this.setState(
        {
          isSnoozeConfirmationModalVisible: true,
          snoozeConfirmation: {
            successCallback: () => {
              afterConfirmation();
            },
            failureCallback: () => {
              this.props.updateUserInfo("private", false);
              console.log(" user cancelled ");
            }
          }
        },
        () => {
          this.openCloserModal();
        }
      );
    }
    if (!updatedFields.includes(key)) {
      updatedFields.push(key);
    }
    this.setState(
      {
        updatedFields
      },
      () => {
        console.log(" updated fields are ", updatedFields);
        this.props.updateUserInfo(key, val);
      }
    );
    // const updates = Object.assign({}, this.state.updates);
    // updates[key] = val;
    // this.setState({
    //   updates
    // });
  };
  renderViewShot = () => {
    return (
      <ViewShot
        style={{
          position: "absolute",
          transform: [
            {
              translateY: DeviceHeight
            }
          ]
        }}
        ref="poster"
      >
        <Image
          resizeMode={"center"}
          source={require("../../assets/images/testlaunch.jpg")}
          style={{
            width: DeviceWidth
          }}
        />
      </ViewShot>
    );
  };

  render() {
    const {
      sounds,
      vibrations,
      contactUsOpen,
      signOutOpen,
      deleteAccountOpen,
      isModalVisible,
      licenseOpen,
      showVerifyMobileModal,
      showVerifyEmailModal,
      isNotificationSettingsModalVisible,
      isSnoozeConfirmationModalVisible,
      snoozeConfirmation
    } = this.state;
    const { myData, goBack, showSettingsModal } = this.props;

    const isPrivate = myData && myData.private === true;
    // const isMobileThere = mobile_number !== (null || " ");
    // const isEmailThere = email !== (null || " ");
    return (
      <Modal
        transparent
        visible={showSettingsModal}
        animated
        animationType={"slide"}
        onShow={this.onModalDidMount}
      >
        <View style={styles.rootView}>
          {this.renderViewShot()}
          <CloserModal isModalVisible={isModalVisible} ref={"modalRef"}>
            {signOutOpen ? (
              <SignOutModal
                goBack={goBack}
                navigation={this.props.navigation}
                dismissSignOutModal={this.dismissSignOutModal}
              />
            ) : contactUsOpen ? (
              <ContactUs
                navigation={this.props.navigation}
                dismissContactUsModal={this.dismissContactUsModal}
              />
            ) : licenseOpen ? (
              <License
                navigation={this.props.navigation}
                dismissLicenseModal={this.dismissLicenseModal}
              />
            ) : deleteAccountOpen ? (
              <DeleteAccount
                goBack={goBack}
                navigation={this.props.navigation}
                dismissDeleteAccountModal={this.dismissDeleteAccountModal}
              />
            ) : showVerifyMobileModal ? (
              <VerifyMobileModal
                dismissVerifyMobileModal={this.dismissVerifyMobileModal}
              />
            ) : showVerifyEmailModal ? (
              <VerifyEmailModal
                dismissVerifyEmailModal={this.dismissVerifyEmailModal}
              />
            ) : isNotificationSettingsModalVisible ? (
              <NotificationPreferenceModal
                dismissNotificationPreferenceModal={() => {
                  this.closeCloserModal();
                  this.setState({ isNotificationSettingsModalVisible: false });
                }}
              />
            ) : isSnoozeConfirmationModalVisible ? (
              <SnoozeConfirmationModal
                goBack={accepted => {
                  this.closeCloserModal();
                  this.setState(
                    {
                      // test: "noe"
                      isSnoozeConfirmationModalVisible: false
                      // snoozeConfirmation: null
                    },

                    () => {
                      setTimeout(() => {
                        if (accepted) {
                          snoozeConfirmation.successCallback();
                        } else {
                          snoozeConfirmation.failureCallback();
                        }
                        this.setState({
                          snoozeConfirmation: null
                        });
                      }, 300);
                    }
                  );
                }}
              />
            ) : (
              <View />
            )}
          </CloserModal>

          {/* <LinearGradient
          style={styles.topLinearBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={[PURPLE, LIGHT_PURPLE]}
        /> */}
          <ScrollView
            contentContainerStyle={{
              alignItems: "center"
            }}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.baseLayout}>
              <View style={styles.SettingsHeaderView}>
                <Text style={styles.SettingsHeaderText}>Settings</Text>
                {/* <Ionicon
                onPress={() => this.props.navigation.goBack()}
                name={"ios-close"}
                color={"#707070"}
                size={35}
              /> */}
                <TouchableOpacity
                  onPress={this.handleSave}
                  style={styles.doneBtn}
                >
                  <Text style={styles.doneBtnText}> DONE </Text>
                </TouchableOpacity>
              </View>
              {/* Notification Switch */}
              <View style={styles.curvyBgStyle}>
                <Switch
                  style={{
                    marginTop: 10
                  }}
                  value={myData && myData.showName && myData.showName}
                  trackColor={{
                    false: "#E4E5EA",
                    true: "#FA9D44"
                  }}
                  onValueChange={
                    val => this.handleSwitch("showName", val)
                    // this.setState({ displayName: val })
                  }
                />
                <Text style={styles.itemHeaderText}>
                  Display Name only to Friends
                </Text>
                <Text style={styles.itemDescriptionText}>
                  You can choose to show your name. To others Only after they
                  become Friends
                </Text>
              </View>
              {/* Snooze Switch */}
              <View style={styles.curvyBgStyle}>
                <Switch
                  style={{
                    marginTop: 10
                  }}
                  value={isPrivate}
                  trackColor={{
                    false: "#E4E5EA",
                    true: "#202E75"
                  }}
                  onValueChange={val => this.handleSwitch("private", val)}
                />
                <Text style={styles.itemHeaderText}>Snooze Mode</Text>
                <Text style={styles.itemDescriptionText}>
                  Turning this on will hide you from people For as long as you
                  choose.your Existing Friends Accessable
                </Text>
              </View>
              {/* Sound settings */}
              <View style={styles.curvyBgStyle}>
                <Text style={styles.itemHeaderText}>Sound & vibrations</Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly"
                  }}
                >
                  <View style={{ alignItems: "center" }}>
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 15,
                        paddingHorizontal: 10,
                        fontWeight: "300"
                      }}
                    >
                      Enable App {"\n"} Vibrations
                    </Text>
                    <Switch
                      style={{
                        marginVertical: 15
                      }}
                      value={myData && myData.vibrationsEnabled === true}
                      trackColor={{
                        false: "#E4E5EA",
                        true: "#F86430"
                      }}
                      onValueChange={val =>
                        this.handleSwitch("vibrationsEnabled", val)
                      }
                    />
                  </View>
                  <View style={{ alignItems: "center" }}>
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 15,
                        paddingHorizontal: 10,
                        fontWeight: "300"
                      }}
                    >
                      Enable App {"\n"} Sounds
                    </Text>
                    <Switch
                      style={{
                        marginVertical: 15
                      }}
                      value={myData && myData.appSoundsEnabled === true}
                      trackColor={{
                        false: "#E4E5EA",
                        true: "#0F6494"
                      }}
                      onValueChange={val =>
                        this.handleSwitch("appSoundsEnabled", val)
                      }
                    />
                  </View>
                </View>
              </View>
              <Text style={styles.sideHeaderText}>Secure your account</Text>
              {/* Phone Number */}
              <Text style={styles.sideSubHeaderText}>Phone Number</Text>

              <View style={styles.curvyBgStyleTypetwo}>
                <TouchableOpacity
                  onPress={this.verifyMobile}
                  style={styles.rowSpaceView}
                >
                  <Text
                    style={{ color: "#1E2432", fontSize: 15, marginTop: 8 }}
                  >
                    {myData && myData.mobile_number && myData.mobile_number}
                  </Text>
                  <Ionicon
                    name={"ios-arrow-forward"}
                    size={30}
                    color={"#C2C4CA"}
                  />
                </TouchableOpacity>
              </View>

              {/* Email */}
              <Text style={styles.sideSubHeaderText}>Email</Text>
              <View style={styles.curvyBgStyleTypetwo}>
                <TouchableOpacity
                  onPress={this.verifyEmail}
                  style={styles.rowSpaceView}
                >
                  <MediumText
                    style={{ color: "#1E2432", fontSize: 15, marginTop: 2 }}
                  >
                    {myData && myData.email && myData.email}
                  </MediumText>
                  <Ionicon
                    name={"ios-arrow-forward"}
                    size={22}
                    color={"#C2C4CA"}
                  />
                </TouchableOpacity>
              </View>

              {/* Connect With Section */}
              <View style={styles.curvyBgStyle}>
                <Text style={styles.itemHeaderText}>Connect with</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {genders.map((gender, genderId) => (
                    <View key={genderId}>
                      <View
                        style={{
                          height: 50,
                          width: 50,
                          borderRadius: 25,
                          backgroundColor: gender.bgColor,
                          alignItems: "center",
                          justifyContent: "center",
                          marginHorizontal: 10
                        }}
                      >
                        <Image
                          style={{
                            height: 30,
                            width: 25
                          }}
                          source={gender.image}
                        />
                      </View>
                      <Text
                        style={{
                          textAlign: "center",
                          marginTop: 10,
                          color: "#1E2432",
                          marginBottom: 10
                        }}
                      >
                        {gender.name}
                      </Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.itemDescriptionText}>
                  You can choose whoever you want to connect with
                </Text>
              </View>
              {/* Age range   */}
              <View style={styles.curvyBgStyle}>
                <Text style={styles.itemHeaderText}>Age range</Text>
                <Slider
                  style={{ width: DeviceWidth / 2 }}
                  minimumTrackTintColor={"#FF2D55"}
                  maximumTrackTintColor={"#FF2D5520"}
                  thumbStyle={{
                    backgroundColor: "#FF2D55"
                  }}
                  value={0.3}
                  onValueChange={value => this.setState({ value })}
                />
                <Text style={styles.itemDescriptionText}>
                  This Enables you to choose People of specific range
                </Text>
              </View>
              {/* Distance settings */}
              <View style={styles.curvyBgStyle}>
                <Text style={styles.itemHeaderText}>Distance</Text>
                <Slider
                  style={{ width: DeviceWidth / 2 }}
                  minimumTrackTintColor={"#10D3D3"}
                  maximumTrackTintColor={"#10D3D320"}
                  thumbStyle={{
                    backgroundColor: "#10D3D3"
                  }}
                  value={0.3}
                  onValueChange={value => this.setState({ value })}
                />
                <Text style={styles.itemDescriptionText}>
                  This Enables you to choose People of specific range
                </Text>
              </View>
              {/* Daily requests */}
              <View style={styles.curvyBgStyle}>
                <Text style={styles.itemHeaderText}>Daily requests</Text>
                <Slider
                  style={{ width: DeviceWidth / 2 }}
                  minimumTrackTintColor={"#774CD5"}
                  maximumTrackTintColor={"#774CD520"}
                  thumbStyle={{
                    backgroundColor: "#774CD5"
                  }}
                  value={0.3}
                  onValueChange={value => this.setState({ value })}
                />
                <Text style={styles.itemDescriptionText}>
                  You can set Number of Requests per day
                </Text>
              </View>
              {/* Display Name Settings */}

              <Text style={styles.sideHeaderText}>Notifications</Text>
              <View style={styles.curvyBgStyleTypetwo}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      isNotificationSettingsModalVisible: true
                    });
                    this.openCloserModal();
                  }}
                  style={[
                    styles.rowSpaceView,
                    { paddingVertical: 6, alignItems: "center" }
                  ]}
                >
                  <Text style={{ color: "#1E2432", fontSize: 15 }}>
                    Edit Preferences
                  </Text>
                  <Ionicon
                    name={"ios-arrow-forward"}
                    size={22}
                    color={"#C2C4CA"}
                  />
                </TouchableOpacity>
              </View>

              {/* Faq,Contact Us, privacy policy */}
              <View style={styles.curvyBgStyleTypetwo}>
                {bottomItems.map((item, itemId) => {
                  const _isLast = itemId === 4;
                  return (
                    <TouchableOpacity
                      onPress={() => this.handleBottomItemPress(itemId)}
                      key={itemId}
                      style={{
                        justifyContent: "space-between",
                        borderBottomColor: "#9b9b9b50",
                        marginVertical: 5,
                        flexDirection: "row",
                        borderBottomWidth: _isLast ? 0 : 0.5
                      }}
                    >
                      <RowView style={styles.reasonFristHalf}>
                        <View
                          style={{
                            marginHorizontal: LEFT_MARGIN / 2
                          }}
                        >
                          <SvgUri height={25} width={25} source={item.icon} />
                        </View>

                        <MediumText style={styles.reasonText}>
                          {item.name}
                        </MediumText>
                      </RowView>
                      <View style={sharedStyles.justifiedCenter}>
                        <Ionicon
                          name={"ios-arrow-forward"}
                          size={25}
                          color={"#C2C4CA"}
                          style={{
                            transform: [
                              {
                                translateX: -10
                              }
                            ]
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TouchableOpacity onPress={this.shareApp}>
                <LinearGradient
                  style={styles.shareCloserView}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 0, y: 0 }}
                  colors={[PURPLE, LIGHT_PURPLE]}
                >
                  <Text
                    style={[
                      {
                        color: "#fff"
                      },
                      styles.buttonText
                    ]}
                  >
                    SHARE CLOSER APP
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.signOutButton}
                onPress={() => {
                  this.setState({ signOutOpen: true });
                  this.openCloserModal();
                }}
              >
                <Text
                  style={[
                    {
                      color: "#6C63FF"
                    },
                    styles.buttonText
                  ]}
                >
                  Signout
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  this.setState({ deleteAccountOpen: true });
                  this.openCloserModal();
                }}
              >
                <Text
                  style={[
                    {
                      color: "#7D4CD4"
                    },
                    styles.buttonText
                  ]}
                >
                  Delete Account
                </Text>
              </TouchableOpacity>
              <View style={styles.footerView}>
                <Image
                  style={styles.logoImage}
                  source={require("../../assets/images/Applogo.png")}
                />
                <View style={styles.logoVersionView}>
                  <Text style={styles.closerText}>Closer</Text>
                  <Text style={styles.versionText}>Version V1.0</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  reasonText: {
    fontSize: 16,
    color: FONT_BLACK
  },
  reasonIcon: {
    height: 30,
    width: 30,
    borderRadius: 5,
    marginHorizontal: LEFT_MARGIN / 2
  },
  reasonFristHalf: {
    width: DeviceWidth * 0.6,
    alignItems: "center",
    justifyContent: "flex-start",
    height: 40
  },
  reasonRowView: {
    justifyContent: "space-between",
    borderBottomColor: "#9b9b9b50",
    marginVertical: 5,
    flexDirection: "row"
  },
  signOutButton: {
    borderRadius: 30,
    marginHorizontal: 20,
    backgroundColor: "#6C63FF51",
    marginTop: 15
  },
  doneBtn: {
    justifyContent: "center",
    alignItems: "center"
    // backgroundColor: "green"
  },
  deleteButton: {
    borderRadius: 30,
    marginHorizontal: 20,
    backgroundColor: "#fff",
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#7D4CD4"
  },
  buttonText: {
    textAlign: "center",
    fontSize: 17,
    paddingVertical: 12
  },
  shareCloserView: {
    borderRadius: 30,
    marginHorizontal: 20,
    marginTop: 5
  },
  logoImage: {
    height: 60,
    width: 60
  },
  logoVersionView: {
    flexDirection: "column",
    marginLeft: 10
  },
  closerText: {
    fontSize: 23,
    color: "#000"
  },
  versionText: {
    fontSize: 12,
    color: "#9B9B9B",
    marginTop: 5
  },
  footerView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: PAGE_PADDING,
    marginBottom: 50
  },
  rowIconAndSpaceView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
    borderBottomColor: "#F2F3F6",
    paddingHorizontal: 10,
    paddingVertical: 2
  },
  rowSpaceView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 15
  },
  curvyBgStyleTypetwo: {
    borderColor: "#E4E5EA",
    borderWidth: 1,
    borderRadius: 15,
    marginHorizontal: PAGE_PADDING,
    backgroundColor: "#fff",
    marginVertical: DeviceWidth * 0.02
  },
  sideSubHeaderText: {
    fontSize: 18,
    color: "#4D4B4B",
    marginLeft: 20,
    marginTop: 10,
    fontWeight: "400"
  },
  sideHeaderText: {
    fontSize: 20,
    color: "#000000",
    marginLeft: 20,
    marginVertical: 10
  },
  doneBtnText: {
    fontSize: 20,
    color: LIGHT_PURPLE,
    fontWeight: "700"
  },
  itemDescriptionText: {
    textAlign: "center",
    color: "#9B9B9B",
    marginBottom: 10,
    paddingHorizontal: 10
  },
  itemHeaderText: {
    fontSize: 20,
    color: "#000000",
    paddingVertical: 15,
    fontWeight: "500",
    textAlign: "center"
  },
  curvyBgStyle: {
    borderColor: "#E4E5EA",
    borderWidth: 1,
    alignItems: "center",
    borderRadius: 15,
    marginHorizontal: PAGE_PADDING,
    backgroundColor: "#fff",
    marginVertical: DeviceWidth * 0.02
  },
  SettingsHeaderText: {
    fontSize: 22,
    color: "#1E2432",
    fontWeight: "600"
  },
  SettingsHeaderView: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "#E4E5EA",
    borderBottomWidth: 0.5,
    paddingHorizontal: PAGE_PADDING,
    marginBottom: DeviceWidth * 0.02
  },
  rootView: {
    flex: 1,
    backgroundColor: "#0000",
    marginBottom: 0
  },
  baseLayout: {
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingVertical: PAGE_PADDING,
    width: DeviceWidth * 0.9,
    transform: [{ translateY: DeviceWidth * 0.075 }]
  },
  topLinearBackground: {
    paddingTop: PAGE_PADDING,
    zIndex: -1,
    height: DeviceHeight * 0.25,
    width: DeviceWidth,
    shadowColor: "#000",
    shadowOffset: {
      height: 3,
      width: 0
    },
    shadowOpacity: 1,
    position: "absolute",
    top: 0
  }
});

const mapStates = state => {
  return {
    myData: state.info.userInfo
  };
};

const mapDispatches = dispatch => {
  return {
    updateUser: bindActionCreators(UserActions.updateOwnProfile, dispatch),
    updateUserInfo: bindActionCreators(UserActions.addUserInfo, dispatch),
    setMyData: bindActionCreators(UserActions.initDump, dispatch),
    setRooms: bindActionCreators(setRooms, dispatch),
    setRoomsArray: bindActionCreators(setRoomsArray, dispatch)
  };
};
const withRedux = connect(mapStates, mapDispatches)(Settings);

export default connectActionSheet(withRedux);
