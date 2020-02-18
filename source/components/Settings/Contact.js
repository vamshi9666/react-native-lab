import React, { Component } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  TextInput
} from "react-native";
import Ionicon from "react-native-vector-icons/Ionicons";
import { DeviceHeight, DeviceWidth } from "../../config/Device";
import * as UserInputApi from "../../network/userInput";

const items = [
  { display_text: "Report a Technical issue", inputType: "TECH_ISSUE" },
  { display_text: "Suggest an idea", inputType: "IDEA" },
  { display_text: "Ask a question", inputType: "QUESTION" },
  { display_text: "Report a billing problem", inputType: "BILLING_ISSUE" }
];
const SUCCESS_ALERT_MESSAGE = "We appriciate your input.";
const INPUT_TYPE = "FEEDBACK";
class ContactUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: "",
      showInput: false,
      inputType: null,
      feedbackBody: null
    };
    this.scrollRef = React.createRef();
  }

  moveBack = () => {
    this.scrollRef.scrollTo({ x: 0 });
    this.setState({ selectedItem: "", showInput: false });
  };

  uploadFeedback = () => {
    const { inputType, feedbackBody } = this.state;
    const { dismissContactUsModal } = this.props;
    const body = {
      type: inputType,
      feedbackBody
    };
    UserInputApi.uploadFeedback(INPUT_TYPE, body, feedbackResponse => {
      if (feedbackResponse.success) {
        setTimeout(() => {
          dismissContactUsModal();
        }, 300);
      } else {
        alert(" error in sending feedback . please try again ");
      }
    });
  };

  render() {
    const {
      dismissContactUsModal,
      navigation: { push }
    } = this.props;
    const { selectedItem, showInput } = this.state;

    return (
      <View
        style={{
          backgroundColor: "#fff",
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          width: DeviceWidth,
          flex: 1,
          marginTop: DeviceHeight / 6
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            showInput ? this.moveBack() : dismissContactUsModal();
          }}
        >
          <View
            style={{
              flexDirection: showInput ? "row-reverse" : "row",
              justifyContent: showInput ? "flex-end" : "space-between",
              borderBottomColor: "#E4E5EA",
              borderBottomWidth: 0.5,
              paddingHorizontal: 20,
              marginVertical: 10
            }}
          >
            <Text
              style={{
                fontSize: 23,
                color: "#1E2432",
                fontWeight: "600",
                marginLeft: showInput ? 10 : 0
              }}
            >
              {showInput ? selectedItem : "Contact us"}
            </Text>
            <Ionicon
              name={showInput ? "ios-arrow-back" : "ios-close"}
              color={"#707070"}
              size={selectedItem ? 30 : 35}
            />
          </View>
        </TouchableWithoutFeedback>
        <ScrollView
          scrollEnabled={false}
          ref={ref => (this.scrollRef = ref)}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <View
            style={{
              width: DeviceWidth
            }}
          >
            {items.map((item, ItemId) => (
              <TouchableOpacity
                key={ItemId}
                onPress={() => {
                  this.setState({
                    selectedItem: item.display_text,
                    showInput: true,
                    inputType: item.inputType
                  });
                  this.scrollRef.scrollTo({ x: DeviceWidth });
                }}
                style={{
                  borderBottomWidth: 0.5,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginVertical: 5,
                  borderBottomColor: "#F2F3F6",
                  paddingHorizontal: 20,
                  paddingVertical: 2
                }}
              >
                <Text style={{ color: "#1E2432", fontSize: 17, marginTop: 5 }}>
                  {item.display_text}
                </Text>
                <Ionicon
                  name={"ios-arrow-forward"}
                  size={30}
                  color={"#C2C4CA"}
                />
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ width: DeviceWidth }}>
            <TextInput placeholder={"To be designed"} />
            {/* <MultilineInput
              width={DeviceWidth * 0.8}
              maxLength={40}
              placeholder={"Type here..."}
              multiline={true}
              numberOfLines={4}
              onChangeText={issue => this.setState({ feedbackBody: issue })}
              value={this.state.issue}
              style={{
                height: 200,
                backgroundColor: "#F0F0F0",
                margin: 10,
                borderRadius: 20,
                paddingHorizontal: 10
              }}
            /> */}
            <TouchableOpacity
              style={{
                height: 45,
                width: DeviceWidth * 0.8,
                alignSelf: "center",
                borderRadius: 30,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#774CD5"
              }}
              onPress={() => this.uploadFeedback()}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 17
                }}
              >
                Send
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <View style={styles.footerView}>
          <Image
            style={styles.logoImage}
            source={require("../../assets/images/Applogo.png")}
          />
          <View style={styles.logoVersionView}>
            <Text style={styles.closerText}>Closer</Text>
            <Text style={styles.versionText}>Version V1.0</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  logoImage: {
    height: 60,
    width: 60
  },
  logoVersionView: {
    flexDirection: "column",
    marginLeft: 10
  },
  closerText: {
    fontSize: 23,
    color: "#000"
  },
  versionText: {
    fontSize: 12,
    color: "#9B9B9B",
    marginTop: 5
  },
  footerView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 20,
    alignSelf: "center"
  }
});

export default ContactUs;
