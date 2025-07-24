import { INoteModel } from "@/models/interface/note.model.interface";
import { BaseRepository } from "../base.repository";
import { INoteRepository } from "../interface/note.repository.interface";
import { Note } from "@/schema/note.schema";

export class NoteRepository extends BaseRepository<INoteModel> implements INoteRepository {
    constructor() {
        super(Note);
    }

    async getNotes(userId: string, courseId: string, chapterId: string): Promise<INoteModel[]> {
        return this.model.find({ userId, courseId, chapterId }).sort({ timestamp: -1 }).exec();
    }

    async addNote(note: INoteModel): Promise<INoteModel> {
        return this.model.create(note);
    }

    async deleteNote(userId: string, noteId: string): Promise<void> {
        await this.model.deleteOne({ userId, _id: noteId }).exec();
    }
}