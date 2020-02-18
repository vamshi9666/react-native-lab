import React, { Component } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import Share from "react-native-share";
import SvgUri from "react-native-svg-uri";
import Ionicon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  FONT_BLACK,
  FONT_GREY,
  LIGHT_PURPLE,
  PURPLE
} from "../../config/Colors";
import { DeviceHeight, DeviceWidth } from "../../config/Device";
import { purchaseGems } from "../../network/pack";
import { updateOwnProfile } from "../../redux/actions/user.info";
import { sharedStyles } from "../../styles/Shared";
import NewCloserModal from "../Common/NewCloserModal";
import BoldText from "../Texts/BoldText";
import MediumText from "../Texts/MediumText";
import RegularText from "../Texts/RegularText";
import CloserModal from "../Views/Closer.modal";
import HorizontalGradientView from "../Views/HorizontalGradientView";
import JustifiedCenteredView from "../Views/JustifiedCenteredView";
import ModalCurvedcard from "../Views/Modal.curvedcard";
import NoFeedbackTapView from "../Views/NoFeedbackTapView";
import RowView from "../Views/RowView";
import * as constants from "./../../config/Constants";
import PurchaseWayModal from "./PurchaseWayModal";

const earnGemPlans = [
  { icon: "ios-play", text: "Watch Video ad", gemCount: 1, bgColor: FONT_GREY },
  {
    icon: "ios-person-add",
    text: "Invite Friend",
    gemCount: 3,
    bgColor: "yellow"
  },
  {
    icon: "ios-create",
    text: "Create Content",
    gemCount: 1,
    bgColor: "skyblue"
  },
  {
    icon: "md-pin",
    text: "Location Check - in",
    gemCount: 1,
    bgColor: "orange"
  }
];

export const HELPER_TEXT_STATES = itemName => {
  return {
    PURCHASED_AND_FINISHED: "Out of" + itemName,
    USED_ONLY_FREE_ITEMS: "Done for today"
  };
};

class BuygemsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPrice: this.props.gemPacks[0],
      purchaseLoading: false,
      isModalVisible: false,
      showInviteFriendModal: false,
      showPurchaseWayModal: false,
      purchaseWayModal: null,
      blankScreen: false
    };
  }

  componentDidMount = () => {
    this.setState({
      selectedPrice: this.props.gemPacks[0]
    });
  };
  startPuchase = async priceObj => {
    console.log(" price obj is ", priceObj);
    this.setState({
      showPurchaseWayModal: true,
      isNewCloserModalVisible: true,
      purchaseWayModal: {
        priceObj: {
          ...priceObj,
          unitsCount: priceObj.gemsCount,
          price: priceObj.price[0],
          unitName: "GEMS"
        },
        successCallback: choosenOther => {
          afterCurrencyPurchase();
        },
        failureCallback: () => {
          this.setState({
            // showPurchaseWayModal: false,
            isNewCloserModalVisible: false,
            purchaseWayModal: null
          });
          alert(" failed on whole ");
        }
      }
    });
    const afterCurrencyPurchase = props => {
      this.setState(
        {
          showPurchaseWayModal: false
        },
        () => {
          purchaseGems(priceObj.gemsCount, async purchaseResult => {
            if (purchaseResult.success) {
              console.log(" purchase result is ", purchaseResult);
              await this.props.updateProfile({
                gems_count: purchaseResult.data.gems_count
              });
              this.setState({
                purchaseLoading: false,
                isNewCloserModalVisible: false
              });
              setTimeout(() => {
                this.props.goBack(true);
              }, 500);
            }
          });
        }
      );
    };
  };

  openCloserModal = () => {
    this.setState({ isModalVisible: true });
    this.refs["modalRef"].toggleBg(true);
  };

  closeCloserModal = () => {
    this.setState({ isModalVisible: false });
    this.refs["modalRef"].startAnimation(false);
    setTimeout(() => {
      this.refs["modalRef"].toggleBg(false);
    }, 300);
  };

  toggleInviteFriendModal = showInviteFriendModal => {
    if (showInviteFriendModal) {
      this.setState({ showInviteFriendModal });
      this.openCloserModal();
    } else {
      this.closeCloserModal();
      setTimeout(() => {
        this.setState({ showInviteFriendModal });
      }, 300);
    }
  };

  handleBottomEarnGemButtons = planId => {
    switch (planId) {
      case 0:
        alert("Watch video ad");
        break;

      case 1:
        this.toggleInviteFriendModal(true);
        break;

      case 2:
        alert("Create content");
        break;

      case 3:
        alert("Location check In");
        break;

      default:
        break;
    }
  };

  shareReferalCode = async () => {
    const { myData } = this.props;

    let shareOptions = {
      title: "Invite Friends",
      failOnCancel: false,
      message: `Hi, I came across this awesome app, to connect with me via Closerapp, user my referral code ${myData.referralCode} Also tap on this link to install the app https://google.com`
    };
    await Share.open(shareOptions);
  };
  renderCloserModal = () => {
    const { isModalVisible, showInviteFriendModal } = this.state;

    return (
      <CloserModal isModalVisible={isModalVisible} ref={"modalRef"}>
        {showInviteFriendModal ? (
          <ModalCurvedcard>
            <RowView
              style={{
                justifyContent: "center",
                alignSelf: "center",
                alignItems: "center"
              }}
            >
              <BoldText
                style={{
                  color: FONT_BLACK,
                  fontSize: 24,
                  textAlign: "center",
                  marginRight: 10
                }}
              >
                Invite & Earn
              </BoldText>
              <SvgUri
                width={18}
                height={18}
                source={require("../../assets/svgs/MyProfile/Gem.svg")}
              />
            </RowView>

            <RegularText
              style={{
                color: FONT_BLACK,
                fontSize: 18,
                textAlign: "center",
                marginTop: constants.LEFT_MARGIN
              }}
            >
              Invite your friends to install closerapp and earn 3 Gems when they
              user your Referal Code.
            </RegularText>

            <NoFeedbackTapView onPress={this.shareReferalCode}>
              <HorizontalGradientView
                colors={[PURPLE, LIGHT_PURPLE]}
                style={{
                  height: 50,
                  width: DeviceWidth * 0.6,
                  alignItems: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  marginTop: constants.LEFT_MARGIN,
                  borderRadius: 30
                }}
              >
                <MediumText
                  style={{
                    fontSize: 20,
                    color: "#fff"
                  }}
                >
                  Invite
                </MediumText>
              </HorizontalGradientView>
            </NoFeedbackTapView>

            <NoFeedbackTapView
              style={{
                height: 50,
                ...sharedStyles.justifiedCenter
              }}
              onPress={() => {
                this.toggleInviteFriendModal(false);
              }}
            >
              <MediumText
                style={{
                  fontSize: 20,
                  color: FONT_BLACK
                }}
              >
                Cancel
              </MediumText>
            </NoFeedbackTapView>
          </ModalCurvedcard>
        ) : (
          <View />
        )}
      </CloserModal>
    );
  };
  renderNewCloserModal = () => {
    const { showPurchaseWayModal, isNewCloserModalVisible } = this.state;
    return (
      <View
        style={{
          zIndex: 10
        }}
      >
        <NewCloserModal inSecondLevel={true} visible={isNewCloserModalVisible}>
          {showPurchaseWayModal && this.renderPurchaseWayModal()}
        </NewCloserModal>
      </View>
    );
  };
  renderPurchaseWayModal = () => {
    const { purchaseWayModal } = this.state;
    return (
      <PurchaseWayModal
        // cost={purchaseWayModal.cost}
        priceObj={purchaseWayModal && purchaseWayModal.priceObj}
        successCallback={purchaseWayModal && purchaseWayModal.successCallback}
        failureCallback={purchaseWayModal && purchaseWayModal.failureCallback}
      />
    );
  };
  renderHelperText = () => {
    const { helperText } = this.props(
      // const displayText = helperText
      <RowView>
        <RegularText
          style={{ color: FONT_GREY, size: 16, textAlign: "center" }}
        >
          {helperText}
        </RegularText>
      </RowView>
    );
  };
  render() {
    const {
      goBack,
      gemPacks,
      myData,
      packPrices,
      showHelperText = false
    } = this.props;
    const { selectedPrice, purchaseLoading, showPurchaseWayModal } = this.state;
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
          borderRadius: 20,
          // opacity: 0.8,
          zIndex: 4
        }}
      >
        {this.renderNewCloserModal()}
        <ScrollView
          style={{
            // flex: 1,
            ...StyleSheet.absoluteFillObject,
            flex: 1,
            width: DeviceWidth,
            height: DeviceHeight,
            // backgroundColor: "#fff",
            borderRadius: 20

            // backgroundColor: "red"

            // justifyContent: "center",
            // alignItems: "center"
          }}
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 20,

            backgroundColor: "#fff"
          }}
        >
          {this.renderCloserModal()}
          <View
            style={{
              width: DeviceWidth,
              borderRadius: 20,
              backgroundColor: "rgb(242,242,242)",
              padding: constants.LEFT_MARGIN
              // marginTop: 30
            }}
          >
            <RowView
              style={{
                justifyContent: "space-between",
                marginBottom: 10
              }}
            >
              <TouchableOpacity
                onPress={() => goBack(false)}
                style={{
                  height: 30,
                  width: 30,
                  borderRadius: 15,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: FONT_GREY
                }}
              >
                <Ionicon name={"ios-close"} size={25} color={FONT_GREY} />
              </TouchableOpacity>
              <MediumText
                style={{
                  fontSize: 18,
                  color: FONT_BLACK,
                  marginTop: 5,
                  textAlign: "center"
                }}
              >
                Buy Gems
              </MediumText>
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
            {showHelperText && this.renderHelperText()}

            <FlatList
              data={gemPacks || []}
              keyExtractor={item => item._id}
              numColumns={3}
              extraData={this.state}
              renderItem={({ item, index }) => {
                return (
                  <NoFeedbackTapView
                    onPress={() => this.setState({ selectedPrice: item })}
                  >
                    <JustifiedCenteredView
                      style={{
                        width: DeviceWidth * 0.26,
                        height: DeviceHeight * 0.2,
                        borderRadius: 15,
                        justifyContent: "space-between",
                        padding: constants.LEFT_MARGIN,
                        backgroundColor: "#fff",
                        borderColor:
                          item.gemsCount === selectedPrice.gemsCount
                            ? PURPLE
                            : "#9b9b9b50",
                        borderWidth:
                          selectedPrice.gemCount === item.gemsCount ? 2 : 1,
                        marginRight: constants.LEFT_MARGIN,
                        marginBottom: constants.LEFT_MARGIN
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
                        ₹{item.price[0]}
                      </MediumText>
                    </JustifiedCenteredView>
                  </NoFeedbackTapView>
                );
              }}
            />

            <View
              style={{
                borderColor: "#9b9b9b50",
                borderWidth: 1,
                backgroundColor: "#fff",
                borderRadius: 15
              }}
            >
              <MediumText
                style={{
                  textAlign: "center",
                  fontSize: 18,
                  marginVertical: 10
                }}
              >
                Costs
              </MediumText>
              <FlatList
                data={packPrices}
                keyExtractor={(item, index) => index}
                numColumns={3}
                renderItem={({ item, index }) => {
                  return (
                    <RowView
                      style={{
                        width: DeviceWidth * 0.3,
                        borderRadius: 15,
                        justifyContent: "space-evenly",
                        paddingBottom: constants.LEFT_MARGIN,
                        // padding: constants.LEFT_MARGIN,
                        backgroundColor: "#fff"
                      }}
                    >
                      <RegularText> 1 </RegularText>
                      <View
                        style={{
                          height: 20,
                          width: 20,
                          borderRadius: 10,
                          backgroundColor: "rgb(242,242,242)",
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: -2
                        }}
                      >
                        <SvgUri
                          width={12}
                          height={12}
                          source={constants.MONETIZATION_ICONS[item.value]}
                        />
                      </View>
                      <RegularText>
                        {" "}
                        {item.value === "MORE_PROFILES" ? "2" : item.price}{" "}
                      </RegularText>
                      <SvgUri
                        width={15}
                        height={15}
                        source={require("../../assets/svgs/MyProfile/Gem.svg")}
                      />
                    </RowView>
                  );
                }}
              />
            </View>
            <NoFeedbackTapView
              disabled={purchaseLoading}
              onPress={() => {
                if (selectedPrice === null) {
                  alert("Select anyone of the above and Tap on Continue");
                } else {
                  this.startPuchase(selectedPrice);
                }
              }}
            >
              <HorizontalGradientView
                colors={[PURPLE, LIGHT_PURPLE]}
                style={{
                  height: 50,
                  width: DeviceWidth * 0.6,
                  alignItems: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  marginTop: constants.LEFT_MARGIN,
                  borderRadius: 30
                }}
              >
                {purchaseLoading ? (
                  <ActivityIndicator color={"#fff"} size={"small"} />
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
              </HorizontalGradientView>
            </NoFeedbackTapView>
          </View>
          <View
            style={{
              width: DeviceWidth * 0.5,
              borderTopColor: "rgba(255,255,255,0.2)",
              borderTopWidth: 1,
              alignItems: "center",
              marginTop: constants.LEFT_MARGIN,
              alignSelf: "center"
            }}
          >
            <RegularText
              style={{
                color: "#fff",
                marginTop: -10,
                paddingHorizontal: 10,
                backgroundColor: "rgba(0,0,0,0.5)",
                fontSize: 16
              }}
            >
              Or
            </RegularText>
          </View>
          <View style={styles.cardStyle}>
            <MediumText style={styles.cardHeaderText}>Earn Gems</MediumText>
            {earnGemPlans.map((plan, planId) => (
              <NoFeedbackTapView
                key={planId}
                onPress={() => {
                  this.handleBottomEarnGemButtons(planId);
                }}
              >
                <RowView style={styles.bottomItemRowView}>
                  <RowView style={styles.earnGemSubView}>
                    <View
                      style={{
                        ...styles.earnGemIconView,
                        backgroundColor: plan.bgColor,
                        ...sharedStyles.justifiedCenter
                      }}
                    >
                      <Ionicon
                        style={{
                          marginTop: 2,
                          marginLeft: planId === 0 || planId === 2 ? 3 : 0
                        }}
                        name={plan.icon}
                        size={planId === 2 ? 18 : 22}
                        color={"#fff"}
                      />
                    </View>

                    <RegularText style={styles.planText}>
                      {plan.text}
                    </RegularText>
                  </RowView>

                  <RowView style={styles.earnGemSubView}>
                    <SvgUri
                      width={18}
                      height={18}
                      source={require("../../assets/svgs/MyProfile/Gem.svg")}
                    />
                    <MediumText style={styles.gemCountBottom}>
                      {plan.gemCount} Each
                    </MediumText>
                  </RowView>
                </RowView>
              </NoFeedbackTapView>
            ))}
          </View>
          <RegularText style={styles.bottomDescText}>
            We welcome users to register on our digital platforms. We offer the
            below mentioned registration services which may be subject to change
            in the future.
          </RegularText>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cardStyle: {
    width: DeviceWidth,
    borderRadius: 20,
    backgroundColor: "rgb(242,242,242)",
    padding: constants.LEFT_MARGIN
    // marginTop: 10
  },
  cardHeaderText: {
    fontSize: 18,
    color: FONT_BLACK,
    marginTop: 5,
    textAlign: "center",
    marginVertical: 10
  },
  planText: {
    fontSize: 18,
    marginTop: 3
  },
  bottomItemRowView: {
    height: 45,
    width: DeviceWidth * 0.85,
    borderRadius: 10,
    alignSelf: "center",
    shadowColor: "#cacaca",
    backgroundColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    padding: 10,
    justifyContent: "space-between",
    marginVertical: 5
  },
  earnGemIconView: {
    height: 30,
    width: 30,
    borderRadius: 15,
    marginRight: 10
    // marginTop: -15
  },
  earnGemSubView: {
    height: 45,
    justifyContent: "center"
  },
  gemCountBottom: {
    fontSize: 16,
    paddingHorizontal: 10,
    color: FONT_BLACK
  },
  bottomDescText: {
    color: "#fff",
    textAlign: "center",
    marginVertical: 10
  },
  gemCount: {
    color: "#4E586E",
    paddingHorizontal: 4
  },
  gemView: {
    padding: 5,
    backgroundColor: "rgb(240,240,255)",
    borderRadius: 215,
    marginLeft: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  }
});

const mapState = state => {
  return {
    gemPacks: state.app.gemPacks,
    myData: state.info.userInfo || {},
    packPrices: state.app.packPrices
  };
};

const mapDispatch = dispatch => {
  return {
    updateProfile: bindActionCreators(updateOwnProfile, dispatch)
  };
};
export default connect(mapState, mapDispatch)(BuygemsModal);
