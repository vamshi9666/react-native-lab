import * as types from "../types/tutorials";

export const setMyCardsSeenCount = gameId => (dispatch, getState) => {
  const {
    tutorial: { myCards }
  } = getState();
  let newMyCards = Object.assign({}, myCards);
  if (newMyCards[gameId]) {
    var oldCount = parseInt(newMyCards[gameId]);
    newMyCards = { ...newMyCards, [gameId]: ++oldCount };
  } else {
    newMyCards = { ...newMyCards, [gameId]: 1 };
  }
  dispatch({
    type: types.SET_MY_CARD_SEEN_COUNT,
    payload: newMyCards
  });
};

export const setQuestionPickerSeenCount = gameId => (dispatch, getState) => {
  const {
    tutorial: { questionPickers }
  } = getState();
  let newQuestionPicker = Object.assign({}, questionPickers);
  if (newQuestionPicker[gameId]) {
    var oldCount = parseInt(newQuestionPicker[gameId]);
    newQuestionPicker = { ...newQuestionPicker, [gameId]: ++oldCount };
  } else {
    newQuestionPicker = { ...newQuestionPicker, [gameId]: 1 };
  }
  dispatch({
    type: types.SET_QUESTION_PICKER_SEEN_COUNT,
    payload: newQuestionPicker
  });
};

export const setOtherCardsSeenCount = gameId => (dispatch, getState) => {
  const {
    tutorial: { othersCards }
  } = getState();
  let newOthersCards = Object.assign({}, othersCards);
  if (newOthersCards[gameId]) {
    var oldCount = parseInt(newOthersCards[gameId]);
    newOthersCards = { ...newOthersCards, [gameId]: ++oldCount };
  } else {
    newOthersCards = { ...newOthersCards, [gameId]: 1 };
  }

  dispatch({
    type: types.SET_OTHERS_CARD_SEEN_COUNT,
    payload: newOthersCards
  });
};

export const addExpenseTutorialCount = expenseId => (dispatch, getState) => {
  const {
    tutorial: { expenses = {} }
  } = getState();
  if (expenses[expenseId]) {
    expenses[expenseId] += 1;
  } else {
    expenses[expenseId] = 1;
  }
  dispatch({
    type: types.SET_EXPENSES_TUTORIALS,
    payload: expenses
  });
};

export const setChatBoxPickerVisibility = () => dispatch => {
  dispatch({
    type: types.SET_CHATBOX_PICKER_VISIBILITY
  });
};

export const setProfileCardsTutorialVisibility = () => dispatch => {
  dispatch({
    type: types.SET_PROFILE_CARDS_TUTORIAL
  });
};

export const setReactButtonTutorialVisibility = () => dispatch => {
  dispatch({
    type: types.SET_REACT_BUTTON_TUTORIAL
  });
};

export const setReferralCode = value => dispatch => {
  dispatch({
    type: types.SET_REFERRAL_CODE,
    payload: value
  });
};

export const setTutorialRoom = roomId => dispatch => {
  dispatch({
    type: types.SET_TUTORIAL_ROOM,
    payload: roomId
  });
};

export const setHasSeenCloserPopup = () => dispatch => {
  dispatch({
    type: types.SET_CLOSER_POPUP_VISIBILITY
  });
};

export const setTutorialStartingTime = () => dispatch => {
  dispatch({
    type: types.SET_TUTORIAL_BEGIN_TIME
  });
};

export const setPresetContentModalVisibility = () => dispatch => {
  dispatch({
    type: types.SET_PRESET_CONTENT_MODAL_VISIBILITY
  });
};

export const setSentSectionTutorialVisibility = () => dispatch => {
  dispatch({
    type: types.SET_SENT_SECTION_TUTORIAL_VISIBILITY
  });
};

export const setHasSeenReactOnTheseCardsTutorial = () => dispatch => {
  dispatch({
    type: types.SET_REACT_ON_THESE_CARDS_TUTORIAL_VISIBILITY
  });
};

export const setReceivedSectionTutorialVisibility = () => dispatch => {
  dispatch({
    type: types.SET_RECEIVED_SECTION_TUTORIAL_VISIBILITY
  });
};

export const setFriendsSectionTutorialVisibility = () => dispatch => {
  dispatch({
    type: types.SET_FRIENDS_SECTION_TUTORIAL_VISIBILITY
  });
};

export const setRequestCron = payload => dispatch => {
  dispatch({
    type: types.SET_CRON_REQUEST_CRON,
    payload
  });
};

export const setResponseCron = payload => dispatch => {
  dispatch({
    type: types.SET_RESPONSE_CRON,
    payload
  });
};

export const setTopNavTabTutorials = newTabName => (dispatch, getState) => {
  const { tutorial } = getState();
  const {
    topNavTabTutotialsSeen = [],
    sentStackTutorialSeen = false,
    receivedStackTutorialSeen = false
  } = tutorial;
  const isAlreadySeenToday = topNavTabTutotialsSeen.includes(newTabName);
  if (newTabName === "SENT") {
    if (!sentStackTutorialSeen) {
      dispatch({
        type: types.SET_ONCE_SENT_STACK_TUTORIAL_SEEN,
        payload: true
      });
    }
  } else {
    if (receivedStackTutorialSeen) {
      dispatch({
        type: types.SET_ONCE_RECEIVED_STACK_TUTORIAL_SEEN,
        payload: true
      });
    }
  }
  if (!isAlreadySeenToday) {
    topNavTabTutotialsSeen.push(newTabName);
    dispatch({
      type: types.SET_TOP_NAV_TAB_TUTORIALS_SEEN,
      payload: topNavTabTutotialsSeen
    });
  }
};

export const deleteOneTopNavTabTutorial = tabName => (dispatch, getState) => {
  const { tutorial } = getState();
  const { topNavTabTutotialsSeen = [] } = tutorial;
  const newArr = topNavTabTutotialsSeen.filter(i => i !== tabName);
  dispatch({
    type: types.SET_TOP_NAV_TAB_TUTORIALS_SEEN,
    payload: newArr
  });
};
