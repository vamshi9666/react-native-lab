import { StyleSheet, Platform } from "react-native";
import { FONT_BLACK } from "../config/Colors";
import { DeviceWidth, DeviceHeight } from "../../src/config/Device";
import { LEFT_MARGIN, CARD_WIDTH, IMAGE_HEIGHT } from "../config/Constants";
const SCROLL_HOLDER_HEIGHT_FACTOR = 0.15;
const { OS } = Platform;

export const styles = StyleSheet.create({
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
  },
  userNotificationImage: {
    marginHorizontal: 15,
    backgroundColor: "#fff"
  },
  sparkNofeedbackButtonView: {
    zIndex: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    shadowColor: "#000000A0",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 3
    },
    position: "absolute"
  },
  sparkImageView: {
    height: 25,
    width: 25,
    backgroundColor: "#fff",
    borderRadius: 12.5
  },
  sparkImage: {
    height: 15,
    width: 15,
    backgroundColor: "#fff",
    alignSelf: "center"
  },
  notificationTitle: {
    color: FONT_BLACK,
    fontSize: 18
  },
  notificationText: {
    color: FONT_BLACK,
    fontSize: 16,
    marginTop: 2.5
  },
  tickIcon: {
    marginTop: 2,
    marginLeft: 0.5
  },
  topHeader: {
    height: 50,
    width: DeviceWidth,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20
  },
  sparkButtonView: {
    position: "absolute",
    right: 20,
    bottom: DeviceHeight * 0.2 - 25,
    zIndex: 2,
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    backgroundColor: "#fff",
    shadowColor: "#000000A0",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 3
    }
  },
  inappNotificationContainer: {
    flexDirection: "row",
    width: DeviceWidth * 0.95,
    height: 70,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "rgb(255,255,255)",
    position: "absolute",
    zIndex: 100,
    // top: 0,
    elevation: 10,
    shadowColor: "#000000A0",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 3
    }
  },
  iconsView: {
    width: DeviceWidth / 3,
    backgroundColor: "#0000",
    marginTop: DeviceHeight > 700 ? -10 : 0
  },
  iconStyle: {
    height: 22,
    width: 24,
    alignSelf: "center"
  },
  chatIcon: {
    zIndex: 0,
    textAlign: "left",
    marginLeft: 8,
    marginTop: 5
  },
  chatIconView: {
    backgroundColor: "#fff",
    justifyContent: "center",
    width: 45,
    borderRadius: 22.5,
    height: 45,
    marginLeft: 20,
    marginTop: 10,
    elevation: 10,
    shadowColor: "#000000A0",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 3
    }
  },
  circleIcon: {
    zIndex: 0,
    textAlign: "center",
    marginTop: 5
  },
  userIcon: {
    zIndex: 0,
    textAlign: "right",
    marginRight: 10,
    marginTop: 5
  },
  userIconView: {
    backgroundColor: "#fff",
    justifyContent: "center",
    width: 45,
    borderRadius: 22.5,
    height: 45,
    alignSelf: "flex-end",
    marginRight: 20,
    marginTop: 10,
    shadowColor: "#000000A0",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 3
    },
    elevation: 10
  },
  scrollIndicator: {
    width: 5,
    borderRadius: 20,
    backgroundColor: "rgb(255,255,255)"
  },
  scrollHolder: {
    height: DeviceHeight * SCROLL_HOLDER_HEIGHT_FACTOR,
    width: 5,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.3)",
    position: "absolute",
    right: 10,
    top: 20,
    zIndex: 1
  },
  carousalStyle: {
    marginTop: DeviceHeight * 0.05,
    marginLeft: -DeviceWidth * 0.005,
    height: DeviceHeight
  },
  userName: {
    fontSize: 25,
    marginLeft: LEFT_MARGIN,
    color: "#fff"
  },
  bottomCardView: {
    height: DeviceHeight * 0.2,
    width: CARD_WIDTH,
    backgroundColor: "rgb(252, 252, 255)",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15
  },
  imageView: {
    height: IMAGE_HEIGHT,
    backgroundColor: "#00000012"
  },
  cardLayout: {
    height: DeviceHeight * 0.2 + IMAGE_HEIGHT,
    width: CARD_WIDTH,
    borderRadius: 15,
    overflow: OS === "ios" ? "visible" : "hidden",
    elevation: 3,
    shadowColor: "#000000A0",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2
    }
  },
  baseLayout: {
    backgroundColor: "#fff",
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
