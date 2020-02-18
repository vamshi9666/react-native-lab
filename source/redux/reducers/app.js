import * as types from "../types/app.types";

const initialState = {
  adminProps: null,
  packPrices: null,
  extendedCount: 0,
  gemPacks: null,
  userPacks: null,
  bulkPlans: null,
  sparkFailure: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.SET_ADMIN_PROPS:
      return { ...state, adminProps: action.payload };
    case types.SET_PACK_PRICES: {
      return {
        ...state,
        packPrices: action.payload
      };
    }
    case types.SET_GEM_PACKS: {
      return {
        ...state,
        gemPacks: action.payload
      };
    }
    case types.SET_USER_PACKS: {
      return {
        ...state,
        userPacks: action.payload
      };
    }
    case types.SET_BULK_PLANS: {
      return {
        ...state,
        bulkPlans: action.payload
      };
    }
    case types.SET_SPARK_FAILURE: {
      return {
        ...state,
        sparkFailure: action.payload
      };
    }
    default:
      return state;
  }
}
