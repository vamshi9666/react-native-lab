import * as types from "../types/nav";

const initialState = {
  currentScreenIndex: 0,
  currentChatScreenIndex: 2,
  currentResponses: [],
  scrollQuestionCards: undefined,
  deleteContent: undefined,
  shareableContent: undefined,
  userQuestionPost: undefined,
  showCloserPopover: undefined,
  msgsToBeUpdated: [],
  openFirstCardDirectly: undefined,
  notificationPermissionGranted: false,
  questionCardAfterResponseScreenClose: undefined,
  showQuestionCardTutorial: undefined,
  locationPermissionGranted: undefined,
  firebaseNotification: null,
  showFadeAnimation: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.SET_CURRENT_SCREEN_INDEX:
      return { ...state, currentScreenIndex: action.payload };

    case types.SET_OPTION_FADE_ANIMATION:
      return { ...state, showFadeAnimation: action.payload };

    case types.SET_CHAT_CURRENT_SCREEN_INDEX:
      return { ...state, currentChatScreenIndex: action.payload };
    case types.SET_CURRENT_RESPONSES: {
      return {
        ...state,
        currentResponses: action.payload
      };
    }
    case types.SCROLL_TO_QUESTION_CARD: {
      return { ...state, scrollQuestionCards: action.payload };
    }
    case types.CLEAR_CURRENT_RESPONSES: {
      return {
        ...state,
        currentResponses: []
      };
    }
    case types.DELETE_CONTENT: {
      return { ...state, deleteContent: action.payload };
    }
    case types.SHARE_CONTENT: {
      return { ...state, shareableContent: action.payload };
    }
    case types.POST_USER_QUESTION_CONTENT: {
      return { ...state, userQuestionPost: action.payload };
    }

    case types.SET_QUESTION_CARD_VISIBILITY: {
      return { ...state, questionCardAfterResponseScreenClose: action.payload };
    }

    case types.SET_QUESTION_CARD_TUTORIAL_VISIBILITY: {
      return { ...state, showQuestionCardTutorial: action.payload };
    }

    case types.SHOW_CLOSER_POPOVER: {
      return { ...state, showCloserPopover: action.payload };
    }

    case types.PUSH_UPLOADING_IMAGE_MSGID: {
      return { ...state, msgsToBeUpdated: action.payload };
    }

    case types.SET_UPLOADING_MSGIMAGE_STATUS: {
      return { ...state, msgsToBeUpdated: action.payload };
    }

    case types.OPEN_FIRST_CARD_DIRECTLY: {
      return { ...state, openFirstCardDirectly: action.payload };
    }
    case types.SET_NOTIFICATION_PERMISSION: {
      return {
        ...state,
        notificationPermissionGranted: action.payload
      };
    }

    case types.SET_LOCATION_PERMISSION: {
      return {
        ...state,
        locationPermissionGranted: action.payload
      };
    }
    case types.SET_FIREBASE_NOTIFICATION: {
      return {
        ...state,
        firebaseNotification: action.payload
      };
    }

    default:
      return state;
  }
}
