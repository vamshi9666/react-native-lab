import * as types from "../types/chats";
import * as apolloTypes from "../types/apollo";
import {
  getMessageQueryGQL,
  messageSubscriptionGQL,
  sendMessageGQL,
  subscribeToChatActivities,
  typingStatusSuscribtion,
  subscribeTypingStatus,
  sendTypingStatus,
  editMessageGQL,
  userLiveStatusSub
} from "../../queries/Chat.query";
// import * as types from "../types/Chat.types";
import { retrieveData } from "../../config/Storage";
import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { CHAT_URL, SOCKET_URL } from "../../config/Api";
import { getMethod } from "../../config/Api.calls";
import { appConstants } from "../../config/Constants";
import { readAllMessagesInRoom } from "../../network/rooms";
import { generateMsgid } from "../../common/uuid";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDNmZmJjY2QyMjM5ODI0NzFlYmEzYzAiLCJuYW1lIjoiYWRhbSBpcyBmYWtlIiwiZGF0ZV9vZl9iaXJ0aCI6IlR1ZSBKdWwgMTYgMjAxOSAxMjoyMDo1NSBHTVQrMDUzMCIsIm1vYmlsZV9udW1iZXIiOiI5ODc2NTQzMjEiLCJjcmVhdGVkQXQiOiIxNTY0NDc0MzE3IiwidXNlcl9pbmRleCI6MTIsImlhdCI6MTU3MTczMjYwM30.tcQuXpc50k4Eb9DWUgUTRV12v46R3ZlIgULGOfqU84o";

export const setClient = () => async (dispatch, getState) => {
  const {
    info: {
      userInfo: { authToken: token }
    }
  } = getState();
  const cache = new InMemoryCache();
  const wsLink = new WebSocketLink({
    uri: SOCKET_URL,
    options: {
      reconnect: true,
      lazy: true,
      connectionParams: {
        authorization: "Bearer " + token
      }
    }
  });

  const httpLink = new HttpLink({
    uri: CHAT_URL
  });

  const link = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpLink
  );
  var client = new ApolloClient({
    link: link,
    cache
  });
  dispatch({
    type: apolloTypes.SET_CLIENT,
    payload: client
  });
};

export const getRecentMessages = () => async dispatch => {
  let resp = await getMethod(`/user/messages/recent`, types.GET_RECENT_MESSAGE);
  dispatch(resp);
};

export const getMessages = (
  roomId,
  currentIndex = 0,
  limit = 50
) => async dispatch => {
  try {
    let token = await retrieveData("AUTH_TOKEN");
    let messageQuery = await client.query({
      query: getMessageQueryGQL,
      context: { headers: { authorization: "Bearer " + token } },
      variables: {
        roomId,
        currentIndex,
        limit
      },
      fetchPolicy: "network-only"
    });
    console.log(" response for gql is >>", messageQuery.data);
    dispatch({
      type: types.GET_MESSAGE,
      payload: messageQuery.data
    });
  } catch (err) {
    // alert(err);
    dispatch({
      type: types.GET_MESSAGE,
      payload: { messages: [], error: true }
    });
    console.log("error while querying graphql call: ", err);
  }
};

export const subscribeToMessages = roomId => async dispatch => {
  try {
    let token = await retrieveData("AUTH_TOKEN");
    // let subscriptionQuery = await subscriptionClient(token);
    // console.log("room id from subscription", roomId);
    client
      .subscribe({
        query: messageSubscriptionGQL(roomId),
        variables: {
          roomId: roomId
        }
      })
      .subscribe({
        next(data) {
          console.log(" calling subscription data is ", data);
          dispatch({
            type: types.GOT_ONE_MESSAGE,
            payload: data
          });
        },
        error(err) {
          console.log("subscriptionQuery err is: ", err);
        }
      });
  } catch (err) {
    console.log("error while subscribing graphql call: ", err);
  }
};

export const unSubscribeToMessages = () => async dispatch => {
  try {
    //
  } catch (err) {
    console.log("error while unsubscribing graphql call: ", err);
  }
};

