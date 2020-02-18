import * as types from "../types/apollo";
const initState = {
  client: null
};
export default (state = initState, action) => {
  switch (action.type) {
    case types.SET_CLIENT:
      return {
        ...state,
        client: action.payload
      };

    default:
      return state;
  }
};
