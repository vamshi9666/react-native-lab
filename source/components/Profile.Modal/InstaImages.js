import React, { Component } from "react";
import { View, FlatList, Image, StyleSheet, Text } from "react-native";
import { DeviceWidth, DeviceHeight } from "../../config/Device";
import Swiper from "react-native-swiper";
import _chunk from "lodash/chunk";
import Gallery from "react-native-image-gallery";
import Ionicon from "react-native-vector-icons/Ionicons";
import { TouchableHighlight } from "react-native-gesture-handler";
import Lightbox from "react-native-lightbox";
import moment from "moment";
import RegularText from "../Texts/RegularText";
import { CachedImage } from "react-native-img-cache";
class InstaImages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSlide: null,
      selectedSlideIndex: 0,
      selectedImageIndex: 0,
      selectedPostIndex: 0,
      slides: [],
      galleyOpened: false,
      allPosts: []
    };
    this.swiper = React.createRef();
  }

  componentDidMount = () => {
    const phtotosPerSlide = 6;
    const { posts, fromProfileModal = false } = this.props;
    if (!fromProfileModal) {
      const allPosts = posts.map(post => {
        // const mongth = moment.unix(post.created_time ).month*
        const time = moment.unix(post.created_time).format("D MMM");
        return {
          source: {
            uri: post.images.low_resolution.url
          },
          createdAt: time
        };
      });
      this.setState(
        {
          allPosts,
          slides: _chunk(posts, phtotosPerSlide)
        },
        () => {
          console.log(" chunk is   case 0 ", this.state);
        }
      );
    } else {
      const allPosts = posts.map(post => {
        console.log(" each post in ", post);
        return { source: { uri: post.url }, createdAt: post.createdAt };
      });

      this.setState(
        {
          allPosts,
          slides: _chunk(allPosts, phtotosPerSlide)
        },
        () => {
          console.log(" chunk is case 1  ", this.state);
        }
      );
    }
  };
  openSlide = postIndex => {
    console.log(" post index is ", postIndex);
    this.setState({
      // selectedSlide,
      selectedPostIndex: postIndex
      // allPosts:
      // selectedSlideIndex: slideIndex,
      // selectedImageIndex: imageIndex
    });
  };

  render() {
    const {
      selectedSlide,
      selectedSlideIndex,
      slides,
      selectedImageIndex,
      selectedPostIndex,
      allPosts
    } = this.state;
    return (
      <Swiper
        ref={r => (this.swiper = r)}
        onIndexChanged={index => {
          if (!this.state.galleyOpened) {
            this.setState(prevState => {
              console.log(" slide index is #0 ", index);
              return {
                selectedSlideIndex: index
              };
            });
          }
        }}
        paginationStyle={{
          marginBottom: -50
        }}
        activeDotColor={"rgb(30,36,50)"}
        loop={false}
        bounces={false}
        horizontal
        showsButtons={false}
        style={{
          height: DeviceHeight * 0.32,
          justifyContent: "center",
          alignItems: "center",

          backgroundColor: "blue"
          // marginLeft: 5
        }}
      >
        {slides.map((slidePhotos, slideIndex) => {
          return (
            <View
              key={slideIndex}
              style={{
                // flex: 1,
                // backgroundColor: "green",
                // justifyContent: "center",
                marginLeft: 8,
                alignItems: "flex-start"
              }}
            >
              <FlatList
                key={slideIndex}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={
                  {
                    // flex: 1,
                    // justifyContent: "center",
                    // alignItems: "center"
                  }
                }
                bounces={false}
                keyExtractor={(item, index) => index}
                data={slidePhotos}
                numColumns={3}
                renderItem={({ item: post, index }) => {
                  const { fromProfileModal = false } = this.props;
                  let imageUrl;
                  if (fromProfileModal === false) {
                    imageUrl = post.images.low_resolution.url;
                  } else {
                    imageUrl = post.source.uri;
                  }
                  console.log(" image uri is ", imageUrl);
                  return (
                    <Lightbox
                      key={index}
                      underlayColor={"#000"}
                      springConfig={{ tension: 900000, friction: 900000 }}
                      swipeToDismiss={false}
                      renderHeader={close => {
                        return (
                          <View
                            style={{
                              backgroundColor: "#00000000",
                              // flex:1,
                              width: DeviceWidth,
                              flexDirection: "row",
                              justifyContent: "flex-end"
                              // height: 30
                            }}
                          >
                            <Ionicon
                              name="md-close"
                              size={30}
                              color="#fff"
                              onPress={close}
                              style={{
                                marginRight: 16,
                                marginTop: 6
                              }}
                            />
                          </View>
                        );
                      }}
                      onOpen={() => {
                        this.setState({
                          galleyOpened: true
                        });
                      }}
                      onClose={() => {
                        this.setState({
                          galleyOpened: false
                        });
                      }}
                      renderContent={() => {
                        return (
                          <Gallery
                            onPageScroll={e => {
                              if (selectedPostIndex !== e.position) {
                                console.log(
                                  " settling test 0 onPageScroll",
                                  selectedPostIndex,
                                  e.position
                                );

                                this.setState(
                                  {
                                    selectedPostIndex: e.position
                                  },
                                  () => {
                                    console.log(
                                      " just set post index to ",
                                      this.state.selectedPostIndex
                                    );
                                  }
                                );
                                console.log(
                                  " just set  #2 ",
                                  e.position,
                                  e.position % 6
                                );
                                if (e.position < 6) {
                                  if (
                                    e.position === 5 ||
                                    e.position % 6 === 1
                                  ) {
                                    if (selectedPostIndex > e.position) {
                                      console.log(
                                        " just set # 999 ",
                                        selectedPostIndex,
                                        e.position,
                                        selectedSlideIndex
                                      );

                                      this.setState(
                                        prevState => {
                                          console.log(
                                            " just set #999  prevstate is ",
                                            prevState.selectedSlideIndex
                                          );
                                          return {
                                            selectedSlideIndex:
                                              prevState.selectedSlideIndex - 1
                                          };
                                        },
                                        () => {
                                          console.log(
                                            " just set #999  going to scroll forward ",
                                            this.state
                                          );
                                          this.swiper.scrollBy(-1, false);
                                        }
                                      );
                                    }
                                  }
                                } else if (e.position >= 6) {
                                  if (
                                    e.position === 6 ||
                                    e.position % 6 === 0
                                  ) {
                                    console.log(
                                      " just set #3 ",
                                      selectedPostIndex,
                                      e.position
                                    );
                                    if (selectedPostIndex < e.position) {
                                      console.log(
                                        " just set #5 ",
                                        selectedPostIndex,
                                        e.position,
                                        selectedSlideIndex
                                      );

                                      this.setState(
                                        prevState => {
                                          console.log(
                                            " just set #6  prevstate is ",
                                            prevState.selectedSlideIndex
                                          );
                                          return {
                                            selectedSlideIndex:
                                              prevState.selectedSlideIndex + 1
                                          };
                                        },
                                        () => {
                                          console.log(
                                            " just set #5  going to scroll forward ",
                                            this.state
                                          );
                                          this.swiper.scrollBy(1, false);
                                        }
                                      );
                                    }
                                    console.log(
                                      " just set post index to ",
                                      this.state.selectedSlideIndex
                                    );
                                  }
                                }
                              }
                            }}
                            initialPage={selectedPostIndex}
                            style={{
                              flex: 1,
                              backgroundColor: "#000"
                            }}
                            images={allPosts}
                            imageComponent={(props, dimensions) => {
                              return (
                                <View
                                  style={{
                                    alignItems: "center",
                                    justifyContent: "center"
                                  }}
                                >
                                  <RegularText
                                    style={{
                                      color: "#fff",
                                      fontSize: 20,
                                      // marginTop: 32,
                                      position: "absolute",
                                      top: 20
                                    }}
                                  >
                                    {props.image.createdAt}
                                  </RegularText>
                                  <CachedImage
                                    source={props.image.source}
                                    style={props.style}
                                    {...props}
                                  />
                                </View>
                              );
                            }}
                          />
                        );
                      }}
                    >
                      <TouchableHighlight
                        onPress={() => {
                          this.openSlide(
                            slideIndex === 0
                              ? index
                              : selectedSlideIndex * 6 + index
                          );
                        }}
                        activeOpacity={0.3}
                        key={index}
                        style={{
                          // flex: 1,
                          backgroundColor: "rgb(240,240,240)",

                          alignItems: "center",
                          justifyContent: "center",
                          marginHorizontal: 5,
                          marginVertical: 7,
                          borderRadius: 10,

                          display: "flex"
                          // width: ,
                          // height: DeviceWidth * 0.3
                          // height: ,
                        }}
                      >
                        <CachedImage
                          source={{ uri: imageUrl }}
                          style={{
                            width: DeviceWidth * 0.25,
                            height: DeviceWidth * 0.25,
                            // flex: 1

                            aspectRatio: 1,
                            borderRadius: 10
                          }}
                          // resizeMode={"contain"}
                        />
                      </TouchableHighlight>
                    </Lightbox>
                  );
                }}
              />
            </View>
          );
        })}
      </Swiper>
    );
  }
}

export default InstaImages;

// <Ionicon name={"md-add"} color={"#fff"} size={40} />
