import { Document } from 'mongoose';

export interface INotificationModel extends Document {
  userId: string;
  title: string;
  message: string;
  type: 'course' | 'chat' | 'achievement' | 'system';
  isRead: boolean;
  relatedId?: string;
  onModel?: 'Course' | 'ChatRoom';
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}