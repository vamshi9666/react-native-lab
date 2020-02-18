import * as types from "../types/content";

const defaultState = {
  questions: {},
  seenQuestions: []
};
export default (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.SET_CONTENT:
      return {
        ...state,
        questions: payload
      };
    case types.SET_ONE_GAME_CONTENT:
      const { gameId } = action;
      return {
        ...state,
        questions: { ...state.questions, [gameId]: payload }
      };

    case types.SET_SEEN_QUESTIONS: {
      return {
        ...state,
        seenQuestions: action.payload
      };
    }
    default:
      return state;
  }
};
