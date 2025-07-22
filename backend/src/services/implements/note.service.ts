import { INoteModel } from "@/models/interface/note.model.interface";
import { INoteService } from "../interface/note.service.interface";
import { INoteRepository } from "@/repositories/interface/note.repository.interface";

export class NoteService implements INoteService {
    constructor(private readonly _noteRepository: INoteRepository) {}

    async getNotes(userId: string, courseId: string, chapterId: string): Promise<INoteModel[]> {
        console.log(userId, courseId, chapterId,'getNotes');
        return this._noteRepository.getNotes(userId, courseId, chapterId);
    }

    async addNote(note: INoteModel): Promise<INoteModel> {
        return this._noteRepository.addNote(note);
    }

    async deleteNote(userId: string, noteId: string) {
         this._noteRepository.deleteNote(userId, noteId);
    }
}