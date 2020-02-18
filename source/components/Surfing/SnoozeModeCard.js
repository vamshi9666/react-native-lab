import React from "react";
import { View, StyleSheet } from "react-native";
import { WHITE, FONT_GREY, LIGHT_PURPLE, PURPLE } from "../../config/Colors";
import RegularText from "../Texts/RegularText";
import NoFeedbackTapView from "../Views/NoFeedbackTapView";
import HorizontalGradientView from "../Views/HorizontalGradientView";
import { DeviceWidth } from "../../config/Device";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateOwnProfile } from "../../redux/actions/user.info";
import { updateProfile } from "../../network/user";
import moment from "moment";
class SnoozeModeCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      snoozeRemainingTime: ""
    };
  }
  makePublic = () => {
    updateProfile(
      {
        private: false
      },
      updateResult => {
        if (updateResult.success) {
          this.props.updateOwnProfile({
            private: updateResult.data.private
          });
        }
      }
    );
  };

  calculateAndSetTime = () => {
    const { myData } = this.props;
    const currentMoment = moment();
    const snoozeEndTme = moment.unix(myData.privateExpiresAt);
    const fulfilled = snoozeEndTme.isSameOrAfter();
    const snoozeRemainingTimeInDays = snoozeEndTme.diff(currentMoment, "days");
    console.log(" snoozemodel card time is ", snoozeRemainingTimeInDays);
    if (snoozeRemainingTimeInDays < 1) {
      console.log(
        "  snoozemodel went inside first one ",
        snoozeRemainingTimeInDays,
        1,
        snoozeRemainingTimeInDays < 1
      );
      const snoozeRemainingTimeInHours = snoozeEndTme.diff(
        currentMoment,
        "hours"
      );
      console.log("  snoozemodel hours result is ", snoozeRemainingTimeInHours);
      this.setState({
        snoozeRemainingTime: `${snoozeRemainingTimeInHours} hours `
      });
    } else if (snoozeRemainingTimeInDays > 7) {
      this.setState({
        snoozeRemainingTime: ""
      });
    } else {
      this.setState({
        snoozeRemainingTime: `${snoozeRemainingTimeInDays} days`
      });
    }
  };
  componentDidMount = () => {
    this.calculateAndSetTime();
    this.interval = setInterval(() => {
      this.calculateAndSetTime();
    }, 60000);
  };
  render() {
    const { snoozeRemainingTime } = this.state;
    return (
      <View style={styles.container}>
        <RegularText style={styles.contentText}>
          You’re currently in snooze mode for {snoozeRemainingTime} more. {"\n"}{" "}
          Make yourself visible.
        </RegularText>

        <NoFeedbackTapView onPress={this.makePublic}>
          <HorizontalGradientView
            colors={[PURPLE, LIGHT_PURPLE]}
            style={styles.btnGradient}
          >
            <RegularText style={styles.btnText}>
              Make me visible now
            </RegularText>
          </HorizontalGradientView>
        </NoFeedbackTapView>
      </View>
    );
  }
}

const mapState = state => {
  return {
    myData: state.info.userInfo
  };
};

const mapDispatch = dispatch => {
  return {
    updateOwnProfile: bindActionCreators(updateOwnProfile, dispatch)
  };
};

export default connect(mapState, mapDispatch)(SnoozeModeCard);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    justifyContent: "center",
    alignItems: "center"
  },
  contentText: {
    fontSize: 18,
    textAlign: "center",
    color: FONT_GREY,
    marginBottom: 48
  },
  btnGradient: {
    paddingVertical: 16,
    width: DeviceWidth * 0.8,
    borderRadius: 25
  },
  btnText: {
    fontSize: 16,
    textAlign: "center",
    color: WHITE
  }
});
