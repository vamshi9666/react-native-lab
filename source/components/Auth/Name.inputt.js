import React, { Component } from "react";
import { View, Text, TextInput, Switch } from "react-native";
import { TOP_BAR_WIDTH } from "../../../src/config/Constants";
import styles from "../../../src/styles/Name.input";
import {
  FONT_GREY,
  FONT_BLACK,
  BACKGROUND_GREY
} from "../../../src/config/Colors";

class NameInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showNameToggleValue: true
    };
  }

  render() {
    const { showNameToggleValue } = this.state;
    const { keyboardShown } = this.props;

    return (
      <View>
        <View
          style={{
            marginHorizontal: 27,
            marginTop: TOP_BAR_WIDTH + 30
            // backgroundColor: "green"
          }}
        >
          <Text
            style={{
              fontSize: 34,
              fontWeight: "700",
              textAlign: "left",
              marginTop: keyboardShown ? -30 : 0
            }}
          >
            My First Name
          </Text>
        </View>

        <View
          style={{
            marginTop: keyboardShown ? 10 : 40,
            marginBottom: 10,
            height: 48,
            backgroundColor: BACKGROUND_GREY,
            borderRadius: 24,

            marginHorizontal: 26,
            justifyContent: "center"
          }}
        >
          <TextInput
            autoFocus={false}
            style={styles.inputField}
            placeholderTextColor={FONT_GREY}
            placeholder={"First Name"}
            onChangeText={text => {
              text
                ? this.props.setButtonState(true)
                : this.props.setButtonState(false);
            }}
          />
        </View>
        <Text
          style={[
            styles.helperText,
            {
              marginTop: keyboardShown ? 0 : 0
            }
          ]}
        >
          This is how it appears in Closer app
        </Text>
        <View
          style={{
            marginTop: 20,
            flexDirection: "column-reverse",
            alignItems: "center",
            alignSelf: "center"
          }}
        >
          <Text
            style={{
              marginRight: 10,
              fontSize: 18,
              color: "#4E586E",
              textAlignVertical: "center"
            }}
          >
            Display name only to your friends
          </Text>
          <Switch
            style={{
              alignSelf: "center",
              marginVertical: 8
            }}
            trackColor={{ false: "#DEDEDE", true: "rgb(0,211,237)" }}
            value={showNameToggleValue}
            onValueChange={val => {
              this.setState({
                showNameToggleValue: val
              });
            }}
          />
        </View>
      </View>
    );
  }
}

export default NameInput;
