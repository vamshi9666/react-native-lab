import React, { Component } from "react";
import { View, Text } from "react-native";
import Animated from "react-native-reanimated";
import { connect } from "react-redux";
import SurfingCard, { CARD_SIZE } from "./Surfing.card";
import { ReText } from "react-native-redash";
import { CARD_WIDTH } from "../../config/Constants";
import Lodash from "lodash";
import { blockOneUser } from "../../network/user";
const {
  Value,
  multiply,
  concat,
  add,
  lessThan,
  cond,
  call,
  onChange,
  abs,
  debug,
  block,
  eq
} = Animated;

const arr = new Array(20).fill(1);
class ProfilesList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    const initialProfileIndex = props.currentProfileIndex;
    const initialTranslateX = initialProfileIndex * CARD_SIZE * -1;
    this.prevTranslateX = new Value(initialTranslateX);
    this.currentTranslateX = new Value(initialTranslateX);
    this.currentProfileIndex = new Value(initialProfileIndex);
    this.previousUnAnsweredProfileIndex = new Value(initialProfileIndex - 1);
    this.jsCurrentProfileIndex = initialProfileIndex;
  }

  getPreviousUnAnsweredProfileIndex = () => {
    const { profiles, currentProfileIndex } = this.props;
    // const currentProfileIndex = 12;
    let wantedProfileIndex;

    for (let i = currentProfileIndex; i >= 0; i--) {
      if (!wantedProfileIndex) {
        const eachProfile = profiles[i];
        if (!eachProfile) {
          return;
        }

        // if (eachProfile.user_index === 91) {
        if (!eachProfile.reacted) {
          wantedProfileIndex = i;
        }
      }
    }
    return this.jsCurrentProfileIndex - 1;
    // return !!wantedProfileIndex ? wantedProfileIndex : -1;
  };

  setCurrentProfileIndex = () => {
    const index = this.getPreviousUnAnsweredProfileIndex();
    console.log(" prev profiles index is ", index);
    this.previousUnAnsweredProfileIndex.setValue(index);
    // this.jsCurrentProfileIndex = index;
  };
  componentDidMount = () => {
    this.setCurrentProfileIndex();
  };

  // onItemSnapped = () => {
  //   const { onItemSnapped } = this.props;
  //   this.setCurrentProfileIndex();
  //   onItemSnapped(this.jsCurrentProfileIndex);
  // };
  render() {
    const {
      profiles,
      onItemSnapped,

      showNotAvailableModal,

      //prev props

      othersProfileNav,
      setReactButtonPosition,
      onSparkTapped,
      openSparkConfirmation,
      openFirstProfileCard,
      showOneTimeTutorial,
      fetchRoomsData,
      openBuyGemsModal
    } = this.props;
    return (
      <>
        <Animated.Code>
          {() =>
            block([
              arr.map((_i, i) => {
                return cond(eq(this.currentProfileIndex, i), [
                  call([], () => {
                    console.log(
                      " pre val to be is ",
                      i,
                      this.jsCurrentProfileIndex
                    );

                    if (this.jsCurrentProfileIndex === i) {
                      // this.jsCurrentProfileIndex = i;
                      this.setCurrentProfileIndex();
                      // onItemSnapped(this.jsCurrentProfileIndex, () => {});
                    }
                  })
                ]);
              })
              // onChange(this.currentProfileIndex, [
              //   call([], () => {
              //     this.setCurrentProfileIndex();
              //   })
              // ])
            ])
          }
        </Animated.Code>
        <View
          style={{
            flex: 1
            // flexDirection: "row",
            // backgroundColor: "red"
          }}
        >
          <Animated.View
            style={{
              // flex: 1,
              flexDirection: "row",
              // backgroundColor: "red",

              transform: [
                // { translateX: this.prevTranslateX },
                { translateX: multiply(1, this.currentTranslateX) }
              ]
            }}
          >
            {profiles.map((profile, pIndex) => {
              return (
                <SurfingCard
                  showNotAvailableModal={showNotAvailableModal}
                  onProfileBackward={(newIndex, continueAnimation) => {
                    if (newIndex === -1) {
                      return;
                    }
                    console.log(
                      " new index is ",
                      this.jsCurrentProfileIndex - 1
                    );
                    onItemSnapped(
                      this.jsCurrentProfileIndex - 1,
                      continueAnimation
                    );
                    // setTimeout(() => {
                    //   console.log(
                    //     " continue animation function is ",
                    //     continueAnimation
                    //   );
                    //   continueAnimation();
                    // }, 1000);
                  }}
                  onProfileForward={currentIndex => {
                    this.jsCurrentProfileIndex += 1;
                    console.log(" new index is ", this.jsCurrentProfileIndex);
                    setTimeout(() => {
                      onItemSnapped(this.jsCurrentProfileIndex, () => {
                        alert(" empty ");
                      });
                    }, 300);
                  }}
                  currentProfileIndex={this.currentProfileIndex}
                  previousUnAnsweredProfileIndex={
                    this.previousUnAnsweredProfileIndex
                  }
                  currentTranslateX={this.currentTranslateX}
                  safeTranslateX={this.prevTranslateX}
                  item={profile}
                  setReactButtonPosition={setReactButtonPosition}
                  index={pIndex}
                  key={pIndex}
                  onSparkTapped={() =>
                    onSparkTapped(profile.name, profile._id, profile)
                  }
                  othersProfileNav={othersProfileNav}
                  openSparkConfirmation={openSparkConfirmation}
                  openFirstProfileCard={openFirstProfileCard}
                  showOneTimeTutorial={showOneTimeTutorial}
                  fetchRoomsData={fetchRoomsData}
                  openBuyGemsModal={openBuyGemsModal}
                />
              );
            })}
          </Animated.View>
        </View>
      </>
    );
  }
}

const mapState = state => {
  return {
    profiles: state.profiles.thirtyProfiles,
    currentProfileIndex: state.profiles.currentProfileIndex
  };
};

export default connect(mapState, {})(ProfilesList);
