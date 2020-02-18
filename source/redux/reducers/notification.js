import * as types from "../types/notification";

const initialState = {
  showChatIconDot: false,
  showChatsTextDot: false,
  showSentTextDot: false,
  showReceivedTextDot: false,
  showBellIconDot: false,
  currentScreenIndex: 0,
  currentChatScreenIndex: 2
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.SET_CHAT_ICON_DOT:
      return { ...state, showChatIconDot: action.payload };

    case types.SET_CHAT_TEXT_DOT:
      return { ...state, showChatsTextDot: action.payload };

    case types.SET_SENT_TEXT_DOT:
      return { ...state, showSentTextDot: action.payload };

    case types.SET_RECEIVED_DOT:
      return { ...state, showReceivedTextDot: action.payload };

    case types.SET_BELL_ICON_DOT:
      return { ...state, showBellIconDot: action.payload };

    case types.SET_CURRENT_SCREEN_INDEX:
      return { ...state, currentScreenIndex: action.payload };

    case types.SET_CHAT_CURRENT_SCREEN_INDEX:
      return { ...state, currentChatScreenIndex: action.payload };

    default:
      return state;
  }
}