export const editMessage = data => async (dispatch, getState) => {
  try {
    let token = await retrieveData("AUTH_TOKEN");
    console.log("data while editing message: ", {
      roomId: data.roomId,
      type: data.type,
      messageId: data.messageId
    });

    client
      .mutate({
        mutation: editMessageGQL,
        variables: {
          roomId: data.roomId,
          message: data.message,
          type: data.type,
          messageId: data.messageId
        },
        context: { headers: { authorization: "Bearer " + token } }
      })
      .then(res => {
        console.log(" after mutation is ", res);
        const {
          rooms: { rooms, selected_room_id }
        } = getState();
        const {
          data: { editMessage: newMsgObj }
        } = res;
        const selectedRoom = rooms[newMsgObj.roomId].messages.map(message => {
          if (message.msgId === newMsgObj.msgId) {
            return newMsgObj;
          }
          return message;
        });
        console.log("selectedRoom is:", selectedRoom);

        rooms[selected_room_id].messages = selectedRoom;
        dispatch({
          type: types.SET_EDITED_MESSAGE,
          payload: newMsgObj
        });
        dispatch({
          type: types.SET_ROOMS,
          payload: rooms
        });
      })
      .catch(e => {
        dispatch({
          type: types.GET_MESSAGE,
          payload: e.response ? (e.response ? e.response.data : e) : e
        });
        console.log(" erro in grahql mutaions ", e);
      });
  } catch ({ ...err }) {
    console.log("error while sending msg via graphql: ", err);
  }
};

export const sendMessage = data => async dispatch => {
  try {
    let token = await retrieveData("AUTH_TOKEN");
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: sendMessageGQL(),
          variables: {
            roomId: data.roomId,
            message: data.message,
            type: data.type,
            createdAt: data.createdAt,
            msgId: data.msgId
          },
          context: { headers: { authorization: "Bearer " + token } }
        })
        .then(res => {
          console.log("sendMessagesendMessage is:", res);

          dispatch({
            type: types.GET_MESSAGE,
            payload: res.data
          });
          resolve(true);
        })
        .catch(e => {
          dispatch({
            type: types.GET_MESSAGE,
            payload: e.response ? (e.response ? e.response.data : e) : e
          });
          reject(e);
          console.log(" erro in grahql mutaions ", e);
        });
    });
  } catch ({ ...err }) {
    console.log("error while sending msg via graphql: ", err);
  }
};

export const setRooms = arr => async dispatch => {
  let rooms = {};
  arr.map(room => {
    // if (rooms[room._id]) {
    rooms[room._id] = room;
    // } else {
    // rooms[room._id] = { room };
    // }
  });
  dispatch({
    type: types.SET_ROOMS,
    payload: rooms
  });
};

export const setRoomsArray = (arr = []) => async dispatch => {
  const roomsInArray = arr.map(
    ({
      _id,
      postedBy,
      answeredBy,
      status,
      expiresAt,
      friendObj,
      unreadMessagesCount,
      messages
    }) => ({
      _id,
      postedBy,
      answeredBy,
      status,
      expiresAt,
      friendObj: friendObj[0] ? friendObj[0] : null,
      unreadMessagesCount,
      updatedAt: messages[0].updatedAt
    })
  );
  dispatch({
    type: types.SET_ROOMS_ARRAY,
    payload: roomsInArray.sort((a, b) => {
      if (a.updatedAt > b.updatedAt) {
        return -1;
      }
      if (a.updatedAt < b.updatedAt) {
        return 1;
      }
      return 0;
    })
  });
};

export const removeOneRoom = roomId => async (dispatch, getState) => {
  const currentRooms = getState().rooms.rooms;
  const filteredRooms = currentRooms.filter(room => {
    if (room._id === roomId) {
      return;
    }
    return room;
  });
  dispatch({
    type: types.SET_ROOMS,
    payload: filteredRooms
  });
};

