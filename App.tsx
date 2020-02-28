import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  StatusBar,
  Dimensions,
  Alert
} from "react-native";
import ReModal from "./components/ReModal";
import Animated from "react-native-reanimated";
import ReOneStepCaurosel from "./components/ReOneStepCaurosel";
import CloneCaurosel from "./components/CloneCaurousel";
import VirtualCaurosel from "./components/VirtualCaurosel";
import Carousel from "react-native-snap-carousel";

const { Value, Extrapolate, block, eq, debug, cond, interpolate } = Animated;
const { height, width } = Dimensions.get("window");
const arr = new Array(30).fill(1).map((i, index) => index + 1);

export const ENTRIES1 = [
  {
    title: "Beautiful and dramatic Antelope Canyon",
    subtitle: "Lorem ipsum dolor sit amet et nuncat mergitur",
    illustration: "https://i.imgur.com/UYiroysl.jpg"
  },
  {
    title: "Earlier this morning, NYC",
    subtitle: "Lorem ipsum dolor sit amet",
    illustration: "https://i.imgur.com/UPrs1EWl.jpg"
  },
  {
    title: "White Pocket Sunset",
    subtitle: "Lorem ipsum dolor sit amet et nuncat ",
    illustration: "https://i.imgur.com/MABUbpDl.jpg"
  },
  {
    title: "Acrocorinth, Greece",
    subtitle: "Lorem ipsum dolor sit amet et nuncat mergitur",
    illustration: "https://i.imgur.com/KZsmUi2l.jpg"
  },
  {
    title: "The lone tree, majestic landscape of New Zealand",
    subtitle: "Lorem ipsum dolor sit amet",
    illustration: "https://i.imgur.com/2nCt3Sbl.jpg"
  },
  {
    title: "Middle Earth, Germany",
    subtitle: "Lorem ipsum dolor sit amet",
    illustration: "https://i.imgur.com/lceHsT6l.jpg"
  }
];

export default class App extends React.Component {
  // const [modalVisible, setModalVisible] = useState(false);
  state = {
    modalVisible: false,
    entries: ENTRIES1
  };
  _carousel = React.createRef();
  masterTranslateX = new Value(0);
  modalVisible = new Value(0);
  progress = new Value(0);

  _renderItem = ({ item, index }) => {
    return (
      <View style={{ padding: 32, backgroundColor: "red" }}>
        <Text style={{}}>{item.title}</Text>
      </View>
    );
  };
  render() {
    const { modalVisible } = this;
    // const { modalVisible } = this.state;
    const { progress } = this;
    return (
      <View style={styles.container}>
        <StatusBar hidden />

        <Carousel
          contentContainerStyle={{
            marginTop: 64
          }}
          ref={c => {
            this._carousel = c;
          }}
          data={this.state.entries}
          renderItem={this._renderItem}
          sliderWidth={300}
          itemWidth={400}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 50
  },
  scrollContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  showdowStyles: {
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 20
  }
});
