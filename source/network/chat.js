import { getMethod, postMethod, putMethod } from "../config/Api.calls";

export const uploadImage = async (data, cb) => {
  const resp = await postMethod("/auth/picture/noface", data, true);
  cb(resp);
};
