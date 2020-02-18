import React, { Component } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ScrollView
} from "react-native";
import Ionicon from "react-native-vector-icons/Ionicons";
import Emoji from "react-native-emoji";
import { connect } from "react-redux";
import NoFeedbackTapView from "../../components/Views/NoFeedbackTapView";
import RowView from "../../components/Views/RowView";
import VerticalGradientView from "../../components/Views/VerticalGradientView";
import {
  FONT_BLACK,
  FONT_GREY,
  LIGHT_PURPLE,
  PURPLE
} from "../../config/Colors";
import { DeviceHeight, DeviceWidth } from "../../config/Device";
import * as ChatActions from "../../redux/actions/chat";
import MediumText from "../Texts/MediumText";
import RegularText from "../Texts/RegularText";
import { bindActionCreators } from "redux";
import {
  LEFT_MARGIN,
  appConstants,
  Emojis,
  msgTypes
} from "../../config/Constants";
import {
  addQuestionPostbyUser,
  deletePostMethod
} from "../../network/question";
import { replacePostInGame } from "../../redux/actions/user.info";
import SvgUri from "react-native-svg-uri";
import { ALL_EMOJIS } from "../../assets/emojis/names";

const api_key = "8haLubqqNMyU6jBeurpbo9Q2CH3QTjJx";
const items = ["GIF", "Emoticon", "Sticker"];
const keywords = ["Trending", "Happy", "Sad", "Love", "React"];

const EMOJI_SIZE = DeviceWidth * 0.125;

class GiphyPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gifs: [],
      stickers: [],
      selectedGif: null,
      query: "",
      selectedItem: "GIF",
      selectedKey: "Trending",
      isLoading: false,
      gameId: ""
    };
    this.scrollRef = React.createRef();
  }
  componentDidMount = () => {
    this.buildUrl(api_key);
    this.stickerUri(api_key);
    const { gameNames } = this.props;
    if (gameNames && gameNames.length > 0) {
      const gameId = gameNames.find(game => game.value === "THE_PERFECT_GIF")
        ._id;
      this.setState({ gameId });
    }
  };

  buildUrl = api_key => {
    let endpoint = "https://api.giphy.com/v1/gifs/trending?api_key=";
    const url = `${endpoint}${api_key}`;
    this.fetchAndRenderGifs(url);
  };

  stickerUri = api_key => {
    let endpoint = "https://api.giphy.com/v1/stickers/trending?api_key=";
    const url = `${endpoint}${api_key}`;
    this.fetchAndRenderStickers(url);
  };

  fetchAndRenderStickers = async url => {
    try {
      let response = await fetch(url);
      let gifs = await response.json();
      console.log(" first gif obj is ", gifs.data[0]);
      const gifsUrls = gifs.data.map(gif => ({ ...gif.images }));
      this.setState({ stickers: [] }, () => {
        this.setState({ stickers: gifsUrls });
      });
    } catch (e) {
      console.log(e);
    }
  };

  fetchAndRenderGifs = async url => {
    try {
      let response = await fetch(url);
      let gifs = await response.json();
      console.log(" first gif obj is ", gifs.data[0]);
      const stickersUrls = gifs.data.map(gif => ({ ...gif.images }));
      this.setState({ gifs: [] }, () => {
        this.setState({ gifs: stickersUrls });
      });
    } catch (e) {
      console.log(e);
    }
  };

  searchStickerTwo = keyword => {
    if (keyword === keywords[0]) {
      this.stickerUri(api_key);
    } else {
      let endpoint = "https://api.giphy.com/v1/stickers/search";
      let url = `${endpoint}?api_key=${api_key}&q=${keyword}&random_id=e826c9fc5c929e0d6c6d423841a282aa`;
      this.fetchAndRenderStickers(url);
    }
  };

  searchSticker = () => {
    let endpoint = "https://api.giphy.com/v1/stickers/search";
    let url = `${endpoint}?api_key=${api_key}&q=${this.state.query}&random_id=e826c9fc5c929e0d6c6d423841a282aa`;
    this.fetchAndRenderStickers(url);
  };

  searchGifTwo = keyword => {
    if (keyword === keywords[0]) {
      this.buildUrl(api_key);
    } else {
      let endpoint = "https://api.giphy.com/v1/gifs/search";
      let url = `${endpoint}?api_key=${api_key}&q=${keyword}&random_id=e826c9fc5c929e0d6c6d423841a282aa`;
      this.fetchAndRenderGifs(url);
    }
  };

  searchGif = () => {
    let endpoint = "https://api.giphy.com/v1/gifs/search";
    let url = `${endpoint}?api_key=${api_key}&q=${this.state.query}&random_id=e826c9fc5c929e0d6c6d423841a282aa`;
    this.fetchAndRenderGifs(url);
  };

  sendEmoticon = text => {
    let msgObj = {
      text,
      type: msgTypes.MESSAGE_EMOTICONS
    };
    this.props.pushAndSendMessage(msgObj);
    this.props.toggleGiphyPicker();
  };

  renderSmileys = () => {
    return (
      <FlatList
        data={ALL_EMOJIS}
        numColumns={4}
        showsVerticalScrollIndicator={false}
        style={{
          alignSelf: "center"
        }}
        keyExtractor={item => item}
        renderItem={({ item, index }) => {
          return (
            <NoFeedbackTapView
              onPress={() => this.sendEmoticon(item)}
              style={{
                paddingHorizontal: LEFT_MARGIN / 3
              }}
            >
              <Emoji name={item} style={{ fontSize: EMOJI_SIZE * 1.5 }} />
            </NoFeedbackTapView>
          );
        }}
      />
    );
  };

  renderStickers = () => {
    let { stickers } = this.state;
    const imageList = stickers.map(
      (
        { fixed_height_small, original, downsized_still, downsized_small },
        index
      ) => {
        return (
          <TouchableOpacity
            style={{
              width: DeviceWidth * 0.5
            }}
            onPress={() => {
              this.setState(
                {
                  selectedGif: { original, downsized_still, downsized_small }
                },
                () => {
                  this.scrollRef.scrollTo({ x: DeviceWidth });
                }
              );
            }}
            key={index}
            index={index}
          >
            <Image
              source={{ uri: fixed_height_small.url }}
              style={{
                marginLeft:
                  index % 2 === 0 ? DeviceWidth * 0.04 : DeviceWidth * 0.01,
                ...styles.gifImage,
                backgroundColor: "#fff",
                borderColor: "#fff"
              }}
            />
          </TouchableOpacity>
        );
      }
    );
    return (
      <View>
        <View style={styles.gifsearchRow}>
          <TextInput
            style={styles.searchInput}
            onChangeText={text => this.setState({ query: text })}
            returnKeyType={"search"}
            onSubmitEditing={() => this.searchSticker()}
            placeholder={"Search sticker"}
            placeholderTextColor={FONT_GREY}
          />
          <Ionicon
            style={styles.searchIcon}
            name={"ios-search"}
            size={22}
            color={FONT_GREY}
          />
        </View>
        {this.renderKeywordsRow()}
        <FlatList
          numColumns={2}
          data={imageList}
          renderItem={({ item }) => item}
        />
      </View>
    );
  };

  renderPerfectGif = () => {
    let { gifs } = this.state;
    const imageList = gifs.map(
      (
        { fixed_height_small, original, downsized_still, downsized_small },
        index
      ) => {
        return (
          <TouchableOpacity
            style={{
              width: DeviceWidth * 0.5
            }}
            onPress={() => {
              // console.log(" selected gif is ", gif);
              this.setState(
                {
                  selectedGif: { original, downsized_still, downsized_small }
                },
                () => {
                  this.scrollRef.scrollTo({ x: DeviceWidth });
                }
              );
            }}
            key={index}
            index={index}
          >
            <Image
              source={{ uri: fixed_height_small.url }}
              style={[
                {
                  marginLeft:
                    index % 2 === 0 ? DeviceWidth * 0.04 : DeviceWidth * 0.01
                },
                styles.gifImage
              ]}
            />
          </TouchableOpacity>
        );
      }
    );
    return (
      <View>
        <View style={styles.gifsearchRow}>
          <TextInput
            style={styles.searchInput}
            onChangeText={text => this.setState({ query: text })}
            returnKeyType={"search"}
            onSubmitEditing={() => this.searchGif()}
            placeholder={"Search GIF"}
            placeholderTextColor={FONT_GREY}
          />
          <Ionicon
            style={styles.searchIcon}
            name={"ios-search"}
            size={22}
            color={FONT_GREY}
          />
        </View>
        {this.renderKeywordsRow()}
        <FlatList
          numColumns={2}
          data={imageList}
          renderItem={({ item }) => item}
        />
      </View>
    );
  };

  renderKeywordsRow = () => {
    const { selectedKey, selectedItem } = this.state;

    return (
      <RowView
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginTop: 5,
          marginBottom: 10
        }}
      >
        {keywords.map((item, itemId) => {
          const _isCurrent = selectedKey === item;
          return (
            <NoFeedbackTapView
              key={itemId}
              style={{
                padding: 5,
                paddingHorizontal: 10,
                backgroundColor: _isCurrent ? "rgba(0,0,0,0.05)" : "#fff",
                borderRadius: 15
              }}
              onPress={() => {
                this.setState({ selectedKey: item });
                selectedItem === items[0]
                  ? this.searchGifTwo(item)
                  : this.searchStickerTwo(item);
              }}
            >
              <RegularText
                style={{
                  color: _isCurrent ? PURPLE : FONT_BLACK
                }}
              >
                {item}
              </RegularText>
            </NoFeedbackTapView>
          );
        })}
      </RowView>
    );
  };

  closeGiphyPicker = () => {
    this.props.closeGiphyPicker();
  };

  replaceOldGameOrPost = () => {};

  createGifObj = () => {
    const { selectedGif } = this.state;
    let gifObj = {
      height: selectedGif.original.height,
      width: selectedGif.original.width,
      previewUrl: selectedGif.downsized_small.url,
      originalUrl: selectedGif.original.url
    };
    return gifObj;
  };

  createPostObj = () => {
    const { gameId } = this.state;

    post = {
      name: "THE_PERFECT_GIF",
      question: JSON.stringify(this.createGifObj()),
      option: "",
      options: [],
      type: appConstants.POST_TO_PROFILE,
      gameId,
      category: "1",
      postOrder: 1
    };

    return post;
  };

  renderEmoticons = () => {
    const { reactToGif } = this.props;

    return (
      <View>
        <View
          style={{
            height: DeviceHeight * 0.1
          }}
        />
        <RegularText
          style={{
            color: "#fff",
            textAlign: "center",
            transform: [{ translateY: -LEFT_MARGIN }]
          }}
        >
          Instant Reactions
        </RegularText>
        <RowView
          style={{
            justifyContent: "space-evenly"
          }}
        >
          {[0, 1, 2, 3].map((item, itemId) => {
            return (
              <TouchableOpacity
                onPress={() => reactToGif(item, "EMOTICON")}
                style={{
                  width: EMOJI_SIZE
                }}
                key={itemId}
              >
                <SvgUri
                  height={EMOJI_SIZE}
                  width={EMOJI_SIZE}
                  source={Emojis[item]}
                />
              </TouchableOpacity>
            );
          })}
        </RowView>
        <RowView
          style={{
            justifyContent: "space-evenly",
            marginVertical: LEFT_MARGIN
          }}
        >
          {[4, 5, 6, 7].map((item, itemId) => {
            return (
              <TouchableOpacity
                onPress={() => reactToGif(item, "EMOTICON")}
                style={{
                  width: EMOJI_SIZE
                }}
                key={itemId}
              >
                <SvgUri
                  height={EMOJI_SIZE}
                  width={EMOJI_SIZE}
                  source={Emojis[item]}
                />
              </TouchableOpacity>
            );
          })}
        </RowView>
      </View>
    );
  };

  sendGif = () => {
    const {
      selectedGame,
      openReplaceModal,
      posts,
      replacePostInGame,
      fromResponse,
      reactToGif,
      fromChatWindow,
      pushAndSendMessage
    } = this.props;
    const { selectedGif, selectedItem } = this.state;

    if (fromResponse) {
      reactToGif(this.createGifObj(), "GIF");
    } else if (fromChatWindow) {
      this.setState({ isLoading: true });
      let msgObj = {
        text: JSON.stringify(selectedGif),
        type: selectedItem.toUpperCase()
      };
      pushAndSendMessage(msgObj);
      this.props.toggleGiphyPicker();
      setTimeout(() => {
        this.setState({ isLoading: false });
      }, 800);

      // addQuestionPostbyUser(this.createPostObj(), cbPostObj => {
      //   if (cbPostObj.success) {
      //     let msgObj = {
      //       text: JSON.stringify([cbPostObj.data]),
      //       type: msgTypes.MESSAGE_CHAT_CARD
      //     };
      //     pushAndSendMessage(msgObj);
      //   } else {
      //     alert(
      //       "Something went wrong while posting this card" + cbPostObj.message
      //     );
      //   }
      // });
    } else {
      const { gameId } = this.state;
      this.setState({ isLoading: true });
      if (selectedGame === "THE_PERFECT_GIF") {
        addQuestionPostbyUser(this.createPostObj(), cbData => {
          if (cbData.success) {
            const postId =
              posts &&
              posts[gameId] &&
              posts[gameId].length > 0 &&
              posts[gameId][0].questionId &&
              posts[gameId][0]._id;
            deletePostMethod({ id: postId }, cbDeleteData => {
              this.setState({ isLoading: false });
              if (cbDeleteData.success) {
                replacePostInGame(gameId, postId, cbData.data);
                this.closeGiphyPicker();
              } else {
                alert("Something went wrong while deleting old post");
              }
            });
          } else {
            this.setState({ isLoading: false });
            alert("Something went wrong while adding post&Question");
          }
        });
      } else {
        openReplaceModal(this.createPostObj());
      }
    }
  };

  renderPreview = () => {
    let { selectedGif, isLoading } = this.state;

    if (selectedGif) {
      const { height, url, width } = selectedGif.original;
      const { fromResponse, fromMyProfile } = this.props;
      const h = parseInt(height);
      const w = parseInt(width);
      const isLarge = h > DeviceHeight * 0.4;
      const isTooLarge = h / 2 > DeviceHeight * 0.4;
      return (
        <View
          style={{
            width: DeviceWidth
          }}
        >
          <View style={styles.questionOptionsViewRow}>
            <TouchableOpacity
              style={styles.leftArrowIcon}
              onPress={() => {
                this.scrollRef.scrollTo({ x: 0 });
              }}
            >
              <Ionicon
                name={"ios-arrow-dropleft-circle"}
                size={35}
                color={FONT_GREY}
              />
            </TouchableOpacity>
          </View>

          <Image
            source={{ uri: url }}
            style={{
              width: isTooLarge ? w / 3 : isLarge ? w / 2 : w,
              height: isTooLarge ? h / 3 : isLarge ? h / 2 : h,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#cacaca",
              backgroundColor: "#cacaca",
              alignSelf: "center"
            }}
          />

          <VerticalGradientView
            style={{
              ...styles.sendButtonView,
              transform: [{ translateY: 10 }]
            }}
            colors={[PURPLE, LIGHT_PURPLE]}
          >
            <TouchableOpacity
              style={styles.sendButtonView}
              onPress={() => this.sendGif()}
            >
              {isLoading ? (
                <ActivityIndicator color={"#fff"} size={"small"} />
              ) : (
                <Text style={styles.sendButtonText}>
                  {fromMyProfile
                    ? "SAVE AND DISPLAY"
                    : fromResponse
                    ? "React"
                    : "SEND"}
                </Text>
              )}
            </TouchableOpacity>
          </VerticalGradientView>
        </View>
      );
    } else {
      return null;
    }
  };

  renderHeaderNavBar = () => {
    const { selectedItem } = this.state;
    return (
      <RowView style={styles.topHeaderNav}>
        {items.map((item, itemId) => {
          const _isCurrent = selectedItem === item;
          return (
            <VerticalGradientView
              key={itemId}
              colors={_isCurrent ? [PURPLE, LIGHT_PURPLE] : ["#FFF", "#FFF"]}
              style={styles.navButton}
            >
              <NoFeedbackTapView
                style={styles.navButton}
                onPress={() => this.setState({ selectedItem: item })}
              >
                <MediumText
                  style={{
                    ...styles.navButtonText,
                    color: _isCurrent ? "#fff" : FONT_BLACK
                  }}
                >
                  {item}
                  {itemId !== 0 ? "s" : ""}
                </MediumText>
              </NoFeedbackTapView>
            </VerticalGradientView>
          );
        })}
      </RowView>
    );
  };

  render() {
    let { selectedGif, selectedItem } = this.state;
    const { fromResponse, fromMyProfile } = this.props;

    return (
      <View style={{ zIndex: 999999 }}>
        {fromMyProfile ? (
          <TouchableOpacity
            onPress={() => this.closeGiphyPicker()}
            style={styles.scrollLayout}
          />
        ) : fromResponse ? (
          this.renderEmoticons()
        ) : (
          <View />
        )}

        <View style={styles.gameCardView}>
          <TouchableOpacity
            disabled={!fromMyProfile}
            onPress={() => this.closeGiphyPicker()}
            style={{
              ...styles.closingBar,
              opacity: selectedGif !== null ? 0 : 1
            }}
          />
          {fromResponse || fromMyProfile ? <View /> : this.renderHeaderNavBar()}
          <ScrollView
            horizontal
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            ref={ref => (this.scrollRef = ref)}
          >
            <View style={{ width: DeviceWidth }}>
              {selectedItem === items[0] ? (
                this.renderPerfectGif()
              ) : selectedItem === items[1] ? (
                this.renderSmileys()
              ) : selectedItem === items[2] ? (
                this.renderStickers()
              ) : (
                <View />
              )}
            </View>
            {this.renderPreview()}
          </ScrollView>
          {/* {selectedGif === null ? (
            selectedItem === items[0] ? (
              this.renderPerfectGif()
            ) : selectedItem === items[2] ? (
              this.renderStickers()
            ) : (
              <View />
            )
          ) : (
            this.renderPreview()
          )} */}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  navButtonText: {
    textAlign: "center",
    fontSize: 16
  },
  navButton: {
    height: 30,
    width: DeviceWidth * 0.3,
    justifyContent: "center",
    borderRightColor: "#00000010",
    borderRightWidth: 1
  },
  topHeaderNav: {
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#cacaca",
    borderRadius: 10,
    width: DeviceWidth * 0.9,
    overflow: "hidden",
    marginBottom: 7.5
  },
  searchInput: {
    color: FONT_GREY,
    paddingLeft: 0,
    marginLeft: 0,
    alignSelf: "center",
    width: DeviceWidth * 0.6
  },
  searchIcon: {
    paddingHorizontal: 5,
    paddingTop: 10
  },
  gifsearchRow: {
    height: 40,
    width: DeviceWidth * 0.8,
    backgroundColor: "rgba(0,0,0,0.05)",
    alignSelf: "center",
    borderRadius: 20,
    flexDirection: "row",
    marginVertical: 10,
    justifyContent: "center"
  },
  sendButtonText: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#fff"
  },
  sendButtonView: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    alignSelf: "center",
    paddingVertical: 5,
    paddingHorizontal: LEFT_MARGIN
  },
  gifImage: {
    width: DeviceWidth * 0.45,
    height: DeviceWidth * 0.25,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#cacaca",
    backgroundColor: "#cacaca",
    marginVertical: 5
  },
  leftArrowIcon: {
    margin: 20
  },
  questionOptionsViewRow: {
    // flexDirection: "row",
    // justifyContent: "space-between",
    // position: "absolute",
    width: DeviceWidth
  },
  gameCardView: {
    height: DeviceHeight * 0.7,
    width: DeviceWidth * 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "#fff"
  },
  scrollLayout: {
    height: DeviceHeight * 0.3,
    width: DeviceWidth * 0.9,
    backgroundColor: "#0000"
  },
  closingBar: {
    height: 5,
    borderRadius: 30,
    alignSelf: "center",
    backgroundColor: "#cacaca",
    width: 30,
    marginVertical: 15
  }
});

const mapStateToProps = state => {
  return {
    gameNames: state.questions.gameNames,
    posts: state.info.posts
  };
};

const mapDispatchToProps = dispatch => ({
  pushAndSendMessage: bindActionCreators(
    ChatActions.pushAndSendMessage,
    dispatch
  ),
  replacePostInGame: bindActionCreators(replacePostInGame, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(GiphyPicker);
