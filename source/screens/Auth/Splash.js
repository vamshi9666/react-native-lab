import React, { Component } from "react";
import { Image, View } from "react-native";
import Splash from "react-native-splash-screen";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getMultiple } from "../../config/Storage";
import * as IpAPI from "../../network/auth";
import * as PacksApi from "../../network/pack";
import * as UserApi from "../../network/user";
import * as appActions from "../../redux/actions/app";
import * as ContentActions from "../../redux/actions/content";
import * as QuestionActions from "../../redux/actions/questions";
import * as RoomActions from "../../redux/actions/rooms";
import * as userActions from "../../redux/actions/user.info";
import * as actionTypes from "../../redux/types/question.types";

class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTokenFound: false
    };
  }

  /******* Local storage variables Guide:
   *
   * @HAS_SEEN_TUTORIALS If not seen then start from slides.
   * @LOGGED_IN If not logged In check for Mobile Number and SignUp index
   * @MOBILE If no mobile number, then redirect to welcome screen, skip slides.
   * @SIGN_UP_INDEX Mobile number is found, then check for signUp index and navigate accordingly.
   *
   */

  getNavigationString = async () => {
    const values = await getMultiple([
      "HAS_SEEN_TUTORIALS",
      "LOGGED_IN",
      "MOBILE",
      "SIGN_UP_INDEX"
    ]);
    console.log("coming here in splash didMount 2", values);
    if (values[0][1] === null) {
      // NOT_HAS_SEEN_TUTORIALS
      return "login";
    } else if (values[1][1] === null) {
      // NOT_LOGGED_IN
      if (values[2][1] === null) {
        // MOBILE_NOT_FOUND
        return "login";
      } else {
        // SIGN_UP_INDEX
        return "signup";
      }
    } else {
      return "app";
    }
  };

  componentDidMount = async () => {
    console.log("coming here in splash didMount 1");

    const nav = await this.getNavigationString();
    const {
      navigation: {
        navigate,
        state: { params }
      }
    } = this.props;
    if (nav === "app") {
      if (params) {
        this.getMasterData(params, cb => {
          navigate(nav);
        });
      } else {
        this.getMasterData(null, cb => {
          navigate(nav);
        });
      }
    } else {
      console.log("coming here in splash didMount 3");
      navigate(nav);
      // this.getCountryByIp(cb => {
      // });
    }

    Splash.hide();
  };

  getMasterData = (params, cb) => {
    // params = {
    //   type: "SIGNIN"
    // };
    if (params) {
      UserApi.getMasterDataOnce(params.type, async oneTimeData => {
        console.log("onetime datai s: ", oneTimeData);
        if (oneTimeData.success) {
          const {
            adminProps,
            allFavs,
            allRooms,
            myData,
            allPosts,
            allReasons,
            gameNames,
            allQuestions,
            allSeenQuestions,
            allUserPacks,
            bulkPlans
          } = oneTimeData.data;

          const {
            setAdminProps,
            setAllFavouriteQuestions,
            setRooms,
            setMyData,
            setPosts,
            setReasons,
            setGameNames,
            setRoomsInArray,
            setCategoryOneQuestions,
            processAndSetQuestions,
            processAndSetPosts,
            setAllContentQuestions,
            setSeenQuestions,
            setUserPacks,
            setBulkPlans
          } = this.props;
          setAdminProps(adminProps);
          setAllFavouriteQuestions(allFavs);
          setRooms(allRooms);
          setSeenQuestions(allSeenQuestions);
          setMyData(myData);
          setUserPacks(allUserPacks);
          setBulkPlans(bulkPlans);
          await this.props.setApolloClient();
          await this.props.subscribeToAllRooms();
          await this.props.setLiveStatus(true);
          setPosts(allPosts);
          // processAndSetPosts(allPosts, allFavs);
          setReasons(allReasons);
          setGameNames(gameNames);
          setRoomsInArray(allRooms);
          setAllContentQuestions(allQuestions, allFavs, allPosts);
          // setCategoryOneQuestions(allQuestions);

          processAndSetQuestions(
            allQuestions,
            allFavs,
            allPosts,
            actionTypes.SET_CATEGORY_ONE_QUESTIONS
          );
        }
      });
    } else {
      UserApi.getMasterDataLatest(async latestData => {
        console.log(" all roooms are >>>", latestData);
        if (latestData.success) {
          const {
            adminProps,
            allFavs,
            allRooms,
            allSeenQuestions,
            allUserPacks,
            bulkPlans
          } = latestData.data;
          const {
            setAdminProps,
            setAllFavouriteQuestions,
            setRooms,
            setRoomsInArray,
            setSeenQuestions,
            setUserPacks,
            setBulkPlans
          } = this.props;
          setRoomsInArray(allRooms);
          setBulkPlans(bulkPlans);
          setAdminProps(adminProps);
          setUserPacks(allUserPacks);
          await this.props.setApolloClient();
          await this.props.subscribeToAllRooms();
          await this.props.setLiveStatus(true);
          setSeenQuestions(allSeenQuestions);
          setAllFavouriteQuestions(allFavs);
          setRooms(allRooms);
        }
      });
    }
    PacksApi.getPackPrices("ACTIVE", packsResponse => {
      if (packsResponse.success) {
        this.props.setPackPrices(packsResponse.data);
      }
      console.log(" packsResponse response is ", packsResponse);
    });
    PacksApi.getGemsPacks(gemPacks => {
      console.log(" new gem packs ", gemPacks);
      if (gemPacks.success) {
        this.props.setGemPacks(gemPacks.data);
      }
    });
    cb(null);
  };

  processRooms = rooms => {
    let processedRooms = {};
    rooms.map(room => {
      processedRooms[room._id] = room;
    });
    return processedRooms;
  };

  processQuestions = questions => {
    let allGamesQuestions = {};
    questions.map(questions => {
      allGamesQuestions[questions.gameId] = questions.questionIds;
      allGamesQuestions[questions.gameId].qIndex = questions.qIndex;
      allGamesQuestions[questions.gameId].updatedAt = questions.updatedAt;
      allGamesQuestions[questions.gameId].tappedCount = questions.tappedCount;
    });
    return allGamesQuestions;
  };

  getCountryByIp = cb => {
    const {
      addUserInfo,
      userInfo: { country }
    } = this.props;
    if (country && country.code) {
      cb(null);
    } else {
      IpAPI.IPLookup(IP => {
        console.log("IP addressis: ", IP);
        const { data } = IP;
        if (data) {
          addUserInfo("country", {
            name: data.country_name,
            cca2: data.country.toLowerCase(),
            code: data.country_calling_code.substring(
              1,
              data.country_calling_code.length
            )
          });
        }
        cb(null);
      });
    }

    // publicIP()
    //   .then(ip => {
    //     console.log(ip);

    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
  };

  render() {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          backgroundColor: "#FCFCFF"
        }}
      >
        <Image
          style={{
            height: 160,
            width: 120
          }}
          source={require("../../assets/images/brand.png")}
        />
      </View>
    );
  }
}

