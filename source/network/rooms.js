import { getMethod, postMethod, putMethod } from "../config/Api.calls";
import { get } from "react-native-redash";

export const getRooms = async cb => {
  let resp = await getMethod("/rooms/all");
  cb(resp);
};

export const readAllMessagesInRoom = async (roomId, cb) => {
  const resp = await getMethod("/rooms/read_all_messages?roomId=" + roomId);
  cb(resp);
};

export const extend24Hours = async (roomId, cb) => {
  const resp = await postMethod("/rooms/extend/one/day", { roomId });
  cb(resp);
};

export const deleteConversation = async (roomId, cb) => {
  const resp = await postMethod("/rooms/delete/conversation", { roomId });
  cb(resp);
};

export const getRoomObj = async (roomId, cb) => {
  const resp = await getMethod("/rooms/room_object?roomId=" + roomId);
  cb(resp);
};

export const releaseAStackItem = async (roomId, updates, cb) => {
  const resp = await putMethod("/rooms/release/stack_item", {
    roomId,
    updates
  });
  cb(resp);
};

export const releaseAllStackItems = async (isSent, cb) => {
  const stackType = isSent === true ? "sent" : "received";
  const resp = await postMethod(
    "/rooms/release/all?stackType=" + stackType,
    {}
  );
  cb(resp);
};

export const makeAllRoomsSeen = async cb => {
  const resp = await getMethod("/rooms/make_seen");
  cb(resp);
};

export const getMissedRequests = async cb => {
  const resp = await getMethod("/rooms/missed_requests");
  cb(resp);
};

export const makeSomeRoomsSeen = async (roomIds, cb) => {
  console.log(" room ids are ", roomIds);
  const resp = await postMethod("/rooms/make_some_seen", { roomIds });
  cb(resp);
};

export const removeOneRoom = async (roomId, reason, cb) => {
  const resp = await postMethod("/rooms/remove_one_room", { roomId, reason });
  cb(resp);
};

export const removeAllRooms = async (reason, cb) => {
  const resp = await postMethod("/rooms/remove_all_rooms", { reason });
  cb(resp);
};

export const updateRommObj = async (roomId, updates, cb) => {
  console.log(" updated room id is ", roomId);
  const resp = await putMethod("/rooms/update_one_room", { roomId, updates });
  cb(resp);
};