export const subscribeToAllRooms = () => async (dispatch, getState) => {
  const userId = getState().info.userInfo._id;
  console.log(" user id is >>>>");
  client
    .subscribe({
      query: subscribeToChatActivities,
      variables: {
        userId: userId
      }
    })
    .subscribe({
      next({ data: { newActivity }, errors }) {
        const {
          rooms: { rooms: roomsObj, rooms_array, selected_room_id }
        } = getState();
        const isEdited = newActivity.updatedAt !== newActivity.createdAt;

        if (isEdited) {
          console.log(" all rooms  data is here >>>", isEdited, newActivity);
          const {
            rooms: { rooms },
            nav: { currentScreenIndex }
          } = getState();
          const selectedRoom = rooms[newActivity.roomId].messages.map(
            message => {
              if (message.msgId === newActivity.msgId) {
                return newActivity;
              }
              return message;
            }
          );
          console.log("selectedRoom is:", selectedRoom);

          rooms[newActivity.roomId].messages = selectedRoom;
          if (currentScreenIndex === 4) {
            dispatch({
              type: types.SET_EDITED_MESSAGE,
              payload: newActivity
            });
          }
          dispatch({
            type: types.SET_ROOMS,
            payload: rooms
          });
          updateMsgWithResponse(newActivity);
          return;
        }
        handleUnreadCount(
          newActivity,
          roomsObj,
          rooms_array,
          selected_room_id,
          dispatch
        );

        dispatch(insertNewMessageIntoRooms(newActivity, roomsObj));
      },
      error(err) {
        console.log(" all rooms  error in all subscriptoin ", err);
      }
    });
};
const handleUnreadCount = (
  newMessage,
  roomsObj,
  roomsArray,
  selected_room_id,
  dispatch
) => {
  console.log(
    " about to call unread messges count one ",
    newMessage.roomId !== selected_room_id
  );
  if (newMessage.roomId !== selected_room_id) {
    roomsObj[newMessage.roomId] = {
      ...roomsObj[newMessage.roomId],
      unreadMessagesCount: roomsObj[newMessage.roomId].unreadMessagesCount + 1
    };
    const newRoomsArray = roomsArray.map(room => {
      if (room._id === newMessage.roomId) {
        return {
          ...room,
          unreadMessagesCount: room.unreadMessagesCount + 1
        };
      } else {
        return room;
      }
    });
    dispatch({
      type: types.SET_ROOMS_ARRAY,
      payload: newRoomsArray
    });
    console.log(" new array is ", newRoomsArray);
    dispatch({
      type: types.SET_ROOMS,
      payload: roomsObj
    });
  } else {
    console.log(
      " same room messages are incoming but we shouldn't show unread messages count"
    );
    //opened same room , to whicj new message arrived and unread count shouldnt be increased
    readAllMessagesInRoom(selected_room_id, res => {
      console.log(" just read all messages in ", selected_room_id);
    });
  }
};
const insertNewMessageIntoRooms = (msgObj, rooms) => {
  let newRooms = Object.assign({}, rooms);
  newRooms[msgObj.roomId]["messages"].unshift(msgObj);
  return {
    type: types.SET_ROOMS,
    payload: newRooms
  };
};

const updateMsgWithResponse = newMsgObj => async (dispatch, getState) => {
  console.log(" all rooms  data is here >>>>>>", newMsgObj);
  const {
    rooms: { rooms }
  } = getState();
  const selectedRoom = rooms[newMsgObj.roomId].map(message => {
    if (message.msgId === newMsgObj.msgId) {
      return newMsgObj;
    }
    return message;
  });
  console.log("selectedRoom is:", selectedRoom);

  rooms[selected_room._id] = selectedRoom;
  dispatch({
    type: types.SET_ROOMS,
    payload: rooms
  });
};

export const selectOneRoom = roomId => async dispatch => {
  dispatch({
    type: types.SELECT_ONE_ROOM,
    payload: roomId
  });
};

let subs;
let prevObj = { postedUserTyping: false, answeredUserTyping: false };
export const subscribeToTypingStatus = roomId => async (dispatch, getState) => {
  const {
    rooms: { rooms },
    info: { userInfo }
  } = getState();

  const IamPostedBy = rooms[roomId].postedBy._id === userInfo._id;
  console.log(
    " iam posted by >>>",
    rooms[roomId],
    rooms[roomId].postedBy._id === userInfo._id
  );
  subs = client
    .subscribe({
      query: subscribeTypingStatus,
      variables: {
        roomId
      },
      fetchPolicy: "network-only"
    })
    .subscribe({
      next({ data: { typingStatusChanged }, errors }) {
        const {
          postedUserTyping,
          answeredUserTyping,
          roomId
        } = typingStatusChanged;
        prevObj = { postedUserTyping, answeredUserTyping };
        console.log(" typing status changed to ", typingStatusChanged);
        dispatch({
          type: types.SET_TARGET_USER_TYPING,
          payload: IamPostedBy ? answeredUserTyping : postedUserTyping
        });
      }
    });
  console.log(" subscribed to typing status ");
  // .unsubscribe();
};

