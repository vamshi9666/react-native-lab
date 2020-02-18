import { getMethod, postMethod, putMethod } from "../config/Api.calls";
import axios from "axios";

export const checkUserExistanceMethod = async (data, cb) => {
  let res = await getMethod(`/auth/user/verify/${data}`);
  cb(res);
};

export const helpCheckViaEmail = async (data, cb) => {
  let res = await postMethod("/auth/user/help/email/verify", data);
  cb(res);
};

export const sendResetPasswordLinkToEmail = async (data, cb) => {
  let res = await postMethod("/auth/user/help/email/send", data);
  cb(res);
};

export const temporaryLoginMethod = async (data, cb) => {
  let res = await postMethod("/auth/user/login/temporaryid", data);
  cb(res);
};

export const sendEmailVerificationLink = async (data, cb) => {
  let res = await postMethod("/auth/user/send/verifyemail/link", data);
  cb(res);
};

export const IPLookup = async cb => {
  let res = await axios.get("https://ipapi.co/json");
  cb(res);
};

export const SignUp = async (data, cb) => {
  let resp = await postMethod("/auth/register", data);
  cb(resp);
};

export const sendOtp = async (data, cb) => {
  let resp = await postMethod("/auth/otp/send", data);
  cb(resp);
};

export const resetPassword = async (data, cb) => {
  let resp = await postMethod("/auth/reset/password", data);
  cb(resp);
};

export const uploadImage = async (data, cb) => {
  let resp = await postMethod("/auth/picture", data, true);
  cb(resp);
};

export const verifyImage = async (data, cb) => {
  let resp = await postMethod("/user/verify/image/post", data, true);
  cb(resp);
};

export const updateProfile = async (data, cb) => {
  let resp = await putMethod("/user/update", data);
  cb(resp);
};

export const verifyOtp = async (data, cb) => {
  let resp = await postMethod("/auth/otp/verify", data);
  cb(resp);
};

export const loginMethod = async (data, cb) => {
  let resp = await postMethod("/auth/login", data);
  cb(resp);
};

export const facebookLogin = async (data, cb) => {
  let resp = await postMethod("/auth/login/fb", data);
  cb(resp);
};
