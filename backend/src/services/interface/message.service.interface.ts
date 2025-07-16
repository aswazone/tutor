import { IMessage } from "@/models/implements/message.model";

export interface IMessageService {
    getMessagesOfChatRoom(roomId: string, userId: string, page: number, limit: number): Promise<IMessage[]>;
}