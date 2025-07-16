import { chatController } from "@/dependencies/chat.di";
import { authenticateToken } from "@/middlewares/auth.middleware";
import { Router } from "express";

const chatRouter = Router();

chatRouter.post('/search', authenticateToken, chatController.searchContacts);
chatRouter.get('/rooms', authenticateToken, chatController.getAllChatRooms);
chatRouter.get('/rooms/:roomId/messages', authenticateToken, chatController.getMessagesOfChatRoom);
chatRouter.post('/rooms/direct', authenticateToken, chatController.getOrCreateChatRoom);

export default chatRouter;