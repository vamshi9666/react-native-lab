import {
  putMethod,
  postMethod,
  getMethod,
  newPostMethod
} from "../config/Api.calls";

export const sendSpark = async (postedBy, answeredBy) => {
  try {
    const resp = await newPostMethod("/rooms/send_spark", {
      postedBy,
      answeredBy
    });

    return resp;
  } catch (error) {
    throw new Error(error);
  }
};

export const useFreeSpark = async (itemId, cb) => {
  const resp = await postMethod("/userpacks_new/use/free", { packId: itemId });
  cb(resp);
};

export const usePurchasedPack = async (packId, cb) => {
  const resp = await postMethod("/userpacks_new/use/purchase", { packId });
  cb(resp);
};

export const getUserPacks = async cb => {
  const resp = await getMethod("/userpacks_new/allPacks");
  cb(resp);
};

export const useFreeQuotaPack = async (packId, cb) => {
  const resp = await postMethod("/userpacks_new/use/free", { packId });
  cb(resp);
};
