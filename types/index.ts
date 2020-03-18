export interface Message {
  _id: string;
  index: number;
  pending: boolean;
  body: boolean;
  isSent: boolean;
  createdAt: number;
  updatedAt: number;
  byUser: string;
}

export interface ClosedRoom {
  unread_messages_count: number;
  last_message: Message;
}

// type Room = {
//   unread_messages_count: number;
//   lastMessage: Message;
//   messages: Array<Message>;
// };
