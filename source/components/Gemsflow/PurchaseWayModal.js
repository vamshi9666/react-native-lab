import React from "react";
import {
  StyleSheet,
  View,
  Platform,
  Image,
  ActivityIndicator
} from "react-native";
import { CachedImage } from "react-native-img-cache";
import FeatherIcon from "react-native-vector-icons/Feather";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome5";
import Ionicon from "react-native-vector-icons/Ionicons";
import { BLACK, FONT_GREY, WHITE, PURPLE } from "../../config/Colors";
import { DeviceWidth, DeviceHeight } from "../../config/Device";
import BoldText from "../Texts/BoldText";
import RegularText from "../Texts/RegularText";
import NoFeedbackTapView from "../Views/NoFeedbackTapView";
import RazorpayCheckout from "react-native-razorpay";
import RNIap from "react-native-iap";
import { RAZOR_PAY_KEY } from "../../config/Constants";

class PurchaseWayModal extends React.Component {
  state = {
    screenWideLoading: false
  };
  openRazorPay = async () => {
    const { priceObj, successCallback, failureCallback } = this.props;
    const { unitsCount, price, unitName } = priceObj;
    console.log(" final child props are ", priceObj);
    var options = {
      description: "",
      image: "https://i.imgur.com/3g7nmJC.png",
      currency: "INR",
      key: RAZOR_PAY_KEY,
      amount: String(price * 100),
      name: String(unitsCount + " " + unitName),
      order: "order_DslnoIgkIDL8Zt",
      prefill: {
        email: "gaurav.kumar@example.com",
        contact: "9191919191",
        name: "Gaurav Kumar"
      },
      theme: { color: PURPLE }
    };

    RazorpayCheckout.open(options)
      .then(data => {
        console.log(" all of razor pay props are ", this.props);
        console.log(" razorpay  data is ", data);
        successCallback();
      })
      .catch(error => {
        console.log(" failed in other way", error);
        //user still needs to see this popup
      });
  };
  openInAppPurchase = async () => {
    const { priceObj, successCallback, failureCallback } = this.props;
    const productId =
      Platform.OS === "ios" ? "appleProductId" : "appleProductId";

    // this.setState({
    //   screenWideLoading: true
    // });
    RNIap.getProducts([priceObj[productId]])
      .then(() => {
        this.setState({
          screenWideLoading: false
        });
      })
      .catch(err => {
        alert(err);
        this.setState({
          screenWideLoading: false
        });
      });

    RNIap.requestPurchase(String(priceObj[productId]))
      .then(currencyPurcaseResult => {
        console.log(" current purchase result is ", currencyPurcaseResult);
        successCallback();
      })
      .catch(err => {
        console.log(" current purchase user didn't buy stuff >> ", err);
      });
  };

  renderScreenWideLoading = () => {
    return (
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
          height: DeviceHeight,
          top: -30,
          // width: DeviceWidth,
          opacity: 0.5,
          zIndex: Math.pow(10, 10)
        }}
      >
        <ActivityIndicator size={"small"} color={WHITE} />
      </View>
    );
  };
  render() {
    const otherLogoProps = {
      width: 36,
      style: { width: 36, height: 36 },
      resizeMethod: "scale",
      resizeMode: "contain",
      height: 48
    };
    const { failureCallback, priceObj } = this.props;
    return (
      <>
        {this.state.screenWideLoading && this.renderScreenWideLoading()}
        <View style={styles.container}>
          <View style={styles.headerCon}>
            <Ionicon
              onPress={() => {
                failureCallback();
              }}
              name={"ios-close"}
              size={35}
              color={FONT_GREY}
              style={styles.closeIcon}
            />

            <BoldText style={styles.paymentOptionTitle}>
              Pay ₹ {priceObj && priceObj.price}
            </BoldText>
          </View>

          <View style={styles.optionsCon}>
            <NoFeedbackTapView
              onPress={this.openRazorPay}
              style={styles.paymentOption}
            >
              <View style={styles.optionName}>
                <RegularText style={{ fontSize: 20 }}>
                  Via other options
                </RegularText>

                <FeatherIcon name="chevron-right" size={30} color={FONT_GREY} />
              </View>
              <View style={styles.otherLogosCon}>
                <CachedImage
                  source={require("../../assets/images/Paytm_logo.png")}
                  {...otherLogoProps}
                />
                <CachedImage
                  source={require("../../assets/images/bharatPe.png")}
                  {...otherLogoProps}
                />
              </View>
            </NoFeedbackTapView>
            <NoFeedbackTapView
              onPress={this.openInAppPurchase}
              style={styles.paymentOption}
            >
              <View style={styles.optionName}>
                <RegularText style={{ fontSize: 20 }}>Via Apple</RegularText>

                <FeatherIcon name="chevron-right" size={30} color={FONT_GREY} />
              </View>
              <View
                style={{
                  height: 32,
                  flex: 1,
                  width: "100%"
                }}
              >
                <FontAwesomeIcon name={"apple-pay"} size={32} color={BLACK} />
              </View>
            </NoFeedbackTapView>
          </View>
        </View>
      </>
    );
  }
}

// PurchaseWayModal.prototype = {
//   priceObj: Object<{ price!, gemsCount }>,
//   sucessCallback: () => ({}),
//   failureCallback: () => ({}),
//   gemsCount : Number
// };

export default PurchaseWayModal;

const styles = StyleSheet.create({
  container: {
    // position: "absolute",

    // ...StyleSheet.absoluteFillObject,
    // alignItems: "center",
    // justifyContent: "center",
    height: 300,
    backgroundColor: WHITE,
    marginTop: 32,
    bottom: 0,
    right: 0,
    left: 0,
    top: DeviceHeight - 300,
    borderTopLeftRadius: 15,
    zIndex: 10 * 10 * 10,
    borderTopRightRadius: 15
    // zIndex: 10
  },
  headerCon: {
    width: DeviceWidth,
    paddingHorizontal: 10,
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  optionsCon: {
    flex: 1,
    flexDirection: "column",
    // justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
    marginBottom: 32
  },
  paymentOption: {
    marginBottom: 20,
    borderWidth: 0.5,
    borderRadius: 25,
    paddingVertical: 10,
    borderColor: FONT_GREY,
    // flexDirection: "row",
    alignItems: "center",
    width: DeviceWidth * 0.8,
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingLeft: 20
  },
  optionName: {
    flexDirection: "row",
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center"
  },
  paymentOptionTitle: {
    color: FONT_GREY,
    fontSize: 18,
    textAlign: "center",
    textAlignVertical: "center",
    marginRight: 10,
    marginTop: 10
  },
  otherLogosCon: {
    height: 32,
    flex: 1,
    width: "100%",
    flexDirection: "row"
  },
  closeIcon: {
    position: "absolute",
    left: 20,
    top: 0
  }
});
