import {
  getMethod,
  putMethod,
  postMethod,
  newPostMethod
} from "../config/Api.calls";

export const getPackPrices = async (status = "ACTIVE", cb) => {
  const resp = await getMethod("/packnames/" + status);
  cb(resp);
};

export const purchaseGems = async (gemsCountToBeAdded, cb) => {
  const resp = await putMethod("/user/update/gems", {
    gems_count: gemsCountToBeAdded
  });
  cb(resp);
};

export const getGemsPacks = async cb => {
  const resp = await getMethod("/gem_plans/get");
  cb(resp);
};

//new pack purchases

export const buyAPack = async (packId, itemId, countToBeAdded, cb) => {
  let body = {
    countToBeAdded,
    itemId
  };
  if (packId) {
    delete body.itemId;
  }
  const resp = await postMethod("/userpacks_new/buy/pack", {
    packId,
    countToBeAdded,
    itemId
  });
  cb(resp);
};

export const purchaseAndFulfill = async ({
  isPack = false,
  item,
  packId,
  itemId = "",
  deductCount,
  countToBeAdded,
  roomIds = [],
  contentId,
  gameId,
  category,
  qIndex,
  tappedCount
}) => {
  try {
    const resp = await newPostMethod(
      `/userpacks_new/purchase_fulfill/?gameId=${gameId}&category=${category}&qIndex=${qIndex}&tappedCount=${tappedCount}`,
      {
        isPack,
        item,
        packId,
        itemId,
        deductCount,
        countToBeAdded,
        contentId,
        roomIds
      }
    );
    return resp;
  } catch (err) {
    throw new Error(err);
  }
};
export const consumeAndFulFill = async ({
  item,
  deductCount,
  deductFrom,
  contentId,
  itemId,
  freeUsage = false,
  roomIds = [],
  gameId,
  category,
  qIndex,
  tappedCount
}) => {
  try {
    const resp = await newPostMethod(
      `/userpacks_new/consume_fulfill/?gameId=${gameId}&category=${category}&qIndex=${qIndex}&tappedCount=${tappedCount}`,
      {
        item,
        deductCount,
        deductFrom,
        contentId,
        itemId,
        freeUsage,
        roomIds
      }
    );

    return resp;
  } catch (error) {
    throw new Error(error);
  }
};
