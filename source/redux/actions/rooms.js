/* eslint-disable no-console */
import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { CHAT_URL, SOCKET_URL } from "../../config/Api";
import { getMethod } from "../../config/Api.calls";
import {
  appConstants,
  STACK_RELEASE_PROCESSES,
  STACK_TYPES
} from "../../config/Constants";
// import * as types from "../types/Chat.types";
import { retrieveData } from "../../config/Storage";
import { readAllMessagesInRoom } from "../../network/rooms";
import {
  editMessageGQL,
  getMessageQueryGQL,
  messageSubscriptionGQL,
  mutateLiveStatus,
  sendMessageGQL,
  sendTypingStatus,
  subscribeToChatActivities,
  subscribeTypingStatus,
  userLiveStatusSub
} from "../../queries/Chat.query";
import * as apolloTypes from "../types/apollo";
import * as types from "../types/chats";

export const setClient = () => async (dispatch, getState) => {
  const {
    info: { authToken: token }
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
  const client = new ApolloClient({
    link: link,
    cache
  });
  await dispatch({
    type: apolloTypes.SET_CLIENT,
    payload: client
  });
  return true;
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
    const {
      apollo: { client }
    } = getState();
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

export const sendMessage = data => async (dispatch, getState) => {
  try {
    const {
      apollo: { client }
    } = getState();
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

export const setRoomsArray = (arr = []) => async (dispatch, getState) => {
  const {
    rooms: { roomsArray },
    app: { adminProps },
    info: { userInfo }
  } = getState();
  let roomsInArray = [];
  let sentStack = [];
  let sentRoomsLength = 0;
  let receivedRoomsLength = 0;
  let receivedStack = [];

  console.log(" \n\n\n all room length is ", arr.length, "\n\n\n");
  arr.forEach(
    (
      {
        _id,
        postedBy,
        answeredBy,
        status,
        expiresAt,
        friendObj,
        unreadMessagesCount,
        messages,
        answeredByStack,
        postedByStack,
        answeredBySentSpark,
        postedBySentSpark,
        postedBySeen
      },
      index: roomIndex
    ) => {
      const roomObj = {
        _id,
        postedBy,
        answeredBy,
        status,
        expiresAt,
        friendObj: friendObj[0] ? friendObj[0] : null,
        unreadMessagesCount,
        updatedAt: messages[0] && messages[0].updatedAt,
        postedBySeen
      };

      const isSent = answeredBy._id === userInfo._id;
      // if (isSent) {
      //   sentRoomsLength += 1;
      // } else {
      //   receivedRoomsLength += 1;
      // }
      if (postedBySentSpark === true || answeredBySentSpark === true) {
        return roomsInArray.push(roomObj);
      }
      if (!isSent) {
        //recieved tab
        if (
          postedByStack.status === STACK_TYPES.ACTIVE &&
          postedByStack.process !== STACK_RELEASE_PROCESSES.PAYMENT
        ) {
          receivedStack.push(roomObj);
        } else {
          receivedRoomsLength += 1;

          roomsInArray.push(roomObj);
        }
      } else {
        // sent tab
        if (
          answeredByStack.status === STACK_TYPES.ACTIVE &&
          answeredByStack.process !== STACK_RELEASE_PROCESSES.PAYMENT
        ) {
          sentStack.push(roomObj);
        } else {
          sentRoomsLength += 1;
          roomsInArray.push(roomObj);
        }
      }
    }
  );
  dispatch({
    type: types.SET_RECEIVED_ROOMS_LENGTH,
    payload: receivedRoomsLength
  });
  dispatch({
    type: types.SET_SENT_ROOMS_LENGTH,
    payload: sentRoomsLength
  });
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
  dispatch({
    type: types.SET_SENT_STACK,
    payload: sentStack
  });
  dispatch({
    type: types.SET_RECIEVED_STACK,
    payload: receivedStack
  });
};

export const removeOneRoom = roomId => async (dispatch, getState) => {
  const {
    rooms: { rooms, rooms_array }
  } = getState();
  // const filteredRooms = currentRooms.filter(room => {
  //   if (room._id === roomId) {
  //     return;
  //   }
  //   return room;
  // });
  delete rooms[roomId];

  const newRoomsArray = rooms_array.filter(room => {
    return room._id !== roomId;
  });
  dispatch({
    type: types.SET_ROOMS,
    payload: rooms
  });
  dispatch({
    type: types.SELECT_ONE_ROOM,
    payload: null
  });
  dispatch({
    type: types.SET_ROOMS_ARRAY,
    payload: newRoomsArray
  });
};

export const subscribeToAllRooms = () => async (dispatch, getState) => {
  const {
    info: {
      userInfo: { _id: userId }
    },
    apollo
  } = getState();
  apollo.client
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
        if (selected_room_id === null) {
          dispatch({
            type: types.SET_NEW_ACTIVITY,
            payload: newActivity
          });
        }
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
  const {
    rooms: { rooms }
  } = getState();

  const selectedRoom = rooms[newMsgObj.roomId].map(message => {
    if (message.msgId === newMsgObj.msgId) {
      return newMsgObj;
    }
    return message;
  });

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
    info: { userInfo },
    apollo: { client }
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
    info: { userInfo },
    apollo: { client }
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
      console.log(" mutation success ^^^ 78 ", res);
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

export const setPickerDisability = (isPostedBy, bool) => async (
  dispatch,
  getState
) => {
  const { rooms } = getState();
  const { rooms_array, rooms: roomsObj, selected_room_id } = rooms;

  const newRoomsArray = rooms_array.map(room => {
    if (room._id === selected_room_id) {
      if (isPostedBy) {
        return {
          ...room,
          postedByPickersEnabled: bool
        };
      } else {
        return {
          ...room,
          answeredByPickersEnabled: bool
        };
      }
    } else {
      return room;
    }
  });
  dispatch({
    type: types.SET_ROOMS_ARRAY,
    payload: newRoomsArray
  });
  if (isPostedBy) {
    roomsObj[selected_room_id] = {
      ...roomsObj[selected_room_id],
      postedByPickersEnabled: bool
    };
  } else {
    roomsObj[selected_room_id] = {
      ...roomsObj[selected_room_id],
      answeredByPickersEnabled: bool
    };
  }

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
  const messages = roomsObj[roomId].messages.map(message => {
    return { ...message, read: true };
  });
  dispatch({
    type: types.SET_ROOMS_ARRAY,
    payload: newRoomsArray
  });
  roomsObj[roomId] = {
    ...roomsObj[roomId],
    messages,
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
  const {
    apollo: { client }
  } = getState();
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

export const setOnlineStatus = (isLive = true) => async (
  dispatch,
  getState
) => {
  const {
    apollo: { client },
    info: { userInfo }
  } = getState();
  let token = await retrieveData("AUTH_TOKEN");
  client
    .mutate({
      mutation: mutateLiveStatus,
      variables: {
        userId: userInfo._id,
        isLive
      },
      context: { headers: { authorization: "Bearer " + token } }
    })
    .then(res => {
      console.log(" after online status mutatioin ", res);
      return res;
    })
    .catch(err => {
      console.log(" err after online status mutation is ::", err);
      return false;
    });
};

export const setNewActivity = newActivity => async dispatch => {
  dispatch({
    type: types.SET_NEW_ACTIVITY,
    payload: newActivity
  });
};

export const clearOneRoomMessages = roomId => async (dispatch, getState) => {
  const {
    rooms: { rooms }
  } = getState();
  const newRooms = Object.assign({}, rooms);
  newRooms[roomId] = {
    ...rooms[roomId],
    messages: [],
    unreadMessagesCount: 0
  };
  dispatch({ type: types.SET_ROOMS, payload: newRooms });
  return roomId;
};

export const addSparkToRoom = newRoomObj => async (dispatch, getState) => {
  const {
    rooms: { rooms, selected_room_id }
  } = getState();
  const newRooms = Object.assign({}, rooms);
  newRooms[selected_room_id] = {
    ...rooms[selected_room_id],
    ...newRoomObj
    // answeredBySentSpark: true
  };
  console.log(" rooms are ", newRoomObj, "\n", newRooms);
  dispatch({
    type: types.SET_ROOMS,
    payload: newRooms
  });
};

export const setMissedRequests = roomsArr => dispatch => {
  dispatch({
    type: types.SET_MISSED_REQUESTS,
    payload: roomsArr
  });
};
