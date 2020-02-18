import React, { Component } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  ActivityIndicator
} from "react-native";
import ModalCurvedcard from "../Views/Modal.curvedcard";
import BoldText from "../Texts/BoldText";
import NoFeedbackTapView from "../Views/NoFeedbackTapView";
import HorizontalGradientView from "../Views/HorizontalGradientView";
import { PURPLE, LIGHT_PURPLE, BLUE, FONT_BLACK } from "../../config/Colors";
import MediumText from "../Texts/MediumText";
import { LEFT_MARGIN } from "../../config/Constants";
import { sharedStyles } from "../../styles/Shared";
import {
  validateReferralCode,
  earnRewardViaReferralCode
} from "../../network/user";
import { DeviceWidth } from "../../config/Device";

class FbUserWelcomeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
  }

  validateAndSubmitReferralCode = () => {
    this.setState({ isLoading: true });
    const { code } = this.state;
    validateReferralCode(code, cbData => {
      this.setState({ isLoading: false });
      if (cbData.success) {
        earnRewardViaReferralCode({ referralCode: code }, cbData => {
          if (cbData.success) {
            this.props.closeModal(true);
          }
        });

        // this.setState({ hasSubmitedCode: true }, () => {
        //   //   this.props.setReferralCode(code);
        //   //   this.closeCloserModal();
        // });
      } else {
        alert(cbData.message);
      }
    });
  };

  render() {
    const { isLoading, code } = this.state;
    const { closeModal } = this.props;

    return (
      <ModalCurvedcard>
        <ScrollView
          horizontal
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
        >
          <View
            style={{
              width: "100%"
            }}
          >
            <BoldText style={styles.modalHeader}>
              Welcome to {"\n"} Closer!
            </BoldText>

            <NoFeedbackTapView
              onPress={() => this.dismissRewardsModal("success")}
            >
              <HorizontalGradientView
                colors={[PURPLE, LIGHT_PURPLE]}
                style={styles.submitButton}
              >
                <MediumText
                  style={{
                    fontSize: 20,
                    color: "#fff"
                  }}
                >
                  Continue
                </MediumText>
              </HorizontalGradientView>
            </NoFeedbackTapView>

            <NoFeedbackTapView
              onPress={this.showReferralCodeInput}
              style={{
                position: "absolute",
                bottom: LEFT_MARGIN
              }}
            >
              <BoldText
                style={{
                  color: BLUE,
                  fontSize: 15,
                  textAlign: "center"
                }}
              >
                Have a Referral Code?
              </BoldText>
            </NoFeedbackTapView>
          </View>

          <View
            style={{
              width: "100%"
            }}
          >
            <BoldText style={styles.modalHeader}>
              Enter your Referral Code
            </BoldText>
            <TextInput
              value={code}
              onChangeText={code => this.setState({ code })}
              placeholder={"Referral code"}
              style={styles.textInput}
            />
            <NoFeedbackTapView
              disabled={code === ""}
              onPress={this.validateAndSubmitReferralCode}
            >
              <HorizontalGradientView
                colors={
                  code === "" ? ["#cacaca", "#cacaca"] : [PURPLE, LIGHT_PURPLE]
                }
                style={styles.submitButton}
              >
                {isLoading ? (
                  <ActivityIndicator size={"small"} color={"#fff"} />
                ) : (
                  <MediumText
                    style={{
                      fontSize: 20,
                      color: "#fff"
                    }}
                  >
                    Submit
                  </MediumText>
                )}
              </HorizontalGradientView>
            </NoFeedbackTapView>

            <NoFeedbackTapView
              style={{
                height: 50,
                ...sharedStyles.justifiedCenter
              }}
              onPress={closeModal}
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
        </ScrollView>
      </ModalCurvedcard>
    );
  }
}

const styles = StyleSheet.create({
  modalHeader: {
    color: FONT_BLACK,
    fontSize: 20,
    textAlign: "center",
    marginRight: 10,
    marginBottom: 10
  },
  textInput: {
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#00000010",
    borderRadius: 30,
    height: 40,
    width: "90%",
    alignSelf: "center"
  },
  submitButton: {
    height: 50,
    width: DeviceWidth * 0.6,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: LEFT_MARGIN,
    borderRadius: 30
  }
});

export default FbUserWelcomeModal;
