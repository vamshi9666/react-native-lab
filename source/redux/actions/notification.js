import * as types from "../types/notification";

export const setChatIconDot = dot => dispatch => {
  dispatch({
    type: types.SET_CHAT_ICON_DOT,
    payload: dot
  });
};

export const setBellIconDot = dot => dispatch => {
  dispatch({
    type: types.SET_BELL_ICON_DOT,
    payload: dot
  });
};

export const setChatTextDot = dot => dispatch => {
  dispatch({
    type: types.SET_CHAT_TEXT_DOT,
    payload: dot
  });
};

export const setSentTextDot = dot => dispatch => {
  dispatch({
    type: types.SET_SENT_TEXT_DOT,
    payload: dot
  });
};

export const setReceivedTextDot = dot => dispatch => {
  dispatch({
    type: types.SET_RECEIVED_DOT,
    payload: dot
  });
};
