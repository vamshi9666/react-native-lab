import React from "react";
import { View, Button } from "react-native";
import ModalContext from "../context/ModalContext";

const ModalConsumer = ModalContext.Consumer;
export default class ChildBox extends React.Component {
  render() {
    return (
      <ModalConsumer>
        {({ ...rest }) => {
          // console.log(" rest area ", rest)
          return (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Button
                title={"open modal"}
                onPress={() => {
                  console.log(" rest are ", rest);
                }}
              />
            </View>
          );
        }}
      </ModalConsumer>
    );
  }
}
