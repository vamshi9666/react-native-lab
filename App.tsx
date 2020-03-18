import React from "react";
import { StyleSheet, Text, View, Button, Dimensions } from "react-native";
import { ChatMaster } from "./components/ChatMaster";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createContext } from "react";
import { useReducer } from "react";
import { useContext } from "react";
import { Message, ClosedRoom } from "./types";
import { ChatMasterContext, ChatMasterReducer } from "./contexts/ChatMaster";

export const UPDATE_OPENED_ROOM = "UPDATE_OPENED_ROOM";
export const CLEAR_OPENED_ROOM = "CLEAR_OPENED_ROOM";
export const INSERT_CLOSED_ROOM = "INSERT_CLOSED_ROOM";
export const UPDATE_CLOSED_ROOM = "UPDATE_CLOSED_ROOM";

const OPEN_ONE_ROOM = "OPEN_ONE_ROOM";
const CLOSE_ROOM = "CLOSE_ROOM";

export interface State {
  rooms: Array<ClosedRoom>;
  selected_room_id: string;
  // opened_room: Room;
}
interface Action {
  type: string;
  room_id: string;
}
const chatReducer = (state, action: Action) => {
  const { type, room_id } = action;
  switch (type) {
    case OPEN_ONE_ROOM:
      return { ...state, selected_room_id: room_id };
    case CLOSE_ROOM:
      return {
        ...state,
        selected_room_id: null
      };
    default:
      return { ...state };
  }
};
function ChatScreen() {
  const context = useContext(ChatMasterContext) as any;
  const { state, dispatch }: { state: State; dispatch: Function } = context;
  // const { opened_room } = state;
  // if (!opened_room) {
  // throw new Error(" data is in invalid shape");
  // }
  // const { messages = [] } = opened_room;
  // console.log(" context is ", opened_room);
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ChatMaster
        renderComposer={({ sendMutation }) => {
          return <View />;
        }}
        renderMessage={eachMessage => {
          const { isSent, body } = eachMessage;
          console.log(" bodu is ", body);
          return (
            <View
              style={{
                alignSelf: isSent ? "flex-end" : "flex-start",
                height: 48,
                backgroundColor: isSent ? PRIMATY_COLOR : SECONDARY_COLOR,
                borderRadius: 15,

                justifyContent: "center"
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  textAlign: "center",
                  textAlignVertical: "center",
                  color: "#fff"
                }}
              >
                {body}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}

function ChatList() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
    </View>
  );
}

const ChatContext = createContext({});
const Stack = createStackNavigator();

export const SECONDARY_COLOR = "#dbcbd8";
export const PRIMATY_COLOR = "#101935";

const { height, width } = Dimensions.get("window");
export default ({}) => {
  const [roomsListState, roomsListdispatch] = useReducer(chatReducer, {
    closed_rooms: []
  });
  const [chatMasterState, chatMasterDispatch] = useReducer(ChatMasterReducer, {
    messages: [],
    targetUser: null
  });
  return (
    <NavigationContainer>
      <ChatContext.Provider
        value={{
          state: roomsListState,
          dipsatch: roomsListdispatch
        }}
      >
        <ChatMasterContext.Provider
          value={{
            state: chatMasterState,
            dispatch: chatMasterDispatch
          }}
        >
          <View style={styles.container}>
            <Stack.Navigator initialRouteName={"chat"}>
              <Stack.Screen name={"list"} component={ChatList} />
              <Stack.Screen name={"chat"} component={ChatScreen} />
            </Stack.Navigator>
          </View>
        </ChatMasterContext.Provider>
      </ChatContext.Provider>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
