import { IChatService } from "@/services/interface/chat.service.interface";
import { IMessageService } from "@/services/interface/message.service.interface";
import { AuthenticatedRequest } from "@/types/auth.type";
import { NextFunction, Response } from "express";

export class ChatController {

    constructor(
        private readonly _chatService:IChatService,
        private readonly _messageService:IMessageService
    ) {}

    getAllChatRooms = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.user?.id) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const chatRooms = await this._chatService.getAllChatRooms(req.user.id);
            res.json(chatRooms);
        } catch (error) {
            next(error);
        }
    }

    searchContacts = async (req: AuthenticatedRequest, res: Response, next: NextFunction) =>{
        try {
            const {searchTerm} = req.body;
            if (!req.user?.id) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const contacts = await this._chatService.searchContacts(req.user.id,searchTerm);
            res.json(contacts);
        } catch (error) {
            next(error);
        }
    }

    getOrCreateChatRoom = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const {participantId} = req.body;
            if (!req.user?.id) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            console.log(participantId,'participantId');
            
            const chatRoom = await this._chatService.getOrCreateChatRoom(req.user.id,participantId);
            console.log(chatRoom,'chatRoom-backend');
            res.json(chatRoom);
        } catch (error) {
            next(error);
        }
    }

    getMessagesOfChatRoom = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const {roomId} = req.params;
            const {page,limit} = req.query;
            if (!req.user?.id) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const messages = await this._messageService.getMessagesOfChatRoom(roomId,req.user.id,Number(page),Number(limit));
            res.json(messages);
        } catch (error) {
            next(error);
        }
    }
}