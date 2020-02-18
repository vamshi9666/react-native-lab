import * as types from "../types/chats";
const defaultState = {
  rooms: {},
  rooms_array: [],
  selected_room_id: null,
  isTargetUserTyping: false,
  pushAndSendMsg: null,
  targetUser: null,
  messages: [],
  editedMessage: null,
  newActivity: null,
  sentStack: [],
  recievedStack: [],
  missedRequests: undefined,
  sentRoomsLength: null,
  recievedRoomsLength : null
};

export default function rooms(state = defaultState, action) {
  switch (action.type) {
    case types.SET_ROOMS:
      return {
        ...state,
        rooms: action.payload
      };
    case types.GET_MESSAGE:
      return { ...state, messages: action.payload };

    case types.SET_TARGET_USER: {
      return {
        ...state,
        targetUser: action.payload
      };
    }
    case types.SET_ROOMS_ARRAY: {
      return {
        ...state,
        rooms_array: action.payload
      };
    }
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

    case types.SET_EDITED_MESSAGE: {
      return {
        ...state,
        editedMessage: action.payload
      };
    }
    case types.SET_NEW_ACTIVITY: {
      return {
        ...state,
        newActivity: action.payload
      };
    }
    case types.SET_SENT_STACK: {
      return {
        ...state,
        sentStack: action.payload
      };
    }
    case types.SET_RECIEVED_STACK: {
      return {
        ...state,
        recievedStack: action.payload
      };
    }
    case types.SET_MISSED_REQUESTS: {
      return {
        ...state,
        missedRequests: action.payload
      };
    }
    case types.SET_SENT_ROOMS_LENGTH :{
      return {
        ...state,
        sentRoomsLength: action.payload
      }
    }
    case types.SET_RECEIVED_ROOMS_LENGTH: {
      return {
        ...state,
        recievedRoomsLength: action.payload
      }
    }
    default:
      return state;
  }
}
