import { IMessage, Message } from "@/models/implements/message.model";
import { BaseRepository } from "../base.repository";
import { IMessageRepository } from "../interface/message.repository.interface";

export class MessageRepository extends BaseRepository<IMessage> implements IMessageRepository {
    constructor(){
        super(Message);
    }

    getMessagesOfChatRoom = async (roomId: string, userId: string, page: number, limit: number) => {

        const skip = (Number(page) - 1) * Number(limit);

        const messages = await this.model.find({roomId: roomId})
        .populate('senderId', 'name profileImage')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean();

        interface PopulatedMessage {
            _id: string;
            content: string;
            senderId: {
                _id: string;
                name: string;
                profileImage: string;
            };
            senderName: string;
            createdAt: Date;
            type: string;
            replyTo?: {
                messageId: string;
                content: string;
                senderName: string;
            };
            readBy: Array<{ userId: string; readAt: Date }>;
        }

    const formattedMessages = messages.reverse().map(msg => ({
      _id: msg._id,
      content: msg.content,
      senderId: msg.senderId._id,
      senderName: msg.senderName,
      timestamp: msg.createdAt,
      type: msg.type,
      replyTo: msg.replyTo,
      isRead: msg.readBy.some(read => read.userId.toString() === userId)
    }));

    return formattedMessages;

    };
}