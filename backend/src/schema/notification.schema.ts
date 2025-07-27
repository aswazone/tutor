import { Schema, model } from 'mongoose';
import { INotificationModel } from '@/models/interface/notification.model.interface';

const notificationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: [
      'REVENUE_EARNED',
      'COURSE_PURCHASED',
      'COURSE_APPROVED',
      'COURSE_DECLINED',
      'COURSE_ENABLED',
      'COURSE_DISABLED',
      'COURSE_CREATION',
      'COURSE_BLOCKED',
      'NEW_MESSAGE',
    ],
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  relatedId: {
    type: Schema.Types.ObjectId,
    refPath: 'onModel',
    required: false
  },
  onModel: {
    type: String,
    enum: ['Course', 'ChatRoom'],
    required: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  amount: {
    type: Number,
    required: false
  }
}, {timestamps: true});

// Add indexes for better query performance
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ isRead: 1, userId: 1 });

export const Notification = model<INotificationModel>('Notification', notificationSchema);