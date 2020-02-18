import React, { Component } from "react";
import {
  ActionSheetIOS,
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Modal
} from "react-native";
import ImagePicker from "react-native-image-picker";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Button from "../../../src/components/Common/Button";
import Loader from "../../../src/components/Common/Button.loader";
import { DeviceHeight, DeviceWidth } from "../../../src/config/Device";
import { retrieveData, storeData } from "../../../src/config/Storage";
import * as userActions from "../../redux/actions/user.info";
import BoldText from "../Texts/BoldText";
import { NEW_GREY, FONT_GREY, FONT_BLACK } from "../../config/Colors";
import NoFeedbackTapView from "../Views/NoFeedbackTapView";
import Ionicon from "react-native-vector-icons/Ionicons";
import { STATIC_URL } from "../../config/Api";
import { IMAGE_HEIGHT, CARD_WIDTH } from "../../config/Constants";
import * as types from "../../redux/types/user.info";
import ImageCropper from "../../../source/components/Utility/Image.cropper";
const LEFT_MARGIN = DeviceWidth * 0.05;

const options = {
  title: "Select Image",
  takePhotoButtonTitle: "Camera",
  chooseFromLibraryButtonTitle: "Camera Roll",
  allowsEditing: true,
  noData: true
};

class ProfilePicture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photo: null,
      isLoading: false,
      showEditModal: false,
      currentlySelectedPhoto: null
    };
  }
  componentDidMount = () => {
    // firebase.logEvent("login11_profile_picture_input_did_mount");
  };

  selectimage = () => {
    ImagePicker.showImagePicker({ options }, response => {
      console.log("Response = ", response.uri);
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        const source = { uri: response.uri };
        // this.props.addUserInfo("images", [response.uri]);
        this.setState({
          imageSource: source,
          imageData: response,
          photo: source,
          showEditModal: true
        });
        this.props.updateImageChangedCount();
      }
    });
  };

  openActionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Camera", "Camera Roll", "Cancel"],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 2
      },
      buttonIndex => {
        if (buttonIndex === 1) {
          /* destructive action */
        }
      }
    );
  };

  nextScreen = () => {
    let data = new FormData();
    retrieveData("NAME").then(async name => {
      if (name) {
        data.append("image", {
          uri: this.state.imageData.uri,
          type: "image/png",
          name: name
        });
        this.setState({
          isLoading: true
        });
        this.props
          .uploadMethod(data)
          .then(() => {
            this.setState({
              isLoading: false
            });
            let { uploadResponse } = this.props;
            if (uploadResponse.success) {
              console.log(" upload response is >>>", uploadResponse);
              // check if image has face or not
              if (uploadResponse.data.valid) {
                // success
                storeData("IMAGE_URL", uploadResponse.data.image.path);
                this.props.navigation.navigate("EmailInput", {
                  progressValue: 6 / 6,
                  imgPath: uploadResponse.data.path
                });
              } else {
                alert(
                  "The picture you just uploaded is not valid. Please check our picture policy"
                );
              }

              console.log("image path from res is: ", uploadResponse);
            }
          })
          .catch(err => {
            this.setState({
              isLoading: false
            });
            console.log("err while uploading image: ", err);
          });
      }
    });
  };

  closeImageEditModal = () => {
    this.setState({ showEditModal: false });
  };

  setImageVal = uri => {
    this.setState({
      currentlySelectedPhoto: { uri }
    });
    this.props.addUserInfo("images", [uri]);
  };

  render() {
    const {
      photo,
      isLoading,
      showEditModal,
      currentlySelectedPhoto
    } = this.state;

    const { existingImage } = this.props;
    const finalExistanceImage =
      existingImage.split("/")[0] === "uploads"
        ? STATIC_URL + existingImage.split("uploads")[1]
        : existingImage;
    const allowNewImage = this.props.imageUpdatedCount < 5 || true;
    return (
      <View style={styles.baseLayout}>
        <BoldText style={styles.headerText}>My Best Pic is</BoldText>
        <Modal visible={showEditModal} animated={false}>
          {showEditModal ? (
            <ImageCropper
              closeModal={this.closeImageEditModal}
              originalURI={photo}
              setImageVal={this.setImageVal}
            />
          ) : (
            <View />
          )}
        </Modal>
        {currentlySelectedPhoto === null && existingImage === "" ? (
          <NoFeedbackTapView
            onPress={this.selectimage}
            style={styles.initialImageBg}
          >
            <View
              style={{
                height: 50,
                width: 50,
                borderRadius: 25,
                backgroundColor: "#fff",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 3
                },
                shadowOpacity: 0.1,
                elevation: 2,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Ionicon
                style={{
                  marginTop: 2
                }}
                name={"md-add"}
                color={"#39D1E8"}
                size={40}
              />
            </View>
          </NoFeedbackTapView>
        ) : (
          <View
            style={{
              alignSelf: "center",
              marginTop: DeviceHeight * 0.1,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 3
              },
              shadowOpacity: 0.3,
              elevation: 2
            }}
          >
            <Image
              style={styles.addedPhoto}
              source={
                currentlySelectedPhoto
                  ? currentlySelectedPhoto
                  : { uri: finalExistanceImage }
              }
            />
            {allowNewImage && (
              <TouchableOpacity
                style={styles.pencilIconView}
                onPress={this.selectimage}
              >
                <Ionicon
                  style={{
                    marginTop: 2
                  }}
                  name={"md-create"}
                  color={FONT_GREY}
                  size={25}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerText: {
    color: "#1E2432",
    fontSize: 34,
    marginTop: DeviceHeight * 0.05,
    marginLeft: LEFT_MARGIN,
    fontWeight: "700"
  },
  pencilIconView: {
    height: 40,
    width: 40,
    backgroundColor: "#fff",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    marginTop: -25,
    marginRight: -20,
    shadowColor: "#00000001",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.01,
    elevation: 2
  },
  addedPhoto: {
    height: IMAGE_HEIGHT * 0.6,
    width: CARD_WIDTH * 0.6,
    alignSelf: "center",
    borderRadius: 15,
    borderColor: "#fff",
    borderWidth: 2
  },
  initialImageBg: {
    height: DeviceHeight * 0.35,
    width: (DeviceHeight * 0.35 * 9) / 13,
    borderRadius: 15,
    backgroundColor: "#F1F3F7",
    alignSelf: "center",
    marginTop: DeviceHeight * 0.1,
    alignItems: "center",
    justifyContent: "center"
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 3
    // },
    // shadowOpacity: 0.3,
    // elevation: 2
  }
});

const mapStatetoProps = state => {
  return { imageUpdatedCount: state.info.pictureChangedTimes };
};

const mapDispatchToProps = dispatch => ({
  addUserInfo: bindActionCreators(userActions.addUserInfo, dispatch),
  updateImageChangedCount: () =>
    dispatch({ type: types.INCRIMENT_IMAGE_CHAGNED })
});

export default connect(mapStatetoProps, mapDispatchToProps)(ProfilePicture);