export const unsubscribe = () => async dispatch => {
  subs.unsubscribe();
};

export const setMessage = (body, type, createdAt) => async (
  dispatch,
  getState
) => {
  const {
    rooms: { rooms, selected_room_id },
    info: { userInfo }
  } = getState();
  const {
    lastMessageByMe: { msgId }
  } = rooms[selected_room_id];
  const parsedMsgCount = parseInt(msgId.substring(1));
  const newMsgId = `${msgId[0]}${parsedMsgCount + 1}`;
  const msgObj = {
    body,
    type,
    createdAt,
    roomId: selected_room_id,
    sender: userInfo._id,
    msgId: newMsgId
  };
  rooms[selected_room_id].lastMessageByMe.msgId = newMsgId;
  console.log("msObj is:::", msgObj);
  dispatch(insertNewMessageIntoRooms(msgObj, rooms));
  return newMsgId;
};

export const changeTypingStatus = (roomId, toValue) => async (
  dispatch,
  getState
) => {
  const {
    rooms: { rooms },
    info: { userInfo }
  } = getState();
  let token = await retrieveData("AUTH_TOKEN");
  const IamPostedBy = rooms[roomId].postedBy._id === userInfo._id;
  console.log(" input from mutation is ", roomId, toValue, prevObj);
  client
    .mutate({
      mutation: sendTypingStatus,
      variables: {
        userType: IamPostedBy ? "postedUserTyping" : "answeredUserTyping",
        roomId,
        toValue,
        ...prevObj
      },
      context: {
        headers: {
          authorization: "Bearer " + token
        }
      }
    })
    .then(res => {
      console.log(" mutation success", res);
    })
    .catch(err => {
      console.log(err);
    });
};

export const setFriendObj = obj => async (dispatch, getState) => {
  const { rooms } = getState();
  const { rooms_array, rooms: roomsObj, selected_room_id } = rooms;

  const newRoomsArray = rooms_array.map(room => {
    if (room._id === selected_room_id) {
      return {
        ...room,
        friendObj: obj,
        status: obj.status === appConstants.BECAME_FRIEND ? "FRIENDS" : "SLOT"
      };
    } else {
      return room;
    }
  });
  dispatch({
    type: types.SET_ROOMS_ARRAY,
    payload: newRoomsArray
  });

  roomsObj[selected_room_id] = {
    ...roomsObj[selected_room_id],
    friendObj: [obj],
    status: obj.status === appConstants.BECAME_FRIEND ? "FRIENDS" : "SLOT"
  };
  dispatch({
    type: types.SET_ROOMS,
    payload: roomsObj
  });
};

export const resetUnreadMessageCount = roomId => async (dispatch, getState) => {
  const { rooms } = getState();
  const { rooms_array, rooms: roomsObj } = rooms;
  const newRoomsArray = rooms_array.map(room => {
    if (room._id === roomId) {
      return {
        ...room,
        unreadMessagesCount: 0
      };
    } else {
      return room;
    }
  });
  dispatch({
    type: types.SET_ROOMS_ARRAY,
    payload: newRoomsArray
  });
  roomsObj[roomId] = {
    ...roomsObj[roomId],
    unreadMessagesCount: 0
  };
  dispatch({
    type: types.SET_ROOMS,
    payload: roomsObj
  });
};

export const resetCurrentRoomId = () => async dispatch => {
  dispatch({
    type: types.SELECT_ONE_ROOM,
    payload: null
  });
};

export const setEditedMessage = value => async dispatch => {
  dispatch({
    type: types.SET_EDITED_MESSAGE,
    value
  });
};

let liveSubs;

export const subscribeToUserLiveStatus = userId => async (
  dispatch,
  getState
) => {
  console.log("live status : subscribing to user ", userId);
  liveSubs = client
    .subscribe({
      query: userLiveStatusSub,
      variables: {
        userId: userId
      },
      fetchPolicy: "network-only"
    })
    .subscribe({
      next({ data, errors, context }) {
        console.log(" live status context is :::", context);
        console.log(" live status error : ", errors);
        console.log("live status data is ", data);
      },
      error(err) {
        console.log(" live status :::: error is ", err);
      }
    });
  console.log(" subscribed to live status ::: of user ", userId);
};

export const unSubToUserLiveStatus = () => async dispatch => {
  liveSubs.unsubscribe();
};
