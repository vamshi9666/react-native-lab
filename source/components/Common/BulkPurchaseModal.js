import { round } from "lodash";
import React, { Component } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  View
} from "react-native";
import SvgUri from "react-native-svg-uri";
import Ionicon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { FONT_BLACK, WHITE } from "../../config/Colors";
import * as constants from "../../config/Constants";
import { DeviceHeight, DeviceWidth } from "../../config/Device";
import { buyAPack, purchaseGems } from "../../network/pack";
import { addExpenseTutorialCount } from "../../redux/actions/tutorials";
import { updateOwnProfile } from "../../redux/actions/user.info";
import { sharedStyles } from "../../styles/Shared";
import NewCloserModal from "../Common/NewCloserModal";
import PurchaseWayModal from "../Gemsflow/PurchaseWayModal";
import BoldText from "../Texts/BoldText";
import MediumText from "../Texts/MediumText";
import RegularText from "../Texts/RegularText";
import JustifiedCenteredView from "../Views/JustifiedCenteredView";
import NoFeedbackTapView from "../Views/NoFeedbackTapView";
import RowView from "../Views/RowView";
import VerticalGradientView from "../Views/VerticalGradientView";
const BulkPurchasePlans = [
  { itemCount: 5, gemsCount: 8, price: "₹39.99", save: "0%" },
  { itemCount: 25, gemsCount: 5, price: "₹34.99", save: "10%" },
  { itemCount: 50, gemsCount: 3, price: "₹24.99", save: "25%" }
];

class BuyPackModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      priceInGems: null,
      selectedGemCount: 0,
      selectedPlan: null,
      itemName: "",
      prices: [],
      purchaseLoading: false,
      bulkPlanObj: null,
      colors: constants.gemPlanColors["StepBack"],
      purchaseWayModal: null,
      showPurchaseWayModal: false,
      isNewCloserModalVisible: false,
      fullScreenLoading: false
    };
  }

  componentDidMount = () => {
    const {
      packValue = "EXTENSIONS",
      packPrices,
      bulkItemName,
      bulkPlans
    } = this.props;
    console.log(
      " bulk plan is s",
      // bulkPlans,
      this.props
      // bulkPlan,
      // this.props
    );
    const bulkPlan = bulkPlans.find(p => p.itemName === bulkItemName);
    const priceIdentifier =
      Platform.os === "ios" ? "appleProductId" : "appleProductId";
    const processedPrices = bulkPlan.costs.map(c => ({
      itemCount: c.itemCount,
      gemsCount: c.gemsCount / c.itemCount,
      price: round(+(c.price / c.itemCount), 2),
      save: c.save,
      totalPrice: c.price,
      totalGemsCount: c.gemsCount,
      productId: c[priceIdentifier]
    }));
    const colors =
      bulkItemName === "EXTENSIONS"
        ? constants.gemPlanColors["Extensions"]
        : constants.gemPlanColors["Sparks"];
    this.setState({
      prices: processedPrices,
      itemName: bulkPlan.itemName,
      bulkPlanObj: bulkPlan,
      selectedGemCount: processedPrices[1].itemCount,
      selectedPlan: processedPrices[1],
      colors
    });
  };

  componentWillReceiveProps = nextProps => {
    const prevProps = this.props;
    if (nextProps.bulkItemName !== prevProps.bulkItemName) {
      const {
        packValue = "EXTENSIONS",
        packPrices,
        bulkItemName,
        bulkPlans
      } = nextProps;
      const bulkPlan = bulkPlans.find(p => p.itemName === bulkItemName);
      const priceIdentifier =
        Platform.os === "ios" ? "appleProductId" : "appleProductId";

      const processedPrices = bulkPlan.costs.map(c => ({
        itemCount: c.itemCount,
        gemsCount: c.gemsCount / c.itemCount,
        price: round(+(c.price / c.itemCount), 2),
        save: c.save,
        totalPrice: c.price,
        totalGemsCount: c.gemsCount,
        productId: c[priceIdentifier]
      }));
      const colors =
        bulkItemName === "EXTENSIONS"
          ? constants.gemPlanColors["Extensions"]
          : constants.gemPlanColors["Sparks"];
      this.setState({
        prices: processedPrices,
        itemName: bulkPlan.itemName,
        bulkPlanObj: bulkPlan,
        selectedGemCount: processedPrices[1].itemCount,
        selectedPlan: processedPrices[1],
        colors
      });
    }
  };

  purchasePack = async () => {
    const { userPacks, goBack } = this.props;
    const { selectedPlan, itemName } = this.state;
    // const userPack = userPacks.find(
    //   p => p.itemId.value === this.state.itemName
    // );
    // const afterCurrencyPurchase = () => {
    //   this.setState(
    //     {
    //       showPurchaseWayModal: false
    //     },
    //     () => {
    //       purchaseGems(selectedPlan.itemCount, async purchaseResult => {
    //         if (purchaseResult.success) {
    //           console.log(" purchase result is ", purchaseResult);
    //           await this.props.updateOwnProfile({
    //             gems_count: purchaseResult.data.gems_count
    //           });
    //           this.setState({
    //             purchaseLoading: false
    //           });
    //           setTimeout(() => {
    //             this.props.goBack(true, purchaseResult.data.gems_count);
    //           }, 500);
    //         }
    //       });
    //     }
    //   );
    // };
    this.setState({
      isNewCloserModalVisible: true,
      showPurchaseWayModal: true,
      purchaseWayModal: {
        priceObj: {
          price: selectedPlan.totalPrice,
          unitsCount: selectedPlan.itemCount,
          unitName: itemName
        },
        successCallback: () => {
          goBack(true, selectedPlan.itemCount);
        },
        failureCallback: () => {
          this.setState({
            isNewCloserModalVisible: false,
            //  showPurchaseWayModal: false,
            purchaseWayModal: null
          });
        }
      }
    });
  };

  exchangeGems = (cost, index) => {
    const {
      tutorials,
      incrimentExpenseTutorial,
      goBack,
      userPacks,
      openConsumptionConfirmation
    } = this.props;
    const { bulkPlanObj } = this.state;
    const userPack = userPacks.find(
      p => p.itemId.value === this.state.itemName
    );
    console.log(
      " all tutorials are ",
      userPack,
      bulkPlanObj,
      this.state.itemName,
      userPacks
    );
    const successCallback = () => {
      purchaseGems(-cost.totalGemsCount, purchaseResult => {
        console.log("purchase result is ", purchaseResult);
        if (purchaseResult.success) {
          this.props.updateOwnProfile({
            gems_count: purchaseResult.data.gems_count
          });
          if (userPack) {
            buyAPack(
              userPack && userPack._id,
              null,
              cost.itemCount,
              buyPackResult => {
                console.log(
                  " buypackresult is ",
                  buyPackResult,
                  this.state.itemName
                );
                if (buyPackResult.success) {
                  goBack(true, purchaseResult.data.gems_count);
                }
              }
            );
          } else {
            buyAPack(
              userPack && userPack._id,
              bulkPlanObj.itemId,
              cost.itemCount,
              buyPackResult => {
                console.log(
                  " buypackresult is ",
                  buyPackResult,
                  this.state.itemName
                );
                if (buyPackResult.success) {
                  goBack(true, buyPackResult.data.purchasedCount);
                }
              }
            );
          }
        }
      });
    };
    if (tutorials[bulkPlanObj.itemId] && tutorials[bulkPlanObj.itemId] >= 1) {
      console.log(" clicked cost is ", cost);
      successCallback();
    } else {
      console.log("no tutorials found ", bulkPlanObj);
      incrimentExpenseTutorial(bulkPlanObj.itemId);
      openConsumptionConfirmation({
        count: cost.totalGemsCount,
        successCallback
      });
    }
  };

  renderPuchaseWayModal = () => {
    const { purchaseWayModal } = this.state;
    return (
      <PurchaseWayModal
        priceObj={purchaseWayModal && purchaseWayModal.priceObj}
        successCallback={purchaseWayModal && purchaseWayModal.successCallback}
        failureCallback={purchaseWayModal && purchaseWayModal.failureCallback}
      />
    );
  };

  renderHelperText = () => {
    const { helperText } = this.props;
    return (
      <JustifiedCenteredView
        style={{
          flexDirection: "row"
        }}
      >
        <RegularText
          style={{
            fontSize: 20,
            color: FONT_BLACK,
            marginTop: -15,
            marginLeft: 15
          }}
        >
          {helperText}
        </RegularText>
      </JustifiedCenteredView>
    );
  };

  renderFullScreenLoading = () => {
    return (
      <View
        style={{
          backgroundColor: "#000",
          opacity: 0.8,
          zIndex: 1000
        }}
      >
        <ActivityIndicator size={"small"} color={"white"} />
      </View>
    );
  };
  render() {
    const { goBack, myData, showHelperText = false } = this.props;

    const {
      priceInGems,
      selectedGemCount,
      selectedPlan,
      bulkPlanObj,
      itemName,
      prices,
      purchaseLoading,
      colors,
      showPurchaseWayModal,
      isNewCloserModalVisible
    } = this.state;
    // const itemName = "Extensions"; // Sparks Or Boosts
    return (
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          height: DeviceHeight,
          width: DeviceWidth,
          zIndex: 1
        }}
      >
        {purchaseLoading && this.renderFullScreenLoading()}
        <View
          style={{
            zIndex: 10
          }}
        >
          <NewCloserModal
            inSecondLevel={true}
            visible={isNewCloserModalVisible}
          >
            {showPurchaseWayModal && this.renderPuchaseWayModal()}
          </NewCloserModal>
        </View>
        <VerticalGradientView colors={colors} style={styles.cardStyle}>
          <RowView
            style={{
              justifyContent: "space-between",
              marginBottom: 10
            }}
          >
            <NoFeedbackTapView
              onPress={() => goBack(false)}
              style={{
                height: 30,
                width: 30,
                borderRadius: 15,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Ionicon name={"ios-close-circle"} size={30} color={"#fff"} />
            </NoFeedbackTapView>

            <View style={styles.gemView}>
              <MediumText style={styles.gemCount}>
                {myData.gems_count || 0}
              </MediumText>
              <SvgUri
                width={16}
                height={16}
                source={require("../../assets/svgs/MyProfile/Gem.svg")}
              />
            </View>
          </RowView>

          <JustifiedCenteredView>
            <JustifiedCenteredView
              style={{
                backgroundColor: "rgba(255,255,255,0.7)",
                borderRadius: 10,
                height: 50,
                width: 50,
                marginTop: -10
              }}
            >
              <Ionicon
                size={35}
                color={colors[0]}
                name={"ios-share-alt"}
                style={{
                  transform: [{ rotateY: "180deg" }]
                }}
              />
            </JustifiedCenteredView>
            <MediumText
              style={{ fontSize: 25, color: FONT_BLACK, marginVertical: 20 }}
            >
              {itemName}
            </MediumText>
          </JustifiedCenteredView>
          {showHelperText && this.renderHelperText()}
          <JustifiedCenteredView
            style={{
              flexDirection: "row"
            }}
          >
            <RegularText
              style={{
                fontSize: 20,
                color: FONT_BLACK,
                marginTop: -15,
                marginLeft: 15
              }}
            >
              Increase your chances of connecting
            </RegularText>
          </JustifiedCenteredView>

          <FlatList
            horizontal
            extraData={this.state}
            data={prices}
            // contentContainerStyle={{ backgroundColor: "green" }}
            scrollEnabled={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              const isSelected = item.itemCount === selectedPlan.itemCount;
              const nonZero = item.save !== "0%";
              const gemsNotEnough = myData.gems_count < item.totalGemsCount;
              const isFirst = index === 0;
              return (
                <NoFeedbackTapView
                  style={{
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  onPress={() =>
                    this.setState({
                      selectedGemCount: item.itemCount,
                      selectedPlan: item
                    })
                  }
                >
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      marginLeft: isFirst ? 5 : 0
                    }}
                  >
                    <JustifiedCenteredView
                      style={{
                        ...styles.CountContainer,
                        height: DeviceHeight * 0.22,
                        marginTop: constants.LEFT_MARGIN,
                        borderWidth: isSelected ? 2 : 1,
                        borderColor: isSelected ? colors[0] : "#9b9b9b50"
                      }}
                    >
                      <RegularText
                        style={{
                          fontSize: 20,
                          textAlign: "center",
                          color: FONT_BLACK
                        }}
                      >
                        {item.itemCount}
                      </RegularText>
                      <RegularText
                        style={{
                          fontSize: 12,
                          textAlign: "center"
                        }}
                      >
                        {itemName}
                      </RegularText>
                      <BoldText
                        style={{
                          fontSize: 15,
                          color: FONT_BLACK,
                          textAlign: "center"
                        }}
                      >
                        {item.price}
                        {"\n"} Each
                      </BoldText>

                      <RegularText
                        style={{
                          fontSize: 12,
                          color: isSelected ? "#fff" : colors[0],
                          textAlign: "center"
                        }}
                      >
                        {nonZero ? `Save ${item.save} %` : ""}
                      </RegularText>
                    </JustifiedCenteredView>
                    <View
                      style={{
                        opacity: isSelected && nonZero ? 1 : 0,
                        height: 25,
                        width: styles.CountContainer.width,
                        // paddingHorizontal: styles.CountContainer.padding,
                        // width: "100%",
                        // flex: 1,

                        marginTop: -25,
                        marginLeft: -18,
                        zIndex: 3,
                        // alignSelf: "center",
                        backgroundColor: colors[0],
                        borderRadius: 5,
                        ...sharedStyles.justifiedCenter
                      }}
                    >
                      <MediumText style={{ color: "#fff", fontSize: 16 }}>
                        SAVE {item.save}
                      </MediumText>
                    </View>
                  </View>
                </NoFeedbackTapView>
              );
            }}
          />

          <NoFeedbackTapView
            style={[styles.bottomButtonView, { marginBottom: 30 }]}
            onPress={this.purchasePack}
          >
            <View
              colors={[
                constants.gemPlanColors.Extensions[0],
                constants.gemPlanColors.Extensions[0]
              ]}
              style={[styles.bottomButtonView, { backgroundColor: colors[0] }]}
            >
              {purchaseLoading ? (
                <ActivityIndicator color={WHITE} size="small" />
              ) : (
                <MediumText style={styles.buttonText}>
                  Get {itemName}
                </MediumText>
              )}
            </View>
          </NoFeedbackTapView>
        </VerticalGradientView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cardStyle: {
    // position: "absolute",
    // width: DeviceWidth - 20,
    borderRadius: 20,
    marginHorizontal: 10,
    // height: DeviceHeight * 0.8,
    backgroundColor: "rgb(242,242,242)",
    padding: constants.LEFT_MARGIN,
    marginTop: DeviceHeight * 0.1,
    zIndex: 2
  },
  OrText: {
    fontSize: 16,
    color: FONT_BLACK,
    textAlign: "center",
    marginVertical: constants.LEFT_MARGIN
  },
  CountContainer: {
    width: (DeviceWidth - 18) * 0.25,
    // width: "100%",
    height: DeviceWidth * 0.26,
    borderRadius: 15,
    justifyContent: "space-between",
    padding: constants.LEFT_MARGIN / 2,
    backgroundColor: "#fff",
    borderColor: "#9b9b9b50",
    borderWidth: 1,
    marginRight: constants.LEFT_MARGIN
  },
  buttonText: {
    fontSize: 20,
    color: "#fff"
  },
  bottomButtonView: {
    height: 50,
    width: DeviceWidth * 0.6,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: constants.LEFT_MARGIN,
    borderRadius: 30
  },
  gemCount: {
    color: "#4E586E",
    paddingHorizontal: 4
  },
  gemView: {
    paddingHorizontal: 10,
    backgroundColor: "rgb(240,240,255)",
    borderRadius: 215,
    marginLeft: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 22,
    marginTop: 3
  }
});
const mapState = state => {
  return {
    packPrices: state.app.packPrices,
    rupessPerGems: state.app.rupessPerGems,
    myData: state.info.userInfo,
    bulkPlans: state.app.bulkPlans || [],
    userPacks: state.app.userPacks,
    tutorials: state.tutorial.expenses
  };
};
const mapDispatch = dispatch => {
  return {
    incrimentExpenseTutorial: bindActionCreators(
      addExpenseTutorialCount,
      dispatch
    ),
    updateOwnProfile: bindActionCreators(updateOwnProfile, dispatch)
  };
};
export default connect(mapState, mapDispatch)(BuyPackModal);
