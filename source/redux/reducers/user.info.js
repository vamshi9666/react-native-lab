import * as types from "../types/user.info";

const initialState = {
  userInfo: {
    name: null,
    date_of_birth: null,
    gender: null,
    college: null,
    mobile_number: null,
    email: null,
    showName: false,
    showGender: true,
    images: null,
    organization: null,
    jobTitle: null,
    insta_images: []
  },
  pictureChangedTimes: 0,
  reasons: [],
  posts: {},
  instaPhotos: [],
  authToken:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGMwMGQzNDU3YThjYTJhMDA2M2UxMzQiLCJuYW1lIjoic2hhcmFkYSIsImRhdGVfb2ZfYmlydGgiOiIyNy8xLzE5OTYiLCJuYXRpdmVfcGxhY2UiOiJuYXRpdmUgcGxhY2UiLCJtb2JpbGVfbnVtYmVyIjoiNzAxMDAxMjQxMiIsImNyZWF0ZWRBdCI6MTU3Mjg2NzM4MSwidXNlcl9pbmRleCI6MTcsImlhdCI6MTU3NTAzNzIzOH0.g05GoZ-dtPq3EazGb52LRx2rZGvEi9TxaG1GADILYb0"
};

export default function app(state = initialState, action = {}) {
  switch (action.type) {
    case types.ADD_INFO:
      return {
        ...state,
        userInfo: { ...state.userInfo, [action.key]: action.value }
      };
    case types.DELETE_INFO:
      return {
        ...state,
        userInfo: action.payload
      };
    case types.INIT_DUMP: {
      return { ...state, userInfo: { ...state.userInfo, ...action.payload } };
    }
    case types.SET_AUTH_TOKEN: {
      return {
        ...state,
        authToken: action.payload
      };
    }
    case types.SET_POSTS: {
      return { ...state, posts: action.payload };
    }
    case types.UPDATE_OWN_PROFILE: {
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          ...action.payload
        }
      };
    }
    case types.SET_REASONS: {
      return {
        ...state,
        reasons: action.payload
      };
    }
    case types.INCRIMENT_IMAGE_CHAGNED:
      return {
        ...state,
        pictureChangedTimes: state.pictureChangedTimes + 1
      };
    case types.SET_ALL_GAME_POSTS: {
      return {
        ...state,
        posts: action.payload
      };
    }
    case types.SET_ONE_GAME_POSTS: {
      const { payload } = action;
      return {
        ...state,
        posts: {
          ...state.posts,
          ...payload
        }
      };
    }
    case types.SET_INSTA_PHOTOS:
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          insta_images: action.payload
        }
      };

    case types.SET_POSTS_ORDER:
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          posts: action.payload
        }
      };
    default:
      return state;
  }
}
