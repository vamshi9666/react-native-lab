import * as types from "../types/userstate";

export const setUserState = state => dispatch => {
  dispatch({
    type: types.SET_USER_STATE,
    payload: state
  });
};

export const setCronState = state => dispatch => {
  dispatch({
    type: types.SET_CRON_STATE,
    payload: state
  });
};
