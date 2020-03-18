import React, { createContext, Component, Children } from "react";
const ChatMasterContext = createContext({});

export const ADD_MESSAGE = "ADD_MESSAGE";
export const UPSERT_MESSAGES = "UPSERT_MESSAGES";
export const UPDATE_MESSSAGE = "UPDATE_MESSSAGE";

const ChatMasterReducer = (state, action) => {
  const { type, messageObj, upsetMessages } = action;
  switch (type) {
    case ADD_MESSAGE:
      console.log(" new messages are ", {
        out: messageObj
      });
      return {
        ...state,
        messages: [...state.messages, messageObj]
      };
    case UPSERT_MESSAGES:
      return {
        ...state,
        messages: upsetMessages
      };

    case UPDATE_MESSSAGE:
      return {
        ...state,
        messages: [...state.messages, messageObj]
      };
    default:
      return {
        ...state
      };
      break;
  }
};
export { ChatMasterContext, ChatMasterReducer };
