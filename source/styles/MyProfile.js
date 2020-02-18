import { StyleSheet, Dimensions } from "react-native";
import {
  FONT_GREY,
  NEW_GREY,
  BLUE_PRIMARY,
  FONT_BLACK
} from "../config/Colors";
import { CARD_WIDTH, IMAGE_HEIGHT, LEFT_MARGIN } from "../config/Constants";
const { width: DeviceWidth, height: DeviceHeight } = Dimensions.get("window");
export const styles = StyleSheet.create({
  cardsHeaderText: {
    color: "rgb(30,36,50)",
    fontSize: 20,
    marginBottom: 5
  },
  editPostIcon: {
    alignSelf: "center",
    backgroundColor: "#fff",
    alignItems: "center",
    shadowColor: "#cacaca00",
    shadowOffset: {
      height: 0,
      width: 0
    },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    height: 40,
    width: 40,
    borderRadius: 20,
    marginTop: -30,
    justifyContent: "center",
    borderWidth: 0.5,
    borderColor: "#cacaca",
    marginBottom: 5
  },
  cardDescText: {
    alignSelf: "center",
    transform: [{ translateY: 5 }],
    fontSize: 16,
    paddingHorizontal: 20,
    textAlign: "center"
  },
  profileSparkText: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 20
  },
  topCard: {
    flex: 1,
    shadowOffset: { width: 0, height: 3 },
    shadowColor: "#00000029",
    transform: [{ translateY: 10 }],
    // marginBottom: -60,
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  userFieldName: {
    fontSize: 14,
    color: "#9B9B9B"
  },
  userInfoText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E2432"
  },
  rightIconView: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-end"
  },
  userInfoLayout: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderColor: FONT_GREY,
    borderRadius: 20,
    borderWidth: 0.5,
    marginTop: 20,
    // marginHorizontal: 20,
    flex: 1,
    justifyContent: "flex-start",
    flexDirection: "row"
  },
  userInfoView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start"
  },
  userImageMainView: {
    marginTop: 15,
    height: IMAGE_HEIGHT * 0.35
  },

  instagramView: {
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 14,
    flex: 1
  },
  instagramText: {
    fontSize: 22,
    fontWeight: "600",
    paddingLeft: 10
  },

  closingBar: {
    height: 5,
    borderRadius: 30,
    alignSelf: "center",
    backgroundColor: "#fff",
    width: 50,
    transform: [{ translateY: -10 }]
  },
  instaLayout: {
    alignItems: "center",
    paddingHorizontal: 10
  },
  instaButtonView: {
    width: "82%",
    marginVertical: 10,
    alignSelf: "center",
    borderRadius: 25,
    overflow: "hidden",
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25
  },
  instaView: {
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    flexDirection: "row",
    paddingHorizontal: 20,
    justifyContent: "space-between",
    alignItems: "center"
  },
  instaText: {
    padding: 10,
    color: "white",
    fontSize: 18,
    fontWeight: "500"
  },
  userImageView: {
    alignSelf: "flex-end",
    padding: 5,
    transform: [{ translateX: 5 }, { translateY: 5 }],
    borderRadius: 30,
    borderWidth: 0.8,
    borderColor: "#cacaca",
    backgroundColor: "#ffffff",
    zIndex: 2,
    position: "absolute",
    bottom: -2.5,
    right: -2.5
  },
  userImage: {
    flex: 1,
    aspectRatio: CARD_WIDTH / IMAGE_HEIGHT,
    borderRadius: 20,
    backgroundColor: "rgb(235,235,235)"
  },
  nameText: {
    fontSize: 22,
    textAlign: "center"
  },
  placeTextView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // marginTop: -12,
    marginBottom: 10
  },
  placeText: {
    fontSize: 18,
    paddingHorizontal: 5
  },
  ProgressBarViewStack: {
    flex: 1,
    justifyContent: "center",
    marginTop: 10
    // height: DeviceHeight * 0.18
  },
  gemCount: {
    color: "#4E586E",
    paddingHorizontal: 2,
    fontSize: 16
  },
  gemView: {
    height: 28,
    backgroundColor: "rgb(240,240,255)",
    borderRadius: 215,
    marginLeft: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15
  },
  settingsIcon: {
    height: 26,
    width: 26,
    borderRadius: 13,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateX: -5 }],
    marginLeft: -30
  },
  rightTopIconView: {
    width: DeviceWidth * 0.2,
    flexDirection: "row",
    justifyContent: "center",
    marginRight: 10
  },
  headerText: {
    fontSize: 24,
    color: FONT_BLACK
  },
  topHeaderSubView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  topHeaderMainView: {
    flexDirection: "row",
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 0
  },
  completeProfileText: {
    textAlign: "center",
    paddingHorizontal: 15,
    fontSize: 16,
    color: FONT_GREY,
    transform: [{ translateY: 15 }]
  },
  gradientView: {
    height: DeviceHeight * 0.32,
    width: DeviceWidth,
    backgroundColor: "#0000",
    position: "absolute",
    transform: [{ translateY: DeviceHeight * 0 }]
  },
  cardView: {
    height: DeviceHeight * 1,
    width: DeviceWidth,
    backgroundColor: "rgb(242, 243, 246)",
    position: "absolute"
    // transform: [{ translateY: 100 }]
  },
  arrowIcon: {
    marginTop: 2
  },
  arrowIconView: {
    position: "absolute",
    bottom: DeviceHeight * 0.05,
    left: DeviceWidth * 0.05,
    backgroundColor: "#fff",
    borderRadius: 25,
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "rgba(0,0,0,0.3)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    zIndex: 2
  },
  verifyButtonView: {
    // marginHorizontal: 20,
    marginVertical: 10,
    marginHorizontal: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: BLUE_PRIMARY,
    marginVertical: LEFT_MARGIN / 2
  },
  verifyButtonText: {
    fontWeight: "600",
    fontSize: 18,
    color: "#ffffff"
  },
  chunkView: {
    marginLeft: 20
  },
  chunkText: {
    fontSize: 20,
    fontWeight: "600"
  },

  aboutMeView: {
    marginLeft: 20
  },

  userInput: {
    paddingTop: LEFT_MARGIN / 2,
    paddingHorizontal: 0,
    marginHorizontal: LEFT_MARGIN / 2,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    height: 120,
    fontSize: 16,
    fontFamily: "Proxima Nova",
    lineHeight: 25
  },
  picGridView: {
    flex: 1,
    marginTop: 20,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "flex-start"
  }
});
