import * as types from "../types/question.types";
import Lodash from "lodash";
const { isEmpty, find: _find } = Lodash;

export const setCategoryOneQuestions = arr => dispatch => {
  dispatch({
    type: types.SET_CATEGORY_ONE_QUESTIONS,
    payload: arr
  });
};

export const setCategoryTwoQuestions = arr => dispatch => {
  dispatch({
    type: types.SET_CATEGORY_TWO_QUESTIONS,
    payload: arr
  });
};

export const setCategoryThreeQuestions = arr => dispatch => {
  dispatch({
    type: types.SET_CATEGORY_THREE_QUESTIONS,
    payload: arr
  });
};

export const refreshQuestions = (category, questions, gameId) => (
  dispatch,
  getState
) => {
  dispatch({
    type: types.SET_CATEGORY_THREE_QUESTIONS,
    payload: questions
  });
};

export const setGameNames = arr => dispatch => {
  dispatch({
    type: types.SET_GAME_NAMES,
    payload: arr
  });
};

export const setAllFavouriteQuestions = data => dispatch => {
  dispatch({
    type: types.SET_FAVOURITES,
    payload: data
  });
};

export const setSingleFavouriteQuestion = (gameName, question) => (
  dispatch,
  getState
) => {
  let prevFavourites = Object.assign({}, getState().questions.favorites);
  if (isEmpty(prevFavourites[gameName])) {
    prevFavourites[gameName] = [question];
  } else {
    prevFavourites[gameName].push(question);
  }
  dispatch({
    type: types.SET_ALL_FAVOURITE_QUESTIONS,
    payload: prevFavourites
  });
};

export const removeOneFavourite = (
  gameId,
  questionId,
  category,
  questionObj
) => (dispatch, getState) => {
  const {
    questions: {
      favourites: prevFavourites,
      categoryOneGames,
      categoryTwoGames,
      categoryThreeGames
    }
  } = getState();
  console.log(" game is to  be deleted is ", gameId);
  const newFavouritesInGame = prevFavourites[gameId].filter(question => {
    if (question.questionId._id !== questionId) {
      return true;
    }
  });

  let isQuestionNew = false;
  let type;
  let payload;
  let selectedGame;
  if (category === "1") {
    const questions = categoryOneGames[gameId];
    selectedGame = categoryOneGames[gameId];
    type = types.SET_CAT_ONE_GAMES;
    console.log(" questions are >>", questions);
    questions.forEach(question => {
      isQuestionNew = question._id === questionId || isQuestionNew;
    });
    const foundQuestionIndex = _find(questions, { _id: questionId });
    questions[foundQuestionIndex] = {
      ...questions[foundQuestionIndex],
      inFav: false
    };
    payload = { categoryOneGames, [gameId]: questions };
  } else if (category === "2") {
    selectedGame = categoryOneGames[gameId];

    type = types.SET_CAT_TWO_GAMES;
    const questions = categoryTwoGames[gameId];
    payload = categoryTwoGames;
    questions.forEach(question => {
      isQuestionNew = question._id === questionId || isQuestionNew;
    });
    categoryTwoGames[gameId].push(questionObj);
  } else if (category === "3") {
    selectedGame = categoryOneGames[gameId];
    type = types.SET_CAT_THREE_GAMES;
    questions.forEach(question => {
      isQuestionNew = question._id === questionId || isQuestionNew;
    });

    categoryThreeGames[gameId].push(questionObj);
    payload = categoryThreeGames;
  }
  console.log(" is new question >>>>", isQuestionNew);
  const oldQuestions = Object.assign([], selectedGame);
  const newQuestions = oldQuestions.map(question => {
    if (question._id === questionId) {
      return {
        ...question,
        inFav: false,
        questionId: question
      };
    }
    return question;
  });
  if (isQuestionNew) {
    dispatch({
      type,
      payload: {
        [gameId]: newQuestions
      }
    });
  }

  console.log(" prev questions fil ", questionId);
  console.log(" prev questions ", prevFavourites[gameId].length);
  console.log(" prev questions  nee", newFavouritesInGame.length);
  dispatch({
    type: types.SET_FAVOURITES,
    payload: { ...prevFavourites, [gameId]: newFavouritesInGame }
  });
};

