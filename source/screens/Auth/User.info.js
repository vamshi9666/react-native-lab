import CollegeInput from "../../components/Auth/College.input";
import DobInput from "../../components/Auth/DOB.input";
import React, { Component } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
  ActivityIndicator
} from "react-native";
import { Bar as ProgressBar } from "react-native-progress";
import Ionicon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import CloseButton from "../../components/Auth/Close.Button";
import NoFeedbackTapView from "../../components/Views/NoFeedbackTapView";
import EmailInput from "../../components/Auth/Email.input";
import GenderInput from "../../components/Auth/Gender.input";
import NameInput from "../../components/Auth/Name.input";
import ProfilePicture from "../../components/Auth/ProfilePicture.input";
import { DeviceHeight, DeviceWidth } from "../../config/Device";
import * as userActions from "../../redux/actions/user.info";
// import { PURPLE } from "../../../src/config/Colors";
import * as authApi from "../../network/auth";
import { PURPLE } from "../../config/Colors";
// import { storeData, retrieveData } from "../../../src/config/Storage";
import { storeData, retrieveData } from "../../config/Storage";
import { validateEmail } from "../../../src/config/Utils";
import { setUserState } from "../../redux/actions/userstate";
import { USER_STATES } from "../../config/Constants";

const images = [
  // size ratio of below images: 1140 * 940
  require("../../assets/images/blue_wave.png"),
  require("../../assets/images/green_wave.png"),
  require("../../assets/images/purple_wave.png"),
  require("../../assets/images/yellow_wave.png"),
  require("../../assets/images/skyblue_wave.png"),
  require("../../assets/images/red_wave.png")
];

const buttonColors = [
  "#39D1E8",
  "#00E0A7",
  PURPLE,
  "#FFA800",
  "#6762FF",
  "#FF2D55"
];

class UserInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curentScrollIndex: 1,
      buttonActive: false,
      keyboardShown: false,
      nameInputEnabled: true,
      dobInputEnabled: true,
      btnLoading: false
    };
    this.scrollRef = React.createRef();
    this._keyboardDidHide = this._keyboardDidHide.bind(this);
  }

  componentWillUnmount = () => {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  };

  _keyboardDidHide = () => {
    this.setState({ keyboardShown: false });
  };

  _keyboardDidShow = () => {
    this.setState({ keyboardShown: true });
  };

  componentDidMount = () => {
    this.listenToKeyboardEvents();
    // firebase.logEvent("login7_name_input_did_mount");
  };

  signUp = async cb => {
    const {
      userInfo: {
        name,
        date_of_birth,
        gender,
        college,
        mobile_number,
        email,
        showName,
        showGender
      },
      addUserInfo
    } = this.props;
    let data = {
      name,
      date_of_birth,
      gender,
      college,
      mobile_number,
      email,
      showName,
      showGender
    };
    const existing_auth_token = await retrieveData("AUTH_TOKEN");
    if (existing_auth_token) {
      console.log(" case 0 ", await retrieveData("AUTH_TOKEN"));
      return cb(true);
    }
    this.setState({
      btnLoading: true
    });
    authApi.SignUp(data, signUpdata => {
      // alert(JSON.stringify(signUpdata));
      if (signUpdata.success) {
        console.log("signUpdata is:", signUpdata);
        addUserInfo("_id", signUpdata.data.userId);
        addUserInfo("authToken", signUpdata.data.token);
        storeData("AUTH_TOKEN", signUpdata.data.token);
        cb(true);
      } else {
        alert("Something went wrong open console");
      }
      this.setState({
        btnLoading: false
      });
    });
  };

  uploadImage = cb => {
    const {
      userInfo: { images, name },
      addUserInfo
    } = this.props;
    let hasLocalImages = true;
    images.forEach(image => {
      hasLocalImages = hasLocalImages && image.split("/")[0] !== "uploads";
    });
    if (!hasLocalImages) {
      return cb(true);
    }
    let data = new FormData();

    data.append("image", {
      uri: images[0],
      type: "image/png",
      name
    });
    authApi.uploadImage(data, cbData => {
      console.log("cbData after uploading image is: ", cbData);
      if (cbData.success) {
        // if (cbData.data.valid) {
        cb(true);
        addUserInfo("images", [cbData.data.image.path]);
        // } else {
        //   // addUserInfo("images", [cbData.data.image.path]);

        //   // cb(true);
        //   alert(
        //     "The picture you just uploaded is not valid. Please check our picture policy"
        //   );
        //   this.setState({
        //     btnLoading: false
        //   });
        // }
      } else {
        alert("Something went wrong while uploading image " + cbData);
        this.setState({
          btnLoading: false
        });
      }
    });
  };

  handlePrevious = () => {
    const { curentScrollIndex } = this.state;
    if (curentScrollIndex !== 1) {
      this.scrollRef.scrollTo({ x: (curentScrollIndex - 2) * DeviceWidth });
      this.setState({ curentScrollIndex: curentScrollIndex - 1 });
    } else {
      this.props.navigation.goBack();
    }
  };

  updateUserProfile = cb => {
    const { userInfo } = this.props;
    authApi.updateProfile({ ...userInfo }, cbData => {
      if (cbData.success) {
        storeData("LOGGED_IN", "true");
        cb(true);
      }
    });
  };

  handleScroll = curentScrollIndex => {
    this.scrollRef.scrollTo({ x: curentScrollIndex * DeviceWidth });
    this.setState({ curentScrollIndex: curentScrollIndex + 1 });
  };

  handleNext = () => {
    Keyboard.dismiss();
    const { curentScrollIndex } = this.state;
    if (curentScrollIndex === 1) {
      this.setState({
        nameInputEnabled: false
      });
    }
    if (curentScrollIndex === 2) {
      this.setState({
        dobInputEnabled: false
      });
    }
    if (curentScrollIndex === 4) {
      //college input
      this.signUp(createdAccount => {
        if (createdAccount) {
          this.handleScroll(curentScrollIndex);
        }
      });
    } else if (curentScrollIndex === 5) {
      this.setState({
        btnLoading: true
      });
      this.uploadImage(uploaded => {
        if (uploaded) {
          this.handleScroll(curentScrollIndex);
          this.setState({
            btnLoading: false
          });
        }
      });
    } else if (curentScrollIndex === 6) {
      this.setState({
        btnLoading: true
      });
      const emailVerified =
        this.props.userInfo.email === "" ||
        this.props.userInfo.email === undefined ||
        this.props.userInfo.email === null ||
        validateEmail(this.props.userInfo.email);

      if (!emailVerified) {
        alert(" email is not valid");
        this.setState({
          btnLoading: false
        });
        return;
      }
      this.updateUserProfile(updated => {
        this.props.setUserState(USER_STATES.NEW_USER);
        if (updated) {
          this.props.navigation.navigate("splash", {
            type: "SIGNUP"
          });
        }
      });
    } else {
      this.handleScroll(curentScrollIndex);
    }
  };

  setButtonState = cond => {
    this.setState({ buttonActive: cond });
  };

  writeData = name => {
    this.setState({ name });
  };

  listenToKeyboardEvents = () => {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );
  };

  render() {
    const {
      curentScrollIndex,
      keyboardShown,
      nameInputEnabled,
      dobInputEnabled,
      btnLoading
    } = this.state;
    const { userInfo } = this.props;
    const buttonActive =
      (curentScrollIndex === 1 &&
        userInfo.name !== null &&
        userInfo.name !== "") ||
      (curentScrollIndex === 2 && userInfo.gender !== null) ||
      (curentScrollIndex === 3 && userInfo.date_of_birth !== null) ||
      curentScrollIndex === 4 ||
      (curentScrollIndex === 5 && userInfo.images !== null) ||
      curentScrollIndex === 6;
    const existingImage =
      userInfo !== null && userInfo.images && userInfo.images.length > 0
        ? userInfo.images[0]
        : null;
    console.log(" image error 0 >>>", existingImage);
    return (
      <View style={{ flex: 1, paddingTop: Platform.OS === "ios" ? 10 : 0 }}>
        <CloseButton iconName={"ios-arrow-back"} action={this.handlePrevious} />
        <ProgressBar
          style={{
            alignSelf: "center",
            borderRadius: 5,
            marginTop: 20
          }}
          borderWidth={1}
          borderColor={"#0000"}
          unfilledColor={"#E4E5EA"}
          color={"#4E586E"}
          progress={curentScrollIndex / 6}
          width={DeviceWidth * 0.8}
          height={8}
          borderRadius={10}
        />
        <ScrollView
          scrollEnabled={false}
          ref={ref => (this.scrollRef = ref)}
          // contentOffset={{ x: DeviceWidth * curentScrollIndex }}
          style={{
            height: DeviceHeight * 0.5,
            zIndex: 9999
          }}
          horizontal
        >
          <View
            style={{
              width: DeviceWidth
            }}
          >
            <NameInput
              inputEnabled={nameInputEnabled}
              keyboardShown={keyboardShown}
            />
          </View>
          <View
            style={{
              width: DeviceWidth
            }}
          >
            <GenderInput />
          </View>
          <View
            style={{
              width: DeviceWidth
            }}
          >
            <DobInput
              inputEnabled={dobInputEnabled}
              handleNext={this.handleNext}
            />
          </View>
          <View
            style={{
              width: DeviceWidth
            }}
          >
            <CollegeInput handleNext={this.handleNext} />
          </View>
          <View
            style={{
              width: DeviceWidth
            }}
          >
            <ProfilePicture existingImage={existingImage || ""} />
          </View>
          <View
            style={{
              width: DeviceWidth
            }}
          >
            <EmailInput handleNext={this.handleNext} />
          </View>
        </ScrollView>

        <KeyboardAvoidingView
          style={{
            position: "absolute",
            right: 20,
            bottom: 20,
            zIndex: 99999
          }}
          behavior={"position"}
        >
          <NoFeedbackTapView
            onPress={this.handleNext}
            disabled={!buttonActive && btnLoading}
            style={{
              height: 60,
              width: 60,
              borderRadius: 30,
              backgroundColor: buttonActive ? "#fff" : "#E4E5EA",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 3
              },
              shadowOpacity: buttonActive ? 0.1 : 0
            }}
          >
            {btnLoading ? (
              <ActivityIndicator size={"small"} />
            ) : (
              <Ionicon
                name={"md-arrow-round-forward"}
                size={35}
                color={
                  buttonActive ? buttonColors[curentScrollIndex - 1] : "#acacac"
                }
              />
            )}
          </NoFeedbackTapView>

          <View
            style={{
              height: 10
            }}
          />
        </KeyboardAvoidingView>

        <Image
          resizeMode={"contain"}
          style={{
            width: DeviceWidth,
            position: "absolute",
            top: DeviceHeight * 0.3
          }}
          source={images[curentScrollIndex - 1]}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    userInfo: state.info.userInfo
  };
};
const mapDispatchToProps = dispatch => ({
  addUserInfo: bindActionCreators(userActions.addUserInfo, dispatch),
  setUserState: bindActionCreators(setUserState, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo);
