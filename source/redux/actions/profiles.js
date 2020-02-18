import * as types from "../types/profiles.types";
import _concat from "lodash/concat";
export const setThirtyProfiles = arr => dispatch => {
  dispatch({
    type: types.SET_THIRTY_PROFILES,
    payload: arr
  });
};

export const setCurrentProfileIndex = i => dispatch => {
  dispatch({
    type: types.SET_CURRENT_PROFILE_INDEX,
    payload: i
  });
};

export const setCardHideStatus = id => async (dispatch, getState) => {
  const currentProfiles = getState().profiles.thirtyProfiles;
  const filteredProfiles = currentProfiles.map(profile => {
    if (profile._id === id) {
      return {
        ...profile,
        hideProfileCards: true
      };
    } else {
      return profile;
    }
  });
  dispatch({
    type: types.SET_THIRTY_PROFILES,
    payload: filteredProfiles
  });
};

export const removeUserFromProfiles = userId => async (dispatch, getState) => {
  const {
    profiles: { thirtyProfiles, currentProfileIndex }
  } = getState();
  const filteredProfiles = thirtyProfiles.filter(profile => {
    if (profile._id === userId) {
      return;
    }
    return profile;
  });
  dispatch({
    type: types.SET_CURRENT_PROFILE_INDEX,
    payload: currentProfileIndex + 1
  });
  return dispatch({
    type: types.SET_THIRTY_PROFILES,
    payload: filteredProfiles
  });
};

export const setHasMore = bool => dispatch => {
  dispatch({
    type: types.SET_HAS_MORE,
    payload: bool
  });
};

export const sendSparkToProfile = profile_id => async (dispatch, getState) => {
  const {
    profiles: { thirtyProfiles = [] }
  } = getState();
  const newProfiles = thirtyProfiles.map(profile => {
    if (profile._id === profile_id) {
      return {
        ...profile,
        sentSpark: true
      };
    }
    return profile;
  });

  dispatch({
    type: types.SET_THIRTY_PROFILES,
    payload: newProfiles
  });
};

export const appendMoreProfiles = newProfilesArr => async (
  dispatch,
  getState
) => {
  const {
    profiles: { thirtyProfiles }
  } = getState();
  const newProfiles = Object.assign([], thirtyProfiles);
  const newRes = _concat(newProfiles, newProfilesArr);
  console.log(
    "new profiles to be set are ",
    newProfilesArr.length,
    newRes.length
  );
  dispatch({
    type: types.SET_THIRTY_PROFILES,
    payload: newRes
  });
};

export const setCreatedAt = createdAt => dispatch => {
  dispatch({
    type: types.SET_CREATED_AT,
    payload: createdAt
  });
};
