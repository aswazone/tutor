import { INoteModel } from "@/models/interface/note.model.interface";

export interface INoteService {
    getNotes(userId: string, courseId: string, chapterId: string): Promise<INoteModel[]>;
    addNote(note: INoteModel): Promise<INoteModel>;
    deleteNote(userId: string, noteId: string): Promise<void>;
}