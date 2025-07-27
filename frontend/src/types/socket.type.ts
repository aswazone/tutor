import { Message } from "./chat.type";

// export interface SocketEvents {
//   join_room: (roomId: string) => void;
//   leave_room: (roomId: string) => void;
//   send_message: (message: Omit<Message, 'id' | 'timestamp'>) => void;
//   message_received: (message: Message) => void;
//   user_typing: (data: { userId: string; roomId: string; isTyping: boolean }) => void;
//   user_online: (userId: string) => void;
//   user_offline: (userId: string) => void;
//   message_read: (data: { messageId: string; userId: string; roomId: string }) => void;
// }


export interface ClientToServerEvents {

  join_room: (roomId: string) => void;
  leave_room: (roomId: string) => void;
  send_message: (message: Omit<Message, '_id' | 'timestamp'>) => void;
  user_typing: (data: { userId: string; roomId: string; isTyping: boolean }) => void;
  message_read: (data: { messageId: string; userId: string; roomId: string }) => void; 
  join: (userId: string) => void;

  getNotifications: (userId: string) => void;
  markNotificationRead: (data: { userId: string; notificationId: string }) => void;
  markAllNotificationsRead: (userId: string) => void;
  deleteNotification: (data: { userId: string; notificationId: string }) => void;

}

export interface ServerToClientEvents {

  message_received: (message: Message) => void;
  user_online: (userId: string) => void;
  user_offline: (userId: string) => void
  message_read_ack: (data: { messageId: string; userId: string; roomId: string }) => void;


  notifications: (notifications: Notification[]) => void;
  newNotification: (notification: Notification) => void;
  notificationRead: (notificationId: string) => void;
  allNotificationsRead: (userId: string) => void;
  notificationDeleted: (notificationId: string) => void;

}

export type SocketEvents = ClientToServerEvents & ServerToClientEvents;
