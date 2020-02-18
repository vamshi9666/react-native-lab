import React, { Component } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import BoldText from "../../components/Texts/BoldText";
import MediumText from "../../components/Texts/MediumText";
import RegularText from "../../components/Texts/RegularText";
import RowView from "../../components/Views/RowView";
import { DeviceHeight, DeviceWidth } from "../../config/Device";
import { retrieveData, storeData } from "../../config/Storage";
import { sharedStyles } from "../../styles/Shared";
import WelcomeScreen from "./Welcome";

var scrollInterval;
const { ScrollView, event, Value } = Animated;
const bottomWaves = [
  require("../../assets/images/onBoarding/green.png"),
  require("../../assets/images/onBoarding/yellow.png"),
  require("../../assets/images/onBoarding/purple.png")
];

const BottomDistance = DeviceHeight * 0.1;

const illustrations = [
  require("../../assets/images/onBoarding/one.png"),
  require("../../assets/images/onBoarding/two.png"),
  require("../../assets/images/onBoarding/three.png")
];

const content = [
  {
    title: "Explore New People",
    text: "Find awesome people\n in your surroundings."
  },
  {
    title: "Connect Over Games",
    text: "Make deeper connections\n through playful interactions."
  },
  { title: "Get Closer!", text: "Meet and have a great time." }
];

const dots = [0, 1, 2, 3];

const IMAGE_WIDTH = DeviceWidth * 0.95;
const SOLID_DOT = "#fff";
const DULL_DOT = "#00000020";

