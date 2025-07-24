import { UserRole } from ".";

export interface User {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  role: UserRole;
  onlineStatus: boolean;
  lastSeen: Date;
}

export interface Message {
  _id?: string;
  content: string;
  senderId: string;
  senderName: string;
  roomId: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  replyTo?: {
    messageId: string;
    content: string;
    senderName: string;
  };
  isRead: boolean;
}

export interface ChatRoom {
  _id: string;
  name: string;
  type: 'direct' | 'group';
  participants: User[];
  lastMessage?: Message;
  isTyping?: boolean;  
  unreadCount: number;
  courseId?: string;
  courseName?: string;
}

