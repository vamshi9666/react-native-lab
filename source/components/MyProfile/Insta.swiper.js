import React, { Component } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import Swiper from "react-native-swiper";
import Lodash from "lodash";
import { LEFT_MARGIN } from "../../config/Constants";
import InstaGrid from "./Insta.grid";
import RowView from "../Views/RowView";
import { FONT_BLACK, FONT_GREY } from "../../config/Colors";
import { DeviceWidth } from "../../config/Device";

const LayoutWidth = DeviceWidth * 0.9;

class InstaSwiper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSlide: 0
    };
  }

  onMomentumScrollEndHandler = evt => {
    let currentOffset = evt.nativeEvent.contentOffset.x;
    let newSlideIndex = Math.round(currentOffset / LayoutWidth);
    if (this.state.currentSlide !== newSlideIndex) {
      this.setState({ currentSlide: newSlideIndex });
    }
  };

  render() {
    const { data, allImages, fromMyProfile } = this.props;
    const { currentSlide } = this.state;
    return (
      <>
        <ScrollView
          onMomentumScrollEnd={this.onMomentumScrollEndHandler}
          showsHorizontalScrollIndicator={false}
          horizontal
          pagingEnabled
        >
          {data.map((slide, id) => {
            return (
              <InstaGrid
                allImages={allImages}
                key={id}
                images={slide}
                currentSlideNumber={id}
                fromMyProfile={fromMyProfile}
              />
            );
          })}
        </ScrollView>
        <RowView
          style={{
            marginTop: LEFT_MARGIN,
            alignSelf: "center"
          }}
        >
          {data.map((slide, id) => (
            <View
              key={id}
              style={{
                backgroundColor: currentSlide === id ? FONT_BLACK : FONT_GREY,
                ...styles.dotStyle
              }}
            />
          ))}
        </RowView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  dotStyle: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginHorizontal: 3
  }
});

export default InstaSwiper;
