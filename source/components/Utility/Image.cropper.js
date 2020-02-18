import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { CARD_WIDTH, IMAGE_HEIGHT, LEFT_MARGIN } from "../../config/Constants";
import { sharedStyles } from "../../styles/Shared";
import MediumText from "../Texts/MediumText";
import { DeviceHeight, DeviceWidth } from "../../config/Device";
import { ImageCrop } from "react-native-image-cropper";
import { FONT_BLACK } from "../../config/Colors";
import Ionicon from "react-native-vector-icons/Ionicons";
import RegularText from "../Texts/RegularText";

const CROPPER_HEIGHT = IMAGE_HEIGHT * 0.9;
const CROPPER_WIDTH = CARD_WIDTH * 0.9;

class ImageCropper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      xOffset: 0,
      yOffset: 0
    };
  }

  closeModal = () => {
    const { closeModal } = this.props;
    closeModal();
  };

  capture() {
    this.refs.cropper.crop().then(base64 => {
      console.log("base64 image for the above image is:", base64);
      this.props.setImageVal(base64);
      this.closeModal();
    });
  }

  render() {
    const { originalURI } = this.props;

    return (
      <View style={styles.baseLayout}>
        <TouchableOpacity
          style={styles.closeIconView}
          onPress={() => this.closeModal()}
        >
          <Ionicon name={"ios-close"} size={30} color={"#000"} />
        </TouchableOpacity>
        <RegularText style={styles.descText}>
          Adjust your photo to {"\n"} fit inside this frame
        </RegularText>
        <View style={styles.cropView}>
          <ImageCrop
            ref={"cropper"}
            image={originalURI.uri}
            cropHeight={CROPPER_HEIGHT}
            cropWidth={CROPPER_WIDTH}
            zoom={50}
            maxZoom={80}
            minZoom={20}
            panToMove={true}
            pinchToZoom={true}
          />
        </View>
        <TouchableOpacity
          style={styles.confirmView}
          onPress={() => this.capture()}
        >
          <MediumText style={styles.confirmText}>Confirm</MediumText>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  descText: {
    textAlign: "center",
    fontSize: 18,
    color: "#fff",
    marginVertical: LEFT_MARGIN,
    lineHeight: 25
  },
  closeIconView: {
    ...sharedStyles.justifiedCenter,
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignSelf: "flex-end",
    margin: LEFT_MARGIN
  },
  baseLayout: {
    height: DeviceHeight,
    width: DeviceWidth,
    backgroundColor: "#000000f0"
  },
  confirmText: {
    color: FONT_BLACK,
    fontSize: 18
  },
  confirmView: {
    height: 40,
    width: DeviceWidth * 0.3,
    ...sharedStyles.justifiedCenter,
    borderRadius: 30,
    backgroundColor: "#fff",
    alignSelf: "center",
    marginVertical: LEFT_MARGIN
  },
  cropView: {
    height: CROPPER_HEIGHT,
    width: CROPPER_WIDTH,
    backgroundColor: "#000000f0",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#fff",
    borderStyle: "dashed",
    overflow: "hidden",
    alignSelf: "center"
  }
});

export default ImageCropper;
