import React, { Component } from "react";
import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { LIGHT_PURPLE, PURPLE } from "../../config/Colors";
import { DeviceWidth } from "../../config/Device";
import { clearAsyncStorage } from "../../config/Storage";
import firebase from "react-native-firebase";
import { connect } from "react-redux";
import JustifiedCenteredView from "../Views/JustifiedCenteredView";
import { bindActionCreators } from "redux";
import { setOnlineStatus } from "../../redux/actions/rooms";
class SignOutModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: true,
      snoozeMode: false,
      displayName: true,
      vibrations: true,
      sounds: true,
      contactUsOpen: false,
      signOutOpen: false,
      deleteAccountOpen: false
    };
  }

  render() {
    const { dismissSignOutModal, reset, goBack } = this.props;

    return (
      <JustifiedCenteredView
        style={{
          flex: 1
        }}
      >
        <View
          style={{
            height: 200,
            width: DeviceWidth * 0.95,
            borderRadius: 20,
            backgroundColor: "#fff",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center"
          }}
        >
          <Text
            style={{
              color: "#1E2432",
              fontSize: 17,
              textAlign: "center",
              paddingHorizontal: DeviceWidth * 0.04
            }}
          >
            Are you sure you want to sign out?{"\n"} You will continue to be
            seen by suitable{"\n"} Users in your last known location
          </Text>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <TouchableOpacity
              onPress={async () => {
                firebase.messaging().deleteToken();
                await this.props.setOnlineStatus(false);
                reset();
                dismissSignOutModal();
                await clearAsyncStorage();
                setTimeout(() => {
                  goBack();
                }, 1000);
                setTimeout(() => {
                  this.props.navigation.navigate("splash");
                }, 2500);
              }}
            >
              <LinearGradient
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                colors={[PURPLE, LIGHT_PURPLE]}
                style={{
                  width: DeviceWidth * 0.4,
                  height: 40,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 5
                }}
              >
                <Text style={{ color: "#fff", fontSize: 16 }}>Sign Out</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableWithoutFeedback onPress={() => dismissSignOutModal()}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: PURPLE,
                  borderRadius: 20,
                  width: DeviceWidth * 0.4,
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 5
                }}
              >
                <Text style={{ color: PURPLE, fontSize: 16 }}>Cancel</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </JustifiedCenteredView>
    );
  }
}

const mapState = state => {
  return {};
};
const mapDispatches = dispatch => {
  return {
    reset: () => {
      return dispatch({
        type: "RESET"
      });
    },
    setOnlineStatus: bindActionCreators(setOnlineStatus, dispatch)
  };
};
export default connect(mapState, mapDispatches)(SignOutModal);
