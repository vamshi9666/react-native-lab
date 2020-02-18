import { gql } from "apollo-boost";

export const getMessageQueryGQL = gql`
  query getMessage($roomId: String!, $currentIndex: Int!, $limit: Int) {
    messages(roomId: $roomId, currentIndex: $currentIndex, limit: $limit) {
      _id
      sender
      body
      type
      createdAt
    }
  }
`;

export const testGQL = () => {
  return gql`
    query {
      hello
    }
  `;
};

export const messageSubscriptionGQL = () => {
  const nQ = `
  subscription newMessage($roomId: String) {
    newMessage(roomId: $roomId){
      sender 
      body
      type
      createdAt
    }
  }
  `;
  return gql(nQ);
};

export const subscribeTypingStatus = gql`
  subscription onTypingStatusChanged($roomId: String!) {
    typingStatusChanged(input: { roomId: $roomId }) {
      postedUserTyping
      answeredUserTyping
      roomId
    }
  }
`;

export const sendMessageGQL = () => {
  let q = `mutation sendMessage(
    $roomId: String!,
    $message: String!,
    $type:String!,
    $createdAt: String,
    $msgId: String!
  )
  {
    sendMessage(input: {
      roomId:$roomId,
      body:$message,
      type:$type,
      createdAt: $createdAt,
      msgId : $msgId
    } ){
      sender
    }
  }`;
  return gql(q);
};

export const editMessageGQL = gql`
  mutation editMessage(
    $roomId: String
    $message: String!
    $type: String
    $messageId: String!
  ) {
    editMessage(
      input: {
        roomId: $roomId
        body: $message
        type: $type
        messageId: $messageId
      }
    ) {
      sender
      msgId
      roomId
      body
      type
      updatedAt
      createdAt
      _id
    }
  }
`;

export const sendTypingStatus = gql`
  mutation sendTypingStatus(
    $roomId: String!
    $userType: String!
    $toValue: Boolean!
    $postedUserTyping: Boolean!
    $answeredUserTyping: Boolean!
  ) {
    changeTypingStatus(
      input: {
        roomId: $roomId
        userType: $userType
        toValue: $toValue
        prevObj: {
          postedUserTyping: $postedUserTyping
          answeredUserTyping: $answeredUserTyping
        }
      }
    ) {
      postedUserTyping
      answeredUserTyping
      roomId
    }
  }
`;

export const subscribeToChatActivities = gql`
  subscription watchActivity($userId: String!) {
    newActivity(userId: $userId) {
      sender
      msgId
      roomId
      body
      type
      updatedAt
      createdAt
      senderShowName
      inAppNotificationEnabled
      _id
    }
  }
`;

export const typingStatusSuscribtion = gql`
  subscription onTypingStatusChanged($roomId: String!) {
    typingStatusChanged(input: { roomId: $roomId }) {
      postedUserTyping
      answeredUserTyping
      roomId
    }
  }
`;

export const userLiveStatusSub = gql`
  subscription subscribeToUserLiveStatus($userId: String!) {
    userLiveStatusChanged(userId: $userId) {
      isLive
      userId
    }
  }
`;

export const mutateLiveStatus = gql`
  mutation mutateLiveStatus($userId: String!, $isLive: Boolean!) {
    changeUserLiveStatus(input: { userId: $userId, isLive: $isLive }) {
      isLive
      userId
    }
  }
`;
