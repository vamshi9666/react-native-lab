import { getMethod, postMethod, putMethod } from "../config/Api.calls";

export const uploadFeedback = async (inputType, reqBody, cb) => {
  const resp = await postMethod("/user/input/?type=" + inputType, reqBody);
  cb(resp);
};
