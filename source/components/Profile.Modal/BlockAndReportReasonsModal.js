import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  TextInput,
  ActivityIndicator
} from "react-native";
import * as UserApi from "../../network/user";
import { connect } from "react-redux";
// import Modal from "react-native-modal";
import BoldText from "./../Texts/BoldText";
import { FONT_GREY, BACKGROUND_GREY, BLACK } from "../../../src/config/Colors";
import { WHITE } from "../../../src/styles/colors";
import Ionicon from "react-native-vector-icons/Ionicons";
import { DeviceHeight } from "../../../src/config/Device";
import { DeviceWidth } from "../../config/Device";
import {
  greyTheme,
  PURPLE,
  FONT_BLACK,
  NEW_GREY,
  BRIGHT_RED
} from "../../config/Colors";
import { bindActionCreators } from "redux";
import * as RoomActions from "../../redux/actions/rooms";
import * as ProfileActions from "../../redux/actions/profiles";
import MediumText from "../Texts/MediumText";
import RowView from "../Views/RowView";
import { LEFT_MARGIN } from "../../config/Constants";
import RegularText from "../Texts/RegularText";
import JustifiedCenteredView from "../Views/JustifiedCenteredView";
import RoundedEdgeButton from "../Buttons/RoundedEdgeButton";
import { sharedStyles } from "../../styles/Shared";

class BlockAndReportModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reportBody: "",
      reasonId: null,
      reportLoading: false
      // _isDisabled: true
    };
    this.scrollRef = React.createRef();
  }

  reportUser = () => {
    const { myData, victimId, closeWhole, onClose } = this.props;
    const { reasonId, reportBody } = this.state;
    console.log("myda ta is ", myData);
    this.setState({
      reportLoading: true
    });
    UserApi.blockOneUser(
      {
        blockedBy: myData._id,
        user: victimId,
        reason: reasonId,
        reasonBody: reportBody
      },
      blockedResponse => {
        console.log(" blocked response is ", blockedResponse);
        if (blockedResponse.success) {
          this.setState(
            {
              reportLoading: false
            },
            () => {
              this.closeFormView();
              onClose(blockedResponse.data);
            }
          );
          // if (roomId !== "") {
          //   this.props.removeBlockedUserFromRooms(roomId, blockedResponse.data);
          // } else {
          //   this.props.removeOneBlockedUserFromProfiles(
          //     blockedResponse.data.user
          //   );
          // }
          // closeWhole();
        } else {
          alert(" error in blocked the user ");
        }
      }
    );
  };
  onSelectReason = reasonId => {
    this.setState(
      {
        reasonId
      },
      () => {
        this.scrollRef.scrollTo({ x: DeviceWidth, animated: true });
      }
    );
  };

  closeFormView = () => {
    this.scrollRef.scrollTo({ x: 0, animated: true });
  };
  render() {
    const { hideModal, reasons, nav, onSelect, blocker, victim } = this.props;
    const { reportBody, reportLoading } = this.state;
    const _isDisabled = reportBody.toString().length === 0;
    return (
      <View style={styles.baseLayout}>
        <View style={styles.bottomCardLayout}>
          <ScrollView
            scrollEnabled={false}
            horizontal
            showsHorizontalScrollIndicator={false}
            ref={ref => (this.scrollRef = ref)}
          >
            <View style={{ width: DeviceWidth }}>
              <RowView style={styles.headerView}>
                <BoldText style={{ ...styles.headerText, color: "#fff" }}>
                  What’s wrong with this profile ?
                </BoldText>
                <TouchableOpacity
                  style={{
                    marginTop: -5
                  }}
                  onPress={hideModal}
                >
                  <Ionicon name={"md-close"} color={FONT_GREY} size={25} />
                </TouchableOpacity>
              </RowView>
              <BoldText
                style={{
                  ...styles.headerText,
                  textAlign: "center",
                  marginTop: LEFT_MARGIN
                }}
              >
                What’s wrong with this profile ?
              </BoldText>
              <MediumText style={styles.topDescText}>
                Help us keep the platform safe by telling us why you are
                blocking this user.
              </MediumText>
              <RegularText style={styles.anoanymousText}>
                Don’t worry, this is Anonymous!
              </RegularText>

              <View style={styles.reasonsView}>
                {reasons &&
                  reasons.length > 0 &&
                  reasons.map((reason, reasonIndex) => {
                    const _isLast = reasonIndex === reasons.length - 1;
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          this.onSelectReason(reason._id);
                        }}
                        key={reasonIndex}
                        style={{
                          ...styles.reasonRowView,
                          borderBottomWidth: _isLast ? 0 : 0.5
                        }}
                      >
                        <RowView style={styles.reasonFristHalf}>
                          <View style={styles.reasonIcon} />
                          <MediumText style={styles.reasonText}>
                            {reason.text}
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
            </View>

            <View style={{ width: DeviceWidth }}>
              <RowView style={styles.headerTwoView}>
                <TouchableOpacity
                  style={{ marginHorizontal: LEFT_MARGIN }}
                  onPress={() => this.closeFormView()}
                >
                  <Ionicon
                    name={"ios-arrow-back"}
                    color={FONT_GREY}
                    size={25}
                    style={{
                      marginTop: -5
                    }}
                  />
                </TouchableOpacity>
                <BoldText style={styles.tellUsText}>Tell us more</BoldText>
              </RowView>
              <MediumText style={styles.headerTwoText}>
                Tell us what Happened So we can keep our Community safe
              </MediumText>
              <View style={styles.inputView}>
                <TextInput
                  value={reportBody}
                  maxLength={300}
                  onChangeText={text => this.setState({ reportBody: text })}
                  multiline={true}
                  style={styles.textInput}
                />
                <RegularText
                  style={{
                    right: 10,
                    position: "absolute",
                    bottom: 10,
                    color: FONT_GREY
                  }}
                >
                  {300 - reportBody.length}
                </RegularText>
              </View>
              <RoundedEdgeButton
                disabled={_isDisabled || reportLoading}
                style={{
                  backgroundColor: _isDisabled ? NEW_GREY : BRIGHT_RED,
                  ...styles.submitView
                }}
                onPress={() => {
                  this.reportUser();
                }}
              >
                {reportLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <MediumText style={styles.submitText}>
                    Submit your Report
                  </MediumText>
                )}
              </RoundedEdgeButton>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerText: {
    color: PURPLE,
    fontSize: 20
  },
  headerTwoView: {
    borderBottomColor: "#9b9b9b30",
    borderBottomWidth: 1,
    height: 40
  },
  tellUsText: {
    fontSize: 20,
    color: FONT_BLACK,
    marginLeft: LEFT_MARGIN
  },
  headerTwoText: {
    paddingVertical: LEFT_MARGIN,
    paddingHorizontal: LEFT_MARGIN * 2,
    color: FONT_BLACK,
    fontSize: 18
  },
  inputView: {
    width: "80%",
    height: "37.5%",
    marginBottom: LEFT_MARGIN,
    alignSelf: "center"
  },
  submitView: {
    height: 40,
    alignSelf: "center",
    width: "80%"
  },
  submitText: {
    fontSize: 16,
    color: "#fff"
  },
  reasonText: {
    fontSize: 16,
    color: FONT_BLACK
  },
  reasonIcon: {
    height: 30,
    width: 30,
    borderRadius: 10,
    backgroundColor: "#6C63FF51",
    marginHorizontal: LEFT_MARGIN / 2
  },
  reasonFristHalf: {
    width: DeviceWidth * 0.8,
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
  textInput: {
    paddingHorizontal: 26,
    paddingTop: 22,
    flex: 1,
    borderRadius: 20,
    backgroundColor: BACKGROUND_GREY,
    color: FONT_GREY
  },
  baseLayout: {
    flex: 1,
    backgroundColor: "#0000",
    justifyContent: "flex-end"
  },
  bottomCardLayout: {
    backgroundColor: "rgb(255,255,255)",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingTop: LEFT_MARGIN
  },
  headerView: {
    justifyContent: "space-between",
    marginHorizontal: LEFT_MARGIN
  },
  topDescText: {
    fontSize: 18,
    color: "rgb(77, 75, 75)",
    textAlign: "center",
    margin: LEFT_MARGIN
  },
  anoanymousText: {
    fontSize: 16,
    color: FONT_GREY,
    textAlign: "center",
    marginBottom: LEFT_MARGIN
  },
  reasonsView: {
    borderColor: "#E4E5EA",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginTop: DeviceWidth * 0.02,
    width: DeviceWidth * 0.9,
    alignSelf: "center"
  }
});

const mapState = state => {
  return {
    myData: state.info.userInfo
  };
};
const mapDispatch = dispatch => {
  return {
    removeBlockedUserFromRooms: bindActionCreators(
      RoomActions.removeOneRoom,
      dispatch
    ),
    removeOneBlockedUserFromProfiles: bindActionCreators(
      ProfileActions.removeUserFromProfiles,
      dispatch
    )
  };
};
export default connect(mapState, mapDispatch)(BlockAndReportModal);
