import React, { Component } from "react";
import { Image, Platform, StyleSheet, View } from "react-native";
import { View as AnimatableView } from "react-native-animatable";
import {
  PanGestureHandler,
  State,
  TapGestureHandler,
  Button
} from "react-native-gesture-handler";
import { CachedImage } from "react-native-img-cache";
import Animated, { Easing } from "react-native-reanimated";
import Toast from "react-native-simple-toast";
import SvgUri from "react-native-svg-uri";
import TouchableScale from "react-native-touchable-scale";
import Ionicon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import GemsAcknowledgement from "../../components/Gemsflow/GemsAcknowledgement";
import BoldText from "../../components/Texts/BoldText";
import RegularText from "../../components/Texts/RegularText";
import NoFeedbackTapView from "../../components/Views/NoFeedbackTapView";
import RowView from "../../components/Views/RowView";
import VerticalGradientView from "../../components/Views/VerticalGradientView";
import { STATIC_URL } from "../../config/Api";
import { FONT_BLACK, LIGHT_PURPLE, PURPLE } from "../../config/Colors";
import {
  CARD_WIDTH,
  gemPlanColors,
  IMAGE_HEIGHT,
  LEFT_MARGIN,
  MONETIZATION_ITEMS
} from "../../config/Constants";
import { DeviceHeight, DeviceWidth } from "../../config/Device";
import {
  checkNullAndUndefined,
  getDistanceText,
  getStartOfDay,
  userNamify
} from "../../config/Utils";
import {
  consumeAndFulFill,
  purchaseAndFulfill,
  purchaseGems
} from "../../network/pack";
import { getUserPacks } from "../../network/spark";
import { updateProfile } from "../../network/user";
import {
  addSparkFailure,
  setPackPrices,
  setUserPacks
} from "../../redux/actions/app";
import { sendSparkToProfile } from "../../redux/actions/profiles";
import {
  addExpenseTutorialCount,
  setReactButtonTutorialVisibility
} from "../../redux/actions/tutorials";
import { updateOwnProfile } from "../../redux/actions/user.info";
import AnimateCountModal from "../Gemsflow/AnimateCount.modal";
import FlashingItems from "./Flashing.items";
import SparkButton from "./SparkButton";
import ReAnimatedTouchableScale from "../Buttons/Touchable.scale";
// import { runTiming } from "../../config/Animations";

const { OS } = Platform;
// const CARD_WIDTH = DeviceWidth;

const {
  Value,
  divide,
  multiply,
  abs,
  cond,
  eq,
  event,
  and,
  lessThan,
  block,
  neq,
  onChange,
  interpolate,
  set,
  debug,
  add,
  diffClamp,
  timing,
  or,
  clockRunning,
  Clock,
  startClock,
  stopClock,
  decay,
  greaterThan,
  lessOrEq,
  sub,
  spring,
  Extrapolate,
  call,
  greaterOrEq
} = Animated;

