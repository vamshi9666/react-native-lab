import React, { Component } from "react";
import { View, ScrollView } from "react-native";
import NoFeedbackTapView from "../Views/NoFeedbackTapView";
import { DeviceHeight, DeviceWidth } from "../../config/Device";
import CurvedBackground from "../Views/Curved.background";
import MediumText from "../Texts/MediumText";
import SvgUri from "react-native-svg-uri";
import GameContainer from "../Common/Game.container";
import TouchableScale from "react-native-touchable-scale";
import { connect } from "react-redux";
import { openFirstCardDirectly } from "../../redux/actions/nav";
import { bindActionCreators } from "redux";
import { sharedStyles } from "../../styles/Shared";
import { LEFT_MARGIN } from "../../config/Constants";
import Animated from "react-native-reanimated";
import { runRepeatedTiming } from "../../config/Animations";

class OthersProfileCards extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  _renderGameCards = (item, index) => {
    const { gameNames, hideTutorial, openFirstCardDirectly } = this.props;

    if (gameNames && gameNames.length > 0) {
      const { colors, key, value } = gameNames.find(game => game._id === item);
      return (
        <TouchableScale
          activeScale={0.96}
          defaultScale={1}
          tension={300}
          friction={10}
          key={index}
          onPress={async () => {
            openFirstCardDirectly(index === 0 ? "one" : index);
            // open specific card and close the tutorial
            setTimeout(() => {
              openFirstCardDirectly(undefined);
              hideTutorial();
              //   this.setState({ showProfileCardsTutorial: false });
            }, 1000);
          }}
          style={{
            shadowRadius: 5,
            shadowColor: "#000000f1",
            shadowOffset: {
              width: 0,
              height: 5
            },
            shadowOpacity: 0.1,
            opacity: 1,
            marginLeft: index === 0 ? LEFT_MARGIN : 0
          }}
        >
          <GameContainer
            height={DeviceWidth * 0.5}
            width={DeviceWidth * 0.37}
            colors={colors}
            gameName={key}
            gameValue={value}
          />
        </TouchableScale>
      );
    } else {
      return (
        <View>
          <MediumText>User Obj has posts but gameNames length is 0.</MediumText>
        </View>
      );
    }
  };

  animation = new Animated.Value(20);
  initialValue = new Animated.Value(0);

  render() {
    const { activeProfile, position, hideTutorial } = this.props;

    return (
      <NoFeedbackTapView
        onPress={hideTutorial}
        style={{
          position: "absolute",
          zIndex: 999,
          backgroundColor: "#00000090",
          height: DeviceHeight,
          paddingTop: position.y - 10
        }}
      >
        <View
          style={{
            position: "absolute",
            top: position.y - 150,
            paddingHorizontal: 15,
            paddingVertical: 0,
            alignSelf: "center",
            backgroundColor: "#000",
            borderRadius: 30,
            ...sharedStyles.justifiedCenter
          }}
        >
          <MediumText
            style={{
              color: "#fff",
              fontSize: 16,
              textAlign: "center",
              marginVertical: 7.5
            }}
          >
            React on these cards to become friends!
          </MediumText>
        </View>
        <Animated.View
          style={{
            transform: [
              { rotate: "180deg" },
              {
                translateY: Animated.sub(
                  0,
                  runRepeatedTiming(this.initialValue, this.animation, 1000)
                )
              }
            ],
            position: "absolute",
            top: position.y - 90,
            alignSelf: "center"
          }}
        >
          <SvgUri
            height={70}
            width={70}
            source={require("../../assets/svgs/Tutorials/clicking.svg")}
          />
        </Animated.View>
        <CurvedBackground
          radius={20}
          style={{
            paddingHorizontal: 0,
            width: DeviceWidth * 0.9,
            height: DeviceWidth * 0.715,
            marginLeft: DeviceWidth * 0.05
          }}
        >
          <View
            style={{
              zIndex: 9999,
              marginVertical: 10,
              elevation: 3,
              flex: 1
            }}
          >
            <MediumText
              style={{
                fontSize: 20,
                color: "#1E2432",
                marginLeft: DeviceWidth * 0.06,
                fontWeight: "bold",
                marginTop: -12,
                marginBottom: 2
              }}
            >
              Profile Cards
            </MediumText>
            <View
              style={{
                flex: 1
              }}
            >
              <ScrollView
                scrollEnabled={false}
                contentContainerStyle={{
                  width: DeviceWidth * 1.4
                }}
                style={{
                  width: DeviceWidth,
                  marginTop: 2.5
                }}
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                {activeProfile.posts.map(this._renderGameCards)}
              </ScrollView>
            </View>
          </View>
        </CurvedBackground>
      </NoFeedbackTapView>
    );
  }
}

const mapStateToProps = state => {
  return {
    gameNames: state.questions.gameNames
  };
};

const mapDispatchToProps = dispatch => {
  return {
    openFirstCardDirectly: bindActionCreators(openFirstCardDirectly, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OthersProfileCards);
