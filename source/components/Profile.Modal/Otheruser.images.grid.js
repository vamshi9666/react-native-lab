import React, { Component } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import Gallery from "react-native-image-gallery";
import Ionicon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";
import { STATIC_URL } from "../../config/Api";
import { CARD_WIDTH, IMAGE_HEIGHT, LEFT_MARGIN } from "../../config/Constants";
import { DeviceWidth } from "../../config/Device";
import { sharedStyles } from "../../styles/Shared";
import { CachedImage } from "react-native-img-cache";

class OherusersImageGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentImage: 0
    };
  }

  openImageGallery = i => {
    this.setState({ currentImage: i }, () => {
      this.setModalState(true);
    });
  };

  setModalState = isModalVisible => {
    this.setState({ isModalVisible });
  };

  render() {
    const { images } = this.props;
    const { isModalVisible, currentImage } = this.state;

    return (
      <>
        <FlatList
          style={{
            alignSelf: "center"
          }}
          numColumns={3}
          data={images}
          keyExtractor={item => item}
          scrollEnabled={false}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                style={{
                  shadowColor: "rgba(0,0,0,0.4)",
                  shadowOffset: { width: 1, height: 2 },
                  shadowOpacity: 0.1,
                  elevation: 1
                }}
                key={index}
                onPress={() => this.openImageGallery(index)}
              >
                <CachedImage
                  source={{ uri: STATIC_URL + item.split("uploads")[1] }}
                  style={styles.imageStyle}
                />
              </TouchableOpacity>
            );
          }}
        />

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
            <TouchableOpacity
              onPress={() => this.setModalState(false)}
              style={{
                height: 30,
                width: 30,
                borderRadius: 15,
                position: "absolute",
                zIndex: 10,
                right: LEFT_MARGIN / 2,
                top: LEFT_MARGIN / 2,
                ...sharedStyles.justifiedCenter
              }}
            >
              <Ionicon
                style={{
                  marginTop: 2.5
                }}
                name={"md-close"}
                color={"#fff"}
                size={30}
              />
            </TouchableOpacity>
            <Gallery
              initialPage={currentImage}
              imageComponent={(imageProps, dimensions) => {
                return (
                  <CachedImage source={imageProps.source.uri} {...imageProps} />
                );
              }}
              onSingleTapConfirmed={() => this.setModalState(false)}
              images={images.map((img, imgId) => {
                return {
                  source: { uri: STATIC_URL + img.split("uploads")[1] }
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
    width: DeviceWidth * 0.27,
    aspectRatio: CARD_WIDTH / IMAGE_HEIGHT,
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 8,
    backgroundColor: "#f9f9f9"
  },
  bigImageStyle: {
    flex: 1,
    backgroundColor: "rgb(242, 243, 246)"
  },
  baseLayout: {
    width: DeviceWidth,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default OherusersImageGrid;
