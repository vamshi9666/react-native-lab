import React, { Component, Fragment } from "react";
import CurvedBackground from "../Views/Curved.background";
import { connect } from "react-redux";
import AntIcon from "react-native-vector-icons/AntDesign";
import { styles } from "../../styles/MyProfile";
import { checkNullAndUndefined, namify } from "../../config/Utils";
import { TouchableOpacity, View, Text } from "react-native";
import BoldText from "../Texts/BoldText";
import RegularText from "../Texts/RegularText";
import MediumText from "../Texts/MediumText";
import _isEqual from "lodash/isEqual";
class MyInfoChunk extends Component {
  state = {
    fieldsToCheck: []
  };
  shouldComponentUpdate = nextProps => {
    // return true;
    const { myData } = this.props;
    const isOldMyDataDifferent = _isEqual(nextProps.myData, this.props.myData);
    return !isOldMyDataDifferent;
  };

  componentDidMount = () => {};
  render() {
    const { config, myData, onItemTapped } = this.props;
    const isPrivate = myData.private && myData.private === true;
    return (
      <Fragment>
        {Object.keys(config).map((chunkName, cIndex) => {
          return (
            <CurvedBackground key={cIndex} radius={20}>
              <BoldText style={styles.headerText}>
                {" "}
                {chunkName === "MY_EDUCATION_AND_WORK"
                  ? "My Education & Work"
                  : chunkName.split("_").join(" ")}
              </BoldText>
              <View>
                {config[chunkName]["children"].map(
                  (
                    {
                      data_key,
                      styles: config_styles,
                      field_display_name,
                      index,
                      data_key_two
                    },
                    fIndex
                  ) => {
                    const isFilledAlready = checkNullAndUndefined(
                      myData[data_key]
                    )
                      ? true
                      : false;

                    if (cIndex === 0) {
                      if (fIndex === 0) {
                        return (
                          <TouchableOpacity
                            onPress={() => {
                              if (isPrivate) {
                                alert(" you cant edit in private mode");
                                return;
                              }

                              onItemTapped({
                                toFill: index,
                                formModalVisible: true,
                                showDeleteIcon: isFilledAlready,
                                hideStatusbar: false
                              });
                              //  ` this.setState({
                              //     toFill: index,
                              //     formModalVisible: true,
                              //     showDeleteIcon: isFilledAlready,
                              //     hideStatusbar: false
                              //   });
                              //   thi`s.openCloserModal();
                            }}
                            key={fIndex}
                            style={{
                              ...styles.userInfoLayout,
                              flexDirection: "column"
                            }}
                          >
                            <RegularText
                              style={{
                                ...styles.userFieldName,
                                margin: 0,
                                padding: 0
                              }}
                            >
                              {field_display_name}
                              {"\n"}
                            </RegularText>
                            {checkNullAndUndefined(myData[data_key]) &&
                            checkNullAndUndefined(myData[data_key_two]) ? (
                              <MediumText
                                style={{
                                  fontSize: 18,
                                  transform: [{ translateY: -4 }]
                                }}
                              >
                                {checkNullAndUndefined(myData[data_key]) &&
                                  myData[data_key]}{" "}
                                at{" "}
                                {checkNullAndUndefined(myData[data_key_two]) &&
                                  myData[data_key_two]}
                              </MediumText>
                            ) : checkNullAndUndefined(myData[data_key]) ? (
                              <MediumText
                                style={{
                                  fontSize: 18,
                                  transform: [{ translateY: -4 }]
                                }}
                              >
                                {checkNullAndUndefined(myData[data_key]) &&
                                  myData[data_key]}
                              </MediumText>
                            ) : (
                              <View />
                            )}
                          </TouchableOpacity>
                        );
                      } else {
                        return (
                          <TouchableOpacity
                            onPress={() => {
                              if (isPrivate) {
                                alert(" you cant edit in private mode");
                                return;
                              }
                              onItemTapped({
                                toFill: index,
                                formModalVisible: true,
                                showDeleteIcon: isFilledAlready,
                                hideStatusbar: false
                              });
                              //   this.setState({
                              //     toFill: index,
                              //     formModalVisible: true,
                              //     showDeleteIcon: isFilledAlready,
                              //     hideStatusbar: false
                              //   });
                              //   this.openCloserModal();
                            }}
                            key={fIndex}
                            style={{
                              ...styles.userInfoLayout,
                              flexDirection: "column"
                            }}
                          >
                            <RegularText
                              style={{
                                ...styles.userFieldName,
                                margin: 0,
                                padding: 0
                              }}
                            >
                              {field_display_name}
                              {"\n"}
                            </RegularText>
                            {checkNullAndUndefined(myData[data_key]) &&
                            checkNullAndUndefined(myData[data_key_two]) ? (
                              <MediumText
                                style={{
                                  fontSize: 18,
                                  transform: [{ translateY: -4 }]
                                }}
                              >
                                {checkNullAndUndefined(myData[data_key]) &&
                                  myData[data_key]}{" "}
                                {checkNullAndUndefined(myData[data_key_two]) &&
                                  myData[data_key_two]}
                              </MediumText>
                            ) : checkNullAndUndefined(myData[data_key]) ? (
                              <MediumText
                                style={{
                                  fontSize: 18,
                                  transform: [{ translateY: -4 }]
                                }}
                              >
                                {checkNullAndUndefined(myData[data_key]) &&
                                  myData[data_key]}
                              </MediumText>
                            ) : (
                              <View />
                            )}
                          </TouchableOpacity>
                        );
                      }
                    } else {
                      return (
                        <TouchableOpacity
                          key={fIndex}
                          style={[
                            {
                              ...config_styles
                            },
                            styles.userInfoLayout
                          ]}
                          onPress={() => {
                            if (isPrivate) {
                              alert(" you cant edit in private mode");
                              return;
                            }
                            onItemTapped({
                              toFill: index,
                              formModalVisible: true,
                              showDeleteIcon: isFilledAlready,
                              hideStatusbar: false
                            });
                            // this.setState({
                            //   toFill: index,
                            //   formModalVisible: true,
                            //   showDeleteIcon: isFilledAlready,
                            //   hideStatusbar: false
                            // });
                            // this.openCloserModal();
                          }}
                        >
                          <View style={styles.userInfoView}>
                            <Text style={styles.userFieldName}>
                              {field_display_name}
                            </Text>
                            {isFilledAlready && (
                              <Text style={styles.userInfoText}>
                                {namify(myData[data_key])}
                              </Text>
                            )}
                          </View>
                          <View style={styles.rightIconView}>
                            <AntIcon name="right" size={20} color="#000000" />
                          </View>
                        </TouchableOpacity>
                      );
                    }
                  }
                )}
              </View>
            </CurvedBackground>
          );
        })}
      </Fragment>
    );
  }
}

const mapState = state => {
  return {
    myData: state.info.userInfo
  };
};

const mapDispatch = dispatch => {
  return {};
};
export default connect(mapState, mapDispatch)(MyInfoChunk);

MyInfoChunk.defaultProp = {
  config: []
};
