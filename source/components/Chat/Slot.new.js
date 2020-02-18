import React, { Component } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { DeviceWidth } from "../../config/Device";
import Ionicon from "react-native-vector-icons/Ionicons";
import * as Progress from "react-native-progress";
import { PURPLE } from "../../config/Colors";
import moment from "moment";
import { STATIC_URL } from "../../config/Api";
import { TouchableOpacity } from "react-native-gesture-handler";

class SlotItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { expiresAt, user, onPress, unreadMessagesCount } = this.props;
    const timeDiff = moment(parseInt(expiresAt * 1000)).diff(moment(), "hours");
    const progressValue = timeDiff / 24;
    const timeShown = moment.unix(expiresAt).toNow(true);
    const { name, images } = user;
    const imageUrl = images ? (images.length > 0 ? images[0] : null) : null;
    console.log(" image urls is ", unreadMessagesCount);
    const imageSource = imageUrl && imageUrl.split("uploads")[1];
    return (
      <View style={styles.cardView}>
        <TouchableOpacity
          activeOpacity={0.4}
          onPress={onPress}
          style={styles.cardContainer}
        >
          <Progress.Circle
            size={90}
            progress={progressValue}
            direction="counter-clockwise"
            borderColor={"rgba(0,0,0,0.0)"}
            indeterminate={false}
            color={"#3F5EF7"}
            unfilledColor={"rgba(0,0,0,0.1)"}
            style={{ position: "absolute", top: -35 }}
            fill={"#fff"}
            thickness={2.5}
          />
          <Image
            style={styles.userImage}
            source={{ uri: STATIC_URL + imageSource }}
          />
          <Text style={styles.userName}>
            {name[0].toUpperCase()}
            {name.substring(1, name.length)}
          </Text>
          <View style={styles.timeHolder}>
            <Ionicon name={"md-time"} color={"#fff"} size={15} />

            <Text style={styles.hourText}> {timeShown} left </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  hourText: {
    color: "#fff",
    fontWeight: "300",
    fontSize: 16
  },
  timeHolder: {
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#3F5EF7",
    backgroundColor: "#3F5EF7",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignItems: "center",
    marginTop: 10
  },
  userName: {
    color: "#000",
    fontWeight: "700",
    fontSize: 20,
    marginTop: -22
  },
  userImage: {
    height: 80,
    width: 80,
    borderRadius: 40,
    margin: 0,
    borderWidth: 1,
    borderColor: "#cacaca",
    transform: [{ translateY: -30 }]
  },
  cardContainer: {
    height: DeviceWidth * 0.36,
    width: DeviceWidth * 0.42,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    marginTop: 50,
    marginLeft: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    marginBottom: 10
  },
  cardView: {
    width: DeviceWidth * 0.48
  }
});

export default SlotItem;
