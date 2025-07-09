import { IChatService } from "@/services/interface/chat.service.interface";
import { AuthenticatedRequest } from "@/types/auth.type";
import { NextFunction, Response } from "express";

export class ChatController {

    constructor(private readonly _chatService:IChatService) {}

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
}