import * as types from "../types/content";
import _find from "lodash/find";
import _findIndex from "lodash/findIndex";
import _unionBy from "lodash/unionBy";
export const setQuestionsOnce = (
  allGamesWithQuestions = [],
  allFavs = {},
  allPosts = [],
  ...args
) => async dispatch => {
  // allPosts.forEach(post => {
  //   const {questionId:{ gameId:{ _id : gameId}}}  = post;
  //   const existingGameInQuestions = _find(allQuestions,{ gameId});
  //   if(existingGameInQuestions){
  //     allQuestions
  //   }
  // })
  // }
  let res = {};
  allGamesWithQuestions.forEach(game => {
    const { gameId } = game;
    // allPosts.forEach(post => {
    //   let inQuestions = false;
    //   game.questionIds.forEach(question => {
    //     inQuestions = inQuestions || question._id === post.questionId._id;
    //   });
    //   if (!inQuestions && post.questionId.gameId._id === gameId) {
    //     game.questionIds.push({
    //       ...post.questionId,
    //       option: post.option,
    //       postId: post._id
    //     });
    //   }
    // });
    // if (!allFavs[gameId]) {
    //   console.log(" not found are ", gameId);
    // }
    // allFavs[gameId] &&
    //   allFavs[gameId].forEach(fav => {
    //     let inQuestions = false;
    //     game.questionIds.forEach(question => {
    //       inQuestions = inQuestions || question._id === fav.questionId._id;
    //     });
    //     if (!inQuestions) {
    //       game.questionIds.push({
    //         ...fav.questionId,
    //         favId: fav._id
    //       });
    //     }
    //   });
    // const processedQuestions = game.questionIds.map(question => {
    //   const { _id: questionId, gameId } = question;
    // const foundQuestionInFavs = _find(allFavs[gameId], eachFav => {
    //   return eachFav.questionId._id === questionId;
    // });
    // if (foundQuestionInFavs !== undefined) {
    //   console.log(" found one question in favourites", foundQuestionInFavs);
    //   question = {
    //     ...question,
    //     favId: foundQuestionInFavs._id
    //   };
    // }

    // const foundQuestionInPosts = _find(allPosts, eachPost => {
    //   eachPost.questionId._id === questionId;
    // });
    // if (foundQuestionInPosts !== undefined) {
    //   console.log(" found one question is post");
    //   question = {
    //     //   questionId: question,
    //     postOption: foundQuestionInPosts.option,
    //     postId: foundQuestionInPosts._id
    //   };
    // }
    //   return question;
    // });
    // game = { ...game, questionIds: game.questionIds };
    const questions = game.questionIds.map(q => {
      return {
        ...q,

        gameId: game.gameId,
        // "gameId": "5dbfd7b52d3cc669f5b2ef0b",
        // "userId": "5dc00d3457a8ca2a0063e134",
        // "createdAt": 1574513693,
        // "updatedAt": 1574513693,
        // },
        new: true
      };
    });

    res[game.gameId._id] = questions;
  });
  const resGameIds = Object.keys(res);
  const favGameids = Object.keys(allFavs);
  favGameids.forEach(gameId => {
    if (resGameIds.includes(gameId)) {
      // all questions have this game
      const favGameQuestions = allFavs[gameId];
      const resGameQuestions = res[gameId];
      favGameQuestions.forEach(
        ({ questionId: question, _id: favId, createdAt: favCreatedAt }) => {
          const { _id: questionId } = question;

          const foundQuestionIndex = _findIndex(resGameQuestions, question => {
            return question._id === questionId;
          });

          if (foundQuestionIndex !== -1) {
            //found this question
            resGameQuestions[foundQuestionIndex] = {
              ...resGameQuestions[foundQuestionIndex],
              favId,
              favCreatedAt
            };
          } else {
            resGameQuestions.push({
              ...question,
              favId,
              favCreatedAt
            });
          }
        }
      );
    } else {
      res[gameId] = [];
      const favGameQuestions = allFavs[gameId];
      favGameQuestions.forEach(fav => {
        res[gameId].push({
          ...fav.questionId,
          favId: fav._id,
          favCreatedAt: fav.createdAt
        });
      });

      //all question dont have this game
    }
  });

  // const gamePosts = allPosts.filter(i => i.questionId.gameId._id === gameI)
  allPosts.forEach((post, postIndex) => {
    const {
      gameId: { _id: gameId },
      _id: questionId
    } = post.questionId;
    // if(gameId )
    if (resGameIds.includes(gameId)) {
      const resGameQuestions = res[gameId];
      // postGameQuestions.map((post, postIndex) => {
      const { questionId: question } = post;
      const foundQuestionIndex = _findIndex(resGameQuestions, {
        _id: questionId
      });
      if (foundQuestionIndex !== -1) {
        resGameQuestions[foundQuestionIndex] = {
          ...resGameQuestions[foundQuestionIndex],
          postId: post._id,
          option: post.option,
          postOrder: post.postOrder || 3
          // new: true
        };
      } else {
        resGameQuestions.push({
          ...question,
          postId: post._id,
          option: post.option,
          postOption: post.postOrder || 3,
          new: false
        });
      }
      // });
    } else {
      res[gameId] = [];
      const postGameQuestions = allPosts.filter(
        i => i.questionId.gameId._id === gameId
      );
      postGameQuestions.forEach((post, postIndex) => {
        res[gameId].push({
          ...post.questionId,
          postId: post._id,
          option: post.option,
          postOrder: post.postOption || 3
        });
      });
    }
  });

  dispatch({ type: types.SET_CONTENT, payload: res });
};

