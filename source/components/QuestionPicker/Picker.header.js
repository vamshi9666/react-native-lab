import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet
} from "react-native";
import Ionicon from "react-native-vector-icons/Ionicons";
import RowView from "../Views/RowView";
import { DeviceHeight, DeviceWidth } from "../../config/Device";
import BoldText from "../Texts/BoldText";
import SvgUri from "react-native-svg-uri";
import { sharedStyles } from "../../styles/Shared";
import { REFRESH_ICONS, GAME_LOGOS } from "../../config/Constants";
import { connect } from "react-redux";

const INTERVAL = 86400;

class PickerHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let {
      item,
      optionViewMode,
      currentChatScreenIndex,
      refreshLoading,
      showReplaceableQuestions,
      closeOptionViewMode,
      toggleQuestionPicker
    } = this.props;

    const { refreshedAt, tappedCount, refreshRevealed } = this.state;
    const currentTime = Math.round(Date.now() / 1000);

    let refreshEnabled = false;
    const timeValid = refreshedAt + INTERVAL < currentTime;
    if (currentChatScreenIndex === 0) {
      if (tappedCount === 0 || timeValid) {
        refreshEnabled = true;
      }
    } else {
      if (
        tappedCount === 0 ||
        tappedCount === 1 ||
        timeValid
        // refreshRevealed
      ) {
        refreshEnabled = true;
      }
    }
    if (refreshRevealed) {
      refreshEnabled = false;
    }

    const showBigIcon =
      item.value === "BLUFF_OR_TRUTH" ||
      item.value === "SIMILARITIES" ||
      item.value === "GUESS_THE_CELEB" ||
      item.value === "THE_PERFECT_GIF" ||
      item.value === "TWO_TRUTHS_AND_A_LIE";
    const showVeryBigIcon =
      item.value === "KISS_MARRY_KILL" || item.value === "NEVER_HAVE_I_EVER";

    const hasMoreTopMargin = item.value === "KISS_MARRY_KILL";

    return (
      <>
        {optionViewMode ? (
          <RowView
            style={{
              justifyContent: "space-between"
            }}
          >
            <TouchableOpacity
              onPress={() => {
                closeOptionViewMode(false);
              }}
              style={{ width: 60 }}
            >
              <Ionicon
                style={styles.cloudIcon}
                name={"ios-arrow-dropleft-circle"}
                size={40}
                color={"#fff"}
              />
            </TouchableOpacity>
            <View
              style={{
                height: DeviceHeight * 0.125,
                alignItems: "flex-start",
                justifyContent: "center"
              }}
            >
              <BoldText
                style={{
                  ...styles.gameName
                }}
              >
                {" "}
                {item.key}
              </BoldText>
            </View>
            <TouchableOpacity
              onPress={() => {
                toggleQuestionPicker();
                setTimeout(() => {
                  closeOptionViewMode(false);
                }, 200);
              }}
              style={{ width: 60 }}
            >
              <Ionicon
                style={styles.cloudIcon}
                name={"ios-close-circle"}
                size={40}
                color={"#fff"}
              />
            </TouchableOpacity>
          </RowView>
        ) : (
          <View style={styles.topItemRow}>
            <RowView style={styles.nameIconView}>
              <View
                style={{
                  marginTop: hasMoreTopMargin ? 15 : 0,
                  opacity: 1
                }}
              >
                <SvgUri
                  height={showVeryBigIcon ? 55 : showBigIcon ? 45 : 35}
                  width={showVeryBigIcon ? 55 : showBigIcon ? 45 : 35}
                  source={GAME_LOGOS[item.value]}
                />
              </View>
              <BoldText
                style={{
                  ...styles.gameName,
                  transform: [
                    { translateY: 2 },
                    { translateX: item.value === "BLUFF_OR_TRUTH" ? -5 : 5 }
                  ],
                  opacity: 1
                }}
              >
                {" "}
                {item.key}
              </BoldText>
            </RowView>

            {item.content ? (
              <View
                style={{
                  ...sharedStyles.justifiedCenter
                }}
              >
                {!showReplaceableQuestions && (
                  <TouchableOpacity
                    style={{
                      opacity: 1
                    }}
                    onPress={() => {
                      if (!refreshEnabled) {
                        return this.showRefreshMonitizationModal(
                          item._id,
                          refreshedAt
                        );
                      }
                      if (tappedCount === 1 && !timeValid) {
                        return this.showRefreshMonitizationModal(
                          undefined,
                          refreshedAt
                        );
                      }
                      if (refreshEnabled) {
                        this.props.refreshQuestions(item._id, () => {});
                      }
                    }}
                  >
                    {refreshLoading ? (
                      <View
                        style={{
                          height: 30,
                          width: 30,
                          borderRadius: 15,
                          backgroundColor: "#fff",
                          ...sharedStyles.justifiedCenter
                        }}
                      >
                        <ActivityIndicator size={"small"} color={"#cacaca"} />
                      </View>
                    ) : (
                      <View
                        style={{
                          height: 30,
                          width: 30,
                          borderRadius: 15,
                          shadowColor: "#000",
                          shadowOffset: { width: 1, height: 2 },
                          shadowOpacity: 0.2,
                          elevation: 1,
                          backgroundColor: "#fff",
                          ...sharedStyles.justifiedCenter
                        }}
                      >
                        <SvgUri
                          height={19}
                          width={19}
                          source={REFRESH_ICONS[item.value]}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View />
            )}
          </View>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  cloudIcon: {
    marginTop: 20,
    marginLeft: 15
  },
  gameName: {
    textAlign: "center",
    color: "#fff",
    fontSize: 23
  },
  topItemRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginHorizontal: 20,
    marginTop: 2.5
  },
  nameIconView: {
    width: DeviceWidth * 0.7,
    justifyContent: "flex-start",
    alignItems: "center",
    height: DeviceHeight * 0.125
  }
});

const mapState = state => {
  return {
    currentChatScreenIndex: state.nav.currentChatScreenIndex
  };
};

const mapDispatch = dispatch => {
  return {};
};
export default connect(mapState, mapDispatch)(PickerHeader);
