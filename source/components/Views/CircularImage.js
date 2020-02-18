import React, { Component } from "react";
import { Image } from "react-native";
import { CachedImage } from "react-native-img-cache";

class CircularImage extends Component {
  render() {
    const { style, height, source, ...allProps } = this.props;

    return (
      <CachedImage
        {...allProps}
        source={source}
        style={{
          height,
          width: height,
          borderRadius: height / 2,
          ...style
        }}
      />
    );
  }
}

export default CircularImage;
