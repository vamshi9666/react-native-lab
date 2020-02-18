import React, { Component } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal
} from "react-native";
import { IMAGE_HEIGHT, CARD_WIDTH, LEFT_MARGIN } from "../../config/Constants";
import { STATIC_URL } from "../../config/Api";
import { DeviceWidth } from "../../config/Device";
import Ionicon from "react-native-vector-icons/Ionicons";
import { PURPLE, FONT_GREY } from "../../config/Colors";
import ImagePicker from "react-native-image-picker";
import RegularText from "../../components/Texts/RegularText";
import { uploadImage, updateProfile } from "../../network/auth";
import { connect } from "react-redux";
import * as UserActions from "../../redux/actions/user.info";
import { bindActionCreators } from "redux";
import { sharedStyles } from "../../styles/Shared";
import { DotsLoader } from "react-native-indicator";
import ImageCropper from "../../../source/components/Utility/Image.cropper";
import { CachedImage } from "react-native-img-cache";

const imagesCount = [1, 2, 3, 4, 5, 6];

class MyimagesGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seletedImageIndex: null,
      currentlyUploadingImage: null,
      isImageUploading: false,
      showEditModal: false,
      currentlySelectedPhoto: null
    };
  }

  onCornerButtonTap = (seletedImageIndex, isOnlyOneImageFound) => {
    if (isOnlyOneImageFound) {
      this.editImage(seletedImageIndex);
    } else {
      this.removeImage(seletedImageIndex);
    }
  };

  editImage = seletedImageIndex => {
    this.selectimage(seletedImageIndex, true);
  };

  removeImage = seletedImageIndex => {
    Alert.alert(
      "Confirm Delete?",
      "Are you sure you want to delete this picture? ",
      [
        {
          text: "Cancel",
          onPress: () => {
            console.log("cancel");
          }
        },
        {
          text: "Delete",
          onPress: () => {
            this.deleteImage(seletedImageIndex);
          }
        }
      ]
    );
  };

  uploadImage = (bool = false) => {
    const { userData } = this.props;
    const { currentlySelectedPhoto } = this.state;
    let data = new FormData();
    data.append("image", {
      uri: currentlySelectedPhoto.uri,
      type: "image/png",
      name: userData.name
    });
    data.append("path", "images");
    uploadImage(data, uploadResponse => {
      console.log(" upload respone is ", uploadResponse);
      if (uploadResponse.success) {
        // if (uploadResponse.data.valid) {
        //   this.updateImages(bool, uploadResponse)
        // } else {
        //   alert(
        //     "The picture you just uploaded is not valid. Please check our picture policy"
        //   );
        // }
        this.updateImages(bool, uploadResponse);
      }
    });
  };

  updateImages = (bool, uploadResponse) => {
    const { userData, updateImages } = this.props;

    let images = bool
      ? [uploadResponse.data.image.path]
      : [...userData.images, uploadResponse.data.image.path];

    updateProfile(
      {
        images
      },
      updateResponse => {
        this.setState({ isImageUploading: false });
        if (updateResponse.success) {
          updateImages({
            images
          });
          this.setState({ currentlyUploadingImage: null });
          // alert(" your image is uploaded successfully");
        } else {
          alert(
            "Something went wrong while storing image, please try again..."
          );
        }
      }
    );
  };

  selectimage = (seletedImageIndex, bool = false) => {
    this.setState({ seletedImageIndex: String(seletedImageIndex) });
    ImagePicker.showImagePicker(
      {
        title: "Select Image",
        takePhotoButtonTitle: "Camera",
        chooseFromLibraryButtonTitle: "Camera Roll",
        allowsEditing: false,
        noData: true
      },
      response => {
        console.log("Response = ", response);
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.error) {
          console.log("ImagePicker Error: ", response.error);
        } else if (response.customButton) {
          console.log("User tapped custom button: ", response.customButton);
        } else {
          this.setState(
            {
              currentlyUploadingImage: response.uri,
              showEditModal: true
            },
            () => {
              // this.uploadImage(bool);
            }
          );
        }
      }
    );
  };

  closeImageEditModal = () => {
    this.setState({ showEditModal: false });
  };

  setImageVal = uri => {
    this.setState(
      {
        currentlySelectedPhoto: { uri },
        isImageUploading: true
      },
      () => {
        this.uploadImage(false);
      }
    );
  };

  deleteImage = index => {
    console.log(" image to be deleted is ", index);
    const { images = [] } = this.props.userData;
    const newImages = images.filter((imageUrl, imgIndex) => {
      if (index !== imgIndex) {
        return true;
      }
    });
    updateProfile({ images: newImages }, updateResponse => {
      if (updateResponse.success) {
        this.props.updateImages({ images: newImages });
      }
    });
  };

  renderUploadingUI = addMargin => {
    const { isImageUploading } = this.state;
    if (isImageUploading) {
      return (
        <View
          style={{
            ...styles.imageStyle,
            ...sharedStyles.justifiedCenter,
            position: "absolute",
            zIndex: 2,
            backgroundColor: "rgba(0,0,0,0.5)",
            margin: addMargin ? LEFT_MARGIN / 3.5 : 0
          }}
        >
          <DotsLoader size={10} color={"#fff"} betweenSpace={5} />
        </View>
      );
    } else {
      return <View />;
    }
  };

  render() {
    const { props, state } = this;
    const { data, openShuffleUI, userData } = props;
    const { private: isPrivate } = userData;
    const isOnlyOneImageFound = data.length === 1;
    const {
      currentlyUploadingImage,
      seletedImageIndex,
      showEditModal,
      currentlySelectedPhoto
    } = state;
    const _isImageValueNull = currentlySelectedPhoto === null;

    return (
      <>
        <Modal visible={showEditModal} animated={false}>
          <ImageCropper
            closeModal={this.closeImageEditModal}
            originalURI={{ uri: currentlyUploadingImage }}
            setImageVal={this.setImageVal}
          />
        </Modal>
        {isOnlyOneImageFound ? (
          <View />
        ) : (
          <RegularText
            style={{
              color: FONT_GREY,
              fontSize: 15,
              textAlign: "center",
              marginTop: 8
            }}
          >
            Tap on the picture to change the order
          </RegularText>
        )}
        <FlatList
          style={{ marginTop: LEFT_MARGIN / 2 }}
          extraData={{ ...props, ...state }}
          keyExtractor={item => item}
          data={imagesCount}
          numColumns={2}
          renderItem={({ item, index }) => {
            const _showImage = index < data.length;
            const _isSelected = seletedImageIndex === String(index);

            if (_showImage) {
              return (
                <View key={index}>
                  <TouchableOpacity
                    disabled={isOnlyOneImageFound}
                    onPress={() => {
                      if (isPrivate) {
                        alert(" you cant edit in private mode");
                        return;
                      }
                      openShuffleUI(index);
                    }}
                  >
                    {_isSelected ? this.renderUploadingUI(true) : <View />}
                    <CachedImage
                      // blurRadius={isPrivate? }
                      style={styles.imageStyle}
                      source={{
                        uri: _isSelected
                          ? _isImageValueNull
                            ? STATIC_URL + data[index].split("uploads")[1]
                            : currentlySelectedPhoto.uri
                          : STATIC_URL + data[index].split("uploads")[1]
                      }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      if (isPrivate) {
                        alert(" you cant edit in private mode");
                        return;
                      }
                      this.onCornerButtonTap(index, isOnlyOneImageFound);
                    }}
                    style={[styles.roundButtonView, styles.crossButtonView]}
                  >
                    <Ionicon
                      style={{
                        marginTop: 2.5
                      }}
                      name={isOnlyOneImageFound ? "md-create" : "md-close"}
                      size={22}
                      color={FONT_GREY}
                    />
                  </TouchableOpacity>
                </View>
              );
            } else {
              return (
                <View
                  key={item}
                  style={{
                    ...styles.imageStyle,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {_isSelected ? (
                    _isImageValueNull ? (
                      <TouchableOpacity
                        onPress={() => {
                          if (isPrivate) {
                            alert(" you cant edit in private mode");
                            return;
                          }
                          this.selectimage(index);
                        }}
                        style={styles.roundButtonView}
                      >
                        <Ionicon
                          style={{
                            marginTop: 2.5
                          }}
                          name={"md-add"}
                          size={30}
                          color={PURPLE}
                        />
                      </TouchableOpacity>
                    ) : (
                      <View style={{ ...styles.imageStyle, margin: 0 }}>
                        {this.renderUploadingUI(false)}
                        <Image
                          style={{ ...styles.imageStyle, margin: 0 }}
                          source={{
                            uri: currentlySelectedPhoto.uri
                          }}
                        />
                      </View>
                    )
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        if (isPrivate) {
                          alert(" you cant edit in private mode");
                          return;
                        }
                        this.selectimage(index);
                      }}
                      style={styles.roundButtonView}
                    >
                      <Ionicon
                        style={{
                          marginTop: 2.5
                        }}
                        name={"md-add"}
                        size={30}
                        color={PURPLE}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              );
            }
          }}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  baseLayout: {
    flex: 1
  },
  imageStyle: {
    width: DeviceWidth * 0.375,
    aspectRatio: CARD_WIDTH / IMAGE_HEIGHT,
    borderRadius: 15,
    backgroundColor: "rgb(242,242,242)",
    margin: LEFT_MARGIN / 3.5
  },
  roundButtonView: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    elevation: 1
  },
  crossButtonView: {
    position: "absolute",
    bottom: LEFT_MARGIN / 2,
    right: LEFT_MARGIN / 2,
    zIndex: 2,
    transform: [{ scale: 0.8 }]
  }
});

const mapStateToProps = state => {
  return {
    images: state.info.userInfo.images,
    userData: state.info.userInfo
  };
};
const mapDispatchToProps = dispatch => {
  return {
    updateImages: bindActionCreators(UserActions.updateOwnProfile, dispatch)
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(MyimagesGrid);
