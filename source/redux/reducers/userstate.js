import * as types from "../types/userstate";

const initialState = {
  authState: undefined,
  cronState: undefined
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.SET_USER_STATE:
      return { ...state, authState: action.payload };

    case types.SET_CRON_STATE:
      return { ...state, cronState: action.payload };

    default:
      return state;
  }
}