class Slides extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      currentIndex: 0,
      animatedIndicatorPosition: new Value(0)
    };
    this.scrollRef = React.createRef();
  }

  componentDidUpdate(prevProps, prevState) {
    const { state } = this;
    if (state.currentIndex < prevState.currentIndex) {
      clearInterval(scrollInterval);
      this.autoScroll();
    }
  }

  componentDidMount = async () => {
    let status = await retrieveData("HAS_SEEN_TUTORIALS");
    if (status) {
      this.setState({ index: 3, currentIndex: 3 });
    }
    this.autoScroll();
  };

  autoScroll = () => {
    scrollInterval = setInterval(() => {
      const { currentIndex } = this.state;
      if (currentIndex < 2) {
        this.scrollRef
          .getNode()
          .scrollTo({ x: DeviceWidth * (currentIndex + 1) });
      } else if (currentIndex === 2) {
        this.scrollRef
          .getNode()
          .scrollTo({ x: DeviceWidth * (currentIndex + 1) });
        clearInterval(scrollInterval);
      } else {
        clearInterval(scrollInterval);
      }
    }, 4000);
  };

  scrollToNext = () => {
    const { currentIndex } = this.state;
    if (currentIndex < 3) {
      this.scrollRef
        .getNode()
        .scrollTo({ x: DeviceWidth * (currentIndex + 1) });
    } else {
      clearInterval(this.scrollInterval);
    }
  };

  scrollToWelcome = () => {
    this.scrollRef.getNode().scrollTo({ x: DeviceWidth * 3 });
  };

  onMomentumScrollEndHandler = evt => {
    let currentOffset = evt.nativeEvent.contentOffset.x;
    let newSlideIndex = Math.round(currentOffset / DeviceWidth);
    if (this.state.currentIndex !== newSlideIndex) {
      this.setState({ currentIndex: newSlideIndex });
      if (newSlideIndex === 3) {
        storeData("HAS_SEEN_TUTORIALS", "true");
      }
    }
  };

  render() {
    const { navigation } = this.props;
    const { index, currentIndex, animatedIndicatorPosition } = this.state;

    const onScrollHandler = event([
      {
        nativeEvent: { contentOffset: { x: animatedIndicatorPosition } }
      }
    ]);

    const itemOneOpacity = animatedIndicatorPosition.interpolate({
      inputRange: [0, DeviceWidth],
      outputRange: [1, 0]
    });

    const itemTwoOpacity = animatedIndicatorPosition.interpolate({
      inputRange: [0, DeviceWidth, DeviceWidth * 2],
      outputRange: [0, 1, 0]
    });

    const itemThreeOpacity = animatedIndicatorPosition.interpolate({
      inputRange: [0, DeviceWidth, DeviceWidth * 2, DeviceWidth * 3],
      outputRange: [0, 0, 1, 1]
    });

    const hasReachedEnd = currentIndex === 3;

    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          ref={scrollView => (this.scrollRef = scrollView)}
          style={styles.scrollBaseView}
          horizontal
          scrollEventThrottle={1}
          bounces={false}
          onScroll={onScrollHandler}
          contentOffset={{ x: DeviceWidth * index }}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onMomentumScrollEnd={this.onMomentumScrollEndHandler}
        >
          {illustrations.map((item, itemId) => (
            <View style={styles.slideView} key={itemId}>
              <Image
                resizeMode={"contain"}
                style={styles.imageStyle}
                source={item}
              />
              <View
                style={{
                  ...styles.bottomItemsContainer,
                  bottom:
                    itemId === 2 ? BottomDistance + 55 : BottomDistance + 35
                }}
              >
                <BoldText style={styles.bottomTitle}>
                  {content[itemId] ? content[itemId].title : ""}
                </BoldText>
                <RegularText style={styles.bottomText}>
                  {content[itemId] ? content[itemId].text : ""}
                </RegularText>
              </View>
            </View>
          ))}

          <View
            style={{
              width: DeviceWidth
            }}
          >
            <WelcomeScreen navigation={navigation} />
          </View>
        </ScrollView>
        <RowView style={styles.bottomRowView}>
          <TouchableOpacity
            disabled={hasReachedEnd}
            onPress={this.scrollToWelcome}
            style={{
              ...styles.skipButtonView,
              opacity: hasReachedEnd ? 0 : 1
            }}
          >
            <MediumText style={{ color: "#fff" }}>Skip</MediumText>
          </TouchableOpacity>
          <RowView
            style={{
              transform: [
                {
                  translateY: 25
                }
              ]
            }}
          >
            {dots.map(dot => (
              <Animated.View
                key={dot}
                style={{
                  backgroundColor: currentIndex === dot ? SOLID_DOT : DULL_DOT,
                  ...styles.dotStyle
                }}
              />
            ))}
          </RowView>
          <TouchableOpacity
            disabled={hasReachedEnd}
            onPress={this.scrollToNext}
            style={{
              ...styles.skipButtonView,
              opacity: hasReachedEnd ? 0 : 1
            }}
          >
            <MediumText style={{ color: "#fff" }}>Next</MediumText>
          </TouchableOpacity>
        </RowView>
        <View style={styles.bottomView}>
          {bottomWaves.map((wave, id) => (
            <Animated.View
              key={id}
              style={{
                zIndex: 4 - id,
                position: "absolute",
                bottom: -DeviceHeight * 0.55,
                opacity:
                  id === 0
                    ? itemOneOpacity
                    : id === 1
                    ? itemTwoOpacity
                    : itemThreeOpacity
              }}
            >
              <Image
                resizeMode={"contain"}
                style={styles.waveStyle}
                source={wave}
              />
            </Animated.View>
          ))}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollBaseView: {
    height: DeviceHeight,
    zIndex: 2,
    backgroundColor: "#0000"
  },
  bottomItemsContainer: {
    position: "absolute",
    zIndex: 3,
    alignSelf: "center"
  },
  bottomTitle: {
    color: "#fff",
    textAlign: "center",
    fontSize: 23,
    marginBottom: 20
  },
  bottomText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16
  },
  waveStyle: {
    width: DeviceWidth
  },
  bottomView: {
    width: DeviceWidth,
    position: "absolute",
    bottom: 0,
    zIndex: 1,
    height: DeviceHeight * 0.45,
    alignItems: "flex-end",
    justifyContent: "flex-end"
  },
  bottomRowView: {
    justifyContent: "space-between",
    position: "absolute",
    alignSelf: "center",
    bottom: 0,
    zIndex: 3,
    width: DeviceWidth
  },
  skipButtonView: {
    height: 30,
    marginBottom: 20,
    width: DeviceWidth * 0.2,
    ...sharedStyles.justifiedCenter
  },
  slideView: {
    alignItems: "center",
    backgroundColor: "#0000",
    paddingTop: 0,
    height: DeviceHeight,
    width: DeviceWidth
  },
  text: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold"
  },
  imageStyle: {
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH
  },
  dotStyle: {
    height: 9,
    width: 9,
    borderRadius: 4.5,
    marginHorizontal: 3
  }
});

export default Slides;
