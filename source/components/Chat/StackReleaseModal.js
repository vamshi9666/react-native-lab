import React from "react";
import { View, ActivityIndicator, Image, StyleSheet } from "react-native";
import JustifiedCenteredView from "../Views/JustifiedCenteredView";
import RegularText from "../Texts/RegularText";
import NoFeedbackTapView from "../Views/NoFeedbackTapView";
import HorizontalGradientView from "../Views/HorizontalGradientView";
import {
  LIGHT_PURPLE,
  PURPLE,
  FONT_BLACK,
  WHITE,
  FONT_GREY
} from "../../config/Colors";
import { DeviceWidth } from "../../config/Device";
import { LEFT_MARGIN, gemPlanColors } from "../../config/Constants";
import MediumText from "../Texts/MediumText";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateOwnProfile } from "../../redux/actions/user.info";
import { purchaseGems } from "../../network/pack";
import IonIcon from "react-native-vector-icons/Ionicons";
import { releaseAllStackItems } from "../../network/rooms";
import { STATIC_URL } from "../../config/Api";
import { namify } from "../../config/Utils";
import SvgUri from "react-native-svg-uri";
import BoldText from "../Texts/BoldText";
import { CachedImage } from "react-native-img-cache";

class StackReleaseModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cost: null,
      purchaseLoading: false,
      unlockAllLoading: false
    };
  }
  componentDidMount = () => {
    const { packPrices, currentChatScreenIndex } = this.props;
    const isInSent = currentChatScreenIndex === 2;

    const pack = packPrices.find(p => {
      const val = isInSent ? "REACTIONS_SENT" : "REACTIONS_RECEIVED";
      return p.value === val;
    });
    console.log(" got price is ", currentChatScreenIndex, pack);
    if (!pack) {
      return console.log(
        " error in getting cost of ",
        "REACTIONS_RECEIVED",
        packPrices
      );
    }
    this.setState({
      cost: pack.price
    });
  };

  releaseAllStackItemsCall = cb => {
    const { currentChatScreenIndex } = this.props;
    const isInSent = currentChatScreenIndex === 2;
    releaseAllStackItems(isInSent, releaseResult => {
      console.log(" releaseResult result is ", releaseResult);
      if (releaseResult.success) {
        // this.
        cb();
      }
      // alert(" erro in releasing all item ")
    });
  };

  unlockAllRooms = () => {
    const { cost } = this.state;
    const {
      goBack,
      updateOwnProfile,
      stackLength,
      myData,
      price,
      openBuyGemsModal,
      pack,
      refetchRooms
    } = this.props;
    // if ()
    const requiredGems = cost * stackLength;

    const isGemsEnough = myData.gems_count >= requiredGems;
    console.log(
      " isGemsEnough >>>>",
      isGemsEnough,
      cost,
      requiredGems,
      // price,
      pack,
      stackLength
    );
    // return;
    if (isGemsEnough) {
      purchaseGems(-requiredGems, purchaseResult => {
        if (purchaseResult.success) {
          updateOwnProfile({ gems_count: purchaseResult.data.gems_count });
          this.releaseAllStackItemsCall(() => {
            refetchRooms();
            goBack();
          });
        }
      });
    } else {
      const { currentChatScreenIndex } = this.props;
      const isInSent = currentChatScreenIndex === 2;

      const powerName = isInSent ? "Reactions Sent" : "Reactions Recieved";

      const { backgroundColors: colors } = pack;
      const successCallback = async updatedGemsCount => {
        refetchRooms();
      };
      const failureCallback = () => {
        console.log(" fall back case 0 ");
      };
      const afterPurchase = newGemsCount => {
        console.log(
          " after purchase ",
          newGemsCount,
          requiredGems,
          newGemsCount >= requiredGems
        );
        if (newGemsCount >= requiredGems) {
          console.log(" required gems are in true case are ", requiredGems);
          this.buyGems(requiredGems, () => {
            console.log(" after buying ");
            console.log(" calle two ");

            this.releaseAllStackItemsCall(() => {
              refetchRooms();
            });
          });
        }
      };
      openBuyGemsModal({
        powerName,
        colors,
        cost: pack.price,
        successCallback,
        afterPurchase,
        requiredTotalGems: requiredGems,
        failureCallback
      });
    }
    return;
  };
  buyGems = (gemsToBeBought, cb) => {
    this.setState({
      purchaseLoading: true
    });

    purchaseGems(-1 * parseInt(gemsToBeBought), async purchaseResult => {
      if (purchaseResult.success) {
        this.props.updateOwnProfile({
          gems_count: purchaseResult.data.gems_count
        });
        console.log("purchase ressss &&&7", purchaseResult);

        this.setState({
          purchaseLoading: false
        });

        console.log(" calling callback");

        cb();
        // return;
      } else {
        this.setState({
          purchaseLoading: false
        });
        // alert(" ")
        console.log(" error in purchasing gems ", purchaseResult);
        // throw new Error("error in purchasing ")
      }
    });

    // this.setState({
    //   purchaseLoading: false
    // });
  };
  purchaseAndGoBack = () => {
    const { cost } = this.state;
    const { goBack, updateOwnProfile } = this.props;
    // this.setState({
    //   purchaseLoading: true
    goBack(true);
    return;
    // });
    this.buyGems(cost, () => {
      console.log(" calle one ");
    });
    // purchaseGems(-cost, purchaseRes => {
    //   if (purchaseRes.success) {
    //     console.log(" purchasing response is ", purchaseRes.data);
    //     this.props.updateOwnProfile({
    //       gems_count: purchaseRes.data.gems_count
    //     });
    //     this.setState(
    //       {
    //         purchaseLoading: false
    //       },
    //       () => {
    //         goBack(true);
    //       }
    //     );
    // } else {
    //   this.setState({
    //     purchaseLoading: false
    //   });
    // }
    // });
  };
  render() {
    const {
      userName,
      userImage,
      goBack,
      price,
      stackLength,
      myData
    } = this.props;
    const { cost, purchaseLoading, unlockAllLoading } = this.state;
    const imageURL = STATIC_URL + userImage.split("uploads")[1];

    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1
        }}
      >
        <View
          style={{
            borderRadius: 15,
            backgroundColor: "#fff",
            padding: 6,
            paddingHorizontal: 20,

            paddingBottom: 20,

            width: DeviceWidth * 0.9,

            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              // backgroundColor: "green",
              flexDirection: "row",
              // position: "absolute",
              top: 8,
              paddingHorizontal: 10,
              marginBottom: 10,
              // paddingVertical: 8,
              width: "100%"
            }}
          >
            <IonIcon
              onPress={() => goBack(false)}
              name="ios-close-circle-outline"
              size={32}
              color="black"
              style={
                {
                  // position: "absolute",
                  // left: 8
                }
              }
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center"
                // marginTop: 10
              }}
            >
              <CachedImage
                source={{ uri: imageURL }}
                width={40}
                height={40}
                resizeMode={"stretch"}
                style={{
                  borderRadius: 20,
                  width: 40,
                  height: 40,
                  marginHorizontal: 10
                }}
              />
              <RegularText style={{ fontSize: 20 }}>
                {userName && namify(userName)}
              </RegularText>

              {/* <BoldText style={{ fontSize: 18 }}> Unlock</BoldText>/ */}
            </View>
            <View
              style={{
                // position: "absolute",
                // right: 0,
                // height: 28,
                backgroundColor: "rgb(240,240,255)",
                // borderRadius: 215,
                // marginLeft: 18,
                flexDirection: "row"
                // justifyContent: "center",
                // alignItems: "center"
                // paddingHorizontal: 15
              }}
              onPress={() => {
                this.setState({
                  isGemsModalVisible: true,
                  buyGems: {
                    successCallback: () => {},
                    failureCallback: () => {}
                  }
                });
                this.openCloserModal();
              }}
            >
              <SvgUri
                width={20}
                height={20}
                source={require("../../assets/svgs/MyProfile/Gem.svg")}
              />
              <BoldText
                style={{
                  color: "#4E586E",
                  // paddingHorizontal: 2,
                  fontSize: 16
                }}
              >
                {myData.gems_count || "0"}
              </BoldText>
            </View>
          </View>
          <NoFeedbackTapView onPress={() => this.purchaseAndGoBack()}>
            <HorizontalGradientView
              colors={[PURPLE, LIGHT_PURPLE]}
              style={{
                height: 70,

                marginTop: 20,
                width: DeviceWidth * 0.7,
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center",
                // marginTop: LEFT_MARGIN,
                borderRadius: 30
              }}
            >
              {purchaseLoading ? (
                <ActivityIndicator size={"small"} color={WHITE} />
              ) : (
                <View
                  style={{
                    alignItems: "center",
                    // marginTop: 10,
                    justifyContent: "space-between"
                  }}
                >
                  <MediumText
                    style={{
                      fontSize: 18,
                      color: "#fff",
                      marginBottom: 10
                    }}
                  >
                    Unlock{stackLength === 1 ? null : " only"} this person
                  </MediumText>
                  <View style={{ flexDirection: "row" }}>
                    <RegularText style={{ color: WHITE, fontSize: 18 }}>
                      {" "}
                      {cost}
                    </RegularText>
                    <SvgUri
                      width={20}
                      height={20}
                      source={require("../../assets/svgs/MyProfile/Gem.svg")}
                    />
                  </View>
                </View>
              )}
            </HorizontalGradientView>
          </NoFeedbackTapView>
          {stackLength > 1 && (
            <NoFeedbackTapView
              style={{
                height: 70,
                width: DeviceWidth * 0.7,
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center",
                marginTop: LEFT_MARGIN,
                borderRadius: 30,
                borderWidth: 1,
                borderColor: FONT_GREY
              }}
              onPress={() => this.unlockAllRooms()}
            >
              {unlockAllLoading ? (
                <ActivityIndicator size={"small"} color={WHITE} />
              ) : (
                <View
                  style={{
                    alignItems: "center",
                    marginVertical: 10,

                    justifyContent: "space-between"
                  }}
                >
                  <MediumText
                    style={{
                      fontSize: 18,
                      color: FONT_BLACK,
                      marginBottom: 10
                    }}
                  >
                    Unlock all {stackLength} people
                  </MediumText>

                  <View style={{ flexDirection: "row" }}>
                    <RegularText style={{ color: FONT_BLACK, fontSize: 18 }}>
                      {" "}
                      {cost * stackLength}
                    </RegularText>
                    <SvgUri
                      width={20}
                      height={20}
                      source={require("../../assets/svgs/MyProfile/Gem.svg")}
                    />
                  </View>
                </View>
              )}
            </NoFeedbackTapView>
          )}
        </View>
      </View>
    );
  }
}

const mapState = state => {
  return {
    packPrices: state.app.packPrices,
    myData: state.info.userInfo,
    currentChatScreenIndex: state.nav.currentChatScreenIndex
  };
};

const mapDispatch = dispatch => {
  return {
    updateOwnProfile: bindActionCreators(updateOwnProfile, dispatch)
  };
};

export default connect(mapState, mapDispatch)(StackReleaseModal);
