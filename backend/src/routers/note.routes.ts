import { noteController } from "@/dependencies/note.di";
import { authenticateToken } from "@/middlewares/auth.middleware";
import { Router } from "express";

const noteRouter = Router();

noteRouter.post("/",authenticateToken, noteController.addNote);
noteRouter.get("/:courseId/:chapterId",authenticateToken, noteController.getNotes);


export default noteRouter;