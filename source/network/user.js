import { getMethod, postMethod, putMethod } from "../config/Api.calls";
import axios from "axios";
import { INSTA_API_URL } from "../config/Constants";
export const getThirtyProfiles = async cb => {
  let resp = await getMethod("/profile/thirty");
  cb(resp);
};

export const getMyData = async cb => {
  const resp = await getMethod("/auth/me");
  cb(resp);
};

export const getPosts = async (userId, cb) => {
  const resp = await getMethod("/questions/posted/get/" + userId);
  cb(resp);
};

export const updateOtherUser = async (userId, updates, cb) => {
  const resp = await putMethod("/user/update/other", {
    id: userId,
    ...updates
  });
  cb(resp);
};
export const updateProfile = async (data, cb) => {
  const resp = await putMethod("/user/update", data);
  cb(resp);
};

export const getBlockReaons = async cb => {
  const resp = await getMethod("/reason/");
  cb(resp);
};

export const blockOneUser = async (body, cb) => {
  const resp = await postMethod("/blocked/add", body);
  cb(resp);
};

export const getMasterDataOnce = async (type, cb) => {
  const resp = await getMethod(`/auth/master/data/once?type=${type}`);
  cb(resp);
};

export const getMasterDataLatest = async cb => {
  const resp = await getMethod("/auth/master/data/latest");
  cb(resp);
};

export const addFriend = async (body, cb) => {
  let resp = await postMethod(`/user/friends/add`, body);
  cb(resp);
};

export const updateFriend = async (body, cb) => {
  let resp = await postMethod(`/user/friends/update`, body, false);
  cb(resp);
};

export const getInstaPosts = async token => {
  const resp = await axios({
    url: INSTA_API_URL + token,
    method: "GET"
  });
  return resp.data;
};

export const getLiveStatus = async (userId, cb) => {
  const resp = await getMethod("/user/live_status?userId=" + userId);
  cb(resp);
};

export const disconnectInstagram = async cb => {
  const resp = await postMethod("/user/disconnect/instagram", {});
  cb(resp);
};

export const getAllPlaces = async (searchTerm, cb) => {
  let resp = await getMethod(`/cities/getall/country/${searchTerm}`);
  cb(resp);
};

export const validateReferralCode = async (code, cb) => {
  const resp = await getMethod(`/user/referral/validate/${code}`);
  cb(resp);
};

export const earnRewardViaReferralCode = async (data, cb) => {
  const resp = await postMethod(`/user/referral/usage`, data);
  cb(resp);
};

export const checkIfUserHasJustSignedUp = async cb => {
  const resp = await getMethod(`/user/verify/isnew`);
  cb(resp);
};

export const scheduleCronJob = async (data, cb) => {
  const resp = await postMethod(`/cron_job/add_new`, data);
  cb(resp);
};
