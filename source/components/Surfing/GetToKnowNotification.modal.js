import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import ModalCurvedcard from "../Views/Modal.curvedcard";
import NoFeedbackTapView from "../Views/NoFeedbackTapView";
import MediumText from "../Texts/MediumText";
import { sharedStyles } from "../../styles/Shared";
import { DeviceHeight, DeviceWidth } from "../../config/Device";
import { FONT_BLACK, PURPLE, LIGHT_PURPLE } from "../../config/Colors";
import VerticalGradientView from "../Views/VerticalGradientView";
import RowView from "../Views/RowView";
import CircularImage from "../Views/CircularImage";
import { STATIC_URL } from "../../config/Api";
import { userNamify, appendQuoteForUserName } from "../../config/Utils";

const MODAL_HEIGHT = DeviceHeight * 0.35;
class GetToKnowNotificationModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { dismiss, userObj, openSettings } = this.props;

    return (
      <ModalCurvedcard style={styles.baseLayout}>
        <View
          style={{
            width: DeviceWidth * 0.8,
            height: MODAL_HEIGHT,
            borderRadius: 20,
            alignItems: "center",
            paddingTop: 10,
            backgroundColor: "#fff",
            justifyContent: "space-between"
          }}
        >
          <View
            style={{
              alignSelf: "center",
              marginTop: 5
            }}
          >
            <CircularImage
              height={35}
              source={{
                uri: STATIC_URL + userObj.images[0].split("uploads")[1]
              }}
            />
          </View>
          <MediumText
            style={{
              color: FONT_BLACK,
              textAlign: "center",
              fontSize: 20,
              marginVertical: 10
            }}
          >
            Get notified when {"\n"}{" "}
            {appendQuoteForUserName(userNamify(userObj))} responds to you?
          </MediumText>

          <View>
            <NoFeedbackTapView onPress={openSettings}>
              <VerticalGradientView
                style={{
                  height: 50,
                  width: DeviceWidth * 0.6,
                  borderRadius: 30,
                  alignSelf: "center",
                  ...sharedStyles.justifiedCenter
                }}
                colors={[PURPLE, LIGHT_PURPLE]}
              >
                <MediumText
                  style={{
                    color: "#fff",
                    fontSize: 18
                  }}
                >
                  Yes, Notify me
                </MediumText>
              </VerticalGradientView>
            </NoFeedbackTapView>

            <NoFeedbackTapView
              style={{
                height: 50,
                width: DeviceWidth * 0.8,
                borderRadius: 30,
                ...sharedStyles.justifiedCenter
              }}
              onPress={dismiss}
            >
              <MediumText
                style={{
                  color: FONT_BLACK,
                  fontSize: 18
                }}
              >
                No Thanks
              </MediumText>
            </NoFeedbackTapView>
          </View>
        </View>
      </ModalCurvedcard>
    );
  }
}

const styles = StyleSheet.create({
  baseLayout: {
    width: DeviceWidth * 0.8,
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    height: MODAL_HEIGHT,
    padding: 0
  }
});

export default GetToKnowNotificationModal;
