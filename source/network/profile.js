import { postMethod, getMethod } from "../config/Api.calls";

export const swipeAProfile = async (targetUserId, cb) => {
  const resp = await postMethod("/profile/swipe", { targetUserId });
  cb(resp);
};

export const getMoreProfiles = async cb => {
  const resp = await getMethod("/profile/more_profiles");
  cb(resp);
};
