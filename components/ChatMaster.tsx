import React, { FC, ReactNode, Fragment, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  View,
  StyleSheet,
  LayoutAnimation,
  TextInput,
  Text,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Keyboard,
  Platform
} from "react-native";
import { Message } from "../types";
import { State } from "../App";
import { useContext } from "react";
import { ChatMasterContext, ADD_MESSAGE } from "../contexts/ChatMaster";
import A, {
  Transition,
  TransitioningView,
  Easing,
  Transitioning
} from "react-native-reanimated";
import {
  TouchableWithoutFeedback,
  ScrollView
} from "react-native-gesture-handler";
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    height
    // backgroundColor: "red"
  },
  inputComposer: {
    // position: "absolute",
    // bottom: 0,
    // left: 0,
    flexDirection: "row",
    height: 62,
    // backgroundColor: "red",
    // width,
    alignItems: "center"
  },
  textInput: {
    paddingHorizontal: 16,
    marginVertical: 8,
    marginRight: 16,
    flex: 1,
    borderRadius: 10,
    backgroundColor: "grey",
    alignItems: "center",
    justifyContent: "center"
  },
  messageList: {
    flexDirection: "column",
    // backgroundColor: "red",
    minHeight: 200
  }
});

export const SECONDARY_COLOR = "#dbcbd8";
export const PRIMATY_COLOR = "#101935";
const Touchable =
  Platform.OS === "ios" ? TouchableOpacity : TouchableWithoutFeedback;
interface IProps {
  messages?: Array<Message>;
  state?: State;
  dispatch?: Function;
  renderComposer?: ({ sendMutation }) => ReactNode;
  renderMessage?: (messge: Message) => ReactNode;
  renderTimestrap?: () => ReactNode;
}

const transition = (
  <Transition.Together>
    <Transition.In type={"slide-bottom"} durationMs={400} />
    <Transition.Change interpolation={"easeInOut"} durationMs={400} />
  </Transition.Together>
);
const ChatMaster = (props: IProps) => {
  const messageListView = useRef(null);
  const { renderMessage } = props;
  const { state, dispatch } = useContext(ChatMasterContext) as any;
  const { messages } = state;
  const { control, handleSubmit, errors, getValues, reset, ...all } = useForm();
  const onChange = args => {
    return {
      value: args[0].nativeEvent.text
    };
  };

  console.log("all ae ", getValues());

  const handleSend = () => {
    const { message } = getValues();
    console.log(" message is ", message.value);

    const int = setInterval(() => {
      messageListView.current.animateNextTransition();
      dispatch({
        type: ADD_MESSAGE,
        messageObj: {
          isSent: true,
          body: String(message.value + " " + messages.length),
          createdAt: Date.now()
        }
      });
    }, 1000);
    if (messages.length > 20) {
      clearInterval(int);
    }

    reset();

    Keyboard.dismiss();
  };
  const inputComposer = (
    <View
      style={{
        ...styles.inputComposer,
        width,
        marginTop: "auto"
        // backgroundColor: "green"
      }}
    >
      <Controller
        as={TextInput}
        control={control}
        name="message"
        style={{ ...styles.textInput, flex: 1, height: 62 }}
        onChange={onChange}
        rules={{ required: true }}
        defaultValue=""
      />
      <Touchable
        onPress={() => {
          handleSend();
        }}
      >
        <Text style={{}}> SEND </Text>
      </Touchable>
    </View>
  );
  const messagesList = (
    <ScrollView
      contentContainerStyle={{
        ...styles.messageList,
        bottom: 0,
        position: "absolute"
      }}
    >
      <Transitioning.View {...{ transition }} ref={messageListView}>
        {messages.map((message, messageIndex) => (
          <View key={messageIndex} style={{ marginBottom: 16 }}>
            {renderMessage(message)}
          </View>
        ))}
      </Transitioning.View>
    </ScrollView>
  );
  return (
    <View style={styles.container}>
      {messagesList}
      <KeyboardAvoidingView
        keyboardVerticalOffset={64}
        style={{
          //   backgroundColor: "red",
          position: "absolute",
          bottom: 0,
          flex: 1,
          justifyContent: "flex-end"
        }}
        behavior={"position"}
      >
        {inputComposer}
      </KeyboardAvoidingView>
    </View>
  );
};

export { ChatMaster };
