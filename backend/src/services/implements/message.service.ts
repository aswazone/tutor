import { IMessageRepository } from "@/repositories/interface/message.repository.interface";
import { IMessageService } from "../interface/message.service.interface";
import { IChatRoomRepository } from "@/repositories/interface/chatRoom.repository.interface";

export class MessageService implements IMessageService {
    constructor(
        private readonly _chatRoomRepository: IChatRoomRepository,
        private readonly _messageRepository: IMessageRepository
    ){}

    getMessagesOfChatRoom = async (roomId: string, userId: string, page: number, limit: number) => {
        const chatRoom = await this._chatRoomRepository.findChatRoomById(roomId);
        if(!chatRoom) throw new Error('Chat room not found');

        return this._messageRepository.getMessagesOfChatRoom(roomId, userId, page, limit);
    };
}