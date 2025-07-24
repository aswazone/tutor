import { INoteService } from "@/services/interface/note.service.interface";
import { AuthenticatedRequest } from "@/types/auth.type";
import { Response } from "express";

export class NoteController {
    constructor(private readonly _noteService: INoteService) {}

    getNotes = async (req: AuthenticatedRequest, res: Response) => {

        if(!req.user?.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const notes = await this._noteService.getNotes(req.user.id, req.params.courseId, req.params.chapterId);
        res.status(200).json(notes);
    };

    addNote = async (req: AuthenticatedRequest, res: Response) => {
        if(!req.user?.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const note = await this._noteService.addNote(req.body);
        res.status(201).json(note);
    }

    deleteNote = async (req: AuthenticatedRequest, res: Response) => {
        if(!req.user?.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const note = await this._noteService.deleteNote(req.user.id, req.params.noteId);
        res.status(200).json(note);
    }
}