import {
  getMethod,
  postMethod,
  putMethod,
  deleteMethod
} from "../config/Api.calls";

export const addCreatedQuestionMethod = async (data, cb) => {
  let res = await postMethod(`/questions/created/add`, data);
  cb(res);
};

export const editPostedQuestionMethod = async (data, cb) => {
  let res = await putMethod(`/questions/posted/update`, data);
  cb(res);
};

export const getCreatedQuestionMethod = async cb => {
  let res = await getMethod(`/questions/created/get`);
  cb(res);
};

export const getAllQuestions = async (category, cb) => {
  let resp = await getMethod(`/questions/questions/all/${category}`);
  cb(resp);
};

export const getLatestQuestions = async (
  gameId,
  category,
  qIndex,
  tappedCount,
  cb
) => {
  let resp = await getMethod(
    `/questions/latest/get/${gameId}/${category}/${qIndex}/${tappedCount}`
  );
  cb(resp);
};

export const postResponse = async (data, cb) => {
  let resp = await postMethod("/questions/response/add", data);
  cb(resp);
};

export const addResponseFromChat = async (data, cb) => {
  let resp = await postMethod("/questions/response/add/chat", data);
  cb(resp);
};

export const getMyResponses = async cb => {
  let resp = await getMethod(`/questions/response/self/get`);
  cb(resp);
};

export const getResponsesToMe = async cb => {
  let resp = await getMethod(`/questions/response/other/get`);
  cb(resp);
};
export const getGameNames = async cb => {
  let resp = await getMethod(`/questions/names`);
  cb(resp);
};

export const addFavourites = async (data, cb) => {
  let resp = await postMethod(`/questions/favourites/add`, data);
  cb(resp);
};

export const getFavourites = async (category, cb) => {
  let resp = await getMethod(`/questions/favourites/get/${category}`);
  cb(resp);
};

export const deleteFavourites = async (data, cb) => {
  let resp = await deleteMethod(`/questions/favourites/delete`, data);
  cb(resp);
};

export const addQuestionPostbyUser = async (data, cb) => {
  let resp = await postMethod(`/questions/questions/add/user`, data);
  cb(resp);
};

export const addPostMethod = async (data, cb) => {
  let res = await postMethod(`/questions/post`, data);
  cb(res);
};

export const editPostMethod = async (data, postId, cb) => {
  let res = await putMethod(`/questions/posted/edit/${postId}`, data);
  cb(res);
};

export const deletePostMethod = async (data, cb) => {
  let res = await deleteMethod(`/questions/posted/delete`, data);
  cb(res);
};

export const refreshQuestions = async (
  gameId,
  category,
  qIndex,
  tappedCount,
  cb
) => {
  let resp = await getMethod(
    `/questions/latest/get/${gameId}/${category}/${qIndex}/${tappedCount}`
  );
  cb(resp);
};
