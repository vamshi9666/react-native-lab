import React from "react";

import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet
} from "react-native";
import { DeviceWidth, DeviceHeight } from "../../config/Device";
import {
  BLACK,
  BACKGROUND_GREY,
  FONT_GREY,
  greyTheme,
  WHITE
} from "../../config/Colors";
import Ionicon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as UserActions from "../../redux/actions/user.info";
import * as ProfileActions from "../../redux/actions/profiles";
import * as RoomActions from "../../redux/actions/rooms";
import * as UserApi from "../../network/user";
class BlockAndReportScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reportBody: "",
      showConfirmationModal: false
    };
  }

  reportUser = () => {
    const {
      victim,
      reasonId,
      //   fromChat = false,
      roomId = ""
    } = this.props.navigation.state.params;
    console.log(" about to block ", myData);
    const { myData } = this.props;
    UserApi.blockOneUser(
      {
        blockedBy: myData._id,
        user: victim,
        reason: reasonId,
        reasonBody: this.state.reportBody
      },
      blockedResponse => {
        console.log(" blocked response is ", blockedResponse);
        if (blockedResponse.success) {
          if (roomId !== "") {
            this.prop.removeBlockedUserFromRooms(roomId, blockedResponse.data);
          } else {
            this.props.removeOneBlockedUserFromProfiles(blockedResponse.data);
          }
          this.props.navigation.goBack();
        } else {
          alert(" error in blocked the user ");
        }
      }
    );
    // return;
    // this.props
    //   .blockOneUser({
    //     blockedBy: myData.data._id,
    //     user: victim,
    //     reason: reasonId,
    //     reasonBody: this.state.reportBody
    //   })
    //   .then(() => {
    //     const { blockOneUserResult } = this.props;
    //     console.log(" block one user result us >>>>>", blockOneUserResult);
    //     if (blockOneUserResult.success) {
    //       this.setState(
    //         {
    //           showConfirmationModal: false
    //         },
    //         () => {
    //           this.props.navigation.goBack();
    //         }
    //       );
    //     } else {
    //       alert(" error in blocking one user");
    //     }
    //   });
  };
  cancelReporting = () => {
    this.setState({
      showConfirmationModal: false
    });
  };

  render() {
    const { reportBody, showConfirmationModal } = this.state;
    // const
    return (
      <View style={[styles.parentCon]}>
        <Modal isVisible={showConfirmationModal}>
          <View style={[styles.visibleCon]}>
            <Text style={[styles.headerText]}> Are you sure ? </Text>
            <View style={[styles.optionsCon]}>
              <TouchableOpacity
                onPress={() => this.reportUser()}
                style={[styles.confirmBtn, { backgroundColor: "red" }]}
              >
                <Text style={[styles.confirmText]}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.cancelReporting();
                }}
                style={[styles.confirmBtn, { backgroundColor: "green" }]}
              >
                <Text style={[styles.confirmText]}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={[styles.textSectionCon]}>
          <View style={[styles.headingCon]}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "600",
                color: BLACK,
                marginBottom: 32
              }}
            >
              Tell Us More
            </Text>

            <Ionicon
              style={{
                position: "absolute",
                right: 0,
                top: -10
              }}
              onPress={() => this.props.navigation.goBack()}
              name="ios-close"
              size={40}
              color={BLACK}
            />
          </View>
          <Text
            style={{
              textAlign: "left",
              fontSize: 20,
              fontWeight: "500"
            }}
          >
            Tell us what happened so we can keep our comunity safe{" "}
          </Text>
        </View>
        <View style={[styles.textInputCon]}>
          <TextInput
            value={reportBody}
            onChangeText={text => this.setState({ reportBody: text })}
            multiline={true}
            style={[styles.textInput]}
          />
        </View>
        <TouchableOpacity
          disabled={reportBody === ""}
          style={{
            backgroundColor: reportBody === "" ? greyTheme : "red",
            borderRadius: 10
          }}
          onPress={() => {
            this.reportUser();
          }}
        >
          <Text style={[styles.btnText]}>REPORT</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  parentCon: {
    width: DeviceWidth,
    flex: 1,
    backgroundColor: WHITE,
    alignItems: "center"
  },
  textSectionCon: {
    marginTop: 32,
    paddingHorizontal: 40,
    alignItems: "center",
    width: "100%"
  },
  headingCon: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center"
  },
  optionsCon: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-evenly",
    width: "100%"
  },
  textInput: {
    paddingHorizontal: 26,
    paddingTop: 22,
    //   paddingVertical: 26,
    flex: 1,
    borderRadius: 20,
    backgroundColor: BACKGROUND_GREY,
    color: FONT_GREY
  },
  textInputCon: {
    width: "80%",
    // flex: 1,,
    marginVertical: 32,
    height: DeviceHeight * 0.3
  },
  btnText: {
    fontSize: 24,
    fontWeight: "600",
    color: WHITE,
    marginHorizontal: 20,
    marginVertical: 10
  },
  confirmBtn: {
    borderRadius: 10,
    padding: 10
  },
  confirmText: {
    marginHorizontal: 20,
    fontSize: 20,
    color: WHITE
  },
  headerText: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 30
  },
  visibleCon: {
    borderRadius: 20,
    backgroundColor: WHITE,
    alignItems: "center",
    paddingVertical: 20
  }
});

const mapStateToProps = state => {
  return {
    myData: state.info.userInfo
  };
};
const mapDispatchToProps = dispatch => {
  return {
    // blockOneUser: bindActionCreators(UserActions.blockOneUser, dispatch),
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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BlockAndReportScreen);
