import * as types from "../types/question.types";
const defaultState = {
  categoryOneGames: {},
  categoryTwoGames: {},
  categoryThreeGames: {},
  gameNames: [],
  favourites: {}
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case types.SET_CATEGORY_ONE_QUESTIONS:
      return { ...state, categoryOneGames: action.payload };

    case types.SET_CATEGORY_TWO_QUESTIONS:
      return { ...state, categoryTwoGames: action.payload };

    case types.SET_CATEGORY_THREE_QUESTIONS:
      return { ...state, categoryThreeGames: action.payload };

    case types.REFRESH_QUESTIONS:
      return { ...state, [action.gameCategory]: action.payload };

    case types.SET_CAT_ONE_GAMES: {
      return {
        ...state,
        categoryOneGames: { ...state.categoryOneGames, ...action.payload }
      };
    }
    case types.SET_CAT_TWO_QUESTIONS: {
      return {
        ...state,
        categoryTwoGames: { ...state.categoryTwoGames, ...action.payload }
      };
    }
    case types.SET_CAT_THREE_GAMES: {
      return {
        ...state,
        categoryThreeGames: { ...state.categoryThreeGames, ...action.payload }
      };
    }
    case types.SET_FAVOURITES: {
      return {
        ...state,
        favourites: action.payload
      };
    }
    case types.SET_GAME_NAMES: {
      return {
        ...state,
        gameNames: action.payload
      };
    }
    case types.SET_ALL_FAVOURITE_QUESTIONS:
      return {
        ...state,
        favourites: action.payload
      };

    case types.SET_SINGLE_FAVOURITE_QUESTION:
      return {
        ...state,
        favourites: action.payload
      };

    case types.REMOVE_FAVOURITE:
      return {
        ...state,
        favourites: action.payload
      };
    default:
      return state;
  }
}
