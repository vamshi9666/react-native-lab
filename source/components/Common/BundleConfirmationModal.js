import React from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import { FONT_BLACK, LIGHT_PURPLE, PURPLE } from "../../config/Colors";
import { LEFT_MARGIN } from "../../config/Constants";
import { DeviceWidth } from "../../config/Device";
import MediumText from "../Texts/MediumText";
import RegularText from "../Texts/RegularText";
import HorizontalGradientView from "../Views/HorizontalGradientView";
import JustifiedCenteredView from "../Views/JustifiedCenteredView";
import NoFeedbackTapView from "../Views/NoFeedbackTapView";

class BundleConfirmationModal extends React.Component {
  render() {
    const { count = "", unit = "", goBack } = this.props;
    return (
      <JustifiedCenteredView
        style={{
          flex: 1,
          backgroundColor: "#0000"
        }}
      >
        <View
          style={{
            borderRadius: 15,
            backgroundColor: "#fff",
            padding: 10,
            width: DeviceWidth * 0.8,
            justifyContent: "space-evenly",
            alignItems: "center"
          }}
        >
          <RegularText
            style={{
              fontSize: 20,
              textAlign: "center",
              paddingHorizontal: 16,
              marginTop: 32
            }}
          >
            Taking this action will cost you {count} gems
          </RegularText>
          <NoFeedbackTapView onPress={() => goBack(true)}>
            <HorizontalGradientView
              colors={[PURPLE, LIGHT_PURPLE]}
              style={{
                height: 50,
                width: DeviceWidth * 0.6,
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center",
                marginTop: LEFT_MARGIN,
                borderRadius: 30
              }}
            >
              <MediumText
                style={{
                  fontSize: 18,
                  color: "#fff"
                }}
              >
                Continue
              </MediumText>
            </HorizontalGradientView>
          </NoFeedbackTapView>
          <NoFeedbackTapView
            onPress={() => goBack(false)}
            style={{
              height: 50,
              width: DeviceWidth * 0.6,
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              marginTop: LEFT_MARGIN,
              borderRadius: 30,
              backgroundColor: "#fff"
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
        </View>
      </JustifiedCenteredView>
    );
  }
}

const mapState = state => {
  return {
    packPrices: state.app.packPrices
  };
};

const mapDispatch = dispatch => {
  return {};
};
export default connect(mapState, mapDispatch)(BundleConfirmationModal);
