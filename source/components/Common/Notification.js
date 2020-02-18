import React, { Component } from "react";
import { View, Dimensions, Image, StyleSheet } from "react-native";
import Interactable from "../../../src/lib/Interactable";
import { TouchableOpacity } from "react-native-gesture-handler";
import { BLUE_PRIMARY, WHITE } from "../../config/Colors";
import { styles as landingStyles } from "../../styles/Landing";
import JustifiedCenteredView from "../Views/JustifiedCenteredView";
import MediumText from "../Texts/MediumText";
import RegularText from "../Texts/RegularText";
import CircularImage from "../Views/CircularImage";
import { DeviceWidth } from "../../config/Device";
import { CachedImage } from "react-native-img-cache";

export default class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidUpdate = prevProps => {
    if (prevProps.show !== this.props.show) {
      if (this.props.show === true) {
        this.refs["notif"].snapTo({ index: 1 });

        this.timing = setTimeout(() => {
          this.refs["notif"].snapTo({ index: 0 });
          // this.props
          clearInterval(this.timing);
        }, 4000);
      }
    }
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    const { props } = this;
    return (
      props.show !== nextProps.show ||
      props.userImageUrl !== nextProps.userImageUrl ||
      props.notificationTitle !== nextProps.notificationTitle ||
      props.notificationText !== nextProps.notificationText
    );
  };

  render() {
    const {
      show,
      setModalVisible,
      onTap,
      userImageUrl,
      notificationTitle,
      notificationText,
      height
    } = this.props;
    // console.log(" image url is ", userImageUrl);
    // const notificationHeight = chid children.props.style.height || 120;
    return (
      <Interactable.View
        ref={"notif"}
        initialPosition={{ y: -height }}
        boundaries={{ bottom: height }}
        verticalOnly={true}
        style={{ position: "absolute", top: -height }}
        snapPoints={[{ y: -height }, { y: height }]}
        onSnap={(...rest) => {
          // rest.

          if (show === true) {
            setModalVisible(false);
            clearInterval(this.timing);
          }
          // this.props.setModalVisible(!show);
        }}
      >
        {/* {children} */}

        <TouchableOpacity
          activeOpacity={1}
          style={styles.container}
          onPress={() => {
            onTap();
          }}
        >
          <CircularImage
            height={50}
            source={{
              uri: userImageUrl
            }}
            style={landingStyles.userNotificationImage}
          />
          <View style={styles.imageContainer}>
            <JustifiedCenteredView style={styles.sparkImageView}>
              <CachedImage
                style={{ height: 15, width: 15, backgroundColor: WHITE }}
                source={require("../../../source/assets/svgs/spark.png")}
              />
            </JustifiedCenteredView>
          </View>

          <View
            style={{
              marginLeft: -2.5
            }}
          >
            <MediumText style={landingStyles.notificationTitle}>
              {notificationTitle}
            </MediumText>
            <RegularText style={landingStyles.notificationText}>
              {notificationText}
            </RegularText>
          </View>
        </TouchableOpacity>
      </Interactable.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginLeft: DeviceWidth * 0.025,
    // justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: DeviceWidth * 0.95,
    borderRadius: 10,
    // alignSelf: "center",
    backgroundColor: "rgb(255,255,255)",
    // position: "absolute",
    zIndex: 100,
    // top: 0,
    elevation: 10,
    shadowColor: "#000000A0",
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 3
    },
    height: 90
  },
  imageContainer: {
    height: 25,
    width: 25,
    borderRadius: 12.5,
    top: 38,
    left: 45,
    ...landingStyles.sparkNofeedbackButtonView
  }
});
