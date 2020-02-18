import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager
} from "react-native-fbsdk";
import { TouchableOpacity } from "react-native-gesture-handler";
import LinearGradient from "react-native-linear-gradient";
import Ionicon from "react-native-vector-icons/Ionicons";
import MatComIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Clickable from "../../components/Texts/ClickableText";
import SimpleRowView from "../../components/Views/RowView";
import { greyTheme, LIGHT_PURPLE, PURPLE } from "../../config/Colors";
import { DeviceWidth, DeviceHeight } from "../../config/Device";
import { setMultiple, storeData } from "./../../config/Storage";
import { FONT_BLACK } from "../../../src/config/Colors";
import BoldText from "../../components/Texts/BoldText";
import RegularText from "../../components/Texts/RegularText";
import MediumText from "../../components/Texts/MediumText";
import { sharedStyles } from "../../styles/Shared";

let fbAccessToken;
class FbLogin extends React.Component {
  static navigationOptions = {
    header: null,
    headerLeft: (
      <Ionicon
        style={{ marginLeft: 30, marginTop: 30 }}
        size={30}
        name={"ios-arrow-back"}
        color={"white"}
      />
    )
  };
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      name: "",
      gender: "",
      mobile_number: "",
      date_of_birth: null,
      isLoading: false,
      imageResponse: null
    };
    this.instagramLogin = React.createRef();
  }

  facebookSignina = () => {
    this.instagramLogin.show();
  };
  _responseInfoCallback = async (error, result) => {
    console.log(" result is :::", result);
    if (error) {
      console.log("Error fetching data: ", error);
    } else if (
      result.first_name &&
      result.gender &&
      result.birthday &&
      result.email
    ) {
      this.props
        .facebookLogin({ ...result, fb_token: fbAccessToken })
        .then(() => {
          const { facebookLoginResult } = this.props;
          console.log(" facebook login result is :::", facebookLoginResult);
          if (facebookLoginResult.success) {
            setMultiple([
              ["AUTH_TOKEN", facebookLoginResult.data.token],
              ["USER_ID", facebookLoginResult.data.userId]
            ]).then(() => {
              this.props.navigation.navigate("Landing");
            });
          }
        });
    } else {
      alert("facebook sign in error ");
    }
  };
  facebookSignin = () => {
    LoginManager.logInWithReadPermissions([
      "public_profile",
      "email",
      "user_gender"
    ]).then(async result => {
      console.log(" facebook result is: ", result);
      if (result.isCancelled) {
      } else {
        AccessToken.getCurrentAccessToken().then(data => {
          console.log("Data is: ", data);
          fbAccessToken = data.accessToken;
          const infoRequest = new GraphRequest(
            "/me?",
            {
              accessToken: data.accessToken,
              parameters: {
                fields: {
                  string: "id,gender,birthday,first_name,email"
                }
              }
            },

            this._responseInfoCallback
          );
          new GraphRequestManager().addRequest(infoRequest).start();
        });
      }
    });
  };

  loginViaMobile = () => {
    // firebase.logEvent("login1_");
    this.props.navigation.navigate("mobile");
    // this.instagramLogin.show();
    // this.props.navigation.navigate("Landing");
  };
  onInstagramSuccess = async token => {
    console.log("insta token: ", token);
    await storeData("INSTAGRAM_TOKEN", token);
    this.props.navigation.navigate("MobileInput");
  };
  componentDidMount = () => {
    // firebase.logEvent("login0_welcome_did_mount");
  };

  render() {
    return (
      <View style={styles.baseLayout}>
        <View style={styles.logoTextView}>
          <Image
            resizeMode={"contain"}
            source={require("../../assets/images/Applogo.png")}
          />
          <BoldText style={styles.logoText}>Closer</BoldText>
        </View>

        <View style={styles.bottomView}>
          <View>
            <TouchableOpacity
              onPress={this.facebookSignin}
              style={{
                width: DeviceWidth * 0.8,
                height: 50,
                backgroundColor: "#fff",
                borderRadius: 25,
                flexDirection: "row",
                shadowOffset: {
                  width: 0,
                  height: 1
                },
                shadowColor: "#000",
                shadowOpacity: 0.2,
                shadowRadius: 10,
                margin: 10,
                transform: [
                  {
                    translateY: -10
                  }
                ],
                ...sharedStyles.justifiedCenter
              }}
            >
              <MatComIcon
                style={{ position: "absolute", left: 20 }}
                name="facebook"
                size={24}
                color={"#4169E1"}
              />
              <MediumText
                style={{
                  fontSize: 18,
                  color: "#3D2E71",
                  textAlign: "center",
                  alignSelf: "center"
                }}
              >
                Login with Facebook
              </MediumText>
            </TouchableOpacity>
            <Clickable
              textStyles={{
                fontSize: 15
              }}
              styles={{
                transform: [
                  {
                    translateY: -10
                  }
                ]
              }}
              action={() => this.loginViaMobile()}
              text={"Use another option"}
            />
          </View>

          <View style={styles.bottomMostView}>
            <RegularText style={styles.dontWorryText}>
              Dont worry! We never post on Facebook
            </RegularText>
            <SimpleRowView style={{ marginTop: 10 }}>
              <RegularText
                style={{ textAlign: "center", color: greyTheme, fontSize: 11 }}
              >
                I Accept{" "}
              </RegularText>
              <RegularText
                style={{
                  textDecorationLine: "underline",
                  color: greyTheme,
                  fontSize: 11
                }}
              >
                {" "}
                Terms & Conditions
              </RegularText>
            </SimpleRowView>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  baseLayout: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#0000"
  },
  dontWorryText: {
    textAlign: "center",
    color: greyTheme,
    fontSize: 11
  },
  logoTextView: {
    height: DeviceHeight * 0.425,
    alignItems: "center",
    justifyContent: "flex-end"
  },
  logoText: {
    fontSize: 50,
    color: FONT_BLACK
  },
  bottomView: {
    alignItems: "center",
    justifyContent: "flex-end",
    height: DeviceHeight * 0.3,
    transform: [
      {
        translateY: -DeviceHeight * 0.075
      }
    ]
  },
  bottomMostView: {
    alignItems: "center",
    transform: [{ translateY: 0 }]
  }
});

export default FbLogin;