export const makeOneQuestionFav = (
  questionId,
  gameId,
  favId,
  favCreatedAt
) => async (dispatch, getState) => {
  const {
    content: { questions = [] }
  } = getState();
  const newQuestions = questions[gameId].map(question => {
    if (question._id === questionId) {
      question = {
        ...question,
        favId,
        favCreatedAt
      };
    }
    return question;
  });
  dispatch({ type: types.SET_ONE_GAME_CONTENT, payload: newQuestions, gameId });
};

export const removeFav = (questionId, gameId, favId) => async (
  dispatch,
  getState
) => {
  const {
    content: { questions = [] }
  } = getState();

  const newQuestions = questions[gameId].map(question => {
    if (question._id === questionId) {
      delete question.favId;
      delete question.favCreatedAt;
    }
    return question;
  });
  dispatch({
    type: types.SET_ONE_GAME_CONTENT,
    gameId: gameId,
    payload: newQuestions
  });
};

export const addEditedPost = (question, gameId) => async (
  dispatch,
  getState
) => {
  const {
    content: { questions = {} }
  } = getState();

  const currentGameContent = questions[gameId];

  currentGameContent.push(question);

  dispatch({
    type: types.SET_ONE_GAME_CONTENT,
    gameId,
    payload: currentGameContent
  });
};

export const deleteEditedPost = (questionId, gameId, isFav = false) => async (
  dispatch,
  getState
) => {
  const {
    content: { questions = {} }
  } = getState();
  let currentGameContent = questions[gameId];
  const questionIndexFromStore = currentGameContent.findIndex(
    question => question._id === questionId
  );
  if (isFav) {
    delete currentGameContent[questionIndexFromStore].postId;
    delete currentGameContent[questionIndexFromStore].option;
    delete currentGameContent[questionIndexFromStore].postOrder;
  } else {
    currentGameContent.splice(questionIndexFromStore, 1);
  }
  dispatch({
    type: types.SET_ONE_GAME_CONTENT,
    gameId,
    payload: currentGameContent
  });
};

export const addPost = (
  questionId,
  gameId,
  postId,
  option,
  postOrder
) => async (dispatch, getState) => {
  const {
    content: { questions = {} }
  } = getState();
  const newQuestions = questions[gameId].map(question => {
    if (question._id === questionId) {
      question = {
        ...question,
        postId,
        option,
        postOrder
      };
      console.log(" post order is ", postOrder);
    }
    return question;
  });

  dispatch({ type: types.SET_ONE_GAME_CONTENT, gameId, payload: newQuestions });
};

export const deletePost = (questionId, gameId, postId) => async (
  dispatch,
  getState
) => {
  const {
    content: { questions }
  } = getState();
  const otherPost = _findIndex(questions[gameId], { postId: !postId });
  const newQuestions = questions[gameId].map(question => {
    if (question._id === questionId) {
      delete question.postId;
      delete question.option;
      delete question.postOrder;
    }

    return question;
  });

  dispatch({ type: types.SET_ONE_GAME_CONTENT, gameId, payload: newQuestions });
};

