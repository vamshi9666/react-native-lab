import * as types from "../types/nav";

export const pushUploadingImageMsgId = (roomId, msgId, status) => (
  dispatch,
  getState
) => {
  const {
    nav: { msgsToBeUpdated }
  } = getState();
  msgsToBeUpdated.push({
    roomId,
    status,
    msgId
  });
  dispatch({
    type: types.PUSH_UPLOADING_IMAGE_MSGID,
    payload: msgsToBeUpdated
  });
};

export const updateUploadingImageStatus = (roomId, msgId, status) => (
  dispatch,
  getState
) => {
  const {
    nav: { msgsToBeUpdated }
  } = getState();
  const msgIndex = msgsToBeUpdated.findIndex(
    msg => msg.msgId === msgId && msg.roomId === roomId
  );
  msgsToBeUpdated[msgIndex].status = status;
  dispatch({
    type: types.SET_UPLOADING_MSGIMAGE_STATUS,
    payload: msgsToBeUpdated
  });
};

export const setCurrentScreenIndex = dot => dispatch => {
  dispatch({
    type: types.SET_CURRENT_SCREEN_INDEX,
    payload: dot
  });
};

export const deleteContent = daletedItems => dispatch => {
  dispatch({
    type: types.DELETE_CONTENT,
    payload: daletedItems
  });
};

export const shareContent = shareableContent => dispatch => {
  dispatch({
    type: types.SHARE_CONTENT,
    payload: shareableContent
  });
};

export const openFirstCardDirectly = bool => dispatch => {
  dispatch({
    type: types.OPEN_FIRST_CARD_DIRECTLY,
    payload: bool
  });
};

export const setCloserPopoverVisibility = payload => dispatch => {
  dispatch({
    type: types.SHOW_CLOSER_POPOVER,
    payload
  });
};

export const postUserQuestionContent = content => dispatch => {
  dispatch({
    type: types.POST_USER_QUESTION_CONTENT,
    payload: content
  });
};

export const setQuestionCardVisibility = item => dispatch => {
  dispatch({
    type: types.SET_QUESTION_CARD_VISIBILITY,
    payload: item
  });
};

export const setQuestionCardTutorialVisibility = item => dispatch => {
  dispatch({
    type: types.SET_QUESTION_CARD_TUTORIAL_VISIBILITY,
    payload: item
  });
};

export const scrollQuestionCardsAction = gameName => dispatch => {
  dispatch({
    type: types.SCROLL_TO_QUESTION_CARD,
    payload: gameName
  });
};

export const setCurrentChatScreenIndex = dot => dispatch => {
  dispatch({
    type: types.SET_CHAT_CURRENT_SCREEN_INDEX,
    payload: dot
  });
};

export const addNewResponse = obj => async (dispatch, getState) => {
  const { nav } = getState();

  nav.currentResponses.push(obj);
  dispatch({
    type: types.SET_CURRENT_RESPONSES,
    payload: nav.currentResponses
  });
};

export const resetResponses = () => async dispatch => {
  dispatch({ type: types.CLEAR_CURRENT_RESPONSES });
};

export const setNotificationPermission = bool => dispatch => {
  dispatch({
    type: types.SET_NOTIFICATION_PERMISSION,
    payload: bool
  });
};

export const setOptionFadeAnimation = bool => dispatch => {
  dispatch({
    type: types.SET_OPTION_FADE_ANIMATION,
    payload: bool
  });
};

export const setFirebaseNotification = notificationObj => dispatch => {
  dispatch({
    type: types.SET_FIREBASE_NOTIFICATION,
    payload: notificationObj
  });
};

export const setLocationPermission = bool => dispatch => {
  dispatch({
    type: types.SET_LOCATION_PERMISSION,
    payload: bool
  });
};
