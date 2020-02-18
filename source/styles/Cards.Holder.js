import { StyleSheet } from "react-native";
import { FONT_BLACK } from "../config/Colors";
import { sharedStyles } from "./Shared";
import { DeviceWidth, DeviceHeight } from "../config/Device";

const styles = StyleSheet.create({
  fadingText: {
    color: FONT_BLACK,
    fontSize: 15,
    paddingHorizontal: 5,
    textAlign: "center",
    fontFamily: "Proxima Nova",
    transform: [
      {
        translateY: 20
      }
    ]
  },
  activeText: {
    color: "#fff",
    fontSize: 14,
    paddingHorizontal: 10
  },
  activeBadge: {
    paddingVertical: 5,

    backgroundColor: "#FF2D55",
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 15,
    top: 0,
    left: 0,
    position: "absolute",
    ...sharedStyles.justifiedCenter
  },
  bgIconsView: {
    position: "absolute",
    opacity: 0.7,
    zIndex: -1,
    left: -DeviceWidth * 0.4,
    bottom: 0
  },
  tabText: {
    fontSize: 18,
    textAlign: "center"
  },
  tabTappableView: {
    height: 30,
    width: DeviceWidth * 0.39,
    justifyContent: "center",
    borderRightColor: "#cfcfcf",
    marginTop: 3,
    flexDirection: "row",
    alignItems: "center"
  },
  topItemsContainer: {
    height: 35,
    width: DeviceWidth * 0.8,
    alignSelf: "center",
    borderRadius: 8,
    backgroundColor: "rgb(238,238,238)",
    justifyContent: "center",
    marginBottom: 10
  },
  swipeTabLayout: {
    width: DeviceWidth * 0.408,
    height: 30,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: DeviceWidth * 0.005,
    position: "absolute",
    zIndex: -1,
    shadowColor: "rgba(0,0,0,0.5)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3
  },
  submitButtonView: {
    height: 50,
    width: DeviceWidth * 0.8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30
  },
  questionTextBig: {
    fontSize: 26,
    color: "#1E2432",
    fontWeight: "700",
    marginVertical: 10,
    textAlign: "center"
  },
  avatarImage: {
    height: 80,
    width: 80,
    borderRadius: 40,
    marginTop: -40,
    alignSelf: "center",
    backgroundColor: "#fff",
    shadowColor: `#000`,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    alignItems: "center",
    justifyContent: "center"
  },
  questionLayoutBig: {
    flexDirection: "column",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 10,
    transform: [{ translateY: DeviceHeight * 0.06 }], // height of the top elementsContainer
    marginHorizontal: 20,
    shadowColor: `#000`,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    minWidth: DeviceWidth * 0.85
  },
  pickLimitText: {
    textAlign: "center",
    color: "#FFFFFF",
    fontWeight: "500",
    paddingVertical: 10,
    paddingHorizontal: 20
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
  },
  cloudIcon: {
    marginTop: 20,
    marginLeft: 15
  },
  refreshIcon: {
    marginTop: 25,
    marginRight: 15
  },
  gameName: {
    textAlign: "center",
    color: "#fff",
    fontSize: 23
  },
  gameCardView: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  },
  optionView: {
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    marginVertical: 15,
    marginHorizontal: 20,
    fontWeight: "200"
  }
});

export default styles;
