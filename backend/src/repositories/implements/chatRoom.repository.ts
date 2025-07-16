import { ChatRoom, IChatRoom } from "@/models/implements/chatRoom.model";
import { BaseRepository } from "../base.repository";
import { IChatRoomRepository } from "../interface/chatRoom.repository.interface";

export class ChatRoomRepository extends BaseRepository<IChatRoom> implements IChatRoomRepository {
    constructor() {
        super(ChatRoom);
    }

    async getAllChatRooms(userId: string): Promise<IChatRoom[]> {
        return await this.model.find({ participants: userId }).populate('participants', 'name userName userEmail profileImage role onlineStatus lastSeen');
    }

    async findChatRoomById(id: string): Promise<IChatRoom | null> {
        return await this.model.findById(id).populate('participants', 'name userName userEmail profileImage role onlineStatus lastSeen');
    }

    async existingChatRoom(userId1: string, userId2: string): Promise<IChatRoom | null> {
        const chatRoom = await this.model.findOne({
            type: 'direct',
            participants: { $all: [userId1, userId2], $size: 2 }
        }).populate('participants', 'name userName userEmail profileImage role onlineStatus lastSeen');
        return chatRoom;
    }

    async createChatRoom(userId1: string, userId2: string): Promise<IChatRoom> {
        const roomName = `${userId1} & ${userId2}`;
        console.log(roomName, 'roomName');
        // return
        const chatRoom = new this.model({
            name: roomName,
            type: 'direct',
            participants: [userId1, userId2],
            createdBy: userId1
        })


        return await chatRoom.save();

    }

}