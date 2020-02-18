import * as types from "../types/profiles.types";

const initialState = {
  thirtyProfiles: [],
  currentProfileIndex: 0,
  hasMore: false,
  createdAt: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.SET_THIRTY_PROFILES:
      return { ...state, thirtyProfiles: action.payload };

    case types.SET_CURRENT_PROFILE_INDEX:
      return { ...state, currentProfileIndex: action.payload };
    case types.SET_HAS_MORE:
      return {
        ...state,
        hasMore: action.payload
      };
    case types.SET_CREATED_AT:
      return {
        ...state,
        createdAt: action.payload
      };

    default:
      return state;
  }
}
