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

// --- Combined Socket Events ---
export interface ClientToServerEvents {
  // Chat Events
  join_room: (roomId: string) => void;
  leave_room: (roomId: string) => void;
  send_message: (message: Omit<Message, '_id' | 'timestamp'>) => void;
  user_typing: (data: { userId: string; roomId: string; isTyping: boolean }) => void;
  message_read: (data: { messageId: string; userId: string; roomId: string }) => void; // Acknowledge message read

  // Notification Events
  join: (userId: string) => void; // To inform the server about the joining user for general notifications
  // You might not need markNotificationAsRead via socket if you use REST API for it,
  // but if you do, uncomment this:
  // markNotificationAsRead: (notificationId: string) => void;
}

export interface ServerToClientEvents {
  // Chat Events
  message_received: (message: Message) => void;
  user_online: (userId: string) => void;
  user_offline: (userId: string) => void;
  // Acknowledgment for message read, could be a simple status update or an event
  message_read_ack: (data: { messageId: string; userId: string; roomId: string }) => void;


  // Notification Events
  notification: (notification: Notification) => void; // When a new notification is sent
  // You might have other notification-related events, e.g.:
  // unread_notification_count: (count: number) => void;
}

// This is the combined interface for use with Socket.IO
// Socket.IO's `Socket` generic type takes ClientToServerEvents, ServerToClientEvents
export type SocketEvents = ClientToServerEvents & ServerToClientEvents;
