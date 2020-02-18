import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import JustifiedCenteredView from "../Views/JustifiedCenteredView";
import RegularText from "../Texts/RegularText";
import { PURPLE, LIGHT_PURPLE } from "../../config/Colors";
import { DeviceWidth } from "../../config/Device";
import HorizontalGradientView from "../Views/HorizontalGradientView";
import NoFeedbackTapView from "../Views/NoFeedbackTapView";
import BoldText from "../Texts/BoldText";

export default class SnoozeConfirmationModal extends React.Component {
  render() {
    const { goBack } = this.props;
    return (
      <JustifiedCenteredView
        style={{
          flex: 1
        }}
      >
        <View
          style={{
            height: 200,
            width: DeviceWidth * 0.95,
            borderRadius: 20,
            backgroundColor: "#fff",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center"
          }}
        >
          <RegularText
            style={{
              color: "#1E2432",
              fontSize: 17,
              textAlign: "center",
              paddingHorizontal: DeviceWidth * 0.04
            }}
          >
            By switching on Private mode, Your current sent and recieved
            requests will be removed and cant be recovered. Are you sure to
            switch on Private mode.
          </RegularText>
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <TouchableOpacity
              onPress={async () => {
                goBack(true);
              }}
            >
              <HorizontalGradientView
                colors={[PURPLE, LIGHT_PURPLE]}
                style={{
                  width: DeviceWidth * 0.4,
                  height: 40,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 5
                }}
              >
                <BoldText style={{ color: "#fff", fontSize: 16 }}>
                  Confirm
                </BoldText>
              </HorizontalGradientView>
            </TouchableOpacity>
            <NoFeedbackTapView onPress={() => goBack(false)}>
              <View
                style={{
                  width: DeviceWidth * 0.4,
                  height: 40,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 5
                }}
              >
                <BoldText style={{ color: PURPLE, fontSize: 16 }}>
                  Cancel
                </BoldText>
              </View>
            </NoFeedbackTapView>
          </View>
        </View>
      </JustifiedCenteredView>
    );
  }
}
