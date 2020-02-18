import * as types from "../types/chats";

const defaultState = {
  selected_room_id: null,
  isTargetUserTyping: false,
  pushAndSendMsg: null
};

export default function rooms(state = defaultState, action) {
  switch (action.type) {
    case types.SELECT_ONE_ROOM: {
      return {
        ...state,
        selected_room_id: action.payload
      };
    }

    case types.SET_TARGET_USER_TYPING: {
      return {
        ...state,
        isTargetUserTyping: action.payload
      };
    }

    case types.PUSH_AND_SEND_MESSAGES:
      return { ...state, pushAndSendMsg: action.payload };

    default:
      return state;
  }
}
