import * as types from "../types/chats";

export const pushAndSendMessage = data => dispatch => {
  dispatch({
    type: types.PUSH_AND_SEND_MESSAGES,
    payload: data
  });
};
