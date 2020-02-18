import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { PURPLE, LIGHT_PURPLE } from "../../config/Colors";
import { DeviceHeight, DeviceWidth } from "../../config/Device";
import Ionicon from "react-native-vector-icons/Ionicons";
import CurvedBackground from "../Common/Curved.background";
import MultilineInput from "../MyProfile/Multiline.input";

const items = [
  "Report a Technical issue",
  "Suggest an idea",
  "Ask a question",
  "Report a billing problem"
];

class ReportForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      issue: ""
    };
  }
  render() {
    const {
      navigation: {
        state: {
          params: { itemName }
        }
      }
    } = this.props;

    return (
      <View
        style={{
          backgroundColor: "#F2F3F6",
          flex: 1
        }}
      >
        <LinearGradient
          style={styles.topLinearBackground}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          colors={[PURPLE, LIGHT_PURPLE]}
        />
        <View
          style={{
            backgroundColor: "#fff",
            marginHorizontal: 20,
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            transform: [{ translateY: -DeviceHeight * 0.15 }]
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => this.props.navigation.goBack()}
          >
            <View
              style={{
                flexDirection: "row",
                borderBottomColor: "#E4E5EA",
                borderBottomWidth: 0.5,
                paddingHorizontal: 20,
                marginVertical: 10
              }}
            >
              <Ionicon name={"ios-arrow-back"} color={"#707070"} size={30} />
              <Text
                style={{
                  fontSize: 22,
                  color: "#1E2432",
                  fontWeight: "600",
                  transform: [{ translateX: 10 }, { translateY: 3 }]
                }}
              >
                {itemName}
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <MultilineInput
            width={DeviceWidth * 0.8}
            maxLength={40}
            placeholder={"Type your issue here..."}
            multiline={true}
            numberOfLines={4}
            onChangeText={issue => this.setState({ issue })}
            value={this.state.issue}
            style={{
              height: 200,
              backgroundColor: "#F0F0F0",
              margin: 10,
              borderRadius: 20,
              paddingHorizontal: 10
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  topLinearBackground: {
    paddingTop: 20,
    zIndex: -1,
    height: DeviceHeight * 0.25,
    width: DeviceWidth,
    shadowColor: "#000",
    shadowOffset: {
      height: 3,
      width: 0
    },
    shadowOpacity: 1,
    elevation: 2
  },
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
    marginTop: 50
  }
});

export default ReportForm;
