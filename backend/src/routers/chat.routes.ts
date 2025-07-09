import { chatController } from "@/dependencies/chat.di";
import { authenticateToken } from "@/middlewares/auth.middleware";
import { Router } from "express";

const chatRouter = Router();

chatRouter.post('/search', authenticateToken, chatController.searchContacts);

export default chatRouter;