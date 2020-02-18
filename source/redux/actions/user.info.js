import * as types from "../types/user.info";
import * as roomTypes from "../types/chats";
import * as profileTypes from "../types/profiles.types";
import _find from "lodash/find";
export const addUserInfo = (key, value) => async dispatch => {
  dispatch({
    type: types.ADD_INFO,
    key,
    value
  });
};

export const deleteUserInfo = key => async (dispatch, getState) => {
  const {
    info: { userInfo }
  } = getState();
  const localUserInfo = Object.assign({}, userInfo);
  delete localUserInfo[key];
  dispatch({
    type: types.DELETE_INFO,
    payload: localUserInfo
  });
};

export const initDump = data => async dispatch => {
  return dispatch({
    type: types.INIT_DUMP,
    payload: data
  });
};

export const setPostss = postsArr => async dispatch => {
  let processedPosts = {};
  postsArr.forEach(question => {
    const questionId = question.questionId.gameId._id;
    if (processedPosts[questionId]) {
      processedPosts[questionId].push(question);
    } else {
      processedPosts[questionId] = [];
      processedPosts[questionId].push(question);
    }
  });
  dispatch({
    type: types.SET_POSTS,
    payload: processedPosts
  });
};

export const updateOwnProfile = obj => async dispatch => {
  dispatch({
    type: types.UPDATE_OWN_PROFILE,
    payload: obj
  });
  return;
};

export const setReasons = arr => async dispatch => {
  dispatch({
    type: types.SET_REASONS,
    payload: arr
  });
};

export const removeUserFromRooms = obj => async (dispatch, getState) => {
  const currentRooms = getState().rooms.rooms;
  const { blockedBy, user } = obj;
  const roomToBeRemoved = _find(currentRooms, {
    postedBy
  });
  const newRooms = currentRooms.filter(room => {
    // if(room.)
    return room;
  });
};

export const removeUserFromProfiles = userId => async (dispatch, getState) => {
  const currentProfiles = getState().profiles.thirtyProfiles;
  const filteredProfiles = currentProfiles.filter(profile => {
    if (profile._id === userId) {
      return;
    }
    return profile;
  });
  dispatch({
    type: profileTypes.SET_THIRTY_PROFILES,
    payload: filteredProfiles
  });
};

export const setPosts = (
  postsArr = []
  // favsObj
) => async (dispatch, getState) => {
  const {
    questions: { favourites: favsObj }
  } = getState();
  console.log(" favs obj is ", favsObj);
  let processedPosts = {};
  postsArr.forEach((eachPost, postIndex) => {
    const { questionId: question } = eachPost;
    const gameId = question.gameId._id;
    const foundInFav = _find(favsObj[question.gameId._id], eachFav => {
      console.log(" found one fav in post");
      return eachFav.questionId._id === question._id;
    });
    if (foundInFav !== undefined) {
      eachPost = {
        ...eachPost,
        inFav: true,
        favId: foundInFav._id
      };
    }
    if (processedPosts[gameId]) {
      processedPosts[gameId].push(eachPost);
    } else {
      processedPosts[gameId] = [];
      processedPosts[gameId].push(eachPost);
    }
    // return eachPost;
  });
  console.log(" new posts with favs init are >>>", processedPosts);
  dispatch({
    type: types.SET_POSTS,
    payload: processedPosts
  });
};

export const setAllGamePosts = allGamesPostsObj => dispatch => {
  dispatch({ type: types.SET_ALL_GAME_POSTS, payload: allGamesPostsObj });
};

export const setOneGamePosts = (gameId, oneGamePosts) => (
  dispatch,
  getState
) => {
  const {
    info: { posts }
  } = getState();

  // const oldPosts = posts[gameId];
  let payload = {
    [gameId]: oneGamePosts
  };
  dispatch({ type: types.SET_ONE_GAME_POSTS, payload: payload });
};

//inside game
export const addNewPostIntoGame = (gameId, postObj) => (dispatch, getState) => {
  const {
    info: { posts }
  } = getState();
  const oldGamePosts = posts[gameId] || [];
  if (oldGamePosts.length < 2) {
    oldGamePosts.push(postObj);

    dispatch({
      type: types.SET_ONE_GAME_POSTS,
      payload: { [gameId]: oldGamePosts }
    });
  } else {
    console.log(" game already has two posts ,");
  }
};
export const replacePostInGame = (gameId, oldPostId, newPostObj) => (
  dispatch,
  getState
) => {
  const {
    info: { posts: allGamePosts }
  } = getState();
  const oldGamePosts = allGamePosts[gameId];
  const newGamePosts = oldGamePosts.filter(post => post._id !== oldPostId);
  console.log("oldGamePOsts are", oldGamePosts);
  console.log("newGamePOsts are", newGamePosts);

  newGamePosts.push(newPostObj);
  dispatch({
    type: types.SET_ONE_GAME_POSTS,
    payload: { [gameId]: newGamePosts }
  });
};

export const removePostInGame = (gameId, postId) => (dispatch, getState) => {
  const {
    info: { posts: allGamePosts }
  } = getState();
  const oldGamePosts = allGamePosts[gameId];

  const newGamePosts = oldGamePosts.filter(post => post._id !== postId);
  const payload = {
    [gameId]: newGamePosts
  };
  dispatch({ type: types.SET_ONE_GAME_POSTS, payload });
};

export const removeOnegame = gameId => async (dispatch, getState) => {
  const {
    info: { posts: allGamePosts }
  } = getState();
  console.log(" calleding removeoneGame ", gameId);
  if (allGamePosts && allGamePosts[gameId]) {
    delete allGamePosts[gameId];
    return dispatch({ type: types.SET_ALL_GAME_POSTS, payload: allGamePosts });
  } else {
    return;
  }
};

export const replaceWholeOneGameWithNewGame = (
  oldGameid,
  newGameId,
  newGamePosts
) => async (dispatch, getState) => {
  let {
    info: { posts: allGamePosts }
  } = getState();

  if (allGamePosts[oldGameid]) {
    delete allGamePosts[oldGameid];
  }
  allGamePosts = {
    ...allGamePosts,
    [newGameId]: newGamePosts
  };
  dispatch({ type: types.SET_ONE_GAME_POSTS, payload: allGamePosts });
};

export const setInstaPhotos = photos => async dispatch => {
  console.log(" photos are ", photos);

  const instaImages = photos.map(photo => {
    return {
      url: photo.images.standard_resolution.url,
      created_time: photo.created_time
    };
  });
  dispatch({
    type: types.SET_INSTA_PHOTOS,
    payload: instaImages
  });
};

export const setAuthToken = token => async dispatch => {
  dispatch({ type: types.SET_AUTH_TOKEN, payload: token });
};

export const setPostsOrder = (oldGameId, newGameId) => async (
  dispatch,
  getState
) => {
  const {
    info: {
      userInfo: { posts = [] }
    }
  } = getState();
  const newOrder = posts.map(gameId => {
    return gameId === oldGameId ? newGameId : gameId;
  });
  dispatch({
    type: types.SET_POSTS_ORDER,
    payload: newOrder
  });
};
