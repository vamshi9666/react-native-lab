import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { DeviceHeight, DeviceWidth } from "../../config/Device";
import { connect } from "react-redux";
import SurfingCard from "../Surfing/Surfing.card";
import NoFeedbackTapView from "../Views/NoFeedbackTapView";
import { PURPLE, LIGHT_PURPLE } from "../../../src/config/Colors";
import MediumText from "../Texts/MediumText";
import GradientHeader from "../Surfing/Gradient.header";
import ProfileModal from "../Surfing/ProfileModal";
import BottomSheet from "reanimated-bottom-sheet";
import VerticalGradientView from "../Views/VerticalGradientView";
import Response from "../Profile.Modal/Response";
import { userNamify } from "../../config/Utils";
import Lodash from "lodash";
import ProfileCardsOverReactButton from "../Surfing/ProfileCardsOverReactButton";

class MyProfilePreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOthersProfileOpened: false,
      selectedGame: null,
      position: {},
      selectedGameIndex: 0,
      showProfileCardsOverReactButton: false
    };
    this.bottomSheetTransY = new Animated.Value(1);
    this.btmRef = React.createRef();
  }

  othersProfileNav = () => {
    this.btmRef.snapTo(1);
  };

  renderGradientHeader = () => {
    const { myData } = this.props;
    return <GradientHeader targetUser={myData} />;
  };

  openFirstProfileCard = () => {
    this.setState({
      showProfileCardsOverReactButton: true
    });
    // const { myData } = this.props;
    // this.btmRef.snapTo(1);
    // setTimeout(() => {
    //   this.openResponseScreen(
    //     myData.posts[0],
    //     {
    //       x: DeviceWidth * 0.075,
    //       y: DeviceHeight * 0.415,
    //       height: DeviceWidth * 0.5,
    //       width: DeviceWidth * 0.37
    //     },
    //     0
    //   );
    // }, 100);
  };

  openResponseScreen = (selectedGame, position, selectedGameIndex) => {
    this.setState({
      selectedGame,
      position,
      selectedGameIndex
    });
    this.props.setResponseScreenOpenState(true);
  };

  renderOthersProfile = () => {
    const { currentProfilePosts, myData } = this.props;

    return (
      <BottomSheet
        enabledBottomClamp={true}
        ref={ref => (this.btmRef = ref)}
        snapPoints={[-20, DeviceHeight * 0.96]}
        callbackNode={this.bottomSheetTransY}
        enabledHeaderGestureInteraction
        enabledContentGestureInteraction
        onOpenEnd={() => this.setState({ isOthersProfileOpened: true })}
        onCloseEnd={() => {
          this.setState({ isOthersProfileOpened: false });
        }}
        renderHeader={this.renderGradientHeader}
        renderContentt={() => <View />}
        renderContent={() => {
          return (
            <ProfileModal
              onClose={() => {
                this.btmRef.snapTo(0);
              }}
              navigateToChat={() => {}}
              openBlockAndReportsModal={() => {}}
              onInstaConnectionTapped={() => {}}
              swipeProfileUp={() => {}}
              activeProfile={myData}
              userInfo={myData}
              fromMyProfile={true}
              showCards={true}
              postsLoading={false}
              currentProfilePosts={currentProfilePosts}
              openResponseScreen={this.openResponseScreen}
            />
          );
        }}
      />
    );
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    const { myData, hideOthersProfile } = this.props;
    const { showProfileCardsOverReactButton: oldState } = this.state;

    return (
      !Lodash.isEqual(myData, nextProps.myData) ||
      hideOthersProfile !== nextProps.hideOthersProfile ||
      oldState !== nextState.showProfileCardsOverReactButton
    );
  };

  renderShadow = () => {
    const opacity = Animated.interpolate(this.bottomSheetTransY, {
      inputRange: [0, 0.5, 1],
      outputRange: [0.8, 0.2, 0]
    });
    return (
      <Animated.View
        pointerEvents="none"
        style={{
          backgroundColor: "#000",
          ...StyleSheet.absoluteFillObject,
          opacity,
          zIndex: 4
        }}
      />
    );
  };

  onClose = () => {
    this.setState({ selectedGame: null });
    this.props.setResponseScreenOpenState(false);
  };

  renderResponseScreen = () => {
    const { position, selectedGame, selectedGameIndex } = this.state;
    const { currentProfilePosts, myData } = this.props;

    if (selectedGame) {
      return (
        <Response
          position={position}
          onClose={this.onClose}
          fromChatWindow={false}
          showTutorial={false}
          selectedGame={selectedGame}
          closeLightBoxModal={this.closeLightBoxModal}
          selectedGameIndex={selectedGameIndex}
          games={currentProfilePosts}
          targetUser={myData}
          userName={userNamify(myData)}
          userImage={
            myData &&
            myData.images &&
            myData.images.length > 0 &&
            myData.images[0]
          }
        />
      );
    } else {
      return <View />;
    }
  };

  render() {
    const { myData, closeAndScrollToEdit, hideOthersProfile } = this.props;
    const {
      isOthersProfileOpened,
      showProfileCardsOverReactButton
    } = this.state;

    return (
      <View style={styles.base}>
        {hideOthersProfile ? <View /> : this.renderOthersProfile()}
        {this.renderShadow()}
        {this.renderResponseScreen()}
        {showProfileCardsOverReactButton ? (
          <ProfileCardsOverReactButton
            activeProfile={myData}
            close={() => {
              this.setState({ showProfileCardsOverReactButton: false });
              // this.sendResponses();
            }}
            navigateToChat={() => {
              this.setState({ showProfileCardsOverReactButton: false });
              this.props.navigation.push("chatFavourites");
            }}
            openResponseScreen={this.openResponseScreen}
          />
        ) : (
          <View />
        )}

        <View
          style={[
            styles.closingBar,
            { opacity: isOthersProfileOpened ? 0 : 1 }
          ]}
        />
        <View style={{ alignItems: "center" }}>
          {/* <SurfingCard
            openFirstProfileCard={this.openFirstProfileCard}
            fromPreview={true}
            item={myData}
            index={0}
            onSparkTapped={() => {}}
            othersProfileNav={this.othersProfileNav}
          /> */}
          <NoFeedbackTapView
            style={styles.buttonView}
            onPress={closeAndScrollToEdit}
          >
            <VerticalGradientView
              colors={[PURPLE, LIGHT_PURPLE]}
              style={styles.buttonStyle}
            >
              <MediumText style={styles.buttonText}>Edit Profile</MediumText>
            </VerticalGradientView>
          </NoFeedbackTapView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  base: {
    height: DeviceHeight,
    width: DeviceWidth,
    zIndex: 3
  },
  closingBar: {
    height: 5,
    borderRadius: 30,
    alignSelf: "center",
    backgroundColor: "#fff",
    width: DeviceWidth * 0.2,
    marginBottom: DeviceHeight * 0.015,
    marginTop: DeviceHeight * 0.05
  },
  buttonView: {
    marginTop: DeviceHeight * 0.025
  },
  buttonStyle: {
    height: 50,
    width: DeviceWidth * 0.9,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 30
  },
  buttonText: {
    fontSize: 20,
    color: "#fff"
  }
});

const mapState = state => {
  return {
    myData: state.info.userInfo || {},
    currentProfilePosts: state.info.posts
  };
};

const mapDispatch = dispatch => {
  return {};
};
export default connect(mapState, mapDispatch)(MyProfilePreview);
