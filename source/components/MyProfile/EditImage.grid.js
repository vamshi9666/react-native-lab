import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { IMAGE_HEIGHT, CARD_WIDTH, LEFT_MARGIN } from "../../config/Constants";
import { DeviceWidth, DeviceHeight } from "../../config/Device";
import Ionicon from "react-native-vector-icons/Ionicons";
import { BRIGHT_RED, FONT_GREY } from "../../config/Colors";
import JustifiedCenteredView from "../Views/JustifiedCenteredView";
import MediumText from "../Texts/MediumText";
import RegularText from "../Texts/RegularText";
import NoFeedbackTapView from "../Views/NoFeedbackTapView";
import { updateProfile } from "../../network/auth";
import { connect } from "react-redux";
import * as UserActions from "../../redux/actions/user.info";
import { bindActionCreators } from "redux";
import { createAnimatableComponent } from "react-native-animatable";
const AnimatedNoFeedbackTapView = createAnimatableComponent(NoFeedbackTapView);
const imagesCount = [1, 2, 3, 4, 5, 6];

class EditImageGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newImagePosition: null
    };
  }

  setNewImage = i => {
    const {
      imageToBeEdited,
      dismissModal,
      userData,
      updateImages
    } = this.props;
    this.setState({ newImagePosition: i }, () => {
      let imagesFromState = userData.images;
      const oldImageIndex = imagesFromState[imageToBeEdited];
      const newImageIndex = imagesFromState[i];
      imagesFromState[i] = oldImageIndex;
      imagesFromState[imageToBeEdited] = newImageIndex;
      updateImages({ images: imagesFromState });
      updateProfile({ images: imagesFromState }, cbData => {
        dismissModal();
      });
    });
  };

  render() {
    const {
      imageToBeEdited,
      dismissModal,
      userData: { images }
    } = this.props;
    const { newImagePosition } = this.state;

    const _isImagePositionNull = newImagePosition === null;
    const selectedImage = _isImagePositionNull
      ? imageToBeEdited
      : newImagePosition;

    return (
      <View style={styles.container}>
        <MediumText
          style={{
            color: FONT_GREY,
            fontSize: 23,
            marginTop: DeviceHeight * 0.1,
            textAlign: "center",
            padding: LEFT_MARGIN,
            lineHeight: 25
          }}
        >
          Where do you want to {"\n"}place the picture?
        </MediumText>
        <TouchableOpacity
          onPress={dismissModal}
          style={{
            ...styles.roundButtonView,
            position: "absolute",
            top: LEFT_MARGIN,
            right: LEFT_MARGIN,
            zIndex: 2,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.1,
            elevation: 1
          }}
        >
          <Ionicon
            style={{
              marginTop: 2.5
            }}
            name={"md-close"}
            size={25}
            color={"#cacaca"}
          />
        </TouchableOpacity>
        <FlatList
          extraData={{ ...this.props, ...this.state }}
          keyExtractor={item => item}
          data={imagesCount}
          numColumns={2}
          renderItem={({ item, index }) => {
            const isToBeDisabled = Number(index) > images.length - 1;
            if (isToBeDisabled || selectedImage === index) {
              return (
                <View
                  onPress={() => this.setNewImage(index)}
                  style={{
                    ...styles.editImageHolderStyle,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor:
                      selectedImage === index
                        ? "#774CD550"
                        : isToBeDisabled
                        ? "#cacaca15"
                        : "rgb(242,242,242)"
                  }}
                >
                  <View
                    style={{
                      ...styles.roundButtonView,
                      backgroundColor: isToBeDisabled ? "#fff" : "#fff"
                    }}
                  >
                    <RegularText
                      style={{
                        fontSize: 20,
                        color: isToBeDisabled ? "#9b9b9b30" : FONT_GREY
                      }}
                    >
                      {index + 1}
                    </RegularText>
                  </View>
                </View>
              );
            } else {
              return (
                <AnimatedNoFeedbackTapView
                  iterationCount={"infinite"}
                  onPress={() => this.setNewImage(index)}
                  style={{
                    ...styles.editImageHolderStyle,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor:
                      selectedImage === index
                        ? "#774CD550"
                        : isToBeDisabled
                        ? "#cacaca15"
                        : "rgb(242,242,242)"
                  }}
                  animation={"pulse"}
                  duration={700}
                  iteration
                >
                  <View
                    style={{
                      ...styles.roundButtonView,
                      backgroundColor: isToBeDisabled ? "#fff" : "#fff"
                    }}
                  >
                    <RegularText
                      style={{
                        fontSize: 20,
                        color: isToBeDisabled ? "#9b9b9b30" : FONT_GREY
                      }}
                    >
                      {index + 1}
                    </RegularText>
                  </View>
                </AnimatedNoFeedbackTapView>
              );
            }
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0000",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 20,
    marginTop: LEFT_MARGIN,
    paddingBottom: LEFT_MARGIN
  },
  roundButtonView: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  editImageHolderStyle: {
    width: DeviceWidth * 0.275,
    aspectRatio: CARD_WIDTH / IMAGE_HEIGHT,
    borderRadius: 15,
    margin: LEFT_MARGIN / 3
  }
});

const mapStateToProps = state => {
  return {
    userData: state.info.userInfo
  };
};
const mapDispatchToProps = dispatch => {
  return {
    updateImages: bindActionCreators(UserActions.updateOwnProfile, dispatch)
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(EditImageGrid);
