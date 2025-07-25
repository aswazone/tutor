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
    enum: ['course', 'chat', 'achievement', 'system'],
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
  }
}, {timestamps: true});

// Add indexes for better query performance
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ isRead: 1, userId: 1 });

export const Notification = model<INotificationModel>('Notification', notificationSchema);