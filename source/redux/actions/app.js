import * as types from "../types/app.types";

export const setAdminProps = arr => dispatch => {
  dispatch({
    type: types.SET_ADMIN_PROPS,
    payload: arr
  });
};

export const setPackPrices = arr => dispatch => {
  dispatch({
    type: types.SET_PACK_PRICES,
    payload: arr
  });
};

export const incrimentExtendedCount = newCount => dispatch => {
  dispatch({ type: types.SET_EXTENDED_COUNT, payload: newCount });
};

export const setGemPacks = (gemPacksArr = []) => dispatch => {
  const newArr = gemPacksArr.sort((a, b) => {
    return a.gemsCount - b.gemsCount;
  });
  dispatch({ type: types.SET_GEM_PACKS, payload: newArr });
};

export const setUserPacks = userPacksArr => dispatch => {
  dispatch({
    type: types.SET_USER_PACKS,
    payload: userPacksArr
  });
};

export const setBulkPlans = plansArr => dispatch => {
  dispatch({
    type: types.SET_BULK_PLANS,
    payload: plansArr
  });
};

export const addSparkFailure = newSparkfailure => dispatch => {
  dispatch({
    type: types.SET_SPARK_FAILURE,
    payload: newSparkfailure
  });
};

export const removeOnefailure = () => dispatch => {
  dispatch({
    type: types.SET_SPARK_FAILURE,
    payload: null
  });
};
