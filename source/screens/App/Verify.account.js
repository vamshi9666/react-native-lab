import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import {
  FONT_BLACK,
  FONT_GREY,
  BLUE_PRIMARY,
  BRIGHT_RED,
  YELLOW,
  PURPLE,
  WHITE
} from "../../config/Colors";
import Ionicon from "react-native-vector-icons/Ionicons";
import { DeviceHeight, DeviceWidth } from "../../config/Device";
import MediumText from "../../components/Texts/MediumText";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import BoldText from "../../components/Texts/BoldText";
import RoundedEdgeButton from "../../components/Buttons/RoundedEdgeButton";
import RegularText from "../../components/Texts/RegularText";
import RowView from "../../components/Views/RowView";
import { RNCamera } from "react-native-camera";
import { verifyImage } from "../../network/auth";
import NoFeedbackTapView from "../../../source/components/Views/NoFeedbackTapView";
import JustifiedCenteredView from "../../components/Views/JustifiedCenteredView";
import SvgUri from "react-native-svg-uri";
import { CachedImage } from "react-native-img-cache";
const PAGE_PADDING = DeviceWidth * 0.05;

const rowItems = [
  {
    name: "ios-checkmark-circle",
    text: "Verified",
    color: BLUE_PRIMARY,
    size: 35
  },
  { name: "ios-people", text: "More Connections", color: BRIGHT_RED, size: 50 },
  { name: "ios-happy", text: "Trust", color: YELLOW, size: 35 }
];

class VerifyAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCameraView: false,
      imageUrl: ""
    };
  }

  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: false };
      const data = await this.camera.takePictureAsync(options);

      this.setState({
        imageUrl: data.uri
      });
      console.log(data.uri);
    }
  };

  uploadImageAndGoback = () => {
    let form = new FormData();
    const { imageUrl } = this.state;
    const { storeUploadResponse, goBack } = this.props;

    form.append("image", {
      uri: imageUrl,
      type: "image/png",
      name: "verify"
    });
    verifyImage(form, uploadedResponse => {
      if (uploadedResponse.success) {
        const { isVerified } = uploadedResponse.data;
        // alert(JSON.stringify(uploadedResponse.data));
        console.log(JSON.stringify(uploadedResponse.data));
        storeUploadResponse(isVerified);
      } else {
        alert("Something went wrong " + uploadedResponse.message);
      }
    });
    goBack(true);
  };

  renderCamerView() {
    const { imageUrl } = this.state;

    return (
      <View style={styles.baseLayout}>
        <TouchableOpacity
          onPress={() => this.setState({ showCameraView: false })}
          style={styles.crossIconView}
        >
          <Ionicon name={"ios-close-circle"} color={"#fff"} size={35} />
        </TouchableOpacity>
        <View
          style={{
            ...styles.cameraView,
            overflow: "hidden"
          }}
        >
          {imageUrl === "" ? (
            <RNCamera
              ref={ref => {
                this.camera = ref;
              }}
              style={styles.cameraView}
              type={RNCamera.Constants.Type.front}
              flashMode={RNCamera.Constants.FlashMode.off}
              androidCameraPermissionOptions={{
                title: "Permission to use camera",
                message: "We need your permission to use your camera",
                buttonPositive: "Ok",
                buttonNegative: "Cancel"
              }}
              androidRecordAudioPermissionOptions={{
                title: "Permission to use audio recording",
                message: "We need your permission to use your audio",
                buttonPositive: "Ok",
                buttonNegative: "Cancel"
              }}
            />
          ) : (
            <CachedImage style={styles.cameraView} source={{ uri: imageUrl }} />
          )}
        </View>
        <MediumText
          style={{
            ...styles.captureDesc,
            color: imageUrl === "" ? "#fff" : "#000"
          }}
        >
          Please capture your front face
        </MediumText>

        {imageUrl === "" ? (
          <NoFeedbackTapView
            onPress={() => this.takePicture()}
            style={styles.purpleBtn}
          >
            <View style={styles.whiteBtn} />
          </NoFeedbackTapView>
        ) : (
          <>
            <RoundedEdgeButton
              onPress={() => {
                this.uploadImageAndGoback();
              }}
              style={{
                backgroundColor: BLUE_PRIMARY,
                ...styles.buttonStyle
              }}
            >
              <MediumText style={styles.verifyNowText}>Submit</MediumText>
            </RoundedEdgeButton>
            <RoundedEdgeButton
              onPress={() => {
                this.setState({ imageUrl: "" });
              }}
              style={{
                ...styles.buttonStyle,
                borderWidth: 1,
                borderColor: FONT_GREY,
                backgroundColor: "#fff"
              }}
            >
              <MediumText style={styles.verifyLaterText}>
                Capture Again
              </MediumText>
            </RoundedEdgeButton>
          </>
        )}
      </View>
    );
  }

  renderVerifyDescriptionCard = () => {
    const icons = [
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <View
          style={{
            backgroundColor: "rgb(47,124,228)",
            borderRadius: 20,
            padding: 6,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <FontAwesome5 name={"check"} color={WHITE} size={15} />
        </View>
        <RegularText
          style={{
            fontSize: 16,
            textAlign: "center",
            marginTop: 8
          }}
        >
          {"Verified"}
        </RegularText>
      </View>,
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end"
        }}
      >
        <SvgUri
          width={35}
          height={35}
          source={require("../../assets/icons/crowd-people.svg")}
        />
        <RegularText
          style={{
            fontSize: 16,
            textAlign: "center",
            marginTop: 8
          }}
        >
          {"More \n Connections"}
        </RegularText>
      </View>,
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end"
        }}
      >
        <SvgUri
          width={25}
          height={25}
          source={require("../../assets/icons/happy-smiley.svg")}
        />
        <RegularText
          style={{
            fontSize: 16,
            textAlign: "center",
            marginTop: 8
          }}
        >
          {"Trust"}
        </RegularText>
      </View>
    ];
    return (
      <View style={styles.cardView}>
        <View style={styles.headerView}>
          <MediumText style={styles.verifyHeader}>Verify Yourself</MediumText>
        </View>

        <RegularText style={styles.topDescText}>
          We’re committed towards giving our users the best security possible.
          {"\n"}
          Please verify your identity by sending us a selfie
        </RegularText>
        <RowView
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
            marginHorizontal: 24
          }}
        >
          {icons}
          {/* {rowItems.map((item, itemId) => (
            <JustifiedCenteredView
              key={itemId}
              style={{
                width: DeviceWidth * 0.3,
                alignItems: "center"
              }}
            >
              <Ionicon name={item.name} color={item.color} size={item.size} />
              <RegularText
                style={{
                  fontSize: 17,
                  textAlign: "center"
                }}
              >
                {item.text}
              </RegularText>
            </JustifiedCenteredView>
          ))} */}
        </RowView>
        <RegularText style={styles.bottomDescText}>
          This selfie will only be used For verification we never share this on
          your Profile
        </RegularText>
        <RoundedEdgeButton
          onPress={() => this.setState({ showCameraView: true })}
          style={{
            backgroundColor: BLUE_PRIMARY,
            ...styles.buttonStyle,
            marginTop: 4
          }}
        >
          <RegularText style={styles.verifyNowText}>
            Get verified now
          </RegularText>
        </RoundedEdgeButton>
        <RoundedEdgeButton
          onPress={() => this.props.goBack(false)}
          style={{
            ...styles.buttonStyle,
            borderWidth: 1,
            borderColor: "rgb(126,126,126)"
          }}
        >
          <RegularText style={styles.verifyLaterText}>
            Get verified later
          </RegularText>
        </RoundedEdgeButton>
      </View>
    );
  };

  render() {
    const { showCameraView } = this.state;

    if (showCameraView) {
      return this.renderCamerView();
    } else {
      return this.renderVerifyDescriptionCard();
    }
  }
}

