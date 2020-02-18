import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import JustifiedCenteredView from "../Views/JustifiedCenteredView";
import RegularText from "../Texts/RegularText";
import {
  WHITE,
  FONT_GREY,
  FONT_BLACK,
  PURPLE,
  LIGHT_PURPLE,
  BRIGHT_RED
} from "../../config/Colors";
import BoldText from "../Texts/BoldText";
import ModalCurvedcard from "../Views/Modal.curvedcard";
import MediumText from "../Texts/MediumText";
import HorizontalGradientView from "../Views/HorizontalGradientView";
import { LEFT_MARGIN } from "../../config/Constants";
import { sharedStyles } from "../../styles/Shared";
import { DeviceWidth } from "../../config/Device";

class DeleteConversationModal extends React.Component {
  render() {
    const { onConfirm, onCancel, roomId, callback, loading } = this.props;

    return (
      <ModalCurvedcard
        style={{
          width: DeviceWidth * 0.8,
          paddingVertical: LEFT_MARGIN * 1.5
        }}
      >
        <MediumText
          style={{
            color: FONT_BLACK,
            fontSize: 18,
            textAlign: "center",
            lineHeight: 23
          }}
        >
          Are you sure, you want to {"\n"} delete this conversation?
        </MediumText>
        <HorizontalGradientView
          colors={[BRIGHT_RED, BRIGHT_RED]}
          style={{ ...styles.submitButtonView, marginTop: LEFT_MARGIN }}
        >
          <TouchableOpacity
            style={styles.submitButtonView}
            onPress={() => {
              if (callback) {
                callback();
              }
              onConfirm(roomId);
            }}
          >
            <MediumText style={{ color: "#fff", fontSize: 16 }}>
              Delete
            </MediumText>
          </TouchableOpacity>
        </HorizontalGradientView>
        <TouchableOpacity
          style={{
            ...styles.submitButtonView,
            marginTop: 10,
            borderWidth: 1,
            borderColor: "#00000080"
          }}
          onPress={() => {
            if (callback) {
              callback();
            }
            onCancel(roomId);
          }}
        >
          <RegularText style={{ color: "#000", fontSize: 16 }}>
            Cancel
          </RegularText>
        </TouchableOpacity>
      </ModalCurvedcard>
    );
  }
}

const styles = StyleSheet.create({
  submitButtonView: {
    width: DeviceWidth * 0.6,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#fff",
    height: 45,
    alignSelf: "center",
    ...sharedStyles.justifiedCenter
  }
});
export default DeleteConversationModal;
