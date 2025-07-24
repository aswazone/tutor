import { noteController } from "@/dependencies/note.di";
import { authenticateToken } from "@/middlewares/auth.middleware";
import { Router } from "express";

const noteRouter = Router();

noteRouter.get("/:courseId/:chapterId",authenticateToken, noteController.getNotes);
noteRouter.post("/",authenticateToken, noteController.addNote);
noteRouter.delete("/:noteId",authenticateToken, noteController.deleteNote);


export default noteRouter;