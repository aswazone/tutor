import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IMessage extends Document {
  _id: string;
  content: string;
  senderId: Types.ObjectId;
  senderName: string;
  roomId: Types.ObjectId;
  type: 'text' | 'image' | 'file';
  replyTo?: {
    messageId: string;
    content: string;
    senderName: string;
  };
  readBy: Array<{
    userId: string;
    readAt: Date;
  }>;
  isEdited: boolean;
  editedAt?: Date;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
  content: {
    type: String,
    required: true,
    maxlength: 4000
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  roomId: {
    type: Schema.Types.ObjectId,
    ref: 'ChatRoom',
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'image', 'file'],
    default: 'text'
  },
  replyTo: {
    messageId: {
      type: Schema.Types.ObjectId,
      ref: 'Message'
    },
    content: String,
    senderName: String
  },
  readBy: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date,
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
}, {
  timestamps: true
});

// Indexes
messageSchema.index({ roomId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1 });
messageSchema.index({ 'readBy.userId': 1 });
messageSchema.index({ isDeleted: 1 });

export const Message = mongoose.model<IMessage>('Message', messageSchema);