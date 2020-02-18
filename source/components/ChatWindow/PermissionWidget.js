import React from "react";
import { View, StyleSheet, Linking } from "react-native";
import { WHITE, PURPLE, FONT_GREY, BLACK } from "../../config/Colors";
import BoldText from "../Texts/BoldText";
import { userNamify } from "../../config/Utils";
import AntIcon from "react-native-vector-icons/AntDesign";
import RegularText from "../Texts/RegularText";
import { DeviceHeight } from "../../config/Device";
import NoFeedbackTapView from "../Views/NoFeedbackTapView";
import firebase from "react-native-firebase";
const WIDGET_CLOSE_INTERVAL = 20000;
class PermissionWidget extends React.Component {
  componentDidMount = () => {
    this.interval = setTimeout(() => {
      this.handleClose();
    }, WIDGET_CLOSE_INTERVAL);
  };
  handleClose = () => {
    // firebase.messaging()
    clearInterval(this.interval);
    this.props.close();
  };

  componentWillUnmount = () => {
    clearInterval(this.interval);
  };
  render() {
    const { user } = this.props;
    const userName = userNamify(user);
    return (
      <View style={styles.container}>
        <AntIcon
          onPress={this.handleClose}
          size={20}
          style={styles.closeIcon}
          name="close"
        />

        <RegularText
          style={{ fontSize: 18, marginHorizontal: 55, color: FONT_GREY }}
        >
          {" "}
          Get notified when {userName} responds{" "}
        </RegularText>

        <NoFeedbackTapView
          onPress={() => {
            Linking.openURL("app-settings:")
              .then(res => {
                console.log(" res is ", res);
              })
              .catch(err => {
                console.log(" err is ", err);
              });
          }}
          style={styles.button}
        >
          <RegularText
            style={{ fontSize: 16, color: WHITE, paddingVertical: 6 }}
          >
            Enable Notification
          </RegularText>
        </NoFeedbackTapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // height: 120,
    // width: "100%",
    // flex: 1,
    backgroundColor: WHITE,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    top: -DeviceHeight * 0.14,
    // position: "absolute",
    // top: DeviceHeight * 0.15,
    borderRadius: 10,
    // backgroundColor: "red",
    paddingVertical: 16,

    marginHorizontal: 10,
    shadowColor: BLACK,
    shadowOpacity: 0.1,
    shadowOffset: {
      height: 3,
      width: 3
    },
    shadowRadius: 10
  },
  closeIcon: {
    position: "absolute",
    right: 10,
    top: 10
  },
  button: {
    marginTop: 16,
    backgroundColor: PURPLE,
    paddingHorizontal: 32,
    paddingVertical: 8,
    borderRadius: 15,
    marginVertical: 10
  }
});
export default PermissionWidget;
