import React, { Component } from "react";
import { View, Image } from "react-native";
import { styles } from "../../styles/Landing";
import { DeviceHeight, DeviceWidth } from "../../../src/config/Device";
import moment from "moment";
import LinearGradient from "react-native-linear-gradient";
import RowView from "../Views/RowView";
import BoldText from "../Texts/BoldText";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import JustifiedCenteredView from "../Views/JustifiedCenteredView";
import NoFeedbackTapView from "../Views/NoFeedbackTapView";
import Toast from "react-native-simple-toast";
import { userNamify } from "../../config/Utils";
import { connect } from "react-redux";
import {
  sendSpark,
  useFreeSpark,
  getUserPacks,
  usePurchasedPack
} from "../../network/spark";
import SvgUri from "react-native-svg-uri";
import AnimateCountModal from "../Gemsflow/AnimateCount.modal";
import { bindActionCreators } from "redux";
import { addSparkToRoom } from "../../redux/actions/rooms";
import { sendSparkToProfile } from "../../redux/actions/profiles";
import {
  purchaseGems,
  consumeAndFulFill,
  purchaseAndFulfill
} from "../../network/pack";
import { addExpenseTutorialCount } from "../../redux/actions/tutorials";
import { updateOwnProfile } from "../../redux/actions/user.info";
import { setUserPacks, addSparkFailure } from "../../redux/actions/app";
import { gemPlanColors, MONETIZATION_ITEMS } from "../../config/Constants";
import SparkButton from "./SparkButton";

class GradientHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCountAnimation: false,
      itemIcon: null,
      fromCount: null,
      toCount: null,
      onCountAnimated: null
    };
  }
  purchaseGems = (price, firstTime = false) => {
    purchaseGems(price, purchaseResult => {
      console.log(" purchase result is ", purchaseResult);
      this.props
        .updateProfile({
          gems_count: purchaseResult.data.gems_count
        })
        .then(() => {
          if (firstTime) {
            alert(" you just bought gems and used them ");
          } else {
            alert(" your gems deducted ");
          }
        });
    });
  };

  showCountWithDelay = (fromCount, toCount, iconName = "SPARK", onComplete) => {
    return new Promise(resolve => {
      this.showCountAnimationMethod(iconName, fromCount, toCount, onComplete);
      setTimeout(() => {
        resolve();
      }, 1500);
    });
  };
  componentDidMount = () => {
    const { packPrices, userPacks } = this.props;
    const sparkPriceObj = packPrices && packPrices.find(p => p.key === "SPARK");
    const userPack =
      userPacks && userPacks.find(p => p.itemId && p.itemId.value === "SPARK");
    this.setState({
      sparkPriceObj,
      userPack
    });
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
    const {
      selectedRoomId,
      fromChatWindow,
      targetUser,
      fetchRoomsData,
      openSparkConfirmation,
      openBuyPowerModal,
      showNotification,
      tutorials,
      myData,
      addSparkToRoom,
      allRooms,
      adminProps,
      updateProfile,
      addSparkToProfile,
      updateOwnProfile,
      showOneTimeTutorial
    } = this.props;

    const { sparkPriceObj, userPack } = this.state;

    const consumeAndFulFillCall = async ({
      deductCount,
      deductFrom,
      freeUsage = false
    }) => {
      consumeAndFulFill({
        itemId: sparkPriceObj._id,
        contentId: targetUser._id,
        deductCount, //
        deductFrom, //
        item: MONETIZATION_ITEMS.SPARK, //
        freeUsage //
      })
        .then(result => {
          console.log(" spark sent result is ", result);
          this.props.onSparkTapped(targetUser._id);
          this.refetchRoomsData();
          if (deductFrom === "gems") {
            this.props.updateOwnProfile({
              gems_count: +(myData.gems_count - deductCount)
            });
          } else {
            this.fetchUserPurchasedPacks();
          }
          return result;
        })
        .catch(err =>
          this.handleSparkError(err, deductFrom === "gems", deductCount)
        );
    };
    const purchaseAndFulfillCall = async ({
      deductCount,
      deductFrom,
      freeUsage = false
    }) => {
      purchaseAndFulfill({
        itemId: sparkPriceObj._id,
        contentId: targetUser._id,
        deductCount, //
        deductFrom, //
        item: MONETIZATION_ITEMS.SPARK, //
        freeUsage //
      })
        .then(result => {
          console.log(" spark sent result is ", result);
          this.props.onSparkTapped(targetUser._id);
          this.props.updateOwnProfile({
            gems_count: +(myData.gems_count - deductCount)
          });
          this.refetchRoomsData();
          if (deductFrom === "gems") {
            this.props.updateOwnProfile({
              gems_count: +(myData.gems_count - deductCount)
            });
          } else {
            this.fetchUserPurchasedPacks();
          }
          return result;
        })
        .catch(err =>
          this.handleSparkError(err, deductFrom === "gems", deductCount)
        );
    };
    const freeUsageCall = () => {
      startSecondAnimation(async () => {
        await consumeAndFulFillCall({
          deductFrom: "pack",
          deductCount: 1,
          freeUsage: true
        });
      });
    };
    const consumeGemsCall = () => {
      startSecondAnimation(async () => {
        const price = sparkPriceObj.price;
        consumeAndFulFillCall({
          deductFrom: "gems",
          deductCount: price
        });
      });
    };
    const purchaseGemsCall = (newCount, toCount) => {
      purchaseAndFulfillCall({
        deductCount: sparkPriceObj.price,
        deductFrom: "gems"
      });
    };
    const consumePackCall = () => {
      consumeAndFulFillCall({
        deductFrom: "pack",
        deductCount: 1
      });
    };
    const purchasePackCall = newItemCount => {
      purchaseAndFulfillCall({
        deductFrom: "pack",
        deductCount: 1
      });
    };
    if (
      !myData.seenMonetisationTutorials ||
      myData.seenMonetisationTutorials.indexOf("Sparks") === -1
    ) {
      showOneTimeTutorial("Sparks", () => {
        this.sendSpark();
      });
      const seenMonetisationTutorials = myData.seenMonetisationTutorials || [];
      seenMonetisationTutorials.push("Sparks");
      updateOwnProfile({ seenMonetisationTutorials });
      updateProfile({ seenMonetisationTutorials }, cbUpdated => {});
    } else {
      const { dailyFreeSparkLimit } = adminProps;
      if (!userPack) {
        const fromCount = dailyFreeSparkLimit;
        const toCount = fromCount - 1;
        await this.showCountWithDelay(
          fromCount,
          toCount,
          "SPARK",
          freeUsageCall
        );
      } else {
        const isFreeAvailable = userPack.freeUsageCount < dailyFreeSparkLimit;
        if (isFreeAvailable) {
          const fromCount = dailyFreeSparkLimit;
          const toCount = fromCount - 1;
          await this.showCountWithDelay(
            fromCount,
            toCount,
            "SPARK",
            freeUsageCall
          );
        } else {
          const isHavingPurchasedSparks = userPack.purchasedCount > 0;
          console.log(" @debug point 7 ", userPack.purchasedCount);
          if (isHavingPurchasedSparks) {
            const fromCount = userPack.purchasedCount;
            const toCount = fromCount - 1;
            await this.showCountWithDelay(
              fromCount,
              toCount,
              "SPARK",
              consumePackCall
            );
          } else {
            console.log(" going with gems of this user ");
            const isGemsEnough = myData.gems_count >= sparkPriceObj.price;
            if (isGemsEnough) {
              const sparkTutorialCount = tutorials[sparkPriceObj._id];
              if (!sparkTutorialCount || sparkTutorialCount < 1) {
                openSparkConfirmation({
                  count: sparkPriceObj.price,
                  unit: "sparks",
                  successCallback: () => {
                    setTimeout(() => {
                      const fromCount = myData.gems_count;
                      const toCount = fromCount - sparkPriceObj.price;
                      this.showCountWithDelay(
                        fromCount,
                        toCount,
                        "GEM",
                        consumeGemsCall
                      );
                      this.props.incrimentExpenseTutorial(sparkPriceObj._id);
                    }, 1500);
                  },
                  failureCallback: () => {
                    setTimeout(() => {
                      this.refs["spark_button"].startToNormal();
                    }, 300);
                    console.log(" didn't buy ");
                  }
                });
              } else {
                const fromCount = myData.gems_count;
                const toCount = fromCount - sparkPriceObj.price;
                await this.showCountWithDelay(
                  fromCount,
                  toCount,
                  "SPARK",
                  consumeGemsCall
                );
              }
            } else {
              const buyPower = {
                successCallback: async selectedGemsCount => {
                  const fromCount = myData.gems_count + selectedGemsCount;
                  const toCount = fromCount - sparkPriceObj.price;
                  setTimeout(() => {
                    this.showCountWithDelay(fromCount, toCount, "GEM", () => {
                      purchaseGemsCall(fromCount, toCount);
                    });
                  }, 1500);
                },
                failureCallback: () => {
                  setTimeout(() => {
                    this.refs["spark_button"].startToNormal();
                  }, 300);
                },
                hasOffers: true,
                powerName: "Spark",
                cost: sparkPriceObj.price,
                colors: gemPlanColors["Sparks"]
              };
              const bulkPurchase = {
                bulkItemName: "SPARK",
                successCallback: newItemCount => {
                  const fromCount = newItemCount;
                  const toCount = newItemCount - 1;
                  setTimeout(() => {
                    this.showCountWithDelay(
                      fromCount,
                      toCount,
                      "SPARK",
                      purchasePackCall
                    );
                  }, 1500);
                },
                failureCallback: () => {
                  setTimeout(() => {
                    this.refs["spark_button"].startToNormal();
                  }, 300);
                }
              };
              console.log(" bulkPlanitem is ", bulkPurchase);
              openBuyPowerModal({
                buyPower,
                bulkPurchase
              });
            }
          }
        }
      }
    }
  };
  refetchRoomsData = () => {
    const { allRooms, selectedRoomId, fetchRoomsData } = this.props;
    const selectedRoom = allRooms[selectedRoomId];
    const isUserPostedBy =
      selectedRoom && selectedRoom.postedBy._id === myData._id;
    const setCronJob = fromChatWindow ? (isUserPostedBy ? false : true) : false;
    fetchRoomsData(setCronJob);
  };
  fetchUserPurchasedPacks = () => {
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
    this.setState({
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
    });
  };
  closeCountModal = () => {
    this.setState({ showCountAnimation: false });
  };
  render() {
    const {
      targetUser: activeProfile,
      allRooms,
      selectedRoomId,
      fromChatWindow,
      myData,
      hideSparkButton
    } = this.props;
    const {
      itemIcon,
      fromCount,
      toCount,
      showCountAnimation,
      onCountAnimated
    } = this.state;
    // const userAge = activeProfile
    //   ? moment().diff(
    //       moment(`${activeProfile.date_of_birth}`, "DD-MM-YYYY"),
    //       "years"
    //     )
    //   : "";
    const userName = userNamify(activeProfile);
    const userAge = (activeProfile && activeProfile.age) || "";
    let sparkEnabled;
    const selectedRoom = allRooms[selectedRoomId];

    if (fromChatWindow) {
      if (selectedRoom && selectedRoom.postedBy._id === myData._id) {
        sparkEnabled = !selectedRoom.postedBySentSpark;
      } else {
        sparkEnabled = !selectedRoom.answeredBySentSpark;
      }
    } else {
      if (activeProfile && activeProfile.sentSpark) {
        sparkEnabled = false;
      } else {
        sparkEnabled = true;
      }
    }
    return (
      <>
        {showCountAnimation ? (
          <AnimateCountModal
            fromBottomSheet={true}
            itemIcon={itemIcon}
            fromSurfingCard={!fromChatWindow}
            fromCount={fromCount}
            onComplete={onCountAnimated}
            toCount={toCount}
            closeCountModal={this.closeCountModal}
          />
        ) : (
          <View />
        )}
        <LinearGradient
          style={styles.topHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={["rgba(176,77,213,1)", "rgba(119,77,214,1)"]}
        >
          <View
            style={{
              height: 4,
              borderRadius: 20,
              width: DeviceWidth * 0.25,
              alignSelf: "center",
              backgroundColor: "#fff",
              marginTop: 7
            }}
          />
          <RowView
            style={{
              marginTop: -10
            }}
          >
            {/* {activeProfile && activeProfile.filledPercent === 100 ? (
              <View
                style={{
                  transform: [
                    {
                      translateY: 15
                    },
                    {
                      translateX: 2
                    },
                    {
                      rotate: "-30deg"
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
            <BoldText
              style={{
                color: "#fff",
                fontSize: 20,
                marginLeft: 15,
                marginTop: 15
              }}
            >
              {userName}, {userAge}
            </BoldText>

            {/* <JustifiedCenteredView
              style={{
                backgroundColor: "rgb(47,124,228)",
                height: 20,
                width: 20,
                borderRadius: 10,
                marginTop: 15,
                marginLeft: 10
              }}
            >
              <FontAwesome5
                style={styles.tickIcon}
                name={"check"}
                color={"#fff"}
                size={11}
              />
            </JustifiedCenteredView> */}

            <View style={styles.tickIconBg} />
          </RowView>
        </LinearGradient>
        {hideSparkButton ? (
          <View />
        ) : (
          <SparkButton
            ref={"spark_button"}
            disabled={!sparkEnabled}
            fromProfileModal
            onPress={this.sendSpark}
            afterComplete={() => {
              Toast.showWithGravity("Spark sent!", Toast.SHORT, Toast.CENTER);
            }}
          />
          // <NoFeedbackTapView
          //   disabled={!sparkEnabled}
          //   onPress={() => this.sendSpark()}
          //   style={{
          //     height: 50,
          //     width: 50,
          //     borderRadius: 25,
          //     top: DeviceHeight * 0.828,
          //     right: 25,
          //     ...styles.sparkNofeedbackButtonView
          //   }}
          // >
          //   <JustifiedCenteredView
          //     style={{
          //       height: 55,
          //       width: 55,
          //       shadowRadius: 10,
          //       shadowColor: "#000000d1",
          //       shadowOffset: {
          //         width: 2,
          //         height: 10
          //       },
          //       shadowOpacity: 0.45,
          //       backgroundColor: "#fff",
          //       borderRadius: 27.5
          //     }}
          //   >
          //     {sparkEnabled ? (
          //       <View
          //         style={{
          //           transform: [{ translateX: -1.5 }, { translateY: 2.5 }]
          //         }}
          //       >
          //         <SvgUri
          //           width={35}
          //           height={35}
          //           source={require("../../assets/svgs/ProfileModal/activeSpark.svg")}
          //         />
          //       </View>
          //     ) : (
          //       <View
          //         style={{
          //           transform: [{ translateX: -1.5 }, { translateY: 1.5 }]
          //         }}
          //       >
          //         <SvgUri
          //           width={35}
          //           height={35}
          //           source={require("../../assets/svgs/ProfileModal/inactiveSpark.svg")}
          //         />
          //       </View>
          //     )}
          //   </JustifiedCenteredView>
          // </NoFeedbackTapView>
        )}
      </>
    );
  }
}

const mapState = state => {
  return {
    allRooms: state.rooms.rooms,
    selectedRoomId: state.rooms.selected_room_id,
    myData: state.info.userInfo,
    adminProps: state.app.adminProps,
    packPrices: state.app.packPrices,
    tutorials: state.tutorial.expenses,
    // userPacks: state.app.userPack
    userPacks: state.app.userPacks
  };
};

const mapDispatch = dispatch => {
  return {
    addSparkToRoom: bindActionCreators(addSparkToRoom, dispatch),
    addSparkToProfile: bindActionCreators(sendSparkToProfile, dispatch),
    incrimentExpenseTutorial: bindActionCreators(
      addExpenseTutorialCount,
      dispatch
    ),
    updateProfile: bindActionCreators(updateOwnProfile, dispatch),
    setUserPacks: bindActionCreators(setUserPacks, dispatch),
    addSparkFailure: bindActionCreators(addSparkFailure, dispatch)
  };
};

export default connect(mapState, mapDispatch)(GradientHeader);
