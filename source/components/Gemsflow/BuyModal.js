import React, { Component } from "react";
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
  Platform
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicon from "react-native-vector-icons/Ionicons";
import HorizontalGradientView from "../Views/HorizontalGradientView";
import JustifiedCenteredView from "../Views/JustifiedCenteredView";
import RowView from "../Views/RowView";
import {
  FONT_BLACK,
  FONT_GREY,
  LIGHT_PURPLE,
  PURPLE,
  WHITE
} from "../../config/Colors";
import { DeviceHeight, DeviceWidth } from "../../config/Device";
import MediumText from "../Texts/MediumText";
import RegularText from "../Texts/RegularText";
import VerticalGradientView from "../Views/VerticalGradientView";
import * as constants from "./../../config/Constants";
import NoFeedbackTapView from "../Views/NoFeedbackTapView";
import * as packApi from "../../network/pack";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as infoActions from "../../redux/actions/user.info";
import SvgUri from "react-native-svg-uri";
import { sharedStyles } from "../../styles/Shared";
import BoldText from "../Texts/BoldText";
import { prefixZero } from "../../config/Utils";
import RNIap from "react-native-iap";
import NewCloserModal from "../Common/NewCloserModal";
import PurchaseWayModal from "./PurchaseWayModal";
var timeInterval;

class BuyModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedGemsCount: null,
      purchaseLoading: false,
      selectedPlan: null,
      min: 0,
      hour: 0,
      second: 0,
      showBuyPurchaseWayModal: false,
      purchaseWayModal: null,
      isNewCloserModalVisible: false,
      fullScreenLoading: false
    };
  }
  componentDidMount = () => {
    console.log(" prop imp items are ", this.props.extraData);
    this.setState({
      selectedGemsCount: this.props.gemPacks[0].gemsCount,
      selectedPlan: this.props.gemPacks[1]
    });
    const { extraData, powerName } = this.props;
    if (powerName === "More Content") {
      if (extraData) {
        timeInterval = setInterval(() => {
          let currentTime = Math.floor(new Date().getTime() / 1000);
          let dateObj = new Date((extraData.refreshedAt - currentTime) * 1000);
          hour = prefixZero(dateObj.getUTCHours());
          min = prefixZero(dateObj.getUTCMinutes());
          second = prefixZero(dateObj.getSeconds());

          this.setState({ min, hour, second });
        }, 1000);
      }
    }
  };
  componentWillUnmount = () => {
    clearInterval(timeInterval);
  };
  purchaseGems = async () => {
    // this.props.goBack(true);
    // return;
    const { selectedGemsCount, selectedPlan } = this.state;
    const productIdIdentifier =
      Platform.OS === "ios" ? "appleProductId" : "appleProductId";
    const productId = selectedPlan[productIdIdentifier];
    console.log("  product is  ", selectedPlan);

    this.setState({
      isNewCloserModalVisible: true,
      showBuyPurchaseWayModal: true,
      purchaseWayModal: {
        priceObj: {
          price: selectedPlan.price[0],
          unitName: "GEMS",
          unitsCount: selectedPlan.gemsCount
        },
        successCallback: () => {
          this.setState(
            {
              isNewCloserModalVisible: false
            },
            () => {
              setTimeout(() => {
                afterCurrencyPurchase();
              }, 300);
            }
          );
        },
        failureCallback: () => {
          this.setState({
            isNewCloserModalVisible: false,
            // showBuyPurchaseWayModal: false,
            purchaseWayModal: null
          });
        }
      }
    });
    const afterCurrencyPurchase = () => {
      const { myData, goBack } = this.props;
      const { selectedGemsCount, selectedPlan } = this.state;
      console.log(
        "before goinh back is ",
        myData.gems_count,
        selectedGemsCount
      );
      goBack(true, parseInt(selectedPlan.gemsCount));
      return;
      this.setState({
        fullScreenLoading: true
      });

      packApi.purchaseGems(selectedPlan.gemsCount, cbData => {
        if (cbData.success) {
          const newUserObj = cbData.data;
          this.props
            .updateInfo({ gems_count: newUserObj.gems_count })
            .then(() => {
              this.setState({
                fullScreenLoading: false
              });
              // setTimeout(() => {
              this.props.goBack(true, newUserObj.gems_count);

              // }, 500);
            });
        }
      });
    };
    return;

    const products = await RNIap.getProducts([productId]);

    this.setState({
      purchaseLoading: true
    });

    RNIap.requestPurchase(productId)
      .then(currentPurchaseResult => {
        console.log(" currency purchase result is", currentPurchaseResult);
        afterCurrencyPurchase();
      })
      .catch(err => {
        console.log(" err in currency purchase is ", err);
        this.setState({
          purchaseLoading: false
        });
      });
  };
  showOffersModal = () => {
    this.props.showOffersModal();
  };
  renderPurchaseWayModal = () => {
    const { purchaseWayModal } = this.state;
    return (
      <PurchaseWayModal
        priceObj={purchaseWayModal && purchaseWayModal.priceObj}
        successCallback={purchaseWayModal && purchaseWayModal.successCallback}
        failureCallback={purchaseWayModal && purchaseWayModal.failureCallback}

        // purchaseWayModal && purchaseWayModal.failureCallback
      />
    );
  };
  renderNewCloserModal = () => {
    const { isNewCloserModalVisible, showBuyPurchaseWayModal } = this.state;
    return (
      <View
        style={{
          zIndex: 10
          // ...StyleSheet.absoluteFillObject
        }}
      >
        <NewCloserModal inSecondLevel={true} visible={isNewCloserModalVisible}>
          {showBuyPurchaseWayModal && this.renderPurchaseWayModal()}
        </NewCloserModal>
      </View>
    );
  };
  renderFullScreenLoading = () => {
    return (
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          justifyContent: "center",
          alignItems: "center",
          zIndex: 11,
          backgroundColor: "#00000080"
        }}
      >
        <ActivityIndicator color={WHITE} size={"small"} />
      </View>
    );
  };
  render() {
    const {
      goBack,
      myData,
      powerName,
      colors = [],
      cost,
      gemPacks,
      hasOffers = false,
      extraData
    } = this.props;
    const {
      selectedGemsCount,
      purchaseLoading,
      selectedPlan,
      min,
      second,
      hour,
      fullScreenLoading,
      showBuyPurchaseWayModal
    } = this.state;
    return (
      <View
        style={{
          zIndex: 1,
          height: DeviceHeight,
          borderRadius: 20,
          width: DeviceWidth,
          ...StyleSheet.absoluteFillObject
        }}
      >
        {this.renderNewCloserModal()}
        {fullScreenLoading && this.renderFullScreenLoading()}
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: "#0000",
            zIndex: 1
          }}
        >
          <VerticalGradientView
            colors={colors}
            style={styles.wholeVerticalGradientContainer}
          >
            <RowView
              style={{
                justifyContent: "space-between",
                marginBottom: 10
              }}
            >
              <TouchableOpacity
                onPress={() => goBack(false)}
                style={styles.closeIcon}
              >
                <Ionicon name={"ios-close-circle"} size={30} color={"#fff"} />
              </TouchableOpacity>

              <View style={styles.gemView}>
                <SvgUri
                  width={16}
                  height={16}
                  source={require("../../assets/svgs/MyProfile/Gem.svg")}
                />
                <MediumText style={styles.gemCount}>
                  {myData.gems_count || 0}
                </MediumText>
              </View>
            </RowView>

            <View style={sharedStyles.justifiedCenter}>
              <View style={styles.powerIconContainer}>
                {extraData && extraData.icon ? (
                  <SvgUri height={30} width={30} source={extraData.icon} />
                ) : (
                  <Ionicon
                    size={30}
                    color={PURPLE}
                    name={"ios-share-alt"}
                    style={{
                      transform: [{ rotateY: "180deg" }]
                    }}
                  />
                )}
              </View>
              <MediumText style={styles.powerName}>{powerName}</MediumText>
            </View>

            {extraData && extraData.extraDescription ? (
              <View>
                <MediumText
                  style={{
                    fontSize: 19,
                    color: FONT_BLACK,
                    textAlign: "center"
                  }}
                >
                  {extraData.description}
                </MediumText>
                {extraData.refreshedAt ? (
                  <BoldText
                    style={{
                      fontSize: 18,
                      color: FONT_BLACK,
                      textAlign: "center",
                      marginVertical: 5
                    }}
                  >
                    {`${hour}:${min}:${second}`}
                  </BoldText>
                ) : (
                  <View />
                )}

                <MediumText
                  style={{
                    fontSize: 19,
                    color: FONT_BLACK,
                    textAlign: "center",
                    marginBottom: 30
                  }}
                >
                  {extraData.extraDescription}
                </MediumText>
              </View>
            ) : (
              <View />
            )}

            <FlatList
              data={gemPacks}
              contentContainerStyle={{
                flex: 1,
                // backgroundColor: "green",
                justifyContent: "space-evenly",
                alignItems: "center",
                marginBottom: 10
              }}
              keyExtractor={(item, index) => index}
              numColumns={3}
              extraData={this.state}
              renderItem={({ item, index }) => {
                const isSelected =
                  selectedPlan && selectedPlan.gemsCount === item.gemsCount;
                const inFirstRow = index < 3;
                const lastInrow = index === 2 || index === 5;
                return (
                  <NoFeedbackTapView
                    onPress={() => {
                      this.setState({ selectedPlan: item });
                    }}
                  >
                    <JustifiedCenteredView
                      style={{
                        ...styles.eachPlanItem,
                        borderColor: isSelected ? colors[0] : "#9b9b9b50",
                        borderWidth: isSelected ? 2 : 1,
                        marginRight: lastInrow ? 0 : constants.LEFT_MARGIN,
                        marginBottom: inFirstRow ? constants.LEFT_MARGIN : 0
                      }}
                    >
                      <SvgUri
                        width={20}
                        height={20}
                        source={require("../../assets/svgs/MyProfile/Gem.svg")}
                      />
                      <RegularText
                        style={{
                          fontSize: 16
                        }}
                      >
                        {item.gemsCount}
                      </RegularText>
                      <MediumText
                        style={{
                          fontSize: 18
                        }}
                      >
                        {item.price}
                      </MediumText>
                    </JustifiedCenteredView>
                  </NoFeedbackTapView>
                );
              }}
            />

            <JustifiedCenteredView
              style={{
                flexDirection: "row"
              }}
            >
              <RegularText
                style={{
                  fontSize: 16,
                  color: FONT_BLACK
                }}
              >
                Each {powerName} costs {cost || 0}{" "}
              </RegularText>
              <SvgUri
                width={20}
                height={20}
                source={require("../../assets/svgs/MyProfile/Gem.svg")}
              />
            </JustifiedCenteredView>

            <NoFeedbackTapView
              disabled={purchaseLoading}
              onPress={() => this.purchaseGems()}
            >
              <View
                colors={[colors[0], colors[0]]}
                style={{
                  ...styles.continueBtnContainer,
                  backgroundColor: colors[0]
                }}
              >
                {purchaseLoading ? (
                  <ActivityIndicator size="small" color={"white"} />
                ) : (
                  <MediumText
                    style={{
                      fontSize: 20,
                      color: "#fff"
                    }}
                  >
                    Continue
                  </MediumText>
                )}
              </View>
            </NoFeedbackTapView>
            {hasOffers && (
              // <View style={{display:"flex", flexDirection: "row" }} >
              //   <View style={{flex:1}}/>
              //   <RegularText>Or</RegularText>
              //   <View style={{flex:1, hei}}/>

              // </View>
              <NoFeedbackTapView
                // disabled={purchaseLoading}
                onPress={() => this.showOffersModal()}
              >
                <View
                  colors={[colors[0], colors[0]]}
                  style={styles.checkBetterOffersbtnContainer}
                >
                  <MediumText style={styles.checkBetterOffersbtnText}>
                    Check Better Offers
                  </MediumText>
                </View>
              </NoFeedbackTapView>
            )}
          </VerticalGradientView>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  },
  wholeVerticalGradientContainer: {
    width: DeviceWidth - 10,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: "rgb(242,242,242)",
    padding: constants.LEFT_MARGIN,
    marginTop: 30
  },
  closeIcon: {
    height: 30,
    width: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center"
  },
  powerIconContainer: {
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 22,
    height: 60,
    width: 60,
    marginTop: -10,
    ...sharedStyles.justifiedCenter
  },
  powerName: {
    fontSize: 25,
    color: "#fff",
    marginTop: 15,
    marginBottom: 10
  },
  eachPlanItem: {
    width: (DeviceWidth - constants.LEFT_MARGIN) * 0.27,
    height: DeviceHeight * 0.2,
    borderRadius: 15,
    justifyContent: "space-between",
    padding: constants.LEFT_MARGIN,
    backgroundColor: "#fff"
  },
  continueBtnContainer: {
    height: 50,
    width: DeviceWidth * 0.9,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: constants.LEFT_MARGIN,
    borderRadius: 30
  },
  checkBetterOffersbtnContainer: {
    height: 50,
    width: DeviceWidth * 0.9,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: constants.LEFT_MARGIN,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: FONT_BLACK
  },
  checkBetterOffersbtnText: {
    fontSize: 18,
    color: FONT_BLACK
  }
});

const mapState = state => {
  return {
    myData: state.info.userInfo,
    gemPacks: state.app.gemPacks || []
  };
};

const mapDispatch = dispatch => {
  return {
    updateInfo: bindActionCreators(infoActions.updateOwnProfile, dispatch)
  };
};
export default connect(mapState, mapDispatch)(BuyModal);
