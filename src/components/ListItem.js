import React from "react";
import {
  TouchableNativeFeedback,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native-gesture-handler";
import { Text, Image, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
const measure = async ref =>
  new Promise(resolve =>
    ref.measureInWindow((x, y, width, height) =>
      resolve({
        x,
        y,
        width,
        height
      })
    )
  );

export default class ListItem extends React.Component {
  constructor(props) {
    super(props);
    this.itemRef = React.createRef();
  }
  startTransition = async () => {
    const { onSelect, obj } = this.props;
    const position = await measure(this.itemRef.current.getNode());
    // console.log(" position vector is ", position);
    onSelect(obj, position);
  };
  render() {
    const { open, modal, title, subtitle, source } = this.props;

    return (
      <TouchableWithoutFeedback
        style={{
          padding: 16,
          // flex: 1,
          backgroundColor: "green"
        }}
        onPress={this.startTransition}
      >
        <Animated.View ref={this.itemRef}>
          <Image
            style={{
              width: 200,
              height: 200
              // ...StyleSheet.absoluteFillObject
            }}
            source={source}
          />
          <Text style={{ fontSize: 24 }}>{title}</Text>
          <Text style={{ fontSize: 16, textAlign: "center" }}> {subtitle}</Text>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}
