import { IChatRoom } from "@/models/implements/chatRoom.model";

export interface IChatRoomRepository {
    getAllChatRooms: (userId: string) => Promise<IChatRoom[]>
    findChatRoomById: (id: string) => Promise<IChatRoom | null>
    existingChatRoom: (userId1: string, userId2: string) => Promise<IChatRoom | null>
    createChatRoom: (userId1: string, participantId: string) => Promise<IChatRoom>
}