const SCROLL_HOLDER_HEIGHT_FACTOR = 0.15;
const MIN_DRAG_RIGHT = 200;
const ANIM_DURATION = 500;
const VELOCITY_THRESHOLD = 100;
export const CARD_SIZE = CARD_WIDTH + DeviceWidth * 0.055;
class SurfingCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animatedIndicatorPosition: new Value(0),
      currentImageIndex: 0,
      showCountAnimation: false,
      itemIcon: null,
      fromCount: null,
      toCount: null,
      onCountAnimated: null,
      sparkPriceObj: null,
      sparkUserPack: null
    };
    this.startOfDay = getStartOfDay();

    const gestureState = new Value(-1);
    const _tappedPositionY = new Value(0);

    this.onStateChange = event([
      {
        nativeEvent: {
          state: gestureState,
          y: _tappedPositionY
        }
      }
    ]);
    this.animatedScale = cond(
      and(
        eq(gestureState, State.BEGAN)
        // lessThan(_tappedPositionY, multiply(DeviceHeight, 0.6))
      ),
      0.98,
      1
    );
    this.sparkBtnHandler = React.createRef();
    this.wholeCardTapHandler = React.createRef();
    this.showSpark = new Value(0);
    this.showGemsAcknowledgement = new Value(0);
    this.panState = new Value(State.UNDETERMINED);
    this.dragX = new Value(0);
    this.velocityX = new Value(0);
    this.animState = new Value(0);
    this.springClock = new Clock();
    this.nextClock = new Clock();
    this.prevClock = new Clock();
    this.wentBack = new Value(0);
    this.prevProfilesAvailable = true;
    this.previousProfilesAnyAvaialble = true;
    this.callState = new Value(0);
    this.progresss = new Value(0);
  }
  // reactRef = React.createRef();
  // measure = async () =>
  //   new Promise(resolve =>
  //     this.reactRef.current.measureInWindow((x, y, width, height) => {
  //       resolve({ x, y, width, height });
  //     })
  //   );
  componentDidMount = () => {
    const {
      reactButtonTutorialSeen,
      setReactButtonPosition,
      locationPermissionGranted,
      index,
      packPrices,
      userPacks,
      setReactButtonTutorialVisibility
    } = this.props;
    if (!reactButtonTutorialSeen && locationPermissionGranted && index === 0) {
      setReactButtonTutorialVisibility();
      setTimeout(async () => {
        // const position = await this.measure();
        setReactButtonPosition();
      }, 500);
    }
    const sparkPriceObj = packPrices && packPrices.find(p => p.key === "SPARK");

    const sparkUserPack =
      userPacks && userPacks.find(p => p.itemId && p.itemId.value === "SPARK");
    this.setState({
      sparkPriceObj,
      sparkUserPack
    });
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    const isSentSparkPropDifferent =
      nextProps.item.sentSpark !== this.props.item.sentSpark;
    const isTutorialSeenPropDifferent =
      nextProps.reactButtonTutorialSeen !== this.props.reactButtonTutorialSeen;
    const isLocationPermissionPropDifferent =
      nextProps.locationPermissionGranted !==
      this.props.locationPermissionGranted;
    const showCountAnimationStateDifferent =
      this.state.showCountAnimation !== nextState.showCountAnimation;
    const sparkFailurePropDifferent =
      nextProps.sparkFailure !== this.props.sparkFailure;
    if (
      isSentSparkPropDifferent ||
      isTutorialSeenPropDifferent ||
      isLocationPermissionPropDifferent ||
      showCountAnimationStateDifferent ||
      sparkFailurePropDifferent
    ) {
      return true;
    } else {
      return false;
    }
  };
  showCountAnimationWithDelay = (
    iconName,
    fromCount,
    toCount,
    onCountAnimated
  ) =>
    new Promise(resolve => {
      setTimeout(() => {
        console.log(" going to call state changed ");
        this.showCountAnimationMethod(
          iconName,
          fromCount,
          toCount,
          onCountAnimated
        );

        resolve();
      }, 300);
    });

  componentWillReceiveProps = nextProps => {
    const prevProps = this.props;
    if (prevProps.sparkFailure !== nextProps.sparkFailure) {
      if (nextProps.sparkFailure === null) {
        this.showSpark.setValue(1);
      } else {
        this.showSpark.setValue(2);
      }
    }
  };
  onMomentumScrollEnd = evt => {
    const { currentImageIndex } = this.state;
    const currentOffset = evt.nativeEvent.contentOffset.y;
    const newIndex = Math.round(currentOffset / IMAGE_HEIGHT);
    if (newIndex !== currentImageIndex) {
      this.setState({ currentImageIndex: newIndex });
    }
  };

  renderBioContent = bio => {
    return (
      <AnimatableView animation={"fadeIn"} duration={500}>
        <RowView
          style={{
            width: "80%"
          }}
        >
          <View
            style={{
              transform: [
                { rotate: "180deg" },
                { translateX: -LEFT_MARGIN * 1.3 },
                { translateY: 5 }
              ],
              paddingLeft: LEFT_MARGIN
            }}
          >
            <SvgUri
              width={12}
              height={12}
              source={require("../../assets/svgs/Surfing/bionew.svg")}
            />
          </View>
          <RegularText
            numberOfLines={1}
            style={{
              paddingHorizontal: 10,
              fontSize: 15,
              color: FONT_BLACK,
              transform: [{ translateY: -2.5 }, { translateX: LEFT_MARGIN / 3 }]
            }}
          >
            {bio}
          </RegularText>
        </RowView>
        {this.renderPlaceContent()}
      </AnimatableView>
    );
  };

  renderInstaContent = count => {
    return (
      <AnimatableView animation={"fadeIn"} duration={500}>
        <RowView
          style={{
            width: "80%",
            transform: [{ translateX: LEFT_MARGIN * 1.2 }, { translateY: -2.5 }]
          }}
        >
          <Image
            source={require("../../assets/images/insta.png")}
            style={{
              height: 16,
              width: 16,
              alignSelf: "center",
              marginTop: 0
            }}
          />
          <RegularText
            style={{
              paddingHorizontal: 10,
              fontSize: 15,
              color: FONT_BLACK,
              transform: [{ translateY: 2 }]
            }}
          >
            {count === 1 ? `${count} Photo` : `${count} Photos`}
          </RegularText>
        </RowView>
        {this.renderPlaceContent()}
      </AnimatableView>
    );
  };

  renderPlaceContent = () => {
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

  renderFbContent = () => {
    return (
      <AnimatableView animation={"fadeIn"} duration={500}>
        <RowView
          style={{
            width: "80%",
            transform: [{ translateX: LEFT_MARGIN * 1.2 }, { translateY: -2.5 }]
          }}
        >
          <Image
            source={require("../../assets/images/fb.png")}
            style={{
              height: 16,
              width: 16,
              alignSelf: "center",
              marginTop: 0
            }}
          />
          <RegularText
            style={{
              paddingHorizontal: 10,
              fontSize: 15,
              color: FONT_BLACK,
              transform: [{ translateY: 2 }]
            }}
          >
            4 mutual friends
          </RegularText>
        </RowView>
        {this.renderPlaceContent()}
      </AnimatableView>
    );
  };
  fetchUserPacks = () => {
    getUserPacks(packsResult => {
      console.log(" spark price is result final is ", packsResult);
      if (packsResult.success) {
        this.props.setUserPacks(packsResult.data);
      }
    });
  };

  showCountAnimationMethod = (
    iconName,
    fromCount,
    toCount,
    onCountAnimated
  ) => {
    this.setState(
      {
        showCountAnimation: true,
        itemIcon:
          iconName === "GEM"
            ? require("../../assets/svgs/MyProfile/Gem.svg")
            : iconName === "SPARK"
            ? require("../../assets/svgs/Surfing/spark.svg")
            : require("../../assets/svgs/GemsFlow/extension.svg"),
        fromCount,
        toCount,
        onCountAnimated
      },
      () => {
        console.log(
          " state changed one step is ",
          this.state.showCountAnimation
        );
      }
    );
  };

  handleSparkError = (err, fromGems, consumedCount) => {
    console.log(" spark sent result error case ", err);
    const { item, addSparkFailure } = this.props;
    addSparkFailure({
      userImage: STATIC_URL + item.images[0].split("uploads")[1],
      userName: userNamify(item),
      showName: item.showName,
      userId: item._id,
      fromGems,
      consumedCount,
      showSparkAgain: () => {
        this.showSpark.setValue(1);
        console.log("getting called ");
      }
    });
  };
  sendSpark = async startSecondAnimation => {
    // await this.showCountAnimationWithDelay("SPARK", 1, 0, () => {
    //   startSecondAnimation(() => {
    //   });
    // });
    const { sparkPriceObj } = this.state;
    const consumeAndFulFillCall = async ({
      deductCount,
      deductFrom,
      type = MONETIZATION_ITEMS.SPARK,
      freeUsage = false
    }) => {
      consumeAndFulFill({
        itemId: sparkPriceObj._id,
        contentId: item._id,
        deductCount, //
        deductFrom, //
        item: type, //
        freeUsage //
      })
        .then(result => {
          console.log(" spark sent result is ", result);
          // this.props.onSparkTapped(item._id);
          this.props.onSparkTapped();
          this.props.updateOwnProfile({
            gems_count: +(myData.gems_count - deductCount)
          });
          return result;
        })
        .catch(err =>
          this.handleSparkError(err, deductFrom === "gems", deductCount)
        );
    };

    const purchasedUsageCall = () => {
      startSecondAnimation(async () => {
        await consumeAndFulFillCall({
          deductFrom: "pack",
          deductCount: 1
        });
        this.props.onSparkTapped();
        this.fetchUserPacks();
      });
    };
    const consumeGemsCall = () => {
      startSecondAnimation(async () => {
        await consumeAndFulFillCall({
          deductFrom: "gems",
          deductCount: sparkPriceObj.price
        });
      });
    };
    // return;
    const {
      item,
      myData,
      packPrices,
      userPacks,
      bulkPlans,
      openSparkConfirmation,
      onSparkTapped,
      addSparkToProfile,
      adminProps,
      openBuyGemsModal,
      incrimentExpenseTutorial
    } = this.props;

    if (
      !myData.seenMonetisationTutorials ||
      myData.seenMonetisationTutorials.indexOf("Sparks") === -1
    ) {
      this.props.showOneTimeTutorial("Sparks", () => {
        this.sendSpark();
      });
      const seenMonetisationTutorials = myData.seenMonetisationTutorials || [];
      seenMonetisationTutorials.push("Sparks");
      this.props.updateOwnProfile({ seenMonetisationTutorials });
      updateProfile({ seenMonetisationTutorials }, cbUpdated => {});
    } else {
      const { sparkPriceObj, sparkUserPack: userPack } = this.state;

      const { dailyFreeSparkLimit } = adminProps;
      const freeUsageCall = () => {
        startSecondAnimation(() =>
          consumeAndFulFillCall({
            deductCount: 1,
            deductFrom: "pack",
            freeUsage: true
            // type:SPARK
          })
        );
      };
      const purchasedPackCall = newCount => {
        purchaseAndFulfill({
          isPack: true,
          contentId: item._id,
          countToBeAdded: newCount,
          deductCount: sparkPriceObj.price,
          item: "SPARK"
        })
          .then(res => {
            console.log(" res is ", res);
            this.props.onSparkTapped();
            this.fetchUserPacks();
          })
          .catch(err => {
            this.handleSparkError(err, false, sparkPriceObj.price);
          });
      };

      const purchaseGemsCall = (newCount, toCount) => {
        purchaseAndFulfill({
          isPack: false,
          contentId: item._id,
          countToBeAdded: newCount,
          deductCount: 1,
          item: "SPARK",
          packId: userPack._id,
          itemId: sparkPriceObj._id
        })
          .then(res => {
            console.log(" res is ", res);
            this.props.onSparkTapped();

            this.props.updateOwnProfile({
              gems_count: toCount
            });
          })
          .catch(err => {
            this.handleSparkError(err, true, 1);
          });
      };
      if (!userPack) {
        this.showCountAnimationWithDelay("SPARK", 1, 0, freeUsageCall);
      } else {
        const isFreeCountCrossed =
          userPack.freeUsageCount >= dailyFreeSparkLimit;
        const isLastUsedNotToday =
          userPack.freeUsageUpdatedAt < this.startOfDay;
        const isLastUsageMonitizedOne =
          !!userPack.monetisedUpdatedAt &&
          userPack.freeUsageUpdatedAt < userPack.monetisedUpdatedAt;
        const isHavingPurchasedItems = userPack.purchasedCount > 0;
        const isGemsEnough = myData.gems_count >= sparkPriceObj.price;
        const hasUsedMonization = userPack.monetisedUsage !== 0;
        const helperText = isLastUsageMonitizedOne
          ? "Out of Sparks"
          : "Done for today";
        const refreshedAt = isLastUsageMonitizedOne
          ? userPack.monetisedUpdatedAt
          : userPack.freeUsageUpdatedAt;

        if (isLastUsedNotToday) {
          await this.showCountAnimationWithDelay("SPARK", 1, 0, freeUsageCall);
        } else if (!isFreeCountCrossed) {
          //todo
          await this.showCountAnimationWithDelay("SPARK", 1, 0, freeUsageCall);
        } else if (isHavingPurchasedItems) {
          const fromCount = userPack.purchasedCount;
          const toCount = userPack.pruchaedCount - 1;
          await this.showCountAnimationWithDelay(
            "SPARK",
            fromCount,
            toCount,
            purchasedUsageCall
          );
        } else if (isGemsEnough) {
          const sparkTutorialCount = this.props.tutorials[userPack._id];
          if (!sparkTutorialCount || sparkTutorialCount < 1) {
            incrimentExpenseTutorial(userPack._id);
            openSparkConfirmation({
              count: sparkPriceObj.price,
              unit: "sparks",
              successCallback: async () => {
                const fromCount = myData.gems_count;
                const toCount = myData.gems_count - sparkPriceObj.price;
                await this.showCountAnimationWithDelay(
                  "GEM",
                  fromCount,
                  toCount,
                  consumeGemsCall
                );
              },
              failureCallback: () => {
                setTimeout(() => {
                  this.refs["spark_button"].startToNormal();
                }, 300);
              }
            });
          } else {
            const fromCount = myData.gems_count;
            const toCount = fromCount - sparkPriceObj.price;
            this.showCountAnimationWithDelay(
              "GEM",
              fromCount,
              toCount,
              consumeGemsCall
            );
          }
        } else {
          const buyPower = {
            successCallback: async selectedItemCount => {
              const fromCount = myData.gems_count + selectedItemCount;
              const toCount = fromCount - sparkPriceObj.price;

              await this.showCountAnimationWithDelay(
                "GEM",
                fromCount,
                toCount,
                () => purchaseGemsCall(fromCount, toCount)
              );
            },
            failureCallback: () => {
              setTimeout(() => {
                this.refs["spark_button"].startToNormal();
              }, 300);
            },
            hasOffers: true,
            extraData: {
              extraDescription: helperText,
              refreshedAt
            },
            powerName: "Spark",
            cost: sparkPriceObj.price,
            colors: gemPlanColors["Sparks"]
          };
          const bulkPackage = {
            bulkItemName: "SPARK",
            extraData: {
              extraDescription: helperText
            },
            successCallback: async selectedItemCount => {
              const fromCount = selectedItemCount;
              const toCount = selectedItemCount - 1;
              await this.showCountAnimationWithDelay(
                "SPARK",
                fromCount,
                toCount,
                () => purchasedPackCall(selectedItemCount)
              );
            },
            failureCallback: () => {}
          };
          openBuyGemsModal(buyPower, bulkPackage);
        }
      }
    }
  };

  closeCountModal = () => {
    this.setState({ showCountAnimation: false });
  };

  purchaseGems = async gemsToBeAdded => {
    purchaseGems(gemsToBeAdded, purchaseResult => {
      console.log(" purchase result is &&&  ", purchaseResult);
      if (purchaseResult.success) {
        this.props.updateOwnProfile({
          gems_count: purchaseResult.data.gems_count
        });
        return;
      }
    });
  };
  setAnimState = toBeSet => {
    this.animState.setValue(toBeSet);
  };
  renderGemsTest = () => {
    return (
      <GemsAcknowledgement
        show={this.showGemsAcknowledgement}
        fromCount={27}
        toCount={17}
      />
    );
  };
  renderCode = () => {
    const {
      currentTranslateX,
      safeTranslateX,
      index: profileIndex,
      currentProfileIndex,
      previousUnAnsweredProfileIndex,
      onProfileBackward,
      onProfileForward,
      showNotAvailableModal
      // nextTranslateX
    } = this.props;
    const prevTranslateX = safeTranslateX;

    const nextTranslateX = multiply(-1, add(abs(safeTranslateX), CARD_SIZE));
    const prevProfileTranslate = multiply(
      -1,
      previousUnAnsweredProfileIndex,
      CARD_SIZE
    );

    const index = new Value(profileIndex);
    return (
      <>
        <Animated.Code>
          {() =>
            block([
              cond(eq(previousUnAnsweredProfileIndex, -1), [
                cond(this.previousProfilesAnyAvaialble, [
                  call([], () => {
                    this.previousProfilesAnyAvaialble = false;
                  })
                ])
              ]),
              cond(
                eq(previousUnAnsweredProfileIndex, sub(currentProfileIndex, 1)),
                [
                  cond(this.prevProfilesAvailable, [
                    call([], () => {
                      this.prevProfilesAvailable = false;
                    })
                  ])
                ]
              ),

              cond(eq(this.panState, State.ACTIVE), [
                cond(
                  lessThan(this.velocityX, 0),
                  [
                    set(
                      currentTranslateX,

                      add(safeTranslateX, this.dragX)
                    )
                  ],
                  [
                    cond(
                      and(eq(this.wentBack, 0), greaterOrEq(this.dragX, 170)),

                      // [cond(eq(this.animState, 0),
                      [set(this.animState, 3)],
                      [
                        // )],
                        set(currentTranslateX, add(safeTranslateX, this.dragX))
                      ]
                    )
                  ]
                )
              ]),
              cond(eq(this.panState, State.END), [
                cond(
                  or(
                    eq(index, sub(currentProfileIndex, 1)),
                    eq(index, currentProfileIndex),
                    eq(index, add(currentProfileIndex, 1))
                  ),
                  [
                    cond(
                      greaterOrEq(multiply(-1, this.dragX), MIN_DRAG_RIGHT),
                      [
                        cond(eq(index, currentProfileIndex), [
                          set(this.animState, 1)
                        ])
                      ],
                      [
                        cond(
                          greaterOrEq(
                            multiply(-1, this.velocityX),
                            VELOCITY_THRESHOLD
                          ),
                          [
                            cond(eq(index, currentProfileIndex), [
                              set(this.animState, 1)
                            ])
                          ],
                          [
                            debug(" case hre", safeTranslateX),

                            set(this.animState, 2)
                          ]
                        )
                      ]
                    )
                  ]
                )
              ])
            ])
          }
        </Animated.Code>
        <Animated.Code>
          {() =>
            block([
              cond(eq(this.animState, 1), [
                set(
                  currentTranslateX,
                  runTiming({
                    completeNode: this.animState,
                    completeValue: 0,
                    clock: this.nextClock,
                    dest: nextTranslateX,
                    duration: ANIM_DURATION,
                    onComplete: () => {
                      currentProfileIndex.setValue(add(currentProfileIndex, 1));
                      safeTranslateX.setValue(nextTranslateX);
                      onProfileForward(profileIndex);
                    },
                    value: currentTranslateX,
                    velocity: this.velocityX
                  })
                )
                // set(
                //   this.progresss,
                //   runTiming({
                //     completeNode: new Value(0),
                //     completeValue: 0,
                //     clock: this.progresssClock,
                //     dest: 1,
                //     duration: ANIM_DURATION,
                //     onComplete: () => {
                //       // currentProfileIndex.setValue(add(currentProfileIndex, 1));
                //       // safeTranslateX.setValue(nextTranslateX);
                //       // onProfileForward(profileIndex);
                //     },
                //     value: currentTranslateX,
                //     velocity: this.velocityX
                //   })
                // )
              ]),
              cond(eq(this.animState, 2), [
                set(
                  currentTranslateX,
                  runTiming({
                    completeNode: this.animState,
                    completeValue: 0,
                    dest: prevTranslateX,
                    clock: this.prevClock,
                    duration: ANIM_DURATION,
                    onComplete: () => {
                      // alert(" two ");
                    },
                    value: currentTranslateX,
                    velocity: this.velocityX
                  })
                )
              ]),
              cond(eq(this.animState, 4), [
                set(
                  currentTranslateX,
                  runTiming({
                    completeNode: this.animState,
                    completeValue: 0,
                    dest: prevProfileTranslate,
                    clock: this.prevClock,
                    duration: ANIM_DURATION,
                    onComplete: () => {
                      currentProfileIndex.setValue(
                        previousUnAnsweredProfileIndex
                      );
                      safeTranslateX.setValue(prevProfileTranslate);
                    },
                    value: currentTranslateX,
                    velocity: this.velocityX
                  })
                )
              ]),
              cond(eq(this.animState, 3), [
                set(
                  currentTranslateX,
                  runTiming({
                    completeNode: this.animState,
                    completeValue: 0,
                    dest: prevTranslateX,
                    clock: this.prevClock,
                    duration: ANIM_DURATION,
                    onComplete: () => {
                      const goBackFunction = index => {
                        onProfileBackward(index, () => {
                          this.animState.setValue(4);
                        });
                      };
                      // this.wentBack.setValue(0);
                      const isProfileFirstOne = profileIndex === 0;
                      if (isProfileFirstOne) {
                        // alert(" cant go  backwards . this is first profile");
                        return;
                      } else if (this.prevProfilesAvailable) {
                        goBackFunction(currentProfileIndex);
                      } else if (!this.previousProfilesAnyAvaialble) {
                        console.log(" case two");
                        // this.animState.setValue(
                        //   cond(eq(this.animState, 2), 0, 2)
                        // );
                        showNotAvailableModal();
                        // goBackFunction(-1);
                      } else {
                        console.log(" case three");

                        goBackFunction(currentProfileIndex);
                        // Alert.alert("step back test", "just a message", [
                        //   {
                        //     text: "go back",
                        //     onPress: () => {
                        //       // alert(" should go back now ");
                        //       this.animState.setValue(4);
                        //     }
                        //   },
                        //   {
                        //     text: " Stay here ",
                        //     onPress: () => {
                        //       alert(" ok . lets leave ");
                        //     }
                        //   }
                        // ]);
                      }
                    },
                    value: currentTranslateX,
                    velocity: this.velocityX
                  })
                )
              ])
            ])
          }
        </Animated.Code>
      </>
    );
  };
  render() {
    const {
      animatedIndicatorPosition,
      currentImageIndex,
      showCountAnimation,
      itemIcon,
      fromCount,
      toCount,
      onCountAnimated
    } = this.state;
    const {
      item,
      othersProfileNav,
      showPresetModal,
      fromPreview,
      openFirstProfileCard,
      index,
      currentTranslateX
    } = this.props;
    const { fb_token, insta_images, bio } = item;

    const onScrollHandler = event(
      [
        {
          nativeEvent: { contentOffset: { y: animatedIndicatorPosition } }
        }
      ],
      { useNativeDriver: true }
    );
    const NOB_HEIGHT =
      item && item.images
        ? (DeviceHeight * SCROLL_HOLDER_HEIGHT_FACTOR) / item.images.length
        : 1;
    const translateY = animatedIndicatorPosition.interpolate({
      inputRange: [0, IMAGE_HEIGHT],
      outputRange: [0, NOB_HEIGHT]
    });

    const gestureHandler = event([
      {
        nativeEvent: {
          translationX: this.dragX,
          // translationX: currentTranslateX,
          velocityX: this.velocityX,

          // translationY: this.dragY,
          state: this.panState
        }
      }
    ]);
    // const cardScale = interpolate(indexDiffFromCurrentProfileIndex, {
    //   inputRange: [0, 1],
    //   outputRange: [1, 0.5],
    //   extrapolate: Extrapolate.CLAMP
    // });
    return (
      <>
        {this.renderCode()}
        {showCountAnimation ? (
          <AnimateCountModal
            itemIcon={itemIcon}
            fromSurfingCard={true}
            fromCount={fromCount}
            toCount={toCount}
            onComplete={onCountAnimated}
            closeCountModal={this.closeCountModal}
          />
        ) : (
          <View />
        )}
        <PanGestureHandler
          simultaneousHandlers={[
            this.sparkBtnHandler,
            this.wholeCardTapHandler
          ]}
          // key={index}
          // minDeltaX={0}
          // minDeltaY={0}

          onHandlerStateChange={gestureHandler}
          onGestureEvent={gestureHandler}
        >
          <Animated.View
            key={index}
            style={{
              // backgroundColor: "blue",
              // width: DeviceWidth,
              marginLeft: index === 0 ? 12 : 0,
              marginRight: 24,
              height: styles.cardLayout.height,
              marginTop: 40
              // transform: [{ scale: cardScale }]
              // padding: 8
              // flex: 1
            }}
          >
            <TapGestureHandler
              ref={this.wholeCardTapHandler}
              onHandlerStateChange={this.onStateChange}
            >
              <Animated.View
                style={[
                  styles.cardLayout,

                  {
                    // backgroundColor: "red",
                    // width: DeviceWidth,
                    // backgroundColor: "green",
                    // height: undefined,
                    // padding: 8,
                    transform: [
                      {
                        scale: this.animatedScale
                      }
                    ]
                  }
                ]}
              >
                {item.images && item.images.length > 1 ? (
                  <View style={styles.scrollHolder}>
                    <Animated.View
                      style={{
                        height: divide(
                          multiply(DeviceHeight, SCROLL_HOLDER_HEIGHT_FACTOR),
                          item.images.length
                        ),
                        transform: [
                          {
                            translateY
                          }
                        ],
                        ...styles.scrollIndicator
                      }}
                    />
                  </View>
                ) : (
                  <View />
                )}
                <Animated.ScrollView
                  decelerationRate={"fast"}
                  scrollEventThrottle={1}
                  // bounces={!fromPreview}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={IMAGE_HEIGHT}
                  onScroll={onScrollHandler}
                  onMomentumScrollEnd={this.onMomentumScrollEnd}
                  style={styles.scrollView}
                >
                  {item.images &&
                    item.images.length > 0 &&
                    item.images.map((image, imageId) => (
                      <NoFeedbackTapView
                        key={imageId}
                        onPress={() => othersProfileNav(0)}
                      >
                        <CachedImage
                          style={styles.userImageBig}
                          source={{
                            uri: STATIC_URL + image.split("uploads")[1]
                          }}
                        />
                      </NoFeedbackTapView>
                    ))}
                </Animated.ScrollView>
                {!item.sentSpark && (
                  <SparkButton
                    sparkBtnHandler={this.sparkBtnHandler}
                    show={this.showSpark}
                    ref={"spark_button"}
                    disabled={item.sentSpark ? true : false}
                    onPress={this.sendSpark}
                    afterComplete={success => {
                      // if (success){

                      Toast.showWithGravity(
                        "Spark sent!",
                        Toast.SHORT,
                        Toast.CENTER
                      );
                      // }
                    }}
                  />
                )}
                <NoFeedbackTapView
                  onPress={() => othersProfileNav(0)}
                  style={styles.bottomCardView}
                >
                  <RowView>
                    {/* {item.filledPercent === 100 ? (
                <View
                  style={{
                    transform: [
                      {
                        translateY: 18
                      },
                      {
                        translateX: 2
                      },
                      {
                        rotate: "0deg"
                      }
                    ],
                    marginLeft: 10
                  }}
                >
                  <SvgUri
                    width={20}
                    height={20}
                    source={require("../../assets/svgs/MyProfile/Crown.svg")}
                  />
                </View>
              ) : (
                <View />
              )} */}
                    <BoldText style={styles.userName}>
                      {userNamify(item)}, {item.age ? item.age : ""}
                    </BoldText>

                    {/* <JustifiedCenteredView style={styles.tickIconView}>
              <FontAwesome5
                style={styles.tickIcon}
                name={"check"}
                color={"#fff"}
                size={11}
              />
            </JustifiedCenteredView> */}
                  </RowView>
                  <View style={{ marginTop: 15, marginLeft: -5 }}>
                    {currentImageIndex === 0 ? (
                      checkNullAndUndefined(fb_token) ? (
                        this.renderFbContent()
                      ) : insta_images && insta_images.length > 0 ? (
                        this.renderInstaContent(insta_images.length)
                      ) : checkNullAndUndefined(bio) ? (
                        this.renderBioContent(bio)
                      ) : (
                        <FlashingItems item={item} />
                      )
                    ) : currentImageIndex === 1 ? (
                      insta_images && insta_images.length > 0 ? (
                        this.renderInstaContent(insta_images.length)
                      ) : checkNullAndUndefined(bio) ? (
                        this.renderBioContent(bio)
                      ) : (
                        <FlashingItems item={item} />
                      )
                    ) : currentImageIndex === 2 ? (
                      checkNullAndUndefined(bio) &&
                      insta_images &&
                      insta_images.length > 0 &&
                      checkNullAndUndefined(fb_token) ? (
                        this.renderBioContent(bio)
                      ) : (
                        <FlashingItems item={item} />
                      )
                    ) : currentImageIndex === 3 ? (
                      <FlashingItems item={item} />
                    ) : (
                      this.renderPlaceContent()
                    )}
                  </View>
                </NoFeedbackTapView>

                <View
                  style={{
                    width: DeviceWidth * 0.4,
                    alignItems: "center",
                    alignSelf: "flex-end",
                    position: "absolute",
                    bottom: DeviceHeight * 0.02
                  }}
                >
                  <ReAnimatedTouchableScale
                    activeScale={0.9}
                    defaultScale={1}
                    tension={500}
                    friction={100}
                    // onPress={() => {
                    //   // this.showSpark.setValue(cond(eq(this.showSpark, 1), 2, 1))
                    //   this.showGemsAcknowledgement.setValue(
                    //     cond(eq(this.showGemsAcknowledgement, 1), 2, 1)
                    //   );
                    // }}
                    onPress={openFirstProfileCard}
                  >
                    <VerticalGradientView
                      colors={[LIGHT_PURPLE, PURPLE]}
                      style={styles.reactButtonView}
                    >
                      <View
                        style={{
                          paddingLeft: 15
                        }}
                      >
                        <SvgUri
                          width={15}
                          height={15}
                          source={require("../../assets/svgs/Surfing/paperrocket.svg")}
                        />
                      </View>
                      <RegularText style={styles.reactText}>React</RegularText>
                    </VerticalGradientView>
                  </ReAnimatedTouchableScale>
                </View>
              </Animated.View>
            </TapGestureHandler>
          </Animated.View>
        </PanGestureHandler>
      </>
    );
  }
}