const styles = StyleSheet.create({
  verifyNowText: {
    color: "#fff",
    fontSize: 20
  },
  verifyLaterText: {
    fontSize: 20,
    color: FONT_BLACK
  },
  buttonStyle: {
    paddingVertical: 15,
    width: DeviceWidth * 0.7,
    alignSelf: "center",
    marginVertical: 8
  },
  bottomDescText: {
    fontSize: 16,
    // color: FONT_GREY,
    color: "rgb(112,112,112)",
    padding: PAGE_PADDING,
    textAlign: "center"
  },
  cardView: {
    backgroundColor: "#fff",
    borderRadius: 15,
    width: DeviceWidth * 0.9,
    alignSelf: "center",
    marginTop: DeviceHeight * 0.08,
    paddingBottom: 24
    // height: DeviceHeight * 0.85
  },
  headerView: {
    // height: 60,

    // alignItems: "center",
    borderBottomColor: "#00000010",
    borderBottomWidth: 1,
    justifyContent: "center"
  },
  verifyHeader: {
    fontSize: 20,
    marginLeft: 20,
    paddingVertical: 16,
    color: FONT_BLACK
  },
  topDescText: {
    fontSize: 18,
    padding: PAGE_PADDING,
    paddingTop: 16,
    lineHeight: 25
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
  },
  crossIconView: {
    height: 50,
    marginTop: 25,
    marginRight: 20,
    alignSelf: "flex-end"
  },
  baseLayout: {
    flex: 1,
    backgroundColor: "#000"
  },
  cameraView: {
    height: DeviceHeight * 0.6,
    width: DeviceWidth * 0.85,
    alignSelf: "center",
    borderRadius: 15
  },
  captureDesc: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 25
  },
  whiteBtn: {
    height: 72,
    width: 72,
    borderRadius: 36,
    backgroundColor: "#fff",
    borderWidth: 3,
    borderColor: "#000"
  },
  purpleBtn: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: PURPLE,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 25
  }
});

export default VerifyAccount;