//
export const setQuestionsOnceee = (
  allQuestions = [],
  allFavs = {},
  allPosts = [],
  ...args
) => async dispatch => {
  try {
    let res = {};
    allQuestions.forEach(game => {
      const { gameId } = game;
      allPosts.forEach(post => {
        let inQuestions = false;
        game.questionIds.forEach(question => {
          inQuestions = inQuestions || question._id === post.questionId._id;
        });
        if (!inQuestions && post.questionId.gameId._id === gameId) {
          game.questionIds.push({
            ...post.questionId,
            option: post.option,
            postId: post._id
          });
        }
      });
      allFavs[gameId] &&
        allFavs[gameId].forEach(fav => {
          let inQuestions = false;
          game.questionIds.forEach(question => {
            inQuestions = inQuestions || question._id === fav.questionId._id;
          });
          if (!inQuestions) {
            game.questionIds.push({
              ...fav.questionId,
              favId: fav._id
            });
          }
        });
      const processedQuestions = game.questionIds.map(question => {
        const { _id: questionId, gameId } = question;
        const foundQuestionInFavs = _find(allFavs[gameId], eachFav => {
          return eachFav.questionId._id === questionId;
        });
        if (foundQuestionInFavs !== undefined) {
          question = {
            ...question,
            favId: foundQuestionInFavs._id
          };
        }

        const foundQuestionInPosts = _find(allPosts, eachPost => {
          eachPost.questionId._id === questionId;
        });
        if (foundQuestionInPosts !== undefined) {
          question = {
            //   questionId: question,
            postOption: foundQuestionInPosts.option,
            postId: foundQuestionInPosts._id
          };
        }
        return question;
      });
      game = { ...game, questionIds: processedQuestions };
      res[game.gameId] = game.questionIds;
    });
    dispatch({ type: types.SET_CONTENT, payload: res });
  } catch (error) {
    console.log(" here comes errror is ", error);
  }
};

export const deleteOneGamePosts = gameId => async (dispatch, getState) => {
  const {
    content: { questions = [] }
  } = getState();
  const oldQuestions = questions[gameId];
  const newQuestions = oldQuestions.map(q => {
    delete q.postId;
    delete q.option;
    return q;
  });
  dispatch({
    type: types.SET_ONE_GAME_CONTENT,
    gameId,
    payload: newQuestions
  });
};

export const updateOnePostOrder = (
  postId,
  gameId,
  questionId,
  toValue
) => async (dispatch, getState) => {
  const questions = getState().content.questions;

  console.log("  *1  old new  questions are ", questions);
  const oldQuestions = questions[gameId];
  const newQuestions = oldQuestions.map(question => {
    if (question.postId === postId) {
      return {
        ...question,
        postOrder: toValue
      };
    } else {
      return question;
    }
  });

  console.log(" new questions are ", newQuestions);
  dispatch({
    type: types.SET_ONE_GAME_CONTENT,
    gameId,
    payload: newQuestions
  });
};

export const updateWithNewQuestions = (gameId, newQuestions) => async (
  dispatch,
  getState
) => {
  const {
    content: { questions }
  } = getState();
  const thisGameQuestions = questions[gameId];

  const useFullQuestions = thisGameQuestions.filter((question, qIndex) => {
    if (question.favId || question.postid) {
      return;
    }
  });
};

export const setSeenQuestions = (seenQuestions = []) => async dispatch => {
  dispatch({
    type: types.SET_SEEN_QUESTIONS,
    payload: seenQuestions
  });
};

export const updateContentQuestions = newSeenQuestionsObj => async (
  dispatch,
  getState
) => {
  const {
    content: { questions, seenQuestions }
  } = getState();
  const { questionIds } = newSeenQuestionsObj;
  const thisGameContent = questions[newSeenQuestionsObj.gameId];
  // const manipulated = thisGameContent.map(m => {
  // m.category === "3" ? "2" : m.category;
  // return {
  // ...m,
  // category: m.category === "3" ? "2" : m.category
  // };
  // });
  let oldRemainingQuestions = thisGameContent.filter(question => {
    if (question.category === newSeenQuestionsObj.category) {
      if (question.favId || question.postId) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  });
  console.log(
    " new debug seee old remaining question are ",
    oldRemainingQuestions
  );
  console.log("new debug seee new to be set quessions are ", questionIds);
  const processNewQuestions = questionIds.map(q => {
    return {
      ...q,
      new: true
    };
  });
  const newQuestions = _unionBy(
    oldRemainingQuestions,
    processNewQuestions,
    "_id"
  );
  dispatch({
    type: types.SET_ONE_GAME_CONTENT,
    gameId: newSeenQuestionsObj.gameId,
    payload: newQuestions
  });
  // const newQuestionIds = questionIds.map(q => q._id);
  const newSeenQuestions = seenQuestions.map(seenQuestion => {
    if (
      seenQuestion.gameId === newSeenQuestionsObj.gameId &&
      seenQuestion.category === newSeenQuestionsObj.category
    ) {
      return {
        ...newSeenQuestionsObj
      };
    } else {
      return seenQuestion;
    }
  });
  dispatch({
    type: types.SET_SEEN_QUESTIONS,
    payload: newSeenQuestions
  });
  return;
};
