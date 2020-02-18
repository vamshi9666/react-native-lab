import moment from "moment";
import React, { Component } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import Gallery from "react-native-image-gallery";
import Modal from "react-native-modal";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { LEFT_MARGIN } from "../../config/Constants";
import { DeviceWidth } from "../../config/Device";
import * as UserApi from "../../network/user";
import * as UserActions from "../../redux/actions/user.info";
import MediumText from "../Texts/MediumText";
import RowView from "../Views/RowView";
const IMAGE_WIDTH = DeviceWidth * 0.225;

import IonIcon from "react-native-vector-icons/Ionicons";
import { CachedImage } from "react-native-img-cache";

class InstaGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentImage: 0,
      currentImageIndex: 0
    };
    this.instagramLogin = React.createRef();
  }

  openImageGallery = i => {
    const { currentSlideNumber } = this.props;
    this.setState(
      {
        currentImage: 6 * currentSlideNumber + i,
        currentImageIndex: 6 * currentSlideNumber + i
      },
      () => {
        this.setModalState(true);
      }
    );
  };

  renderImage = (uri, key) => {
    return (
      <TouchableOpacity key={key} onPress={() => this.openImageGallery(key)}>
        <CachedImage source={{ uri }} style={styles.imageStyle} />
      </TouchableOpacity>
    );
  };
  fetchInstaPhotos = async token => {
    const instaPhotos = await UserApi.getInstaPosts(token);
    console.log(" insta photos response is ", instaPhotos);
    return instaPhotos.data;
    // this.props.updateProfile()
    // this.props.getInstaImages().then(() => {
    //   const { getInstaImagesResult } = this.props;
    //   if (getInstaImagesResult.success) {
    //     this.setState({
    //       instaImages: getInstaImagesResult.data
    //     });
    //   }
    // });
  };
  onInstaLogin = token => {
    UserApi.updateProfile(
      {
        insta_token: token
      },
      async updateUserResult => {
        if (updateUserResult.success) {
          const instaPhotos = await this.fetchInstaPhotos(token);
          this.props.updateInstaPosts(instaPhotos);
          this.props.updateProfile({
            insta_token: token
          });
        }
      }
    );
  };
  renderTwoRow = images => {
    return (
      <View style={styles.baseLayout}>
        <RowView>
          {images.map((img, imgId) => {
            if (imgId < 3) {
              return this.renderImage(img.url, imgId);
            }
          })}
        </RowView>
        <RowView>
          {images.map((img, imgId) => {
            if (imgId > 2) {
              return this.renderImage(img.url, imgId);
            }
          })}
        </RowView>
      </View>
    );
  };

  renderSingleRow = images => {
    return (
      <View style={styles.baseLayout}>
        <RowView>
          {images.map((img, imgId) => {
            return this.renderImage(img.url, imgId);
          })}
        </RowView>
      </View>
    );
  };

  setModalState = isModalVisible => {
    this.setState({ isModalVisible });
  };

  render() {
    const { images, allImages, fromMyProfile, myData } = this.props;
    const { isModalVisible, currentImage, currentImageIndex } = this.state;

    const currentImageCreatedAt = moment
      .unix(allImages[currentImageIndex].created_time)
      .format("D MMM");

    return (
      <>
        {images.length > 3
          ? this.renderTwoRow(images)
          : this.renderSingleRow(images)}
        <Modal
          style={{
            margin: 0
          }}
          swipeDirection={["up", "down"]}
          backdropOpacity={0.99}
          swipeThreshold={40}
          isVisible={isModalVisible}
          onSwipeComplete={() => {
            this.setModalState(false);
          }}
          onBackButtonPress={() => this.setModalState(false)}
        >
          <View
            style={{
              flex: 1
            }}
          >
            <View style={styles.topContainer}>
              <MediumText style={styles.topTimeStampText}>
                {currentImageCreatedAt}
              </MediumText>

              <IonIcon
                name={"md-close"}
                color={"#fff"}
                size={32}
                style={{
                  position: "absolute",
                  right: 0,
                  top: 10
                }}
                onPress={() => this.setModalState(false)}
              />
            </View>
            <Gallery
              flatListProps={{
                horizontal: true
              }}
              onPageScroll={e => {
                if (currentImageIndex !== e.position) {
                  this.setState({
                    currentImageIndex: e.position
                  });
                }
              }}
              initialPage={currentImage}
              onSingleTapConfirmed={() => this.setModalState(false)}
              images={allImages.map((img, imgId) => {
                return {
                  source: { uri: img.url }
                };
              })}
            />
          </View>
        </Modal>
      </>
    );
  }
}

const styles = StyleSheet.create({
  topContainer: {
    position: "absolute",
    width: DeviceWidth,
    justifyContent: "space-between",
    top: 30,
    zIndex: 2
  },
  topTimeStampText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16
  },
  bottomViewContainer: {
    position: "absolute",
    width: DeviceWidth,
    zIndex: 2,
    bottom: 20,
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    justifyContent: "center"
  },

  connectInstaText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16
  },
  imageStyle: {
    height: IMAGE_WIDTH,
    width: IMAGE_WIDTH,
    backgroundColor: "rgb(242, 243, 246)",
    borderRadius: 7.5,
    margin: LEFT_MARGIN / 3
  },
  bigImageStyle: {
    flex: 1,
    backgroundColor: "rgb(242, 243, 246)"
  },
  baseLayout: {
    width: DeviceWidth * 0.9,
    alignItems: "center"
  }
});

const mapState = state => {
  return {
    myData: state.info.userInfo
  };
};
const mapDispatches = dispatch => {
  return {
    updateProfile: bindActionCreators(UserActions.updateOwnProfile, dispatch),
    updateInstaPosts: bindActionCreators(UserActions.setInstaPhotos, dispatch)
  };
};
export default connect(mapState, mapDispatches)(InstaGrid);
