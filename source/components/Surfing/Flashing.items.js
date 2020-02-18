import React, { Component } from "react";
import { Animated, Easing, Image, View, StyleSheet } from "react-native";
import Ionicon from "react-native-vector-icons/Ionicons";
import RegularText from "../../components/Texts/RegularText";
import { View as AnimatableView } from "react-native-animatable";
import RowView from "../../components/Views/RowView";
import { FONT_BLACK } from "../../config/Colors";
import { LEFT_MARGIN } from "../../config/Constants";
import { DeviceWidth } from "../../config/Device";
import { checkNullAndUndefined, getDistanceText } from "../../config/Utils";
import SvgUri from "react-native-svg-uri";
const { Value } = Animated;

const ICONS = {
  jobTitle: require("../../assets/svgs/Surfing/LivingIn.svg"),
  organization: require("../../assets/svgs/Surfing/LivingIn.svg"),
  education: require("../../assets/svgs/Surfing/LivingIn.svg"),
  graduatedYear: require("../../assets/svgs/Surfing/LivingIn.svg"),
  gender: require("../../assets/svgs/Surfing/LivingIn.svg"),
  height: require("../../assets/svgs/Surfing/LivingIn.svg"),
  zodiac: require("../../assets/svgs/Surfing/LivingIn.svg"),
  education_level: require("../../assets/svgs/Surfing/LivingIn.svg"),
  workout_preference: require("../../assets/svgs/Surfing/LivingIn.svg"),
  native_place: require("../../assets/svgs/Surfing/ImFrom.svg"),
  living_in: require("../../assets/svgs/Surfing/LivingIn.svg")
};

class FlashingItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animatedOpacity: new Value(1),
      animatedOpacityTwo: new Value(0),
      animatedOpacityThree: new Value(0),
      animatedOpacityFour: new Value(0),
      animatedOpacityFive: new Value(0),
      itemsToShow: []
    };
  }

  componentDidMount = () => {
    const {
      animatedOpacity,
      animatedOpacityTwo,
      animatedOpacityThree,
      animatedOpacityFour,
      animatedOpacityFive
    } = this.state;

    this.setState({ itemsToShow: this.getItemsToShow() });
    const count = this.getItemsToShow().length;

    if (count === 3 || count === 4) {
      setTimeout(() => {
        Animated.sequence([
          Animated.timing(animatedOpacity, {
            toValue: 0,
            duration: 2000,
            easing: Easing.linear()
          }),
          Animated.timing(animatedOpacityTwo, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear()
          })
        ]).start();
      }, 2000);
    }
    if (count === 5 || count === 6) {
      setTimeout(() => {
        Animated.sequence([
          Animated.timing(animatedOpacity, {
            toValue: 0,
            duration: 2000,
            easing: Easing.linear()
          }),
          Animated.timing(animatedOpacityTwo, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear()
          }),
          Animated.timing(animatedOpacityTwo, {
            toValue: 0,
            duration: 3500,
            easing: Easing.linear()
          }),
          Animated.timing(animatedOpacityThree, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear()
          }),
          Animated.timing(animatedOpacityThree, {
            toValue: 0,
            duration: 3500,
            easing: Easing.linear()
          }),
          Animated.timing(animatedOpacityFour, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear()
          })
        ]).start();
      }, 2000);
    }
    if (count === 7 || count === 8) {
      setTimeout(() => {
        Animated.sequence([
          Animated.timing(animatedOpacity, {
            toValue: 0,
            duration: 2000,
            easing: Easing.linear()
          }),
          Animated.timing(animatedOpacityTwo, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear()
          }),
          Animated.timing(animatedOpacityTwo, {
            toValue: 0,
            duration: 2000,
            easing: Easing.linear()
          }),
          Animated.timing(animatedOpacityThree, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear()
          }),
          Animated.timing(animatedOpacityThree, {
            toValue: 0,
            duration: 2000,
            easing: Easing.linear()
          }),
          Animated.timing(animatedOpacityFour, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear()
          })
        ]).start();
      }, 2000);
    }
    if (count > 8) {
      setTimeout(() => {
        Animated.sequence([
          Animated.timing(animatedOpacity, {
            toValue: 0,
            duration: 2000,
            easing: Easing.linear()
          }),
          Animated.timing(animatedOpacityTwo, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear()
          }),
          Animated.timing(animatedOpacityTwo, {
            toValue: 0,
            duration: 2000,
            easing: Easing.linear()
          }),
          Animated.timing(animatedOpacityThree, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear()
          }),
          Animated.timing(animatedOpacityThree, {
            toValue: 0,
            duration: 2000,
            easing: Easing.linear()
          }),
          Animated.timing(animatedOpacityFour, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear()
          }),
          Animated.timing(animatedOpacityFour, {
            toValue: 0,
            duration: 2000,
            easing: Easing.linear()
          }),
          Animated.timing(animatedOpacityFive, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear()
          })
        ]).start();
      }, 2000);
    }
  };

  getItemsToShow = () => {
    const {
      item: {
        jobTitle,
        organization,
        education,
        graduatedYear,
        gender,
        zodiac,
        education_level,
        living_in,
        native_place,
        height,
        workout_preference
      }
    } = this.props;
    let itemsToShow = [];
    if (
      checkNullAndUndefined(jobTitle) &&
      checkNullAndUndefined(organization)
    ) {
      itemsToShow.push({
        fieldOne: "jobTitle",
        fieldTwo: "organization"
      });
    }
    if (
      checkNullAndUndefined(education) ||
      checkNullAndUndefined(graduatedYear)
    ) {
      if (
        checkNullAndUndefined(education) &&
        checkNullAndUndefined(graduatedYear)
      ) {
        itemsToShow.push({
          fieldOne: "education",
          fieldTwo: "graduatedYear"
        });
      } else {
        itemsToShow.push({
          fieldOne: "education"
        });
      }
    }
    if (checkNullAndUndefined(gender)) {
      itemsToShow.push({
        fieldOne: "gender"
      });
    }
    if (checkNullAndUndefined(zodiac)) {
      itemsToShow.push({
        fieldOne: "zodiac"
      });
    }
    if (checkNullAndUndefined(education_level)) {
      itemsToShow.push({
        fieldOne: "education_level"
      });
    }
    if (checkNullAndUndefined(living_in)) {
      itemsToShow.push({
        fieldOne: "living_in"
      });
    }
    if (checkNullAndUndefined(native_place)) {
      itemsToShow.push({
        fieldOne: "native_place"
      });
    }
    if (checkNullAndUndefined(height)) {
      itemsToShow.push({
        fieldOne: "height"
      });
    }
    if (checkNullAndUndefined(workout_preference)) {
      itemsToShow.push({
        fieldOne: "workout_preference"
      });
    }
    return itemsToShow;
  };

  renderSingleItemAndLocation = (item, value) => {
    return (
      <View>
        <RowView
          style={{
            width: (DeviceWidth * 0.8) / 2,
            alignItems: "flex-start",
            marginLeft: LEFT_MARGIN * 1.2
          }}
        >
          <SvgUri height={20} width={20} source={ICONS[item.fieldOne]} />
          <RegularText
            style={{
              margin: 5,
              fontSize: 13
            }}
          >
            {value}
          </RegularText>
        </RowView>

        {this.renderLocation()}
      </View>
    );
  };

  renderItem = (item, itemId) => {
    const { item: myData } = this.props;

    return (
      <RowView
        key={itemId}
        style={{
          width: (DeviceWidth * 0.8) / 2,
          alignItems: "flex-start",
          marginLeft: LEFT_MARGIN / 3,
          marginTop: itemId === 0 ? -6 : 5
        }}
      >
        <SvgUri height={18} width={18} source={ICONS[item.fieldOne]} />
        <RegularText
          style={{
            margin: 5,
            fontSize: 13
          }}
        >
          {item.fieldTwo
            ? myData[item.fieldOne] + ", " + myData[item.fieldTwo]
            : myData[item.fieldOne]}
        </RegularText>
      </RowView>
    );
  };

  renderLocation = () => {
    const { item } = this.props;

    return (
      <RowView
        style={{
          transform: [{ translateY: 5 }],
          width: DeviceWidth * 0.35
        }}
      >
        <View
          style={{
            paddingLeft: 25
          }}
        >
          <Ionicon name={"ios-pin"} color={"rgb(58,77,227)"} size={19} />
        </View>
        <RegularText numberOfLines={1} style={styles.placeText}>
          {getDistanceText(item.dist && item.dist.distance, item.place)}
        </RegularText>
      </RowView>
    );
  };

  renderSinglePair = itemsToShow => {
    const { animatedOpacity, animatedOpacityTwo } = this.state;

    return (
      <View
        style={{
          marginLeft: LEFT_MARGIN * 1.5
        }}
      >
        {itemsToShow.map(this.renderItem)}
      </View>
    );
  };

  renderSinglePairAndLocation = itemsToShow => {
    const { animatedOpacity, animatedOpacityTwo } = this.state;
    const { item } = this.props;

    return (
      <View style={{ position: "absolute" }}>
        <Animated.View
          style={{
            opacity: animatedOpacity
          }}
        >
          {this.renderSingleItemAndLocation(
            itemsToShow[0],
            item[itemsToShow[0].fieldOne]
          )}
        </Animated.View>

        <Animated.View
          style={{
            opacity: animatedOpacityTwo
          }}
        >
          {itemsToShow.map((item, itemId) => {
            if (itemId > 0) {
              return this.renderItem(item, itemId);
            }
          })}
        </Animated.View>
      </View>
    );
  };

  renderTwoPairs = itemsToShow => {
    const { animatedOpacity, animatedOpacityTwo } = this.state;
    return (
      <View style={{ position: "absolute" }}>
        <Animated.View
          style={{
            opacity: animatedOpacity
          }}
        >
          {itemsToShow.map((item, itemId) => {
            if (itemId < 2) {
              return this.renderItem(item, itemId);
            }
          })}
        </Animated.View>

        <Animated.View
          style={{
            opacity: animatedOpacityTwo
          }}
        >
          {itemsToShow.map((item, itemId) => {
            if (itemId > 1) {
              return this.renderItem(item, itemId);
            }
          })}
        </Animated.View>
      </View>
    );
  };

  renderTwoPairsAndLocation = itemsToShow => {
    const {
      animatedOpacity,
      animatedOpacityTwo,
      animatedOpacityThree
    } = this.state;
    const { item } = this.props;
    return (
      <View style={{ position: "absolute" }}>
        <Animated.View
          style={{
            opacity: animatedOpacity
          }}
        >
          {this.renderSingleItemAndLocation(
            itemsToShow[0],
            item[itemsToShow[0].fieldOne]
          )}
        </Animated.View>
        <Animated.View
          style={{
            opacity: animatedOpacityTwo
          }}
        >
          {itemsToShow.map((item, itemId) => {
            if (itemId === 1 || itemId === 2) {
              return this.renderItem(item, itemId);
            }
          })}
        </Animated.View>

        <Animated.View
          style={{
            opacity: animatedOpacityThree
          }}
        >
          {itemsToShow.map((item, itemId) => {
            if (itemId > 2) {
              return this.renderItem(item, itemId);
            }
          })}
        </Animated.View>
      </View>
    );
  };

  renderThreePairs = itemsToShow => {
    const {
      animatedOpacity,
      animatedOpacityTwo,
      animatedOpacityThree,
      animatedOpacityFour
    } = this.state;
    const { item } = this.props;
    return (
      <View
        style={{
          position: "absolute",
          marginLeft: LEFT_MARGIN
        }}
      >
        <Animated.View
          style={{
            opacity: animatedOpacity,
            position: "absolute",
            marginLeft: -LEFT_MARGIN
          }}
        >
          {this.renderSingleItemAndLocation(
            itemsToShow[0],
            item[itemsToShow[0].fieldOne]
          )}
        </Animated.View>
        <Animated.View
          style={{
            opacity: animatedOpacityTwo,
            position: "absolute"
          }}
        >
          {itemsToShow.map((item, itemId) => {
            if (itemId === 1 || itemId === 2) {
              return this.renderItem(item, itemId);
            }
          })}
        </Animated.View>
        <Animated.View
          style={{
            opacity: animatedOpacityThree,
            position: "absolute"
          }}
        >
          {itemsToShow.map((item, itemId) => {
            if (itemId === 3 || itemId === 4) {
              return this.renderItem(item, itemId);
            }
          })}
        </Animated.View>
        <Animated.View
          style={{
            opacity: animatedOpacityFour,
            position: "absolute"
          }}
        >
          {itemsToShow.map((item, itemId) => {
            if (itemId === 5) {
              return this.renderItem(item, itemId);
            }
          })}
        </Animated.View>
      </View>
    );
  };

  renderThreePairsAndLocation = itemsToShow => {
    const {
      animatedOpacity,
      animatedOpacityTwo,
      animatedOpacityThree,
      animatedOpacityFour
    } = this.state;
    const { item } = this.props;
    return (
      <View style={{ position: "absolute" }}>
        <Animated.View
          style={{
            opacity: animatedOpacity
          }}
        >
          {this.renderSingleItemAndLocation(
            itemsToShow[0],
            item[itemsToShow[0].fieldOne]
          )}

          {this.renderLocation()}
        </Animated.View>
        <Animated.View
          style={{
            opacity: animatedOpacityTwo
          }}
        >
          {itemsToShow.map((item, itemId) => {
            if (itemId === 1 || itemId === 2) {
              return this.renderItem(item, itemId);
            }
          })}
        </Animated.View>

        <Animated.View
          style={{
            opacity: animatedOpacityThree
          }}
        >
          {itemsToShow.map((item, itemId) => {
            if (itemId === 3 || itemId === 4) {
              return this.renderItem(item, itemId);
            }
          })}
        </Animated.View>
        <Animated.View
          style={{
            opacity: animatedOpacityFour
          }}
        >
          {itemsToShow.map((item, itemId) => {
            if (itemId > 4) {
              return this.renderItem(item, itemId);
            }
          })}
        </Animated.View>
      </View>
    );
  };

  renderFourPairs = itemsToShow => {
    const {
      animatedOpacity,
      animatedOpacityTwo,
      animatedOpacityThree,
      animatedOpacityFour
    } = this.state;
    return (
      <View style={{ position: "absolute" }}>
        <Animated.View
          style={{
            opacity: animatedOpacity
          }}
        >
          {itemsToShow.map((item, itemId) => {
            if (itemId < 2) {
              return this.renderItem(item, itemId);
            }
          })}
        </Animated.View>
        <Animated.View
          style={{
            opacity: animatedOpacityTwo
          }}
        >
          {itemsToShow.map((item, itemId) => {
            if (itemId === 2 || itemId === 3) {
              return this.renderItem(item, itemId);
            }
          })}
        </Animated.View>

        <Animated.View
          style={{
            opacity: animatedOpacityThree
          }}
        >
          {itemsToShow.map((item, itemId) => {
            if (itemId === 4 || itemId === 5) {
              return this.renderItem(item, itemId);
            }
          })}
        </Animated.View>
        <Animated.View
          style={{
            opacity: animatedOpacityFour
          }}
        >
          {itemsToShow.map((item, itemId) => {
            if (itemId > 5) {
              return this.renderItem(item, itemId);
            }
          })}
        </Animated.View>
      </View>
    );
  };

  renderFourPairsAndLocation = itemsToShow => {
    const {
      animatedOpacity,
      animatedOpacityTwo,
      animatedOpacityThree,
      animatedOpacityFour,
      animatedOpacityFive
    } = this.state;
    const { item } = this.props;
    return (
      <View style={{ position: "absolute" }}>
        <Animated.View
          style={{ opacity: animatedOpacity, position: "absolute" }}
        >
          {this.renderSingleItemAndLocation(
            itemsToShow[0],
            item[itemsToShow[0].fieldOne]
          )}
        </Animated.View>
        <Animated.View
          style={{
            opacity: animatedOpacityTwo,
            position: "absolute"
          }}
        >
          {itemsToShow.map((item, itemId) => {
            if (itemId === 1 || itemId === 2) {
              return this.renderItem(item, itemId);
            }
          })}
        </Animated.View>
        <Animated.View
          style={{
            opacity: animatedOpacityThree,
            position: "absolute"
          }}
        >
          {itemsToShow.map((item, itemId) => {
            if (itemId === 3 || itemId === 4) {
              return this.renderItem(item, itemId);
            }
          })}
        </Animated.View>

        <Animated.View
          style={{
            opacity: animatedOpacityFour,
            position: "absolute"
          }}
        >
          {itemsToShow.map((item, itemId) => {
            if (itemId === 5 || itemId === 6) {
              return this.renderItem(item, itemId);
            }
          })}
        </Animated.View>
        <Animated.View
          style={{
            opacity: animatedOpacityFive,
            position: "absolute"
          }}
        >
          {itemsToShow.map((item, itemId) => {
            if (itemId === 7 || itemId === 8) {
              return this.renderItem(item, itemId);
            }
          })}
        </Animated.View>
      </View>
    );
  };

  render() {
    const { itemsToShow } = this.state;
    const { item } = this.props;
    const count = itemsToShow.length;

    // console.log("items to show count areee: ", item.name, count);

    // return (
    //   <View>
    //     <RegularText>{count}</RegularText>
    //   </View>
    // );

    return (
      <AnimatableView animation={"fadeIn"} duration={500}>
        {count === 1 ? (
          this.renderSingleItemAndLocation(
            itemsToShow[0],
            item[itemsToShow[0].fieldOne]
          )
        ) : count === 2 ? (
          this.renderSinglePair(itemsToShow)
        ) : count === 3 ? (
          this.renderSinglePairAndLocation(itemsToShow)
        ) : count === 4 ? (
          this.renderTwoPairs(itemsToShow)
        ) : count === 5 ? (
          this.renderTwoPairsAndLocation(itemsToShow)
        ) : count === 6 ? (
          this.renderThreePairs(itemsToShow)
        ) : count === 7 ? (
          this.renderThreePairsAndLocation(itemsToShow)
        ) : count === 8 ? (
          this.renderFourPairs(itemsToShow)
        ) : count === 9 ? (
          this.renderFourPairsAndLocation(itemsToShow)
        ) : (
          <View />
        )}
      </AnimatableView>
    );
  }
}

const styles = StyleSheet.create({
  placeText: {
    transform: [{ translateX: 12 }, { translateY: 2.5 }],
    color: FONT_BLACK
  }
});

export default FlashingItems;