export const sendQuestionToFav = obj => async (dispatch, getState) => {
  const { category, question, userId, favId } = obj;
  const { gameId, _id } = question;
  let selectedGame;
  let type;
  const { questions: oldQestionReducer } = getState();
  const { favourites: oldFavourties } = oldQestionReducer;
  if (category === "1") {
    type = types.SET_CAT_ONE_GAMES;
    console.log(" one ");
    selectedGame = oldQestionReducer.categoryOneGames[gameId];
  } else if (category === "2") {
    type = types.SET_CAT_TWO_GAMES;
    console.log(" two ");

    selectedGame = oldQestionReducer.categoryTwoGames[gameId];
  } else if (category === "3") {
    console.log(" three ");

    type = types.SET_CAT_THREE_GAMES;
    selectedGame = oldQestionReducer.categoryThreeGames[gameId];
  }
  if (!selectedGame) {
    return;
  }

  console.log(" question each cheack is ", question);
  const oldQuestions = Object.assign([], selectedGame);
  const newQuestions = oldQuestions.map(question => {
    if (question._id === _id) {
      return {
        ...question,
        inFav: true,
        questionId: question,
        favId
      };
    }
    return question;
  });
  let newFavourites = Object.assign([], oldFavourties);
  console.log(" lost the check ", newQuestions);
  let selectedFavCat = newFavourites[gameId];

  if (selectedFavCat) {
    selectedFavCat.push({
      questionId: question,
      category,
      favId
    });
  } else {
    selectedFavCat = [{ questionId: question, category, favId }];
  }

  dispatch({
    type,
    payload: { [gameId]: newQuestions }
  });
  dispatch({
    type: types.SET_FAVOURITES,
    payload: { ...newFavourites, [gameId]: selectedFavCat }
    // newFavourites,
  });
};

export const processAndSetQuestions = (
  questionsArr,
  favsObj,
  postsArr,
  actionType
) => async (dispatch, getState) => {
  const { categoryOneGames, categoryTwoGames, categoryThreeGames } = getState();
  const favGameKeys = Object.keys(favsObj);
  const res = {};
  const questions = questionsArr.map(game => {
    const processedQuestions = game.questionIds.map(question => {
      const { _id: questionId, gameId } = question;
      const foundQuestionInFavs = _find(favsObj[gameId], eachFav => {
        return eachFav.questionId._id === questionId;
      });
      if (foundQuestionInFavs !== undefined) {
        console.log(" found one question in favourites", foundQuestionInFavs);
        question = {
          ...question,
          inFav: true,
          favId: foundQuestionInFavs._id,
          questionId: question
        };
      }
      const foundQuestionInPosts = _find(postsArr, eachPost => {
        eachPost.questionId._id === questionId;
      });
      if (foundQuestionInPosts !== undefined) {
        console.log(" found one question is post");
        question = {
          questionId: question,
          post_status: foundQuestionInPosts.status,
          post_option: foundQuestionInPosts.option,
          inPosts: true
        };
      }
      return question;
    });
    game = { ...game, questionIds: processedQuestions };
    res[game.gameId] = game.questionIds;
    return game;
  });

  console.log(" questions are >>>", res);
  // return;
  dispatch({
    type: actionType, //from props
    payload: res
  });
};

export const adddNewFavOverriding = (question, favId) => async (
  dispatch,
  getState
) => {
  const { category, gameId, _id } = question;
  let selectedGame;
  let type;
  const { questions: oldQestionReducer } = getState();
  const { favourites: oldFavourties } = oldQestionReducer;
  oldFavourties[gameId].shift();

  if (category === "1") {
    type = types.SET_CAT_ONE_GAMES;
    console.log(" one ");
    selectedGame = oldQestionReducer.categoryOneGames[gameId];
  } else if (category === "2") {
    type = types.SET_CAT_TWO_GAMES;
    console.log(" two ");

    selectedGame = oldQestionReducer.categoryTwoGames[gameId];
  } else if (category === "3") {
    console.log(" three ");

    type = types.SET_CAT_THREE_GAMES;
    selectedGame = oldQestionReducer.categoryThreeGames[gameId];
  }
  if (!selectedGame) {
    return;
  }

  console.log(" question each cheack is ", question);
  const oldQuestions = Object.assign([], selectedGame);
  const newQuestions = oldQuestions.map(question => {
    if (question._id === _id) {
      return {
        ...question,
        inFav: true,
        questionId: question,
        favId
      };
    }
    return question;
  });
  let newFavourites = Object.assign([], oldFavourties);
  console.log(" lost the check ", oldFavourties[gameId]);
  let selectedFavCat = newFavourites[gameId];

  if (selectedFavCat) {
    selectedFavCat.push({
      questionId: question,
      category,
      favId
    });
  } else {
    selectedFavCat = [{ questionId: question, category, favId }];
  }

  dispatch({
    type,
    payload: { [gameId]: newQuestions }
  });
  dispatch({
    type: types.SET_FAVOURITES,
    payload: { ...newFavourites, [gameId]: selectedFavCat }
  });
};
