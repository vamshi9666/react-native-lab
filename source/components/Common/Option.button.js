import React, { Component } from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { DeviceWidth } from "../../config/Device";
import { greyTheme } from "../../config/Colors";
import { retrieveData } from "../../config/Storage";

class OptionButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pickedOption: "",
      userId: ""
    };
  }

  componentDidMount = async () => {
    let userId = await retrieveData("USER_ID");
    this.setState({ userId });
  };

  setOption = i => {
    let { post, optionPressed } = this.props;
    optionPressed(i, post.question._id, post.postedBy, post._id);
    this.setState({ pickedOption: `${i}` });
  };

  render() {
    const {
      full,
      index,
      item,
      response,
      showResponse,
      post,
      prevPickedOption
    } = this.props;
    let { pickedOption, userId } = this.state;
    console.log("questinId and post", post.postedBy, userId);
    pickedOption = prevPickedOption !== null ? prevPickedOption : pickedOption;
    return (
      <TouchableOpacity
        disabled={pickedOption !== "" || post.postedBy._id === userId}
        style={[
          styles.optionView,
          {
            backgroundColor:
              response && showResponse
                ? "#74c26d"
                : showResponse && !response && pickedOption === `${index}`
                ? "#cf4d36"
                : "#fff"
          }
        ]}
        onPress={() => this.setOption(index)}
      >
        <Text
          style={[
            styles.optionText,
            {
              color: pickedOption !== "" ? "#fff" : greyTheme
            }
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  optionView: {
    width: DeviceWidth * 0.95,
    height: 50,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10
  },
  optionText: {
    fontWeight: "bold",
    fontSize: 16
  }
});

export default OptionButton;
