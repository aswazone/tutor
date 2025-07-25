export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'course' | 'chat' | 'achievement' | 'system';
  isRead: boolean;
  createdAt: string;
  relatedId?: string; // Optional: ID of related item (course, chat, etc.)
}
