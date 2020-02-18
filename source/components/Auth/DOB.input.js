import React, { Component } from "react";
import {
  DatePickerAndroid,
  DatePickerIOS,
  Platform,
  Text,
  View,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import * as userActions from "../../redux/actions/user.info";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { months } from "../../../src/config/Constants";
import { DeviceHeight, DeviceWidth } from "../../../src/config/Device";
import BoldText from "../Texts/BoldText";
import RegularText from "../Texts/RegularText";

import { PURPLE, LIGHT_PURPLE } from "../../../src/config/Colors";
import { BACKGROUND_GREY, FONT_BLACK } from "../../config/Colors";
const LEFT_MARGIN = DeviceWidth * 0.05;

class DOB extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      chosenDate: new Date(),
      showIOSPicker: false,
      formattedDate: "DD-MM-YYYY",
      currentDay: 0,
      currentMonth: "Jan",
      currentYear: 1980,
      selectedDate: null
    };
    this.setDate = this.setDate.bind(this);
  }
  componentDidMount = () => {
    // firebase.logEvent("login8_date_of_birth_input_did_mount");
  };

  async openCalender() {
    if (Platform.OS === "ios") {
      this.setState({ showIOSPicker: true });
    } else {
      try {
        const { action, year, month, day } = await DatePickerAndroid.open({
          date: new Date()
        });
        if (action !== DatePickerAndroid.dismissedAction) {
          let pickedDay = day < 10 ? "0" + day : day;
          let pickedMonth = month < 10 ? "0" + (month + 1) : month + 1;
          console.log(`${pickedDay}-${pickedMonth}-${year}`);
          this.setState({
            formattedDate: `${pickedDay}-${pickedMonth}-${year}`
          });
        }
      } catch ({ code, message }) {
        console.warn("Cannot open date picker", message);
      }
    }
  }

  setDate(newDate) {
    let splittedDate = String(newDate).split(" ");
    let day = splittedDate[2];
    let month =
      months.indexOf(splittedDate[1]) + 1 < 10
        ? "0" + (months.indexOf(splittedDate[1]) + 1)
        : months.indexOf(splittedDate[1]) + 1;
    let year = splittedDate[3];
    this.setState({ formattedDate: `${day}-${month}-${year}` });
    this.props.addUserInfo("date_of_birth", `${day}-${month}-${year}`);
    this.setState({ chosenDate: newDate });
  }
  showAndroidPicker = async () => {
    try {
      const { handleNext } = this.props;
      const { action, year, month, day } = await DatePickerAndroid.open({
        // Use `new Date()` for current date.
        // May 25 2020. Month 0 is January.
        date: new Date(2020, 4, 25)
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        // Selected year, month (0-11), day
        this.setState(
          {
            selectedDate: `${day}-${month}-${year}`
          },
          () => {
            this.props.addUserInfo("date_of_birth", `${day}-${month}-${year}`);
            handleNext();

            console.log(" selected date is ", this.state.selectedDate);
          }
        );
      }
    } catch ({ code, message }) {
      console.warn("Cannot open date picker", message);
    }
  };

  render() {
    const {
      showIOSPicker,
      currentDay,
      currentMonth,
      currentYear,
      selectedDate
    } = this.state;
    const {
      userInfo: { date_of_birth },
      inputEnabled
    } = this.props;
    return (
      <View>
        <BoldText
          style={{
            color: "#1E2432",
            fontSize: 34,
            marginTop: DeviceHeight * 0.1,
            marginLeft: LEFT_MARGIN
          }}
        >
          My Birthday is
        </BoldText>
        <RegularText
          style={{
            marginLeft: LEFT_MARGIN,
            marginTop: LEFT_MARGIN,
            fontSize: 18
          }}
        >
          Your age will be public
        </RegularText>
        {Platform.OS === "ios" ? (
          <DatePickerIOS
            date={this.state.chosenDate}
            onDateChange={this.setDate}
            style={{
              // backgroundColor: "#752AD614",
              marginTop: 10
            }}
            maximumDate={new Date(1571495968000)}
            minimumDate={new Date(340814368000)}
            mode="date"
          />
        ) : (
          <TouchableOpacity
            style={{
              paddingVertical: 16,
              marginTop: 32,
              marginHorizontal: 20,
              backgroundColor: BACKGROUND_GREY,
              borderRadius: 20,

              paddingLeft: 20,
              borderWidth: 0.5,
              borderColor: LIGHT_PURPLE
            }}
            onPress={() => {
              this.showAndroidPicker();
            }}
          >
            {selectedDate ? (
              <Text style={styles.dateSting}>{selectedDate}</Text>
            ) : (
              <Text style={styles.dateSting}>select date</Text>
            )}
          </TouchableOpacity>
        )}
        <RegularText
          style={{
            marginLeft: LEFT_MARGIN,
            marginTop: LEFT_MARGIN,
            fontSize: 18,
            textAlign: "center"
          }}
        >
          {date_of_birth}
        </RegularText>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  dateSting: {
    fontSize: 16,
    // marginLeft: 32,
    fontWeight: "400",
    color: FONT_BLACK
  }
});
const mapStatetoProps = state => {
  return {
    userInfo: state.info.userInfo
  };
};

const mapDispatchToProps = dispatch => ({
  addUserInfo: bindActionCreators(userActions.addUserInfo, dispatch)
});
export default connect(
  mapStatetoProps,
  mapDispatchToProps
)(DOB);
