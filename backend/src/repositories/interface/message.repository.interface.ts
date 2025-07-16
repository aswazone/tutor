import { IMessage } from "@/models/implements/message.model";


export interface IMessageRepository {
    getMessagesOfChatRoom(roomId: string, userId: string, page: number, limit: number): Promise<IMessage[]>
}