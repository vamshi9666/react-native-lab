import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Platform
} from "react-native";
import Countries from "../../config/Countries";
import RowView from "../Views/RowView";
import MediumText from "../Texts/MediumText";
import RegularText from "../Texts/RegularText";
import Ionicon from "react-native-vector-icons/Ionicons";
import { PURPLE, FONT_BLACK, FONT_GREY } from "../../config/Colors";
import { DeviceWidth, DeviceHeight } from "../../config/Device";
import { LEFT_MARGIN } from "../../config/Constants";

class CountryPickerModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countries: Countries,
      cQuery: ""
    };
  }

  handleSearch = cQuery => {
    // console.log(isNaN(cQuery));
    let queryText;
    if (isNaN(cQuery)) {
      queryText = cQuery.toLowerCase().replace(/,|\.|-/g, " ");
    } else {
      queryText = cQuery.replace(/,|\.|-/g, " ");
    }

    const queryWords = queryText.split(" ").filter(w => !!w.trim().length);
    let searchedCountries = [];
    Countries.forEach(cntry => {
      queryWords.forEach(queryWord => {
        if (isNaN(cQuery)) {
          if (cntry.name.toLowerCase().indexOf(queryWord) > -1) {
            searchedCountries.push(cntry);
          }
        } else {
          if (cntry.code.toString().indexOf(queryWord) > -1) {
            searchedCountries.push(cntry);
          }
        }
      });
    });
    this.setState({
      cQuery,
      countries: cQuery ? searchedCountries : Countries
    });
  };

  render() {
    const {
      showModal,
      dismissCountryPickerModal,
      setCurrentCountryCode
    } = this.props;
    const { cQuery } = this.state;

    return (
      <Modal visible={showModal} animated transparent animationType={"slide"}>
        <View style={styles.modalLayout}>
          <View style={styles.modalTopRow}>
            <RowView
              style={{
                justifyContent: "space-between"
              }}
            >
              <MediumText style={styles.selectGenderText}>
                Select Your Country
              </MediumText>
              <TouchableOpacity onPress={dismissCountryPickerModal}>
                <MediumText style={styles.cancelText}>Cancel</MediumText>
              </TouchableOpacity>
            </RowView>
            <RowView style={styles.searchLayout}>
              <TextInput
                autoFocus={true}
                style={styles.textInput}
                value={cQuery}
                onChangeText={this.handleSearch}
                placeholder={"Search country..."}
              />
            </RowView>
          </View>

          <FlatList
            extraData={{ ...this.props, ...this.state }}
            keyExtractor={item => item.cca2}
            data={this.state.countries}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                key={index}
                style={styles.otherGenderItemsContainer}
                onPress={() => {
                  setCurrentCountryCode(item.code);
                  // addUserInfo("country", item).then(() => {
                  setTimeout(() => {
                    dismissCountryPickerModal();
                  }, 800);
                  // });
                }}
              >
                <RegularText style={styles.otherGenderItems}>
                  {item.name} - {item.code}
                </RegularText>
                {item.code === 91 ? (
                  <Ionicon
                    size={25}
                    color={PURPLE}
                    name={"ios-checkmark-circle"}
                  />
                ) : (
                  <View />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    paddingLeft: LEFT_MARGIN / 1.5,
    marginLeft: 0,
    alignSelf: "center",
    fontSize: 20,
    color: "#242E42",
    fontFamily: "Proxima Nova",
    flex: 1
  },
  otherGenderItems: { color: FONT_BLACK, fontSize: 22 },
  modalLayout: { flex: 1, backgroundColor: "#fff", borderRadius: 10 },
  selectGenderText: { color: FONT_BLACK, fontSize: 25, paddingLeft: 10 },
  cancelText: { color: FONT_GREY, fontSize: 18, paddingRight: 10 },
  otherGenderItemsContainer: {
    borderWidth: 0.5,
    borderColor: "#00000017",
    paddingVertical: 10,
    paddingLeft: DeviceWidth * 0.05,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 10
  },
  modalTopRow: {
    borderBottomColor: "#00000016",
    borderBottomWidth: 1,
    marginTop: Platform.OS === "android" ? 15 : 30
  },
  searchLayout: {
    height: 40,
    width: DeviceWidth * 0.98,
    backgroundColor: "#F1F2F6",
    borderRadius: 30,
    alignSelf: "center",
    marginVertical: 10
  }
});

export default CountryPickerModal;
