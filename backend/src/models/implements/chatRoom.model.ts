import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IChatRoom extends Document {
  _id: Types.ObjectId;
  name: string;
  type: 'direct' | 'group';
  participants: Types.ObjectId[];
  courseId?: Types.ObjectId;
  courseName?: string;
  lastMessage?: {
    content: string;
    senderId: Types.ObjectId;
    senderName: string;
    timestamp: Date;
  };
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const chatRoomSchema = new Schema<IChatRoom>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  type: {
    type: String,
    enum: ['direct', 'group'],
    required: true
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: function() {
      return this.type === 'group';
    }
  },
  courseName: {
    type: String,
    required: function() {
      return this.type === 'group';
    }
  },
  lastMessage: {
    content: String,
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    senderName: String,
    timestamp: Date
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes
chatRoomSchema.index({ participants: 1 });
chatRoomSchema.index({ courseId: 1 });
chatRoomSchema.index({ type: 1 });
chatRoomSchema.index({ 'lastMessage.timestamp': -1 });

export const ChatRoom = mongoose.model<IChatRoom>('ChatRoom', chatRoomSchema);