const mapStatetoProps = state => {
  return {
    userInfo: state.info.userInfo
  };
};

const mapDispatchToProps = dispatch => ({
  setGameNames: bindActionCreators(QuestionActions.setGameNames, dispatch),
  addUserInfo: bindActionCreators(userActions.addUserInfo, dispatch),
  setMyData: bindActionCreators(userActions.initDump, dispatch),
  setCategoryOneQuestions: bindActionCreators(
    QuestionActions.setCategoryOneQuestions,
    dispatch
  ),
  setAllFavouriteQuestions: bindActionCreators(
    QuestionActions.setAllFavouriteQuestions,
    dispatch
  ),
  setPosts: bindActionCreators(userActions.setPosts, dispatch),
  setReasons: bindActionCreators(userActions.setReasons, dispatch),
  setRooms: bindActionCreators(RoomActions.setRooms, dispatch),
  setAdminProps: bindActionCreators(appActions.setAdminProps, dispatch),
  setRoomsInArray: bindActionCreators(RoomActions.setRoomsArray, dispatch),
  processAndSetQuestions: bindActionCreators(
    QuestionActions.processAndSetQuestions,
    dispatch
  ),
  setAllContentQuestions: bindActionCreators(
    ContentActions.setQuestionsOnce,
    dispatch
  ),
  setPackPrices: bindActionCreators(appActions.setPackPrices, dispatch),
  setGemPacks: bindActionCreators(appActions.setGemPacks, dispatch),
  setApolloClient: bindActionCreators(RoomActions.setClient, dispatch),
  setAuthToken: bindActionCreators(userActions.setAuthToken, dispatch),
  subscribeToAllRooms: bindActionCreators(
    RoomActions.subscribeToAllRooms,
    dispatch
  ),
  setLiveStatus: bindActionCreators(RoomActions.setOnlineStatus, dispatch),
  setSeenQuestions: bindActionCreators(
    ContentActions.setSeenQuestions,
    dispatch
  ),
  setUserPacks: bindActionCreators(appActions.setUserPacks, dispatch),
  setBulkPlans: bindActionCreators(appActions.setBulkPlans, dispatch)
  // processAndSetPosts: bindActionCreators(
  //   userActions.processAndSetPosts,
  //   dispatch
  // )
});

export default connect(mapStatetoProps, mapDispatchToProps)(SplashScreen);
