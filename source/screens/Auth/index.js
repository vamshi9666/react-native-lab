import { createStackNavigator } from "react-navigation";
import { screenConfig } from "../../config/Config";
import Welcome from "./Welcome";
import Mobile from "./Mobile";
import SignUp from "./Signup";
import Slides from "./Slides";
import Login from "./Login";
import Splash from "./Splash";
import VerifyMobile from "./Verify.mobile";
import UserInfo from "./User.info";
import appStack from "../App/index";
import TroubleLogin from "./Trouble.login";

export default createStackNavigator(
  {
    welcome: screenConfig(Welcome),
    mobile: screenConfig(Mobile),
    signup: screenConfig(SignUp),
    slides: screenConfig(Slides),
    splash: screenConfig(Splash),
    verify: screenConfig(VerifyMobile),
    userinfo: screenConfig(UserInfo),
    login: screenConfig(Login),
    troubleLogin: screenConfig(TroubleLogin),
    app: appStack
  },
  {
    initialRouteName: "slides" //slides
  }
);
