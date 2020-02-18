import { StyleSheet } from "react-native";
import { FONT_GREY, FONT_BLACK } from "../config/Colors";
import { DeviceWidth, DeviceHeight } from "../config/Device";
import { LEFT_MARGIN } from "../config/Constants";

export const styles = StyleSheet.create({
  emptyStateStyle: {
    alignItems: "center",
    marginTop: DeviceHeight * 0.1
  },
  selfClosingView: {
    position: "absolute",
    width: DeviceWidth,
    height: DeviceHeight * 0.1,
    backgroundColor: "#000",
    top: 0
  },
  showPeopleText: {
    fontSize: 16,
    color: FONT_BLACK,
    transform: [{ translateX: -20 }]
  },
  stackedRow: {
    height: 95,
    width: "30%",
    transform: [{ translateX: -LEFT_MARGIN / 2.5 }]
  },
  tappableRow: {
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row"
  },
  stackedContainer: {
    width: "90%",
    backgroundColor: "rgb(201,216,255)",
    borderRadius: 20,
    alignSelf: "center",
    marginTop: DeviceHeight * 0.025,
    elevation: 2,
    shadowColor: "rgba(0,0,0,0.2)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35
  },
  separatorDotStyle: {
    transform: [{ translateY: -4 }],
    fontSize: 16,
    color: FONT_GREY
  },
  recentMsgView: {
    marginVertical: 2,
    flexDirection: "row",
    width: DeviceWidth * 0.75 - 107,
    marginTop: 8
  },
  userNameSlot: {
    fontSize: 17,
    color: FONT_BLACK,
    marginTop: 5
  },
  userNameView: {
    height: 70,
    width: 1,
    borderRadius: 20,
    backgroundColor: "#9B9B9B30",
    alignSelf: "center",
    marginHorizontal: 15
  },
  timeText: {
    color: FONT_GREY,
    fontSize: 12,
    transform: [{ translateY: -2 }, { translateX: 3 }]
  },
  timeIconStyle: {
    paddingHorizontal: 0,
    transform: [{ translateY: -2.5 }]
  },
  timeRowStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    transform: [{ translateY: -8 }, { translateX: 3 }]
  },
  progressBarStyle: {
    position: "absolute",
    top: 10,
    left: 27
  },
  tabTappableView: {
    height: 30,
    width: DeviceWidth * 0.29,
    justifyContent: "center",
    borderRightColor: "#cfcfcf",
    marginTop: 3,
    flexDirection: "row",
    alignItems: "center"
  },
  tabText: {
    fontSize: 18,
    textAlign: "center"
  },
  baseLayout: {
    height: DeviceHeight,
    width: DeviceWidth,
    // backgroundColor: "#fff",
    backgroundColor: "rgb(242, 243, 246)"
  },
  topNavContainer: {
    height: DeviceHeight > 700 ? 100 : 90,
    width: DeviceWidth,
    alignSelf: "center",
    backgroundColor: "rgb(255,255,255)",
    alignItems: "center",
    justifyContent: "center",
    borderBottomColor: "rgb(247,247,247)",
    borderBottomWidth: 1,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10
  },
  topItemsContainer: {
    height: 35,
    width: DeviceWidth * 0.9,
    alignSelf: "center",
    borderRadius: 8,
    marginTop: DeviceHeight > 700 ? 30 : 20,
    backgroundColor: "rgb(238,238,238)",
    justifyContent: "center"
  },
  swipeTabLayout: {
    width: DeviceWidth * 0.308,
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
  bellIconCon: {
    backgroundColor: "#fff",
    borderRadius: 25,
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "rgba(0,0,0,0.3)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4
  },
  bellIcon: {
    height: 23,
    width: 22
  },
  chatItemSubLayout: {
    width: 107,
    justifyContent: "space-evenly"
  },
  chatItemLayout: {
    backgroundColor: "#fff",
    flexDirection: "row",
    width: DeviceWidth * 0.91,
    borderRadius: 20,
    alignSelf: "center",
    elevation: 2,
    shadowColor: "rgba(0,0,0,0.2)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    marginVertical: DeviceHeight * 0.015
  },
  userSlotImage: {
    transform: [{ translateX: 16 }, { translateY: -1 }],
    borderWidth: 1,
    borderColor: "#cacaca"
  },
  userImage: {
    height: 60,
    width: 60,
    borderRadius: 30,
    margin: 16
  },
  textColumnView: {
    flexDirection: "column",
    justifyContent: "space-evenly"
  },
  nameTimeRowView: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: DeviceWidth * 0.635,
    marginTop: 10
  },
  userName: {
    color: FONT_BLACK,
    fontSize: 17
  },
  timeStamp: {
    fontSize: 12,
    color: "#acb1c0",
    marginTop: -5
  },
  msgText: {
    color: FONT_GREY,
    fontSize: 16,
    transform: [{ translateY: -8 }]
  },
  unreadCountContainer: {
    position: "absolute",
    zIndex: 2,
    height: 18,
    width: 18,
    borderWidth: 1,
    borderRadius: 9
  }
});
