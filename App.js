import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions
  // TouchableOpacity,
  // FlatList
} from "react-native";
import { TouchableOpacity, FlatList } from "react-native-gesture-handler";
import BottomSheet from "reanimated-bottom-sheet";
import { data } from "./data";
const { width: wWidth, height: wHeight } = Dimensions.get("window");
export default function App() {
  const renderItem = ({ item }) => {
    return (
      <View
        style={{
          flexDirection: "column",
          paddingHorizontal: 16,
          paddingVertical: 8
        }}
      >
        <Text style={styles.textTitle}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#71a2b6",
            padding: 10,
            alignSelf: "flex-end"
          }}
          onPress={() => {
            alert(" one ");
            console.log(" test one ");
          }}
        >
          <Text>test</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const modal = React.createRef();
  const renderContent = () => {
    return (
      <View
        style={{
          height: wHeight,
          backgroundColor: "#f3f3f3",
          marginHorizontal: 8,
          // height
          // flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <FlatList
          style={{
            flex: 1,
            width: wWidth,
            height: wHeight
            // backgroundColor: "red"
          }}
          renderItem={renderItem}
          keyExtractor={item => String(item.key)}
          data={data}
        />
      </View>
    );
  };
  const renderHeader = () => {
    return (
      <View
        style={{
          backgroundColor: "#f3f3f3",
          flex: 1,
          marginHorizontal: 8,
          padding: 8,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          alignItems: "center"
        }}
      >
        <View style={{ width: 100, borderWidth: 2, borderStyle: "solid" }} />
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          backgroundColor: "white",
          paddingHorizontal: 16,
          paddingVertical: 16
        }}
        onPress={() => {
          modal.current.snapTo(1);
        }}
      >
        <Text>Oen modal</Text>
      </TouchableOpacity>
      <BottomSheet
        ref={modal}
        snapPoints={[10, wHeight - 30]}
        renderContent={renderContent}
        renderHeader={renderHeader}
        enabledBottomClamp
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#71a2b6",
    alignItems: "center",
    justifyContent: "center"
  }
});
