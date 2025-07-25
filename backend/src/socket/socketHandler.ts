import { Server, Socket } from 'socket.io';
import { Message } from '../models/implements/message.model';
import { ChatRoom } from '../models/implements/chatRoom.model';
import { socketAuthMiddleware } from '@/middlewares/socketauth.middlewate';
import { User } from '@/models/implements/user.model';
import { IUserModel } from '@/models/interface/user.model.interface';
import { Types } from 'mongoose';
import { INotificationModel } from '@/models/interface/notification.model.interface';
import { notificationService } from '@/dependencies/notification.di';

export interface AuthenticatedSocket extends Socket {
  userId: string;
  user: IUserModel;
}

export let ioInstance: Server;

export const initializeSocket = (io: Server) => {
  ioInstance = io;
  // Authentication middleware for socket connections
  io.use(socketAuthMiddleware);

  console.log('Socket server initialized');

  io.on('connection', async (s: Socket) => {
    const socket = s as AuthenticatedSocket;
    const userName = JSON.stringify(socket.handshake.auth.user.name);
    const userId = socket.handshake.auth.userId;
    console.log(`👤 User ${socket.handshake.auth.user.name} connected`);

    // setupNotificationHandlers(socket);

    // Update user online status
    await User.findByIdAndUpdate(userId, { 
      onlineStatus: true,
      lastSeen: new Date()
    });

    // Broadcast user online status
    socket.broadcast.emit('user_online', userId);
    console.log(`👤 User ${socket.handshake.auth.user.name} is online`);

    // Join user to their chat rooms
    const userRooms = await ChatRoom.find({ 
      participants: userId 
    }).select('_id');
    
    userRooms.forEach(room => {
      socket.join(room._id.toString());
    });

    // Handle joining a specific room
    socket.on('join_room', async (roomId: string) => {
      try {
        const room = await ChatRoom.findById(roomId);
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Check if user is participant
        if (!room.participants.includes(new Types.ObjectId(userId as string))) {
          socket.emit('error', { message: 'Access denied' });
          return;
        }

        socket.join(roomId);
        console.log(`👤 ${userName} joined room ${roomId}`);
      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // Handle leaving a room
    socket.on('leave_room', (roomId: string) => {
      socket.leave(roomId);
      console.log(`👤 ${userName} left room ${roomId}`);
    });

    // Handle sending messages
    socket.on('send_message', async (messageData: {
      content: string;
      roomId: string;
      senderId: string;
      senderName: string;
      type: 'text' | 'image' | 'file';
      replyTo?: {
        messageId: string;
        content: string;
        senderName: string;
      };
      isRead: boolean;
    }) => {
      try {

        console.log('messageData', messageData);
        // Validate room access
        const room = await ChatRoom.findById(messageData.roomId);
        if (!room || !room.participants.includes(new Types.ObjectId(userId as string))) {
          socket.emit('error', { message: 'Access denied' });
          return;
        }

        console.log('room', room);

        // Create message
        const message = new Message({
          content: messageData.content,
          senderId: userId,
          senderName: messageData.senderName,
          roomId: messageData.roomId,
          type: messageData.type || 'text',
          replyTo: messageData.replyTo,
          readBy: [{ userId, readAt: new Date() }]
        });

        await message.save();

        // Update room's last message
        await ChatRoom.findByIdAndUpdate(messageData.roomId, {
          lastMessage: {
            content: messageData.content,
            senderId: userId,
            senderName: userName,
            timestamp: new Date()
          }
        });

        const populatedMessage = await Message.findById(message._id)
          .populate('senderId', 'name avatar')
          .lean();

        if (!populatedMessage) {
          socket.emit('error', { message: 'Failed to send message' });
          return;
        }

        // Broadcast to room participants
        io.to(messageData.roomId).emit('message_received', {
          id: populatedMessage._id,
          content: populatedMessage.content,
          senderId: populatedMessage.senderId._id,
          senderName: populatedMessage.senderName,
          timestamp: populatedMessage.createdAt,
          type: populatedMessage.type,
          replyTo: populatedMessage.replyTo,
          isRead: false
        });

        console.log(`💬 Message sent in room ${messageData.roomId}`);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('user_typing', (data: { roomId: string; isTyping: boolean }) => {
      socket.to(data.roomId).emit('user_typing', {
        userId: userId,
        userName: userName,
        roomId: data.roomId,
        isTyping: data.isTyping
      });
    });

    // Handle message read receipts
    socket.on('message_read', async (data: { messageId: string; roomId: string }) => {
      try {
        await Message.findByIdAndUpdate(data.messageId, {
          $addToSet: {
            readBy: {
              userId: userId,
              readAt: new Date()
            }
          }
        });

        socket.to(data.roomId).emit('message_read', {
          messageId: data.messageId,
          userId,
          roomId: data.roomId
        });
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });
    
      socket.on('getNotifications', async (userId: string) => {
        // console.log('getNotifications-->', userId);
        const notifications = await notificationService.getUserNotifications(userId);
        // console.log('notifications', notifications);
        socket.emit('notifications', notifications);
      });
    
      socket.on('markNotificationRead', async ({ userId, notificationId }) => {
        await notificationService.markAsRead(userId, notificationId);
        socket.emit('notificationRead', notificationId);
      });
    
      socket.on('markAllNotificationsRead', async (userId: string) => {
        await notificationService.markAllRead(userId);
        socket.emit('allNotificationsRead', userId);
      });



    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`👤 User ${userName} disconnected`);
      
      // Update user offline status
      await User.findByIdAndUpdate(userId, { 
        onlineStatus: false,
        lastSeen: new Date()
      });

      // Broadcast user offline status
      socket.broadcast.emit('user_offline', userId);
    });
  });
};

export const emitNotificationToUsers = (userIds: string[], notification: INotificationModel) => {
  const sockets = Array.from(ioInstance.sockets.sockets.values());
  
  console.log('sockets', sockets);
  console.log('userIds', userIds);
  
  userIds.forEach(userId => {
    const userSocket = sockets.find(
      (socket: Socket) => (socket as AuthenticatedSocket).userId === userId
    );
    
    console.log('userSocket', userSocket);
    
    if (userSocket) {
      console.log('emittinggggg')
      userSocket.emit('newNotification', notification);
    }
  });
};