function runDecay({ value, velocity }) {
  const clock = new Clock();
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0)
  };

  const config = { deceleration: 0.99 };

  return [
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.velocity, velocity),
      set(state.position, value),
      set(state.time, 0),
      startClock(clock)
    ]),
    set(state.position, value),
    decay(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position
  ];
}

function runSpring({ clock, value, velocity, dest }) {
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0)
  };

  const config = {
    damping: 7,
    mass: 10,
    stiffness: 121.6,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
    toValue: new Value(0)
  };

  return [
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.velocity, velocity),
      set(state.position, value),
      set(config.toValue, dest),
      startClock(clock)
    ]),
    spring(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position
  ];
}

function runTiming({
  value,
  dest,
  completeNode,
  completeValue,
  onComplete,
  duration
  // clock
}) {
  const clock = new Clock();
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0)
  };

  const config = {
    duration,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease)
  };

  return block([
    cond(
      clockRunning(clock),
      [set(config.toValue, dest)],
      [
        set(state.finished, 0),
        set(state.time, 0),
        set(state.position, value),
        set(state.frameTime, 0),
        set(config.toValue, dest),
        startClock(clock)
      ]
    ),
    timing(clock, state, config),
    cond(state.finished, [
      stopClock(clock),
      set(completeNode, completeValue),
      call([], () => onComplete())
    ]),
    state.position
  ]);
}
const styles = StyleSheet.create({
  placeText: {
    transform: [{ translateX: 12 }, { translateY: 2.5 }],
    color: FONT_BLACK
  },
  scrollView: {
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    backgroundColor: "rgb(242, 243, 246)"
  },
  userImageBig: {
    flex: 1,
    aspectRatio: CARD_WIDTH / IMAGE_HEIGHT,
    backgroundColor: "#00000012"
  },
  sparkButtonSubView: {
    height: 55,
    width: 55,
    shadowRadius: 10,
    shadowColor: "#000000d1",
    shadowOffset: {
      width: 2,
      height: 10
    },
    shadowOpacity: 0.15,
    backgroundColor: "#fff",
    borderRadius: 27.5
  },
  reactButtonMainView: {
    shadowColor: "#00000050",
    shadowOffset: {
      height: 1,
      width: 0
    },
    shadowOpacity: 0.9
  },
  reactButtonView: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    alignSelf: "center",
    flexDirection: "row",
    width: DeviceWidth * 0.3
  },
  reactText: {
    color: "#fff",
    paddingVertical: 8,
    paddingLeft: 10,
    paddingRight: 30,
    fontSize: 18
  },
  tickIconView: {
    backgroundColor: "rgb(47,124,228)",
    height: 20,
    width: 20,
    borderRadius: 10,
    marginTop: 20,
    marginLeft: 10
  },
  tickIcon: {
    marginTop: 2,
    marginLeft: 0.5
  },
  sparkButtonView: {
    position: "absolute",
    right: 20,
    bottom: DeviceHeight * 0.2 - 25,
    zIndex: 2,
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    backgroundColor: "#fff",
    shadowColor: "#000000A0",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 3
    }
  },
  scrollIndicator: {
    width: 3,
    borderRadius: 20,
    backgroundColor: "rgb(255,255,255)"
  },
  scrollHolder: {
    height: DeviceHeight * SCROLL_HOLDER_HEIGHT_FACTOR,
    width: 3,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.3)",
    position: "absolute",
    right: 10,
    top: 20,
    zIndex: 1
  },
  userName: {
    fontSize: 25,
    marginLeft: LEFT_MARGIN / 4,
    color: "#000",
    marginTop: LEFT_MARGIN
  },
  bottomCardView: {
    height: DeviceHeight * 0.2,
    width: CARD_WIDTH,
    backgroundColor: "rgb(252, 252, 255)",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15
  },
  cardLayout: {
    height: DeviceHeight * 0.2 + IMAGE_HEIGHT,
    width: CARD_WIDTH,
    borderRadius: 15,
    overflow: OS === "ios" ? "visible" : "hidden",
    elevation: 3,
    shadowColor: "#000000A0",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2
    }
  }
});

const mapState = state => {
  return {
    myData: state.info.userInfo,
    userPacks: state.app.userPacks,
    packPrices: state.app.packPrices,
    bulkPlans: state.app.bulkPlans,
    adminProps: state.app.adminProps,
    tutorials: state.tutorial.expenses,
    reactButtonTutorialSeen: state.tutorial.reactButtonTutorialSeen,
    locationPermissionGranted: state.nav.locationPermissionGranted,
    sparkFailure: state.app.sparkFailure
  };
};

const mapDispatch = dispatch => {
  return {
    addSparkToProfile: bindActionCreators(sendSparkToProfile, dispatch),
    setPackPrices: bindActionCreators(setPackPrices, dispatch),
    setUserPacks: bindActionCreators(setUserPacks, dispatch),
    updateOwnProfile: bindActionCreators(updateOwnProfile, dispatch),
    incrimentExpenseTutorial: bindActionCreators(
      addExpenseTutorialCount,
      dispatch
    ),
    setReactButtonTutorialVisibility: bindActionCreators(
      setReactButtonTutorialVisibility,
      dispatch
    ),
    addSparkFailure: bindActionCreators(addSparkFailure, dispatch)
  };
};
export default connect(mapState, mapDispatch)(SurfingCard);
