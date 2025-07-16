import { IChatRoom } from "@/models/implements/chatRoom.model";
import { IUserModel } from "@/models/interface/user.model.interface";

export interface IChatService {
    getAllChatRooms: (userId: string) => Promise<IChatRoom[]>
    searchContacts: (userId: string, searchTerm: string) => Promise<IUserModel[]>
    getOrCreateChatRoom: (userId: string, participantId: string) => Promise<IChatRoom> 
}