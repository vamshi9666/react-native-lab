import React, { createRef, Component, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback
} from "react-native";
import Card from "./src/components/Card";

import ModalContext from "./src/context/ModalContext";
const ModalRoot = props => {
  const [component, setComponent] = useState(null);

  const [_props, set_props] = useState({});
  const openModal = (component, props = {}) => {
    setComponent(component);
    set_props(props);
  };
  const closeModal = () => {
    setComponent(null);
    set_props({});
  };
  return (
    <ModalContext.Provider
      value={{ component, props: _props, openModal, closeModal }}
    >
      {props.children}
    </ModalContext.Provider>
  );
};

export default class App extends Component {
  open = (position, index, ...rest) => {
    console.log(position, index);
    this.setState({
      postion,
      index
    });
  };

  renderItem = ({ item, index }) => {
    return <ListItem {...{ open: this.open, index }} />;
  };
  render() {
    // const { postion, index } = this.state;
    return (
      <ModalRoot>
        <View style={styles.container}>
          <Card />
        </View>
      </ModalRoot>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  listItme: {
    // padding: 16,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 10
  },
  listItemText: {
    marginVertical: 46,
    fontSize: 20,
    textAlign: "center",
    padding: 8
  }
});
