import React, { Component } from "react";
import { View } from "react-native";
import RowView from "../Views/RowView";
import { DeviceWidth } from "../../config/Device";
import { FONT_BLACK } from "../../config/Colors";
import { BASIC_INFO_ICONS } from "../../config/Constants";
import SvgUri from "react-native-svg-uri";
import MediumText from "../Texts/MediumText";

class BasicInfo extends Component {
  render() {
    const { value, itemKey, size } = this.props;

    return (
      <RowView
        style={{
          width: DeviceWidth * 0.45,
          marginTop: 20
        }}
      >
        <View>
          <SvgUri
            width={size ? size : 22}
            height={size ? size : 22}
            source={BASIC_INFO_ICONS[itemKey]}
          />
        </View>
        <MediumText
          style={{
            fontSize: 16,
            color: FONT_BLACK,
            marginLeft: 10,
            marginTop: size ? 0 : 5
          }}
        >
          {value}
        </MediumText>
      </RowView>
    );
  }
}

export default BasicInfo;
