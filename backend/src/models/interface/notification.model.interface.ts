import { Document } from 'mongoose';

export interface INotificationModel extends Document {
  userId: string;
  title: string;
  message: string;
  type:
    | 'REVENUE_EARNED'
    | 'COURSE_PURCHASED'
    | 'COURSE_APPROVED'
    | 'COURSE_DECLINED'
    | 'COURSE_ENABLED'
    | 'COURSE_DISABLED'
    | 'COURSE_CREATION'
    | 'INTERVIEW_CREATION'
    | 'NEW_MESSAGE';
  isRead: boolean;
  relatedId?: string;
  onModel?: 'Course' | 'ChatRoom' | 'Interview';
  amount?: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}