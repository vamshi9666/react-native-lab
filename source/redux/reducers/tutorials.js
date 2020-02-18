import * as types from "../types/tutorials";
import { getTimeStamp } from "../../config/Utils";

const initialState = {
  myCards: {},
  othersCards: {},
  questionPickers: {},
  expenses: {},
  isChatBoxPickersDisabled: 0,
  hasSeenCloserPopup: false,
  profileCardsTutorialSeen: false,
  reactButtonTutorialSeen: false,
  referralCode: undefined,
  tutorialStartedAt: undefined,
  presetContentSeen: false,
  sentReactionsTutorialSeen: false,
  receivedReactionsTutorialSeen: false,
  friendsSectionTutorialSeen: false,
  tutorialRooms: [],
  hasGotRequestCron: false,
  hasGotResponseCron: false,
  topNavTabTutorialsSeen: [],
  sentStackTutorialSeen: false,
  receivedStackTutorialSeen: false,
  hasSeenReactOnTheseCardsTutorial: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.SET_ONCE_SENT_STACK_TUTORIAL_SEEN: {
      return {
        ...state,
        sentStackTutorialSeen: action.payload
      };
    }
    case types.SET_ONCE_RECEIVED_STACK_TUTORIAL_SEEN: {
      return {
        ...state,
        receivedStackTutorialSeen: action.payload
      };
    }
    case types.SET_TOP_NAV_TAB_TUTORIALS_SEEN: {
      return {
        ...state,
        topNavTabTutorialsSeen: action.payload
      };
    }
    case types.SET_MY_CARD_SEEN_COUNT:
      return { ...state, myCards: action.payload };

    case types.SET_OTHERS_CARD_SEEN_COUNT:
      return { ...state, othersCards: action.payload };

    case types.SET_CRON_REQUEST_CRON:
      return { ...state, hasGotRequestCron: action.payload };

    case types.SET_RESPONSE_CRON:
      return { ...state, hasGotResponseCron: action.payload };

    case types.SET_QUESTION_PICKER_SEEN_COUNT:
      return { ...state, questionPickers: action.payload };

    case types.SET_PROFILE_CARDS_TUTORIAL:
      return { ...state, profileCardsTutorialSeen: true };

    case types.SET_REACT_BUTTON_TUTORIAL:
      return { ...state, reactButtonTutorialSeen: true };

    case types.SET_REFERRAL_CODE:
      return { ...state, referralCode: action.payload };

    case types.SET_EXPENSES_TUTORIALS:
      return { ...state, expenses: action.payload };

    case types.SET_TUTORIAL_ROOM:
      return {
        ...state,
        tutorialRooms: [...state.tutorialRooms, action.payload]
      };

    case types.SET_SENT_SECTION_TUTORIAL_VISIBILITY:
      return { ...state, sentReactionsTutorialSeen: true };

    case types.SET_RECEIVED_SECTION_TUTORIAL_VISIBILITY:
      return { ...state, receivedReactionsTutorialSeen: true };

    case types.SET_FRIENDS_SECTION_TUTORIAL_VISIBILITY:
      return { ...state, friendsSectionTutorialSeen: true };

    case types.SET_PRESET_CONTENT_MODAL_VISIBILITY:
      return { ...state, presetContentSeen: true };

      case types.SET_REACT_ON_THESE_CARDS_TUTORIAL_VISIBILITY:
        return { ...state, hasSeenReactOnTheseCardsTutorial: true };

    case types.SET_TUTORIAL_BEGIN_TIME:
      return { ...state, tutorialStartedAt: getTimeStamp() };

    case types.SET_CHATBOX_PICKER_VISIBILITY:
      return {
        ...state,
        isChatBoxPickersDisabled: ++state.chatBoxPickersEnabled
      };

    case types.SET_CLOSER_POPUP_VISIBILITY:
      return {
        ...state,
        hasSeenCloserPopup: true
      };

    default:
      return state;
  }
}
